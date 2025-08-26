import express from 'express';
import env from 'dotenv';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';
import passport from 'passport';
import bcrypt from 'bcrypt';
import { Strategy } from 'passport-local';
import session from 'express-session';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';;

initializeApp({
    credential: cert('./service-account-file.json'),
});

const db = getFirestore();

// Firestore refs
const chatsRef = db.collection('chats');

const usersRef = db.collection('users');

const invitesRef = db.collection('invites');

const contactsRef = db.collection('contacts');

const app = express();

const server = createServer(app);

const saltRounds = 12;

env.config();

const port = process.env.SERVER_PORT || 3001;

app.set('json spaces', 10);

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        rolling: true,
        cookie: {
            maxAge: 1000 * 60 * 30 // milisekundy * sekundy * minuty
        }
    })
);

app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());

app.use(express.json());

app.use(passport.initialize());

app.use(passport.session());

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        transports: ['websocket'],
        credentials: true
    }
});

io.on('connection', (socket) => {
    socket.on('join', function(chat) {
        socket.join(chat);
    });

    socket.on('leave', function(chat) {
        socket.leave(chat);
    });

    socket.on('message', async (msg) => {

        const roomSize = io.sockets.adapter.rooms.get(msg.chat).size;
        
        try {

            const chatRef = chatsRef.doc(msg.chat);
            const snapshot = await chatRef.get();
            const data = snapshot.data();
            const messages = data.messages;

            await chatRef.update({
                messages: [...messages, {
                    id: messages.length + 1,
                    sender_id: msg.sender_id,
                    date: msg.date,
                    text: msg.msg_text
                    }]
                });

            await contactsRef.doc(msg.sender_id + '+' + msg.contactID).update({
                lastMessage: {
                    text: msg.msg_text,
                    date: msg.date,
                    sender_id: msg.sender_id,
                    displayed: true
                }
            });

            await contactsRef.doc(msg.contactID + '+' + msg.sender_id).update({
                lastMessage: {
                    text: msg.msg_text,
                    date: msg.date,
                    sender_id: msg.sender_id,
                    displayed: roomSize == 2 ? true : false
                }
            });

           io.to(msg.chat).emit('updateChat');

        } catch (err) {

            console.log(err);

        };
    });

    socket.on('isTyping', (args) => {

        if(args.input > 0) {

            io.to(args.chat).emit('typing', args.id);

        } else {

            io.to(args.chat).emit('stopedTyping', args.id);

        }; 
    });

    socket.on('messageDisplayed', async (msg) => {

        try {

            await contactsRef.doc(msg.user + '+' + msg.contact).update({
                lastMessage: {
                    displayed: true
                }
            })

            io.to(msg.chat).emit('isDisplayed', msg.user);

        } catch (err) {

            console.log(err);

        };
    });
});

app.post('/api/register', async (req, res) => {
    const email = await req.body.email;
    const username = await req.body.username;
    const password = await req.body.password;

    try {

        const emailSnapshot = await usersRef.where('email', '==', email).get();

        const checkEmail = emailSnapshot.docs.map(doc => doc.data());

        const usernameSnapshot = await usersRef.where('username', '==', username).get();

        const checkUsername = usernameSnapshot.docs.map(doc => doc.data());

        if(checkEmail.length > 0) {

            res.json({ err: 'Account with that email already exists'});
            
        } else if (checkUsername.length > 0) {

            res.json({ err: 'Account with that username already exists'});

        } else {

            bcrypt.hash(password, saltRounds, async (err, hash) => {

                if (err) {

                    console.log('Error while hashing password:', err)

                } else {

                    const userID = uuidv4().replace(/-/g, '');

                    await usersRef.doc(userID).set({
                        id: userID,
                        email: email,
                        username: username,
                        password: hash
                    });
                    
                    res.json({success: true});
                };
            });
        };
    } catch (err) {
    console.log(err)
};    
});

app.post('/api/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {

        if(err) {

            return next(err);

        };

        if(!user) {

            return res.status(401).json({message: info.message})

        };

        req.login(user, (err) => {

            if (err) return next(err);

            return res.status(201).json({id: req.user.id, email: req.user.email, username: req.user.username});

        })

    })(req, res, next);

});
 
app.post('/api/logout', (req, res) => {

    req.logout(function (err) {

        if (err) {

            return next(err);

        };

        res.json('User has logged out');

    });
});

app.post('/api/check', (req, res) => {

    if(req.user){

        res.json({user: {id: req.user.id, email: req.user.email, username: req.user.username}});

    } else {

        res.json({user: null});

    };

});

app.post('/api/addContacts', async (req, res) => {

    const username = req.body.searchParams;

        try {

            const snapshot = await usersRef.orderBy('username').startAt(username).endAt(username + '\uf8ff').get();

            const query = snapshot.docs.map(doc => doc.data());

            if(query.length > 0) {

                const result = query.map(user => ({
                    id: user.id,
                    username: user.username
                }));

                res.json({users: result});
                
            } else {

                res.json({users: null});

            };

        } catch(err) {

            console.log(err);

        };
    
});

app.post('/api/sendInvitation', async (req, res) => {
    const currentUser = req.body.sender;
    const target = req.body.receiver;
    const inviteID = `${currentUser}+${target}`
    
    try {

        const ifSentSnapshot = await invitesRef.where('invitation_sender', '==', currentUser).where('invitation_receiver', '==', target).get();

        const ifInvitedSnapshot = await invitesRef.where('invitation_receiver', '==', currentUser).where('invitation_sender', '==', target).get();

        const checkIfSent = ifSentSnapshot.docs.map(doc => doc.data());

        const checkIfInvited = ifInvitedSnapshot.docs.map(doc => doc.data());

        if(checkIfInvited.length > 0 || checkIfSent.length > 0) {

            console.log('User already invited');

        } else {

            await invitesRef.doc(inviteID).set({
                id: inviteID,
                invitation_sender: currentUser,
                sender_username: req.body.senderName,
                invitation_receiver: target,
                receiver_username: req.body.receiverName
            });

        };

    } catch (err) {

        console.log(err);

    };
});

app.post('/api/getInvites', async (req, res) => {
    const currentUser = req.body.currentUser;
    const checkUser = currentUser+'+';

    try {
       
        const receivedInvitesSnapshot = await invitesRef.where('invitation_receiver', '==', currentUser).get();

        const sentInvitesSnapshot = await invitesRef.where('invitation_sender', '==', currentUser).get();

        const receivedInvites = receivedInvitesSnapshot.docs.map(doc => doc.data());

        const sentInvites = sentInvitesSnapshot.docs.map(doc => doc.data());

        const contactsSnapshot = await contactsRef.orderBy('id').startAt(checkUser).endAt(checkUser + '\uf8ff').get();

        const checkIfAlreadyAdded = contactsSnapshot.docs.map(doc => doc.data().userInfo);

        res.json({receivedInvites: receivedInvites, sentInvites: sentInvites, contacts: checkIfAlreadyAdded});

    } catch(err) {

        console.log(err);

    };
});

app.post('/api/cancelInvitation', async (req, res) => {

    const inviteId = req.body.id;

    try {

        await invitesRef.doc(inviteId).delete();
    
        res.json({msg:'Success'})

    } catch (err) {

        console.log(err);

    };
});

app.post('/api/addContact', async (req, res) => {
    const currentUserId = req.body.currentUserId;
    const currentUserName = req.body.currentUserName
    const inviteId = req.body.inviteId;
    const targetName = req.body.targetName;
    const targetId = req.body.targetId;
    const contactId_1 = `${targetId}+${currentUserId}`;
    const contactId_2 = `${currentUserId}+${targetId}`;
    const date = new Date();
    const currentDate = date.toString();

    try {

        await contactsRef.doc(contactId_1).set({
            id: contactId_1,
            userInfo: {
                uid: currentUserId,
                username: currentUserName
            },
            lastMessage: {
                date: currentDate
            }
        });

        await contactsRef.doc(contactId_2).set({
            id: contactId_2,
            userInfo: {
                uid: targetId,
                username: targetName
            },
            lastMessage: {
                date: currentDate
            }
        });

        await invitesRef.doc(inviteId).delete();

        res.json('Done');

    } catch (err) {

        console.log(err);

        res.json('Error');

    };
});

app.post('/api/getChat', async (req, res) => {
    const currentUserID = req.body.currentUserID;
    const contactID = req.body.contactID;
    const chatID_1 = 'chat_'+currentUserID+contactID;
    const chatID_2 = 'chat_'+contactID+currentUserID;

    try {
        const checkIfChatExists_1 = await chatsRef.doc(chatID_1).get();

        const checkIfChatExists_2 = await chatsRef.doc(chatID_2).get();

        if(!checkIfChatExists_1.exists && !checkIfChatExists_2.exists) {
            
            try {

                await chatsRef.doc(chatID_1).set({messages: []});
                
                res.json({chatID: chatID_1, chat: {messages: []}, contact: contactID});

            } catch (err) {
                console.log(err);
            };

            } else {

                try {

                    const chatId = checkIfChatExists_1.exists != false ? chatID_1 : chatID_2;

                    const snapshot = await chatsRef.doc(chatId).get();

                    const chat = snapshot.data();

                    res.json({chatID: chatId, chat: chat, contact: contactID});

                } catch (err) {
                    console.log(err);
                };
            };

    } catch (err) {
        console.log(err);
    };

});

app.post('/api/getContactsChats', async (req, res) => {
    const currentUserID = req.body.currentUser;

    try {

        const snapshot = await contactsRef.orderBy('id').startAt(currentUserID + '+').endAt(currentUserID + '\uf8ff').get();

        const result = snapshot.docs.map(doc => doc.data());

        if(result.length > 0) {

            res.json(result);

        } else {

            res.json({msg: 'No contacts'});

        };

    } catch (err) {

        console.log(err);

    };
});

app.post('/api/getMessages', async (req, res) => {
    const contactID = req.body.contactID;
    const sender_id = req.body.sender_id;

    const chatID_1 = 'chat_'+sender_id+contactID;
    const chatID_2 = 'chat_'+contactID+sender_id;

    try {

        let chatSnapshot = await chatsRef.doc(chatID_1).get();

        if (!chatSnapshot.exists) {

            chatSnapshot = await chatsRef.doc(chatID_2).get();

        };

        if(chatSnapshot.exists) {

            try{

                const chat = chatSnapshot.data();

                res.json(chat.messages);

            } catch (err) {

                console.log(err);

            };
        };
    } catch (err) {

        console.log(err);

    };
});

passport.use(
    'local',
    new Strategy(async function verify(username, password, done) {

        try {

            const snapshot = await usersRef.where('email', '==', username).get();

            const result = snapshot.docs.map(doc => doc.data());

            if(result.length > 0) {

                const user = result[0];

                const storedHasedPassword = user.password;

                bcrypt.compare(password, storedHasedPassword, (err, valid) => {

                    if (err) {

                        console.error('Error comparing passwords:', err);

                        return done(err, false);

                    }   else if(valid) {

                        return done(null, user);

                    } else {

                        return done(null, false, { message: 'Wrong password' });

                    };
                });  

            } else {

                return done(null, false, { message: 'User with that email does not exist' });

            }
        } catch(err) {

            console.log(err);

        };
    })
    );

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

server.listen(port, () => {console.log(`Server listening on port ${port}`)});