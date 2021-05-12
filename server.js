const {pwCheck} = require('./auth_functions/auth.js');
const sqlite3 = require('sqlite3').verbose();

//starting webserver
const express = require('express');
const app = express();
const port = 3030;

app.listen(port, () => {
    console.log('Starting server, listening on ' + port);
});

//initializing body parser
const bodyParser = require('body-parser'); 
app.use(bodyParser.urlencoded({extended:true}));

//intializing template engine
app.engine('.ejs', require('ejs').__express); 
app.set('view engine', 'ejs');

//initializing session
const session = require('express-session');
app.use(session({
    secret: 'example',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 60*60*1000}
}));

//initializing password hashing
const passwordHash = require('password-hash');

//static files
app.use(express.static(__dirname + '/public'));

//GET requests
app.get('', (req, res) => {
    res.redirect('/home');
});

app.get('/home', (req, res) => {
    if(req.session.loggedIn){
        res.render('index', {username: req.session.loggedIn.username});
    }
    else{
        res.render('index', {});
    }
});

app.get('/login', (req, res) => {
    if (req.session.loggedIn){
        res.redirect('/welcome');
    }
    else{
        res.render('login', {});
    };
});

app.get('/register', (req, res) => {
    res.render('register', {});
});

app.get('/profile', (req, res) => {
    res.render('profile', {task: 'overview', username: req.session.loggedIn.username})
});

app.get('/change_pw', (req, res) => {
    res.render('profile', {task: 'change_pw', username: req.session.loggedIn.username})
});

app.get('/delete_user', (req, res) => {
    res.render('profile', {task: 'delete_user', username: req.session.loggedIn.username})
});

app.get('/welcome', (req, res) => {
    if (req.session.loggedIn){
        res.render('welcome', {username: req.session.loggedIn.username});
    }
    else{
        res.redirect('/login');
    };
});

app.get('/logout', (req,res) => {
    delete req.session.loggedIn;
    res.redirect('/home');
});

app.get('/create_post', (req,res) => {
    res.render('create_post', {});
});

app.get('/create_question', (req,res) => {
    res.render('create_question', {});
});

// login POST handling
app.post('/login', 
    (req, res, next) =>  {
        //database access

        let db = new sqlite3.Database('plant.db', (err) => {
            if (err){console.error(err.message)};
            console.log('Connected to database');
        });

        //const hash = passwordHash.generate(req.body.password);
        let sql = `SELECT pw FROM users WHERE name=?`;
        db.get(sql, [req.body.username], (err,row) => {
            if (err) {console.error(err.message)};


            if (row && (passwordHash.verify(req.body.password, row.pw) ) ){
                next();
            }
            else{
                res.render('login', {err_msg: "Falscher Benutzername oder Passwort", username: req.body.username});
            }
        });
        db.close( () => console.log('Connection closed'));
    },
    (req, res) =>{
        //setting session cookie

        req.session.loggedIn = {username: req.body.username};
        res.redirect('/welcome');
    }
);

// registration POST handling
app.post('/register',  
    (req, res, next) => {
        //getting user input

        req.context = {
            email : req.body.email,
            username : req.body.username,
            password : req.body.password,
            passwordrep : req.body.passwordrep,
        };
        //validating user input

        if (req.context.email == '' || req.context.username == '' || req.context.password == '' || req.context.passwordrep == ''){
            res.render('register', {err_msg: "Bitte fülle alle Felder aus", context: req.context});
        }
        else if (req.context.password.length < 8) {
            res.render('register', {err_msg: "Das Passwort muss mindestens 8 Zeichen lang sein", context: req.context});
        }
        else if (! pwCheck(req.context.password)) {
            res.render('register', {err_msg: "Das Passwort muss mindestens 2 Zahlen, Groß- und Kleinbuchstaben enthalten", context: req.context});
        }
        else if (req.context.password != req.context.passwordrep){
            res.render('register', {err_msg: "Die Passwörter sind nicht identisch", context: req.context});
        }
        else{
            next();
        };
    }, 
    (req, res, next) => {
        //database access

        db = new sqlite3.Database('plant.db', (err) => {
            if (err){console.error(err.message)}
            console.log('Connected to database');
        });

        let sql = `SELECT name FROM users WHERE name=?`;
        db.get(sql, [req.body.username], (err,row) => {
            if (err){console.error(err.message)};

            if (row){
                res.render('register', {err_msg: "Benutzername existiert bereits", context: req.context});
            }
            else{
                const hash = passwordHash.generate(req.context.password);
                let sql = `INSERT INTO users (name, pw) VALUES (?,?)`;
                db.run(sql, [req.context.username, hash], (err) => {
                    if (err){console.err(err.message)};
                });
                next();
            };
        })
        db.close( () => console.log('Connection closed'));
    },
    (req, res) => {
        //setting session cookie

        req.session.loggedIn = {username: req.context.username};
        res.redirect('/welcome');
    }
);


// user administration POST handling 
app.post('/change_pw', 
    (req, res, next) => {
        //new password validation

        if (req.body.pw_new.length < 8) {
            res.render('profile', {task: 'change_pw',err_msg: "Das Passwort muss mindestens 8 Zeichen lang sein"});
        }
        else if (! pwCheck(req.body.pw_new)) {
            res.render('profile', {task: 'change_pw',err_msg: "Das Passwort muss mindestens 2 Zahlen, Groß- und Kleinbuchstaben enthalten"});
        }
        else if (req.body.pw_new != req.body.pw_rep){
            res.render('profile', {task: 'change_pw', err_msg: "Die Passwörter sind nicht identisch"});
        }
        else{
            next();
        };
    },
    (req, res, next) =>{
        //database access

        db = new sqlite3.Database('plant.db', (err) => {
            if (err){console.error(err.message)}
            console.log('Connected to database');
        });

        let sql = `SELECT pw FROM users WHERE name=?`;
        db.get(sql, [req.session.loggedIn.username], (err,row) => {
            if (err){console.error(err.message)};

            if (! passwordHash.verify(req.body.pw_old, row.pw)){
                res.render('profile', {task: 'change_pw', err_msg: "Altes Passwort falsch"});
            }
            else{
                const hash = passwordHash.generate(req.body.pw_new);
                let sql = `UPDATE users SET pw=? WHERE name=?`;
                db.run(sql, [hash, req.session.loggedIn.username], (err) => {
                    if (err){console.err(err.message)};
                });
                next();
            };
        })
        db.close( () => console.log('Connection closed'));
    },
    (req, res) =>{
        res.render('profile', {task: 'overview', username: req.session.loggedIn.username, scs_msg: 'Passwort erfolgreich geändert'})
    }
);


app.post('/delete_user', 
    (req, res, next) => {
        //database access
    
        db = new sqlite3.Database('plant.db', (err) => {
            if (err){console.error(err.message)}
            console.log('Connected to database');
        });

        let sql = `SELECT pw FROM users WHERE name=?`;
        db.get(sql, [req.session.loggedIn.username], (err,row) => {
            if (err){console.error(err.message)};
                      
            if (passwordHash.verify(req.body.password, row.pw)){
                sql = `DELETE FROM users WHERE name=?`;
                db.run(sql, [req.session.loggedIn.username], (err) => {
                    if (err) {console.err(err.message)};
                })
                next();
            }
            else{
                res.render('profile', {task: 'delete_user', username: req.session.loggedIn.username, err_msg: 'Passwort falsch'})
            }
        });
        db.close( () => console.log('Connection closed'));
    },
    (req, res) =>{
        //deleting session 

        delete req.session.loggedIn;
        res.redirect('/home');
    }
);