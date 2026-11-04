# Übernahme der Geschäftsangaben

Stand: 03.11.2026. Quelle: ausdrückliche Angaben des Inhabers in dieser Unterhaltung.

## Umsetzung

Die lokalen Haupt-Stammdaten enthalten Namen, Geschäftsanschrift, E-Mail, Telefonnummer, gewünschte Domain und Zahlungsangaben. Der private Import liegt unter data/owner-business-profile.json und wird nicht ins Repository übernommen. Bankdaten werden nicht auf den öffentlichen Informationsseiten ausgegeben. Der Bankname Revolut wurde anhand der BIC-Zuordnung in der offiziellen Zahlungsanbieter-Dokumentation abgeglichen: https://docs.adyen.com/payment-methods/ideal/api-only . Die formale IBAN-Prüfung bestätigt keine Kontoinhaberschaft oder tatsächliche Bankfreigabe.

Die steuerliche Einordnung ist als Eigenerklärung zur Kleinunternehmerregelung dokumentiert. Aktualisierung auf ausdrücklichen Inhaberwunsch vom 03.11.2026: Das aktive Steuernummer-Feld entfällt vollständig. Die frühere pauschale Website-Sperre für Steueridentifikation ist aufgehoben. Rechnungen sind gesondert zu prüfen; Einzelheiten in DEPLOYMENT_PLAN.md. Keine steuerrechtliche Bestätigung behauptet.

Erreichbarkeit und Vorstellung sind zusätzliche optionale Stammdaten, im Adminbereich bearbeitbar. Die Vorstellung übernimmt ausschließlich genannte Beratungsfelder. Online-Auffindbarkeit und Kundengewinnung werden als damaliges Ziel beschrieben; keine erfundenen Kundenstimmen, Umsatzzahlen, Qualifikationen oder Erfolgsquoten. Die allgemeine Behauptung einer amtlich bestätigten freiberuflichen Einordnung wird nicht ergänzt.

Sieben Wochenregeln von 08:00 bis 17:00 Uhr in Europe/Berlin gespeichert. Bestehende datumsspezifische Ausnahmen und Buchungen bleiben erhalten. Die gewünschte öffentliche Basis-URL ist vorgemerkt; die lokale Laufzeit bleibt auf localhost. Keine DNS-Änderung, Veröffentlichung oder SMTP-Einrichtung vorgenommen.

## Sicherheit und Nachweise

bin/apply-owner-profile.ts ist ein ausdrücklich lokales Eigentümerwerkzeug für die gestoppte Hauptdatenbank. Produktions-/Vercel-/Netzwerk- und fremde Datenbankziele sind gesperrt. Felder, IBAN, BIC und Zeiten werden geprüft, vorherige Angaben lokal gesichert und Änderungen samt Kalenderregeln transaktional mit Audit gespeichert. Die Kontrollprüfung verwendet dieselbe String-Normalisierung wie business(), da der lokale JSON-Adapter numerische Skalare bei der Rückgabe normalisieren kann.

- tests/output/owner-profile-import.json: Felder, Prüfziffer, Sicherung, Audit und Hauptdatenbankziel.
- tests/output/owner-profile-readiness.json: Eigentümerangaben vorhanden, aktives Steuernummer-Feld entfernt, sieben gespeicherte Wochenregeln, Produktionsfreigabe weiterhin aus.
- tests/output/owner-profile-http.json: aktualisierte öffentliche Seiten und keine öffentliche Bankdaten-Ausgabe; Kalender-API bleibt ohne Anmeldung gesperrt.
- tests/output/owner-profile-calendar.json: gespeicherte Wochenregeln mit echter Kalenderfunktion in separater Speicher-Datenbank geprüft, keine Testdaten in der Hauptdatenbank.
- Browsernachweise owner-contact-*, owner-about-* und owner-imprint-* in tests/output.

## Offen

GitHub-Repository, Vercel-Projekt, produktive Datenbank-/Datei-/E-Mail-Anbindungen, gegebenenfalls Videodienst, produktive HTTPS-Konfiguration sowie abschließende rechtliche und technische Veröffentlichungsfreigabe. Rechnungsangaben gesondert prüfen. Sicherheits-/Backupschlüssel sind lokal vorhanden. Die Testumgebung auf Port 3011 erhält keine echten Bank-/Inhaberstammdaten aus diesem Import.
