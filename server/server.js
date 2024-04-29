import express from 'express';
import env from 'dotenv';
import bodyParser from 'body-parser';
import pg from 'pg';
import { v4 as uuidv4 } from 'uuid';
import passport from 'passport';
import bcrypt from 'bcrypt';
import { Strategy } from 'passport-local';
import session from 'express-session';
 
const app = express();
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

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.json())
app.use(passport.initialize());
app.use(passport.session());

const db = new pg.Client({
    host: process.env.PG_HOST,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    database: process.env.PG_DATABASE
})

db.connect();

app.post('/register', async (req, res) => {
    const email = await req.body.email;
    const username = await req.body.username;
    const password = await req.body.password;

    console.log(email, password)

    try {
        const checkResult = await db.query('SELECT * FROM users WHERE email = $1', [email])
        if(checkResult.rows.length > 0) {
            res.json({ err: 'Account with that email already exists'});
        } else {
            bcrypt.hash(password, saltRounds, async (err, hash) => {
                if (err) {
                    console.log('Error while hashing password:', err)
                } else {
                    const userId = uuidv4();
                    await db.query('INSERT INTO users (email, password, id, username) VALUES ($1, $2, $3, $4)', [email, hash, userId, username]);
                    
                    res.json({success: true});
                }
            });
        }
    } catch (err) {
    console.log(err)
}    
})

app.post('/login', (req, res, next) => {
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
})
 
app.post('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
    })
})

app.post('/check', (req, res) => {
    if(req.user){
        res.json({res: true})
    } else {
        res.json({res: false})
    };
});

app.post('/addContacts', async (req, res) => {
    const username = req.body.searchParams;

        try {
            const result = await db.query(`SELECT id, username FROM users WHERE username LIKE '%'||$1||'%'`, [username]);
            if(result.rows.length > 0) {
                const usersList = result.rows;
                res.json({users: usersList});
            } else {
                res.json({users: null})
            }
        } catch(err) {
            console.log(err);
        };
    
});

app.post('/sendInvitation', async (req, res) => {
    const sender = req.body.sender;
    const receiver = req.body.receiver;
    console.log(req.body)
    
    try {
        await db.query('INSERT INTO invites VALUES ($1, $2)', [sender, receiver]);
        console.log('Invite created');
    } catch (err) {
        console.log(err);
    };
});

app.post('/getReceivedInvites', async (req, res) => {
    const user = req.body.currentUser;

    try {
        const receivedInvites = await db.query('SELECT invitation_sender FROM invites WHERE invitation_receiver = $1', [user]);
        res.json({senders: receivedInvites.rows});
    } catch(err) {
        console.log(err);
    };
});

app.post('/getSentInvites', async (req, res) => {
    const user = req.body.currentUser;

    try {
        const sentInvites = await db.query('SELECT invitation_receiver FROM invites WHERE invitation_sender = $1', [user]);
        if(sentInvites.rows.length > 0) res.json({receivers: sentInvites.rows});
    } catch(err) {
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

app.listen(port, () => {console.log(`Server listening on port ${port}`)})
