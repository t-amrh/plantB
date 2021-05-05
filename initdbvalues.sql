INSERT INTO users 
    (username, password, email)
VALUES
    ("plantfriend", "abc123AB", "pf@gmail.com")
;

INSERT INTO posts 
    (tstamp, userid, title, txt)
VALUES
    (datetime('now', 'localtime'), 2, "blah", "blahblah")
;


