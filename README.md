# Digitale Unternehmensberatungsplattform

Next.js · TypeScript · React · Tailwind CSS · serverseitiges Backend · PostgreSQL-Abstraktion

Vollständige Spezifikation mit vorrangiger Architekturkorrektur: [MASTER_SPEC.md](MASTER_SPEC.md). Tatsächlicher Fortschritt: [PROGRESS.md](PROGRESS.md). Im Aufbau, keine Produktionsfreigabe.

Lokal echte persistente PostgreSQL-Daten über PGlite. Vorbereitung für spätere Übergabe über GitHub/Vercel mit konfigurierbaren Datenbank-, Speicher-, SMTP- und Videoschnittstellen. Checkdomain nur Domain/E-Mail; keine eigene Hostinginfrastruktur.

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
