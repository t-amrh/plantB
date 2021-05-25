INSERT INTO users
    (username, password, email)
VALUES
    ("plantfriend", "abc123AB", "pf@gmail.com"),
    ("Alice", "§$Y45/912v", ""),
    ("Bob", "secret", ""),
    ("Carla", "123", ""),
    ("David", "divaD", "")
;

INSERT INTO posts
    (tstamp, userid, title, deutscherName, wuchshoehe, wuchstyp, standort, giessen, schwierigkeit, temperatur, erde, umtopfen, duengen, blattfarbe, blattform, bluetezeit, bluetenfarbe, kalkvertraeglichkeit, img)
VALUES
    (datetime('now', 'localtime'),
    2,
    "Coffee Arabica",
    "Bergkaffee, Kaffeestrauch",
    "80 bis 150 cm",
    "Strauch",
    "Heller Standort mit direkter Sonnenbestrahlung",
    "3x/ Woche; im Sommer mehr als im Winter gießen; Boden immer leicht feucht, jedoch keine Staunässe",
    "advanced",
    "wächst bei normaler Raumtemperatur; unter 12 Grad fallen Blätter ab",
    "Blumenerde auf Kompostbasis",
    "im Frühjahr in größere Pflanzentöpfe",
    "alle 14 Tage mit Volldünger",
    "grün",
    "breit lanzettlich, ganzradig",
    "April bis Mai",
    "weiß",
    "kalkempfindlich",
    "/images/Coffee Arabica.jpg")
;

INSERT INTO posts
    (tstamp, userid, title, deutscherName, wuchshoehe, wuchstyp, standort, giessen, schwierigkeit, temperatur, erde, umtopfen, duengen, blattfarbe, blattform, bluetezeit, bluetenfarbe, kalkvertraeglichkeit, img)
VALUES
    (datetime('now', 'localtime'),
    2,
    "Eucalyptus globulus",
    "Eukalyptus",
    "1 bis 2m",
    "Laubgehölz, Kleinbaum",
    "Heller Standort mit direkter Sonnenbestrahlung",
    "zur Zeit des Hauptwachstums regelmäßig gießen; Erde sollte gut durchfeuchtet sein",
    "advanced",
    "im Sommer: vollsonniger Platz; im Winter: kühler Ort mit Temperaturen um 13 Grad",
    "Substrat aus Komposterde",
    "junge Pflanzen bei Bedarf in größere Töpfe; kann bis zu 2x im Jahr notwendig sein",
    "alle 14 Tage mit Flüssigdünger in normaler Konzentration",
    "blaugrün, silbergrau",
    "länglich, oval",
    "Dezember bis Februar",
    "weiß",
    "kalkempfindlich",
    "/images/Eucalyptus globulus.jpg")
;

INSERT INTO posts
    (tstamp, userid, title, deutscherName, wuchshoehe, wuchstyp, standort, giessen, schwierigkeit, temperatur, erde, umtopfen, duengen, blattfarbe, blattform, bluetezeit, bluetenfarbe, kalkvertraeglichkeit, img)
VALUES
    (datetime('now', 'localtime'),
    2,
    "Crassula ovata/ argentea",
    "Geldbaum",
    "50 bis 100cm",
    "Sukkulente",
    "Sonnebestrahlung, aber halbschattig",
    "zur Hauptzeit mäßig gießen; Topfballen aber nur leicht feucht, da viel Wasser in Blättern gespeichert ist",
    "advanced",
    "Gedeihen zwischen 20 und 27 Grad; Winter: um die 10 Grad, nicht unter 5 Grad",
    "Substrat aus nährstoffarmer Erde mineralischen Bestandteilen",
    "alle 3 bis 4 Jahre in größere Töpfe umpflanzen",
    "alle 4 Wochen eine schwache Lösung aus Kakteendünger",
    "grün",
    "oval",
    "Februar bis April",
    "rosa, weiß",
    "kalkresistent",
    "/images/Crassula ovata.jpg")
;

INSERT INTO posts
    (tstamp, userid, title, deutscherName, wuchshoehe, wuchstyp, standort, giessen, schwierigkeit, temperatur, erde, umtopfen, duengen, blattfarbe, blattform, bluetezeit, bluetenfarbe, kalkvertraeglichkeit, img)
VALUES
    (datetime('now', 'localtime'),
    2,
    "Tilsandia cyanen",
    "Blaue Tilsandie",
    "20 bis 40cm",
    "Bromeliengewächs",
    "heller, halbschattiger Standort",
    "mit weichem, nicht zu kaltem Wasser 3x /Woche besprühen",
    "easy",
    "nicht unter 15-18 Grad",
    "Blumenerde",
    "nur nötig, wenn sie ihrer Grundlage entwachsen ist",
    "unter Sprühwasser Blattdünger mischen (Frühling bis Herbstanfang)",
    "blaugrün",
    "dünne, lange Blätter",
    "Februar bis Oktober",
    "violett-blau (fächerförmig)",
    "kalkempfindlich",
    "/images/Tilsandia cyanen.jpg")
;

INSERT INTO posts
    (tstamp, userid, title, deutscherName, wuchshoehe, wuchstyp, standort, giessen, schwierigkeit, temperatur, erde, umtopfen, duengen, blattfarbe, blattform, bluetezeit, bluetenfarbe, kalkvertraeglichkeit, img)
VALUES
    (datetime('now', 'localtime'),
    2,
    "Monstera deliciosa",
    "Fensterblatt",
    "bis zu 2,5 m",
    "Aronstabgewächse",
    "balbschattig, keine direkte Sonneneinstrahlung",
    "Regelmäßig gießen, aber nicht zuviel; Staunässe vermeiden",
    "easy",
    "Zimmertemperaturen im Sommer um die 21 Grad; Winter: zwischen 16 und 18 Grad",
    "Mischung aus 2/3 Erde auf Kompostbasis, 1/3 grober Lauberde",
    "jährlich umtopfen",
    "April-August: alle 14 Tage mit flüssigem Grünpflanzendünger",
    "grün",
    "herzförmig ausgebildet und niedrig gelappt",
    "Juni bis September",
    "keine Blüten",
    "kalkresistent",
    "/images/Monstera deliciosa.jpg")
;

INSERT INTO posts
    (tstamp, userid, title, deutscherName, wuchshoehe, wuchstyp, standort, giessen, schwierigkeit, temperatur, erde, umtopfen, duengen, blattfarbe, blattform, bluetezeit, bluetenfarbe, kalkvertraeglichkeit, img)
VALUES
    (datetime('now', 'localtime'),
    2,
    "Spathiphyllum",
    "Einblatt",
    "ca. 30 bis 80cm (je nach Sorte auch höher)",
    "Aronstabgewächs",
    "halbschattiger bis schattiger Standort",
    "Substrat sollte stets feucht sein, Ballen nie ganz ausgetrocknet",
    "advanced",
    "Raumtemperatur von 18 bis 25 Grad; im Winter: nicht kühler als 16 Grad",
    "Blumenerde mit hohem Humusanteil",
    "alle ein bis zwei Jahre",
    "während der Blütezeit wöchentlich mit niedrig dosiertem Flüssigdünger für Blühpflanzen",
    "sattes Grün",
    "oval",
    "Juni bis September",
    "weiß",
    "kalkempfindlich",
    "/images/Spathiphyllum.jpg")
;

INSERT INTO posts
    (tstamp, userid, title, deutscherName, wuchshoehe, wuchstyp, standort, giessen, schwierigkeit, temperatur, erde, umtopfen, duengen, blattfarbe, blattform, bluetezeit, bluetenfarbe, kalkvertraeglichkeit, img)
VALUES
    (datetime('now', 'localtime'),
    2,
    "Mertensia virginica",
    "Virginisches Blauglöckchen",
    "10 bis 30cm",
    "Raublattgewächse",
    "halbschattig mit keiner direkte Sonneneinstrahlung",
    "gleichmäßig gießen; feuchter, aber nicht staunasser Boden",
    "easy",
    "normale Zimmertemperaturen; in der Ruheperiode: zwischen 13-15 Grad",
    "Blumenerde auf Torf- oder Kompostbasis",
    "im Frühling in größere Gefäße umtopfen",
    "alle 14 Tage mit handelsüblichem Flüssigdünger; während Ruhezeit nicht düngen",
    "blaugrün",
    "elliptisch bis oval",
    "Februar bis November; Blüten zeigen sich im April und Mai",
    "violett-blau/ rosa (Trompetenblüten)",
    "kalkresistent",
    "/images/Mertensia virginica.jpg")
;

INSERT INTO posts
    (tstamp, userid, title, deutscherName, wuchshoehe, wuchstyp, standort, giessen, schwierigkeit, temperatur, erde, umtopfen, duengen, blattfarbe, blattform, bluetezeit, bluetenfarbe, kalkvertraeglichkeit, img)
VALUES
    (datetime('now', 'localtime'),
    2,
    "Zamioculas zamiifolia",
    "Glücksfeder",
    "30 bis 90 cm",
    "Aronstabgewächse",
    "halbschattiger Standort mit Schut vor praller Mittagssonne",
    "Erde eher zu trocken als zu feucht halten; regelmäßiges Besprühen der Pflanze mit Wasser",
    "easy",
    "Zimmertemperaturen zwischen 18 und 25 Grad; Ruheperiode: nicht unter 16 Grad",
    "Blumenerde auf Kompostbasis",
    "bei Bedarf im zeitigen Frühjahr umtopfen; nicht jedes Jahr notwendig",
    "im Frühjahr alle 4-5 Wochen mit einem Flüssigdünger düngen",
    "grün (dunkler und heller je nach Lichteinfluss)",
    "kleinere, ovale Blätter",
    "April bis Septembe",
    "keine Blüten",
    "kaltresistent",
    "/images/Zamioculas zamiifolia.jpg")
;

INSERT INTO posts
    (tstamp, userid, title, deutscherName, wuchshoehe, wuchstyp, standort, giessen, schwierigkeit, temperatur, erde, umtopfen, duengen, blattfarbe, blattform, bluetezeit, bluetenfarbe, kalkvertraeglichkeit, img)
VALUES
    (datetime('now', 'localtime'),
    2,
    "Chamaedorea",
    "Bergpalme",
    "bis zu 2 m",
    "Palmengewächse",
    "hell bis halbschattig ohne direkte Sonneneinstrahlung",
    "feucht halten und nicht austrocknen lassen",
    "easy",
    "im Sommer: um die 20 Grad; Winter: 12-15 Grad",
    "leicht saure Erde; Substrat sollte durchlässig und leicht alkalisch sein",
    "im Frühling umtopfen, sobald der Topfballen dicht durchwurzelt ist",
    "Jungpflanzen sollten nicht gedüngt werden; sonst alle 2-3 Wochen mit Flüssigdünger",
    "leichtes Grün",
    "überhängende Wedel/Fiedern",
    "Frühling bis Herst",
    "keine Blüten",
    "kalkempfindlich",
    "/images/Chamaedorea.jpg")
;
