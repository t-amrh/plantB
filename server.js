const { pwCheck } = require('./auth_functions/auth.js');
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
app.use(bodyParser.urlencoded({ extended: true }));

//intializing template engine
app.engine('.ejs', require('ejs').__express);
app.set('view engine', 'ejs');

//initializing session
const session = require('express-session');
app.use(session({
    secret: 'example',
    resave: true,
    saveUninitialized: true,
    rolling: true,
    cookie: {
        maxAge: 2 * 60 * 60 * 60 * 1000,
        sameSite: 'none',
    }
}));

//initializing password hashing
const passwordHash = require('password-hash');

//initializing file upload
const fileUpload = require('express-fileupload');
app.use(fileUpload());

//static files
app.use(express.static(__dirname + '/public'));


//requests handler

//general

app.get('', (req, res) => {
    res.redirect('/home');
});
app.get('/home', (req, res) => {
    if (req.session.user) {
        res.render('index', { username: req.session.user.name });
    }
    else {
        res.render('index', {});
    }
});


//user administration

//GET login
app.get('/login', (req, res) => {
    if (req.session.user) {
        res.redirect('/welcome');
    }
    else {
        res.render('login', {});
    };
});

//POST login
app.post('/login',
    (req, res, next) => {
        //database access

        let db = new sqlite3.Database('plant.db', (err) => {
            if (err) { console.error(err.message) };
            console.log('Connected to database');
        });

        let sql = `SELECT password, id FROM users WHERE username=?`;
        db.get(sql, [req.body.username], (err, row) => {
            if (err) { console.error(err.message) };

            if (row && (passwordHash.verify(req.body.password, row.password))) {
                req.body.id = row.id;
                next();
            }
            else {
                res.render('login', { err_msg: "Falscher Benutzername oder Passwort", username: req.body.username });
            }
        });
        db.close(() => console.log('Connection closed'));
    },
    (req, res) => {
        //setting session cookie

        req.session.user = {
            name: req.body.username,
            id: req.body.id,
            loggedin: true
        };
        res.redirect('/welcome');
    }
);

//GET register
app.get('/register', (req, res) => {
    res.render('register', {});
});

//POST register
app.post('/register',
    (req, res, next) => {
        //getting user input

        req.context = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            passwordrep: req.body.passwordrep,
        };
        //validating user input

        if (req.context.email == '' || req.context.username == '' || req.context.password == '' || req.context.passwordrep == '') {
            res.render('register', { err_msg: "Bitte fülle alle Felder aus", context: req.context });
        }
        else if (req.context.password.length < 8) {
            res.render('register', { err_msg: "Das Passwort muss mindestens 8 Zeichen lang sein", context: req.context });
        }
        else if (!pwCheck(req.context.password)) {
            res.render('register', { err_msg: "Das Passwort muss mindestens 2 Zahlen, Groß- und Kleinbuchstaben enthalten", context: req.context });
        }
        else if (req.context.password != req.context.passwordrep) {
            res.render('register', { err_msg: "Die Passwörter sind nicht identisch", context: req.context });
        }
        else {
            next();
        };
    },
    (req, res, next) => {
        //database access

        db = new sqlite3.Database('plant.db', (err) => {
            if (err) { console.error(err.message) }
            console.log('Connected to database');
        });

        let sql = `SELECT username FROM users WHERE username=?`;
        db.get(sql, [req.body.username], (err, row) => {
            if (err) { console.error(err.message) };

            if (row) {
                res.render('register', { err_msg: "Benutzername existiert bereits", context: req.context });
            }
            else {
                const hash = passwordHash.generate(req.context.password);
                let sql = `INSERT INTO users (username, password, email) VALUES (?,?,?)`;
                db.run(sql, [req.context.username, hash, req.body.email], (err) => {
                    if (err) { console.error(err.message) };
                    next();
                });

            };
        })
        db.close(() => console.log('Connection closed'));
    },
    (req, res) => {
        //setting session cookie

        db = new sqlite3.Database('plant.db', (err) => {
            if (err) { console.error(err.message) }
            console.log('Connected to database');
        });

        let sql = `SELECT username, id FROM users WHERE username="${req.body.username}"`;
        db.get(sql, (err, row) => {
            if (err) { console.error(err.message) };

            req.session.user = {
                name: row.username,
                id: row.id,
            };
            res.redirect('/welcome');

        });
        db.close(() => console.log('Connection closed'));
    }
);

//GET welcome
app.get('/welcome', (req, res) => {
    if (req.session.user) {
        res.render('welcome', { username: req.session.user.name });
    }
    else {
        res.redirect('/login');
    };
});

//GET logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/home');
});


//posts 

//GET create post
app.get('/plant_create', (req, res) => {
    if (req.session.user)
        res.render('plant_create', {});
    else
        res.render('login', { err_msg: "Melde dich bitte an, wenn du ein PlantSheet erstellen möchtest" });
});

app.post('/plantcreate', (req, res) => {

    let path = '';

    if (req.files) {
        const file = req.files['img'];
        let filename = 'images/users/' + 'req.session.user.id' + '-q-' + Date.now() + '.jpg';
        file.mv(__dirname + '/public/' + filename, (err) => {
            if (err) { console.error(err.message) }
        });
        path = filename;
    };

    let db = new sqlite3.Database('plant.db', (err) => {
        if (err) { console.error(err.message) };
        console.log('Connected to database');
    });

    let sql = `INSERT INTO posts (tstamp, userid, title, deutscherName, wuchshoehe, wuchstyp, standort, giessen, schwierigkeit, temperatur, erde, umtopfen, duengen, blattfarbe, blattform, bluetezeit, bluetenfarbe, kalkvertraeglichkeit, img) VALUES (datetime('now', 'localtime'), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.run(sql, [req.session.user.id, req.body.title, req.body.deutscherName, req.body.wuchshoehe, req.body.wuchstyp, req.body.standort, req.body.giessen, req.body.schwierigkeit, req.body.temperatur, req.body.erde, req.body.umtopfen, req.body.duengen, req.body.blattfarbe, req.body.blattform, req.body.bluetezeit, req.body.bluetenfarbe, req.body.kalkvertraeglichkeit, path], (err) => {
        if (err) console.error(err.message);
    });

    db.close();

    res.redirect("/plant_overview");

});

//GET plant overview
app.get('/plant_overview', (req, res) => {
    let db = new sqlite3.Database('plant.db', (err) => {
        if (err) { console.error(err.message) };
    });

    db.all(`SELECT * FROM posts`, (err, posts) => {
        if (err) { console.error(err.message) };

        res.render('plant_overview', { posts });
    })

    db.close();
});

//GET plant details
app.get('/plant_details/:id', (req, res) => {

    let db = new sqlite3.Database('plant.db', (err) => {
        if (err) { console.error(err.message) };
    });


    db.get(`SELECT * FROM posts WHERE posts.id = ?`, [req.params.id], (err, posts) => {
        if (err) { console.error(err.message) };

        res.render('plant_details', { posts });
    })
    db.close();
});


//answers

//GET answer upvote
app.get('/upvote/:id', (req, res) => {
    let db = new sqlite3.Database('plant.db', (err) => {
        if (err) { console.error(err.message) };
    });

    let sql = `UPDATE answers SET votes = votes + 1 WHERE id=?`;
    db.run(sql, [req.params.id], err => {
        if (err) { console.error(err.message) };
        res.redirect('back');
    })
    db.close();
});
//GET answer downvote
app.get('/downvote/:id', (req, res) => {
    let db = new sqlite3.Database('plant.db', (err) => {
        if (err) { console.error(err.message) };
    });

    let sql = `UPDATE answers SET votes = votes - 1 WHERE id=?`;
    db.run(sql, [req.params.id], err => {
        if (err) { console.error(err.message) };
        res.redirect('back');
    })
    db.close();
});


//POST create answer 
app.post('/create_answer', (req, res) => {

    let db = new sqlite3.Database('plant.db', (err) => {
        if (err) { console.error(err.message) };
    });

    let sql = `INSERT INTO 
                        answers (tstamp, questionid, userid, txt, votes)
                    VALUES
                        ( datetime('now', 'localtime'),?, ?, ?, 0)`;

    db.run(sql, [req.body.questionid, req.session.user.id, req.body.txt], (err) => {
        if (err) { console.error(err.message) };
        res.redirect('/question/' + req.body.questionid)
    })
    db.close();
})

//POST delete answer
app.get('/delete_answer/:id', (req, res) => {
    let db = new sqlite3.Database('plant.db', (err) => {
        if (err) { console.error(err.message) };
    });

    let sql = `DELETE FROM
                    answers
                WHERE
                    id=?`
    db.run(sql, [req.params.id], (err) => {
        if (err) { console.error(err.message) }
        res.redirect('back');
    })
    db.close();
})


const question = require('./question');
app.use('/question', question)

const profile = require('./profile');
app.use('/profile', profile);




