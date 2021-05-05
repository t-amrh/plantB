INSERT INTO users 
    (username, password, email)
VALUES
    ("plantfriend", "abc123AB", "pf@gmail.com")
;

INSERT INTO posts 
    (tstamp, userid, title, deutscherName, wuchshoehe, wuchstyp, standort, giessen, schwierigkeit, temperatur, erde, umtopfen, duengen, blattfarbe, blattform, bluetezeit, bluetenfarbe, kalkvertraeglichkeit)
VALUES
    (datetime('now', 'localtime'), 
    2, 
    "Coffee Arabica", 
    "Bergkaffee, Kaffeestrauch", 
    "80 bis 150 cm", 
    "Strauch", 
    "Heller Standort mit direkter Sonnenbestrahlung",
    "3x/ Woche; im Sommer mehr als im Winter gießen; Boden immer leicht feucht, jedoch keine Staunässe",
    "mittelschwer",
    "wächst bei normaler Raumtemperatur; unter 12 Grad fallen Blätter ab",
    "Blumenerde auf Kompostbasis",
    "im Frühjahr in größere Pflanzentöpfe",
    "alle 14 Tage mit Volldünger",
    "grün",
    "breit lanzettlich, ganzradig",
    "April bis Mai",
    "weiß",
    "kalkempfindlich")
;

INSERT INTO posts 
    (tstamp, userid, title, deutscherName, wuchshoehe, wuchstyp, standort, giessen, schwierigkeit, temperatur, erde, umtopfen, duengen, blattfarbe, blattform, bluetezeit, bluetenfarbe, kalkvertraeglichkeit)
VALUES
    (datetime('now', 'localtime'), 
    2, 
    "Eucalyptus globulus", 
    "Eukalyptus", 
    "1 bis 2m", 
    "Laubgehölz, Kleinbaum", 
    "Heller Standort mit direkter Sonnenbestrahlung",
    "zur Zeit des Hauptwachstums regelmäßig gießen; Erde sollte gut durchfeuchtet sein",
    "mittelschwer",
    "im Sommer: vollsonniger Platz; im Winter: kühler Ort mit Temperaturen um 13 Grad",
    "Substrat aus Komposterde",
    "junge Pflanzen bei Bedarf in größere Töpfe; kann bis zu 2x im Jahr notwendig sein",
    "alle 14 Tage mit Flüssigdünger in normaler Konzentration",
    "blaugrün, silbergrau",
    "länglich, oval",
    "Dezember bis Februar",
    "weiß",
    "kalkempfindlich")
;

