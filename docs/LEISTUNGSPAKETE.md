# Leistungspakete und Unternehmensabläufe

Stand: 29.10.2026. Nutzerauftrag vom 28.–29.10.2026; ausschließlich lokale Entwicklung.

| Paket | Einmalig ab | Ausgangslage |
| --- | ---: | --- |
| Creator-Profilcheck | 199 € | Ein vorhandener Kanal |
| Selbstständigkeit vorbereiten | 249 € | Berufliche Veränderung, auch ohne Idee |
| Freelancer-Auftritt | 349 € | Vorhandene Arbeiten oder Portfolio |
| Gründungsangebot ausarbeiten | 399 € | Bereits ausgewählte Geschäftsidee |
| Social-Media-Planung | 499 € | Ein bestehender Kanal und Angebot |
| Digitalen Ablauf verbessern | 699 € | Ein bestehender Vorgang |
| Website erstellen | 1.290 € | Ein Onepager mit freigegebenen Inhalten |

Zentrale Quelle: src/content/service-packages.ts. Einschluss, Abgrenzung und Zuarbeit je Paket; keine verkauften Zeitguthaben. Ein Gespräch je kleinem Paket, zwei für digitalen Ablauf und Website; operative Kalenderdauer dient der Terminplanung. Zusätzliche Leistungen gesondert vereinbaren.

## Anfrage und Auftrag

/paket-anfragen speichert einen Kontaktvorgang samt serverseitigem Paket-/Preisschlüssel und Audit. Bestätigung in der lokalen Mailwarteschlange; kein eingerichteter SMTP-Versand behauptet. Keine Bestellung allein durch die Anfrage. Im Adminportal Katalogpaket als Angebotsgrundlage wählen und den Entwurf vor Versand konkret vervollständigen. Ein enthaltenes Bearbeitungsmerkmal verhindert den Versand der unvollständigen Vorlage. Die serverseitige Preisuntergrenze schützt vor versehentlichen Angeboten unter dem Basispreis.

Annahme speichert Umfang und Katalog als Vertragssnapshot. Frühzeitiger Beginn verlangt eine zusätzliche ausdrückliche Bestätigung. Ohne diese Einstellung wird der vorhandene 14-Tage-Leistungsbeginn berücksichtigt. Erst vollständige bestätigte Zahlung erzeugt ein Projekt und eine bezahlte Rechnung. Teilzahlungen, Wiederholungen, Audits und Belegketten bleiben erhalten.

Projektgespräche sind über bookings.service_order_id dem bezahlten Auftrag zugeordnet. Eigentum, enthaltene Anzahl, Status, Leistungsbeginn und Kalenderkonflikte werden serverseitig unter Sperren geprüft. Vertragsstorno archiviert das Projekt und storniert zugehörige laufende/zukünftige Termine. Interne Zeit kann dokumentiert werden, wird aber nicht auf ein altes Stundenkontingent gebucht. Frühere Verträge bleiben bearbeitbar; neue Käufe ihrer Produkte erhalten HTTP 410.

## Netzwerk und Texte

Die Branchenkontakte sind eine ausdrückliche Nutzerangabe. Startseite und Über-Seite erklären die Anfrage einer Vorstellung nach Einverständnis. Keine benannten Kooperationen, Aufträge, Finanzierung, Erträge oder feste Verfügbarkeit behauptet.

Unternehmensseite, Leistungsseiten und Startseite beschreiben konkrete Handgriffe: Angaben übertragen, Unterlagen nachfordern, Zuständigkeiten und Übergaben festlegen. KI ist eine mögliche abgegrenzte Umsetzung mit festgelegten Daten und menschlichem Prüfschritt. Beispiele sind mögliche Aufträge, keine behaupteten Kundenprojekte. Zeitersparnis wird am tatsächlichen Vorher-/Nachher-Ablauf geprüft; keine erfundenen Prozentsätze oder Kundenstimmen. Gestalterisch bestehende Avelsorn-Typografie, offene Textbereiche und sachbezogene Vergleichszeilen; keine neue Badge-/Icon-/Sloganreihe.

## Prüfnachweise

- tests/service-packages.test.ts: Anfrage ohne Kauf, Preisuntergrenze, unvollständiger Entwurf, Annahme und Teil-/Vollzahlung, Projektanlage, Eigentums-/Gesprächsgrenze, Storno, Leistungsbeginn und ausdrückliche Bestätigung.
- bin/qa-service-packages.mjs: isolierter HTTP-Gesamtablauf; Ergebnis tests/output/service-packages-http.json.
- bin/verify-public-copy.ts: öffentliche Routen, H1, aktuelle Texte, Marke und entfernte Werbeschablonen.
- Browsernachweise dieser Etappe: tests/output/packages-*.json/png.

Keine vollständige rechtliche, WCAG- oder Produktionsfreigabe. Fehlende Pflichtstammdaten und externe Dienste bleiben vor Veröffentlichung zu klären.
