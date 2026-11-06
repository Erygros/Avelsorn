import { contentDate, type SearchPage } from "./types";

const industry = (
    page: Omit<SearchPage, "kind" | "updatedOn">,
): SearchPage => ({ ...page, kind: "industry", updatedOn: contentDate });
export const industryPages: SearchPage[] = [
    industry({
        slug: "anwaltskanzleien",
        title: "Kanzlei-Website und digitale Anfrageprozesse",
        description:
            "Website, Erstkontakt und interne Übergaben für Anwaltskanzleien strukturieren. Technische Umsetzung mit abgestimmten Daten, Zuständigkeiten und Freigaben.",
        heading: "Mandatsanfragen geordnet entgegennehmen",
        answer: "Avelsorn unterstützt Kanzleien bei der technischen Gestaltung von Website, Erstkontakt und internen Übergaben. Gemeinsam legen wir fest, welche Angaben eine Anfrage benötigt, wer sie sichtet und wie daraus der nächste Arbeitsschritt entsteht. Rechtliche Bewertung und Mandatsentscheidung bleiben bei Deiner Kanzlei.",
        sections: [
            {
                title: "Den Erstkontakt begrenzen und verständlich erklären",
                text: "Eine allgemeine E-Mail mit mehreren Anhängen muss häufig erst zugeordnet werden. Ein abgestimmter Erstkontakt kann zunächst Kontaktdaten, ein grobes Thema und den gewünschten Rückruf erfassen. Vertrauliche Unterlagen gehören nicht automatisch in ein frei zugängliches Formular. Welche Angaben zu diesem Zeitpunkt erforderlich sind, bestimmt Ihr.",
                items: [
                    "Anfrageart und Erreichbarkeit getrennt erfassen",
                    "Zuständige Person und Vertretung festlegen",
                    "Eingang bestätigen, ohne eine Mandatsannahme zu behaupten",
                ],
            },
            {
                title: "Vorhandene Kanzleisoftware zuerst prüfen",
                text: "Eine Website kann Anfragen an einen vereinbarten Bearbeitungsweg übergeben. Eine automatische Übernahme in Eure Kanzleisoftware setzt dagegen eine geeignete, freigegebene Schnittstelle voraus. Fehlt sie, kann eine dokumentierte Übergabe die bessere Lösung sein. Zugriffsrechte und Texte werden vor einer Umsetzung abgestimmt.",
            },
            {
                title: "Nicht nur den vollständigen Eingang testen",
                text: "Im Test betrachten wir fehlende Kontaktdaten, doppelte Übermittlung und einen nicht erreichbaren Empfänger. Ein Ersatzweg macht technische Störungen erkennbar. Aussagen zu Fristen, Zulässigkeit und berufsrechtlichen Anforderungen gebt Ihr vor und prüft sie fachlich.",
            },
        ],
        prepare: [
            "Welche Anfragearten sollen angenommen werden?",
            "Welche Daten dürfen beim Erstkontakt verarbeitet werden?",
            "Wer gibt Inhalt und Zugriffsrechte frei?",
            "Welche Software und Schnittstellen sind vorhanden?",
        ],
        boundary:
            "Mögliche technische Aufgaben, keine behauptete Referenzkanzlei oder Rechtsberatung. Rechtliche Prüfung und Mandatsannahme sind keine automatisierten Entscheidungen von Avelsorn.",
        questions: [
            {
                question: "Kannst Du unsere Kanzleisoftware direkt anbinden?",
                answer: "Das lässt sich erst nach Prüfung des Produkts, der Schnittstelle und der benötigten Rechte zusagen. Eine pauschale Anbindung beliebiger Kanzleisysteme wird nicht versprochen.",
            },
            {
                question:
                    "Braucht Ihr echte Mandantenakten für das Erstgespräch?",
                answer: "Nein. Eine anonymisierte Beschreibung des Ablaufs genügt. Produktive Daten und ihre geschützte Übertragung werden erst für einen konkret vereinbarten Auftrag geklärt.",
            },
        ],
        services: ["websites-software", "digitalisierung-ki"],
        packages: ["website", "digitaler-ablauf"],
        related: [
            "/loesungen/anfrageprozesse",
            "/wissen/prozessaufnahme-vorlage",
        ],
    }),
    industry({
        slug: "hausverwaltungen",
        title: "Digitale Abläufe für Hausverwaltungen",
        description:
            "Schadensmeldungen, Objektzuordnung und Rückfragen für Hausverwaltungen übersichtlicher bearbeiten. Formulare und Übergaben nach geprüftem Projektumfang.",
        heading: "Objekte, Meldungen und Zuständigkeiten zusammenbringen",
        answer: "Bei einer Hausverwaltung kann ein digitaler Meldeweg Anfragen mit Objekt, Kontakt und Anliegen verbinden. Avelsorn plant und entwickelt vereinbarte Formulare und Übergaben. Die technische Zuordnung unterstützt Eure Bearbeitung; fachliche Entscheidungen, Notfälle und verbindliche Auskünfte benötigen weiterhin zuständige Personen.",
        sections: [
            {
                title: "Eine Meldung dem richtigen Objekt zuordnen",
                text: "Fehlen Hausnummer, Einheit oder Rückrufmöglichkeit, beginnt die Bearbeitung mit Rückfragen. Wir legen fest, welche Objektkennung Euer Team benötigt und welche Angaben der Absender zuverlässig nennen kann. Fotos und Dokumente werden nur dort vorgesehen, wo sie für den Vorgang erforderlich und sicher handhabbar sind.",
                items: [
                    "Objektkennung und Anliegen getrennt aufnehmen",
                    "Zuständigkeit und offenen Rückfragepunkt festhalten",
                    "Bearbeitungsstand für das verantwortliche Team sichtbar machen",
                ],
            },
            {
                title: "Übergaben an Dienstleister eingrenzen",
                text: "Ein möglicher Ablauf bereitet eine abgestimmte Weitergabe vor. Welche Angaben ein Dienstleister erhält, wird ausdrücklich begrenzt. Eine Anbindung an Verwaltungssoftware wird vorab geprüft. Allein die Nutzung eines Programms bedeutet nicht, dass eine geeignete Schnittstelle vorhanden ist.",
            },
            {
                title: "Ein Formular ist kein Notfallkanal",
                text: "Texte und Kontaktangaben müssen erklären, wofür der Meldeweg gedacht ist und wann ein anderer Weg benötigt wird. Wir testen falsche Objektangaben, doppelte Meldungen und ausgefallene Benachrichtigungen. Fachliche Dringlichkeit und weitere Maßnahmen werden nicht ungeprüft einem Automatismus überlassen.",
            },
        ],
        prepare: [
            "Wiederkehrende Meldungsarten",
            "Interne Objektkennungen und Zuständigkeiten",
            "Wer welche Angaben sehen darf",
            "Vorhandene Notfall- und Kontaktwege",
        ],
        boundary:
            "Keine miet- oder wohnungseigentumsrechtliche Beratung und keine zugesagte Einsparung. Beschrieben ist ein möglicher Auftrag, keine abgeschlossene Kundenreferenz.",
        questions: [
            {
                question: "Kann ein Formular Schäden automatisch priorisieren?",
                answer: "Es kann abgestimmte Merkmale erfassen und eine Sichtung vorbereiten. Verbindliche Dringlichkeit und Maßnahmen bleiben fachlich zu prüfen. Für Notfälle braucht Ihr einen geeigneten, überwachten Weg.",
            },
            {
                question:
                    "Müssen Mieter oder Eigentümer ein neues Portal nutzen?",
                answer: "Nicht zwangsläufig. Ein einzelnes Formular kann genügen. Ein Portal kommt eher infrage, wenn wiederkehrender geschützter Zugriff mit klaren Berechtigungen gebraucht wird.",
            },
        ],
        services: ["unternehmensberatung", "digitalisierung-ki"],
        packages: ["digitaler-ablauf"],
        related: [
            "/loesungen/unterlagen-anfordern",
            "/loesungen/kundenportale",
        ],
    }),
    industry({
        slug: "kioske",
        title: "Website und Onlineauftritt für Kioske",
        description:
            "Öffnungszeiten, Standort und Angebot Deines Kiosks verständlich online zeigen. Unterstützung bei Website, Kontaktwegen und gepflegten Betriebsangaben.",
        heading: "Dein Kiosk: Öffnungszeiten und Angebot leicht finden",
        answer: "Ein Kiosk-Auftritt sollte zuerst die Fragen vor einem Besuch beantworten: Wo ist der Laden, wann ist er offen und welche Angebote gibt es dort? Avelsorn unterstützt Dich bei einer übersichtlichen Website und abgestimmten Betriebsangaben. Ein Onlineshop ist dafür nicht automatisch notwendig.",
        sections: [
            {
                title: "Die Informationen vor einem Besuch zuerst",
                text: "Adresse, tatsächliche Öffnungszeiten und eine direkte Kontaktmöglichkeit sollten auf dem Smartphone schnell auffindbar sein. Besondere Leistungen wie Paketannahme oder Kopierservice nennen wir nur, wenn Dein Betrieb sie tatsächlich anbietet. Für abweichende Feiertagszeiten braucht es einen verantwortlichen Pflegeweg.",
            },
            {
                title: "Website und vorhandene Profile abgleichen",
                text: "Wir vergleichen die von Dir freigegebenen Angaben: Stimmen Name, Anschrift und Kontaktweg überein? Sind Bilder aktuell und verwendbar? Wir können die technische Website umsetzen. Änderungen an externen Profilen und laufende Pflege werden als eigene Aufgabe besprochen.",
                items: [
                    "Standort und Kontakt ohne lange Suche zeigen",
                    "Freigegebene Bilder des tatsächlichen Betriebs verwenden",
                    "Verantwortung für geänderte Zeiten festlegen",
                ],
            },
            {
                title: "Mit dem benötigten Umfang beginnen",
                text: "Für einen kleinen Betrieb kann ein Onepager mit Angebot und Kontakt ausreichen. Ein Katalog, Verkauf oder eine Reservierung wäre ein zusätzlicher Umfang. Welche Information regelmäßig geändert werden muss, klären wir vorher. Mehr Laufkundschaft lässt sich aus einer neuen Website allein nicht zusagen.",
            },
        ],
        prepare: [
            "Geschäftsname und freigegebene Anschrift",
            "Reguläre und abweichende Öffnungszeiten",
            "Tatsächliche Leistungen und freigegebene Bilder",
            "Vorhandene Website und öffentliche Profile",
        ],
        boundary:
            "Keine Kundenzahl- oder Platzierungszusage. Externe Plattformkonten, Anzeigen und ein Shopsystem gehören nicht automatisch zum Websitepaket.",
        questions: [
            {
                question: "Braucht mein Kiosk einen Onlineshop?",
                answer: "Nur wenn Du tatsächlich online verkaufen und die dazugehörigen Abläufe betreiben möchtest. Für Standort, Öffnungszeiten und eine verständliche Angebotsdarstellung reicht häufig eine einfache Website.",
            },
            {
                question: "Kannst Du mein Unternehmensprofil überarbeiten?",
                answer: "Das kann gesondert vereinbart werden, wenn Du Rechte und freigegebene Angaben bereitstellst. Eine Verifizierung oder bestimmte Platzierung können wir nicht zusagen.",
            },
        ],
        services: ["websites-software", "social-media"],
        packages: ["website"],
        related: [
            "/loesungen/lokaler-onlineauftritt",
            "/wissen/website-briefing",
        ],
    }),
    industry({
        slug: "imbisse",
        title: "Website und digitale Speisekarte für Imbisse",
        description:
            "Speisekarte, Öffnungszeiten und Kontakt für Deinen Imbiss mobil verständlich darstellen. Website und Aktualisierung nach freigegebenen Angaben planen.",
        heading: "Deine Speisekarte soll auch auf dem Handy lesbar sein",
        answer: "Für einen Imbiss sind aktuelle Gerichte, verständliche Preise, Öffnungszeiten und der passende Kontaktweg oft wichtiger als viele einzelne Angebotsseiten. Avelsorn kann diese Angaben in einer responsiven Website zusammenführen. Onlinebestellung und Lieferanbindung werden nur ergänzt, wenn sie ausdrücklich vereinbart sind.",
        sections: [
            {
                title: "Speisekarte als lesbarer Inhalt",
                text: "Ein unscharfes Kartenfoto ist auf dem Smartphone schwer nutzbar. Wir strukturieren Deine freigegebenen Gerichte, Varianten und Preise als Text. Erforderliche Kennzeichnungen und fachliche Angaben stellst Du nach Deiner Prüfung bereit. Die technische Umsetzung ersetzt diese Prüfung nicht.",
            },
            {
                title: "Kontakt von einer Bestellung unterscheiden",
                text: "Wenn Bestellungen telefonisch angenommen werden, muss die Website diesen Weg eindeutig nennen. Ein unbeaufsichtigtes Formular darf nicht wie eine bestätigte Bestellung wirken. Für eine Onlinebestellung müssten Annahme, Verfügbarkeit, Rückmeldung, Zahlung und Fehlerfälle zusätzlich festgelegt werden.",
            },
            {
                title: "Das Mittagsangebot aktuell halten",
                text: "Vor der Umsetzung klären wir, ob eine feste Karte, ein wechselndes Angebot oder beides gezeigt werden soll. Daraus ergibt sich, welche Pflegefunktion passt. Eine aktuelle kurze Karte hilft mehr als mehrere veraltete Dateien. Fotos müssen zum tatsächlichen Betrieb und Angebot passen.",
                items: [
                    "Wer gibt Preisänderungen frei?",
                    "Wann werden Tagesangebote entfernt?",
                    "Wie sind abweichende Abholzeiten erkennbar?",
                ],
            },
        ],
        prepare: [
            "Freigegebene Speisekarte mit geprüften Angaben",
            "Öffnungs- und Abholzeiten",
            "Tatsächlicher Annahmeweg für Bestellungen",
            "Bilder und verantwortliche Person für Änderungen",
        ],
        boundary:
            "Keine zugesagten zusätzlichen Bestellungen. Zahlungen, Kassensystem und Lieferplattformen sind gesonderte Funktionen, kein automatischer Bestandteil des Websitepakets.",
        questions: [
            {
                question:
                    "Ist eine digitale Speisekarte schon ein Bestellsystem?",
                answer: "Nein. Die Karte stellt Dein Angebot dar. Ein Bestellsystem benötigt zusätzlich verlässliche Annahme, Rückmeldungen und weitere vereinbarte Funktionen.",
            },
            {
                question: "Kann ich das Mittagsangebot selbst ändern?",
                answer: "Wenn eine Pflegefunktion vereinbart ist, wird sie dafür eingerichtet und erklärt. Ob Du selbst pflegst oder Änderungen beauftragst, klären wir vorher.",
            },
        ],
        services: ["websites-software", "social-media"],
        packages: ["website"],
        related: ["/branchen/gastronomie", "/wissen/website-kosten"],
    }),
    industry({
        slug: "gastronomie",
        title: "Website und Anfrageabläufe für Gastronomie",
        description:
            "Restaurant-Website, Speisekarte und Reservierungsanfragen verständlich verbinden. Avelsorn unterstützt bei Inhalt, Abläufen und vereinbarter Umsetzung.",
        heading: "Gästen vor dem Besuch die richtigen Informationen geben",
        answer: "Eine Gastronomie-Website sollte Angebot, Standort und Kontakt erklären und deutlich machen, wie eine Reservierung zustande kommt. Avelsorn kann den Auftritt und vereinbarte Anfrageabläufe umsetzen. Eine Anfrage wird ohne passenden Annahmeprozess nicht als bestätigter Tisch ausgegeben.",
        sections: [
            {
                title: "Reservierungsanfrage und Zusage trennen",
                text: "Ein Formular kann Datum, Personenzahl und Erreichbarkeit erfassen. Ob tatsächlich ein Tisch frei ist und wie eine Zusage erfolgt, muss der Betrieb organisieren. Wir stimmen Rückmeldungen darauf ab. Eine Echtzeitreservierung wäre eine zusätzliche Anbindung mit eigener Verfügbarkeitslogik.",
            },
            {
                title: "Informationen am tatsächlichen Besuch ausrichten",
                text: "Speisekarte, besondere Öffnungszeiten und Hinweise zum Besuch sollten zusammenpassen. Veranstaltungen und geschlossene Gesellschaften benötigen einen Pflegeweg, wenn sie regelmäßig wechseln. Wir strukturieren die freigegebenen Angaben so, dass Gäste auf dem Handy nicht zwischen schlecht lesbaren Dateien suchen müssen.",
            },
            {
                title: "Gruppenanfragen im Team weitergeben",
                text: "Gewünschter Termin, Personenzahl, Ansprechpartner und offene Fragen bilden eine Grundlage für die weitere Abstimmung. Vor einer technischen Verbindung klären wir, wer solche Anfragen liest und beantwortet. Auch für fehlende Angaben und ausgefallene Benachrichtigungen wird ein Vorgehen festgelegt.",
            },
        ],
        prepare: [
            "Speisekarte und geprüfte Betriebsangaben",
            "Tatsächlicher Reservierungsablauf",
            "Ansprechperson und Vertretung",
            "Häufig wechselnde Inhalte und Veranstaltungen",
        ],
        boundary:
            "Keine Besucherzusage und keine erfundene Restaurantreferenz. Fachliche Pflichtangaben kommen vom Betrieb; Reservierungsplattformen, Kasse und laufende Kanalpflege werden gesondert vereinbart.",
        questions: [
            {
                question:
                    "Kann unsere Reservierungsplattform erhalten bleiben?",
                answer: "Ja, wenn sie zum Ablauf passt. Wir prüfen, ob ein Link oder eine zulässige Einbindung sinnvoll ist. Konten und Verträge werden nicht automatisch ersetzt.",
            },
            {
                question: "Ist laufende Social-Media-Betreuung enthalten?",
                answer: "Das veröffentlichte Planungspaket liefert definierte Inhalte und einen Plan, keine unbefristete Betreuung. Zusätzliche Aufgaben benötigen einen eigenen vereinbarten Umfang.",
            },
        ],
        services: ["websites-software", "digitalisierung-ki", "social-media"],
        packages: ["website", "social-media"],
        related: ["/loesungen/anfrageprozesse", "/branchen/imbisse"],
    }),
    industry({
        slug: "einzelhandel",
        title: "Onlineauftritt und digitale Abläufe im Einzelhandel",
        description:
            "Sortiment, Standort und Kundenanfragen für den Einzelhandel übersichtlich darstellen. Website und abgestimmte Übergaben für Deinen Laden entwickeln.",
        heading: "Deinen Laden online verständlich zeigen",
        answer: "Für einen stationären Laden muss eine Website nicht sofort ein Shop sein. Sie kann Sortimentsschwerpunkte erklären, einen Besuch vorbereiten und Produktanfragen geordnet entgegennehmen. Avelsorn entwickelt den vereinbarten Auftritt und prüft bei Bedarf, wie Anfragen im Team weiterbearbeitet werden.",
        sections: [
            {
                title: "Sortiment erklären, ohne Bestände vorzutäuschen",
                text: "Ausgewählte Produktgruppen helfen bei der Orientierung. Wenn Bestand oder Preise nicht laufend abgeglichen werden, darf eine Darstellung keine verlässliche Echtzeitverfügbarkeit suggerieren. Wir legen fest, was nur vorgestellt wird und was tatsächlich angefragt, reserviert oder gekauft werden kann.",
            },
            {
                title: "Produktanfragen mit den benötigten Angaben",
                text: "Ein Anfrageweg kann Artikel, Variante, Menge und Erreichbarkeit aufnehmen. Die Antwort bleibt bei einer zuständigen Person, wenn keine geprüfte Bestandsanbindung existiert. So lässt sich eine Rückfrage vorbereiten, ohne eine Bestellung versehentlich verbindlich erscheinen zu lassen.",
            },
            {
                title: "Änderungen brauchen einen Pflegeweg",
                text: "Saisonale Angebote und neue Öffnungszeiten sollten nicht an einer veralteten Datei hängen. Wir besprechen, was Du selbst pflegen möchtest und welche Änderungen Du beauftragst. Ein Warenwirtschafts- oder Shopsystem ist eine gesonderte Entscheidung und wird nicht allein wegen einer neuen Website eingeführt.",
            },
        ],
        prepare: [
            "Sortimentsschwerpunkte und Bilder",
            "Welche Angaben zuverlässig aktuell bleiben können",
            "Bestehender Ablauf für Anfragen und Reservierungen",
            "Warenwirtschaft und tatsächliche Schnittstellen",
        ],
        boundary:
            "Mögliche Projektumfänge, keine zugesagten Verkäufe. Keine pauschale Warenwirtschaftsanbindung und kein Shop im Onepager-Basisumfang.",
        questions: [
            {
                question: "Ist eine Website ohne Onlineverkauf sinnvoll?",
                answer: "Ja, wenn sie Fragen vor einem Besuch beantwortet. Ein Shop hängt zusätzlich von Bestand, Versand, Zahlung und Bearbeitung ab.",
            },
            {
                question: "Kannst Du Bestände automatisch anzeigen?",
                answer: "Nur nach Prüfung einer verlässlichen Quelle und geeigneter Schnittstelle. Andernfalls planen wir eine Produktvorstellung oder einen klar bezeichneten Anfrageweg.",
            },
        ],
        services: ["websites-software", "digitalisierung-ki"],
        packages: ["website", "digitaler-ablauf"],
        related: [
            "/loesungen/lokaler-onlineauftritt",
            "/wissen/schnittstellen-pruefen",
        ],
    }),
    industry({
        slug: "handwerksbetriebe",
        title: "Website und Angebotsanfragen für Handwerksbetriebe",
        description:
            "Leistungsgebiet, Arbeitsbeispiele und Angebotsanfragen im Handwerk strukturieren. Website und Formulare mit klar vereinbartem Umfang umsetzen.",
        heading: "Aus einer kurzen Nachricht eine bearbeitbare Anfrage machen",
        answer: "Eine Handwerksanfrage braucht häufig mehr als einen Namen und eine Rückrufnummer. Avelsorn unterstützt bei einer Website, die Leistungen erklärt, und bei Formularen, die Anfragen vorbereiten. Ein Formular ersetzt weder die fachliche Prüfung noch ein verbindliches Angebot.",
        sections: [
            {
                title: "Angaben an der tatsächlichen Arbeit ausrichten",
                text: "Je nach Gewerk können Einsatzort, Art der Aufgabe, ungefähre Größenordnung und Bilder für eine erste Sichtung helfen. Welche Angaben benötigt werden, bestimmt der Betrieb. Wir unterscheiden Pflichtangaben von Informationen, die ein Interessent beim Erstkontakt noch nicht wissen kann.",
            },
            {
                title: "Eigene Arbeiten mit freigegebenem Material zeigen",
                text: "Arbeitsbeispiele können erklären, welche Aufgaben Du übernimmst. Dafür verwenden wir nur Bilder und Angaben, deren Nutzung geklärt ist. Kundennamen oder private Anschriften werden nicht ungeprüft veröffentlicht. Fehlen geeignete Bilder, entsteht daraus kein erfundenes Referenzprojekt.",
            },
            {
                title: "Eingang, Rückfrage und Angebot trennen",
                text: "Ein digitaler Ablauf kann eine Anfrage zuordnen und offene Angaben kenntlich machen. Wer Rückfragen übernimmt und Termine zusagt, wird vorher vereinbart. Fachliche Kalkulation und Ausführungszusage werden nicht einem ungeprüften Automatismus überlassen.",
                items: [
                    "Einsatzort und Aufgabe verständlich erfassen",
                    "Für Rückfragen eine Vertretung festlegen",
                    "Anfragebestätigung von einem verbindlichen Angebot unterscheiden",
                ],
            },
        ],
        prepare: [
            "Angebotene Arbeiten und Einsatzgebiet",
            "Anonymisierte unvollständige Anfragen",
            "Freigegebene Arbeitsbilder",
            "Zuständigkeit für Rückfragen und Angebote",
        ],
        boundary:
            "Keine handwerkliche Fachberatung oder automatische verbindliche Kalkulation. Beschrieben sind mögliche technische Aufgaben, keine behaupteten Handwerksreferenzen.",
        questions: [
            {
                question: "Berechnet das Formular automatisch ein Angebot?",
                answer: "Nur wenn ein gesonderter, fachlich geprüfter Berechnungsumfang vereinbart ist. Häufig ist zunächst eine vollständige Anfrage mit persönlicher Kalkulation geeigneter.",
            },
            {
                question: "Kann meine bestehende Website bleiben?",
                answer: "Wir prüfen zuerst, ob sich Inhalte weiterverwenden und fehlende Anfragewege ergänzen lassen. Eine vollständige Neuerstellung ist nicht automatisch erforderlich.",
            },
        ],
        services: [
            "websites-software",
            "unternehmensberatung",
            "digitalisierung-ki",
        ],
        packages: ["website", "digitaler-ablauf"],
        related: ["/loesungen/anfrageprozesse", "/loesungen/website-relaunch"],
    }),
    industry({
        slug: "streamer",
        title: "Website und Organisation für Streamer",
        description:
            "Kanalauftritt, Kooperationsanfragen und wiederkehrende Aufgaben für Streamer ordnen. Profilcheck und abgegrenzte digitale Umsetzungen bei Avelsorn.",
        heading: "Kanal, Kooperationen und Organisation zusammenhalten",
        answer: "Avelsorn unterstützt Streamer dabei, ihr Profil verständlich aufzubauen und Kooperationsanfragen geordnet zu bearbeiten. Eine Website kann Formate, Kontakt und freigegebene Kanalangaben bündeln. Plattformfunktionen werden nur angebunden, wenn Technik, Rechte und Umfang vorher geprüft sind.",
        sections: [
            {
                title: "Was ein neuer Besucher verstehen sollte",
                text: "Ein Profil sollte erklären, welche Formate Du machst, wo sie stattfinden und welcher Kontaktweg für Geschäftsanfragen gedacht ist. Wir prüfen einen vorhandenen Kanal, überarbeiten vereinbarte Texte und entwickeln Themenideen. Eine bestimmte Zuschauerzahl oder Plattformwachstum wird damit nicht zugesagt.",
            },
            {
                title: "Geschäftsanfrage getrennt vom Community-Chat",
                text: "Für eine Kooperation fehlen oft Format, Zeitraum oder Ansprechpartner. Ein eigener Anfrageweg kann diese Angaben aufnehmen und Rückfragen vorbereiten. Ob eine Kooperation zu Dir passt und welche Vereinbarungen gelten, bleibt eine gesonderte Entscheidung.",
            },
            {
                title: "Eigene Werkzeuge mit einem klaren Zweck",
                text: "Für wiederkehrende Organisation kann eine kleine Webanwendung passen. Vorher klären wir Datenquellen und Zugriffe. Bots oder Live-Anbindungen werden nicht als vorhandene Integration ausgegeben. Zugangsdaten gehören weder in öffentliche Formulare noch in einen Community-Chat.",
            },
        ],
        prepare: [
            "Kanal-Link und Formate",
            "Die zu verbessernde Organisationsaufgabe",
            "Freigegebene, belegbare Kanalangaben",
            "Vorhandene Werkzeuge und Schnittstellen",
        ],
        boundary:
            "Keine Sponsorenvermittlung, Zuschauerzusage oder pauschal eingerichtete Streaming-Infrastruktur. Technische Anbindungen werden individuell geprüft.",
        questions: [
            {
                question: "Enthält der Profilcheck eine Streamer-Website?",
                answer: "Nein. Profilcheck und Website haben jeweils einen eigenen Umfang. Ein Mediakit oder Anfragewerkzeug wird bei Bedarf gesondert angeboten.",
            },
            {
                question: "Werden Kanalzahlen automatisch aktualisiert?",
                answer: "Nur wenn eine geeignete Anbindung ausdrücklich vereinbart ist. Für Unterlagen stellst Du zunächst belegbare, freigegebene Angaben bereit.",
            },
        ],
        services: ["creator", "websites-software"],
        packages: ["creator", "website"],
        related: [
            "/loesungen/kooperationsanfragen",
            "/wissen/redaktionsplan-vorlage",
        ],
    }),
    industry({
        slug: "influencer",
        title: "Kooperationsabläufe und Profil für Influencer",
        description:
            "Profil, Kooperationsanfragen und Freigaben für Influencer strukturieren. Avelsorn unterstützt mit klaren Unterlagen und vereinbarter technischer Umsetzung.",
        heading: "Kooperationen mit vollständigen Angaben vorbereiten",
        answer: "Für Influencer kann ein klarer Auftritt mit geregeltem Anfrage- und Freigabeweg die Zusammenarbeit mit Marken übersichtlicher machen. Avelsorn unterstützt bei Profiltexten, Unterlagen und digitalen Abläufen. Kooperationen und Nutzungsrechte werden dadurch nicht automatisch angenommen oder rechtlich geprüft.",
        sections: [
            {
                title: "Aus einer Nachricht ein brauchbares Briefing machen",
                text: "Die Frage nach einem Beitragspreis lässt häufig Format, Inhalte, Zeitfenster und Rechte offen. Ein vereinbarter Anfrageweg kann die nötigen Angaben und Rückfragen erfassen. Daraus entsteht eine Grundlage für die Abstimmung, keine feste Beauftragung oder Zustimmung zu Nutzungsrechten.",
            },
            {
                title: "Unterlagen mit belegbaren Angaben",
                text: "Wir prüfen, ob Dein Profil Formate und Kontakt erklärt. Ein Mediakit kann von Dir bereitgestellte Kanalangaben und Leistungen zusammenführen. Nicht belegbare Reichweiten, fiktive Markenlogos und erfundene Kooperationen werden nicht als Vertrauensnachweis eingesetzt.",
            },
            {
                title: "Version und Freigabe nachvollziehbar halten",
                text: "Sind Rückmeldungen über mehrere Kanäle verteilt, wird die gültige Fassung schnell unklar. Ein digitaler Ablauf kann Version, Ansprechpartner und offenen Prüfpunkt verbinden. Technik und Rechte richten sich nach Deinen vorhandenen Werkzeugen. Verträge und erforderliche Kennzeichnungen bleiben gesondert zu prüfen.",
            },
        ],
        prepare: [
            "Kanal-Links und freigegebene Kennzahlen",
            "Formate und angebotene Leistungen",
            "Anonymisierte Kooperationsanfrage",
            "Verantwortung für Inhalt und Nutzungsbedingungen",
        ],
        boundary:
            "Keine garantierten Kooperationen, Markenpartnerschaften oder Einnahmen. Keine Rechtsberatung zu Werbekennzeichnung, Verträgen und Nutzungsrechten.",
        questions: [
            {
                question: "Wird aus dem Profilcheck ein fertiges Mediakit?",
                answer: "Nicht automatisch. Der Profilcheck enthält die veröffentlichten Ergebnisse. Ein Mediakit oder Freigabewerkzeug bekommt einen eigenen vereinbarten Umfang.",
            },
            {
                question: "Verhandelst Du Kooperationen mit Marken?",
                answer: "Die hier beschriebenen Leistungen betreffen Auftritt, Unterlagen und Organisation. Eine Vermittlung oder Verhandlung bestimmter Kooperationen wird damit nicht angeboten.",
            },
        ],
        services: ["creator", "social-media", "websites-software"],
        packages: ["creator", "social-media"],
        related: [
            "/loesungen/kooperationsanfragen",
            "/loesungen/dokumentenfreigaben",
        ],
    }),
    industry({
        slug: "investoren",
        title: "Digitale Organisation für Investoren",
        description:
            "Projektanfragen, Unterlagen und Zugriffsrechte für Investoren geordnet organisieren. Technische Lösungen statt Anlageempfehlungen oder Renditeversprechen.",
        heading: "Projektanfragen und Unterlagen nachvollziehbar ordnen",
        answer: "Avelsorn kann Investoren bei der technischen Organisation von Projektanfragen, Dokumenten und Prüfständen unterstützen. Ziel ist ein übersichtlicher Ablauf mit vereinbarten Zugriffsrechten. Wirtschaftliche Bewertung, Due Diligence und persönliche Anlageentscheidungen werden dadurch nicht übernommen.",
        sections: [
            {
                title: "Projektinformationen zusammenführen",
                text: "Eine technische Übersicht kann Projektkennung, Ansprechpartner, Eingang und fehlende Unterlagen verbinden. Wir klären, welche Angaben benötigt werden und welche davon vertraulich sind. Strukturierte Erfassung sagt noch nichts über Eignung oder Qualität eines Investments aus.",
            },
            {
                title: "Zugriff und Dokumentenstand festlegen",
                text: "Wenn mehrere Personen Unterlagen prüfen, müssen Rollen und Versionen geregelt sein. Ein möglicher Auftrag ist eine geschützte Webanwendung mit bezeichneten Dokumenten und Bearbeitungsständen. Es wird kein fremdes Datenraumsystem pauschal als bereits angebunden ausgegeben.",
            },
            {
                title: "Prüfschritte unterstützen, Entscheidungen getrennt halten",
                text: "Eine Erinnerung kann fehlende Unterlagen anzeigen. Eine Übersicht kann eine offene Rückfrage sichtbar machen. Beides ersetzt keine fachliche Prüfung von Zahlen, Verträgen oder Risiken. Sensible Inhalte, externe Dienste und Freigaben werden vor einer Umsetzung besprochen.",
            },
        ],
        prepare: [
            "Arten von Projektanfragen",
            "Benötigte Unterlagen und Prüfstände",
            "Rollen und Vertraulichkeitsanforderungen",
            "Bestehende Werkzeuge und freigegebene Schnittstellen",
        ],
        boundary:
            "Keine individuelle Anlageberatung, Vermittlung, Beteiligungsbewertung oder zugesagtes wirtschaftliches Ergebnis. Die beschriebenen Leistungen sind technisch und organisatorisch.",
        questions: [
            {
                question: "Bewertest Du, welches Investment sich lohnt?",
                answer: "Nein. Es geht um die Organisation von Informationen und Arbeitsschritten. Investitionsempfehlungen und wirtschaftliche Due Diligence gehören nicht zum technischen Auftrag.",
            },
            {
                question: "Müssen wir ein neues Dokumentensystem einführen?",
                answer: "Wir prüfen zuerst vorhandene Funktionen und geeignete Übergaben. Eine neue Anwendung ist nur eine Möglichkeit und wird nicht ohne klaren Bedarf vorgeschlagen.",
            },
        ],
        services: ["websites-software", "digitalisierung-ki"],
        packages: ["digitaler-ablauf"],
        related: ["/loesungen/dokumentenfreigaben", "/loesungen/kundenportale"],
    }),
    industry({
        slug: "trader",
        title: "Digitale Arbeitsorganisation für Trader",
        description:
            "Datenimporte, Dokumentation und wiederkehrende Arbeitsschritte für Trader strukturieren. Technische Umsetzung ohne Handelssignale oder Anlageempfehlungen.",
        heading: "Daten und wiederkehrende Handgriffe sauber organisieren",
        answer: "Avelsorn unterstützt bei technischen Abläufen wie Datenimporten, Dokumentationsvorlagen und internen Übersichten. Bei Tradern steht die Organisation vorhandener Informationen im Mittelpunkt. Persönliche Handelsentscheidungen, Handelssignale und Renditeziele sind kein Ergebnis dieses Auftrags.",
        sections: [
            {
                title: "Einen Import eindeutig definieren",
                text: "Exportdateien können unterschiedliche Zeitstempel, Zahlenformate und Bezeichnungen verwenden. Ein vereinbarter Import legt Quelle, Feldzuordnung, Erkennung von Duplikaten und den Umgang mit fehlenden Angaben fest. Für die Planung beginnen wir mit anonymisierten Beispielen statt produktiven Kontozugängen.",
            },
            {
                title: "Eine Übersicht ist keine Handelsstrategie",
                text: "Eine Anwendung kann vorhandene Daten ordnen und Berechnungen nach vereinbarter Definition darstellen. Welche Bedeutung das für Deine Anlageentscheidung hat, ist davon getrennt. Zahlen werden nicht als Nachweis zukünftiger Erträge oder als persönliche Kaufempfehlung ausgegeben.",
            },
            {
                title: "Lesenden Zugriff von Ausführung unterscheiden",
                text: "Ein Dateiexport ist etwas anderes als ein Zugriff, der Orders ausführen darf. Für diesen technischen Einstieg werden keine automatischen Trades zugesagt. Quelle, Zugriffsrechte, laufende Kosten und Fehlerfälle müssen vor einer Anbindung geprüft sein.",
            },
        ],
        prepare: [
            "Der zu vereinfachende Arbeitsschritt",
            "Anonymisierte Exporte",
            "Benötigte Felder und Berechnungsdefinitionen",
            "Tatsächliche Schnittstellenbedingungen und Rechte",
        ],
        boundary:
            "Keine Handelssignale, Brokerempfehlungen, individuelle Anlageberatung oder automatischen Handelsausführungen als Bestandteil dieser Leistung. Allgemeine Finanzbildung bleibt ein gesonderter Informationsbereich.",
        questions: [
            {
                question: "Entwickelst Du eine profitable Handelsstrategie?",
                answer: "Nein. Technische Datenorganisation ist keine Zusage einer Strategie oder eines Gewinns. Anlage- und Handelsentscheidungen bleiben vom Auftrag getrennt.",
            },
            {
                question: "Kann die Planung ohne Kontozugang beginnen?",
                answer: "Ja, häufig reichen anonymisierte Exporte mit den relevanten Feldern. Ob später eine geeignete lesende Anbindung möglich ist, prüfen wir gesondert.",
            },
        ],
        services: ["websites-software", "digitalisierung-ki", "trading-etf"],
        packages: ["digitaler-ablauf"],
        related: [
            "/wissen/schnittstellen-pruefen",
            "/wissen/prozessaufnahme-vorlage",
        ],
    }),
];
