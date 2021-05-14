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
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge: 2 * 60*60*60*1000}
}));

//initializing password hashing
const passwordHash = require('password-hash');

//initializing file upload
const fileUpload = require('express-fileupload');
app.use(fileUpload());

//static files
app.use(express.static(__dirname + '/public'));

//GET requests
app.get('', (req, res) => {
    res.redirect('/home');
});

app.get('/home', (req, res) => {
    if(req.session.user){
        res.render('index', {username: req.session.user.name});
    }
    else{
        res.render('index', {});
    }
});

app.get('/login', (req, res) => {
    if (req.session.user){
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
    if (req.session.user)
        res.render('profile', {task: 'overview', username: req.session.user.name})
});

app.get('/change_pw', (req, res) => {
    res.render('profile', {task: 'change_pw', username: req.session.user.name})
});

app.get('/delete_user', (req, res) => {
    res.render('profile', {task: 'delete_user', username: req.session.user.name})
});

app.get('/welcome', (req, res) => {
    if (req.session.user){
        res.render('welcome', {username: req.session.user.name});
    }
    else{
        res.redirect('/login');
    };
});

app.get('/logout', (req,res) => {
    req.session.destroy();
    res.redirect('/home');
});

app.get('/create_post', (req,res) => {
    if (req.session.user)
        res.render('create_post', {});
    else 
        res.redirect('/home');
});

app.get('/create_question', (req,res) => {
    if (req.session.user)
        res.render('create_question', {});
    else
        res.redirect('/home');
});


// create_question POST handling


app.post('/create_question', (req, res) => {

    let path = '/public/images/users/' ; //+ req.session.user.id + "/"
    let filename = req.session.user.id + '-q-' + Date.now() + '.jpg';

    const file = req.files["img"];
    file.mv(__dirname + path + filename, (err) => {
        if (err) {console.error(err.message)}
    });


    let db = new sqlite3.Database('test.db', (err) => {
        if (err){console.error(err.message)};
        console.log('Connected to database');
    });

    let sql = `INSERT INTO questions (tstamp, userid, title, txt, img) VALUES (datetime('now', 'localtime'), ?, ?, ?, ?)`;
    db.run(sql, [req.session.user.id, req.body.title, req.body.txt, path + filename], (err) => {
        if (err) console.error(err.message); 
  

    });

    db.close();
    res.send("upload: " + file.name);
    //res.redirect("/create_question");

})

// login POST handling
app.post('/login', 
    (req, res, next) =>  {
        //database access

        let db = new sqlite3.Database('plant.db', (err) => {
            if (err){console.error(err.message)};
            console.log('Connected to database');
        });

        let sql = `SELECT pw, id FROM users WHERE name=?`;
        db.get(sql, [req.body.username], (err,row) => {
            if (err) {console.error(err.message)};


            if (row && (passwordHash.verify(req.body.password, row.pw) ) ){
                req.body.id = row.id;
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

        req.session.user = {
            name: req.body.username,
            id: req.body.id,
            loggedin: true
        };
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
                    if (err){console.error(err.message)};
                    next();
                });
                
            };
        })
        db.close( () => console.log('Connection closed'));
    },
    (req, res) => {
        //setting session cookie

        db = new sqlite3.Database('plant.db', (err) => {
            if (err){console.error(err.message)}
            console.log('Connected to database');
        });

        let sql = `SELECT name, id FROM users WHERE name="${req.body.username}"`;
        db.get(sql, (err, row) => {
            if (err) {console.error(err.message)};
            
                req.session.user = {
                    name: row.name,
                    id: row.id,
                    loggedin: true,
                };
                res.redirect('/welcome');
            
        });
        db.close( () => console.log('Connection closed'));
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
        db.get(sql, [req.session.user.name], (err,row) => {
            if (err){console.error(err.message)};

            if (! passwordHash.verify(req.body.pw_old, row.pw)){
                res.render('profile', {task: 'change_pw', err_msg: "Altes Passwort falsch"});
            }
            else{
                const hash = passwordHash.generate(req.body.pw_new);
                let sql = `UPDATE users SET pw=? WHERE name=?`;
                db.run(sql, [hash, req.session.user.name], (err) => {
                    if (err){console.err(err.message)};
                });
                next();
            };
        })
        db.close( () => console.log('Connection closed'));
    },
    (req, res) =>{
        res.render('profile', {task: 'overview', username: req.session.user.name, scs_msg: 'Passwort erfolgreich geändert'})
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
        db.get(sql, [req.session.user.name], (err,row) => {
            if (err){console.error(err.message)};
                      
            if (passwordHash.verify(req.body.password, row.pw)){
                sql = `DELETE FROM users WHERE name=?`;
                db.run(sql, [req.session.user.name], (err) => {
                    if (err) {console.err(err.message)};
                })
                next();
            }
            else{
                res.render('profile', {task: 'delete_user', username: req.session.user.name, err_msg: 'Passwort falsch'})
            }
        });
        db.close( () => console.log('Connection closed'));
    },
    (req, res) =>{
        //deleting session 

        delete req.session.user;
        res.redirect('/home');
    }
);