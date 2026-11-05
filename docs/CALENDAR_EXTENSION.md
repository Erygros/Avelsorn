# Terminbuchung und CRM-Kalender

Der Erweiterungsauftrag vom 05.11.2026 ist unverändert in CALENDAR_EXTENSION_REQUEST.txt erhalten. Er konkretisiert die Terminorganisation innerhalb der vorhandenen Architektur.

## Umsetzung

- Öffentliche Seite /kalender mit Monatsauswahl, Viertelstunden und anschließender Anmeldung oder Registrierung. Die Auswahl bleibt ohne personenbezogene Inhalte im Browser gespeichert und wird nach erfolgreicher Buchung entfernt.
- Erstgespräche erfordern eine bestätigte E-Mail-Adresse, Telefonnummer und bei Minderjährigen die bestehende geprüfte Vertretung. Der Projektfragebogen ist für dieses kostenlose Gespräch keine Voraussetzung. Bestehende Projekt- und Bezahlfunktionen behalten ihre eigenen Prüfungen.
- Kontaktname, E-Mail, Telefonnummer, Unternehmen und optionales Anliegen werden zur Buchung gespeichert. Die Kontaktdaten sind vorab ausgefüllt. Ein zusätzlicher Termin wird erst nach einer protokollierten Adminfreigabe buchbar.
- Zeitfenster werden innerhalb derselben Kalendertransaktion gegen belegte Termine und Sperrintervalle geprüft. Montag bis Freitag gelten standardmäßig 08:30–17:00, am Wochenende 12:00–17:00, jeweils Europe/Berlin. Keine zusätzlichen Vorlauf- oder Pufferzeiten.
- Administration mit Monat, Woche, Tag und Liste, geschütztem Detaildialog, Telefon- und E-Mail-Link, Kundenlink, Notiz und bestehenden Terminaktionen. Zusatzzeiten, Pausen und Urlaubsintervalle ergänzen die Wochen- und Tagesregeln. Änderungen entfernen keine gebuchten Termine.
- Kundenbestätigungen enthalten Datum, Zeit, Dauer, Kundenrufnummer und die zentrale Geschäftsnummer. Die ICS-Einladung verwendet eine stabile UID und erhöhte SEQUENCE bei Änderungen. Ausstehende veraltete Terminmails werden gesperrt, bevor sie versendet werden.
- Erinnerungen werden für 24 Stunden und eine Stunde vor dem Termin eingeplant, sofern die Buchung oder letzte Änderung bereits vor dem jeweiligen Erinnerungszeitpunkt bestand. Bei kurzfristigeren Buchungen ist eine frühere Erinnerung zeitlich nicht möglich. Ein verwalteter Supabase-Cronjob ruft die vorhandene geschützte Aufgabenfunktion minütlich auf.
- Technische Entwicklungsvermerke über der öffentlichen Navigation und vor Rechtstexten entfallen. Inhaltliche Pflichtinformationen und tatsächliche Zugänglichkeitsgrenzen bleiben erkennbar. Kalender, Dialoge und Rechtstexte erhalten Umbrüche und Layouts für schmale Fenster.

## Nachweise

tests/calendar-extension.test.ts prüft Standardzeiten, Sommer-/Winterzeit, Pausen und Zusatzzeiten, parallele Buchungen, Adminfreigaben, Kontaktübernahme, stabile ICS-Aktualisierungen, Eigentumsgrenzen und stornierte Erinnerungen.

tests/output/calendar-api-e2e.json dokumentiert den Ablauf über eine isolierte lokale Testinstanz. Browser- und Produktionsprüfungen werden nach Abschluss in PROGRESS.md ergänzt. Testkonten und Testbuchungen gehören ausschließlich in diese getrennte Testinstanz.

## Betrieb

bin/configure-reminders.ts richtet den bereits bereitgestellten Supabase-Zeitplan mit pg_cron und pg_net ein. Der Aufgabenschlüssel wird in Supabase Vault abgelegt. Die Anwendung bleibt auf Vercel, es wird keine eigene Serverinfrastruktur betrieben. Ein Schedulerlauf und seine HTTP-Antwort sind nach der Einrichtung gesondert zu prüfen.

Der Versandstatus smtp_accepted bestätigt die Annahme durch den SMTP-Server. Er bestätigt keine unabhängige Zustellung in einem bestimmten Posteingang. Noch offene umfassende Prüfungen der ursprünglichen Plattform bleiben in RELEASE_READINESS.md erkennbar.
