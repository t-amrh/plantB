CREATE TABLE IF NOT EXISTS users  (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL, 
    password TEXT NOT NULL, 
    email TEXT NOT NULL,
    prename TEXT,
    surname TEXT,
    img TEXT
);

CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tstamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    userid INTEGER NOT NULL,
    title TEXT NOT NULL,
    deutscherName TEXT NOT NULL, 
    wuchshoehe TEXT,
    wuchstyp TEXT,
    standort TEXT,
    giessen TEXT,
    schwierigkeit TEXT,
    temperatur TEXT,
    erde TEXT,
    umtopfen TEXT,
    duengen TEXT,
    blattfarbe TEXT,
    blattform TEXT,
    bluetezeit TEXT,
    bluetenfarbe TEXT,
    kalkvertraeglichkeit TEXT,
    img TEXT
);

CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tstamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    postid INTEGER NOT NULL,
    userid INTEGER NOT NULL,
    title TEXT,
    txt TEXT NOT NULL,
    img TEXT
);

CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tstamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    userid INTEGER NOT NULL,
    title TEXT NOT NULL, 
    txt TEXT NOT NULL,
    img TEXT
);

CREATE TABLE IF NOT EXISTS answers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tstamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    questionid INTEGER NOT NULL,
    userid INTEGER NOT NULL,
    txt TEXT NOT NULL,
    votes INTEGER NOT NULL DEFAULT 0,
    img TEXT
);