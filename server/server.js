import express from 'express';
import env from 'dotenv';
import bodyParser from 'body-parser';
import pg from 'pg';
import { v4 as uuidv4 } from 'uuid';
import passport from 'passport';
import bcrypt from 'bcrypt';
import { Strategy } from 'passport-local';
import session from 'express-session';
import { Server } from 'socket.io';
import { createServer } from 'http';
 
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

const db = new pg.Client({
    host: process.env.PG_HOST,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    database: process.env.PG_DATABASE
});

db.connect();

const io = new Server(server, {

});

io.on('connection', (socket) => {
    console.log("User connected");
});

app.post('/api/register', async (req, res) => {
    const email = await req.body.email;
    const username = await req.body.username;
    const password = await req.body.password;

    try {
        const checkEmail = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        const checkUsername = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        if(checkEmail.rows.length > 0) {
            res.json({ err: 'Account with that email already exists'});
        } else if (checkUsername.rows.length > 0) {
            res.json({ err: 'Account with that username already exists'});
        } else {
            bcrypt.hash(password, saltRounds, async (err, hash) => {
                if (err) {
                    console.log('Error while hashing password:', err)
                } else {
                    const userID = uuidv4().replace(/-/g, '');
                    await db.query('INSERT INTO users (email, password, id, username) VALUES ($1, $2, $3, $4)', [email, hash, userID, username]);
                    
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
        }
        if(!user) {
            return res.status(401).json({message: info.message})
        }
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
    });
});

app.post('/api/check', (req, res) => {
    if(req.user){
        res.json({res: true});
    } else {
        res.json({res: false});
    };
});

app.post('/api/addContacts', async (req, res) => {
    const username = req.body.searchParams;

        try {
            const result = await db.query(`SELECT id, username FROM users WHERE username LIKE '%'||$1||'%'`, [username]);
            if(result.rows.length > 0) {
                const usersList = result.rows;
                res.json({users: usersList});
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
        const checkIfSent = await db.query('SELECT * FROM invites WHERE invitation_sender = $1 AND invitation_receiver = $2', [currentUser, target]);
        const checkIfInvited = await db.query('SELECT * FROM invites WHERE invitation_receiver = $1 AND invitation_sender = $2', [currentUser, target]);
        if(checkIfInvited.rows.length > 0 || checkIfSent.rows.length > 0) {
            console.log('User already invited');
        } else {
            await db.query('INSERT INTO invites VALUES ($1, $2, $3)', [inviteID, currentUser, target]);
            console.log('Invite created');
        };
    } catch (err) {
        console.log(err);
    };
});

app.post('/api/getInvites', async (req, res) => {
    const currentUser = req.body.currentUser;
    const checkUser = currentUser+'+';

    try {
        const receivedInvites = await db.query('SELECT users.id, username FROM users INNER JOIN invites ON invites.invitation_sender = users.id WHERE invites.invitation_receiver = $1', [currentUser]);
        const sentInvites = await db.query('SELECT users.id, username FROM users INNER JOIN invites ON invites.invitation_receiver = users.id WHERE invites.invitation_sender = $1', [currentUser]);
        const checkIfAlreadyAdded = await db.query(`SELECT user_2id AS id FROM contacts WHERE id LIKE '%'||$1||'%'`, [checkUser]);
        res.json({receivedInvites: receivedInvites.rows, sentInvites: sentInvites.rows, contacts: checkIfAlreadyAdded.rows});
    } catch(err) {
        console.log(err);
    };
});

app.post('/api/cancelInvitation', async (req, res) => {
    const currentUser = req.body.currentUser;
    const target = req.body.target;
    const inviteID_1 = `${currentUser}+${target}`;
    const inviteID_2 = `${target}+${currentUser}`;

    try {
        db.query('DELETE FROM invites WHERE id = $1 OR id = $2', [inviteID_1, inviteID_2]);
        res.json({msg:'Success'})
    } catch (err) {
        console.log(err);
    };
});

app.post('/api/addContact', async (req, res) => {
    const currentUserID = req.body.currentUserID;
    const currentUserName = req.body.currentUserName
    const targetID = req.body.targetID;
    const targetName = req.body.targetName;
    const contactID_1 = `${targetID}+${currentUserID}`;
    const contactID_2 = `${currentUserID}+${targetID}`;

    try {
        db.query('INSERT INTO contacts VALUES ($1, $2, $3, $4, $5)', [contactID_1, targetID, currentUserID, targetName, currentUserName]);
        db.query('INSERT INTO contacts VALUES ($1, $2, $3, $4, $5)', [contactID_2, currentUserID, targetID, currentUserName, targetName]);
        db.query('DELETE FROM invites WHERE id = $1', [contactID_1]);
    } catch (err) {
        console.log(err);
    };
});

app.post('/api/searchContacts', async (req, res) => {
    const currentUser = req.body.currentUser;
    const username = req.body.searchParams;

    try {
        const result = await db.query(`SELECT user_2id AS id, user_2_name AS username, last_msg, msg_date FROM contacts WHERE user_1id = $1 AND user_2_name LIKE '%'||$2||'%'`, [currentUser, username]);
        if(result.rows.length > 0) {
            const contactList = result.rows;
            res.json({users: contactList});
        } else {
            res.json({users: null});
        };
    } catch (err) {
        console.log(err);
    };

});

app.post('/api/getChat', async (req, res) => {
    const currentUserID = req.body.currentUserID;
    const contactID = req.body.contactID;
    const chatID_1 = 'chat_'+currentUserID+contactID;
    const chatID_2 = 'chat_'+contactID+currentUserID;

    try {
        const checkIfChatExists = await db.query("SELECT table_name AS name FROM information_schema.tables WHERE table_name = $1 OR table_name = $2", [chatID_1, chatID_2]);
        const result = checkIfChatExists.rows;
        if(result.length == 0) {
            try {
                await db.query(`CREATE TABLE ${chatID_1} (msg_id SERIAL PRIMARY KEY, sender_id varchar(100) NOT NULL, date varchar(30), msg_text varchar(1000) NOT NULL)`);
                const chat = await db.query(`SELECT * FROM ${result[0].name}`);
                res.json({chat: chat.rows});
            } catch (err) {
                console.log(err);
            };        
            } else {
            try {
                const chat = await db.query(`SELECT * FROM ${result[0].name}`);
                res.json({chat: chat.rows});
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
        const result = await db.query('SELECT user_2id AS id, user_2_name AS username, last_msg, msg_date FROM contacts WHERE user_1id = $1', [currentUserID]);
        if(result.rows.length > 0) {
            res.json(result.rows);
        } else {
            res.json({msg: 'No contacts'});
        };
    } catch (err) {
        console.log(err);
    };
});

app.post('/api/sendMessage', async (req, res) => {
    const contactID = req.body.contactID
    const sender_id = req.body.sender_id;
    const date = req.body.date;
    const msg_text = req.body.msg_text;

    const chatID_1 = 'chat_'+sender_id+contactID;
    const chatID_2 = 'chat_'+contactID+sender_id;

    try {
        const checkName = await db.query('SELECT table_name AS name FROM information_schema.tables WHERE table_name = $1 OR table_name = $2', [chatID_1, chatID_2]);
        const tableName = checkName.rows[0].name;
        if(tableName){
            try{
                await db.query(`INSERT INTO ${tableName} (sender_id, date, msg_text) VALUES ($1, $2, $3)`, [sender_id, date, msg_text]);
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
            const result = await db.query('SELECT * FROM users WHERE email = $1', [username])
            if(result.rows.length > 0) {
                const user = result.rows[0];
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
