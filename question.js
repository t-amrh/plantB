var express = require('express');
var router = express.Router();

var auth = require('./middleware/authentication');
const sqlite3 = require('sqlite3').verbose();

router.get('/', (req,res) => {
    let db = new sqlite3.Database('plant.db', (err) => {
        if (err) { console.error(err.message) };
    });

    let sql = `SELECT 
                    users.username AS name, users.id AS userid, title, txt, tstamp, questions.img AS img, questions.id AS id
                FROM 
                    users, questions 
                WHERE 
                    users.id = questions.userid`;
    db.all(sql, (err, questions) => {
        if (err) { console.error(err.message) };
        let userid = req.session.user ? req.session.user.id : null;
        
        if (questions && questions.length > 0) {
            res.render('question_overview', {questions, userid})
        }
        else {
            res.redirect('/question/create')
        }
    })
    db.close();
});

router.get('/create', auth, (req, res) => {
    res.render('question_create', {});
});

router.post('/create', auth, (req, res) => {

    let path = '';

    if (req.files){
        const file = req.files['img'];
        let filename = 'images/users/' + 'req.session.user.id' + '-q-' + Date.now() + '.jpg' ;
        file.mv(__dirname + '/public/' + filename, (err) => {
            if (err) { console.error(err.message) }
        });
        path = filename;
    };

    let db = new sqlite3.Database('plant.db', (err) => {
        if (err) { console.error(err.message) };
        console.log('Connected to database');
    });

    let sql = `INSERT INTO questions (tstamp, userid, title, txt, img) VALUES (datetime('now', 'localtime'), ?, ?, ?, ?)`;
    db.run(sql, [req.session.user.id, req.body.title, req.body.txt, path], (err) => {
        if (err) console.error(err.message);
        res.redirect("/question");
    });
    db.close();
});

router.get('/:id', (req, res) => {
     let db = new sqlite3.Database('plant.db', (err) => {
        if (err) { console.error(err.message) };
    });

    let sql = `SELECT 
                users.username AS name, users.id AS userid, title, txt, tstamp, questions.img AS img, questions.id AS id
            FROM 
                users, questions 
            WHERE 
                users.id = questions.userid
            AND
                questions.id=?`;

    db.get(sql, [req.params.id], (err, question) => {
        if (err) { console.error(err.message) };

        if (question) {

            let sql = `SELECT 
                            tstamp, txt, votes, users.username AS name, users.id AS userid, answers.id as id
                        FROM 
                            answers, users 
                        WHERE 
                            questionid=?
                        AND 
                            users.id=answers.userid`;
            db.all(sql, [question.id], (err, answers) => {
                if (err) { console.error(err.message) };

                let userid = req.session.user ? req.session.user.id : null;

                if (answers && answers.length > 0) {
                    res.render('question_detail', { question, answers, userid})
                }
                else {
                    res.render('question_detail', { question, userid});
                }
            });
        }
        else {
            res.redirect('/question');
        }
    })
    db.close();
});

router.get('/:id/edit', auth, (req, res) => {

    let db = new sqlite3.Database('plant.db', (err) => {
        if (err) { console.error(err.message) };
    });

    let sql = `SELECT * FROM questions WHERE id=?`;
    db.get(sql, [req.params.id], (err, row) => {
        if (err) console.error(err.message);

        let context = {
            id: row.id,
            title: row.title,
            txt: row.txt,
            img: row.img
        }
        res.render('question_edit', {context});
    })
    db.close();
});

router.post('/:id/edit', auth, (req, res) =>{

    let db = new sqlite3.Database('plant.db', err => {
        if (err) console.error(err.message)
    });

    let sql = `UPDATE questions SET title=?, txt=? WHERE id=?`;
    db.run(sql, [req.body.title, req.body.txt, req.params.id], err => {
        if (err) console.error(err.message);
        res.redirect('/question/' + req.params.id);
    });
    db.close();
});

router.get('/:id/delete', auth, (req, res) => {
    let db = new sqlite3.Database('plant.db', (err) => {
        if (err) { console.error(err.message) };
    });

    let sql = `DELETE FROM questions WHERE id=?`;
    db.run(sql, [req.params.id], err => {
        if (err) console.error(err.message);

        sql = `DELETE FROM answers WHERE questionid=?`;
        db.run(sql, [req.params.id], err => {
            if (err) console.error(err.message);
            res.redirect('/question');
        });
    });
    db.close();
});


// router.get('/create', auth, (req, res) => {
//     res.send('Create a q')
// });
// router.get('/:id',(req, res) => {
//     res.send('q ' + req.params.id + ' details')
// });

// router.get('/:id/edit', auth, (req, res) => {
//     res.send('edit question ' + req.params.id)
// })

// router.get('/:id/delete',auth, (req, res) => {
//     res.send('delete question ' + req.params.id)
// })

module.exports = router;