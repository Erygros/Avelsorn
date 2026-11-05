import { contentDate, type SearchPage } from "./types";
const solution = (
    page: Omit<SearchPage, "kind" | "updatedOn">,
): SearchPage => ({ ...page, kind: "solution", updatedOn: contentDate });
export const solutionPages: SearchPage[] = [
    solution({
        slug: "anfrageprozesse",
        title: "Kundenanfragen digital erfassen und bearbeiten",
        description:
            "Einen Anfrageprozess vom Formular bis zur zuständigen Person planen. Pflichtangaben, Bearbeitungsstände und Fehlerfälle mit Avelsorn abstimmen.",
        heading: "Eine Anfrage soll mit den nötigen Angaben ankommen",
        answer: "Ein digitaler Anfrageprozess verbindet Erfassung, Zuständigkeit und nächsten Bearbeitungsschritt. Dafür reicht häufig mehr Klarheit im Ablauf; nicht jede Aufgabe braucht ein neues System. Avelsorn kann den Prozess aufnehmen und die vereinbarte technische Verbesserung umsetzen.",
        sections: [
            {
                title: "Nicht jedes freie Textfeld hilft bei der Bearbeitung",
                text: "Wir beginnen mit der Frage, was die empfangende Person für den nächsten Schritt benötigt. Ein Formular soll fehlende Angaben reduzieren, ohne unnötige Informationen abzufragen. Pflichtfelder, Auswahlmöglichkeiten und Erläuterungen werden anhand typischer Anfragen formuliert, nicht anhand beliebiger technischer Möglichkeiten.",
            },
            {
                title: "Eingang und Zuständigkeit festhalten",
                text: "Ein nachvollziehbarer Ablauf kennt auch die Phase nach dem Absenden. Wer sieht einen neuen Eingang? Was geschieht bei Abwesenheit? Wann gilt eine Anfrage als bearbeitet? Eine Eingangsbestätigung darf nicht automatisch wie eine Bestellung, Termin- oder Leistungszusage wirken.",
                table: {
                    columns: ["Schritt", "Vorher festzulegen"],
                    rows: [
                        [
                            "Erfassung",
                            "Benötigte Angaben und verständliche Fehlermeldungen",
                        ],
                        [
                            "Übergabe",
                            "Empfänger, Vertretung und sichtbarer Eingang",
                        ],
                        [
                            "Bearbeitung",
                            "Offene Rückfrage und nächste Zuständigkeit",
                        ],
                        [
                            "Störung",
                            "Hinweis und Ersatzweg bei fehlgeschlagener Übertragung",
                        ],
                    ],
                },
            },
            {
                title: "Mit echten Fehlerarten prüfen",
                text: "Ein guter Test enthält doppelte Sendungen, unvollständige Angaben und einen zeitweise nicht erreichbaren Empfänger. Wir vereinbaren, wie ein Fehler erkannt und behoben wird. Eine Anbindung an bestehende Software hängt von deren Schnittstellen und Deinen Rechten ab.",
            },
        ],
        prepare: [
            "Anonymisierte typische Anfragen",
            "Die Angaben für den nächsten Arbeitsschritt",
            "Zuständige Personen und Vertretung",
            "Vorhandene Programme und mögliche Schnittstellen",
        ],
        boundary:
            "Ein Formular allein garantiert weder mehr Anfragen noch weniger Arbeitszeit. Der Effekt wird am tatsächlichen Ablauf geprüft. Neue Konten, externe Dienste und Kosten werden vorher besprochen.",
        questions: [
            {
                question: "Muss ein CRM eingeführt werden?",
                answer: "Nein. Eine verlässliche Übergabe an ein vorhandenes Werkzeug kann ausreichen. Ein CRM wird nur dann als eigene Entscheidung geprüft, wenn die Aufgabe es braucht.",
            },
            {
                question:
                    "Kann eine Anfrage automatisch zur Bestellung werden?",
                answer: "Das wäre ein anderer Geschäftsprozess mit ausdrücklichen Erklärungen und weiteren Anforderungen. Ein allgemeines Anfrageformular soll zunächst eine Anfrage erfassen und keine unbeabsichtigte Beauftragung auslösen.",
            },
        ],
        services: ["digitalisierung-ki", "unternehmensberatung"],
        packages: ["digitaler-ablauf"],
        related: [
            "/wissen/prozessaufnahme-vorlage",
            "/branchen/handwerksbetriebe",
            "/branchen/anwaltskanzleien",
        ],
    }),
    solution({
        slug: "unterlagen-anfordern",
        title: "Fehlende Unterlagen digital nachfordern",
        description:
            "Unterlagenlisten, Zuständigkeiten und Erinnerungen übersichtlich organisieren. Einen abgegrenzten Ablauf mit geschützter Übergabe und nachvollziehbaren Ständen planen.",
        heading: "Erkennen, welche Unterlage noch fehlt",
        answer: "Ein digitaler Unterlagenablauf verbindet eine klare Anforderung mit einem sichtbaren Stand und einem verantwortlichen Empfänger. Avelsorn kann Listen, geschützte Übergaben und vereinbarte Erinnerungen entwickeln. Welche Dokumente erforderlich sind und wann eine Frist verbindlich ist, legst Du fachlich fest.",
        sections: [
            {
                title: "Zuerst eine verständliche Anforderung",
                text: "Die Bezeichnung einer Unterlage sollte für den Absender nachvollziehbar sein. Wir halten fest, was genau benötigt wird, in welcher Form und für welchen Vorgang. Ein Eingang kann erfasst werden, ohne damit bereits eine fachlich korrekte oder vollständige Unterlage zu bestätigen.",
            },
            {
                title: "Eingang und Prüfung als eigene Stände führen",
                text: "Die Zustände „angefordert“, „eingegangen“, „in Prüfung“ und „Rückfrage offen“ haben unterschiedliche Bedeutungen. Wir bestimmen, wer einen Status ändern darf und welche Nachricht daraus entsteht. So wird aus einem bloßen Datei-Upload keine unbeabsichtigte Freigabe.",
                items: [
                    "Dokument eindeutig einem Vorgang zuordnen",
                    "Fehlende und zurückgewiesene Unterlagen unterscheiden",
                    "Berechtigungen für Lesen, Hochladen und Prüfen festlegen",
                ],
            },
            {
                title: "Erinnerungen dürfen nicht unkontrolliert weiterlaufen",
                text: "Eine Erinnerung benötigt eine Abbruchregel: nach Eingang, nach manuellem Stopp oder nach Abschluss des Vorgangs. Doppelte Nachrichten und abgelaufene Zugänge werden im Test berücksichtigt. Für sensible Dokumente planen wir einen geschützten Weg statt einer öffentlichen Sammlung.",
            },
        ],
        prepare: [
            "Benötigte Unterlagen je Vorgang",
            "Wer sie anfordert und fachlich prüft",
            "Zulässige Übertragungswege und Dateitypen",
            "Wann Erinnerungen beginnen und enden sollen",
        ],
        boundary:
            "Keine pauschale Prüfung der rechtlichen oder fachlichen Vollständigkeit. Externe Speicher und Aufbewahrungsanforderungen werden projektbezogen abgestimmt.",
        questions: [
            {
                question: "Prüft das System den Inhalt automatisch?",
                answer: "Ein Eingang und einfache technische Dateiprüfungen lassen sich erfassen. Fachliche Prüfung wird dadurch nicht automatisch ersetzt. Weitere Erkennung müsste mit klaren Grenzen gesondert vereinbart werden.",
            },
            {
                question: "Können bestehende Dateiablagen bleiben?",
                answer: "Wir prüfen, ob sie mit geeigneten Zugriffsrechten und Schnittstellen genutzt werden können. Eine öffentliche Freigabe vertraulicher Dokumente ist keine Ersatzlösung für fehlende Integration.",
            },
        ],
        services: ["digitalisierung-ki", "websites-software"],
        packages: ["digitaler-ablauf"],
        related: [
            "/branchen/hausverwaltungen",
            "/loesungen/dokumentenfreigaben",
            "/wissen/schnittstellen-pruefen",
        ],
    }),
    solution({
        slug: "dokumentenfreigaben",
        title: "Dokumente und Freigaben nachvollziehbar organisieren",
        description:
            "Versionen, Rückfragen und Freigaben in einem klaren digitalen Ablauf verbinden. Avelsorn plant Rollen, Prüfschritte und die vereinbarte Umsetzung.",
        heading: "Bei einer Freigabe muss klar sein, welche Fassung gilt",
        answer: "Ein digitaler Freigabeprozess verknüpft eine bestimmte Fassung mit einem Prüfauftrag, einer zuständigen Person und einer dokumentierten Entscheidung. Avelsorn kann diesen Ablauf technisch umsetzen. Welche rechtliche Bedeutung eine Freigabe hat, ergibt sich nicht allein aus einer Schaltfläche.",
        sections: [
            {
                title: "Die Fassung vor dem Prüfauftrag festlegen",
                text: "Ein Dateiname wie „final-neu“ ist kein eindeutiger Bearbeitungsstand. Wir klären, wie Versionen bezeichnet, bereitgestellt und nach einer Änderung erneut geprüft werden. Eine Freigabe sollte nicht still auf eine später ausgetauschte Datei übertragen werden.",
            },
            {
                title: "Rückfrage, Ablehnung und Zustimmung unterscheiden",
                text: "Diese Antworten lösen unterschiedliche nächste Schritte aus. Wir legen fest, welche Angaben eine Rückmeldung enthalten muss und wer sie sieht. Die eigentliche Prüfung bleibt bei einer berechtigten Person. Eine E-Mail kann auf eine neue Aufgabe hinweisen, während vertrauliche Inhalte im geschützten Bereich bleiben.",
                items: [
                    "Prüfende Person und Vertretung benennen",
                    "Version und Zeitpunkt der Entscheidung festhalten",
                    "Bei Überarbeitung eine neue Freigabe anfordern",
                ],
            },
            {
                title: "Ablauf auch bei parallelen Änderungen testen",
                text: "Wenn zwei Personen gleichzeitig bearbeiten, dürfen Entscheidungen nicht unbemerkt überschrieben werden. Im Test betrachten wir veraltete Ansichten, fehlende Rechte und eine inzwischen geänderte Fassung. Eine einfache interne Freigabe ist dabei keine behauptete qualifizierte elektronische Signatur.",
            },
        ],
        prepare: [
            "Welche Inhalte geprüft werden",
            "Rollen und Vertretungen",
            "Bedeutung jeder Rückmeldung",
            "Versionierung, Aufbewahrung und benötigte Nachweise",
        ],
        boundary:
            "Keine zugesagte rechtliche Signaturqualität oder Vertragsprüfung. Die technische Dokumentation und die fachliche beziehungsweise rechtliche Bedeutung werden getrennt festgelegt.",
        questions: [
            {
                question:
                    "Ist jede digitale Freigabe eine elektronische Unterschrift?",
                answer: "Nein. Eine dokumentierte interne Entscheidung ist nicht automatisch eine Signatur mit einer bestimmten rechtlichen Qualität. Ein solcher Bedarf muss vorab mit geeigneten Fachpersonen geklärt werden.",
            },
            {
                question: "Können freigegebene Dateien später geändert werden?",
                answer: "Wir vereinbaren, ob eine Fassung unverändert erhalten bleibt und wie neue Versionen entstehen. Eine bereits erteilte Freigabe darf nicht unbemerkt auf geänderte Inhalte bezogen werden.",
            },
        ],
        services: ["websites-software", "digitalisierung-ki"],
        packages: ["digitaler-ablauf"],
        related: [
            "/branchen/influencer",
            "/branchen/investoren",
            "/loesungen/kundenportale",
        ],
    }),
    solution({
        slug: "kundenportale",
        title: "Ein individuelles Kundenportal planen und entwickeln",
        description:
            "Geschützte Dokumente, Aufgaben und Rückfragen in einem Kundenportal zusammenführen. Anforderungen, Rechte und Umfang vor der Entwicklung mit Avelsorn klären.",
        heading: "Ein geschützter Bereich für einen klaren Kundenprozess",
        answer: "Ein Kundenportal kann Informationen zu einem Auftrag an einem geschützten Ort zusammenführen. Es ist sinnvoll, wenn Kunden wiederholt auf Dokumente, Aufgaben oder Rückfragen zugreifen müssen. Avelsorn entwickelt vereinbarte Webanwendungen mit serverseitiger Prüfung von Rollen und Zuständigkeiten.",
        sections: [
            {
                title: "Vom Vorgang ausgehen, nicht von einer Funktionsliste",
                text: "Welche Information muss Dein Kunde sehen und was soll er dort tun? Ein Portal für Unterlagen benötigt andere Abläufe als eine Projektfreigabe. Wir beschreiben zuerst den konkreten Vorgang und prüfen, ob ein vorhandenes Werkzeug oder eine kleinere Lösung ausreicht.",
            },
            {
                title: "Berechtigungen für jede Aktion festlegen",
                text: "Anmeldung allein genügt nicht. Dokumente und Aktionen müssen dem richtigen Auftrag und Kunden zugeordnet sein. Wir klären auch den Zugriff von Mitarbeitenden, das Ende eines Zugangs und den Umgang mit vergessenen Passwörtern. Vertrauliche Dateien gehören nicht über erratbare öffentliche Links ausgeliefert.",
            },
            {
                title: "Betrieb und Übergabe gehören zum Umfang",
                text: "Eine Webanwendung benötigt eine geeignete Datenbank, Speicher, Sicherungen und einen geklärten Pflegeweg. Externe Dienste werden ausdrücklich abgestimmt. Ich entwickle keine eigene Hostinginfrastruktur. Tests sollten neben dem normalen Ablauf insbesondere fremde Datensätze, abgelaufene Sitzungen und unterbrochene Uploads berücksichtigen.",
            },
        ],
        prepare: [
            "Ein wiederkehrender Kundenprozess",
            "Benötigte Rollen und erlaubte Aktionen",
            "Dateien und Datenquellen",
            "Zuständigkeit für Betrieb, Pflege und Freigabe",
        ],
        boundary:
            "Ein vollständiges Kundenportal ist kein Bestandteil des Onepager-Basispreises. Umfang und Gesamtpreis werden individuell angeboten; vorhandene Fremdsysteme gelten nicht pauschal als angebunden.",
        questions: [
            {
                question: "Ist ein Portal für jedes Unternehmen sinnvoll?",
                answer: "Nein. Wenn nur wenige Informationen ausgetauscht werden, kann eine kleinere Lösung genügen. Wiederkehrender Bedarf, Rechte und Pflegeaufwand bestimmen, ob ein Portal passt.",
            },
            {
                question: "Gehört das Portal zum Websitepaket?",
                answer: "Nein. Das veröffentlichte Websitepaket hat einen anderen Basisumfang. Ein Portal benötigt eine eigene Anforderungsaufnahme und ein konkretes Angebot.",
            },
        ],
        services: ["websites-software"],
        packages: [],
        related: [
            "/wissen/website-oder-webanwendung",
            "/wissen/schnittstellen-pruefen",
            "/loesungen/dokumentenfreigaben",
        ],
    }),
    solution({
        slug: "website-relaunch",
        title: "Bestehende Website überarbeiten statt blind ersetzen",
        description:
            "Inhalte, Kontaktwege und bestehende URLs vor einem Website-Relaunch prüfen. Avelsorn plant Überarbeitung, Weiterleitungen und technische Umsetzung.",
        heading:
            "Die Website überarbeiten und funktionierende Inhalte erhalten",
        answer: "Ein Relaunch beginnt mit einem Blick auf den Bestand: Welche Inhalte werden gebraucht, welche Kontaktwege funktionieren und welche URLs sollen erhalten bleiben? Avelsorn kann die Überarbeitung planen und umsetzen. Eine neue Gestaltung allein ist kein Beleg für bessere Suchplatzierungen.",
        sections: [
            {
                title: "Vor dem Entwurf ein Seiteninventar anlegen",
                text: "Wir erfassen vorhandene Seiten, wichtige Dokumente und bestehende Formulare. Falls Suchleistungsdaten vorliegen, fließen sie in die Entscheidung ein. Inhalte werden nicht allein deshalb entfernt, weil ein neues Menü kürzer aussehen soll. Veraltete Angaben und unklare Leistungsbeschreibungen werden gezielt überarbeitet.",
            },
            {
                title: "Adressen und Kontaktwege bewusst umstellen",
                text: "Bestehende URLs können erhalten oder mit passenden Weiterleitungen ersetzt werden. Es reicht nicht, alle alten Seiten pauschal zur Startseite zu schicken. Kontaktformulare, E-Mail-Hinweise und externe Links werden ebenfalls betrachtet. Rechte an Texten und Bildern müssen vor einer Übernahme geklärt sein.",
            },
            {
                title: "Vor Veröffentlichung mit dem tatsächlichen Umfang testen",
                text: "Die Vorschau wird auf mobilen und größeren Bildschirmen geprüft. Dazu kommen erreichbare Links, Formulare und Metadaten. Für datenverarbeitende Funktionen gelten dieselben Prüfungen wie zuvor. Ein späterer Betrieb und zusätzliche externe Kosten werden vorab vereinbart, nicht erst nach der Veröffentlichung.",
            },
        ],
        prepare: [
            "Bestehende Domain und Seitenliste",
            "Suchleistungsdaten, sofern vorhanden",
            "Freigegebene Inhalte und Zugriffsrechte",
            "Welche Formulare und Funktionen erhalten bleiben müssen",
        ],
        boundary:
            "Keine Rankingzusage. Ein mehrseitiger Relaunch oder eine Systemmigration fällt nicht automatisch unter den Onepager-Basisumfang.",
        questions: [
            {
                question: "Muss die Domain gewechselt werden?",
                answer: "Nein. Eine neue Gestaltung erfordert grundsätzlich keine neue Domain. Ob ein Wechsel überhaupt sinnvoll ist, wird getrennt von der Überarbeitung geprüft.",
            },
            {
                question: "Was passiert mit alten Links?",
                answer: "Wir planen den Umgang mit vorhandenen URLs. Wenn eine Adresse geändert wird, soll eine passende Zielseite erhalten bleiben und eine korrekte Weiterleitung eingerichtet werden.",
            },
        ],
        services: ["websites-software"],
        packages: ["website"],
        related: [
            "/wissen/website-briefing",
            "/wissen/website-kosten",
            "/branchen/handwerksbetriebe",
        ],
    }),
    solution({
        slug: "lokaler-onlineauftritt",
        title: "Den lokalen Onlineauftritt verständlich aufbauen",
        description:
            "Standort, Öffnungszeiten, Leistungen und Kontakt über Website und freigegebene Profile abstimmen. Ein klarer Onlineauftritt für Deinen lokalen Betrieb.",
        heading: "Vor einem Besuch die richtigen Fragen beantworten",
        answer: "Ein lokaler Onlineauftritt verbindet verständliche Leistungen mit verlässlichen Betriebsangaben. Adresse, Öffnungszeiten und Kontakt sollten auf Website und freigegebenen Profilen zusammenpassen. Avelsorn unterstützt bei Struktur, Inhalt und vereinbarter Umsetzung; Einträge oder Platzierungen bei Suchdiensten werden nicht garantiert.",
        sections: [
            {
                title: "Besucherfragen sammeln",
                text: "Gibt es einen Eingangshinweis, abweichende Zeiten oder Leistungen nur nach Termin? Diese Angaben können vor einem Besuch wichtiger sein als ein langer Unternehmensslogan. Veröffentlicht wird nur, was für Deinen tatsächlichen Betrieb gilt. Ein privater Geschäftssitz wird nicht ohne Abstimmung als frei besuchbare Filiale dargestellt.",
            },
            {
                title: "Angaben über vorhandene Kanäle prüfen",
                text: "Wir gleichen Name, Anschrift, Kontakt und Leistungsbeschreibung in den von Dir benannten Profilen ab. Du stellst die benötigten Rechte bereit. Falsche Bewertungen oder erfundene Niederlassungen gehören nicht zu diesem Vorgehen. Für externe Profile gelten deren eigene Regeln und Prüfverfahren.",
            },
            {
                title: "Änderungen im Alltag berücksichtigen",
                text: "Ein geänderter Ruhetag oder eine neue Telefonnummer darf nicht nur auf einem Kanal korrigiert werden. Wir legen fest, wer welche Angaben pflegt und wie Änderungen kontrolliert werden. Eine echte Messung von Auffindbarkeit benötigt Daten aus den jeweiligen Such- oder Profildiensten, nicht nur einen technischen Website-Test.",
            },
        ],
        prepare: [
            "Tatsächliche Betriebsanschrift und Besuchsregelung",
            "Aktuelle Öffnungs- oder Kontaktzeiten",
            "Vorhandene öffentliche Profile",
            "Freigegebene Leistungen und Bilder",
        ],
        boundary:
            "Keine erfundenen Standorte, Bewertungen oder garantierten Kartenplatzierungen. Externe Profile werden nur mit passenden Rechten und gesonderter Abstimmung bearbeitet.",
        questions: [
            {
                question:
                    "Brauche ich für jede Nachbarstadt eine eigene Seite?",
                answer: "Nur wenn dort eigenständige, hilfreiche Informationen und ein tatsächlicher Bezug vorliegen. Austauschbare Stadtseiten ersetzen keine klare Leistungsdarstellung und keinen echten Standort.",
            },
            {
                question:
                    "Kannst Du mein Unternehmen direkt bei Suchdiensten verifizieren?",
                answer: "Eine Verifizierung hängt von den Verfahren und Voraussetzungen des jeweiligen Dienstes ab. Eine erfolgreiche Bestätigung kann nicht unabhängig davon zugesagt werden.",
            },
        ],
        services: ["websites-software", "social-media"],
        packages: ["website"],
        related: [
            "/branchen/kioske",
            "/branchen/einzelhandel",
            "/unternehmensberatung-castrop-rauxel",
        ],
    }),
    solution({
        slug: "kooperationsanfragen",
        title: "Kooperationsanfragen für Creator strukturieren",
        description:
            "Anfragen von Marken mit Format, Zeitraum und Ansprechpartner erfassen. Ein übersichtlicher Briefing- und Rückfrageweg für Creator und Streamer.",
        heading: "Vor einer Kooperation die offenen Punkte sichtbar machen",
        answer: "Ein strukturierter Kooperationsweg sammelt die Angaben, die Du für eine erste Sichtung brauchst: Absender, Format, Umfang, Zeitraum und Rückfragen. Avelsorn unterstützt bei Unterlagen und passender Technik. Daraus entsteht keine automatische Zusage, Rechteübertragung oder Vermittlung einer Kooperation.",
        sections: [
            {
                title: "Ein Anfrageformular aus Deinem tatsächlichen Angebot ableiten",
                text: "Wenn Du mehrere Formate anbietest, unterscheiden sich die benötigten Angaben. Ein Stream-Auftritt ist nicht dasselbe wie eine Reihe von Bildern. Wir legen fest, was beim ersten Kontakt sinnvoll abgefragt wird und welche Fragen erst in einem persönlichen Briefing geklärt werden.",
            },
            {
                title: "Unterlagen und Nachweise griffbereit halten",
                text: "Ein Mediakit kann Formate, Kontakt und belegbare Kanalangaben zusammenführen. Die Angaben werden von Dir bereitgestellt und freigegeben. Fiktive Markenkooperationen, unbelegte Reichweiten und fremde Logos werden nicht als Referenz eingebaut.",
            },
            {
                title: "Rückfragen und Freigaben nachvollziehbar organisieren",
                text: "Nach dem Eingang kann sichtbar werden, welche Angaben noch fehlen und welche Person antwortet. Ein Vertrags- oder Inhaltsprüfschritt wird nicht automatisch übersprungen. Benötigte Nutzungsrechte, Kennzeichnungen und verbindliche Vereinbarungen werden von Dir mit geeigneten Fachpersonen geklärt.",
            },
        ],
        prepare: [
            "Deine angebotenen Formate",
            "Anonymisierte typische Geschäftsanfragen",
            "Freigegebene Kanalangaben",
            "Wer Rückfragen und Inhalte freigibt",
        ],
        boundary:
            "Keine Sponsorenvermittlung, Rechtsberatung oder garantierte Anzahl von Anfragen. Ein individuelles Formular oder Mediakit ist kein automatischer Bestandteil des Profilcheck-Pakets.",
        questions: [
            {
                question: "Ist das ein Marktplatz für Kooperationen?",
                answer: "Nein. Es geht um die Bearbeitung Deiner eigenen eingehenden Anfragen. Es wird kein bestehendes Netzwerk als garantierte Auftragsquelle ausgegeben.",
            },
            {
                question: "Kann der Ablauf in meine vorhandene Website?",
                answer: "Das wird anhand der Website, Rechte und technischen Möglichkeiten geprüft. Falls eine direkte Ergänzung nicht passt, besprechen wir eine begrenzte Alternative.",
            },
        ],
        services: ["creator", "websites-software"],
        packages: ["creator"],
        related: [
            "/branchen/streamer",
            "/branchen/influencer",
            "/loesungen/dokumentenfreigaben",
        ],
    }),
    solution({
        slug: "anfragen-vorsortieren",
        title: "Anfragen mit KI vorsortieren und persönlich prüfen",
        description:
            "KI für eine begrenzte Vorsortierung von Anfragen prüfen: erlaubte Daten, Kategorien, menschliche Freigabe und ein Weg für unklare Fälle.",
        heading: "KI dort einsetzen, wo ein überprüfbarer Vorschlag hilft",
        answer: "KI kann bei geeigneten Anfragen einen Kategorie- oder Antwortvorschlag vorbereiten. Sie sollte unklare Fälle erkennbar lassen und keine fachlichen Zusagen ungeprüft versenden. Avelsorn prüft mit Dir Daten, Kategorien und Freigaben und kann eine ausdrücklich vereinbarte technische Umsetzung entwickeln.",
        sections: [
            {
                title: "Zuerst die einfache Regel prüfen",
                text: "Manche Zuordnung lässt sich durch eine verständliche Auswahl im Formular lösen. Das ist oft leichter zu prüfen als ein freier KI-Vorschlag. KI wird dann interessant, wenn bereits unterschiedliche freie Texte vorliegen und eine klar begrenzte Unterstützung beim Sichten gebraucht wird.",
            },
            {
                title: "Einen Vorschlag nicht als Entscheidung ausgeben",
                text: "Wir definieren Kategorien und Beispiele sowie den Umgang mit nicht passenden Eingängen. Ein menschlicher Prüfschritt bleibt dort erhalten, wo ein Fehler Folgen haben könnte. Die Anwendung muss auch ohne brauchbaren Vorschlag einen nachvollziehbaren Bearbeitungsweg bieten.",
                items: [
                    "Geeignete Testfälle und Grenzfälle festlegen",
                    "Zulässige Eingabedaten begrenzen",
                    "Unsichere Fälle zur Sichtung geben",
                    "Antwortentwürfe vor Versand prüfen",
                ],
            },
            {
                title: "Dienste und Daten vor der Anbindung abstimmen",
                text: "Ob ein externer KI-Dienst eingesetzt werden darf, wird anhand der Daten und Deiner Anforderungen geprüft. Dabei werden Zugriffsrechte, laufende Kosten und erforderliche Freigaben geklärt. Eine Nennung von KI bedeutet nicht, dass eine externe Integration bereits produktiv eingerichtet ist.",
            },
        ],
        prepare: [
            "Anonymisierte Beispielanfragen und gewünschte Kategorien",
            "Fehler, die unbedingt vermieden werden müssen",
            "Zulässige Daten und zuständige Prüfperson",
            "Vorhandene Werkzeuge und freigegebene Dienste",
        ],
        boundary:
            "Keine fehlerfreie Erkennung, selbstständige rechtliche Bewertung oder garantierte Zeitersparnis. Datenschutzrechtliche Freigaben werden nicht durch eine technische Implementierung ersetzt.",
        questions: [
            {
                question: "Kann KI jede Anfrage automatisch beantworten?",
                answer: "Das wird hier nicht angeboten. Ein begrenzter Vorschlag mit menschlicher Freigabe ist etwas anderes als eine unbeaufsichtigte verbindliche Antwort.",
            },
            {
                question:
                    "Brauchen wir dafür zwingend einen externen KI-Dienst?",
                answer: "Nein. Zuerst prüfen wir einfache Regeln und vorhandene Werkzeuge. Ein KI-Dienst kommt nur mit geeignetem Bedarf, geklärten Daten und ausdrücklich abgestimmten Bedingungen infrage.",
            },
        ],
        services: ["digitalisierung-ki"],
        packages: ["digitaler-ablauf"],
        related: [
            "/wissen/automatisierung-oder-ki",
            "/wissen/prozessaufnahme-vorlage",
            "/loesungen/anfrageprozesse",
        ],
    }),
];
