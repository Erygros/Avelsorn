# Rechtstexte und Betriebsprüfung – 05.11.2026

Diese Prüfung dokumentiert konkrete Änderungen und Nachweise. Sie ist keine Behauptung einer vollständigen juristischen Prüfung oder fehlerfreien Gesamtplattform.

## Rechts- und Anbieterquellen

- [§ 5 DDG – Anbieterinformationen](https://www.gesetze-im-internet.de/ddg/__5.html)
- [§ 34a UStDV – Kleinunternehmerrechnungen](https://www.gesetze-im-internet.de/ustdv_1980/__34a.html), einschließlich Verweis auf § 33 UStDV für Kleinbetragsrechnungen.
- [§ 147 AO – Aufbewahrung](https://www.gesetze-im-internet.de/ao_1977/__147.html)
- [§ 356a BGB – elektronische Widerrufsfunktion](https://www.gesetze-im-internet.de/bgb/__356a.html)
- [§ 357a BGB – Dienstleistungswertersatz](https://www.gesetze-im-internet.de/bgb/__357a.html)
- [Vercel DPA, insbesondere Schedule 3](https://vercel.com/legal/dpa)
- [Supabase DPA, insbesondere Abschnitt 12](https://supabase.com/legal/customer-resources/data-processing-addendum)
- [Checkdomain Datenschutz](https://www.checkdomain.de/agb/datenschutz/)
- [LDI NRW](https://www.ldi.nrw.de/)

Der Inhaber hat im Chat den Abschluss der AVV/DPA für alle drei Dienste bestätigt. Die konkreten unterzeichneten Dokumente wurden nicht im Projekt abgelegt oder unabhängig eingesehen. Es wird keine ungesehene Zertifizierung behauptet. Die deutschen Aufbewahrungsangaben unterscheiden Belege, Bücher und Geschäftskorrespondenz; sie werden nicht pauschal auf sämtliche Kontodaten übertragen.

## Stammdaten und rechtliche Darstellung

- Echte Anbieteradresse, geschäftliche Telefonnummer und E-Mail werden zentral verwaltet und auf Impressum, Datenschutz und Widerrufsbelehrung angezeigt.
- Vom Inhaber korrigierte USt-IdNr. in Produktion und lokal mit Audit übernommen. VIES meldet gültig; die Abfrage liefert keine Namens-/Adresszuordnung. Keine persönliche Steuernummer gespeichert oder veröffentlicht.
- Datenschutzhinweise beschreiben tatsächliche Anbieter, Verarbeitung in Irland und den USA, Übermittlungsgarantien, Zwecke/Rechtsgrundlagen, Datenkategorien, erforderliche/freiwillige Angaben, Rechte, Beschwerdestelle und Fristkriterien.
- Cookie-Namen, tatsächliche Laufzeiten und lokale Browser-Speicherung aus dem Anwendungscode dokumentiert.
- Unfertige Aussagen über einen zukünftigen Produktivbetrieb entfernt. Keine uneingeschränkte WCAG-Konformität behauptet.
- Widerrufsbelehrung um Empfängerdaten, Rückzahlung, vorzeitige Leistung und übernehmbares Musterformular ergänzt.

## Geschäftsvorgänge

- Elektronischer Widerruf speichert Erklärung, Bestätigungs-Outbox, Adminhinweis und Audit in derselben Transaktion. Die Bestätigung enthält Name, E-Mail, Vertrag, Erklärung sowie Eingangsdatum/-zeit. Nachgelagerter Versand bleibt vom SMTP-Dienst abhängig.
- Zahlungen bleiben erfassbar, wenn Rechnungsangaben fehlen. Eine betroffene Rechnung bleibt unnummerierter Entwurf; die Administration wird benachrichtigt. Die gesonderte Finalisierung prüft Ausstellerdaten, Kundenanschrift und oberhalb von 250 Euro eine steuerliche Kennung.
- Vorhandene finalisierte Rechnungen werden durch diese Änderung nicht umgeschrieben. Die Kontrolle validiert vorhandene Pflichtfelder; sie ersetzt keine behördliche Identitäts- oder Steuerprüfung.
- Änderungen an rechtlichen CMS-Texten erhalten die zentral gerenderten Anbieterangaben. Technische Systemseiten und nicht erreichbare Alias-Pfade können nicht als vermeintlich veröffentlichte CMS-Seite gespeichert werden.
- Wiederherstellung älterer Backups lässt inzwischen eingeführte Datenbankspalten aus dem INSERT aus, damit deren Datenbank-Standardwerte wirksam bleiben.

## Nachweise

- 48 Funktionstests sowie TypeScript, ESLint und Produktionsbuild erfolgreich.
- `tests/output/legal-cms-e2e.json`: zehn echte lokale HTTP-Aktionen, öffentliche Revisionen, verborgene Entwürfe/Archive, Kundenberechtigungsgrenze, Pflichtangaben trotz CMS-Änderung und vollständige Widerrufsbestätigung. Ausschließlich isolierte QA-Datenbank und lokales Mail-Testpostfach.
- `tests/output/legal-responsive.json`: sieben rechtliche Seiten bei drei Fensterbreiten, 21 Prüfungen ohne horizontalen Überlauf oder Platzhalter.
- `tests/output/legal-a11y-*.json`: axe-core WCAG-2-A/AA-Prüfung aller sieben Seiten ohne gemeldete Verstöße oder unvollständige Ergebnisse. Dies ist keine vollständige manuelle Konformitätsprüfung.
- `tests/output/editorial-final-http.json`: 45 öffentliche Seiten, drei Aliase und 404 lokal erfolgreich.
- `tests/output/admin-workspace-http.json`: 50 Portal-/Zugriffsprüfungen erfolgreich. Seitenaufrufe allein beweisen keine vollständige Geschäftsablaufprüfung aller Funktionen.
- `tests/output/legal-production-restore.json`: echte verschlüsselte Produktionssicherung aus privatem Speicher entschlüsselt, in neue lokale PGlite-Datenbank wiederhergestellt, alle 36 Tabellenzeilenzahlen identisch. Diese Sicherung enthält keine privaten Dateien; nichtleere Dateiwiederherstellung wird zusätzlich mit isolierten Funktionstests geprüft.
- `tests/output/legal-production-inventory.json`: keine fehlenden Pflichtstammdaten oder technischen Konfigurationswerte. Keine rechtlichen CMS-Overrides in Produktion; fünf veröffentlichte Artikel.

## Noch offen im Gesamtziel

- Der angeforderte Inhaberzugang wurde mit übermittelten Angaben angelegt. Die Passwortmail wurde vom SMTP-Server angenommen. Die Anmeldung des Inhabers wurde nicht unabhängig bestätigt; Einzelheiten in docs/CONTRACT_FLOW_AUDIT.md.
- Vollständige manuelle Barrierefreiheitsprüfung, visuelle PDF-/Mail-Abnahme und umfassende Geschäftsablaufprüfung beider Dashboards bleiben separat nachzuweisen.
- Anbieter-/Steuerstatus und Vertragstexte sind mit Inhaberangaben und tatsächlichen Funktionen abgeglichen; eine abschließende juristische Einzelfallprüfung ist damit nicht ersetzt.
- Vollständige Angebots- und Vertragsbestätigungen wurden für den aktuellen Angebotsweg implementiert und geprüft; weitere Geschäftsabläufe bleiben offen. Nachweise: docs/CONTRACT_FLOW_AUDIT.md.

## Veröffentlichung und Nachprüfung

GitHub-Stand `f119bb8` wurde über die bestehende Vercel-Integration als Production-Deployment `dpl_AMCNtAEY2mgS78ctqyp3Mp9zmbjH` erfolgreich veröffentlicht. Auf www.avelsorn.de wurden sieben rechtliche Seiten, geschützte Konto-/Adminzugänge und die Abweisung ungültiger Widerrufseingaben geprüft (`tests/output/legal-production-http.json`, zehn Prüfungen). Alle sieben rechtlichen Seiten wurden zusätzlich im echten Produktionsbrowser bei 320, 768 und 1440 px ohne Überlauf oder unfertige Hilfstexte geprüft (`legal-production-responsive.json`). Die automatisierten WCAG-A/AA-Prüfungen melden auch auf Produktion keine Verstöße oder unvollständigen Ergebnisse (`legal-production-a11y-*.json`). Es wurden dabei keine künstlichen Produktionsanfragen oder Kundenkonten angelegt.
