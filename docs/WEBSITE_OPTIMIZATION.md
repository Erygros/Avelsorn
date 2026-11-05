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
2. [ ] Home und Positionierung nach Wortlaut des Auftrags, Originalbild und zwei klare CTAs.
3. [ ] Drei Servicekategorien; alle sieben bisherigen Detailseiten mit konkretem Aufbau.
4. [ ] Pakete mit sichtbarem Umfang und Ergebnis, unveränderten zentralen Preisen.
5. [ ] Sichere Gastbuchung mit gemeinsamer Kollisionsprüfung, echten gespeicherten Terminen und CRM-/Mail-/Reminderintegration. Reguläre Kontobuchung erhalten.
6. [ ] Persönliche Über-Avelsorn-Seite ohne erfundene Erfahrung oder Fotos.
7. [ ] Gekennzeichnete allgemeine Projektbeispiele und belegbare Portalvorteile.
8. [ ] Navigation, Canonicals/Metadaten, Sitemap, Responsivität und Tastaturbedienung.
9. [ ] Bestehende Kunden- und Adminprozesse auf Regressionen prüfen.
10. [ ] TypeScript, ESLint, vollständige Tests, Build, Integration, Browser, Barrierefreiheit und Performance.
11. [ ] Vollständige Dokumentation, isolierte Preview und konkrete abschließende Freigabevorlage.

## Verbindliche Freigabegrenze

Die frühere Freigabe für den damaligen Stand gilt nicht als Freigabe dieses neuen Auftrags. Kein Push auf main, keine produktive Migration, keine Änderung produktiver Stammdaten oder Zugangsdaten. Änderungen bleiben lokal und in einer isolierten Preview bis zur neuen ausdrücklichen Freigabe. Fehlende externe Nachweise werden benannt.
