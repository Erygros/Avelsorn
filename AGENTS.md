# Projektregeln

## Auftrag und Wahrhaftigkeit
- MASTER_SPEC.md enthält den vollständigen Produktauftrag mit vorrangiger Architekturkorrektur. docs/MASTER_SPEC_ORIGINAL.md bewahrt das Original. Alle Anforderungen in docs/requirements.json und PROGRESS.md verfolgen.
- Keine Anforderung ohne Implementierung und konkreten Prüfnachweis als erledigt markieren. Produktionsbereitschaft niemals aus einer lokalen Vorschau ableiten.
- Bestehende Nutzerdateien erhalten. Keine Veröffentlichung, kostenpflichtigen Verträge oder Ausgaben ohne ausdrückliche Freigabe.
- Externe Stammdaten und Zugangsdaten dürfen lokale Entwicklung nicht blockieren. Produktionsfreigabe bei fehlenden Pflichtwerten blockieren.

## Architektur und Qualität
- Ausschließlich Next.js, TypeScript, React, Tailwind CSS und serverseitiges Backend. PostgreSQL-Abstraktion mit lokalem persistentem PGlite und konfigurierbarem Netzwerkadapter. Assets lokal ausliefern.
- Architektur für GitHub/Vercel. Checkdomain nur Domain/E-Mail. Keine eigene Hosting-, Signalisierungs- oder TURN-Infrastruktur entwickeln, konfigurieren oder bereitstellen. Video-/Echtzeitdienste über Schnittstellen einbinden; keine produktive Einrichtung behaupten.
- Geschäftsvorgänge serverseitig validieren und transaktional ausführen; Geld in Cent, Zeiten in Sekunden/UTC, Anzeige Europe/Berlin.
- Datenzugriffe immer über Eigentumsprüfung oder Adminberechtigung. Änderungen mit Auditnachweis. Geheimnisse ausschließlich in ignorierter Serverkonfiguration.
- Keine vorgetäuschten Inhalte, Testkunden oder simulierten externen Integrationen im Produkt.
- Nach jeder Etappe relevante Tests ausführen, Startfähigkeit prüfen und PROGRESS.md aktualisieren.
- Deutsche Du-Ansprache, helle schwarz-weiß-graue Gestaltung, semantisches HTML, Tastaturbedienung und WCAG 2.2 AA als Ziel.
- Keine Subagenten beauftragen, sofern der Nutzer dies nicht ausdrücklich verlangt.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
