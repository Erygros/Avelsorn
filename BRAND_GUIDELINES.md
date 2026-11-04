# Avelsorn – Markenanwendung

Seit Nutzerfreigabe vom 28.10.2026 gilt ausschließlich Avelsorn mit den bereitgestellten Assets aus Avelsorn_Markenblatt.pdf (Version 1.0). Name und Assetpfade stehen zentral in src/content/brand.ts; business().brand_name liefert dieselbe Identität. Ein abweichender Markenname ist im Stammdatenformular nicht mehr editierbar. Andere fehlende rechtliche Unternehmensangaben bleiben ehrlich als offen gekennzeichnet. Es werden keine Personen, Kunden, Referenzen oder Qualifikationen erfunden.

## Gestaltung

Öffentliche Texte benennen konkrete Aufgaben, Voraussetzungen, Aufwand und mögliche Arbeitsergebnisse. Keine austauschbaren Motivationssätze, Dreier-Slogans oder künstlich gestapelten Werbeüberschriften. Symbole müssen eine Funktion erklären; wiederholte Zufallssymbole auf Leistungskarten entfallen. Die Startseite verwendet stattdessen verlinkte Leistungszeilen. Redaktionsbeispiele werden ausdrücklich als Beispiele bezeichnet. Der vollständige Überarbeitungsnachweis steht in docs/REDAKTION_UND_GESTALTUNG.md.

Auf Nutzerwunsch vom 28.10.2026 keine dekorativen Oberzeilen über Seiten-, Abschnitts- oder Kartentiteln. Die Titel stehen eigenständig. Echte Metadaten wie Projektkategorie, Nachrichtendatum oder Empfänger gehören zum Datensatz und stehen unter seinem Titel; Preis- und Statusinformationen bleiben als solche erhalten. Diese Regel gilt auch für Authentifizierung, Portale und Cookie-Hinweise.

Premium Editorial in hellem Modus. Papierweiß #FFFFFF, Text #22251F, Sekundärtext #62665D, Trennlinien #DEDFD9, Flächen #F5F6F2, zurückhaltender Fokus #687F52. Der geringe grünliche Anteil dient der ruhigen Orientierung; keine zusätzliche bunte Akzentwelt. Kontraste werden gemessen und bei Fehlern angepasst.

Kommunikation gemäß Markenblatt: Arial mit system-ui-Fallback, auch für Überschriften, Portale, E-Mail und neu erzeugte Belege. Keine externen Fontanfragen. Das Logo besteht ausschließlich aus der bereitgestellten Grafik, nicht aus nachgesetztem Text. Keine automatische Unterzeile, Effekte oder Verläufe.

Die bisherige Linienfigur und das alte SVG-Favicon sind entfernt. Technischer Befund: Trotz des Hinweises „Vektor-Master“ enthält die PDF tatsächlich Rasterbilder mit separaten Transparenzmasken, keine Logo-Vektorpfade und keine angehängten Quelldateien. bin/extract-brand-assets.py extrahiert diese unverändert nach public/brand; source.json dokumentiert PDF-Prüfsumme und Bildobjekte. Kein nachgebautes oder als Vektor ausgegebenes Rasterlogo.

Wortmarke positiv/negativ: 3200 × 712 px; Signet: 2048 × 2176 px; Profil: 1024 × 1024 px. Favicon.ico verwendet die drei tatsächlich gelieferten 16-/32-/48-Pixel-Grafiken, nicht nur verkleinerte Profilbilder. Apple-Icon: 180 px aus dem gelieferten Profil. Das Link-Vorschaubild zeigt ausschließlich die Original-Wortmarke auf Hellfläche.

Markenblatt: horizontal mindestens 160 px sichtbare Kontur, Signet mindestens 24 px, vereinfachtes Favicon 16 px; Schutzraum mindestens zweimal die rechte Stammstärke. Die Website zeigt die 3200-px-Grafik bei 174 CSS-px (sichtbare Kontur rund 160 px) plus 8 px zusätzlichem Abstand auf jeder Seite. Transparenter Innenraum bleibt erhalten. Keine Beschneidung oder Verzerrung. Kopf, Fuß und beide Portale verwenden dieselbe Brand-Komponente. E-Mails erhalten ein eingebettetes CID-Logo; die lokale Entwurfsvorschau lädt das lokale Logo. Neue Belege betten die Originalgrafik ein; bereits finalisierte, unveränderliche Belege bleiben erhalten.

Auf ausdrücklichen Nutzerwunsch vom 27.10.2026 ersetzen sechs vom Nutzer generierte und bereitgestellte Bildmotive die Platzhalter im Hero und im Blog. Die fotografisch gestalteten Motive sind als KI-generiert gekennzeichnet und stellen weder echte Kundenprojekte noch das tatsächliche Büro dar. Die Original-JPEGs im Projektstamm bleiben unverändert; die Zuordnung und Alternativtexte stehen in src/content/editorial-images.ts. Next/Image liefert responsive Größen und optimierte Formate. Die Motive werden im ursprünglichen Seitenverhältnis angezeigt, damit ihre wichtigen Bestandteile auf Mobilgerät und Desktop sichtbar bleiben.

Raster: maximal 1240 px Inhaltsbreite, großzügige vertikale Abstände, feine Trennlinien, zurückhaltende Karten. Öffentliche Seiten führen über typografische Hierarchie; Portale über echte Statusinformationen und klare Aufgaben. Der Ablauf darf nummeriert sein, Leistungsbereiche werden nicht willkürlich durchnummeriert.

Hero- und Website-Motiv wurden am 28.10.2026 ohne die erkennbaren Fantasiebeschriftungen nachbearbeitet und als eigene Varianten in public/editorial gespeichert. Die sechs gelieferten Original-JPEGs bleiben erhalten. Die Motive bleiben als KI-generiert gekennzeichnet; sie sind keine Aufnahmen tatsächlicher Kundenprojekte oder Geschäftsräume.

Responsive Ansichten bis 390 px werden im Browser geprüft; weitere Gerätebreiten, Zoom und Tastatur sind Teil der Freigabe. Fokusindikatoren bleiben sichtbar, Animationen werden bei prefers-reduced-motion reduziert.

## 404 und Exit-Banner

Die 404-Seite verwendet den öffentlichen Avelsorn-Rahmen, den Fehlercode 404 und direkte Links zu Startseite, Leistungen und Kontakt. Auf Fehlerseiten erscheint kein Exit-Hinweis.

Der Exit-Hinweis wird ausschließlich auf ausgewählten öffentlichen Informationsseiten angezeigt. Er bewirbt das bestehende kostenlose Erstgespräch ohne Rabatt, Countdown oder Bestellwirkung. Mindestverweildauer 20 Sekunden. Auf großen Bildschirmen mit Maus reagiert er auf das Verlassen des oberen Dokumentrands. Auf schmalen Bildschirmen/Touch-Geräten nach mindestens halber gelesener Seite und 240 px Rückscrollen. Kein Abfangen von Zurücknavigation oder Tab-Schließung.

Höchstens einmal je Tab-Sitzung; sessionStorage enthält nur die lokale Kennzeichnung avelsorn-exit-shown=1, keine Kennung oder Übermittlung. Bei gesperrtem Browserspeicher gilt ein Laufzeit-Fallback bis zum Neuladen. Cookie-Auswahl, offene Dialoge, mobile Navigation und aktive Eingabefelder haben Vorrang. Ein nichtmodaler Hinweis ohne Fokusübernahme, schließbar per Schaltfläche, Weiterlesen und Escape; keine Hintergrundsperre oder Animation. Kein Exit-Banner in Formularen, Anmeldung, Portalen oder Rechtsseiten.

## Adminnavigation

Auf Nutzerwunsch sieben feste Arbeitsbereiche mit jeweils Icon und kurzem Titel: Übersicht, Anfragen, Kunden, Aufträge, Finanzen, Inhalte, System. Unterpunkte sind konkrete Verwaltungsseiten; keine zusammengesetzten Navigationstitel mit &. Desktop links, kleine Bildschirme unten; keine eigene Scrollleiste, aktive Bereiche und Tastaturfokus sichtbar. Die Administration verwendet sachliche Verwaltungsbegriffe und eine eigene Eingangsübersicht. Persönliche Kundenaktionen und Kundenslogans erscheinen dort nicht. Details: docs/ADMIN_WORKSPACE.md.

## Kundenportal in derselben Anordnung

Der gemeinsame kompakte Portalrahmen gilt auch für Kunden. Sieben kurze Bereiche mit Icons: Übersicht, Termine, Projekte, Pakete, Dokumente, Nachrichten, Konto. Desktop feste Seitenleiste, schmale Bildschirme feste Bereichsleiste unten; Unterseiten im haftenden Kopfbereich. Gleiches Kartenraster mit ausschließlich persönlichen Kundeninformationen. Kein Adminwortlaut und keine Verwaltungsaktionen im Kundenportal. Die sachliche Begrüßung lautet „Dein Kundenkonto“. Details: docs/PORTAL_LAYOUT.md.
