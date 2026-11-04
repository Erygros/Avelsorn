# Zielgruppenseiten – 28.10.2026

Nutzerauftrag: Zielgruppenreihe auf der Startseite gestalterisch hervorheben und jede der fünf Zielgruppen mit einer eigenen Unterseite verknüpfen.

| Seite | Schwerpunkt |
| --- | --- |
| /zielgruppen/unternehmen | Anfragen, Übergaben, bestehende Websites, interne Werkzeuge |
| /zielgruppen/selbststaendige | Laufendes Geschäft, Leistungsbeschreibung, Kundenorganisation |
| /zielgruppen/gruender | Angebotsklärung, Startumfang, erster digitaler Auftritt |
| /zielgruppen/freelancer | Portfolio, Briefing, Projektgrenzen und Freigaben |
| /zielgruppen/creator | Contentplanung, Mediakit, Kooperationsanfragen |

Inhalte zentral in src/content/audiences.ts, gemeinsame serverseitige Darstellung in src/app/zielgruppen/[audience]/page.tsx. Beispiele sind ausdrücklich mögliche Aufträge, keine behaupteten Kundenreferenzen. Beratung und Projektarbeit werden konkret beschrieben; keine erfundenen Qualifikationen, Reichweiten oder Erfolgszahlen.

## Gestaltung und Zugänglichkeit

Avelsorn-Farben und Arial bleiben verbindlich. Die Startseite zeigt fünf große Textlinks mit einer feinen oberen Linie und einem dekorativen Pfeil. Desktop: fünf Spalten; Tablet: drei; Mobilgerät: untereinander. Salbeigrün bei Hover und Tastaturfokus, sichtbarer Fokusrahmen, mindestens 52 px Linkhöhe, reduzierte Bewegung nach Systemeinstellung. Unterseiten haben Brotkrümelnavigation, eine Hauptüberschrift, Aufgabenbereiche, ein ausdrücklich bezeichnetes Beispiel, Fragen zur Zusammenarbeit und Links zu passenden Leistungen.

## Suchmaschinen

Jede Zielgruppe hat eine eigenständige Suchabsicht und eigenen Inhalt, Titel, Meta-Beschreibung, kanonische URL und Open-Graph-Daten. BreadcrumbList beschreibt den sichtbaren Navigationspfad. Verlinkung über Startseite, Zielgruppenübersicht, passende Leistungen und verwandte Zielgruppen; die Übersicht ist zusätzlich im Footer und mobilen Menü erreichbar. Neue Seiten sind in der Sitemap-Funktion enthalten. Lokales noindex und die vorhandene Veröffentlichungssperre bleiben aktiv; keine Indexierung oder Rankingverbesserung behauptet.

Die Umsetzung orientiert sich an Googles [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide) und den [Hinweisen zu Doorway Abuse](https://developers.google.com/search/docs/essentials/spam-policies#doorway-abuse): hilfreiche, eigenständige Inhalte in nachvollziehbarer Seitenstruktur statt weitgehend identischer Einstiegsseiten. Die Seitenanzahl allein ist kein Nachweis eines Rankingeffekts.

## Nachweise

- npx tsx bin/verify-audiences.ts: fünf HTTP-200-Seiten, jeweils eigene Titel/Beschreibung, genau eine H1, passende kanonische URL und Breadcrumb-Daten, Links von Startseite und Übersicht sowie Zielprüfung interner Links. Unbekannte Zielgruppe liefert HTTP 404.
- tests/inspect-audiences.js und tests/output/audiences-*.json/png: Desktop- und Mobilansichten, Linkabmessungen und Überlaufprüfung.
- Axe Unternehmen Desktop und Creator bei 320 px: jeweils 41 Prüfungen bestanden, keine Verstöße oder unvollständigen Prüfungen. Startseiten-Zielgruppenbereich bei 320 px: 14 bestanden, keine Verstöße oder unvollständigen Prüfungen. Daraus folgt keine vollständige WCAG-Abnahme.
- TypeScript, ESLint und Produktionsbuild erfolgreich. Keine Datenmigration oder externe Einrichtung erforderlich.
