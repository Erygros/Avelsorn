# Architektur

Aktualisierung 05.11.2026: Die bestehende Plattform läuft produktiv über GitHub → Vercel. Supabase stellt PostgreSQL und privaten S3-Speicher bereit, Checkdomain Domain und SMTP. Die neue Website-Optimierung wird auf codex/website-optimierung isoliert geprüft; sie ist noch nicht für Produktion freigegeben. Keine neue Hostinginfrastruktur.

Das Feld tax_number bleibt aus aktiver Konfiguration und neuen Dokumenten entfernt. Tatsächlich hinterlegte optionale USt-/Kleinunternehmer-IDs werden für die Rechnungsprüfung berücksichtigt. Unvollständige Rechnungen werden serverseitig nicht finalisiert; bestehende endgültige PDFs bleiben unverändert.

Stand: 28.10.2026. Die Nutzerkorrektur ersetzt PHP, MySQL, Laravel und eigenes Hosting. Alle funktionalen Anforderungen bleiben erhalten.

## Anwendung

Next.js App Router, TypeScript, React und Tailwind CSS. Server Components für Inhalte, Client Components für interaktive Abläufe. Route Handler und serverseitige Dienste validieren Eingaben, Sitzungen und Eigentum unabhängig von der Oberfläche. Keine eigene Hostinginfrastruktur.

## Markenassets

Avelsorn-Identität zentral in src/content/brand.ts. Originalgrafiken aus dem Nutzer-Markenblatt lokal in public/brand; gemeinsame Brand-Komponente für Website und Portale. Favicon, Apple-Icon und Link-Vorschau als Next-Metadatendateien. PDF- und E-Mail-Dienste verwenden dieselbe PNG-Quelle, beim Deployment ausdrücklich im File-Tracing enthalten. E-Mail-Versand bettet das Logo per CID ein. Die Quelldatei ist ein Markenblatt mit Rasterassets; es werden keine Vektorquelldaten behauptet. Details in BRAND_GUIDELINES.md.

## Datenbank

Ein PostgreSQL-Schema mit versionierten SQL-Migrationen über Drizzle ORM. Lokal persistentes PGlite in data/, kein Mock-Backend. Produktiver PostgreSQL-Pool über DATABASE_URL mit geprüftem TLS-Zertifikat; identisches Schema und identische Fachlogik. PGlite ist ausschließlich lokal und darf auf Vercel nicht als dauerhafte Datenbank eingesetzt werden.

## Schnittstellen

Privater Storage mit lokalem Entwicklungsadapter und konfigurierbarem Objektspeicheradapter. SMTP über Nodemailer mit TLS und verschlüsselter Outbox; ohne SMTP kein behaupteter Versand. Echtzeit über authentifiziertes Polling. Video über browserseitiges WebRTC mit Provider-Schnittstelle für Signalisierung und TURN; keine Entwicklung oder Bereitstellung eigener Server. Fehlende Integrationen bleiben sichtbar unkonfiguriert.

Sitzungen: zufällige, nur gehasht gespeicherte Tokens, HttpOnly/SameSite und Secure unter HTTPS. Ein Admin mit zusätzlichem E-Mail-OTP. Mutation-APIs prüfen Origin/CSRF. Private Ressourcen prüfen immer den Eigentümer. Geld in Cent, Zeit in UTC/Sekunden, Anzeige Europe/Berlin. Transaktionen und stabile Sperrzeilen für Kalender, Zahlungen und Kontingente. Idempotenzschlüssel für wiederholte Vorgänge.

Hintergrundaufgaben sind begrenzte Anwendungsfunktionen, lokal per CLI und produktiv durch den bereits eingerichteten minütlichen Supabase-Zeitplan aufrufbar. Keine Dauerprozesse in Vercel Functions und keine eigene Serverinfrastruktur. In der isolierten Preview wird kein zusätzlicher Zeitplan eingerichtet.

## Module und Abnahme

Einrichtung/Identität, Inhalte, Kalender/Buchung, Bestellungen/Zahlungen/Pakete, Projekte/Aufgaben/Zeit, Kommunikation/Dateien, Angebote/Rechnungen, Datenschutz/Einwilligung, Aufgaben/Audit/Backup. Lokale Abnahmen brauchen keine externen Konten. Produktion verlangt echte Integrationsprüfung, vollständige Geschäftsangaben und Nutzerfreigabe.

Quellen (26.10.2026): https://nextjs.org/docs/app/getting-started/installation, https://pglite.dev/docs/, https://orm.drizzle.team/docs/get-started/pglite-new, https://vercel.com/docs/functions/runtimes/node-js

## Lokale Ausführung der Adapter

Die Anwendung umfasst derzeit 37 Tabellen. PGlite erhält eine Prozesssperre; ein zweiter unabhängiger lokaler Schreiber wird abgewiesen. Hintergrundaufgaben werden lokal standardmäßig über die autorisierte HTTP-Anwendungsschnittstelle aufgerufen. Direkte CLI-Migrationen/Diagnosen nur bei gestoppter Anwendung. Der spätere PostgreSQL-Netzwerkadapter ist unabhängig von dieser lokalen Dateisperre.

Video besitzt einen lokalen Signalisierungsadapter innerhalb der Next.js-Anwendung für Entwicklungsprüfungen; hierfür wird kein zusätzlicher Server und keine Infrastruktur bereitgestellt. Die austauschbare externe Dienstschnittstelle bleibt unkonfiguriert. Ein ursprünglicher lokaler Zwei-Browser-Test mit synthetischen Medien war erfolgreich; nach Ergänzung von Raumgenerationen und Token-Erneuerung steht eine erneute Gesamtprüfung aus.

## Beleg- und Zeitkorrekturen

Rechnungskorrektur und Vertragsstornierung sind getrennte Fachvorgänge. Eine Rechnungskorrektur erzeugt einen eigenen nummerierten Stornobeleg und einen Ersatzentwurf zur bestehenden Bestellung. Bereits bestätigte Zahlungen, Pakete und Termine bleiben erhalten; der Ersatzentwurf darf den vereinbarten Gesamtbetrag nicht ändern. Die Finalisierung einer vollständig bezahlten Ersatzrechnung verlangt keinen zweiten Zahlungseingang.

Eine Vertragsstornierung sperrt die Bestellung und ihre Pakete, storniert laufende oder zukünftige zugehörige Termine mit erhöhter Kalendersequenz und erhält die Belegkette. Rückzahlungen werden ausschließlich als gesondert bestätigter Bankvorgang dokumentiert. Das Paket speichert den Stornierungszeitpunkt; laufende Timer rechnen höchstens bis zu diesem Zeitpunkt auf sein Kontingent an.

Zeitkorrekturen verwenden eine Revisionsnummer gegen veraltete Bearbeitungsstände. Alter und neuer Stand samt Begründung werden auditiert. Entlastung und Neubelastung der beteiligten Pakete erfolgen in einer Transaktion mit Zeilensperren und berücksichtigen bestätigte Beratungszeiten. Bei unveränderten Zeitgrenzen bleiben Arbeitssegmente und Timerpausen erhalten. Überschneidungen werden anhand tatsächlicher Arbeitssegmente geprüft.

## Leistungspakete ab 29.10.2026

Der reine Katalog in src/content/service-packages.ts enthält sieben abgegrenzte Pakete. Servermodul package-catalog.ts validiert unverbindliche Anfragen, speichert Kontakt und Audit transaktional und legt die Bestätigung in die Mailwarteschlange. /paket-anfragen benötigt kein Konto und erzeugt keine Bestellung.

Angebote speichern einen unveränderlichen Katalogsnapshot samt Mindestbetrag. Annahme erzeugt einen Auftrag mit tatsächlichem Umfang und vereinbartem Leistungsbeginn. Erst vollständige bestätigte Zahlung legt genau ein Projekt an; Teilzahlungen und wiederholte Bestätigungen bleiben abgesichert. Neue Pakete erzeugen kein altes Zeitkontingent. Interne Zeitnachweise erhalten Zahlungs-/Leistungsbeginnprüfung und dürfen keine alten Kontingente für diese Projekte belasten.

Migration 0006 ergänzt bookings.service_order_id mit Fremdschlüssel auf orders. Damit sind mehrere enthaltene Gespräche unabhängig von der bisherigen eindeutigen booking.order_id-Zahlungszuordnung möglich. Buchung prüft Eigentum, vollständige Zahlung, Aktivstatus, Leistungsbeginn, Anzahl und Kalenderkollision unter Sperre. Vertragsstorno archiviert das verknüpfte Projekt und storniert laufende/zukünftige Projektgespräche. Bestehende Stundenverträge bleiben nachvollziehbar; ihre Neukauf- und freien Stundenbuchungswege sind serverseitig gesperrt (410).

Netzwerk und Prozessbeispiele sind redaktionelle Inhalte auf Basis der Nutzerangaben, keine neue externe Integration. Keine Partnerdaten, Nachrichten an Kontakte oder automatisierte KI-Dienste eingerichtet. Umfang und Prüfgrenzen: docs/LEISTUNGSPAKETE.md.

## Getrennte Admin-Startseite und feste Navigation (29.10.2026)

AdminOverview ist eine eigene Serverkomponente mit requireUser(true), aggregiert ausschließlich berechtigte Verwaltungsdaten und ersetzt den alten gemeinsamen Admin-/Kunden-Statistikzweig. Die Kundenübersicht fragt keinen globalen Kundenbestand mehr ab. Bestehende kundenbezogene Eigentumsfilter und API-Rollenprüfungen bleiben erhalten.

Sieben feste Adminbereiche und kontextbezogene Verwaltungsseiten verwenden die bestehende Routenstruktur. Mobile Auswahl wechselt per Next-Router zwischen Verwaltungsseiten. Kein eigener scrollender Navigationscontainer; Desktop feste Seitenleiste, schmale Bildschirme feste Bereichsleiste unten. Darstellungsregeln des gemeinsamen Rahmens sind auf portal-compact begrenzt; Inhalte und Navigationsziele bleiben rollenabhängig. Keine Schemaänderung und kein neuer externer Dienst. Prüfkatalog: docs/ADMIN_WORKSPACE.md.

## Gemeinsamer Portalrahmen für beide Rollen (29.10.2026)

Die Kompaktregeln werden unter portal-compact von Admin- und Kundenportal geteilt. PortalShell erzeugt die Navigation weiterhin aus getrennten Gruppen und Zielen je Rolle. PortalSectionSelect ersetzt die bisherige AdminSectionSelect; Navigation nur zu fest definierten Zielen aus den übergebenen Einträgen. Keine Änderung an Rollen, Sessions oder API-Berechtigungen.

Die Kundenübersicht hat wie die Administration vier Kennzahlen und vier Inhaltsbereiche. Projekte, Mitteilungen, Buchungen, offene Beträge und bezahlte Leistungspakete werden über die angemeldete Kunden-ID eingeschränkt. Der Widerruf bleibt über Konto erreichbar. Hinweise und Prüfungen: docs/PORTAL_LAYOUT.md.

## Geschäftsangaben und Verfügbarkeit

Zusätzliche optionale Stammdaten contact_hours und about_text werden im Adminbereich unter Stammdaten bearbeitet; Vorstellung als Textarea. Öffentliche Seiten rendern den Vorstellungstext als escaped Text. Bank- und Steuerdaten bleiben von den öffentlichen Kontaktangaben getrennt. Der lokale Eigentümerimport verwendet eine private Eingabedatei, prüft IBAN/BIC und Kalenderregeln, erstellt eine Sicherung und protokolliert die transaktionale Änderung. Keine Schema- oder Infrastrukturänderung. Einzelheiten und Freigaberestpunkte: docs/BUSINESS_PROFILE_SETUP.md.


## Kalender und Erinnerungen (05.11.2026)

Öffentliche Buchung und CRM-Ansichten verwenden weiterhin denselben Kalenderdienst. calendar_blocks ergänzt zeitlich begrenzte Sperren und Zusatzzeiten. Kontakt-Snapshots an Buchungen bewahren die bestätigte Rufnummer; Datenschutzbearbeitung berücksichtigt diese Zusatzfelder. intro_credits ist eine auditiert vergebene, transaktional verbrauchte Freigabe für weitere Erstgespräche. Die Outbox referenziert Kalender-ID und Revision, damit stornierte oder verschobene Erinnerungen verworfen werden. Supabase pg_cron/pg_net ruft die vorhandene authentifizierte Vercel-Aufgabenfunktion auf; der Token liegt in Vault. Einzelheiten in docs/CALENDAR_EXTENSION.md.

## Nachtrag: Rechtstexte und Datenintegrität

Zentrale Anbieterangaben bleiben bei redaktionellen Änderungen von Rechtstexten erhalten. Eine Widerrufserklärung wird mit Bestätigungs-Outbox, Adminhinweis und Audit atomar gespeichert. Rechnungsfinalisierung prüft Pflichtangaben; eine Zahlung wird nicht wegen fehlender Rechnungsstammdaten verworfen. Ältere Backups müssen in das aktuelle Schema unter Erhalt neu eingeführter Standardwerte wiederherstellbar sein. Prüfstand und fachliche Grenzen: docs/LEGAL_OPERATIONAL_AUDIT.md.

## Vertragsfassungen und Bestätigungen

Beim Versand wird die angebotene Fassung der Bedingungen in documents.snapshot.contractTerms mit Anbieterangaben und Inhalts-Hash eingefroren. Eine Annahme übernimmt sie in orders.contract, speichert den vollständigen Bestätigungstext und legt die verschlüsselte Outbox atomar an. Änderungen im CMS verändern vorhandene Angebote/Verträge nicht. Neue auftragsgebundene Zeiterfassung prüft Zahlung, vereinbarten Beginn und SMTP-Annahme der Vertragsbestätigung. Ein unbekannter Versandstatus ist keine Versandbestätigung. Historische Bestellungen bleiben erhalten. Abnahme und Grenzen: docs/CONTRACT_FLOW_AUDIT.md.


## Öffentliche Optimierung und Gasttermine

Servicekategorien, allgemeine Beispiele und Zusammenarbeitsschritte liegen in src/content/service-groups.ts, leistungsspezifische Inhalte in service-details.ts. Gemeinsame Komponenten stellen diese Daten dar. Paketpreise, enthaltene Leistungen und sichtbare Ergebnisse haben eine gemeinsame Quelle. Bestehende Detail-URLs erhalten Inhalte; kürzere alte Alias-URLs leiten dauerhaft auf ihre kanonischen Seiten weiter.

Migration 0008 ergänzt guest_bookings mit eigenem Kontakt, Anliegen, Termin, Status, Revision und Hash des zufälligen Zugangstokens. Sie erzeugt keine Kundenkonten. Gemeinsame Kalendersperre und Überschneidungsprüfung berücksichtigen Konto- und Gasttermine. Wiederholte Erstgespräche werden anhand der E-Mail-Adresse auch zwischen beiden Buchungswegen geprüft.

/api/guest-bookings validiert Origin, Größe, Eingaben, Rate-Limits und Terminversionen. Das Management-Token steht im Fragment der E-Mail-URL, wird im Browser sofort aus der Adressleiste entfernt und per POST gegen ein HttpOnly-/SameSite-Cookie mit eng begrenztem API-Pfad getauscht. Gastzugänge verfallen 30 Tage nach dem aktuell gebuchten Termin; sie gewähren keinerlei Kundenportalzugriff. Interne Notizen verlassen die Adminansicht nicht. Outbox-Ziel-URLs und Nachrichtentexte sind verschlüsselt. Mailprüfung und bestehender Aufgabenlauf berücksichtigen Gaststatus und Revision; alte Erinnerungen werden nach Änderungen verworfen. Sicherungen umfassen die neue Tabelle.

Die Vorschau nutzt eine eigene LOGIN-Rolle ohne Rechte auf produktive Tabellen und ein getrenntes Schema im bestehenden Supabase-Projekt. Öffentliche Geschäftsinhalte und veröffentlichte Blogartikel werden kopiert, keine Personen-/Auftragsdaten oder Einrichtungssperren. S3 wird ausschließlich mit einem erzwungenen Preview-Präfix angesprochen. PLATFORM_ENV=preview und VERCEL_ENV=preview erlauben genau die bereitgestellten Vercel-Origins, erzwingen noindex und verhindern SMTP-Versand. Produktionsrollen, Daten und ENV-Werte werden nicht ersetzt. Die erforderliche Produktionsfreigabe wird dadurch nicht erteilt.
