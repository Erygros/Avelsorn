# Redaktion und Gestaltung der öffentlichen Seiten

Stand: 28.10.2026. Nutzerauftrag: erkennbare KI-Schablonen und austauschbare Gestaltung auf den öffentlichen Seiten suchen und überarbeiten.

## Bewertungsmaßstab

Die Prüfung umfasst sichtbare Texte, Titel, Navigation, Handlungsaufforderungen, wiederkehrende Gestaltung und die verwendeten Bilder. „Nicht generisch“ ist eine redaktionelle Beurteilung, kein messbarer Nachweis der menschlichen Urheberschaft. Bewertet wurde, ob eine Aussage eine konkrete Aufgabe, einen Ablauf, einen Preis oder ein prüfbares Arbeitsergebnis beschreibt. Allgemeine Bedienbegriffe wie „Anmelden“, formale Rechtsinformationen und echte Herkunftskennzeichnungen sind keine zu ersetzenden Werbeschablonen.

## Befunde und Umsetzung

| Bereich | Gefundene Muster | Änderung |
| --- | --- | --- |
| Startseite | „Gemeinsam geht es weiter“, „Gute Zusammenarbeit beginnt mit Transparenz“, unpassend wiederholte Compass-/Layers-/Monitor-Symbole, zusätzlicher Schluss-Slogan | Benannte Aufgaben je Leistung, kompakte verlinkte Leistungszeilen, tatsächlicher Auftragsablauf, Preisangaben aus der Produktkonfiguration; zusätzliche Werbe-Schlusssektion entfernt |
| Leistungsseiten | „Mehr Zeit fürs Wesentliche“, „Deine Idee verdient einen guten Anfang“, abstrakte Nutzenversprechen | Für alle sieben Leistungen Aufgaben, benötigte Informationen und mögliche Ergebnisse beschrieben; Pfeile aus nicht anklickbaren Themenlisten entfernt |
| Preise | „Klarer Umfang. Ein fairer Rahmen“, „Rundum-Begleitung“ | Sachliche Überschrift, Produkte nach Dauer und Kontingent benannt; Schlüssel, Preise, Zeiträume und Buchungsregeln erhalten |
| Erstgespräch, Ablauf und Kontakt | Motivationssätze, „Richtung finden“, wiederholte Gesprächsaufrufe | Registrierung, Fragebogen, Buchung, Beauftragung und Prüfung der Ergebnisse beschrieben; eindeutige Links, doppelten globalen Schlussaufruf entfernt |
| Zielgruppen | Teilweise situative Werbeüberschriften | Kürzere Titel zu Anfragen, Website, Gründung, Briefings und Contentarbeit; eigenständige Inhalte und Beispiele erhalten |
| Über Avelsorn | „Persönlich an Deiner Seite“, „ein Blick von außen“, Behauptungen über nicht vorhandene persönliche Vorstellung | Tatsächliche Arbeitsweise beschrieben; fehlende persönliche Angaben sachlich benannt, keine Vita oder Referenzen ergänzt |
| Blog | Fünf ähnlich aufgebaute allgemeine Ratgeber mit abstrakten Einstiegen und wiederholten Schlussformeln | Fünf unterschiedliche Arbeitsanleitungen: erstes Angebot, Website-Umfang, vier Beiträge, Website-Vorbereitung, Bearbeitung einer Kundenanfrage. Beispiele sind ausdrücklich Beispiele, keine Kundenreferenzen |
| Zugang und Cookies | „Gut, dass Du da bist“, „Ein letzter Sicherheitsschritt“, dekoratives „Idee. Richtung. Umsetzung.“, „Nur das, was Du möchtest“ | Titel benennen die konkrete Handlung; dekorative Auth-Grafik und doppelte Formulartitel entfernt; Formularfunktionen erhalten |
| Gemeinsamer Rahmen | „Persönlich. Praktisch. Digital.“, „Gemeinsam den nächsten Schritt finden“, „Impulse“ | Benannte Leistungen, eindeutige Erstgesprächslinks und „Blog“; Avelsorn-Identität erhalten |
| Fehlerseiten | Vage „Hier geht es gerade nicht weiter“ / „Versuchen wir es noch einmal“ | „Seite nicht gefunden“ beziehungsweise „Die Seite konnte nicht geladen werden“ |
| Rechtliche Seiten | Formale Standardbegriffe, Entwicklungsstatus und Pflichtangaben | Auf sachliche Verständlichkeit geprüft; rechtliche Sachinformationen erhalten, nur zwei beschreibende Einleitungen präzisiert. Keine rechtliche Freigabe erfolgt |

## Bilder und Marke

Alle sechs gelieferten Motive wurden visuell geprüft. Im Hero und Website-Motiv waren Fantasiebeschriftungen erkennbar. Zwei bearbeitete Varianten ohne diese Beschriftungen liegen in public/editorial/hero-cleaned.png und website-cleaned.png. Die Originaldateien im Projektstamm bleiben erhalten. Motivzuordnung, vollständiges Seitenverhältnis und responsive Next/Image-Auslieferung bleiben bestehen. Die Kennzeichnung als KI-generiertes Motiv wird nicht entfernt oder als echte Büro-/Kundenfotografie umgedeutet. Die übrigen vier Motive werden weiterhin als konzeptionelle Illustrationen verwendet.

Die Avelsorn-Wortmarke, Farben und Arial-Vorgabe aus dem Markenblatt bleiben verbindlich. Keine neuen Oberzeilen, Animationseffekte, erfundenen Bewertungen oder Referenzen ergänzt. Lange Titel und die mobilen Karten sind für schmale Ansichten angepasst; Wortumbrüche verhindern Überlauf. Titel werden nicht mehr künstlich mit manuellen Zeilenumbrüchen zu Werbesätzen gestapelt.

## Daten und Nachvollziehbarkeit

Die fünf vorhandenen Veröffentlichungen wurden tatsächlich in der lokalen Datenbank überarbeitet. bin/revise-editorial-articles.ts vergleicht sie vor einer Änderung mit einer gesicherten Ausgangsfassung, verweigert das Überschreiben unabhängig bearbeiteter Texte und schreibt Änderungen transaktional mit Auditnachweis. Vor jeder Änderung liegt eine Sicherung in data/editorial-backups. Veröffentlichungszeitpunkt und Artikel-Slug bleiben bestehen. Eine nachfolgende Titelverkürzung ist gesondert gesichert und auditiert.

Die lokale Inventur in tests/output/editorial-inventory.json erfasst zusätzliche CMS-Seiten sowie sämtliche Artikel und deren Übereinstimmung mit der aktuellen Quelle. Zum Prüfzeitpunkt existieren keine zusätzlichen CMS-Seiten. Die fünf publizierten Artikel sind daher vollständig erfasst. Kein Testkunde und keine simulierte externe Integration wurden angelegt.

## Prüfnachweise

- bin/verify-public-copy.ts: 42 öffentliche Seiten, aktuelle Leistungs- und Artikeltexte, erhaltene Preise, Titelstruktur und Markenbezeichnung; drei alternative URLs samt Canonicals, unbekannte Seite mit HTTP 404.
- tests/inspect-public-editorial.js: tatsächlicher gerenderter Hauptinhalt, Überschriften, Links, Bildkennzeichnung und Viewport-/Dokumentbreite. Desktop-/Mobilnachweise in tests/output/editorial-*.json/png. Alle 42 regulären öffentlichen Seiten bei 320 px geprüft; anfangs gefundene Überläufe und unpassende lange Titel korrigiert.
- Manuelle Textprüfung aller öffentlichen Seitentypen, der fünf Artikel und der sechs Motive; erneute Sichtprüfung der korrigierten Mobilansichten. Eine Wortlistenprüfung ist nur ein Zusatznachweis und ersetzt die redaktionelle Prüfung nicht.
- TypeScript, ESLint, 33 bestehende Funktionstests und Produktionsbuild erfolgreich. Gesonderte axe-Nachweise für Startseite und Artikel; keine vollständige WCAG-Abnahme daraus abgeleitet.
- Vorschau ausschließlich lokal auf Port 3001. Rechtliche Stammdaten, produktive externe Dienste und Veröffentlichungsfreigabe bleiben eigene offene Aufgaben der Gesamtplattform.
