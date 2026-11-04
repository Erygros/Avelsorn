# Gemeinsame Portal-Anordnung

Stand: 29.10.2026. Auf Nutzerwunsch wird die kompakte Admin-Anordnung auch für das Kundenportal eingesetzt. Funktionen und Datensicht bleiben rollenabhängig.

## Gemeinsamer Rahmen

PortalShell verwendet für beide Rollen dieselbe feste Seitenleiste auf Desktop, dieselbe feste Bereichsleiste auf kleinen Bildschirmen, einen haftenden Kopfbereich und kontextbezogene Unterseiten. Gemeinsame CSS-Regeln sind unter portal-compact geführt. Die Auswahlkomponente PortalSectionSelect ersetzt die frühere ausschließlich für Admin benannte Variante. Ziele stammen aus den fest definierten Links der jeweiligen Rolle; die Auswahl navigiert nur zu einem vorhandenen Eintrag.

## Kundenbereiche

| Bereich | Unterseiten |
| --- | --- |
| Übersicht | Eigene Termine, Pakete, Projekte und Zahlungen |
| Termine | Terminübersicht, Buchung, zugeordneter Videotermin |
| Projekte | Projekte, Aufgaben, Dateien, Freigaben |
| Pakete | Pakete, Zeitnachweise |
| Dokumente | Angebote, Rechnungen |
| Nachrichten | Chat, Mitteilungen, Support |
| Konto | Profil, Fragebogen, Datenschutz, Link zum öffentlichen Widerruf |

Die langen früheren Seitentitel sind in der Navigation durch kurze Begriffe ersetzt. Alle bisherigen Kundenrouten bleiben erhalten. Keine Adminlinks oder Verwaltungsaktionen werden eingeblendet. Vorhandene serverseitige Rollen-/Eigentumsprüfungen bleiben bestehen.

## Kundenübersicht

Vier Kennzahlen und vier Inhaltsbereiche im selben Raster wie beim Admin: nächstes Gespräch, persönliche Neuigkeiten, eigene Projektvorschau und Links zu den eigenen Unterlagen/Rückfragen. Die Paketzahl berücksichtigt bestätigte bezahlte Leistungspakete sowie noch laufende alte Verträge. Der Datenabruf ist ausdrücklich auf die angemeldete Kunden-ID begrenzt. Aus einer Zahlung entstehen hier keine neuen Daten; dies ist ausschließlich eine Darstellung vorhandener Bestellungen.

## Prüfnachweise

- 41 vorhandene Funktionstests, ESLint, TypeScript und Produktionsbuild erfolgreich.
- bin/verify-admin-workspace.mjs: 43 vorhandene Admin-/Kundenseiten, sechs ausgeschlossene persönliche Seiten im Adminbereich und Zugriffssperre für Kunden, insgesamt 50 HTTP-Prüfungen. Kundenseiten enthalten keine Adminlinks; Widerruf bleibt unter Konto erreichbar.
- tests/output/customer-workspace-responsive.json: sechs Kunden-Viewports einschließlich 320 px Breite und 320 px Höhe. Sieben sichtbare Links mit Icons, kein interner Navigationsüberlauf, feste Position vor/nach Scrollen, vier Inhaltsbereiche.
- tests/output/customer-workspace-admin-regression.json: Adminrahmen nach der gemeinsamen Umstellung bei 1440 und 390 px erhalten.
- Screenshots und axe-Prüfungen: tests/output/customer-workspace-*.png/json. Keine vollständige WCAG- oder Produktionsfreigabe.

Keine neuen Konten, Geschäftsvorgänge, externen Dienste oder Datenbankschemaänderungen für diese Etappe.
