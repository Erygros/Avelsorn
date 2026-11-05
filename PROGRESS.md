# Fortschritt und vollständige Aufgabenmatrix

Stand: 27.10.2026. Ziel aktiv. **Nicht fertig und nicht produktionsfreigegeben.** Der neueste Prüfnachweis steht am Ende; ältere Etappen dokumentieren ihren damaligen Stand.

## Verbindliche Architekturkorrektur

Next.js, TypeScript, React und Tailwind CSS mit serverseitigem Backend. PostgreSQL/Drizzle, lokal persistentes PGlite. Spätere GitHub-/Vercel-Übergabe ist vorbereitet; es wird keine eigene Hosting- oder Serverinfrastruktur erstellt. Checkdomain ausschließlich Domain/E-Mail. PHP/Laravel ist aus dem aktiven Projekt entfernt und nur im ignorierten .tools-Archiv erhalten. Originalinhalte bleiben in docs/MASTER_SPEC_ORIGINAL.md. MASTER_SPEC.md enthält die vorrangige Korrektur.

## Nachweislich ausgeführte Prüfungen

- Lokale Migrationen erfolgreich angewendet; 36 Datenbanktabellen mit Versionierung.
- Erster Next.js-Produktionsbuild erfolgreich (noch vor den jüngsten Ergänzungen; erneuter Build erforderlich).
- TypeScript-Prüfung erfolgreich, zuletzt vor den jüngsten Ergänzungen; erneute Prüfung vorgesehen.
- ESLint erfolgreich nach Beseitigung von Hook-, Link- und Importfehlern.
- **22 automatisierte Tests bestanden**: Preise; Scrypt; authentifizierte Verschlüsselung; Eigentumsprüfung; Origin/CSRF-Abwehr; Inhaltsbereinigung; Registrierung/Duplikate/Einmaltoken; Minderjährigensperre; OTP-Versuche; Berliner Sommer-/Winterzeit; parallele Buchung; ICS/Verschiebung/fremder Zugriff; 48-Stunden-Reservierung; Zahlungsidempotenz; Paketaktivierung/28 Tage/Verlängerung; einmalige Angebotsannahme; Zeitvalidierung/Überschneidung/Kontingent; echte PDF-Erzeugung und Dokumentbestand; Upload-Dateityp; Reservierungsablauf ohne doppelte Nachricht; verschlüsseltes Backup mit isolierter Datenbankwiederherstellung.
- Echte Browserausführung der Startseite bei Desktop und 390 px; Screenshots in tests/output.
- Erster axe-Check: Kontrastfehler an Ablaufnummern und Footer sowie fehlendes Landmark am Vorschauhinweis. Korrigiert, abschließende Nachprüfung noch ausstehend.
- npm audit nach gezieltem Entwicklungsabhängigkeits-Override: 0 bekannte Schwachstellen beim damaligen Lauf; nach weiteren Änderungen erneut prüfen.
- Keine SMTP-Zustellung, externe Datenbank, externer Speicher oder echte Videoverbindung als erfolgreich getestet behauptet.

## Implementierter Umfang

Öffentliche Seiten, sieben Leistungsbereiche, Preise, Ablauf, Zielgruppen, Erstgespräch, Kontakt, Kontozugänge und strukturierte rechtliche Entwicklungsfassungen. Austauschbares Vektorbranding, lokale Schriften, responsives helles Design. Kunden- und Adminportal mit Datenbankabfragen. Konten, Sessions, Verifizierung, Reset, OTP, datensparsame Guardian-Erklärungen mit manueller Prüfung. Onboarding mit Zwischenspeicherung und interessenbezogenen Fragen. Kalender, Buchungen, ICS, Bestellungen, geprüfte Zahlungen, Pakete, Projekte, Aufgabenanfragen, Timer/manuelle Zeit, Freigaben, Chat, Dateien, Angebote, Rechnungen/PDF, E-Mail-Outbox und Vorschau, CMS/visueller Editor, fünf eigenständige Artikel, Einwilligung, Datenschutzanfragen/Export, Widerrufseingang, Audit, Hintergrundaufgaben, verschlüsselter Backup-/Restore-Code.

Diese Aufzählung beschreibt vorhandenen Code und ersetzt keine vollständige Abnahme aller Einzelanforderungen.

## Aufgabenmatrix

| Abschnitt | Bereich | Status | Implementierung / bisherige Nachweise |
|---|---|---|---|
| 1 | PROJEKTZIEL UND GRUNDREGELN | In Arbeit | Vollständige Abnahme offen |
| 2 | VERBINDLICHER ARBEITSMODUS | In Arbeit | Vollständige Abnahme offen |
| 3 | GESCHÄFTSMODELL | In Arbeit | Vollständige Abnahme offen |
| 4 | PREISMODELL | In Arbeit | src/server/config.ts; tests/platform.test.ts: verbindliche Cent-Preise |
| 5 | ÖFFENTLICHE WEBSITE | In Arbeit | src/app/[...slug]/page.tsx; src/components/home.tsx; öffentliche Routen implementiert, Gesamtprüfung offen |
| 6 | DESIGN UND MARKENIDENTITÄT | In Arbeit | src/app/globals.css; BRAND_GUIDELINES.md; src/app/icon.svg; Screenshots tests/output |
| 7 | RESPONSIVES NUTZERERLEBNIS | In Arbeit | Vollständige Abnahme offen |
| 8 | KUNDENREGISTRIERUNG | In Arbeit | src/server/auth.ts; src/server/security.ts; Registrierung, Token und OTP getestet |
| 9 | VERPFLICHTENDES ONBOARDING | In Arbeit | src/components/onboarding-form.tsx; API onboarding |
| 10 | TERMINBUCHUNG UND KALENDER | In Arbeit | src/server/calendar.ts; Race-Condition-, Zeitzonen- und ICS-Tests |
| 11 | TELEFON- UND VIDEOBERATUNG | In Arbeit | src/server/video.ts; src/components/meeting.tsx; lokale und konfigurierbare Adapter, Verbindungstest offen |
| 12 | KUNDEN-DASHBOARD | In Arbeit | src/components/portal-page.tsx; Kundenbereiche mit echter Datenbank |
| 13 | PROJEKTVERWALTUNG | In Arbeit | src/server/projects.ts; Projekt- und Aufgabenaktionen |
| 14 | DETAILLIERTE ZEITERFASSUNG | In Arbeit | src/server/projects.ts; negative/überlappende Zeit und Kontingentüberschreitung getestet |
| 15 | EIGENER KUNDENCHAT | In Arbeit | API message; Portalchat mit authentifiziertem Polling |
| 16 | DATEIVERWALTUNG | In Arbeit | src/server/files.ts; private Speicherung, Dateitypprüfung und Berechtigungsprüfung |
| 17 | PROJEKTFREIGABEN | In Arbeit | src/server/projects.ts; versionierte Freigaben und Antworten |
| 18 | ADMIN-DASHBOARD | In Arbeit | src/components/portal-page.tsx; Adminbereiche, OTP vor Zugriff |
| 19 | PAKETVERWALTUNG | In Arbeit | src/server/finance.ts; 28 Tage, 12 Stunden und Verlängerung ohne Überschneidung getestet |
| 20 | BANKÜBERWEISUNG | In Arbeit | src/server/finance.ts; manuell geprüfter Bankeingang, Idempotenz und Teilbeträge |
| 21 | RECHNUNGSSYSTEM | In Arbeit | src/server/pdf.ts; echte PDFs, Snapshot und Unveränderlichkeit nach Profiländerung getestet |
| 22 | ANGEBOTSSYSTEM | In Arbeit | src/server/finance.ts; Angebotsnummer, sieben Tage und einmalige Annahme getestet |
| 23 | AUTOMATISCHE ZAHLUNGSERINNERUNGEN | In Arbeit | src/server/tasks.ts; fällige Rechnungen und separate Reservierungsfreigabe |
| 24 | E-MAIL-SYSTEM | In Arbeit | src/server/mail.ts; verschlüsselte Outbox, SMTP-Adapter und Vorschau; echter SMTP-Test offen |
| 25 | BLOG UND CONTENT-MANAGEMENT | In Arbeit | src/components/cms-editor.tsx; src/content/articles.ts; fünf eigenständige Artikel |
| 26 | SEO | In Arbeit | robots.ts; sitemap.ts; Metadata und OpenGraph; Canonicals/Strukturdaten noch zu vervollständigen |
| 27 | ADMIN-BENACHRICHTIGUNGEN | In Arbeit | src/server/events.ts; Portalbenachrichtigungen |
| 28 | DATENSCHUTZ UND COOKIES | In Arbeit | Einwilligungs- und Datenschutzmodelle, Export und Anfragen; vollständige Löschbearbeitung offen |
| 29 | RECHTLICHE SEITEN | In Arbeit | src/content/legal.ts; Widerrufsformular mit Eingangsreferenz; rechtliche Endprüfung offen |
| 30 | BARRIEREFREIHEIT | In Arbeit | Semantik, Fokus, Responsive; erster axe-Check fand Kontrastfehler, korrigiert, Nachprüfung offen |
| 31 | KENNZEICHNUNG KI-GENERIERTER MEDIEN | In Arbeit | media-Modell vorhanden; vollständige Medienverwaltung offen |
| 32 | SICHERHEIT | In Arbeit | security.ts; Originprüfung, Scrypt, AES-GCM, Eigentumsprüfung, Rate-Limit, CSP; zusätzliche Sicherheitsprüfungen offen |
| 33 | HOSTING UND TECHNISCHE ARCHITEKTUR | In Arbeit | Next.js 16.4.3, React 19.3, TypeScript/Tailwind, PostgreSQL/PGlite; erfolgreicher erster Build |
| 34 | AUTOMATISCHE HINTERGRUNDAUFGABEN | In Arbeit | src/server/tasks.ts; Reservierungsablauf und wiederholte Ausführung ohne doppelte Nachrichten getestet |
| 35 | BACKUPS UND WIEDERHERSTELLUNG | In Arbeit | src/server/backup.ts; verschlüsselter Export und Restore in isolierte leere Datenbank getestet |
| 36 | ZENTRALE SYSTEMKONFIGURATION | In Arbeit | src/server/settings.ts; zentrale öffentliche Werte, Geheimnisse nur Umgebungsvariablen |
| 37 | ERSTEINRICHTUNG | In Arbeit | Einrichtung mit lokalem Schlüssel, einmaliger Administrator; geschäftliche Einstellungen getrennt |
| 38 | TESTS UND ABNAHME | In Arbeit | 22 automatisierte Tests bestanden, TypeScript-Prüfung und ESLint bestanden; weitere Abnahme offen |
| 39 | VISUELLE QUALITÄTSSICHERUNG | In Arbeit | Desktop-/Mobile-Screenshots, axe-Prüfung; vollständige visuelle Gesamtprüfung offen |
| 40 | PRODUKTIONSVORBEREITUNG | In Arbeit | DEPLOYMENT.md; lokale Einrichtung und Build; vollständige Übergabeanleitung offen |
| 41 | VERÖFFENTLICHUNG UND LIVEBETRIEB | In Arbeit | Vollständige Abnahme offen |
| 42 | VERBINDLICHE FERTIGSTELLUNGSKRITERIEN | In Arbeit | Vollständige Abnahme offen |
| 43 | ABSCHLIESSENDE ANWEISUNG AN CODEX | In Arbeit | Vollständige Abnahme offen |

## Konkret noch offen / nächste Etappen

- Gesamtprüfung der öffentlichen Routen, Kunden- und Adminabläufe im Browser; Mobil/Tablet/Desktop, Tastatur, Formulare und Layout.
- Neueste Ergänzungen erneut typprüfen, bauen und testen.
- Rechnungsentwürfe bearbeiten, unbezahlte Rechnungen finalisieren, Korrektur-/Stornobelege, Rückzahlungen und rechtssichere Historie vollständig ausarbeiten.
- Angebotsbearbeitung und vollständige Editor-/Vorschauabnahme.
- Paketgestützte Buchung durchgängig in der Oberfläche; Zeitkorrekturen, Pausensegmente und Behandlung ausgeschöpfter laufender Timer verbessern.
- Minderjährigenvertretung für einzelne zahlungspflichtige Verträge präzisieren; globale Zustimmung allein ist kein vollständiger Nachweis jedes Vertrags.
- Admin: Wochenverfügbarkeit und manuelle Kundenbuchung, Detailfilter und durchgängige Bearbeitungsaktionen ergänzen.
- Chat-/Mail-Anhänge und Suche/Lesestatus vollständig durchgängig prüfen. SMTP-Fehlerfälle und unklaren Übergabestatus kontrolliert behandeln.
- Medienherkunftsverwaltung, Inhaltsvorschau, SEO-Canonicals und sachlich passende strukturierte Daten vervollständigen.
- Statistik nur nach Einwilligung tatsächlich erfassen; vollständige Datenschutzbearbeitung mit Aufbewahrungsprüfung und Löschprozessen.
- Video mit zwei Browsern und virtuellen Medien lokal prüfen, Wiederbeitritt/Signalisierung robuster machen; Providervertrag und spätere reale Netze als externe Integration offen.
- Tägliche Backupfunktion, 30-Tage-Aufbewahrung, Fehlerbenachrichtigung und CLI-Wiederherstellungsanleitung vervollständigen.
- Produktionssperre auch bei fehlenden Geschäftsangaben und Fehlkonfigurationen vollständig prüfen.
- Rechtsquellen für elektronische Widerrufsfunktion und konkrete Vertragstexte nachprüfen; endgültige Unternehmensdaten und tatsächliche Provider ergänzen.
- PDF-Zugänglichkeit gesondert prüfen; keine WCAG-/PDF-UA-Zertifizierung behaupten.
- Sicherheits-, Abnahme-, Installations- und Updateanleitungen vollständig finalisieren.

## Externe Konfigurationsabhängigkeiten

Marke, Domain/Basis-URL, verbindliche Anbieteranschrift und Steuerdaten, Bankverbindung, Checkdomain-Postfach/SMTP, ausgewählter PostgreSQL-Netzwerkdienst und privater Speicher, gegebenenfalls Echtzeit-/Videodienste sowie ausdrückliche Veröffentlichungsfreigabe. Keine dieser Abhängigkeiten rechtfertigt einen Entwicklungsstopp.

## Weitere verifizierte Etappe (26.10.2026)

- 26 automatisierte Tests bestanden. Ergänzt: Rechnungsausstellung vor Zahlung mit unveränderter Nummer, Korrektur-/Stornobeleg und Rückzahlung, Timerüberlauf ohne zusätzliche Paketbelastung, einmalig verbrauchte konkrete Minderjährigenvertretung, manipulierte Videotoken.
- 70 echte HTTP-Prüfungen erfolgreich in einer separaten lokalen QA-Datenbank, einschließlich aller wesentlichen öffentlichen/Kunden-/Adminbereiche, gesperrter Adminaktion eines Kunden, Origin-Abwehr und direkter fremder Datei-ID.
- Echte Browserabläufe: Registrierung, E-Mail-Bestätigung aus tatsächlicher lokaler Outbox, Kundenanmeldung, Onboarding-Zwischenspeicherung samt erneutem Laden, Abschluss, Profilpflege und bestätigte Terminbuchung. Adminanmeldung mit tatsächlichem E-Mail-OTP ebenfalls im Browser erfolgreich.
- Lokales WebRTC mit zwei getrennten Browsern und künstlichen Testmedien verbunden. Beide Seiten empfingen aktive Audio-/Videospuren; Videobilder 640×480, readyState 4. Mikrofon-/Kamerasteuerung und Verlassen geprüft. Nachweise: tests/output/video-local.json, video-controls.json und video-connected.png. Kein Test über unterschiedliche reale Netze; keine produktive Videoanbindung behauptet.
- Automatisierter axe-Nachtest der Startseite: 0 Verletzungen, 1 manuell zu prüfender Kontrastpunkt über der Vektorgrafik. Hintergrund dieses Texts inzwischen explizit gesetzt; erneute Prüfung vorgesehen.
- Aktuelle Ergänzungen: Raumgenerationen und Erneuerung kurzlebiger Videozugänge, menschliche Datums-/Geldeingaben, Datum/Slot-Auswahl bei Terminverschiebung, Medienherkunft/öffentliche Grafikfreigabe, konfigurierbare private Speicheradapter, Mailvorschau mit Anhängen, tägliche Backup-/Aufbewahrungsfunktionen und lokale Restore-CLI. Diese Änderungen werden noch gesondert abgenommen.
- Datei-Uploadlimit bewusst auf 4 MB begrenzt, damit der Multipart-Anwendungsweg für eine spätere Vercel-Ausführung geeignet bleibt. Buchhaltungsbelege und öffentliche Medien werden von Projektdatei-Löschregeln getrennt.
- Öffentliche Produktionsfreigabe bleibt gesperrt. Keine Server/Hostingdienste erstellt, bestellt oder eingerichtet. Testkonten liegen ausschließlich in der isolierten QA-Datenbank unter data/qa-*/; keine Testkonten in der lokalen Hauptdatenbank.

### Nächste konkrete Arbeiten

1. Neueste Migrationen/Build anwenden und Video-Wiederbeitritt samt Token-Erneuerung erneut prüfen.
2. Übrige Fachdetails (Zeitkorrektur, genaue Rechnungs-/Vertragsstornierung, Filter und Bearbeitungsaktionen) vervollständigen.
3. CMS, Mailvorschau/Anhänge, Dateien, Dokumente/PDFs und bezahlte Bestellabläufe im Browser prüfen.
4. Datenschutzbearbeitung, Einwilligung/Statistik, Sicherheitsgrenzen, Backups/Restore und Produktionssperren weiter prüfen.
5. Vollständige Abnahmematrix, Handbücher und Freigabecheckliste mit aktuellen Nachweisen finalisieren.

## Aktueller Stand der lokalen Übergabe

- Next.js-Anwendung läuft auf http://localhost:3001 und die Startseite wurde mit HTTP 200 geprüft. Lokale Vorschau im Codex-Browser angefordert.
- Aktueller Schemaumfang: 37 Tabellen. Hauptdatenbank vor Start geprüft: 0 Konten, 5 echte redaktionelle Artikel, 0 ausgehende E-Mails. Keine QA-Testkonten in der Hauptdatenbank.
- Geschützter HTTP-Aufgabenlauf über `npm run tasks` erfolgreich; SMTP ist nicht konfiguriert, daher wurden 0 E-Mails an SMTP übergeben.
- Tägliche Sicherungsfunktion erzeugte eine tatsächlich verschlüsselte lokale Sicherung. Restore-CLI stellte diese in einen neuen isolierten Zielordner wieder her: 36 gesicherte Tabellen, 0 private Dateien in dieser Hauptdatenbank. Der automatisierte Restore-Test mit privaten Testdateien besteht zusätzlich.
- Gleichzeitiger zweiter lokaler Datenbankschreiber wurde durch die Prozesssperre nachweislich blockiert; Nachweis tests/output/local-lock.json. Hintergrundaufgaben greifen deshalb standardmäßig per geschütztem HTTP auf den laufenden Anwendungsprozess zu.
- Typprüfung, 26 Tests, Lint und Produktionsbuild erfolgreich durchlaufen. Kleine anschließende Bereinigungen werden im nächsten vollständigen Lauf erneut geprüft; keine Gesamtfreigabe abgeleitet.
- Wiederbeitritt/Generationen und Token-Erneuerung für Video sind neu implementiert, aber gegenüber dem bereits erfolgreichen ursprünglichen Zwei-Browser-Test noch erneut zu prüfen.
- Offene Fachfälle bleiben ausdrücklich offen: Zeitkorrekturen mit Audit; genaue Trennung von Rechnungsstorno und Vertrags-/Paketstorno; vollständige Mail-/CMS-/Anhangsprüfung im Browser; Filter/Bearbeitung und Datenschutz-Aufbewahrung im Gesamtprozess; vollständige Abnahmematrix und externe Integrationsprüfungen.
- Wichtiger nächster Konsistenztest: Ein Stornobeleg setzt derzeit den zugehörigen Bestellstatus auf storniert. Die Auswirkungen auf bereits aktive Pakete und künftig gebuchte Pakettermine müssen fachlich eindeutig umgesetzt und getestet werden, bevor dieser Ablauf abgenommen wird.

Das Entwicklungsziel bleibt aktiv. Das Gesamtprojekt ist weiterhin weder fertig noch produktionsfreigegeben.

Abschließender Nachtrag dieser Etappe: Die aktuelle Startseite erreicht im automatisierten axe-Lauf 41 bestandene Prüfungen, 0 Verletzungen und 0 unvollständige Prüfungen. Die zuletzt bereinigten React-/Metadaten-Ausdrücke bestehen Typprüfung und ESLint ohne gemeldete Fehler. Die lokale Preisseite wurde erneut mit HTTP 200 geprüft. Die Gesamtplattform und ihre offenen Fachfälle bleiben in Entwicklung; dies ist keine vollständige WCAG- oder Produktionszertifizierung.

## Fachkorrekturen und Browserabnahme vom 27.10.2026

- Rechnungskorrektur und Vertragsstornierung getrennt umgesetzt. Reine Rechnungskorrekturen erhalten Bestellung, Paket und Termine, erzeugen Stornobeleg und Ersatzentwurf und lösen keinen zweiten Zahlungseingang aus. Ersatzentwürfe dürfen angenommene Bestellungen nicht verteuern.
- Vollständige Bestellstornierung als eigene Adminaktion, auch für unbezahlte Entwürfe. Zugehörige Pakete sowie laufende/kommende Termine werden gemeinsam storniert; Kalendersequenz und Benachrichtigungen werden aktualisiert. Rückzahlungen bleiben gesonderte bestätigte Bankvorgänge.
- Zeitkorrektur mit Begründung, Vorher-/Nachher-Audit, Revisionsprüfung gegen veraltete Formulare, atomarer Kontingentkorrektur und Berücksichtigung bestätigter Beratungstermine. Timerpausen bleiben bei Textkorrekturen erhalten; freie Pausenzeiten sind manuell buchbar, echte Überschneidungen werden abgewiesen.
- Migration 0005 ergänzt Paket-Stornierungszeitpunkt und Zeitnachweis-Revision und wurde auf die lokale Hauptdatenbank angewendet.
- 33 automatisierte Tests bestanden, darunter sieben neue Tests für Rechnungs-/Vertragsstorno, Entwurfsstorno, Rückzahlung, veraltete Zeitkorrekturen, Kundenzuordnung, gebundene Kontingente, Timerpausen und Timerabschluss nach Stornierung. Tests: tests/ledger-corrections.test.ts und tests/platform.test.ts.
- Aktueller Build mit 70 echten HTTP-Seiten-/Sicherheitsprüfungen in isolierter QA-Datenbank bestanden. Zusätzliche Browserabnahme: Paketkauf, Adminbestätigung des Test-Bankeingangs, reine Rechnungskorrektur, Bearbeitung und Finalisierung der bereits bezahlten Ersatzrechnung, manuelle Zeitbuchung, Korrektur von 60 auf 30 anzurechnende Sekunden, Vertragsstorno und getrennte Test-Rückzahlung.
- HTTP-Nachprüfung vor und nach Rückzahlung: Paket storniert, Zeitnachweis weiterhin 60 Sekunden tatsächlich/30 Sekunden belastet, Revision 1, zwei Rechnungen plus zwei Stornobelege, gesamte Belegsumme null. Vor der gesonderten Rückzahlung noch 9900 Cent Zahlungseingang; anschließend null. Nachweise: tests/output/ledger-cancelled.json und ledger-refunded.json.
- Kunde sieht den korrigierten Zeitnachweis; der interne Administrationskommentar erscheint nicht in der normalen Kunden-Zeitansicht. Keine abschließende Datenschutzbewertung des Datenexports daraus abgeleitet.
- axe-Prüfung der geöffneten Admin-Zeitkorrektur: 46 bestanden, 0 Verletzungen, 0 unvollständige Prüfungen. Kunden-Zeitansicht: 40 bestanden, 0 Verletzungen, 0 unvollständige Prüfungen. Keine Gesamt-WCAG-Zertifizierung.
- Browsernachweise: tests/output/invoice-corrected.png, time-corrected.png und order-refunded.png. Alle Testkonten, Test-Zahlungen und Test-Bestellungen ausschließlich in data/qa-*/. Keine reale Überweisung und kein externer Versand.
- Im Browser gefundene kleinere Oberflächenfehler korrigiert: Rechnungsentwurf zeigt Rechnungseditor und führt nach Speicherung zu Rechnungen zurück; Belegstatus auf Deutsch; stornierte Pakete zeigen erfasste Zeit und keine weitere Nutzung statt vermeintlich verfügbarer Reststunden. Nachtest dieses letzten Oberflächenstands folgt auf den abschließenden Build.

Weiter offen: Video-Wiederbeitritt/Token-Erneuerung erneut mit zwei Browsern, vollständige Mail-/CMS-/Anhangsprüfung, Dokument-PDFs visuell und zugänglich prüfen, Filter/Bearbeitungen vervollständigen, Datenschutz-/Aufbewahrungsprozesse prüfen, vollständige Anforderungsabnahme. Ziel bleibt aktiv; keine Produktionsfreigabe oder Infrastrukturbereitstellung.

Abschließender Prüfnachtrag (27.10.2026): `npm run check` vollständig erfolgreich (TypeScript, ESLint ohne Meldungen, 33 Tests, Produktionsbuild). Die korrigierte Oberfläche wurde am neuen Build nachgeprüft: Rechnungseditor zeigt die passende Überschrift und führt nach Speichern zu /admin/rechnungen; Stornobelege heißen „Ausgestellt“; stornierte Pakete zeigen Stornierungszeitpunkt und keine weitere Nutzbarkeit. Ein zusätzlicher unbezahlter QA-Entwurf wurde dafür im Browser angelegt; die vorherigen Ledger-Nachweise beziehen sich ausdrücklich auf den vorher abgeschlossenen Ein-Bestellungs-Ablauf. Der aktuelle HTTP-Lauf umfasst 72 bestandene Prüfungen, jetzt einschließlich HTTP-403 für Kunden bei Bestellstorno und Zeitkorrektur. Die lokale Hauptanwendung läuft mit dem aktuellen Build auf http://localhost:3001; Hauptdatenbank vor Start: 0 Konten, 5 Artikel, 0 Outbox-Einträge. Testdaten verbleiben ausschließlich in der separaten QA-Datenbank. Video- und PDF-Nachprüfungen bleiben offen.

## Nutzeränderung: Erstgespräch, Hero und Bildprompts (27.10.2026)
- /erstgespraech: Hauptbutton und Terminlink stehen in einem eigenen vertikalen Aktionsbereich mit 22 px Abstand und mindestens 44 px hoher Linkfläche. Auf Desktop und bei 390 px visuell geprüft; mobiler Dokumentbereich 390 px ohne horizontalen Überlauf.
- Startseiten-Hero persönlich und konkret neu formuliert: Ich berate Dich und arbeite an Deinem Projekt mit. Begleittext nennt Gründung, Websites und wiederkehrende Aufgaben; Open-Graph-Titelgrafik konsistent angepasst. Mobile Schriftgröße angepasst und erneut im Browser geprüft.
- Sechs ausführliche, einzeln verwendbare Bildprompts mit Motiven, Bildformaten und Stilvorgaben in docs/BILDPROMPTS.md: digitale Prozesse, Website, Social Media, Gründung, Selbstständigkeit und Hero. Bilder nicht im Rahmen dieser Änderung generiert.
- ESLint und Produktionsbuild einschließlich TypeScript erfolgreich. Desktop-/Mobilnachweise: tests/output/intro-spacing-desktop.png, intro-spacing-mobile.png, hero-copy-desktop.png, hero-copy-mobile.png. Gesamtplattform weiterhin in Entwicklung.


## Nutzerkorrektur: Hero-Aufbau statt Sloganwechsel (27.10.2026)
- Versal-Eyebrow, dreizeilige Großüberschrift mit festen Umbrüchen, Kursivbetonung und zusätzliche Werbezeilen aus dem Hero entfernt. Kompakte, sachliche Überschrift in Sans-Serif: Beratung und Projektarbeit. Fließtext nennt konkrete Tätigkeiten und den Ablauf der Zusammenarbeit; ein einzelner Link führt zum Erstgespräch.
- Überholte responsive Großschriftregeln entfernt; Open-Graph-Text und Hero-Bildprompt konsistent angepasst.
- ESLint und Produktionsbuild einschließlich Typprüfung erfolgreich. Aktuellen Build auf localhost:3001 gestartet; Browser bestätigt neue Überschrift, keine Hero-Eyebrow, keine manuellen Titelumbrüche/Kursivbetonung und keinen horizontalen Überlauf bei 390 px. Nachweise: tests/output/hero-sachlich-desktop.png und hero-sachlich-mobile.png.


## Sechs Nutzerbilder eingebunden (27.10.2026)
- Hero.jpg ersetzt die vollständige Hero-Liniengrafik. Die fünf thematischen JPEGs sind ihren Blog-Slugs in src/content/editorial-images.ts zugeordnet und erscheinen in Blogübersicht und jeweiligem Artikel. Alte Platzhalterkomponente, SVG-Markup und zugehörige CSS-Regeln entfernt.
- Gemeinsame EditorialPhoto-Komponente mit Next/Image, statischen Bildabmessungen, responsiven sizes/srcset, Blur-Ladezustand, Qualität 85 und verzögertem Laden nachfolgender Bilder. Alle Motive bleiben im ursprünglichen Seitenverhältnis ohne Beschnitt oder Verzerrung sichtbar; Alternativtexte und sichtbare KI-Kennzeichnung ergänzt. Originaldateien im Projektstamm unverändert erhalten.
- TypeScript, ESLint und Produktionsbuild erfolgreich. Neuer Build läuft auf localhost:3001.
- Browserprüfung: Hero bei 1440/390/320 px, Blog bei 1440/768/390/320 px und Artikel bei 390 px. Alle erfassten Bilder geladen, Seitenverhältnisse unverzerrt, kein horizontaler Überlauf, keine alten Grafikplatzhalter. HTTP-Prüfung sämtlicher fünf Artikel: 200, jeweils ein Bild und KI-Kennzeichnung.
- Optimierte Auslieferung im Desktop-Prüflauf: etwa 16–31 KB pro Bild statt 2.5–3 MB pro Original. Retina-/größere Bildvarianten werden anhand von srcset angefordert; die Originalauflösung bleibt verfügbar.
- Automatischer axe-Lauf Blog: 38 bestanden, 0 Verletzungen, 0 unvollständige Prüfungen. Startseite bei 320 px: 40 bestanden, 0 Verletzungen, 1 manuell nachzuprüfender Punkt. Keine vollständige WCAG-Abnahme daraus abgeleitet.
- Nachweise: tests/output/images-*.json und images-*.png; tests/output/a11y-blog-images.json und a11y-home-images.json. Gesamtplattform bleibt in Entwicklung.


## Markennamensentwicklung (27.10.2026)
- Zwölf neue Kandidaten entwickelt und in einer ersten Webprüfung verglichen. Avelsorn als ruhiger, professioneller Namensvorschlag weiterverfolgt; keine bestehende identische Nutzung in exakten Websuchen gefunden.
- Tatsächliche Browserrecherche DPMAregister (inklusive ergänzender Platzhaltersuche), TMview und WIPO Global Brand Database ohne Treffer für Avelsorn. TMview-/WIPO-Funktionskontrollen mit Nexora lieferten 216 beziehungsweise 162 Treffer.
- Direkte RDAP-Abfragen von avelsorn.de und avelsorn.com: jeweils HTTP 404; registrierte Kontroll-Domains jeweils 200. Keine Domain registriert oder reserviert.
- Rechercheprotokoll mit verworfenen Kandidaten, Quellen und Nachweisen: docs/MARKENNAMEN_RECHERCHE.md. Website noch nicht umbenannt. Weltweite Nichtexistenz und vollständige rechtliche Benutzungsfreiheit bleiben unverifiziert; deshalb keine absolute Zielerreichung behauptet.


## Abschluss der Namensvorprüfung nach Nutzerklarstellung (27.10.2026)
- Nutzer hat den erreichbaren Abschlussmaßstab ausdrücklich akzeptiert: dokumentierte Vorprüfung von öffentlicher Nutzung, Markenregistern und Domains; Antwort: Ja, diese Vorprüfung genügt.
- Gespeicherte DPMAregister-/TMview-/WIPO-Ergebnisse, Funktionskontrollen, Domain-Registry-Antworten und Screenshots erneut geprüft. Keine identische Nutzung von Avelsorn in den durchgeführten Prüfungen gefunden. Abweichende Schreibweise Avelson Construction separat im Protokoll dokumentiert; keine rechtliche Ähnlichkeitsfreigabe behauptet.
- docs/MARKENNAMEN_RECHERCHE.md enthält das Abschlussaudit. Namensentwicklung und vereinbarte Vorprüfung abgeschlossen. Keine Domain gekauft und Website nicht automatisch umbenannt. Der Abschluss betrifft ausschließlich das Namensziel, nicht die vollständige Entwicklung oder Produktionsfreigabe der Plattform.

## Avelsorn-Markenblatt eingebunden (28.10.2026)
- Auf ausdrücklichen Nutzerauftrag Avelsorn_Markenblatt.pdf vollständig auf beiden Seiten visuell und technisch geprüft. Original unverändert erhalten. Die PDF enthält entgegen ihrem Vektor-Hinweis hochauflösende Rasterbilder mit Transparenzmasken, keine Logo-Vektorpfade oder angehängten Originaldateien. Diese Originalbilder direkt extrahiert; Herkunft und SHA-256 in public/brand/source.json, wiederholbarer Export in bin/extract-brand-assets.py (nur Autorentool, keine neue Serverabhängigkeit).
- Zentrale Identität in src/content/brand.ts. Alte Linienfigur, SVG-Favicon, Platzhaltername, automatische Unterzeile und alter Titelzusatz entfernt. Website-Kopf/-Fuß, Authentifizierung und beide Portale verwenden die gemeinsame Brand-Komponente. Business-Konfiguration liefert dieselbe Marke; abweichende alte Werte können das Branding nicht übersteuern. Markenname im Admin-Stammdatenformular nicht mehr änderbar; übrige Unternehmensdaten bleiben konfigurierbar.
- Farbwerte und Arial/system-ui gemäß Markenblatt. Wortmarke unverzerrt, sichtbare Kontur rund 160 CSS-px plus Schutzraum. Mobiler Footer einspaltig, damit das Logo nicht unter die Mindestgröße schrumpft. Nutzerfotos und Inhalte erhalten.
- favicon.ico enthält die drei gelieferten 16-/32-/48-Pixel-Bilder pixelgleich; icon.png und Apple-Icon ergänzt. Link-Vorschaubild zeigt die bereitgestellte Wortmarke ohne erfundene Unterzeile.
- Neue Rechnungen/Angebote betten dasselbe Logo ein; Rechnungskopf visuell mit ausreichendem Abstand geprüft. Bereits gespeicherte finalisierte Belege bleiben unverändert. E-Mail-Vorlage verwendet dasselbe Logo; Entwurf lädt lokal, SMTP-Versand erhält eine CID-Anlage. Lokale E-Mail-Ansicht geprüft, keine E-Mail versendet und kein externer Versand als eingerichtet behauptet.
- Prüfung: TypeScript, ESLint und Produktionsbuild bestanden. Nach abschließender Layoutkorrektur alle 33 vorhandenen Funktionstests erneut bestanden. Produktions-File-Tracing enthält das PNG für den Dokument-/Mail-Dienst.
- Read-only HTTP-Prüfung von 31 öffentlichen, Leistungs-, Blog-, Rechts- und Zugangsseiten: jeweils 200, Avelsorn im Titel, neues Logo, keine alten Markenplatzhalter und keine Fehlerseite. Bericht tests/output/avelsorn-pages.json; Prüfskript bin/verify-brand-pages.mjs.
- Browsernachweise: Startseite Desktop/390 px, Erstgespräch 390 px, Blog 320 px einschließlich Footer; Adminportal Desktop/920/390 px und Kundenportal Desktop ausschließlich mit isolierten QA-Daten. Erfasste Logos geladen, unverzerrt, im Viewport; kein horizontaler Seitenüberlauf. tests/inspect-brand.js und tests/output/avelsorn-*.json/png.
- axe-Blogprüfung bei 320 px: 38 bestanden, 0 Verstöße, 0 unvollständige Prüfungen. Keine vollständige WCAG- oder Produktionsfreigabe daraus abgeleitet. MASTER_SPEC.md, ARCHITECTURE.md und BRAND_GUIDELINES.md aktualisiert.

## Zielgruppenreihe und fünf Unterseiten (28.10.2026)
- Nutzerfreigabe der vorgeschlagenen typografischen Reihe umgesetzt: „Für wen ich arbeite“, größere Zielgruppenbegriffe, feine obere Linien, dezente Pfeile und salbeigrüner Hover-/Fokuszustand. Avelsorn-Schrift und -Farben beibehalten. Desktop fünf Spalten, Tablet drei, mobil fünf Zeilen mit großzügigen anklickbaren Flächen.
- Eigenständige Seiten /zielgruppen/unternehmen, /zielgruppen/selbststaendige, /zielgruppen/gruender, /zielgruppen/freelancer und /zielgruppen/creator. Gemeinsame Darstellung mit je eigenen Inhalten: konkrete Aufgaben, ausdrücklich mögliche Projektbeispiele, Vorbereitung fürs Erstgespräch, unterschiedliche Fragen und passende Leistungslinks. Keine erfundenen Referenzen oder Erfolgsaussagen.
- /zielgruppen als verlinkte Übersicht überarbeitet. Startseite, Footer, mobiles Menü und Brotkrümelnavigation führen in die Seitenstruktur. Verwandte Zielgruppen sind gegenseitig verlinkt.
- Je eigener Titel, Beschreibung, kanonische URL, Open-Graph-Daten und BreadcrumbList. Fünf Pfade in der Sitemap-Funktion vorgemerkt; lokale noindex-/Veröffentlichungssperre bleibt bestehen. Dokumentation samt Google-Primärquellen und Suchabsichten: docs/ZIELGRUPPEN_SEITEN.md. Requirement 5.11 um konkrete Nachweise ergänzt, keine vollständige Produktabnahme behauptet.
- TypeScript, ESLint und Produktionsbuild erfolgreich. HTTP-Prüfung bin/verify-audiences.ts: fünf Seiten 200, je eine H1, eigene Metadaten, korrekte Canonicals/Breadcrumbs, Links von Startseite/Übersicht und alle geprüften internen Ziele erreichbar; unbekannte Zielgruppe 404. Zusätzlich bestehende 31 Seiten erneut mit bin/verify-brand-pages.mjs ohne Fehler geprüft.
- Browser: Startseitenreihe 320/390/768/1440 px, alle fünf Links sichtbar und Beschriftungen ohne Pfeilüberlappung. Alle fünf Unterseiten bei 320 px ohne horizontalen Überlauf; Unternehmen zusätzlich Desktop/390 px visuell geprüft. Tastaturprüfung: Unternehmen fokussiert, Tab erreicht Selbstständige, Enter öffnet deren Unterseite.
- Axe: neue Unternehmen-Unterseite Desktop und Creator bei 320 px je 41 bestanden, 0 Verstöße, 0 unvollständig. Zielgruppenreihe bei 320 px: 14 bestanden, 0 Verstöße, 0 unvollständig. Nachweise tests/output/audiences-*.json/png; keine umfassende WCAG- oder SEO-Rankingfreigabe daraus abgeleitet. Hauptvorschau weiterhin lokal auf Port 3001 ausführbar.


## Zielgruppenlinks kompakter (28.10.2026)
- Auf Nutzerwunsch Schriftgröße von bis zu 25/26 px auf 20 px reduziert, Pfeile von 19 auf 16 px verkleinert. Linkhöhe auf 52 px und Innen-/Abschnittsabstände reduziert. Desktop-/Mobilanordnung und Verlinkungen erhalten.
- Browserprüfung bei 1440 und 390 px: jeweils fünf Links, 20 px Schrift, 52 px Höhe, keine Überschneidung von Text/Pfeil und kein horizontaler Überlauf. Startfähigkeit mit HTTP 200 bestätigt; CSS-Formatprüfung erfolgreich. Nachweise tests/output/audiences-compact-*.json/png.

## Dekorative Titeloberzeilen global entfernt (28.10.2026)
- Auf Nutzerwunsch alle dekorativen Oberzeilen aus dem JSX entfernt: Startseite, öffentliche Seiten, CMS-Seitenrahmen, Leistungs-/Preis-/Blogkarten, Blogartikel, Zielgruppenseiten, Authentifizierung, Buchungsübersicht, Kunden-/Adminportal, Cookie-Hinweis sowie Fehler- und Entwicklungsseiten. Keine bloße CSS-Ausblendung. Veraltete eyebrow-, audience-label- und pricing-label-Stile sowie ungenutzte Titelzusatzvariablen entfernt.
- Titel und fachliche Inhalte erhalten. Projektkategorien, Benachrichtigungsdaten und E-Mail-Empfänger/-Status stehen unter dem Datensatztitel als record-meta. Die Erstgespräch-Angabe „15 Minuten · 0 €“ steht unter dem Titel; Preise, Statusanzeigen, Formulare und Navigation erhalten. Abstände der Titel auf die fehlenden Oberzeilen angepasst.
- Gestaltungsvorgabe in BRAND_GUIDELINES.md und MASTER_SPEC.md festgehalten. Keine Backend-/Datenmodelländerung erforderlich.
- TypeScript, ESLint, CSS-Formatprüfung und abschließender Produktionsbuild erfolgreich. Bestehende 31 Seitenprüfungen und fünf Zielgruppenprüfungen erneut bestanden. Zusätzliche HTTP-Prüfung von 37 Seiten: 200, jeweils eine H1, keine dekorativen Oberzeilen; unbekannte Seite 404 und deren Titel zusätzlich im Browser geprüft. Nachweis tests/output/headings-pages.json (404-H1 wird clientseitig gerendert).
- Visuelle Browserprüfung: Startseitenabschnitt und Erstgespräch Desktop, Erstgespräch/Blog mobil; Kundenportal Desktop/mobil ausschließlich in isolierter QA-Datenbank. Gemeinsamer Portal-Seitenkopf enthält keine Oberzeile mehr. Nachweise tests/output/headings-*.png und headings-portal.json.
- Axe-Blogprüfung mobil: 38 bestanden, 0 Verstöße, 0 unvollständige Prüfungen. Keine vollständige WCAG- oder Produktionsfreigabe daraus abgeleitet. Hauptvorschau bleibt unter localhost:3001 ausführbar.

## Öffentliche Seiten redaktionell und visuell überarbeitet (28.10.2026)
- Aktives Nutzerziel vollständig auf die öffentlichen Seiten angewendet: Inhalte und Gestaltung auf erkennbare KI-Schablonen und austauschbare Werbeaussagen geprüft. Detaillierte Befunde, Bewertungsmaßstab und Änderungen in docs/REDAKTION_UND_GESTALTUNG.md; gesonderte Nachweise in Requirement-Gruppe 44. Die anderen, weiterhin offenen Plattformanforderungen werden dadurch nicht als abgeschlossen markiert.
- Startseiten-Slogans, zufällig wiederholte Symbole, dekoratives Auth-Dreiermotiv und redundante Schlussblöcke entfernt. Leistungen als verlinkte Zeilen mit konkreten Aufgaben; Auftragsablauf und Preise sachlich beschrieben. Avelsorn-Marke, kompakte Zielgruppenlinks und bestehende Nutzerdateien erhalten.
- Alle sieben Leistungstexte mit konkreten Aufgaben, Voraussetzungen und möglichen Ergebnissen überarbeitet. Preis-/Ablauf-/Kontakt-/Über-/Zielgruppen-/Zugangsseiten sowie Navigation, Cookie-Hinweis und Fehlerseiten sprachlich präzisiert. Paketnamen benennen Dauer und Kontingent; Leistungsschlüssel, Geldbeträge, Laufzeiten und fachliche Buchungsregeln unverändert.
- Fünf Blogartikel als unterschiedliche praktische Arbeitsanleitungen neu bearbeitet. Bestehende Veröffentlichungen mit bin/revise-editorial-articles.ts gegen ihre gesicherte Ausgangsfassung abgeglichen und transaktional aktualisiert. Unabhängig bearbeitete Texte würden nicht überschrieben. Alte Fassungen in data/editorial-backups erhalten; fünf Inhaltsänderungen und eine anschließende Titelverkürzung mit insgesamt sechs Auditereignissen. Veröffentlichungstermine und Slugs erhalten.
- Read-only Inventur bin/inspect-public-inventory.ts: 0 zusätzliche CMS-Seiten, 5 veröffentlichte Artikel, alle mit aktuellem Quellstand und Auditnachweis. Bericht tests/output/editorial-inventory.json.
- Alle sechs Bildmotive visuell geprüft. Fantasiebeschriftungen in Hero und Website-Motiv mit dem Bild-Skill bereinigt; bearbeitete Varianten in public/editorial eingebunden. Original-JPEGs unverändert erhalten. KI-Kennzeichnung bleibt sichtbar; keine fiktiven Büro-/Kundenaufnahmen als echt ausgegeben.
- Titelgrößen, lange Wörter und mobile Karten überarbeitet. Zunächst gefundene Überläufe in Preisen, Leistungs-/Zielgruppenübersicht und langen Seitentiteln behoben. Anschließende gerenderte Prüfung sämtlicher 42 öffentlicher Seiten bei 320 px ohne horizontalen Überlauf. Zuletzt verkürzte Titel zusätzlich erneut visuell geprüft. Nachweise tests/output/editorial-final-320-*.json und editorial-final-*.png. Fehlende persönliche und rechtliche Pflichtangaben weiterhin sachlich als offen gekennzeichnet.
- bin/verify-public-copy.ts: 42 öffentliche Seiten HTTP 200, eine H1 je Seite, aktuelle Leistungs-/Artikeltexte, keine zuvor identifizierten Werbeschablonen oder dekorativen Restkomponenten; drei Alias-URLs mit korrekter kanonischer URL, unbekannte Seite 404. Erneute vorhandene 31-Seiten- und fünf Zielgruppenprüfungen bestanden.
- TypeScript, ESLint, alle 33 vorhandenen Funktionstests und abschließender Produktionsbuild erfolgreich. Axe: Startseite Desktop, Preise mobil und Artikel mobil jeweils 40 bestanden, 0 Verstöße, 0 unvollständig. Keine umfassende WCAG-, Rechts- oder Produktionsfreigabe daraus abgeleitet.
- Fertiger Build läuft ausschließlich lokal auf localhost:3001. Keine Veröffentlichung, Verträge, Infrastruktur oder produktiven externen Integrationen eingerichtet. Redaktionelle Gesamtprüfung dieser Etappe abgeschlossen; Gesamtplattform bleibt in Entwicklung.

## Leistungspakete, beruflicher Einstieg und Unternehmensabläufe (29.10.2026)
- Nutzerfreigabe für abgegrenzte Pakete umgesetzt: Creator ab 199 €, beruflicher Einstieg ab 249 €, Freelancer ab 349 €, Gründungsangebot ab 399 €, Social Media ab 499 €, digitaler Ablauf ab 699 €, Website-Onepager ab 1.290 €, jeweils einmalig. Zentraler Katalog mit enthaltenen Ergebnissen, Grenzen und Zuarbeit; keine neuen öffentlichen Stundenpreise oder verkauften Zeitkontingente.
- Das 249-€-Paket nimmt berufliche Umsteiger ohne Idee auf: Erfahrungen, bis zu drei Tätigkeitsfelder, eine Angebotsidee, schriftliche Aufgabenliste, ein Auswertungsgespräch und eine Korrekturrunde. Eigene Seite /beruflich-neu-starten; Links von Startseite und Footer. Vom Gründungsangebot für bereits ausgewählte Ideen abgegrenzt.
- /paket-anfragen speichert eine unverbindliche Anfrage als Kontakt samt Audit und lokaler Mailbestätigung. Admin-Angebotsvorlagen aus dem Katalog, serverseitige Preisuntergrenze und Sperre des unvollständigen Entwurfs. Annahme friert Umfang und Preis ein; vollständige Zahlung erzeugt ein Paketprojekt. Enthaltene Termine sind an den eigenen bezahlten Auftrag gebunden und zählen serverseitig gegen die vereinbarte Gesprächsanzahl.
- Migration 0006 fügt bookings.service_order_id samt Fremdschlüssel hinzu; Hauptdatenbank bei gestoppter Anwendung erfolgreich migriert. Neukäufe alter Stunden-/Laufzeitprodukte an Anwendungseingängen gesperrt (410), historische Verträge und interne Zeiterfassung erhalten. Leistungsbeginn, Eigentum, Storno, Kalenderkonflikte und Vermeidung zusätzlicher Stundenbelastung berücksichtigt. Bei der Sichtprüfung irreführende Bestellbeschriftung bezahlter Projekttermine korrigiert: „Enthaltenen Termin buchen“, keine zweite Zahlung oder erneute Erklärung zum frühzeitigen Beginn.
- Nutzerbestätigte Branchenkontakte sachlich auf Startseite und Über-Seite ergänzt: Anwälte, Hausverwaltungen, Investoren, Trader, Streamer, Selbstständige, kleinere Freelancer. Kontaktanfrage nach Einverständnis und direkter Abstimmung der Bedingungen; keine erfundenen Namen, Kooperationen, Referenzen, Finanzierung oder feste Verfügbarkeit behauptet.
- Neue Startseitenabschnitte und überarbeitete Unternehmens-/Leistungsseiten beschreiben konkrete Prozesse: Angaben übertragen, Zuständigkeiten festlegen, Unterlagen und Freigaben zuordnen, Erinnerungen automatisieren, geeignete KI-Teilaufgaben mit menschlicher Prüfung. Entlastung anhand Ausgangsablauf und Testlauf vergleichen; keine erfundenen Zeitersparniszahlen. Bestehende Markenassets und Nutzerdateien erhalten, keine dekorativen Oberzeilen ergänzt.
- TypeScript, ESLint, alle 41 Funktionstests (acht neue Pakettests) und abschließender Produktionsbuild bestanden. Isolierter echter HTTP-Ablauf: Einrichtung/OTP, Registrierung/Verifikation, Anfrage, Angebot, Annahme, Zahlung, Rechnung, Projekt und Portalansichten; 16 Prüfungen ohne Fehler. Hauptdatenbank erhielt keine QA-Kunden, Testzahlungen oder Testaufträge. Nachweis tests/output/service-packages-http.json.
- 44 öffentliche Seiten HTTP 200 mit jeweils einer H1, aktuelle Inhalte, Marke und entfernte Werbeschablonen; drei Alias-URLs und unbekannte Seite 404 geprüft. Vorhandene 31 Marken- und fünf Zielgruppenprüfungen ebenfalls bestanden. Bericht tests/output/editorial-final-http.json.
- Browser: acht geänderte Seiten bei 320/1440 px, insgesamt 16 Prüfungen ohne horizontalen Überlauf, Bilder geladen. Neue Paketvorwahl im Anfrageformular sowie bezahltes Paket im Kundenportal/Terminformular geprüft. Screenshots und Messungen tests/output/packages-*.json/png. Automatische axe-Prüfungen: Preise 41, Einstiegsseite 40, Startseite 42 bestanden; jeweils 0 Verstöße und 0 unvollständige Prüfungen. Keine umfassende WCAG-Abnahme daraus abgeleitet.
- MASTER_SPEC.md, ARCHITECTURE.md, docs/LEISTUNGSPAKETE.md und Requirement-Gruppe 45 aktualisiert. Gesamtplattform bleibt in Entwicklung; Pflichtstammdaten und externe Dienste weiter offen. Keine Veröffentlichung, Infrastruktur, kostenpflichtigen Verträge oder externen Integrationen eingerichtet. Aktueller Build lokal auf localhost:3001 gestartet.
- Ergänzender Browser-Abschluss: Enthaltenes Projektgespräch über das Kundenformular tatsächlich gebucht; Termin bestätigt, dem bezahlten Auftrag zugeordnet, keine zusätzliche Bestellung oder Zahlung. Nachweise tests/output/packages-booking-browser.json und packages-booking-confirmed.png. Isolierte QA-Instanz und eigene Prüfbrowser anschließend geschlossen; Hauptvorschau auf Port 3001 bleibt verfügbar.

## 404-Seite und Exit-Banner (29.10.2026)
- Bestehende einfache Fehlerseite im Avelsorn-Rahmen ausgebaut: gut lesbarer Fehlercode 404, Titel und sachliche Erklärung, Startseite/Leistungen/Kontakt als Rückwege. Keine dekorative Titeloberzeile. Fehlernummer mit normalem Text samt Screenreader-Zusatz statt ungeeignetem aria-label auf Absatz; Kontrast verstärkt.
- Neues nichtmodales Exit-Banner auf ausgewählten öffentlichen Informationsseiten: kostenloses Erstgespräch, ohne Rabatt-/Druckwerbung. Nach mindestens 20 Sekunden auf großen Mausbildschirmen beim Verlassen des oberen Dokumentrands; auf schmalen/Touch-Bildschirmen nach mindestens halber gelesener Seite und 240 px Rückscrollen. Keine Navigation oder Tab-Schließung abgefangen.
- Einmal je Tab-Sitzung, lokale sessionStorage-Kennzeichnung ohne Übermittlung; Laufzeit-Fallback bei gesperrtem Speicher. Schließbar über X, Weiterlesen und Escape, ohne Fokusübernahme oder Hintergrundsperre. Cookie-Einstellungen, offene Dialoge, mobiles Menü und aktive Eingaben haben Vorrang. Auf Anfrage-/Kontakt-/Termin-/Zugangs-/Rechtsseiten, Portalen und 404 kein Banner.
- ESLint, TypeScript und abschließender Produktionsbuild erfolgreich. Neue Vorschau lokal auf localhost:3001 gestartet. 44 öffentliche Seiten, drei Alias-URLs und 404-Verhalten erneut erfolgreich geprüft. Drei unbekannte Routen (allgemein, Blog, Zielgruppe) mit 404/noindex/gestaltetem Fehlerrahmen: tests/output/exit-404-http.json.
- Browserprüfung 404 bei 320 und 1440 px, Banner bei 390 und 1440 px; sichtbare Elemente innerhalb des Viewports, kein mobiler Seitenüberlauf. Desktop-Auslösung, mobile Rückscroll-Auslösung, Fokus bleibt auf der Seite, Escape und keine erneute Einblendung geprüft. Nachweise tests/output/exit-desktop.json, exit-mobile.json, exit-dismissed.json, exit-404-*.png und exit-banner-*.png.
- Axe 404: 38 bestanden, null Verstöße, null unvollständig. Banner mobil: 43 bestanden, null Verstöße, eine unvollständige Prüfung, weil der überlagerte Seiteninhalt die automatische Hintergrundbestimmung verhindert. Deckend weißen Banner visuell geprüft; Vordergrund-/Hintergrundkontraste separat berechnet: tests/output/exit-contrast-manual.json. Keine vollständige WCAG-Abnahme behauptet.
- Verhalten in BRAND_GUIDELINES.md dokumentiert und Requirement-Gruppe 46 mit Nachweisen ergänzt. Keine Datenbank- oder Infrastrukturänderung, keine externen Dienste/Trackinganbieter ergänzt.

## Lokale Dashboard-Testzugänge für den Nutzer (29.10.2026)
- Auf ausdrücklichen Nutzerwunsch separate lokale Testumgebung auf Port 3011 gestartet und neue isolierte PGlite-Datenbank angelegt. Bestehende Testdatenbanken und Hauptwebsite auf Port 3001 erhalten; keine Testkonten in der Hauptdatenbank.
- Admin über reguläre Einrichtung mit vollständiger Adminrolle angelegt; Kunde regulär registriert, E-Mail-Bestätigung und Onboarding durchgeführt. Passwortanmeldung, Admin-Einmalcode und bestehende Rollen-/Eigentumsregeln bleiben aktiv. Kein Sicherheitsbypass.
- Ein gekennzeichneter lokaler Testablauf erzeugt Paketangebot, Annahme, Test-Zahlungsnachweis, Rechnung und Projekt. Keine reale Zahlung oder externe Nachricht. Alle externen Dienste und erforderlichen Produktionsstammdaten bleiben wie zuvor unkonfiguriert.
- 43 Admin-/Kundenseiten mit authentifizierten HTTP-200-Antworten ohne Fehlerseite geprüft; tests/output/user-dashboard-access.json. Der Paket-Gesamtablauf bestand seine 16 HTTP-Prüfungen erneut.
- Zugangsdaten und Anleitung für den lokalen E-Mail-Ausgang ausschließlich in ignorierter Datei data/TESTZUGAENGE.md gespeichert und dem Nutzer mitgeteilt. Dort auch OTP-Anleitung, getrennte Browserprofile und Neustart mit npm run qa:serve dokumentiert. Testinstanz bleibt für den Nutzer geöffnet. Keine Änderung an Produktcode oder Produktionsbereitschaft.

## Gemeldeten 401-Fehler bei Testanmeldung geprüft (29.10.2026)
- Beide Testkonten mit den mitgeteilten Zugangsdaten über /api/action/login geprüft: jeweils HTTP 200; Admin führt zu /otp, Kunde zu /konto. Der gemeldete 401 ließ sich mit diesen Zugangsdaten nicht reproduzieren; keine unbelegte Ursache behauptet und keine Authentifizierung abgeschaltet.
- Im tatsächlich geöffneten In-App-Browsertab regulär als Testadmin angemeldet und den neu erzeugten lokalen Sicherheitscode bestätigt. Administration unter localhost:3011/admin sichtbar erreicht. Nachweis tests/output/admin-login-confirmed.png. Zugangsdaten unverändert; keine Anwendungscodeänderung erforderlich.

## Adminbereich getrennt und Navigation kompakter (29.10.2026)
- Nutzerwunsch umgesetzt: eigene serverseitige Admin-Startseite für offene Kontakt-/Paket-Anfragen, ungelesene Kundennachrichten, neue Registrierungen, aktive Aufträge und offene Zahlungen. Keine persönliche Kundenbegrüßung, eigener Fragebogen oder Buchung im eigenen Namen. Admin-Sitzung vor Abfrage dieser Verwaltungsdaten nochmals geprüft.
- Alten gemeinsamen Statistikzweig entfernt; Kundenübersicht fragt keinen globalen Kundenbestand mehr ab. Angebote, Rechnungen, Termine, Pakete, Projekte und Dateien bleiben als Verwaltungsfunktionen mit ausdrücklicher Kundenzuordnung erhalten. Kunden erhalten weiterhin ausschließlich ihre eigenen Daten/Aktionen. Keine API- oder Eigentumsprüfung abgeschaltet.
- Lange Admin-Seitenliste durch sieben feste Bereiche ersetzt: Übersicht, Anfragen, Kunden, Aufträge, Finanzen, Inhalte, System. Je ein Icon und kurzer Titel ohne &. Unterseiten kontextbezogen im haftenden Kopfbereich; auf schmalen Bildschirmen beschriftete Auswahl. Desktop feste Seitenleiste, mobil feste zweizeilige Bereichsleiste unten. Kein interner Scrollbereich, keine ausgeblendeten Links als Ersatz für Erreichbarkeit.
- Geringe Fensterhöhe separat geprüft und Abstände angepasst. Beim ersten Prüflauf gefundener unterer Überstand korrigiert; veralteten generierten Turbopack-Cache vor Neubau reversibel umbenannt. Aktueller Build enthält die finalen Regeln. Keine Nutzerdateien oder Datenbanken gelöscht.
- TypeScript, ESLint, alle 41 vorhandenen Funktionstests und abschließender Produktionsbuild erfolgreich. bin/verify-admin-workspace.mjs prüft 43 vorhandene Admin-/Kundenseiten, sechs nicht vorhandene persönliche Admin-Kundenseiten sowie Kundenzugriffssperre auf /admin: insgesamt 50 Prüfungen bestanden. Adminseiten enthalten keine Links ins Kundenportal. Bericht tests/output/admin-workspace-http.json.
- Sechs gerenderte Viewports 1440x900, 1366x600, 1024x320, 768x600, 390x844, 320x640: sieben Links mit Icons vollständig sichtbar, kein interner Navigationsüberlauf, feste Position vor/nach Scrollen, kein horizontaler Seitenüberlauf. tests/output/admin-workspace-responsive.json. Kontextnavigation zusätzlich in admin-workspace-sticky-context.json dokumentiert.
- Interaktion geprüft: Finanzen öffnet Angebote, mobile Unterseitenauswahl wechselt zu Rechnungen, fokussierter Terminlink öffnet per Enter den Kalender. Sichtprüfung Startseite, Projektverwaltung und mobile Rechnungsverwaltung; Screenshots tests/output/admin-workspace-*.png. Kundenzuordnung und Verwaltungsaktionen sichtbar; keine Daten über diese Formulare verändert.
- Axe: Admin-Übersicht Desktop 35 bestanden, mobile Rechnungsverwaltung 45 bestanden; jeweils 0 Verstöße und 0 unvollständig. Keine vollständige WCAG-Abnahme daraus abgeleitet. 44 öffentliche Seiten, drei Alias-URLs und 404-Verhalten ebenfalls erneut erfolgreich geprüft.
- MASTER_SPEC.md, ARCHITECTURE.md, BRAND_GUIDELINES.md, docs/ADMIN_WORKSPACE.md und Requirement-Gruppe 47 aktualisiert. Hauptvorschau auf Port 3001 und bestehende lokale Testinstanz auf 3011 mit aktuellem Build gestartet. Keine neuen Testkonten oder externen Dienste eingerichtet; Gesamtplattform bleibt in Entwicklung.

## Kundenportal in derselben Anordnung wie Admin (29.10.2026)
- Nutzerwunsch umgesetzt: Beide Portale teilen denselben kompakten Rahmen unter portal-compact. Feste Seitenleiste am Desktop und feste Bereichsleiste unten auf kleinen Bildschirmen; haftender Kopfbereich mit rollenbezogenen Unterseiten. Kein eigener Scrollbereich der Navigation.
- Kundenseitig sieben Bereiche mit Icon und kurzem Titel: Übersicht, Termine, Projekte, Pakete, Dokumente, Nachrichten, Konto. Alle 17 bisherigen Kundenrouten bleiben erhalten. Profil, Fragebogen, Datenschutz und der öffentliche Widerruf unter Konto erreichbar. Keine Adminlinks oder zusätzlichen Berechtigungen im Kundenportal.
- Gemeinsame PortalSectionSelect ersetzt die bisherige AdminSectionSelect. Die Auswahl nutzt ausschließlich die serverseitig festgelegten Ziele; Kunden erhalten die Bezeichnung Unterseite, Admin weiterhin Verwaltungsseite. Admins behalten ihre eigenen sieben Verwaltungsbereiche.
- Kundenübersicht an das Adminraster angeglichen: vier verlinkte Kennzahlen und vier Inhaltsbereiche für nächstes Gespräch, persönliche Neuigkeiten, eigene Projekte und Unterlagen/Rückfragen. Sachlicher Titel Dein Kundenkonto. Die Paketzahl berücksichtigt nun ausdrücklich die eigenen bezahlten Leistungspakete und laufenden alten Verträge; alle Datenabfragen auf Kunden-ID begrenzt. Keine neuen Geschäftsobjekte oder Bestellungen dadurch erzeugt.
- ESLint, TypeScript, 41 vorhandene Funktionstests und abschließender Produktionsbuild bestanden. Erweiterte bin/verify-admin-workspace.mjs: 43 bestehende Admin-/Kundenseiten, sechs ausgeschlossene persönliche Adminseiten und Zugriffssperre für Kunden; insgesamt 50 Prüfungen. Keine Adminlinks im Kundenportal, Widerruf erreichbar. Nachweise tests/output/customer-workspace-http.json und admin-workspace-http.json.
- Sechs Kunden-Viewports 1440x900, 1366x600, 1024x320, 768x600, 390x844, 320x640 geprüft: sieben vollständig sichtbare Links mit Icons und kurzen Titeln, Navigation ohne internen Überlauf und vor/nach Scrollen an gleicher Position; kein horizontaler Seitenüberlauf, vier Inhaltsbereiche. tests/output/customer-workspace-responsive.json. Adminrahmen zusätzlich bei 1440/390 px ohne Regression geprüft: customer-workspace-admin-regression.json.
- Browserinteraktion: Konto öffnet Profil, mobile Unterseitenauswahl öffnet Fragebogen sowie den öffentlichen Widerruf; Desktop-Kontextlink öffnet Projektdateien per Tastatur-Enter. Kein Formular abgesendet und keine Kunden-/Adminrolle geändert. Screenshots tests/output/customer-workspace-*.png.
- Axe: Kundenübersicht Desktop 35 bestanden, mobiler Fragebogen 38 bestanden; je 0 Verstöße, 0 unvollständig. 44 öffentliche Seiten, drei Alias-URLs und 404 ebenfalls erneut erfolgreich geprüft. Keine vollständige WCAG- oder Produktionsfreigabe daraus abgeleitet.
- MASTER_SPEC.md, ARCHITECTURE.md, BRAND_GUIDELINES.md, docs/PORTAL_LAYOUT.md und Requirement-Gruppe 48 aktualisiert. Aktueller Build auf Hauptvorschau 3001 und bestehender isolierter Testinstanz 3011 gestartet. Keine Datenbankmigration, neuen Konten, externen Dienste oder Infrastruktur eingerichtet.

## Übermittelte Inhaberangaben und Terminzeiten übernommen (03.11.2026)
- Auf ausdrückliche Nutzerangaben Namen, Anschrift, geschäftliche E-Mail, Rufnummer, gewünschte Domain/Basis-URL, Kontoinhaber, IBAN und BIC in die lokale Hauptkonfiguration übernommen. Telefonnummer international normalisiert. IBAN formal nach Länge/Mod97 geprüft, BIC-Format geprüft; Bankname über BIC-Zuordnung in offizieller Zahlungsanbieter-Dokumentation abgeglichen. Keine Kontoinhaberschaft oder Bankfreigabe behauptet.
- Steuerliche Einordnung als Eigenerklärung zur Kleinunternehmerregelung dokumentiert. Keine Steuernummer erfunden oder durch persönliche Steuer-ID ersetzt. Steueridentifikation bleibt in der Freigabeprüfung offen. Keine zusätzliche behördliche Bestätigung der freiberuflichen Einordnung behauptet.
- Optional editierbare Stammdaten contact_hours und about_text ergänzt. Vorstellung als Textarea im Adminbereich; auf Über-Seite als escaped Text dargestellt. Beratungsfelder Influencer, Creator, Streamer, Unternehmen, Kioske und kleine Imbissbetriebe sachlich übernommen. Verbesserte Online-Darstellung und Kundengewinnung als Ziel beschrieben; keine erfundenen Resultate, Referenzen oder Qualifikationen.
- Impressum mit tatsächlichen Kontakt-/Adressangaben, Kontaktseite mit Mail-/Telefonlinks und Erreichbarkeit. Persönliche Vorstellung vor Arbeitsablauf und Netzwerk platziert. Kontaktbereich mit Abstand und Trennung zum Erstgespräch versehen. Bankverbindung nicht auf öffentlichen Informationsseiten ausgegeben.
- Sieben Wochenregeln 08:00–17:00 Uhr in Europe/Berlin gespeichert. Bestehende Buchungen und datumsspezifische Ausnahmen erhalten. Die zukünftige HTTPS-Domain ist hinterlegt; lokale Laufzeit-URL, fehlende Dienste und ausdrückliche Veröffentlichungsfreigabe bleiben unverändert.
- bin/apply-owner-profile.ts als lokales Eigentümerwerkzeug: Produktions-/Vercel-/Netzwerk- und fremde DB-Ziele gesperrt; private Eingabedatei im ignorierten data-Verzeichnis. Hauptanwendung für direkten Datenzugriff gestoppt; vorherige Daten gesichert, Änderung transaktional auditiert. Erste strikte Kontrollprüfung wegen numerischer JSON-Skalar-Rückgabe bei der PLZ korrigiert; String-Normalisierung entsprechend business() und Kontrollprüfung innerhalb der Transaktion ergänzt. Endzustand erneut vollständig geprüft. Keine Daten in Testumgebung kopiert und keine externen Nachrichten versendet.
- ESLint, TypeScript, 41 Funktionstests und abschließender Produktionsbuild bestanden. 44 öffentliche Seiten und 50 Portal-/Zugriffsprüfungen erneut bestanden. tests/output/owner-profile-http.json prüft fünf öffentliche Seiten einschließlich korrekter Kontaktdaten und privater Bankverbindung; Kalender-API bleibt ohne Anmeldung gesperrt.
- Gespeicherte Wochenregeln mit tatsächlicher Kalenderfunktion in isolierter Speicher-Datenbank geprüft: sieben Tage, je 36 Viertelstunden-Startzeiten von 08:00 bis 16:45 bei Ende 17:00. tests/output/owner-profile-calendar.json. Keine Testbuchungen oder Testkunden in der Hauptdatenbank.
- Drei geänderte Seiten bei 320/1440 px ohne Überlauf geprüft; Screenshots owner-contact-*, owner-about-*, owner-imprint-* und Messungen owner-profile-responsive.json. Axe Kontakt mobil: 43 bestanden, 0 Verstöße, 0 unvollständig; keine vollständige WCAG-Abnahme daraus abgeleitet.
- Konfiguration, Restpunkte und Nachweise in docs/BUSINESS_PROFILE_SETUP.md; MASTER_SPEC.md, ARCHITECTURE.md und Requirement-Gruppe 49 aktualisiert. Hauptvorschau auf 3001 und separate Testinstanz auf 3011 mit aktuellem Build gestartet. Offen bleiben Steueridentifikation, produktive Dienste/HTTPS und abschließende Veröffentlichungsfreigabe.

## GitHub/Vercel-Ziel und Entfernung des aktiven Steuernummer-Feldes (03.11.2026)
- Ziel auf Nutzerangabe konkretisiert: GitHub für Quellcodeübertragung, Vercel für Hosting, Domain avelsorn.de laut Inhaber bei Checkdomain gekauft. Noch kein lokales Git-Repository, Remote oder Vercel-Projekt verbunden. Kein Push, Deployment, DNS-Wechsel oder externer Dienst eingerichtet. Konkreter Veröffentlichungsplan in docs/DEPLOYMENT_PLAN.md; MASTER_SPEC.md und ARCHITECTURE.md aktualisiert.
- tax_number aus aktiven Geschäftsfeldern und Adminformular entfernt. Neue PDFs drucken weder eine leere Steuerzeile noch alte tax_number-Snapshotwerte. Optionale tatsächlich vorhandene USt-/Kleinunternehmer-IDs bleiben möglich. Gespeicherte finalisierte PDFs und historische Nachweise unverändert.
- Pauschalen Website-Veröffentlichungsblocker Steueridentifikation entfernt. Rechnungsangaben bleiben gesondert zu prüfen; Freelancerstatus ist keine allgemeine Ausnahme. Für neu gerenderte Rechnungen oberhalb von 250 Euro ohne verfügbare IDs zusätzlicher Prüfungshinweis. Dies ist keine vollständige Rechnungsprüfung oder neue Statussperre. Quellen und Grenzen in docs/DEPLOYMENT_PLAN.md.
- Lokale Hauptvorschau vor Datenzugriff gestoppt. bin/remove-obsolete-tax-number.ts mit Produktions-/Netzwerk-/Fremddatenbanksperre, privater Sicherung und transaktionalem Audit entfernt die aktive Einstellung. Alle 17 übrigen Einstellungen unverändert. Private Importdatei ebenfalls bereinigt; keine historischen Dokumente umgeschrieben. Nachweis tests/output/tax-number-removal.json.
- readiness erneut offline geprüft: kein aktives tax_number-Feld, keine Steueridentifikation als pauschaler Website-Blocker, Eigentümerangaben vorhanden und sieben Wochenregeln erhalten. Andere Dienst-/HTTPS-/Freigabeprüfungen bleiben bestehen. tests/output/owner-profile-readiness.json.
- ESLint, TypeScript, 42 Funktionstests und Produktionsbuild bestanden. Neuer Integrationstest extrahiert den tatsächlichen PDF-Text: entfernte Altwerte und leere Platzhalter fehlen; 249-Euro-/349-Euro-Ausgaben und vorhandene optionale ID geprüft. Bestehender Test für unveränderliche finalisierte PDFs weiterhin erfolgreich.
- 44 öffentliche Seiten, drei Alias-URLs, 404 und 50 Portal-/Zugriffsprüfungen erfolgreich. tests/output/tax-number-admin-http.json bestätigt das gerenderte Adminformular ohne Steuernummer, optionale IDs und beide lokalen HTTP-200-Vorschauen. Hauptanwendung auf 3001 und bestehende getrennte Testinstanz auf 3011 mit aktuellem Build gestartet. Keine neuen Testdaten in Hauptdatenbank; keine Produktionsbereitschaft behauptet.

## GitHub-Ziel hinterlegt (03.11.2026)
- Nutzerbestätigtes Repository https://github.com/Erygros/Avelsorn.git lokal als origin für Fetch/Push hinterlegt. Leeres lokales Git-Repository auf main initialisiert. Kein Commit, Push, Remoteabruf, Vercel-Deployment oder DNS-Wechsel ausgeführt; Remotezugriff und vorhandene Remotehistorie noch nicht geprüft.
- git remote -v und git symbolic-ref --short HEAD geprüft. git check-ignore bestätigt Ausschluss von .env.local, privaten Eigentümer-/QA-Dateien, lokaler Datenbank, tests/output, .next und node_modules. git ls-files --others --exclude-standard enthält keine Dateien aus diesen Verzeichnissen. Dies ersetzt keine vollständige Inhaltsprüfung vor dem ersten Commit.
- MASTER_SPEC.md, ARCHITECTURE.md und docs/DEPLOYMENT_PLAN.md aktualisiert. Keine Änderung am Anwendungscode; Startfähigkeit durch HTTP 200 auf 3001 und 3011 geprüft.

## Telefonischer Start und erster GitHub-Push (04.11.2026)

- Vercel-Konto und Checkdomain-Postfach laut Inhaber vorhanden. Erstgespräche sind im Formular und Kalenderdienst auf Telefon beschränkt. Video für neue Projektgespräche erfordert einen vollständig bezahlten, aktiven Auftrag und einen konfigurierten Videodienst. Der Raumzugang prüft den Auftrag bei Projektbuchungen erneut. Der Telefonbetrieb benötigt keinen Videodienst.
- TypeScript, ESLint, 42 Funktionstests und Produktionsbuild erfolgreich. Lokale Startseite auf Port 3001 mit HTTP 200 und aktualisiertem Footer geprüft.
- Inhaber hat den Push auf Erygros/Avelsorn beauftragt. Remote vor dem Erstcommit ohne Branches. Private Konfiguration, Datenbanken und Testausgaben sind aus dem Git-Index ausgeschlossen. Das originale Markenblatt wird bytegetreu als Binärdatei aufgenommen.

## Supabase-CLI und Datenbankschema (04.11.2026)

- Avelsorn-Projekt in West EU (Irland) über bestätigten CLI-Login verbunden. Projektverknüpfung unter ignoriertem data/supabase-avel. SQL-Zugriff geprüft.
- Sieben vorhandene Drizzle-Migrationen auf die leere Zieldatenbank in einer Transaktion angewendet und mit Originalhashes im Drizzle-Journal erfasst. 37 Anwendungstabellen geprüft. RLS aktiv und keine Tabellenfreigaben für die API-Rollen anon, authenticated und service_role oder PUBLIC festgestellt.
- Privaten Bucket avelsorn-private angelegt und public=false verifiziert. Region in der ignorierten Vercel-Konfiguration ergänzt. Anwendungslaufzeit, S3-Zugriff, SMTP und Vercel bleiben separat zu konfigurieren und zu prüfen.

## Supabase-Laufzeitverbindung mit TLS geprüft (04.11.2026)

- PostgreSQL-URI für den Transaction Pooler lokal ergänzt. Der Node-Client benötigt die Supabase-CA für die Zertifikatsprüfung. Der Netzwerkadapter unterstützt deshalb DATABASE_CA_CERT_BASE64 als Base64-kodiertes PEM-Zertifikat. Zertifikat und Hostname werden weiterhin geprüft.
- Verbindung über den Anwendungsadapter mit SELECT 1 bestätigt. 37 Anwendungstabellen zuvor über dieselbe TLS-Verbindung gezählt. TypeScript, ESLint für die geänderte Datei, alle 42 Tests und Produktionsbuild bestanden.
- Privater Bucket über die verbundene Supabase-CLI sichtbar. Die App benötigt für ihren S3-Adapter noch ein S3-Schlüsselpaar. Der postfachspezifische SMTP-Hostname wurde von der öffentlichen Autokonfiguration nicht geliefert. Produktionsfreigabe bleibt aus.

## Anfrage-Ping und Vorbereitung der Veröffentlichung (04.11.2026)

- Kontakt- und Paketanfragen speichern den privaten Mail-Ping gemeinsam mit der Anfrage. Der Versandversuch startet nach der HTTP-Antwort. Die Mail enthält ausschließlich eine feste Betreffzeile und den Eingangshinweis. Anfragedetails bleiben in der Adminansicht. Vorhandene Kundenbestätigungen nutzen weiterhin den separaten Versandweg.
- Test verifiziert einen einzigen internen Ping je geprüfter Paketanfrage, mit statischem Inhalt und ohne Link oder Anhang. TypeScript, ESLint, alle 42 Tests und Produktionsbuild bestanden. SMTP-Zustellung an das private Postfach ist separat zu prüfen.
- 16 vorhandene Geschäftsfelder und sieben Terminregeln über den verifizierten TLS-Adapter nach Supabase übernommen. Bestehende Zielwerte werden nicht überschrieben. Die Übernahme wurde transaktional auditiert.

## Produktionsvariablen in Vercel übernommen (05.11.2026)

- 21 bereits ausgefüllte Werte aus der ignorierten lokalen Vercel-Konfiguration über die authentifizierte CLI im Zielprojekt avelsorn für Production gespeichert. Datenbank-URI, Postfachpasswort und Anwendungsschlüssel als Secret übertragen. Eingaben ausschließlich über stdin; keine geheimen Werte im Übernahmebericht.
- Vercel-Auflistung nach der Übernahme geprüft. Noch offen sind S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY und SMTP_HOST. PRODUCTION_APPROVED bleibt false bis zur erfolgreichen Dienstprüfung. Keine vollständige Produktionsfreigabe aus der Variablenübernahme abgeleitet.

## Vercel-Inbetriebnahme mit echten Dienstzugängen (05.11.2026)

- Nutzer hat die Website mehrfach ausdrücklich zur Veröffentlichung freigegeben. S3-Zugänge und postfachspezifischen SMTP-Host übernommen und als Vercel-Produktionsvariablen gespeichert.
- Supabase Storage über den Anwendungsadapter mit zufälligem Prüfobjekt geschrieben, gelesen und bereinigt. Checkdomain-SMTP auf Port 465 mit TLS authentifiziert. Ein statischer Test-Ping an die vom Inhaber gewünschte Adresse wurde vom SMTP-Server angenommen. Bericht data/production-ping-check.json enthält keine Kundendaten. SMTP-Annahme ist kein unabhängiger Nachweis des Posteingangs.
- Produktionsprüfung mit vollständiger Serverkonfiguration meldet keine fehlenden Werte. Vercel-Runtime auf Node 24 gesetzt. Bestehende Vercel-Domainzuordnung mit www.avelsorn.de als Hauptadresse beibehalten und zentrale URL sowie Datenbank-Stammdatum daran angeglichen. Fünf vorhandene Blogartikel ohne Überschreiben in die leere Zieldatenbank übernommen.
- Nach erfolgreichen anderen Formularaktionen wird die vorhandene Outbox ebenfalls nach der Antwort abgearbeitet, damit Registrierungs- und Admin-OTP-Mails unmittelbar versendet werden können. Anfrage-Pings behalten ihren gezielten Versand und statischen Inhalt.
- Das Produktionsadministratorkonto ist noch vom Inhaber unter /einrichtung mit dem privaten SETUP_KEY anzulegen. Die umfassenden noch offenen Abnahmen in RELEASE_READINESS.md werden durch die technische Inbetriebnahme nicht als erledigt markiert.

## Öffentliche Website geprüft (05.11.2026)

- GitHub-Stand e7414d6 über bestehende Integration als Vercel-Production-Deployment dpl_24EWbUMRp5NC2JqXh8H9GsNGjQFS veröffentlicht. www.avelsorn.de liefert HTTP 200, avelsorn.de leitet mit gültigem HTTPS per 308 darauf weiter. Freigabesperre entfernt.
- 44 öffentliche Seiten, drei Alias-URLs und 404 erfolgreich auf der echten Domain geprüft. tests/output/production-public-http.json. Sieben weitere Prüfungen bestätigen Formularvalidierung, Ablehnung fremder Origins, gesperrte anonyme Kalenderzugriffe, Aufgaben-Endpunkt und Sitemap mit Blog-URLs. tests/output/production-api-checks.json. Keine künstliche Kontaktanfrage oder Bestellung für diese Prüfungen angelegt.
- Browserprüfung bestätigt geladene Hero-/Markenbilder und funktionierendes Ablehnen optionaler Cookies. Mobil bei 390 px kein horizontaler Überlauf. Screenshots production-home-desktop.png und production-home-mobile.png. Bei der Sichtprüfung verbliebenen statischen Entwicklungshinweis gefunden; SiteShell zeigt ihn nach Freigabe künftig nicht mehr. ESLint und erneuter Produktionsbuild dafür bestanden.
- Erste verschlüsselte Produktionssicherung im privaten Speicher erstellt, zurückgelesen und entschlüsselt; 36 Snapshot-Tabellen geprüft. data/production-backup-check.json. Eine Wiederherstellung in eine neue Produktionsdatenbank wurde damit nicht durchgeführt.
