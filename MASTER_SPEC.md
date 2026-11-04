# Verbindliche Architekturkorrektur vom 26.10.2026

## Präzisierung vom 03.11.2026: Veröffentlichung und Geschäftsfelder

Hostingziel ist Vercel, der Quellcode soll über GitHub übertragen werden. Die Domain avelsorn.de ist laut Inhaber bei Checkdomain gekauft. Checkdomain bleibt ausschließlich für Domain/E-Mail vorgesehen. GitHub-Ziel ist https://github.com/Erygros/Avelsorn.git; lokal als origin auf main hinterlegt. Noch kein Commit oder Push, kein Vercel-Projekt und keine produktiven externen Dienste eingerichtet. Details: docs/DEPLOYMENT_PLAN.md.

Auf ausdrücklichen Inhaberwunsch entfällt das aktive Feld Steuernummer aus Stammdaten, Formularen und neu erzeugten PDF-Ausgaben. Eine fehlende Steueridentifikation ist kein pauschaler technischer Veröffentlichungsblocker der Website. Rechnungsanforderungen sind getrennt zu prüfen; der selbst erklärte Freelancerstatus ersetzt diese Prüfung nicht. Bereits finalisierte Dokumente und historische Nachweise bleiben unverändert.

Diese Nutzerkorrektur hat Vorrang vor sämtlichen widersprechenden technischen Vorgaben im unten erhaltenen Ursprungsauftrag. Alle funktionalen Anforderungen gelten weiter.

- Ausschließlich Next.js, TypeScript, React und Tailwind CSS mit serverseitigem Backend und sauberer Datenbankabstraktion.
- Vollständige lokale Entwicklung und Ausführbarkeit. Architektur für späteres Deployment über GitHub/Vercel ohne grundlegenden Umbau.
- PHP/MySQL und Checkdomain-Webhosting sind aufgehoben. Checkdomain dient ausschließlich Domain und geschäftlicher E-Mail.
- KEIN eigenes Hosting und KEINE Serverinfrastruktur entwickeln, konfigurieren, bestellen oder bereitstellen. Dies gilt auch für Signalisierungs-/TURN-Server.
- Datenbank, Dateispeicherung, SMTP sowie Echtzeit-/Videodienste über klar definierte Schnittstellen konfigurieren. Geeignete lokale Entwicklungsadapter einsetzen. Keine externe Integration als produktiv eingerichtet ausgeben.
- Sämtliche öffentlichen Seiten, Kunden- und Adminfunktionen, Modelle, Authentifizierung, Buchung, Projekte, Zeit, Chat, Angebote/Rechnungen, E-Mail, Blog/CMS, Datenschutz und rechtlichen Funktionen bleiben Teil des Auftrags.
- Bereits erstellte Inhalte und wiederverwendbare Arbeiten erhalten; PHP-Komponenten gehören nicht zur aktiven Anwendung.
- Keine Veröffentlichung, kostenpflichtigen Verträge oder Ausgaben ohne ausdrückliche Freigabe.

## Verbindliche Markenentscheidung vom 28.10.2026

Auf ausdrücklichen Nutzerwunsch Avelsorn und ausschließlich die bereitgestellten Markenassets aus Avelsorn_Markenblatt.pdf verwenden. Vorherige Platzhalternamen, Linienlogo und automatische Markenunterzeilen entfallen. Farbwerte, Kommunikationsschrift, Mindestgrößen und Schutzraum nach Markenblatt; technische Details und Herkunftsnachweis in BRAND_GUIDELINES.md. Dies ersetzt widersprechende ursprüngliche Vorgaben zur vorläufigen Marke oder Logoherstellung. Die Originaldatei bleibt unverändert erhalten.

## Verbindliche Angebots- und Inhaltskorrektur vom 28.–29.10.2026

- Neue Leistungen als abgegrenzte Pakete mit Einstiegspreisen anbieten: Creator 199 €, beruflicher Einstieg 249 €, Freelancer 349 €, ausgewählte Gründungsidee 399 €, Social Media 499 €, digitaler Ablauf 699 €, Website-Onepager 1.290 €. Keine öffentlichen Stundenpreise oder Zeitkontingente für neue Aufträge. Vor Beauftragung Umfang, Zuarbeit, Liefertermin und Gesamtpreis vereinbaren.
- „Selbstständigkeit vorbereiten“ beginnt bei 249 € einmalig, ausdrücklich auch für berufliche Umsteiger ohne fertige Geschäftsidee oder Gründungserfahrung: Erfahrungen aufnehmen, bis zu drei Tätigkeitsfelder vergleichen, erste Angebotsidee, schriftliche Aufgabenliste, ein Auswertungsgespräch und eine gebündelte Korrekturrunde. Gründungsangebot ab 399 € für eine bereits ausgewählte Idee.
- Neue Stunden-/Laufzeitkäufe an den Anwendungseingängen sperren. Bestehende Verträge und Kontingente erhalten. Interne Zeiterfassung bleibt erhalten, erzeugt für neue Pakete keine Stundenabrechnung.
- Anfragen unverbindlich speichern; Auftrag erst nach geprüftem Angebot und ausdrücklicher Annahme. Vollständige Zahlung transaktional bestätigen, anschließend Projekt anlegen. Enthaltene Gespräche an den eigenen bezahlten Auftrag binden. Vereinbarten Leistungsbeginn berücksichtigen.
- Nutzerbestätigte Kontakte zu Anwälten, Hausverwaltungen, Investoren, Tradern, Streamern, Selbstständigen und kleineren Freelancern sachlich beschreiben. Keine erfundenen Partnernamen, Referenzen oder Finanzierungs-/Vermittlungszusagen. Vorstellung nach Einverständnis; Bedingungen direkt mit der Fachperson.
- Unternehmensstruktur, Zuständigkeiten, Übergaben und wiederkehrende Abläufe konkretisieren. Automatisierung und bei Eignung KI-Anbindung mit definierten Daten, Schnittstellen, Prüfschritten und Freigaben vereinbaren. Tatsächliche Entlastung am Ausgangsablauf und Testlauf vergleichen; keine erfundenen Einsparzahlen.
- Professionelle Du-Texte ohne Werbeschablonen, dekorative Oberzeilen oder erfundene Erfolgsnachweise. Details und Prüfnachweise: docs/LEISTUNGSPAKETE.md.

Diese Korrekturen ersetzen widersprechende Preis- und Neukaufregeln im erhaltenen Originalauftrag.

## Admin-Verwaltung und Navigation (29.10.2026)

Der Adminbereich erhält eine eigene Startseite für eingehende Anfragen, Kundennachrichten, Registrierungen, Aufträge und Zahlungen. Persönliche Kundenansichten wie eigene Buchung, Profil oder Fragebogen gehören nicht in die Administration. Gemeinsame Geschäftsobjekte bleiben als ausdrücklich zugeordnete Verwaltungsansichten erhalten. Die Adminnavigation besteht aus sieben festen Bereichen mit Icon und kurzem Titel; keine kombinierten Titel mit & und keine eigene scrollende Seitenliste. Zugehörige Verwaltungsseiten bleiben kontextbezogen erreichbar. Desktop und schmale Fenster müssen die Navigation fest und vollständig erreichbar halten. Details und Nachweise: docs/ADMIN_WORKSPACE.md.

## Gemeinsame Portal-Anordnung (29.10.2026)

Auf weiteren Nutzerwunsch verwendet auch das Kunden-Dashboard dieselbe kompakte Anordnung wie die Administration: feste Bereiche mit Icon und kurzem Titel, kontextbezogene Unterseiten sowie dasselbe Kartenraster. Kundenbereiche: Übersicht, Termine, Projekte, Pakete, Dokumente, Nachrichten und Konto. Ausschließlich Kundenfunktionen und eigene Daten anzeigen; keine Adminlinks oder erweiterten Berechtigungen. Alle bisherigen Kundenfunktionen einschließlich Fragebogen, Datenschutz und Widerruf erhalten. Details: docs/PORTAL_LAYOUT.md.

## Umgang mit dem ursprünglichen Text

Weitere verbindliche Nutzerkorrektur vom 28.10.2026: Dekorative Oberzeilen über Seiten- und Abschnittstiteln global entfernen. Nur der jeweilige Titel steht an dieser Stelle; tatsächliche Preis-, Status- und Datensatzinformationen bleiben erhalten und werden bei Bedarf unter dem Titel angeordnet.

Der folgende Originalauftrag bleibt zur vollständigen Nachverfolgbarkeit erhalten. Technische Aussagen über PHP, MySQL als verpflichtenden Stack, Checkdomain-Webhosting oder selbst zu entwickelnde Hosting-/Videoserver sind ersetzt. Insbesondere betrifft dies Abschnitte 11, 33, 34, 37, 40 und 41.

---

/goal Entwickle und perfektioniere im aktuellen Projektordner die nachfolgend vollständig spezifizierte digitale Unternehmensberatungsplattform. Setze sämtliche Anforderungen als echte, funktionsfähige, produktionsfähige Anwendung um.

WICHTIG:
Dies ist ausdrücklich KEIN MVP, KEIN Prototyp, KEINE Demo und KEIN reines Frontend-Projekt.

Arbeite eigenständig, systematisch und iterativ:
Analysieren → Planen → Implementieren → Ausführen → Prüfen → Fehler beheben → Oberfläche optimieren → erneut prüfen.

Beende die Entwicklungsarbeit erst, wenn alle technisch umsetzbaren Anforderungen vollständig implementiert und anhand konkreter Abnahmekriterien verifiziert wurden.

Fehlende Domain-, E-Mail-, Hosting-, Bank- und Unternehmensdaten dürfen die Entwicklung nicht stoppen. Bereite diese Punkte mit zentral verwalteten Platzhaltern und Konfigurationen vollständig vor.

Externe Ausgaben, kostenpflichtige Verträge, Domainkäufe und die öffentliche Veröffentlichung dürfen nicht ohne meine ausdrückliche Freigabe erfolgen.

==================================================
1. PROJEKTZIEL UND GRUNDREGELN
==================================================

Entwickle eine eigenständige digitale Unternehmensberatungsplattform mit:

1. Vollständiger öffentlicher Website.
2. Kundenregistrierung und Kundenverwaltung.
3. Geschütztem Kunden-Dashboard.
4. Geschütztem Admin-Dashboard.
5. Eigenem Buchungssystem und Kalender.
6. Telefon- und integrierter Videoberatung.
7. Projektverwaltung und Aufgabenverwaltung.
8. Detaillierter Zeiterfassung.
9. Eigenem Kundenchat.
10. Datei- und Dokumentenverwaltung.
11. Angebotsverwaltung.
12. Rechnungsverwaltung.
13. Banküberweisungs- und Zahlungsstatusverwaltung.
14. Automatisierten E-Mail-Benachrichtigungen.
15. Eigener Blogverwaltung.
16. SEO- und Contentverwaltung.
17. Datenschutz- und Einwilligungsverwaltung.
18. Rechtlichen Pflichtseiten.
19. Administrativer Systemkonfiguration.
20. Backup-, Sicherheits- und Wartungsfunktionen.

Das gesamte System soll optisch und funktional wie ein professionell entwickeltes kommerzielles Produkt wirken.

Keine simulierten Geschäftsprozesse.
Keine funktionslosen Schaltflächen.
Keine Fake-Daten als echte Inhalte.
Keine Mock-Backends im fertigen System.
Keine hardcodierten Administratorpasswörter.
Keine bloßen Platzhalterimplementierungen.

Ausgenommen sind ausschließlich bewusst konfigurierte externe Angaben wie Domain, E-Mail, Unternehmensanschrift, Steuerdaten, IBAN und erforderliche Hosting-Zugangsdaten.

Alle Einstellungen und Geschäftsprozesse müssen dauerhaft in einer geeigneten Datenbank gespeichert werden.

Das Projekt gehört vollständig mir.

==================================================
2. VERBINDLICHER ARBEITSMODUS
==================================================

Prüfe zuerst den aktuellen Projektordner.

Wenn bereits ein Projekt vorhanden ist:
- Struktur und bestehende Funktionalität untersuchen.
- Vorhandene funktionsfähige Komponenten erhalten.
- Fehlende Anforderungen ergänzen.
- Bestehende Fehler beheben.
- Keine unnötigen parallelen Systeme erstellen.
- Keine Nutzerdateien oder fremden Projektbestandteile löschen.

Wenn der Projektordner leer ist:
- Ein vollständiges professionelles Projekt erstellen.
- Datenbankstruktur und Migrationen anlegen.
- Frontend und Backend integrieren.
- Alle erforderlichen Entwicklungswerkzeuge konfigurieren.

Erstelle und pflege diese Dokumentationen:

AGENTS.md
MASTER_SPEC.md
PROGRESS.md
ARCHITECTURE.md
DEPLOYMENT.md
SECURITY.md
RELEASE_READINESS.md
README.md

MASTER_SPEC.md enthält die vollständigen Produktanforderungen.

PROGRESS.md enthält:
- Alle Aufgaben.
- Aktuellen Fortschritt.
- Bereits implementierte Funktionen.
- Ergebnisse durchgeführter Prüfungen.
- Gefundene Fehler.
- Noch offene Aufgaben.
- Externe Abhängigkeiten.

RELEASE_READINESS.md enthält eine überprüfbare Freigabecheckliste.

Arbeite in nachvollziehbaren Etappen.

Nach jeder größeren Etappe:
- Anwendung starten.
- Relevante Abläufe prüfen.
- Fehler korrigieren.
- Fortschritt aktualisieren.
- Nächste Etappe beginnen.

Unterbrich die Entwicklung nicht wegen kosmetischer Kleinigkeiten, sondern verbessere diese eigenständig.

Wenn eine Anforderung technisch noch nicht funktioniert, darf sie nicht als abgeschlossen markiert werden.

Wenn tatsächlich externe Zugangsdaten, neue Infrastruktur oder eine Benutzerfreigabe erforderlich sind, dokumentiere ausschließlich diesen externen Blocker. Implementiere die restlichen Funktionen weiter.

==================================================
3. GESCHÄFTSMODELL
==================================================

Das Unternehmen bietet ausschließlich digitale Beratung und praktische Unterstützung an.

Zielgruppen:
- Kleine Unternehmen.
- Mittelständische Unternehmen.
- Einzelunternehmen.
- Selbstständige.
- Freelancer.
- Gründer.
- Content Creator.
- Influencer.
- Social-Media-Akteure.
- Privatpersonen, die eine digitale Selbstständigkeit aufbauen möchten.

Alle Zielgruppen werden gleichwertig angesprochen.

Region:
Deutschland.

Sprache:
Deutsch.

Ansprache:
Du.

Beratungen erfolgen per Telefon oder über die eigene Videofunktion.

Keine Aussagen über Vor-Ort-Beratung auf der Website.

Leistungsbereiche:

A. Unternehmensgründung und Selbstständigkeit
- Ideenfindung.
- Analyse persönlicher Fähigkeiten.
- Identifikation geeigneter Tätigkeitsfelder.
- Digitale Geschäftsmodelle.
- Geschäftsaufbau.
- Organisation.
- Vermarktung.

B. Unternehmensentwicklung
- Geschäftsprozesse.
- Digitale Optimierung.
- Onlinepräsenz.
- Automatisierung.
- Kundenakquise.
- Digitale Strategien.

C. Social Media
- Plattformstrategie.
- Profiloptimierung.
- Contentplanung.
- Reichweitenentwicklung.
- Branding.
- Vermarktung.
- Digitale Arbeitsabläufe.

D. Content Creator und Influencer
- Positionierung.
- Plattformaufbau.
- Kooperationen.
- Monetarisierungsmodelle.
- Contentprozesse.
- Creator-Websites.
- Digitale Tools.

E. Websites und Software
- Websites.
- Landingpages.
- Individuelle Webanwendungen.
- Kundenportale.
- Digitale Formulare.
- Automatisierungen.
- Individuelle Softwarelösungen.
- Technische Einrichtung.
- Weiterentwicklung.

F. Digitalisierung und KI
- Praktischer KI-Einsatz.
- Prozessunterstützung.
- Digitale Werkzeuge.
- Automatisierte Abläufe.
- Produktivitätssteigerung.

G. Trading und ETFs
- Grundlagen des Tradings.
- Grundlagen von ETFs.
- Marktmechanismen.
- Risiko- und Kostenverständnis.
- Allgemeine Finanzbildung.
- Erklärung technischer Funktionsweisen.

WICHTIGE ABGRENZUNG:
Keine individuelle Anlageberatung, keine personalisierten Kauf- oder Verkaufsempfehlungen, keine Portfolioverwaltung und keine Erfolgsgarantien anbieten.

Die Finanzinhalte dürfen ausschließlich als allgemeine Wissensvermittlung präsentiert werden, solange keine erforderliche aufsichtsrechtliche Erlaubnis vorliegt.

Auch bei anderen Leistungen keine garantierten Umsätze, Reichweiten oder Gewinne behaupten.

==================================================
4. PREISMODELL
==================================================

Folgende Preise sind verbindlich.

PREIS 1:
Kostenloses Erstgespräch.

Dauer:
15 Minuten.

Preis:
0 €.

Voraussetzungen:
- Kundenkonto erstellen.
- E-Mail bestätigen.
- Pflichtfragebogen ausfüllen.
- Freien Termin auswählen.

Ziel:
- Fähigkeiten und Interessen analysieren.
- Ausgangssituation verstehen.
- Wünsche identifizieren.
- Geeignete Tätigkeitsfelder und erste Handlungsschritte besprechen.

PREIS 2:
Vergünstigte erste Beratungsstunde.

Gesamtumfang:
60 Minuten, bestehend aus:
- 15 Minuten kostenlosem Erstgespräch.
- 45 Minuten zusätzlicher kostenpflichtiger Beratung.

Preis für die zusätzlichen 45 Minuten:
19 €.

WICHTIG:
Die kostenpflichtige Vertiefung wird als separater Folgetermin gebucht.

Die kostenlose Erstberatung wird nicht erneut berechnet.

Das Upgrade darf nur einmal pro Kunde zum Einführungspreis angeboten werden.

PREIS 3:
Normale Einzelberatung.

29 € je angefangener Stunde.

Buchbare Dauern:
30 Minuten.
60 Minuten.
90 Minuten.

Berechnung bei Einzelterminen:
30 Minuten = 29 €.
60 Minuten = 29 €.
90 Minuten = 58 €.

Die Preise müssen vor dem verbindlichen Bestellen transparent angezeigt werden.

PREIS 4:
Vier-Wochen-Paket.

Preis:
99 €.

Dauer:
28 Tage ab bestätigtem Zahlungseingang.

Kontingent:
12 Stunden insgesamt.

Die Stunden können über die vier Wochen flexibel verteilt werden.

Es besteht keine starre Beschränkung auf exakt drei Stunden pro Kalenderwoche.

Inklusive:
- Beratungen.
- Projektarbeit.
- Websites.
- Softwareentwicklung.
- Technische Einrichtung.
- Digitale Unterstützung.
- Vereinbarte Änderungsarbeiten.

Alle Arbeiten werden auf das verfügbare 12-Stunden-Kontingent angerechnet.

Keine zusätzlichen Arbeitskosten innerhalb der 12 Stunden.

Extern erforderliche Kosten für Domains, Hosting, Softwarelizenzen und andere Drittanbieter zahlt der Kunde selbst.

Diese Kosten dürfen nur nach transparenter Kommunikation und entsprechender Zustimmung entstehen.

Wenn das Stundenkontingent aufgebraucht ist, dürfen keine neuen kostenpflichtigen Arbeiten ohne ausdrückliche Kundenentscheidung ausgelöst werden.

PREIS 5:
Vier-Wochen-Rundum-Paket.

Preis:
299 € einmalig.

Laufzeit:
28 Tage ab bestätigtem Zahlungseingang.

Kein festes Stundenkontingent.

Enthalten sind:
- Beratungen.
- Projektarbeit.
- Websites.
- Software.
- Einrichtung.
- Fortlaufende Unterstützung.
- Anpassungen.
- Begleitung des Kunden.

Termine und Leistungen erfolgen nach Vereinbarung innerhalb meiner verfügbaren Kapazität.

Das Paket darf nicht so dargestellt werden, als garantiere es jederzeitige Sofortverfügbarkeit oder unendlich viele parallele Projekte.

Es gibt keine automatische Vertragsverlängerung.

Eine neue Vier-Wochen-Laufzeit muss ausdrücklich gebucht und bezahlt werden.

Zusatzkosten für externe Infrastruktur trägt der Kunde.

Alle fünf Angebote sollen professionell, verständlich und transparent kommuniziert werden.

Die Preisberechnung muss serverseitig erfolgen.

==================================================
5. ÖFFENTLICHE WEBSITE
==================================================

Erstelle folgende Seiten:

1. Startseite.
2. Leistungen.
3. Unternehmensberatung.
4. Gründung und Selbstständigkeit.
5. Social Media.
6. Content Creator und Influencer.
7. Websites und Software.
8. Digitalisierung und KI.
9. Trading- und ETF-Grundlagen.
10. Zielgruppen.
11. Preise.
12. Ablauf.
13. Über mich.
14. Kostenloses Erstgespräch.
15. Terminbuchung.
16. Blog.
17. Einzelne Blogartikel.
18. Kontakt.
19. Anmeldung.
20. Registrierung.
21. Passwort vergessen.
22. Impressum.
23. Datenschutzerklärung.
24. AGB.
25. Widerrufsbelehrung.
26. Widerrufsformular und elektronische Widerrufsfunktion.
27. Barrierefreiheitsinformationen.
28. Cookie-Einstellungen.
29. Individuelle Fehlerseiten.

Bei Bedarf dürfen weitere sinnvolle Unterseiten ergänzt werden.

Alle Seiten müssen mit echtem Layout, echten Texten, funktionierenden Formularen und sinnvoller Navigation versehen werden.

Keine Lorem-Ipsum-Texte.

Keine erfundenen Kundenstimmen.

Keine erfundenen Referenzprojekte.

Nur echte, nachweisbare und freigegebene Referenzen darstellen.

Bis dahin Referenzbereiche ausblenden oder inhaltlich anders lösen.

Keine künstliche Verknappung oder falschen Erfolgszahlen.

==================================================
6. DESIGN UND MARKENIDENTITÄT
==================================================

Visueller Stil:
Premium Editorial.

Eigenschaften:
- Hochwertig.
- Modern.
- Elegant.
- Minimalistisch.
- Eigenständig.
- Seriös.
- Persönlich.
- Zugänglich.
- Vertrauenswürdig.

Farbwelt:
Weiß.
Schwarz.
Verschiedene Grauabstufungen.

Sehr zurückhaltende Akzentfarbe bei tatsächlichem gestalterischem Mehrwert.

Ausschließlich heller Modus.

Keine Dark-Mode-Umschaltung.

Gestaltungsregeln:
- Großzügiger Weißraum.
- Präzise Typografie.
- Bewusste Hierarchien.
- Starke Headline-Bereiche.
- Hochwertige Karten und Tabellen.
- Feine Trennlinien.
- Konsistente Abstände.
- Elegante Mikrointeraktionen.
- Sehr gute mobile Darstellung.
- Keine übermäßigen Animationen.
- Keine austauschbaren Standard-Templates.
- Keine generische KI-Ästhetik.

Bildwelt:
Grafiken und individuelle Vektorelemente.

Keine künstlichen Personenbilder.
Keine Stockfotos.
Keine generischen Businessporträts.

Entwickle ein konsistentes eigenes Designsystem.

Branding:
- Primärlogo.
- Wortmarke.
- Separates Signet.
- Favicon.
- Social-Sharing-Grafik.
- Grafische Gestaltungselemente.
- Farb- und Typografiesystem.
- Brand-Guidelines.

Nutze keinen automatischen Logo-Generator und keine Bild-KI zur Logoerstellung.

Erstelle individuell konzipierte, sauber umgesetzte Vektorgrafiken und typografische Komponenten.

Da der Markenname noch offen ist, muss das Branding vollständig austauschbar aufgebaut werden.

Nutze dafür:
{{BRAND_NAME}}

Auch der öffentliche Domainname ist noch offen.

Nutze:
{{DOMAIN}}

Gestalte das Branding so, dass nach Eintragung des endgültigen Markennamens nicht die gesamte Website neu entwickelt werden muss.

Bis zur Festlegung des Markennamens darf keine unfertige Identität als finale Marke ausgegeben werden.

==================================================
7. RESPONSIVES NUTZERERLEBNIS
==================================================

Alle Funktionen müssen auf folgenden Geräten funktionieren:

- iPhone.
- Android.
- Tablet.
- Notebook.
- Desktop-PC.

Besonders optimieren:
- Navigation.
- Registrierung.
- Terminbuchung.
- Kundenchat.
- Kundenprojekte.
- Dokumentenansicht.
- Admin-Dashboard.
- Rechnungsansicht.
- Blogeditor.

Auf mobilen Geräten dürfen keine abgeschnittenen Elemente, überlaufenden Tabellen oder unbedienbaren Dialoge auftreten.

Wichtige Bedienelemente müssen auch per Tastatur nutzbar sein.

Vermeide Layoutsprünge.

Formulare müssen Fehler direkt verständlich erklären.

Bestätigungen sollen eindeutig sein.

==================================================
8. KUNDENREGISTRIERUNG
==================================================

Entwickle eine sichere Kontoverwaltung.

Funktionen:
- Registrieren.
- E-Mail-Bestätigung.
- Anmelden.
- Abmelden.
- Passwort zurücksetzen.
- Passwort ändern.
- Kontaktdaten verwalten.
- Rechnungsadresse verwalten.
- Datenschutzpräferenzen verwalten.
- Kontoübersicht.
- Datenschutzanfragen stellen.

Jeder Kunde besitzt genau einen eigenen Kundenaccount.

Kein Teamzugang für Kunden.

Keine Einsicht in Daten anderer Kunden.

Bereits das kostenlose Erstgespräch benötigt einen bestätigten Kundenaccount.

Sichere Passwortspeicherung verwenden.

E-Mail-Verifizierung implementieren.

Registrierung gegen Missbrauch absichern.

Minderjährige dürfen die Plattform grundsätzlich nutzen.

Wo für Registrierung, Einwilligungen oder kostenpflichtige Verträge erforderlich, muss eine überprüfbare Zustimmung beziehungsweise Vertretung durch Erziehungsberechtigte vorgesehen werden.

Ohne erforderliche Zustimmung keine kostenpflichtige Bestellung freigeben.

Erforderliche Nachweise datensparsam verarbeiten.

==================================================
9. VERPFLICHTENDES ONBOARDING
==================================================

Jeder neue Kunde muss vor dem ersten Beratungstermin einen Fragebogen ausfüllen.

Felder:
- Aktuelle berufliche Situation.
- Gewünschte Branche.
- Vorhandene Erfahrungen.
- Persönliche Stärken.
- Technische Fähigkeiten.
- Gewünschte Ziele.
- Aktuelle Herausforderungen.
- Verfügbare Zeit.
- Gewünschte Unterstützung.
- Bereits vorhandene Website oder Social-Media-Präsenz.
- Individuelle Hinweise.

Dynamische Fragen je Interessengebiet.

Der Fragebogen muss:
- Übersichtlich sein.
- Zwischengespeichert werden.
- Fortgesetzt werden können.
- Im Kundenkonto sichtbar sein.
- Im Admin-Dashboard auswertbar sein.

Pflichtfelder sinnvoll wählen.

Nur erforderliche personenbezogene Daten erfassen.

==================================================
10. TERMINBUCHUNG UND KALENDER
==================================================

Arbeitszeiten:

Montag bis Freitag:
08:30–17:00 Uhr.

Samstag und Sonntag:
12:00–17:00 Uhr.

Zeitzone:
Europe/Berlin.

Mindestvorlauf:
0 Stunden.

Puffer zwischen Terminen:
0 Minuten.

Buchungsdauer:
15, 30, 45, 60 oder 90 Minuten, abhängig von der gebuchten Leistung.

Alle Termine müssen mit dem verfügbaren Zeitfenster abgeglichen werden.

Keine Doppelbuchungen.

Keine parallelen Beratungstermine.

Admin kann:
- Verfügbarkeiten ändern.
- Einzelne Tage sperren.
- Urlaub eintragen.
- Sonderzeiten vergeben.
- Termine manuell erstellen.
- Termine verschieben.
- Termine absagen.
- Termine bestätigen.
- Buchungen blockieren.

Kunden können:
- Freie Zeiten sehen.
- Passende Leistungen buchen.
- Termine jederzeit bis zum vereinbarten Beginn verschieben.
- Termine entsprechend den geltenden Bedingungen absagen.
- Terminübersicht ansehen.
- Kalenderdateien herunterladen.

Terminerinnerungen:
24 Stunden vorher.
1 Stunde vorher.

Bei kurzfristigen Buchungen dürfen keine bereits vergangenen Erinnerungen versendet werden.

Alle Termine erhalten eindeutige IDs.

Erstelle eigene ICS-Kalendereinladungen.

Bei Terminverschiebungen aktualisierte Einladungen bereitstellen.

Berücksichtige Sommer- und Winterzeit korrekt.

Kostenpflichtige Termine:
Zunächst reserviert.

Reservierung:
Maximal 48 Stunden oder bis zum Terminbeginn, falls dieser früher liegt.

Nach manuell bestätigtem Zahlungseingang:
Termin verbindlich bestätigt.

Nicht bezahlte Reservierungen:
Nach Fristende automatisch freigeben.

Verhindere Race Conditions bei parallelen Buchungen.

==================================================
11. TELEFON- UND VIDEOBERATUNG
==================================================

Zwei Beratungsarten:

A. Telefonberatung:
Ich rufe den Kunden zum Termin an.

B. Videoberatung:
Eigene integrierte Videofunktion innerhalb der Website.

Keine Zoom-, Microsoft-Teams-, Google-Meet- oder vergleichbare externe Videoplattform als verpflichtende Abhängigkeit.

Für die Videofunktion:
- Eigenes WebRTC-basiertes System.
- Geschützte Besprechungsräume.
- Signierte zeitlich begrenzte Zugänge.
- Mikrofonsteuerung.
- Kamerasteuerung.
- Verbindung beenden.
- Verbindungsstatus.
- Verständliche Fehlerbehandlung.
- Kamera- und Mikrofonberechtigungen.
- Responsive Meetingoberfläche.
- Sichere Zugangskontrolle.

Keine Aufzeichnung.

Keine Aufnahmefunktion.

Keine heimliche Speicherung von Audio- oder Videodaten.

Prüfe die tatsächlich verfügbare Hostingumgebung.

Sollte Checkdomain-Webhosting keine dauerhaft laufenden Signalisierungs- oder TURN-Dienste unterstützen:
- Entwickle eine separat deploybare, selbst betriebene Videoinfrastruktur.
- Nutze nur lokal betriebene und selbst kontrollierte Komponenten.
- Erstelle vollständige Installations- und Konfigurationsdateien.
- Dokumentiere die benötigten Serverressourcen.
- Halte die Anwendung so vorbereitet, dass sie nach Bereitstellung dieser Infrastruktur ohne neue Entwicklung aktiviert werden kann.

Die zusätzliche Serverbeschaffung ist eine externe Abhängigkeit.

Keine kostenpflichtigen Server bestellen.

Die Videofunktion nicht fälschlich als produktiv betriebsbereit kennzeichnen, bevor sie tatsächlich erreichbar und geprüft wurde.

==================================================
12. KUNDEN-DASHBOARD
==================================================

Erstelle ein vollständiges geschütztes Kundenportal.

Dashboardbereiche:

1. Übersicht.
2. Meine Termine.
3. Beratung buchen.
4. Meine Pakete.
5. Stundenkontingent.
6. Meine Projekte.
7. Projektaufgaben.
8. Dateien.
9. Projektfreigaben.
10. Nachrichten.
11. Angebote.
12. Rechnungen.
13. Benachrichtigungen.
14. Profil.
15. Datenschutz.
16. Support.

Startseite des Dashboards:
- Persönliche Begrüßung.
- Nächster Termin.
- Aktives Paket.
- Ablaufdatum.
- Verbleibende Stunden.
- Laufende Projekte.
- Offene Aufgaben.
- Ungelesene Nachrichten.
- Offene Angebote.
- Offene Zahlungen.

Alles muss aus der echten Datenbank geladen werden.

==================================================
13. PROJEKTVERWALTUNG
==================================================

Ein Kunde kann mehrere Projekte besitzen.

Projektfelder:
- Projektname.
- Beschreibung.
- Kategorie.
- Erstellungsdatum.
- Verantwortlicher Admin.
- Projektstatus.
- Fortschritt.
- Aufgaben.
- Meilensteine.
- Dateien.
- Kommentare.
- Aufgewendete Zeit.
- Freigaben.
- Änderungsanfragen.

Mögliche Projektstatus:
Angefragt.
Geplant.
In Bearbeitung.
Wartet auf Kunden.
Freigabe erforderlich.
Abgeschlossen.
Archiviert.

Projektfortschritt:
Kombiniert aus erledigten Aufgaben beziehungsweise Meilensteinen und manueller Administrationskorrektur.

Kunden dürfen:
- Projekte ansehen.
- Aufgaben anfragen.
- Dateien hochladen.
- Ergebnisse kommentieren.
- Freigaben erteilen.
- Änderungswünsche senden.

Kunden dürfen keine Adminaufgaben unmittelbar erzwingen.

Neue Kundenaufgaben werden zuerst als Anfrage angelegt.

Erst die Freigabe durch den Admin überführt die Anfrage in die tatsächliche Projektplanung.

==================================================
14. DETAILLIERTE ZEITERFASSUNG
==================================================

Admin kann Zeit erfassen über:
- Start.
- Pause.
- Fortsetzen.
- Stoppen.

Zusätzlich:
Manuelle Zeitbuchungen.

Jede Buchung enthält:
- Kunden-ID.
- Projekt-ID.
- Datum.
- Start und Ende.
- Dauer.
- Tätigkeit.
- Beschreibung.
- Erfassungsart.
- Admin-Kommentar.
- Paketzuordnung.

Die Zeit wird serverseitig berechnet und gespeichert.

Keine doppelte Anrechnung.

Keine negativen Zeiten.

Keine Überschneidungen eigener aktiver Timer ohne ausdrückliche Behandlung.

Im Kundenportal:
Detaillierte, verständliche Zeittabelle.

Bei 99-€-Paketen:
Zeit vom 12-Stunden-Kontingent abziehen.

Bei 299-€-Paketen:
Zeit zur Transparenz erfassen, aber keine Stundenobergrenze anwenden.

Historische Zeiten bleiben auch nach Paketablauf nachvollziehbar.

Korrekturen durch Admin mit Änderungsprotokoll.

==================================================
15. EIGENER KUNDENCHAT
==================================================

Implementiere einen eigenen Chat.

Nur zwischen Kunde und Administrator.

Keine externen Chat-Dienste.

Funktionen:
- Nachrichten senden.
- Nachrichten empfangen.
- Lesestatus.
- Zeitstempel.
- Datei-Anhänge.
- Ungelesene Nachrichten.
- Suchfunktion.
- Zugehörige Projekte verlinken.
- Benachrichtigungen.

Admin und Kunde sehen ausschließlich ihre berechtigten Nachrichten.

Neue Kundennachricht:
Benachrichtigung im Admin-Dashboard und per E-Mail.

Neue Adminnachricht:
Kundenbenachrichtigung und gegebenenfalls E-Mail.

Keine Nachrichten an fremde Kunden durch fehlerhafte ID-Manipulation.

==================================================
16. DATEIVERWALTUNG
==================================================

Kunden und Admin können Dateien hochladen.

Unterstütze geeignete Formate:
- PDF.
- Bilder.
- Textdokumente.
- Tabellen.
- ZIP-Projektarchive.
- Weitere freigegebene Projektformate.

Prüfe Dateiendung und tatsächlichen Dateityp.

Definiere angemessene Größenlimits.

Speichere private Dateien geschützt außerhalb des öffentlich erreichbaren Webroots oder über eine gleichwertig abgesicherte Speicherlösung.

Kein Zugriff über direkt erratbare URLs.

Nur authentifizierte, berechtigte Benutzer dürfen Dateien herunterladen.

Dateien werden konkreten Kunden und Projekten zugeordnet.

Projektdateien:
Sechs Monate nach Projektabschluss aufbewahren.

Vor Löschung:
Automatische Vorabbenachrichtigung.

Nach Ablauf:
Datenschutzgerechte Entfernung, soweit keine längeren gesetzlichen Pflichten entgegenstehen.

Gesetzlich aufbewahrungspflichtige Rechnungs- und Buchhaltungsunterlagen werden davon getrennt behandelt.

Löschfristen müssen administrativ nachvollziehbar sein.

==================================================
17. PROJEKTFREIGABEN
==================================================

Kunden können Ergebnisse prüfen.

Aktionen:
- Freigeben.
- Änderungen anfordern.
- Kommentar hinterlassen.

Speichere:
- Freigabezeitpunkt.
- Projekt.
- Version.
- Beteiligten Benutzer.
- Kommentar.
- Status.

Nach Freigabe:
Admin erhält Benachrichtigung.

Nach Änderungsanforderung:
Projektstatus entsprechend aktualisieren.

==================================================
18. ADMIN-DASHBOARD
==================================================

Ein einzelner Administrationszugang.

Keine zusätzlichen Adminrollen erforderlich.

Admin-Navigation:

1. Übersicht.
2. Kunden.
3. Registrierungen.
4. Onboarding.
5. Kalender.
6. Buchungen.
7. Beratungen.
8. Projekte.
9. Aufgaben.
10. Zeiterfassung.
11. Pakete.
12. Kundenchat.
13. Dateien.
14. Angebote.
15. Rechnungen.
16. Zahlungen.
17. E-Mail-Center.
18. Benachrichtigungen.
19. Blog.
20. Website-Inhalte.
21. Kontaktanfragen.
22. Datenschutzanfragen.
23. Geschäfts- und Rechtseinstellungen.
24. Systemkonfiguration.
25. Sicherheitsprotokolle.
26. Backups.
27. Systemstatus.

Dashboard-Kennzahlen:
- Registrierte Kunden.
- Aktive Kunden.
- Heutige Termine.
- Anstehende Termine.
- Offene Reservierungen.
- Aktive Projekte.
- Überfällige Aufgaben.
- Offene Angebote.
- Offene Rechnungen.
- Bestätigte Zahlungen.
- Aktive Pakete.
- Auslaufende Pakete.
- Ungelesene Nachrichten.

Admin kann sämtliche relevanten Kundendaten und Geschäftsprozesse in übersichtlichen Detailansichten verwalten.

Jede kritische administrative Änderung protokollieren.

==================================================
19. PAKETVERWALTUNG
==================================================

Vier-Wochen-Laufzeit:
Genau 28 Tage ab bestätigtem Zahlungseingang.

Nicht ab Beginn eines Kalendermonats.

Admin sieht:
- Kunde.
- Paket.
- Kaufdatum.
- Zahlungsdatum.
- Laufzeitbeginn.
- Ablaufdatum.
- Verbrauchte Stunden.
- Verbleibende Stunden.
- Paketstatus.
- Verlängerungshistorie.

Paketstatus:
Reserviert.
Zahlung ausstehend.
Aktiv.
Läuft bald ab.
Abgelaufen.
Storniert.

Kunde kann aktiv eine Verlängerung bestellen.

Keine automatische Abbuchung.
Keine automatische kostenpflichtige Verlängerung.

Die neue Laufzeit beginnt nach bestätigtem Zahlungseingang entsprechend der transparent kommunizierten Verlängerungsregel.

Überschneidungen und Doppelberechnungen vermeiden.

==================================================
20. BANKÜBERWEISUNG
==================================================

Einzige Zahlungsart:
Banküberweisung.

Keine Stripe-Integration.
Keine PayPal-Integration.
Kein externer Checkout.
Kein Kreditkartenanbieter.

Benötigte Bankdaten:

{{ACCOUNT_HOLDER}}
{{IBAN}}
{{BIC}}
{{BANK_NAME}}

Alle Felder zentral verwalten.

Jede Bestellung erhält eine eindeutige Bestell- und Zahlungsreferenz.

Ablauf:
1. Kunde wählt Leistung.
2. Kunde sieht Leistungsumfang und vollständigen Preis.
3. Kunde bestätigt die kostenpflichtige Bestellung.
4. System erstellt Bestellung.
5. Bei Terminbuchung wird eine vorläufige Reservierung angelegt.
6. Kunde erhält Zahlungsinformationen per E-Mail.
7. Admin sieht offene Zahlung.
8. Admin prüft den tatsächlichen Bankeingang.
9. Admin markiert die Zahlung als eingegangen.
10. Das System aktiviert den entsprechenden Geschäftsprozess.
11. Bestätigung und gegebenenfalls Rechnung werden automatisch versendet.

Keine automatische Behauptung eines Zahlungseingangs.

Keine Bankdaten-Scraper.

Keine Bank-API erforderlich.

Zahlungsstatus:
Offen.
Teilweise bezahlt.
Bezahlt.
Überfällig.
Storniert.
Erstattet.

Änderungen auditierbar speichern.

==================================================
21. RECHNUNGSSYSTEM
==================================================

Implementiere ein vollständiges eigenes Rechnungssystem.

Rechnungen zunächst als Entwurf erzeugen.

Bei bestätigtem Zahlungseingang:
Rechnung finalisieren und automatisch als PDF per E-Mail versenden.

Weitere gesetzlich erforderliche Rechnungsfälle korrekt berücksichtigen.

Rechnungen benötigen:
- Eindeutige Rechnungsnummer.
- Rechnungsdatum.
- Leistungserbringer.
- Kundenname.
- Kundenanschrift.
- Steueridentifikationsangaben nach geltenden Vorschriften.
- Leistungsbeschreibung.
- Leistungszeitraum.
- Gesamtbetrag.
- Umsatzsteuerhinweis.
- Bankverbindung.
- Zahlungsreferenz.
- Zahlungsstatus.

Rechnungsnummern:
RE-JJJJ-0001

Angebotsnummern:
AN-JJJJ-0001

Rechnungen dürfen nach Finalisierung nicht unkontrolliert verändert werden.

Korrekturen über nachvollziehbare Korrektur- beziehungsweise Stornobelege abwickeln.

Steuerstatus:
Kleinunternehmer nach § 19 UStG.

Keine Umsatzsteuer gesondert ausweisen.

Die Rechnungsangaben müssen die geltenden Anforderungen für Kleinunternehmer erfüllen.

Reguläre Zahlungsfrist bei fälligen Rechnungen:
7 Tage.

Bei bereits bezahlten Rechnungen:
Zahlungseingang und Status „Bezahlt“ eindeutig ausweisen.

Beachte:
Die gesonderte Reservierungsfrist von 48 Stunden bleibt davon unberührt.

Rechnungsformat:
PDF.

Rechnungsvorlagen optisch hochwertig und gut lesbar gestalten.

PDF-Dateien aus echten Daten erstellen.

Rechnungshistorie je Kunde.

Rechnungshistorie im Admin.

Rechnungen im Kundenportal herunterladen.

Archivierung gesetzlich relevanter Unterlagen.

Eingehende elektronische Rechnungen müssen über die geschäftliche E-Mail-Adresse empfangen und ordnungsgemäß abgelegt werden können.

==================================================
22. ANGEBOTSSYSTEM
==================================================

Admin erstellt Angebote.

Funktionen:
- Neues Angebot.
- Angebot bearbeiten.
- Positionen hinzufügen.
- Mengen und Preise bearbeiten.
- Leistungsbeschreibung.
- Zahlungsbedingungen.
- Angebotsgültigkeit.
- PDF-Vorschau.
- Angebot versenden.

Gültigkeit:
7 Tage.

Kunde erhält:
E-Mail-Benachrichtigung und Portalzugriff.

Im Kundenportal:
- Angebot lesen.
- PDF herunterladen.
- Angebot annehmen.
- Angebot ablehnen.

Annahme mit eindeutigem Zeitstempel und dokumentierter Erklärung.

Angenommene Angebote:
Automatisch passenden Rechnungsentwurf erstellen.

Keine automatische Zahlungsauslösung.

Keine ungewollten Doppelrechnungen.

==================================================
23. AUTOMATISCHE ZAHLUNGSERINNERUNGEN
==================================================

Für tatsächlich offene, fällige Rechnungen automatische Zahlungserinnerungen.

Voreinstellung:
3 Tage nach Fälligkeit.
7 Tage nach Fälligkeit.

Vor jeder Erinnerung:
Aktuellen Zahlungsstatus prüfen.

Keine Erinnerung nach bestätigter vollständiger Zahlung.

Keine mehrfachen Erinnerungen durch wiederholte Cronjobausführung.

Erinnerungen freundlich und professionell formulieren.

Bei abgelaufenen unbezahlten Terminreservierungen:
Separate Information über Reservierungsablauf senden.

Reservierungsablauf und Rechnungserinnerung sind unterschiedliche Geschäftsprozesse.

==================================================
24. E-MAIL-SYSTEM
==================================================

Verwende ausschließlich die später eingerichteten E-Mail-Postfächer bei Checkdomain.

Vorgesehener Absender:
kontakt@{{DOMAIN}}

Konfigurationsfelder:
{{SMTP_HOST}}
{{SMTP_PORT}}
{{SMTP_USERNAME}}
{{SMTP_PASSWORD}}
{{SMTP_ENCRYPTION}}
{{MAIL_FROM_ADDRESS}}
{{MAIL_FROM_NAME}}

Anmeldedaten niemals im Quellcode hinterlegen.

SMTP über sichere Verbindung.

Automatische E-Mails:

1. Registrierung.
2. E-Mail-Verifizierung.
3. Passwort zurücksetzen.
4. Kostenloses Erstgespräch bestätigt.
5. Onboarding abgeschlossen.
6. Buchung reserviert.
7. Zahlungsinformationen.
8. Zahlung bestätigt.
9. Termin bestätigt.
10. Terminerinnerung 24 Stunden.
11. Terminerinnerung 1 Stunde.
12. Termin verschoben.
13. Termin abgesagt.
14. Reservierung abgelaufen.
15. Neues Angebot.
16. Angebot angenommen.
17. Angebot abgelehnt.
18. Rechnung versendet.
19. Zahlungserinnerung.
20. Paket aktiviert.
21. Paket läuft bald ab.
22. Paket abgelaufen.
23. Verlängerung bestätigt.
24. Neue Chatnachricht.
25. Projektstatus geändert.
26. Aufgabe freigegeben.
27. Datei verfügbar.
28. Projektfreigabe angefordert.
29. Datenschutzanfrage eingegangen.
30. Datenschutzanfrage bearbeitet.

Erstelle professionell gestaltete HTML-E-Mails mit funktionierender Textalternative.

Alle Vorlagen erhalten:
- Betreff.
- Individuelle Anrede.
- Inhalt.
- Geeigneten CTA.
- Signatur.
- Rechtlich erforderliche Absenderdaten.

Admin-E-Mail-Center:
- Individuelle E-Mail verfassen.
- Empfänger auswählen.
- HTML-Editor.
- Live-Vorschau.
- Betreff.
- Anhänge.
- Vorlagen.
- Senden.
- Versandhistorie.
- Versandstatus.

Manuelle E-Mails müssen vor dem finalen Versand eine Vorschau anzeigen.

Automatische System-E-Mails benötigen keine manuelle Einzelbestätigung.

Implementiere eine Versandwarteschlange.

Wiederholungsversuche bei temporären SMTP-Fehlern.

Verhindere doppelten Versand.

Versandfehler im Admin anzeigen.

Unterscheide technisch zwischen:
- In Versandwarteschlange.
- An SMTP übergeben.
- Versand fehlgeschlagen.

Nicht behaupten, dass eine E-Mail im Posteingang angekommen ist, wenn nur die SMTP-Übergabe bestätigt wurde.

==================================================
25. BLOG UND CONTENT-MANAGEMENT
==================================================

Eigenes integriertes Blogsystem.

Kein WordPress.
Kein externes CMS.

Admin kann:
- Beiträge erstellen.
- Beiträge bearbeiten.
- Beiträge löschen beziehungsweise archivieren.
- Entwürfe speichern.
- Beiträge veröffentlichen.
- Veröffentlichungszeit planen.
- Kategorien verwalten.
- Bilder und Grafiken hinzufügen.
- SEO-Titel bearbeiten.
- Meta-Beschreibungen hinterlegen.
- URL-Slugs bearbeiten.
- Vorschau anzeigen.

Visueller Editor:
- Überschriften.
- Absätze.
- Listen.
- Links.
- Tabellen.
- Grafiken.
- Hervorhebungen.
- Zitate.

Bei HTML-Verarbeitung sichere Inhaltsbereinigung anwenden.

Keine ausführbaren Skripte durch Blogbeiträge zulassen.

Zum Start fünf hochwertige eigenständige Artikel zu:
1. Digitale Selbstständigkeit.
2. Unternehmensgründung und Positionierung.
3. Social-Media-Strategie.
4. Website und Onlinepräsenz.
5. Digitale Prozesse und Automatisierung.

Fachliche Aussagen sorgfältig prüfen.

Keine erfundenen Quellen oder Statistiken.

Blogkommentare:
Deaktiviert.

==================================================
26. SEO
==================================================

Technisches SEO vollständig implementieren.

Dazu:
- Individuelle Seitentitel.
- Meta-Descriptions.
- Sinnvolle Überschriftenstruktur.
- Canonical-URLs.
- XML-Sitemap.
- robots.txt.
- Open-Graph-Metadaten.
- Social-Sharing-Metadaten.
- Strukturierte Daten, soweit sachlich korrekt.
- Saubere interne Verlinkung.
- Lesbare URLs.
- Optimierte Bilder und SVGs.
- Gute Ladezeiten.
- Responsive Darstellung.
- Korrekte 404-Seite.

Keine erfundenen Unternehmensbewertungen.

Keine Fake-Sterne.

Keine nicht belegbaren Auszeichnungen.

Bei noch fehlender Domain:
Basis-URL zentral konfigurieren.

==================================================
27. ADMIN-BENACHRICHTIGUNGEN
==================================================

Admin erhält wichtige Ereignisse:

- Im Dashboard.
- Per E-Mail.

Beispiele:
- Neue Registrierung.
- Neuer Termin.
- Neue Zahlung wartet auf Prüfung.
- Neue Nachricht.
- Neue Aufgabe.
- Kunde hat Angebot angenommen.
- Kunde verlangt Projektänderung.
- Neues Dokument.
- Paket läuft ab.
- Datenschutzanfrage.
- Technischer Fehler.
- Fehler beim Mailversand.
- Erfolgloser Backupversuch.

Benachrichtigungen:
- Als gelesen markieren.
- Nach Typ filtern.
- Nach Kunde filtern.
- Nach Datum filtern.
- Detailansicht öffnen.

==================================================
28. DATENSCHUTZ UND COOKIES
==================================================

Entwickle eine echte, integrierte Datenschutzverwaltung.

Keine externen Consent-Plattformen.

Cookies:
Technisch notwendige Cookies dürfen entsprechend ihrer Funktion eingesetzt werden.

Optionale Cookies und Besucherstatistiken:
Erst nach wirksamer Zustimmung aktivieren.

Cookie-Dialog:
- Verständliche Erklärung.
- Ablehnen.
- Zustimmen.
- Individuelle Auswahl.
- Einstellungen später ändern.

Keine vorausgewählten optionalen Zustimmungen.

Einwilligungen dokumentieren.

Widerruf der Einwilligung ermöglichen.

Besucherstatistiken:
Eigene, datenschutzschonende Lösung.

Keine externe Google-Analytics-Integration.

Ohne Einwilligung keine optionalen Besucherstatistiken erheben.

Datenschutzportal:
- Eigene gespeicherte Daten einsehen.
- Datenauskunft anfordern.
- Datenexport anfordern.
- Berichtigung anfordern.
- Löschung anfordern.
- Anfrageverlauf sehen.

Admin:
- Anfrage bearbeiten.
- Bearbeitungsstatus ändern.
- Gesetzliche Aufbewahrungsfristen berücksichtigen.
- Erledigung dokumentieren.

Keine pauschale Löschung gesetzlich aufzubewahrender Rechnungen.

==================================================
29. RECHTLICHE SEITEN
==================================================

Erstelle folgende rechtliche Bereiche vollständig strukturiert:

Impressum.
Datenschutzerklärung.
AGB.
Widerrufsbelehrung.
Muster-Widerrufsformular.
Elektronische Widerrufsfunktion.
Barrierefreiheitsinformationen.
Cookie-Informationen.
Vertragsinformationen.
Preis- und Zahlungsinformationen.

Unterscheide bei Bedarf Verbraucher und Unternehmer.

Berücksichtige die rechtlichen Anforderungen an Online-Vertragsabschlüsse.

Bei kostenpflichtigen Bestellungen muss eindeutig erkennbar sein, dass eine Zahlungspflicht ausgelöst wird.

Die elektronische Widerrufsfunktion muss, soweit gesetzlich erforderlich, mit entsprechender Bestätigung und nachweisbarer Eingangsbestätigung implementiert werden.

Für Dienstleistungen, die während einer Widerrufsfrist beginnen sollen, rechtlich erforderliche ausdrückliche Erklärungen und Informationen in den Buchungsablauf integrieren.

Keine pauschalen Ausschlüsse gesetzlicher Verbraucherrechte.

Keine ungeprüften Behauptungen, sämtliche Texte seien anwaltlich zertifiziert.

Verlässliche geltende Rechtsquellen berücksichtigen.

Wichtige Quellen:
https://www.gesetze-im-internet.de/ddg/__5.html
https://www.gesetze-im-internet.de/bgb/__356a.html
https://www.gesetze-im-internet.de/ustdv_1980/__34a.html
https://www.gesetze-im-internet.de/bfsg/__3.html
https://eur-lex.europa.eu/eli/reg/2024/1689/oj/deu

Rechtsform laut Geschäftsmodell:
Freiberufliche Tätigkeit.

Steuerstatus:
Kleinunternehmer.

Die endgültige steuer- und gewerberechtliche Einordnung darf nicht ohne Prüfung als behördlich bestätigt dargestellt werden.

==================================================
30. BARRIEREFREIHEIT
==================================================

Zielstandard:
WCAG 2.2 AA.

Umsetzen:
- Semantisches HTML.
- Tastaturbedienbarkeit.
- Sichtbare Fokusindikatoren.
- Ausreichende Kontraste.
- Skalierbare Schrift.
- Beschriftete Formularfelder.
- Verständliche Fehlermeldungen.
- Screenreader-Kompatibilität.
- Sinnvolle Überschriftenhierarchie.
- Alternative Texte für relevante Grafiken.
- Bewegungsreduktion.
- Barrierefreie Modaldialoge.
- Barrierefreie Kalenderbedienung.
- Barrierefreier Cookie-Dialog.
- Barrierefreie PDF-Ausgabe, soweit technisch umsetzbar.

Keine wesentlichen Bereiche ausschließlich per Maus bedienbar gestalten.

==================================================
31. KENNZEICHNUNG KI-GENERIERTER MEDIEN
==================================================

Verwalte für Medien relevante Herkunftsinformationen.

Erfasse:
- Original oder KI-generiert.
- Quelle.
- Erstellungsdatum.
- Veröffentlichungsdatum.
- Erforderliche Kennzeichnung.

Wenn für konkrete KI-generierte Inhalte eine Kennzeichnungspflicht besteht, muss diese sichtbar und verständlich umgesetzt werden.

Insbesondere täuschend echte synthetische Inhalte dürfen nicht ohne erforderliche Offenlegung erscheinen.

Keine generativen Bildtools für das Branding verwenden.

Keine erfundenen echten Personen als vermeintliche Teammitglieder darstellen.

==================================================
32. SICHERHEIT
==================================================

Die Plattform verarbeitet personenbezogene Kunden- und Geschäftsdaten.

Sicherheit hat hohe Priorität.

Implementiere:
- HTTPS.
- Sichere Sitzungsverwaltung.
- Sichere Passwort-Hashes.
- Schutz gegen SQL-Injection.
- Schutz gegen XSS.
- Schutz gegen CSRF.
- Sichere Dateiuploads.
- Zugriffskontrollen auf Serverebene.
- Strikte Trennung der Kundendaten.
- Sichere Passwort-Zurücksetzung.
- Login-Rate-Limiting.
- Schutz gegen Session-Fixation.
- Sichere Cookies.
- Geeignete Sicherheitsheader.
- Eingabevalidierung.
- Serverseitige Berechtigungsprüfung.
- Sichere Geheimnisverwaltung.
- Audit-Protokolle.
- Datenbankmigrationen.
- Fehlerprotokollierung ohne Offenlegung sensibler Daten.

Admin-Zugang:
Ein einzelner Administrator.

Admin-Zwei-Faktor-Authentifizierung:
Einmalcode per E-Mail.

OTP:
- Zeitlich begrenzt.
- Einmalig verwendbar.
- Gegen wiederholte Versuche geschützt.
- Serverseitig verifiziert.

Admin darf nicht allein durch Änderung einer URL als Kunde oder anderer Admin auftreten können.

Kunden dürfen niemals fremde Angebote, Rechnungen, Projekte, Dateien oder Chats abrufen.

Keine öffentlich zugänglichen Konfigurationsdateien.

Keine Produktionspasswörter im Repository.

==================================================
33. HOSTING UND TECHNISCHE ARCHITEKTUR
==================================================

Domainanbieter:
Checkdomain.

E-Mail-Anbieter:
Checkdomain.

Hostingtarif:
Noch unbekannt.

Baue die Hauptanwendung bevorzugt mit einer Architektur, die mit aktuellem Checkdomain-Webhosting vereinbar ist.

Geeignete Ausgangsbasis:
- Aktuelle unterstützte PHP-Version.
- MySQL.
- Serverseitiges Backend.
- Modernes responsives Frontend.
- Eigene API.
- Eigene Authentifizierung.
- Serverseitige Sessions.
- Selbst verwaltete Dateien.
- Serverseitige PDF-Erzeugung.

Prüfe vor endgültiger Festlegung die tatsächlichen Laufzeitvoraussetzungen.

Bibliotheken dürfen verwendet werden, wenn sie:
- Im Projekt lokal eingebunden sind.
- Keine verpflichtende fremde SaaS-Infrastruktur benötigen.
- Wartbar sind.
- Sicherheitsupdates erhalten.
- Mit dem Hosting kompatibel sind.

Keine externen Plattformdienste wie:
Supabase.
Firebase.
Vercel.
Calendly.
Stripe.
PayPal.
Zoom.
Externe Chatplattformen.
Externe CMS-Dienste.

Keine externen CDN-Abhängigkeiten im Produktivbetrieb.

Schriftdateien und benötigte Frontend-Bibliotheken lokal ausliefern.

Wenn ein eigener zusätzlicher Server für Videokommunikation zwingend erforderlich ist, diesen als klar getrennte, selbst betriebene Infrastruktur entwickeln.

Keine Technologie wählen, die ohne die erforderliche Serverumgebung dauerhaft nicht lauffähig wäre.

==================================================
34. AUTOMATISCHE HINTERGRUNDAUFGABEN
==================================================

Implementiere einen zuverlässigen Aufgabenmechanismus für:

- Terminerinnerungen.
- Zahlungserinnerungen.
- Reservierungsablauf.
- Paketaktivierung.
- Paketablauf.
- Verlängerungsbenachrichtigungen.
- Geplante Blogveröffentlichungen.
- E-Mail-Warteschlange.
- Dateiaufbewahrung.
- Datenschutzlöschungen.
- Backupüberwachung.

Falls Checkdomain-Cronjobs verwendet werden:
Sicherheitsgeschützte, nur intern autorisierte Ausführung vorsehen.

Aufgaben müssen wiederholbar sein, ohne doppelte Geschäftsvorgänge auszulösen.

Fehlgeschlagene Aufgaben:
Protokollieren und kontrolliert erneut versuchen.

==================================================
35. BACKUPS UND WIEDERHERSTELLUNG
==================================================

Automatische tägliche Backups.

Sichern:
- Datenbank.
- Geschäftliche Konfiguration.
- Kundendateien.
- Projektdateien.
- Wichtige Anwendungseinstellungen.

Backups dürfen nicht öffentlich abrufbar sein.

Vertrauliche Backups schützen und geeignet verschlüsseln.

Wiederherstellungsanleitung erstellen.

Wiederherstellbarkeit prüfen.

Backupfehler an Admin melden.

Backup-Aufbewahrungsfrist:
Standardmäßig 30 Tage, soweit Speicherbedarf, Datenschutz und Hostingkonfiguration dies zulassen.

==================================================
36. ZENTRALE SYSTEMKONFIGURATION
==================================================

Folgende Angaben fehlen derzeit bewusst:

{{BRAND_NAME}}
{{DOMAIN}}
{{PUBLIC_BASE_URL}}
{{LEGAL_FULL_NAME}}
{{BUSINESS_NAME}}
{{BUSINESS_STREET}}
{{BUSINESS_POSTCODE}}
{{BUSINESS_CITY}}
{{BUSINESS_COUNTRY}}
{{PUBLIC_PHONE}}
{{CONTACT_EMAIL}}
{{TAX_NUMBER}}
{{VAT_ID_IF_AVAILABLE}}
{{SMALL_BUSINESS_ID_IF_AVAILABLE}}
{{ACCOUNT_HOLDER}}
{{IBAN}}
{{BIC}}
{{BANK_NAME}}
{{SMTP_HOST}}
{{SMTP_PORT}}
{{SMTP_USERNAME}}
{{SMTP_PASSWORD}}
{{SMTP_ENCRYPTION}}
{{ADMIN_EMAIL}}
{{HOSTING_DATABASE_HOST}}
{{HOSTING_DATABASE_NAME}}
{{HOSTING_DATABASE_USER}}
{{HOSTING_DATABASE_PASSWORD}}
{{VIDEO_SIGNALING_URL}}
{{VIDEO_TURN_HOST}}
{{VIDEO_TURN_SECRET}}

Baue einen geschützten Administrationsbereich für die geschäftlichen Stammdaten.

Geheimnisse wie Datenbankpasswort, SMTP-Passwort und TURN-Secrets müssen ausschließlich über sichere Serverkonfiguration beziehungsweise Umgebungsvariablen eingebunden werden.

Öffentliche Kontakt- und Rechnungsangaben können nach Authentifizierung im Admin gepflegt werden.

Alle Logos, Kopfzeilen, PDFs, Signaturen und rechtlichen Seiten müssen die zentralen Werte übernehmen.

Keine wiederholten manuellen Änderungen in zahlreichen Dateien erforderlich machen.

Solange zwingende Pflichtangaben fehlen:
- Entwicklung uneingeschränkt ermöglichen.
- Lokale Vorschau ermöglichen.
- Geschützten Einrichtungsmodus anbieten.
- Öffentlichen Produktionsstart blockieren.
- Keine ungültigen Platzhalter als echte rechtliche Angaben veröffentlichen.

==================================================
37. ERSTEINRICHTUNG
==================================================

Erstelle einen sicheren Einrichtungsassistenten.

Dieser muss nur für den berechtigten Betreiber zugänglich sein.

Schritte:

1. Unternehmensname.
2. Markenname.
3. Domain.
4. Geschäftliche Anschrift.
5. Öffentliche Telefonnummer.
6. Geschäftliche E-Mail.
7. Steuerstatus.
8. Steueridentifikationsdaten.
9. Bankverbindung.
10. SMTP-Einrichtung.
11. Datenbankverbindung.
12. Administratorkonto.
13. Sicherheitskonfiguration.
14. Hosting-Einstellungen.
15. Videoinfrastruktur.
16. Finale Veröffentlichungskontrolle.

Nach erfolgreicher Einrichtung darf der Assistent nicht ungeschützt erneut öffentlich erreichbar sein.

==================================================
38. TESTS UND ABNAHME
==================================================

Führe sämtliche technisch möglichen Prüfungen eigenständig aus.

Prüfe insbesondere:

A. Registrierung:
- Erfolgreiche Registrierung.
- Doppelte E-Mail.
- Ungültige Eingaben.
- E-Mail-Verifizierung.
- Passwort zurücksetzen.

B. Berechtigungen:
- Kunde A sieht nur eigene Daten.
- Kunde B sieht nur eigene Daten.
- Admin sieht berechtigte Gesamtdaten.
- Direkter Aufruf fremder Datei-IDs wird abgewiesen.

C. Buchungen:
- Freie Termine.
- Bereits belegte Termine.
- Parallele Buchungsversuche.
- Sommerzeitumstellung.
- Winterzeitumstellung.
- Verschiebung.
- Absage.
- Erinnerung.
- Reservierungsablauf.

D. Zahlung:
- Bestellung.
- Überweisungsinformationen.
- Zahlung offen.
- Zahlung bestätigt.
- Paket aktiviert.
- Paket abgelaufen.
- Verlängerung.

E. Rechnungen:
- Entwurf.
- Korrekte Beträge.
- PDF-Erzeugung.
- Rechnungsnummer.
- Kleinunternehmerhinweis.
- E-Mail-Versand.
- Korrektur.
- Zahlungsstatus.

F. Angebote:
- Erstellung.
- Bearbeitung.
- Sieben Tage Gültigkeit.
- Annahme.
- Ablehnung.
- Rechnungsentwurf.

G. Projekte:
- Mehrere Projekte.
- Aufgaben.
- Fortschritt.
- Zeitbuchungen.
- Kundenanfragen.
- Freigaben.
- Dateien.

H. Kommunikation:
- Chat.
- Benachrichtigungen.
- E-Mail-Vorschau.
- Versandwarteschlange.
- Duplikatverhinderung.

I. Sicherheit:
- Authentifizierung.
- Zugriffsrechte.
- Passwortschutz.
- Admin-2FA.
- CSRF.
- XSS.
- SQL-Injection.
- Dateizugriff.
- Rate-Limiting.

J. Design:
- Mobilansicht.
- Tablet.
- Desktop.
- Navigation.
- Kontraste.
- Tastaturbedienung.
- Formularfehler.
- Layout.

K. Rechtliche Funktionen:
- Cookie-Zustimmung.
- Ablehnung.
- Widerruf der Einwilligung.
- Datenschutzanfragen.
- Elektronische Widerrufsfunktion.
- Dokumentierte Eingangsbestätigungen.
- Minderjährigenabläufe.

Korrigiere alle reproduzierbaren Fehler.

Automatisiere geeignete Prüfungen.

Nutze echte Browserprüfungen und Screenshots, soweit entsprechende Werkzeuge verfügbar sind.

Keine bestandenen Tests erfinden.

==================================================
39. VISUELLE QUALITÄTSSICHERUNG
==================================================

Die grafische Gestaltung ist ein zentrales Abnahmekriterium.

Prüfe jede Hauptseite auf:
- Typografie.
- Abstände.
- Proportionen.
- Ausrichtung.
- Responsivität.
- Farbwirkung.
- Kontrast.
- Ladeverhalten.
- Wiedererkennbarkeit.

Prüfe besonders:
Startseite.
Preisseite.
Leistungsseiten.
Buchungsstrecke.
Kunden-Dashboard.
Admin-Dashboard.
Projektansicht.
Rechnungs-PDF.
E-Mail-Vorlagen.

Verbessere erkannte Designschwächen selbstständig.

Ziel:
Eine eigenständige, glaubwürdige Premium-Marke.

Nicht:
Eine generische KI-generierte SaaS-Oberfläche.

==================================================
40. PRODUKTIONSVORBEREITUNG
==================================================

Erstelle eine vollständige Anleitung für:

- Lokale Installation.
- Abhängigkeiten.
- Datenbankeinrichtung.
- Datenbankmigrationen.
- Konfiguration.
- SMTP.
- Domainverbindung.
- HTTPS.
- Webserver.
- Cronjobs.
- Dateispeicher.
- Backups.
- Eigene Videoinfrastruktur.
- Produktionsdeployment.
- Updateprozess.
- Wiederherstellung.

Alle relevanten Systeme müssen lokal ausführbar und überprüfbar sein.

Produktionsfähige Konfiguration von Entwicklungskonfiguration trennen.

Keine Debugmeldungen öffentlich ausgeben.

Keine Testkonten auf der öffentlichen Website aktiv lassen.

Vor dem Livebetrieb eine klare technische Freigabeliste erstellen.

==================================================
41. VERÖFFENTLICHUNG UND LIVEBETRIEB
==================================================

Geplanter Zieltermin:
01.11.2026.

Dieser Termin ist ein Entwicklungsziel und kein Grund, Funktionen unvollständig freizugeben.

Die Plattform darf erst veröffentlicht werden, wenn:

- Die Anwendung funktionsfähig ist.
- Die erforderlichen Datenbankdienste bereitstehen.
- Die Domain festgelegt wurde.
- Die geschäftliche E-Mail eingerichtet wurde.
- SMTP erfolgreich eingerichtet wurde.
- Die rechtlichen Pflichtangaben vollständig sind.
- Die Bankverbindung eingetragen wurde.
- Die wichtigen Sicherheitsprüfungen bestanden sind.
- Die Hostingumgebung geeignet ist.
- Die Videofunktion mit ihrer erforderlichen Infrastruktur bereitsteht.
- Ich die Veröffentlichung ausdrücklich freigegeben habe.

Keine eigenständige Domainbestellung.

Keine eigenständige Hostingbestellung.

Keine eigenständige Veröffentlichung.

==================================================
42. VERBINDLICHE FERTIGSTELLUNGSKRITERIEN
==================================================

Das Projekt gilt entwicklungsseitig erst als vollständig, wenn:

1. Alle öffentlichen Seiten fertig sind.
2. Das Design konsistent und responsiv ist.
3. Registrierung und Anmeldung funktionieren.
4. Das Kunden-Dashboard vollständig funktioniert.
5. Das Admin-Dashboard vollständig funktioniert.
6. Das Buchungssystem echte Termine verwaltet.
7. Preisberechnungen korrekt sind.
8. Vier-Wochen-Pakete korrekt verwaltet werden.
9. Zeiterfassung und Stundenkontingente stimmen.
10. Mehrere Kundenprojekte verwaltet werden können.
11. Chat und Benachrichtigungen funktionieren.
12. Angebote und Rechnungen korrekt erstellt werden.
13. PDF-Dokumente fehlerfrei erstellt werden.
14. Bankzahlungsstatus korrekt verarbeitet wird.
15. Automatische E-Mails funktionieren, sobald SMTP konfiguriert ist.
16. Eigene Videoberatung einschließlich separater Infrastruktur implementiert und testbar ist.
17. Blog und Contenteditor funktionieren.
18. Rechtliche Funktionen implementiert sind.
19. Datenschutz- und Cookiefunktionen funktionieren.
20. Berechtigungen und Sicherheitsmechanismen geprüft sind.
21. Alle wichtigen automatisierten Tests bestehen.
22. Wesentliche visuelle Probleme beseitigt sind.
23. Dokumentation und Einrichtungsanleitung vollständig sind.
24. Externe Konfigurationsabhängigkeiten klar ausgewiesen sind.
25. Ein späterer Livebetrieb ohne grundlegende Neuentwicklung möglich ist.

Jede Anforderung muss in MASTER_SPEC.md und PROGRESS.md nachvollziehbar sein.

Eine fehlende Domain oder noch nicht vorhandene SMTP-Zugangsdaten dürfen nicht als Fehler der Software betrachtet werden.

Solche Punkte müssen als externe Konfigurationsabhängigkeiten markiert werden.

Allerdings dürfen dadurch nicht getestete Integrationen niemals als tatsächlich erfolgreich getestet ausgegeben werden.

==================================================
43. ABSCHLIESSENDE ANWEISUNG AN CODEX
==================================================

Du bist für die technische Gesamtumsetzung verantwortlich.

Arbeite nicht nur an einzelnen Screens.

Entwickle die vollständige Software.

Treffe kleinere technische Entscheidungen selbstständig.

Halte die bestehende Architektur konsistent.

Vermeide unnötige Abhängigkeiten.

Prüfe jeden Geschäftsprozess von Anfang bis Ende.

Baue keine Platzhalterfunktionen.

Ersetze keinen echten Backendprozess durch simulierte Daten.

Führe nach jeder wesentlichen Verbesserung die relevanten Prüfungen erneut aus.

Dokumentiere deinen Fortschritt dauerhaft in den Projektdateien.

Arbeite eigenständig weiter, solange konkrete unerledigte Aufgaben oder nachweisbare Qualitätsprobleme vorhanden sind.

Stoppe nicht beim ersten erfolgreich startenden Frontend.

Stoppe nicht nach der ersten funktionierenden Buchung.

Stoppe nicht nach dem ersten bestandenen Test.

Setze alle Anforderungen vollständig um.

Wenn die Implementierung abgeschlossen ist, führe eine abschließende Gesamtprüfung durch.

Prüfe dabei nochmals sämtliche Geschäftsprozesse, Sicherheitsgrenzen, Seiten, Datenbankmodelle und Abhängigkeiten.

Melde das Projekt erst dann als entwicklungsseitig fertig, wenn die definierten Abnahmekriterien nachweislich erfüllt sind.

Falls ausschließlich externe Zugangsdaten, Hostingressourcen, verbindliche Unternehmensangaben oder meine Freigabe fehlen, dokumentiere diese präzise und pausiere an diesem Punkt.

Beginne jetzt mit der Analyse des Projektordners, erstelle die vollständige Aufgabenmatrix und starte unmittelbar die Implementierung.

## Geschäftsdaten vom 03.11.2026

Die vom Inhaber übermittelten Angaben werden in der lokalen Hauptkonfiguration hinterlegt; Testumgebung und produktive Dienstanbindungen bleiben getrennt. Die Vorstellung nennt ausschließlich die bestätigten Beratungsfelder und beschreibt die Online-Kundengewinnung als Ziel, ohne erfundene Resultate. Tägliche Verfügbarkeit 08:00–17:00 Uhr in Europe/Berlin. Fehlende Steueridentifikation bleibt offen; keine Veröffentlichung aus der Datenübernahme ableiten. Nachweise: docs/BUSINESS_PROFILE_SETUP.md.

