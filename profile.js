const express = require('express');
const router = express.Router();

const sqlite3 = require('sqlite3').verbose();

const auth = require('./middleware/authentication');
const perm = require('./middleware/permission');
const {pwCheck}  = require('./auth_functions/auth')
const passwordHash = require('password-hash');

router.get('/', auth,  (req, res) => {
    res.redirect('/profile' + '/' + req.session.user.id)
});

router.get('/:id', auth, perm, (req, res) => {
    let name = req.session.user.name;
    let id = req.session.user.id;
    res.render('profile', { username: name, userid: id})
});


//GET profile posts 
router.get('/:id/posts', auth, perm,  (req, res) => {

    let db = new sqlite3.Database('plant.db', (err) => {
        if (err) { console.error(err.message) };
    });

    let sql = `SELECT * FROM posts WHERE userid=?`;
    db.all(sql, [req.params.id], (err, posts) => {
        if (err) { console.error(err.message) };

        if (posts && posts.length > 0)
            res.render('plantoverview', {posts, username: req.session.user.name});
        else    
            res.redirect('/profile')
    })
    db.close();
});  

router.get('/:id/questions', auth, perm, (req, res) => {

    let db = new sqlite3.Database('plant.db', (err) => {
        if (err) { console.error(err.message) };
    });

    let sql = `SELECT * FROM questions WHERE userid=?`;
    db.all(sql, [req.params.id], (err, questions) => {
        if (err) { console.error(err.message) };

        if (questions && questions.length > 0)
            res.render('question_overview', {questions, username: req.session.user.name, userid: req.session.user.id});
        else    
            res.redirect('/profile')
    })
    db.close();
}); 


router.get('/:id/settings', auth, perm, (req, res) => {
    let name = req.session.user.name;
    let id = req.session.user.id;
    res.render('profile_settings', { username: name, userid: id})
});

//POST change password
router.post('/:id/change', auth, perm,
    (req, res, next) => {
        //new password validation

        if (req.body.pw_new.length < 8) {
            res.render('profile_settings', {username: req.session.user.name,err_msg: "Das Passwort muss mindestens 8 Zeichen lang sein" });
        }
        else if (!pwCheck(req.body.pw_new)) {
            res.render('profile_settings', {username: req.session.user.name, err_msg: "Das Passwort muss mindestens 2 Zahlen, Groß- und Kleinbuchstaben enthalten" });
        }
        else if (req.body.pw_new != req.body.pw_rep) {
            res.render('profile_settings', {username: req.session.user.name, err_msg: "Die Passwörter sind nicht identisch" });
        }
        else {
            next();
        };
    },
    (req, res) => {
        //database access

        db = new sqlite3.Database('plant.db', (err) => {
            if (err) { console.error(err.message) }
        });

        let sql = `SELECT password FROM users WHERE username=?`;
        db.get(sql, [req.session.user.name], (err, row) => {
            if (err) { console.error(err.message) };

            if (!passwordHash.verify(req.body.pw_old, row.pw)) {
                res.render('profile_settings', {username: req.session.user.name, err_msg: "Altes Passwort falsch" });
            }
            else {
                const hash = passwordHash.generate(req.body.pw_new);
                let sql = `UPDATE users SET password=? WHERE username=?`;
                db.run(sql, [hash, req.session.user.name], (err) => {
                    if (err) { console.err(err.message) };
                    res.render('profile', {username: req.session.user.name, scs_msg: 'Passwort erfolgreich geändert' })
                });
            };
        })
        db.close();
    });

//POST delete profile
router.post('/:id/delete', auth, perm,
    (req, res, next) => {
        //database access

        db = new sqlite3.Database('plant.db', (err) => {
            if (err) { console.error(err.message) }
            console.log('Connected to database');
        });

        let sql = `SELECT password FROM users WHERE username=?`;
        db.get(sql, [req.session.user.name], (err, row) => {
            if (err) { console.error(err.message) };

            if (passwordHash.verify(req.body.password, row.pw)) {
                sql = `DELETE FROM users WHERE username=?`;
                db.run(sql, [req.session.user.name], (err) => {
                    if (err) { console.err(err.message) };
                })
                next();
            }
            else {
                res.render('profile', { task: 'delete_user', username: req.session.user.name, err_msg: 'Passwort falsch' })
            }
        });
        db.close(() => console.log('Connection closed'));
    },
    (req, res) => {
        //deleting session 
        delete req.session.user;
        res.redirect('/home');
    }
);



module.exports = router;