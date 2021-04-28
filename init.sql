CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL, 
    pw TEXT NOT NULL
);


INSERT INTO users 
    (name, pw)
VALUES 
    ("Alice", "§$Y45/912v"),
    ("Bob", "secret"),
    ("Carla", "123"),
    ("David", "divaD")
;