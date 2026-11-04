# Admin-Arbeitsbereich

Stand: 29.10.2026. Nutzerauftrag: Adminfunktionen von persönlichen Kundenansichten trennen; kompakte feste Navigation mit Icon und kurzem Titel, ohne eigene Scrollleiste.

## Zuständigkeiten

Die Admin-Startseite wird durch die eigene Serverkomponente AdminOverview dargestellt. Vor dem Abruf der Kennzahlen verlangt sie eine überprüfte Admin-Sitzung. Sie zeigt offene Kontakt-/Paket-Anfragen, ungelesene Kundennachrichten, aktive Projekte und offene Zahlungen, außerdem neue Registrierungen und Verwaltungsaktionen. Keine persönliche Kundenbegrüßung, eigener Fragebogen, Paketkauf oder Buchung im eigenen Namen.

Angebote, Rechnungen, Termine, Projekte und Dateien bleiben notwendige Verwaltungsfunktionen. Sie enthalten administrative Aktionen, alle berechtigten Kundenbestände und eine ausdrückliche Kundenzuordnung. Im Kundenportal bleiben Eigentumsfilter, persönliche Daten und Kundenaktionen erhalten. Der frühere gemeinsame Statistikzweig ist entfernt; die Kundenübersicht fragt keinen globalen Kundenbestand mehr ab.

Persönliche Kundenseiten wie /admin/buchen, /admin/profil, /admin/fragebogen, /admin/termine, /admin/freigaben und /admin/support existieren nicht. Kunden erhalten keinen Zugriff auf /admin. Die vorhandenen serverseitigen Aktions- und Eigentumsprüfungen bleiben bestehen.

## Navigation

| Fester Bereich | Verwaltungsseiten |
| --- | --- |
| Übersicht | Eingänge und Kennzahlen |
| Anfragen | Kontakt, Datenschutz, Widerrufe |
| Kunden | Konten, Fragebögen |
| Aufträge | Projekte, Termine, Beratungen, Aufgaben, Zeit, Pakete, Dateien, Chat |
| Finanzen | Angebote, Rechnungen, Zahlungen |
| Inhalte | Blog, Website, E-Mails |
| System | Stammdaten, Konfiguration, Protokoll, Backups, Status, Mitteilungen |

Desktop: sieben feste Links mit Icons links, kontextbezogene Unterpunkte im am oberen Rand haftenden Kopfbereich. Kein internes Scrollen der Navigationsleiste. Geringe Fensterhöhe erhält kompaktere Abstände; alle Links und Abmelden bleiben erreichbar.

Kleine Bildschirme: sieben feste Bereiche in einer zweizeiligen Leiste unten, ohne horizontalen Überlauf. Unterseiten über eine beschriftete native Auswahl im festen Kopfbereich; kein langes ausklappbares Seitenverzeichnis. Der Inhalt hat Platz unterhalb/oberhalb der festen Bedienelemente. Icons sind dekorativ, Titel und Fokus sichtbar; aktive Seiten mit aria-current.

## Prüfungen

- 41 vorhandene Funktionstests bestanden; TypeScript, ESLint und Build geprüft.
- bin/verify-admin-workspace.mjs: 43 Admin-/Kundenseiten, sechs ausgeschlossene Kundenseiten und Zugriffssperre für Kunden, insgesamt 50 HTTP-Prüfungen. Keine Links aus Adminansichten ins Kundenportal.
- Layout-/Scrollmessungen und Screenshots: tests/output/admin-workspace-*.json/png.
- Automatische axe-Ergebnisse separat dokumentiert; keine vollständige WCAG- oder Produktionsfreigabe.

Keine Datenbankmigration, keine neuen Testkonten, keine externen Integrationen. Bestehende Haupt-/Testdatenbanken erhalten.
