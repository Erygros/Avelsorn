# Lokale Ausführung und spätere Übergabe

Next.js, TypeScript, React, Tailwind CSS. Node.js 24 LTS und npm. Keine eigene Hostinginfrastruktur. Spätere Übergabe über GitHub/Vercel vorgesehen; keine Veröffentlichung oder Kontoverbindung. Die geprüfte Befehlsfolge wird während der Implementierung ergänzt.

Lokale PostgreSQL-Daten liegen ignoriert in data/. Geschäftliche Stammdaten in der Datenbank, Geheimnisse in .env.local oder späteren Plattform-Umgebungsvariablen. Vor späterer Bereitstellung: PostgreSQL-Netzwerkdienst, privater Objektspeicher, Checkdomain-SMTP, Basis-URL und gegebenenfalls Video-/Echtzeitprovider auswählen und konfigurieren. Lokales Dateisystem und PGlite dürfen auf Vercel keine dauerhaften Geschäftsdaten speichern. Produktionscheck blockiert solche Konfigurationen.

Migrationen versioniert über CLI. Updates mit vorherigem Backup, anschließender Fach-/Sicherheitsprüfung und geprüftem Rückweg. Hintergrundaufgaben einzeln ausführbar und idempotent. Scheduler-Auswahl extern.

Checkdomain ausschließlich Domain/DNS und geschäftliche E-Mail. Keine Einrichtung, Bestellung oder Bereitstellung von Hosting, Servern, Signalisierung oder TURN. Externe Zugänge und Nutzerfreigabe bleiben Freigabebedingungen.

## Geprüfte lokale Befehle

```powershell
npm ci
npm run setup:local
npm run dev
```

Adresse: http://localhost:3001. `setup:local` erzeugt die ignorierte `.env.local` mit zufälligen `APP_SECRET`, `SETUP_KEY`, `BACKUP_KEY` und `TASKS_SECRET`. Keine Schlüssel in Tickets, Chats oder Repository kopieren. Ersteinrichtung unter `/einrichtung`; der Betreiber vergibt E-Mail und Passwort selbst. Der einzelne Adminzugang verlangt anschließend einen tatsächlichen E-Mail-OTP.

Ohne SMTP lassen sich erzeugte Nachrichten unter `/entwicklung/email` mit dem lokalen Einrichtungsschlüssel lesen. Das ist ein Entwicklungsadapter, kein behaupteter E-Mail-Versand. In `PLATFORM_ENV=production` und auf Vercel ist dieses Werkzeug gesperrt.

```powershell
npm run typecheck
npm run lint
npm test
npm run build
npm start
```

`start` führt den lokal gebauten Next.js-Server ebenfalls auf Loopback-Port 3001 aus. Es wird dadurch nichts öffentlich veröffentlicht. Der lokale Datenbankadapter erlaubt nur einen schreibenden Prozess pro Datenverzeichnis. Anwendung vor Migrationen, Setup oder direkter Datenbankdiagnose stoppen. Nach einem erzwungenen Prozessabbruch kann die verwaiste Dateisperre bis zu 15 Sekunden benötigen, bevor sie als veraltet erkannt wird.

## Hintergrundaufgaben

Bei laufender Anwendung:

```powershell
npm run tasks
```

Der Aufruf verwendet `TASKS_SECRET` und POST `/api/tasks`. So arbeitet auch lokal nur der laufende Anwendungsprozess mit den PGlite-Dateien. Eine direkte Ausführung über `npm run tasks -- --direct` ist ausschließlich bei gestoppter Anwendung vorgesehen. Es wird kein Cronjob oder externer Scheduler eingerichtet.

Der Aufgabenlauf verarbeitet Reservierungsablauf, fällige Erinnerungen, Paketstatus, geplante Beiträge, Dokumentversand, Datei-Aufbewahrung, begrenzte Mailübergaben, tägliche Sicherung und Backup-Aufbewahrung. Unklare SMTP-Übergaben werden getrennt behandelt; ein Posteingang wird nie allein aus SMTP-Akzeptanz behauptet.

## Verschlüsselte Sicherung und Wiederherstellung

Der `BACKUP_KEY` muss getrennt gesichert werden. Ohne diesen Schlüssel lässt sich eine verschlüsselte Sicherung nicht wiederherstellen. Datenbankdaten, Geschäftseinstellungen, private Dateien und der verschlüsselt eingeschlossene Anwendungsschlüssel werden gesichert. Externe Zugangsdaten sind zusätzlich im eigenen sicheren Geheimnisspeicher vorzuhalten.

```powershell
npx tsx bin/restore.ts <Sicherungsdatei> <neuer-leerer-Zielordner>
```

Der Zielordner darf noch nicht existieren. Das Werkzeug entschlüsselt die Sicherung, migriert eine isolierte lokale Datenbank, stellt Tabellen und Dateien wieder her und schreibt die wiederhergestellte Konfiguration ausschließlich nach `.env.restored` im neuen Zielordner. Es überschreibt keine bestehende Hauptdatenbank. Vor Umschaltung Inhalt, Berechtigungen und Geschäftsprozesse im isolierten Ziel prüfen. Wiederherstellungstests sind von einem produktiven Restore zu unterscheiden.

## Vorbereitung einer späteren GitHub-/Vercel-Übergabe

Das Repository enthält keine benötigten Produktionspasswörter. `npm ci` und `npm run build` sind die reproduzierbare Grundlage. Ein künftiger Betreiber konfiguriert `DATABASE_URL`, privaten Objektspeicher, SMTP, öffentliche HTTPS-Basis-URL und gesonderte Sicherheitsgeheimnisse. Für den Telefonstart gilt VIDEO_DRIVER=disabled. Optionale Videogespräche nach vollständiger Zahlung setzen einen konfigurierten Videodienst voraus. Die Netzwerkdatenbank wird kontrolliert mit `npm run db:migrate -- --allow-production` migriert; vorher Sicherung und Wartungsfenster einplanen. Keine Migration läuft automatisch in einer öffentlichen Anfrage.

Lokales PGlite und lokaler Dateispeicher werden im Produktionsmodus ausdrücklich abgewiesen. Ein öffentliches Startsignal erfordert vollständige Pflichtangaben und `PRODUCTION_APPROVED=true`; weitere Abnahmekriterien in RELEASE_READINESS.md bleiben verbindlich. Eine Vercel-Instanz, Datenbank, Domain, Mailbox oder Videoressource wurde in dieser Arbeit nicht bestellt oder eingerichtet.
