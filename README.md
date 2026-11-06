# Digitale Unternehmensberatungsplattform

Next.js · TypeScript · React · Tailwind CSS · serverseitiges Backend · PostgreSQL-Abstraktion

Vollständige Spezifikation mit vorrangiger Architekturkorrektur: [MASTER_SPEC.md](MASTER_SPEC.md). Tatsächlicher Fortschritt: [PROGRESS.md](PROGRESS.md). Die bestehende Website ist unter https://www.avelsorn.de veröffentlicht. Die neue öffentliche Optimierung wird auf codex/website-optimierung entwickelt und benötigt eine eigene abschließende Freigabe.

Lokal echte persistente PostgreSQL-Daten über PGlite. Die bestehende Produktionspipeline läuft über GitHub/Vercel, PostgreSQL und privaten S3-Speicher bei Supabase sowie SMTP bei Checkdomain. Lokal bleiben Datenbank, Speicher und Mailausgang getrennte Entwicklungsadapter. Video ist in Produktion deaktiviert. Checkdomain nur Domain/E-Mail; keine eigene Hostinginfrastruktur.

Siehe [ARCHITECTURE.md](ARCHITECTURE.md), [DEPLOYMENT.md](DEPLOYMENT.md), [SECURITY.md](SECURITY.md), [RELEASE_READINESS.md](RELEASE_READINESS.md).

## Lokal starten

Voraussetzung: Node.js 24 LTS.

```powershell
npm ci
npm run setup:local
npm run dev
```

Die Vorschau läuft unter http://localhost:3001. Die lokale Einrichtung erzeugt zufällige Schlüssel in `.env.local`, migriert die echte PostgreSQL-Entwicklungsdatenbank und legt fünf eigenständige redaktionelle Beiträge an. Sie erzeugt keine Kunden oder Administratorpasswörter.

Ein Administratorkonto kann der Betreiber unter `/einrichtung` mit seinem lokalen `SETUP_KEY` und einem selbst gewählten Passwort anlegen. Ohne SMTP stehen tatsächliche Systemnachrichten ausschließlich im geschützten lokalen Mailausgang unter `/entwicklung/email`; dieser ist im Produktionsmodus gesperrt.

```powershell
npm run check
npm run tasks
```

`check` führt Typprüfung, Lint, Tests und Build aus. `tasks` ruft die laufende lokale Anwendung über die geschützte Aufgabenschnittstelle auf. Migrationen und direkte Datenbankwerkzeuge ausschließlich bei gestoppter lokaler Anwendung ausführen; eine Prozesssperre schützt die PGlite-Dateien vor parallelen Schreibern.

Die isolierte Browser-QA verwendet eigene Datenverzeichnisse und eigene zufällige Testzugänge. Sie ist von der Hauptdatenbank getrennt. Prüfnachweise liegen in `tests/output/`, der vollständige Status in `PROGRESS.md`.


## Öffentliche Optimierung und Gastbuchung

Startseite, Leistungen, Pakete, Navigation und persönliche Vorstellung verwenden die vorhandenen Markenassets. Einstiegspreise und Paketumfang bleiben zentral in src/content/service-packages.ts. Allgemeine Leistungsbeispiele sind ausdrücklich keine Referenzen.

Gastbuchungen für kostenlose Telefontermine werden getrennt von Kundenkonten gespeichert. Ein persönlicher E-Mail-Link öffnet den Termin; Kundenregistrierung, Verifizierung und Projektprozesse bleiben bestehen. Migration 0008 ist additiv. Vor einer genehmigten Produktionsmigration eine aktuelle verschlüsselte Sicherung erstellen. Keine automatische Migration beim Build.

Entwicklungs-/Preview-Isolation, Prüfnachweise und Veröffentlichungsgrenze: [docs/WEBSITE_OPTIMIZATION.md](docs/WEBSITE_OPTIMIZATION.md). Die Preview verwendet eine eigene Datenbankrolle und ein separates Schema im vorhandenen Supabase-Projekt sowie einen eigenen Dateipräfix. Sie übernimmt keine Kunden-, Vertrags- oder Zahlungsdaten. E-Mails werden dort ausschließlich in der verschlüsselten Outbox gespeichert und nicht versendet; Video und Zeitpläne sind nicht eingerichtet.

Reproduzierbare lokale QA: npm run qa:prepare, npm run build, npm run qa:serve. In einem weiteren Terminal node bin/qa-bootstrap.mjs und node bin/verify-calendar-e2e.mjs ausführen; danach node bin/verify-website-guest.mjs. Das nutzt ausschließlich http://localhost:3011 und getrennte Testdaten. Vorhandene Paket-/Portalprüfungen bleiben erhalten. Die responsive Browserprüfung bin/verify-website-public.mjs nutzt den vorhandenen agent-browser und das gespeicherte Seiteninventar; AGENT_BROWSER_BIN kann dessen Pfad überschreiben. Prüfergebnisse werden unter tests/output abgelegt.


Der freigegebene Stand ist seit dem 06.11.2026 auf https://www.avelsorn.de veröffentlicht. Die geschützte Entwicklungs-Preview erfordert die Vercel-Anmeldung. Die lokale Ansicht läuft unter http://localhost:3001. Lokale Produktionsserver vor einem erneuten Build beenden und anschließend neu starten, damit keine Build-Artefakte verschiedener Stände gemischt werden.

## Suchanalyse und Inhaltskatalog

Branchen, Lösungen und Ratgeber stehen in `src/content/search/`. [Der Inhaltskatalog](docs/SEARCH_CONTENT_MAP.md) ordnet jede Seite einem konkreten Anliegen zu. Der [SEO-, GEO- und AEO-Audit](docs/SEO_GEO_AEO_AUDIT.md) dokumentiert den bisherigen Live-Stand, die technischen Prüfungen, die Grenzen der Messung und die Schritte zur Freigabe.

```powershell
npm run seo:audit -- --base=http://localhost:3001 --catalog
npm run seo:indexnow
```

Der erste Befehl prüft die laufende lokale Website. Der zweite liest die produktive Sitemap und meldet standardmäßig nur, was für IndexNow vorbereitet ist. Es gibt keinen automatischen Versand beim Build. Ergebnisse der Prüfungen stehen in `tests/output/`.
