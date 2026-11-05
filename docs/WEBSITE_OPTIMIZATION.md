# Öffentliche Website: Optimierung und Gastbuchung

Auftrag: docs/WEBSITE_OPTIMIZATION_REQUEST.txt. Ausgangsstand: ae8c842, produktiv unter www.avelsorn.de. Entwicklung auf codex/website-optimierung. Keine Produktionsveröffentlichung oder Produktionsmigration ohne erneute ausdrückliche Freigabe für diesen Auftrag.

## Phase 1 – Bestandsanalyse

- App Router mit dynamischer öffentlicher Sammelroute, eigenen Kalender-/Bestätigungs-, Paket-, Zielgruppen- und Portalrouten. 13 API-Route-Module einschließlich zentral validierter Aktions-API. Zentrale Rollen-/Eigentumsprüfung, Admin-OTP, Origin-Prüfung und Rate-Limits erhalten.
- 33 vorhandene Komponenten und 24 Servermodule für Inhalte, Authentifizierung, Kalender, Finanzen, Projekte, Dateien/Chat, Datenschutz, Mail und Sicherungen inventarisiert. Öffentliche Änderungen werden auf Inhalt, Präsentation und zwingende Gastkalender-Schnittstellen begrenzt.
- Sieben Leistungen in src/content/pages.ts; sieben Pakete einschließlich Preisen und tatsächlichem Leistungsumfang in src/content/service-packages.ts. Keine zweite Preisverwaltung. Bestehende URLs und Beiträge erhalten.
- Bestehender Kalender nutzt dieselben Verfügbarkeitsregeln für öffentliche Slots und geschützte Buchungen, eine transaktionale Kalendersperre und eine revidierte Mail-Outbox. Buchungen setzen aktuell zwingend ein Kundenkonto voraus. Gastbuchungen benötigen einen getrennten Datensatz, sichere Zugangslinks und Integration in Kollisionsprüfung, CRM, Bestätigung, Erinnerungen und Datensicherung.
- PostgreSQL/PGlite mit versionierten Drizzle-Migrationen. Private Dateien über Adapter; SMTP und Supabase sind in Produktion tatsächlich eingerichtet. Neue Vorschau darf keine Geschäftsvorgänge in der Produktionsdatenbank erzeugen. Migration vor Produktionsfreigabe nur vorbereitet und isoliert geprüft.
- Ursprüngliches Logo aus dem Markenblatt, vorhandene Bilddateien und Arial-basierte Typografie erhalten. Tokens: Papier #fff, Text #22251f, Sekundärtext #62665d, Linie #dedfd9, Fläche #f5f6f2, ruhige Fläche #ebede7. Keine neue Farbwelt, Fonts oder Animationen.
- Inhaltliche Lücken: sieben gleichrangige Leistungskarten ohne Kategorien, überholte Konto-/Fragebogenpflicht im Home-/Ablauftext, fehlende sichtbare Paketergebnisse, wenig persönliche Vorstellung, keine eigens strukturierten Leistungsbeispiele und Portalvorteile. Trading-Seite bleibt als ergänzende Finanzinformation erhalten.
- SEO: individuelle Servicetitel vorhanden, Beschreibungen teilweise sehr lang; Metadaten/Canonicals zentral ergänzbar. Sitemap enthält Über-Avelsorn noch nicht. Alias-Routen werden bisher zusätzlich gerendert. Navigation enthält bisher vier Hauptlinks und keinen direkten Über-Avelsorn-Link.
- Dokumentation enthält veraltete Statusangaben aus der Zeit vor der Veröffentlichung; diese werden im Rahmen der Abschlussdokumentation aktualisiert.
- Ausgangsprüfung: alle 57 bestehenden Tests bestanden. Bestehende öffentliche Website im Browser gelesen und bei 1440/390 px dokumentiert (tests/output/website-before-*.png). Keine Produktionsdaten geändert.

## Umsetzung und Abnahme

1. [x] Bestand und kritische Schnittstellen analysiert; Ausgangstests durchgeführt.
2. [x] Home und Positionierung nach Wortlaut des Auftrags, Originalbild und zwei klare CTAs.
3. [x] Drei Servicekategorien; alle sieben bisherigen Detailseiten mit konkretem Aufbau.
4. [x] Pakete mit sichtbarem Umfang und Ergebnis, unveränderten zentralen Preisen.
5. [x] Sichere Gastbuchung mit gemeinsamer Kollisionsprüfung, echten gespeicherten Terminen und CRM-/Mail-/Reminderintegration. Reguläre Kontobuchung erhalten.
6. [x] Persönliche Über-Avelsorn-Seite ohne erfundene Erfahrung oder Fotos.
7. [x] Gekennzeichnete allgemeine Projektbeispiele und belegbare Portalvorteile.
8. [x] Navigation, Canonicals/Metadaten, Sitemap, Responsivität und Tastaturbedienung.
9. [x] Bestehende Kunden- und Adminprozesse auf Regressionen prüfen.
10. [x] TypeScript, ESLint, vollständige Tests, Build, Integration, Browser, Barrierefreiheit und Performance.
11. [x] Vollständige Dokumentation, isolierte Preview und konkrete abschließende Freigabevorlage.

## Verbindliche Freigabegrenze

Die frühere Freigabe für den damaligen Stand gilt nicht als Freigabe dieses neuen Auftrags. Kein Push auf main, keine produktive Migration, keine Änderung produktiver Stammdaten oder Zugangsdaten. Änderungen bleiben lokal und in einer isolierten Preview bis zur neuen ausdrücklichen Freigabe. Fehlende externe Nachweise werden benannt.


## Implementierter Entwicklungsstand (05.11.2026)

- Startseite mit vorgegebenem Hero-Wortlaut, originalem Bild, zwei CTAs und ruhigen Vertrauensangaben. Drei Kategorien, Zusammenarbeit, ausdrücklich allgemeine Beispiele und belegbare Portalvorteile statt erfundener Referenzen.
- Alle sieben Leistungen behalten ihre kanonischen URLs. Zielgruppe, Problem, konkrete Aufgaben, Ablauf, Ergebnis, benötigte Angaben und passende Preis-/Anfragelinks sind je Leistung hinterlegt. Trading/ETF ist ein ergänzender Informationsbereich.
- Alle sieben Preise und Leistungsumfänge unverändert aus derselben Datenquelle. Drei wichtige Leistungsbestandteile und ein passendes Ergebnis sind je Karte ohne Aufklappen sichtbar.
- Persönliche Vorstellung mit tatsächlichem Erfahrungsbericht aus der bestehenden Geschäftskonfiguration. Kein erfundenes Portrait, keine neuen Qualifikationen oder Erfolgszahlen.
- Flache Navigation nach Auftrag; mobile Navigation schließt bei Auswahl oder Escape. Ablaufseite im Footer und Kontext verlinkt. Eindeutige Meta-Beschreibungen, Open Graph, sachliche Unternehmensdaten, Über-Seite in Sitemap und dauerhafte Alias-Weiterleitungen. Bing-XML und Meta erhalten.
- Gastbuchung ohne Kundenkonto mit gemeinsamem transaktionalem Kollisionsschutz, serverseitiger Validierung, separaten Datensätzen, eng begrenztem HttpOnly-Zugang, verschlüsselter Outbox, ICS, Revisionen, Erinnerungen und Adminverwaltung. Registrierung und Verifizierung regulärer Konten bleiben erhalten. Datenschutz-/Cookiehinweise beschreiben den neuen Vorgang.

## Bisherige konkrete Prüfnachweise

- npm run check: Typprüfung, Lint, 73 Tests und Produktionsbuild bestanden. 12 Gast-/Sitemap-Tests und 4 Inhalts-/Preis-/Origin-Tests ergänzen die bisherigen 57 Tests. Die Browserprüfdatei erhielt anschließend eine reine Lint-Bereinigung und wurde ebenfalls erfolgreich geprüft.
- tests/output/website-guest-http.json: neun echte lokale API-Prüfungen mit Konto-/Gasttrennung, Konflikt, Bestätigungs-Outbox, geschütztem E-Mail-Link, Verschiebung, veraltetem Versionsstand und Absage.
- tests/output/calendar-api-e2e.json: bestehende Registrierung, E-Mail-Verifizierung, Kontobuchung, Wiederholungsschutz, Adminfreigabe, private Notiz und ICS erneut erfolgreich.
- tests/output/service-packages-http.json: 16 echte lokale Schritte für Anfrage, konkretes Angebot, Beauftragung, Überweisung und Projektanlage erfolgreich. 50 Portal-/Zugriffsprüfungen in admin-workspace-http.json erfolgreich.
- Mobiler Gastablauf im Browser tatsächlich gebucht, verschoben und abgesagt (Revision 2). Admin-Gastdialog zeigt Kontakt und interne Notiz ohne Kundendetail-Link oder künstliches Kundenkonto.
- 138 Layoutprüfungen über 46 öffentliche Seiten bei 320/768/1440 px ohne horizontalen Überlauf. Eine zu kleine Verlinkung auf /widerruf in der WCAG-2.2-Prüfung korrigiert. Die vollständige Prüfung des korrigierten Builds läuft; keine Vollkonformität aus automatischen Prüfungen abgeleitet.
- tests/output/website-local-migration.json: bestehende lokale Datenbank vor Upgrade authentifiziert verschlüsselt gesichert, Entschlüsselung geprüft und bisherige Tabellenzeilenzahlen nach Migration unverändert.
- tests/output/website-preview-isolation.json: neue eingeschränkte Rolle und Schema avel_preview_20261105 im vorhandenen Supabase-Projekt. SELECT auf public.users und UPDATE auf public.settings werden serverseitig verweigert. Keine Kundendaten kopiert; produktive Gasttabelle weiterhin nicht angelegt.
- tests/output/website-preview-storage.json: tatsächlicher privater S3-Schreib-/Lese-/Löschdurchlauf ausschließlich unter eigenem Preview-Präfix, keine Produktionsobjekte verändert.

## Veröffentlichung und Rücknahme

1. Erst den fertigen Preview-Stand und die vollständigen Prüfungen dem Inhaber vorlegen. Eine eigene abschließende Freigabe ist zwingend. Der bisherige Produktionsstand bleibt bis dahin unverändert.
2. Nach Freigabe unmittelbar vor der produktiven Migration eine aktuelle verschlüsselte Sicherung über den vorhandenen Sicherungsprozess erstellen und prüfen. Migration 0008 ist rein additiv; keine Änderung oder Löschung bestehender Kunden-, Buchungs- oder Zahlungszeilen.
3. Migration bewusst über den bestehenden Produktionsmigrationsprozess anwenden, danach den freigegebenen Commit über main/GitHub/Vercel veröffentlichen. Keine automatische Migration während des Builds. Bestehenden minütlichen Aufgabenlauf beibehalten.
4. Bereits vorbereiteter Rücknahmestand 3653ca7 enthält die neue Gaststrecke, Kalenderprüfung, Verwaltung, Sicherheit und Datenschutzhinweise, jedoch die bisherige öffentliche Gestaltung. Eine Rücknahme der öffentlichen Optimierung darf nur auf einen gastfähigen Stand erfolgen. Nicht auf den alten Main-Stand ohne Gastkollisionsprüfung zurückspringen, sobald echte Gasttermine vorliegen. Die neue Tabelle bleibt bei einer Rücknahme erhalten.
5. Nach Freigabe und Veröffentlichung Domain, Buchungsseiten, Zugriffe und bestehenden Aufgabenlauf nachprüfen. Keine künstlichen Kunden, Zahlungen oder Testaufträge in Produktion anlegen.

## Grenzen der Vorschau

Die bestehende produktive SMTP-Anbindung bleibt unverändert; neue Gastmails werden vor Freigabe nur lokal als gespeicherte Outbox und am Mailadapter einschließlich ICS geprüft. Die Vercel-Preview versendet ausdrücklich keine E-Mails und hat keinen eigenen Zeitplan oder Videodienst. Das ist keine produktiv eingerichtete neue Integration. Die Preview nutzt vorhandene Vercel-/Supabase-Dienste; es wurde keine Hosting- oder Serverinfrastruktur bestellt oder aufgebaut.


### Öffentliche Browserabnahme

tests/output/website-public-validation.json: 138 Layoutprüfungen, 38 interne Verlinkungen und 17 automatisierte WCAG-A/AA-Prüfungen einschließlich WCAG 2.2 ohne gemeldete Verletzung. Zwei Hinweise auf /kalender wurden zusätzlich behandelt: die beschriftete Slotgruppe erhält eine explizite Gruppenrolle; Monatsnavigation verwendet beschriftete Schaltflächen mit dekorativen SVG-Pfeilen. Die gezielte Prüfung des abschließenden Kalenderstands folgt nach dem Build. Automatische Prüfungen ersetzen keine vollständige manuelle Barrierefreiheitsprüfung.


## Abschluss der Entwicklung und Freigabevorlage

Die funktionale Optimierung ist im Entwicklungsstand abgeschlossen. Vorschau: https://avelsorn-git-codex-website-optimierung-erygros-8437.vercel.app/ (bestehende Vercel-Anmeldung erforderlich; Deployment Protection bleibt aktiviert). Der Code-Stand b6d4c31 wurde als dpl_E4jrUrkuYGqxUB9CyThPwX4E27ga Ready/Preview nachgewiesen. Die produktive Domain bleibt auf dem bisherigen Main-Stand.

- tests/output/website-preview-booking.json: zwölf HTTP-/Aliasprüfungen, echte parallele Buchungsversuche über Vercel/Supabase mit genau einem Gewinner, Secure-Cookie, anonymer Zugriffsschutz, Verschiebung, Versionskonflikt und Absage erfolgreich. Gastlink verweist auf die Preview; Nachrichten bleiben ohne Versand in deren verschlüsselter Outbox. Alle hierfür angelegten Gast-/Outbox-Testdatensätze wurden aus der Preview entfernt.
- tests/output/website-calendar-final-a11y.json: nach den Korrekturen keine Verletzungen oder unvollständigen Prüfpunkte mehr auf der Kalenderseite. tests/output/website-preview-final-a11y.json und website-preview-desktop-a11y.json: Preview-Startseite ebenfalls ohne gemeldete Verletzungen; sichtbare mobile und Desktopdarstellung geprüft.
- Performance-Stichprobe in website-preview-vitals.json: FCP etwa eine Sekunde, CLS 0 im verwendeten Browser. Kein allgemeiner Geschwindigkeitswert oder Feldnachweis; INP und vollständige Hydrierungsmetriken lagen im Werkzeug nicht vor. Der LCP-Datensatz bezog sich auf ein temporäres Bild-Platzhalterelement und wird nicht als belastbarer Bild-LCP gewertet. Tatsächliches Hero-Bild separat als PNG/HTTP 200 und vollständig geladen geprüft; optimierte mobile Fassung ca. 30 KB.
- Aktueller lokaler Produktionsbuild startet unter http://localhost:3001 und liefert den neuen Hero samt weiterhin vorhandenem Bing-Metatag.
- Quellcode, Preisquelle, Datenschutz-/Cookiebeschreibung, Migrationsdateien und Rücknahmestand sind versioniert. README, MASTER_SPEC, ARCHITECTURE und PROGRESS spiegeln den Entwicklungs-/Previewstand; eine Produktionsveröffentlichung oder -migration ist weiterhin offen und benötigt ausdrücklich die Zustimmung des Inhabers.

Abschließende Freigabefrage: Soll dieser geprüfte Stand einschließlich der additiven Gastbuchungsmigration nach erneuter aktueller Sicherung auf avelsorn.de veröffentlicht werden? Vor Zustimmung kein Push auf main und keine produktive Migration.


### Rücknahmebuild geprüft

Der gastfähige Rücknahmestand 3653ca7 wurde zusätzlich in einem getrennten lokalen Worktree erfolgreich als Produktionsbuild kompiliert und typgeprüft (website-rollback-build.json). Für die lokal gemeinsam genutzten node_modules wurde ausschließlich dort der Turbopack-Auflösungsroot auf den Projektordner gesetzt; Produktquellen und Daten blieben unverändert. Diese lokale Abhängigkeitsauflösung ist keine Produktionskonfiguration. Die Build-Prüfung umfasst nicht die Veröffentlichung des Rücknahmestands.
