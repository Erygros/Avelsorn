# Abnahme Vertragsbestätigung und Inhaberzugang (05.11.2026)

## Umgesetztes Verhalten

Angebote enthalten im Portal und in der Angebots-E-Mail den vollständigen Leistungsumfang, Positionen, Gesamtpreis, Anbieterangaben, AGB, Widerrufsbelehrung und Musterformular. Die Fassung wird beim Versand zusammen mit dem Angebot gespeichert. Bei der Annahme wird diese angebotene Fassung übernommen; spätere CMS- oder Stammdatenänderungen ändern den geschlossenen Vertrag nicht. Nur der zugehörige Kunde kann das Angebot annehmen oder ablehnen. Ein Administratorkonto kann keine Kundenerklärung stellvertretend abgeben.

Bestellung, Rechnungsentwurf und vollständige Bestätigungs-Outbox werden innerhalb derselben Transaktion gespeichert. Ein Speicherfehler der Bestätigung rollt die Annahme zurück. Die Mail enthält auch Bestellreferenz, Vertragsschluss, Kunden-/Rechnungsdaten, Zahlungsangaben und die abgegebenen Erklärungen zum Leistungsbeginn. Der feste Inhalt bleibt zusätzlich im geschützten Bestelldatensatz erhalten. Eine bloße Verlinkung auf veränderbare Rechtstexte wird dafür nicht verwendet.

Ohne ausdrücklich gewünschten vorzeitigen Beginn wird ein konservatives frühestes Arbeitsdatum aus vollständigen Berliner Kalendertagen berechnet. Wochenenden und bekannte deutsche regionale Feiertage werden vorsorglich berücksichtigt, ohne das Bundesland aus einer Freitextanschrift zu erraten. Die Regel bestimmt den vertraglich vorgesehenen Beginn; sie ist keine Entscheidung über das Erlöschen eines individuellen gesetzlichen Widerrufsrechts. Zeiterfassung zu neuen Aufträgen setzt zusätzlich eine erfolgreich an den SMTP-Server übermittelte Vertragsbestätigung voraus. Unbekannte oder ausstehende Versandzustände reichen nicht aus. Vorhandene historische Verträge werden nicht umgeschrieben.

Der Vertragsdialog bleibt unabhängig von der Tabellenzeilenhöhe gut lesbar, ist mit Tastatur bedienbar und gibt den Fokus beim Schließen zurück. Die Schließen-Schaltfläche bleibt im Dialog erreichbar. E-Mail-Vorlagen verwenden eine mobile Viewport-Angabe, begrenzte Tabellenbreiten und umbrechenden Text. Neue endgültige PDFs mit fehlenden Ausstellerpflichtangaben werden abgewiesen; gültige Dokumente enthalten keine Entwicklungsvermerke. Tatsächliche Entwürfe bleiben als Entwurf gekennzeichnet. Bereits archivierte endgültige PDFs werden unverändert ausgeliefert.

Geschäftseinstellungen werden vollständig geprüft und gemeinsam mit dem Audit in einer Transaktion gespeichert. Ein unbekanntes Feld führt nicht mehr zu einer teilweise gespeicherten Änderung.

## Produktionskonto

Der angeforderte Inhaberzugang für kontakt@avelsorn.de wurde mit den vom Inhaber übermittelten Angaben eingerichtet. Es wurde ein zufälliges, nicht weitergegebenes Anfangspasswort verwendet und eine Mail zur eigenen Passwortvergabe angefordert. Der SMTP-Server hat diese Mail angenommen. Ein tatsächlicher Posteingang oder eine erfolgreiche Anmeldung des Inhabers wurde damit nicht unabhängig bestätigt. Die öffentliche Einrichtungsseite wird nach abgeschlossener Ersteinrichtung nicht mehr angeboten; die serverseitige Einmalsperre bleibt bestehen. Keine persönlichen Altersangaben oder Zugangsschlüssel werden in diesem Dokument veröffentlicht.

## Prüfnachweise

- `npm run check`: TypeScript, ESLint, 57 Tests und Produktionsbuild bestanden.
- `tests/service-packages.test.ts`: vollständige eingefrorene Rechtsfassung, spätere CMS-Änderung, Sperre stellvertretender Adminannahme, genau eine Bestätigung und Transaktionsrollback bei Outboxfehler. Ein weiterer Test prüft die Zeiterfassung vor/nach kontrolliertem SMTP-Annahmestatus. Die lokale Statusvorgabe ist ein isolierter Test und keine Behauptung einer externen Zustellung.
- `tests/contract-scheduling.test.ts`: sechs Fälle einschließlich Berliner Tagesgrenze, Sommerzeit, Ostern, Mai-Feiertag und Jahreswechsel.
- `tests/output/contract-http-e2e.json`: elf reale HTTP-Aktionen gegen die isolierte QA-App, atomare Einstellungen, Angebot, Annahme, Bestätigung, Teil-/Restzahlung, Projektanlage, gesperrte Arbeit vor Bestätigungsversand, Storno und Erstattung. Testaufträge wurden nach Abschluss storniert und Erstattungen ausschließlich im QA-Ledger verbucht.
- `tests/output/contract-browser-verification.json`: Dialog und E-Mail-Vorlage bei 320, 768 und 1440 px ohne horizontalen Überlauf. Dialogschließen über Escape und Fokusrückgabe geprüft.
- `tests/output/contract-customer-a11y.json`: automatisierte WCAG-A/AA-Prüfung des Vertragsdialogs ohne gemeldete Verstöße.
- Einseitiges Angebot und bezahlte Rechnung über die echte Dokument-API abgerufen, mit Poppler gerendert und visuell geprüft (`contract-qa-offer-1.png`, `contract-qa-invoice-1.png`). Keine abgeschnittenen Inhalte oder Entwicklungshinweise in der geprüften letzten Fassung. Dies ist keine vollständige PDF-Zugänglichkeitsprüfung.
- `tests/output/owner-account-setup.json` und `owner-account-reset-delivery.json`: tatsächliche Inhabereinrichtung und SMTP-Annahme der Passwortmail. Kein Standardpasswort geteilt; keine Kundentestkonten oder Testaufträge in Produktion angelegt.
- 50 Portal-/Zugriffsprüfungen und die öffentliche Seitenprüfung nach der Änderung erfolgreich. Eine abgeschlossene Ersteinrichtung darf in der öffentlichen Prüfung korrekt 404 liefern.

## Rechtsgrundlagen und Quellen

- [§ 312f BGB – Vertragsbestätigung auf dauerhaftem Datenträger](https://www.gesetze-im-internet.de/bgb/__312f.html)
- [Art. 246a § 1 EGBGB – Informationspflichten](https://www.gesetze-im-internet.de/bgbeg/art_246a__1.html)
- [Art. 246a § 4 EGBGB – Informationen vor der Vertragserklärung](https://www.gesetze-im-internet.de/bgbeg/art_246a__4.html)
- [§ 187 BGB](https://www.gesetze-im-internet.de/bgb/__187.html), [§ 188 BGB](https://www.gesetze-im-internet.de/bgb/__188.html), [§ 193 BGB](https://www.gesetze-im-internet.de/bgb/__193.html)
- [Bundesbank: Feiertagsübersicht](https://www.bundesbank.de/resource/blob/749314/05f64c15196c20776ae7c22a2739b03c/mL/feiertage-in-deutschland-1-data.pdf), [Bayerisches Innenministerium: regionale Feiertage einschließlich Augsburg](https://www.stmi.bayern.de/staat-und-verfassung/feiertage/)

## Grenzen und nächste Abnahme

Der aktuell öffentlich angebotene kostenpflichtige Vertragsweg ist das individuelle Angebot. Frühere Stunden-/Laufzeitpakete und direkte bezahlte Einzelbuchungen bleiben für neue Bestellungen gesperrt. Die alte Bestellfunktion wird nicht als neuer freigegebener Vertriebsweg ausgegeben.

Die umfassende Geschäftsablaufabnahme bleibt in Arbeit. Besonders Projekt-/Aufgabenstatus, Wiedereröffnung abgeschlossener Projekte samt Dateiaufbewahrung, Chat/Dateifreigaben sowie Datenschutzabläufe sind weiter zu prüfen. Ein erfolgreicher Seitenaufruf oder eine einzelne Beispielrechnung beweist keine vollständige Abnahme aller Funktionen. Die technische Umsetzung ersetzt keine juristische Einzelfallprüfung und keine vollständige manuelle Barrierefreiheitsprüfung.
