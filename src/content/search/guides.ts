import { contentDate, type SearchPage } from "./types";
const guide = (page: Omit<SearchPage, "kind" | "updatedOn">): SearchPage => ({
    ...page,
    kind: "guide",
    updatedOn: contentDate,
});
export const guidePages: SearchPage[] = [
    guide({
        slug: "prozessaufnahme-vorlage",
        title: "Prozessaufnahme: Vorlage für einen Arbeitsablauf",
        description:
            "Eine praktische Vorlage, um Auslöser, Daten, Zuständigkeiten, Übergaben und Fehlerfälle eines Arbeitsablaufs festzuhalten. Ohne Anmeldung nutzbar.",
        heading:
            "Einen Arbeitsablauf so beschreiben, dass man ihn verbessern kann",
        answer: "Für eine erste Prozessaufnahme reichen ein klarer Anfang, ein bestimmtes Ende und die tatsächlichen Schritte dazwischen. Beschreibe einen konkreten Vorgang statt die gesamte Firma. Die folgende Vorlage hilft, Zuständigkeiten, benötigte Angaben und Rückfragen sichtbar zu machen, bevor über Automatisierung entschieden wird.",
        sections: [
            {
                title: "Zuerst einen Vorgang auswählen",
                text: "Nimm eine wiederkehrende Aufgabe, die sich im Alltag beobachten lässt: etwa eine Angebotsanfrage oder das Nachfordern einer Unterlage. Schreibe auf, wodurch sie beginnt und wann sie wirklich beendet ist. „E-Mail erhalten“ und „Anfrage beantwortet“ sind andere Zustände als „Auftrag abgeschlossen“. Vermische sie nicht in einer einzigen Beschreibung.",
            },
            {
                title: "Die Vorlage ausfüllen",
                text: "Übernimm die Felder in ein Dokument. Wenn eine Antwort fehlt, kennzeichne sie als offene Frage. Für die erste Aufnahme brauchst Du keine vertraulichen Kundendaten.",
                table: {
                    columns: ["Feld", "Was Du festhältst"],
                    rows: [
                        [
                            "Auslöser",
                            "Welcher konkrete Eingang startet die Aufgabe?",
                        ],
                        [
                            "Zielzustand",
                            "Woran erkennt das Team, dass der Vorgang fertig ist?",
                        ],
                        [
                            "Schritte",
                            "Was passiert tatsächlich und in welcher Reihenfolge?",
                        ],
                        [
                            "Daten",
                            "Welche Angaben braucht der jeweils nächste Schritt?",
                        ],
                        [
                            "Verantwortung",
                            "Wer bearbeitet und wer vertritt die Person?",
                        ],
                        [
                            "Übergabe",
                            "Wohin gehen Ergebnis und offene Rückfragen?",
                        ],
                        [
                            "Ausnahme",
                            "Was geschieht bei fehlenden Angaben oder einer Störung?",
                        ],
                        [
                            "Prüfung",
                            "Wer kontrolliert, ob das Ergebnis brauchbar ist?",
                        ],
                    ],
                },
            },
            {
                title: "Beobachtung und Vermutung trennen",
                text: "Wenn Du wissen möchtest, wo Zeit verloren geht, notiere zunächst beobachtete Rückfragen und doppelte Erfassungen. Eine geschätzte Dauer ist noch kein gemessener Nachweis. Für einen Vergleich vor und nach einer Änderung sollten dieselben Start- und Endpunkte sowie vergleichbare Fälle verwendet werden. Ein Pilot mit einem begrenzten Vorgang ist dafür oft übersichtlicher als ein sofortiger Umbau aller Abläufe.",
            },
        ],
        prepare: [
            "Einen wiederkehrenden Vorgang auswählen",
            "Mit einer tatsächlich beteiligten Person durchgehen",
            "Anonymisierte Beispiele nutzen",
            "Offene Fragen getrennt festhalten",
        ],
        boundary:
            "Die Vorlage ist eine allgemeine Arbeitshilfe und kein Nachweis einer bestimmten Einsparung. Fachliche, rechtliche und sicherheitsrelevante Freigaben bleiben eigenständige Aufgaben.",
        questions: [
            {
                question: "Muss ich dafür ein Prozessdiagramm zeichnen?",
                answer: "Nein. Eine nachvollziehbare Schrittfolge mit Daten und Zuständigkeiten reicht für den Anfang. Ein Diagramm kann später helfen, wenn Verzweigungen oder mehrere Teams beteiligt sind.",
            },
            {
                question: "Welchen Ablauf sollte ich zuerst aufnehmen?",
                answer: "Wähle einen häufigen, klar begrenzten Vorgang mit erkennbaren Rückfragen oder mehrfacher Erfassung. Ein unscharfer Auftrag wie „alles digitalisieren“ lässt sich deutlich schlechter prüfen.",
            },
        ],
        services: ["unternehmensberatung", "digitalisierung-ki"],
        packages: ["digitaler-ablauf"],
        related: [
            "/wissen/automatisierung-oder-ki",
            "/loesungen/anfrageprozesse",
        ],
    }),
    guide({
        slug: "website-briefing",
        title: "Website-Briefing: Checkliste für Dein Projekt",
        description:
            "Welche Informationen für eine Website gebraucht werden: Zielgruppe, Inhalte, Funktionen, vorhandene URLs, Freigaben und Pflege. Eine praktische Briefingvorlage.",
        heading: "Was in ein brauchbares Website-Briefing gehört",
        answer: "Ein Website-Briefing beschreibt, für wen die Seite gedacht ist, welche Fragen sie beantwortet und was Besucher dort tun können sollen. Bestehende Inhalte, URLs, Rechte und Zuständigkeiten gehören ebenfalls dazu. Ein bestimmtes Design oder eine lange Funktionsliste ersetzt diese Angaben nicht.",
        sections: [
            {
                title: "Mit der Aufgabe für den Besucher beginnen",
                text: "Soll jemand eine Leistung verstehen, einen Besuch planen oder eine konkrete Anfrage stellen? Benenne einen hauptsächlichen nächsten Schritt. Daraus lassen sich Seitenstruktur, Inhalte und Kontaktwege ableiten. Beispiele anderer Websites helfen beim Gespräch, sind aber keine Vorlage zum ungeprüften Kopieren.",
            },
            {
                title: "Diese Angaben kannst Du vorbereiten",
                text: "Die Übersicht eignet sich als Ausgangspunkt für ein eigenes Dokument. „Noch offen“ ist eine brauchbare Antwort, solange dafür vor der Umsetzung eine Entscheidung eingeplant wird.",
                table: {
                    columns: ["Bereich", "Frage für Dein Briefing"],
                    rows: [
                        [
                            "Zielgruppe",
                            "Wer soll die Website nutzen und welche Frage mitbringen?",
                        ],
                        [
                            "Angebot",
                            "Welche Leistungen und Grenzen sollen verständlich werden?",
                        ],
                        [
                            "Kontakt",
                            "Was passiert nach einer Anfrage tatsächlich?",
                        ],
                        [
                            "Inhalte",
                            "Welche freigegebenen Texte, Bilder und Markenunterlagen gibt es?",
                        ],
                        [
                            "Bestand",
                            "Welche URLs und Funktionen müssen erhalten bleiben?",
                        ],
                        [
                            "Pflege",
                            "Was ändert sich häufig und wer aktualisiert es?",
                        ],
                        [
                            "Freigabe",
                            "Wer entscheidet über Inhalt, Funktionen und Veröffentlichung?",
                        ],
                        [
                            "Externe Dienste",
                            "Welche vorhandenen Konten und Verträge sind betroffen?",
                        ],
                    ],
                },
            },
            {
                title: "Funktionen mit einem konkreten Prüfkriterium beschreiben",
                text: "Statt nur „Kontaktformular“ zu schreiben, beschreibe benötigte Felder, Empfänger und gewünschte Bestätigung. Für einen Terminprozess gehören Verfügbarkeit, Zeitzone und Änderungen dazu. Für einen geschützten Bereich muss geklärt werden, wer welche Daten sehen darf. So wird das Angebot prüfbar, ohne schon jede technische Entscheidung vorwegzunehmen.",
            },
        ],
        prepare: [
            "Angebot und Zielgruppe kurz beschreiben",
            "Bestandsseiten und wichtige Kontaktwege sammeln",
            "Verwendung von Bildern und Texten klären",
            "Eine Person für gebündelte Rückmeldung benennen",
        ],
        boundary:
            "Ein Briefing ist keine rechtliche Prüfung Deiner Inhalte. Benötigte Unternehmens- und Pflichtangaben müssen geprüft und freigegeben bereitgestellt werden.",
        questions: [
            {
                question: "Müssen alle Texte vor dem Erstgespräch fertig sein?",
                answer: "Nein. Für die erste Klärung genügt eine Beschreibung des Vorhabens. Vor der vereinbarten Umsetzung muss jedoch feststehen, welche Inhalte Du lieferst und welche Arbeiten zusätzlich beauftragt werden.",
            },
            {
                question: "Soll ich technische Programme bereits festlegen?",
                answer: "Nur wenn es verbindliche bestehende Anforderungen gibt. Ansonsten ist es hilfreicher, Aufgaben, Daten und Pflegebedarf zuerst zu beschreiben.",
            },
        ],
        services: ["websites-software"],
        packages: ["website"],
        related: [
            "/wissen/website-oder-webanwendung",
            "/loesungen/website-relaunch",
            "/wissen/website-kosten",
        ],
    }),
    guide({
        slug: "website-kosten",
        title: "Website-Kosten: Umfang und Angebot richtig vergleichen",
        description:
            "Welche Aufgaben den Websitepreis bestimmen und wie Du Angebote vergleichst. Der aktuelle Avelsorn-Einstiegspreis stammt aus der zentralen Paketübersicht.",
        heading:
            "Was beim Preis einer Website tatsächlich verglichen werden sollte",
        answer: "Ein Websitepreis lässt sich nur zusammen mit dem vereinbarten Umfang sinnvoll beurteilen. Seitenzahl, Inhalte, Funktionen, Korrekturen und Übergabe machen einen Unterschied. Bei Avelsorn gilt der veröffentlichte Einstiegspreis für den beschriebenen Onepager-Basisumfang; Dein konkretes Angebot legt Gesamtpreis und Ergebnis fest.",
        sections: [
            {
                title: "Ein Onepager und eine Webanwendung sind verschiedene Aufträge",
                text: "Eine Seite mit Leistungsdarstellung und Kontaktformular benötigt andere Arbeitsschritte als ein Kundenportal mit Anmeldung und privaten Dokumenten. Auch die Übernahme einer bestehenden Website mit vielen alten URLs kann zusätzlichen Prüfaufwand erfordern. Ein Vergleich nur anhand des Einstiegspreises würde diese Unterschiede ausblenden.",
            },
            {
                title: "Angebote anhand derselben Fragen lesen",
                text: "Die folgenden Punkte helfen, zwei Angebote sachlich nebeneinanderzulegen. Fehlende Angaben solltest Du vor einer Beauftragung klären.",
                table: {
                    columns: ["Vergleichspunkt", "Darauf kommt es an"],
                    rows: [
                        [
                            "Seiten und Inhalte",
                            "Welche Seiten, Texte und Bilder werden geliefert oder übernommen?",
                        ],
                        [
                            "Funktionen",
                            "Welche Formulare und Abläufe sind wirklich enthalten?",
                        ],
                        [
                            "Rückmeldung",
                            "Welche Korrekturen sind im beschriebenen Umfang vereinbart?",
                        ],
                        [
                            "Übergabe",
                            "Was erhältst Du und wer kann Inhalte später ändern?",
                        ],
                        [
                            "Zusatzkosten",
                            "Welche Domains, Lizenzen oder Dienste kosten separat?",
                        ],
                        [
                            "Betrieb",
                            "Welche Pflege ist vereinbart und was ist kein laufender Service?",
                        ],
                    ],
                },
            },
            {
                title: "Den Einstiegspreis nicht mit unbegrenzter Arbeit verwechseln",
                text: "Die passenden Paketverweise unten zeigen aktuelle zentrale Preise und den veröffentlichten Umfang. Zusätzliche Unterseiten, Shops oder individuelle Portale sind darin nicht automatisch enthalten. Eine Anfrage ist unverbindlich. Vor einer Beauftragung werden Ergebnis, Zuarbeit, Gesamtpreis und Liefertermin als konkretes Angebot abgestimmt.",
            },
        ],
        prepare: [
            "Benötigte Seiten und Funktionen",
            "Vorhandene freigegebene Inhalte",
            "Welche Aufgaben selbst übernommen werden",
            "Erwartung an spätere Pflege und Änderungen",
        ],
        boundary:
            "Kein allgemeiner Marktpreisvergleich oder Rabattversprechen. Externe Kosten werden nur nach Abstimmung beauftragt; eine eigene Hostinginfrastruktur wird nicht eingerichtet.",
        questions: [
            {
                question:
                    "Ist der veröffentlichte Preis schon mein verbindlicher Gesamtpreis?",
                answer: "Nein. Der Einstiegspreis gilt für den beschriebenen Basisumfang. Nach Klärung Deiner Aufgabe erhältst Du ein konkretes Angebot mit dem Gesamtpreis.",
            },
            {
                question: "Ist ein Kundenportal im Websitepaket enthalten?",
                answer: "Nein. Ein Portal oder eine individuelle Webanwendung hat einen eigenen Planungs- und Entwicklungsumfang und benötigt ein gesondertes Angebot.",
            },
        ],
        services: ["websites-software"],
        packages: ["website", "digitaler-ablauf"],
        related: [
            "/preise",
            "/wissen/website-briefing",
            "/wissen/website-oder-webanwendung",
        ],
    }),
    guide({
        slug: "schnittstellen-pruefen",
        title: "Schnittstellen prüfen: Checkliste vor einer Anbindung",
        description:
            "Welche Angaben vor einer Softwareanbindung fehlen können: Datenquelle, Rechte, Übertragungsrichtung, Fehlerfälle und laufende Kosten. Mit praktischer Prüfliste.",
        heading:
            "Was vor einer Verbindung zwischen zwei Programmen geklärt sein muss",
        answer: "Zwei Programme lassen sich nicht allein deshalb zuverlässig verbinden, weil beide Daten speichern. Benötigt werden ein geeigneter Übertragungsweg, passende Rechte und klare Regeln für Felder, Änderungen und Fehler. Diese Checkliste hilft, eine Anbindung vor der Beauftragung konkret zu beschreiben.",
        sections: [
            {
                title: "Quelle und Ziel genau benennen",
                text: "Welche Anwendung liefert welche Angaben? Gibt es eine dokumentierte Schnittstelle, einen Export oder nur eine manuelle Ansicht? Auch Tarif und Kontorechte können darüber entscheiden, was technisch nutzbar ist. Zugangsdaten werden nicht für eine unverbindliche Erstklärung in ein öffentliches Formular eingetragen.",
            },
            {
                title: "Die Übertragung beschreiben",
                text: "Ein Abgleich braucht Regeln, die über „Daten synchronisieren“ hinausgehen. Notiere für einen ersten Entwurf die folgenden Punkte.",
                table: {
                    columns: ["Punkt", "Zu klärende Entscheidung"],
                    rows: [
                        [
                            "Richtung",
                            "Einmaliger Import, einseitige Übernahme oder beidseitiger Abgleich?",
                        ],
                        [
                            "Kennung",
                            "Wie wird derselbe Datensatz in beiden Programmen erkannt?",
                        ],
                        [
                            "Felder",
                            "Welche Angaben werden benötigt und welche bewusst nicht?",
                        ],
                        [
                            "Änderung",
                            "Welche Quelle ist bei unterschiedlichen Angaben maßgeblich?",
                        ],
                        [
                            "Zeitpunkt",
                            "Wann wird übertragen und wie wird ein Fehler sichtbar?",
                        ],
                        [
                            "Wiederholung",
                            "Wie werden doppelte Vorgänge verhindert?",
                        ],
                        [
                            "Rechte und Kosten",
                            "Welche Zugriffe, Tarife und laufenden Dienste sind erforderlich?",
                        ],
                    ],
                },
            },
            {
                title: "Abweichungen mitplanen",
                text: "Eine sinnvolle Probe enthält fehlende Pflichtangaben, geänderte Feldnamen, ungültige Werte und eine unterbrochene Verbindung. Auch ein wiederholter Import darf nicht unbemerkt doppelte Vorgänge erzeugen. Ein klarer manueller Übergabeschritt kann besser sein als eine instabile Automatisierung, die niemand überwacht.",
            },
        ],
        prepare: [
            "Produktnamen und vorhandene Dokumentation",
            "Anonymisierte Beispieldaten",
            "Benötigte Übertragungsrichtung",
            "Ansprechperson für Rechte und fachliche Freigabe",
        ],
        boundary:
            "Die Checkliste bestätigt noch keine technische Machbarkeit oder zulässige Datenübertragung. Fremde Schnittstellen, Tarife und erforderliche Freigaben werden jeweils geprüft.",
        questions: [
            {
                question: "Reicht ein CSV-Export als Schnittstelle?",
                answer: "Für manche Aufgaben kann ein geplanter Dateiimport ausreichen. Ob er passt, hängt von Aktualität, Datenmenge, Wiederholung und Fehlerbehandlung ab.",
            },
            {
                question: "Kann jedes vorhandene Programm angebunden werden?",
                answer: "Nein. Ohne geeigneten Zugriff oder mit unpassenden Nutzungsbedingungen kann eine direkte Anbindung ausscheiden. Das wird vor einer Zusage geprüft.",
            },
        ],
        services: ["digitalisierung-ki", "websites-software"],
        packages: ["digitaler-ablauf"],
        related: [
            "/loesungen/unterlagen-anfordern",
            "/branchen/trader",
            "/wissen/prozessaufnahme-vorlage",
        ],
    }),
    guide({
        slug: "redaktionsplan-vorlage",
        title: "Redaktionsplan: Vorlage für einen vorhandenen Kanal",
        description:
            "Eine nutzbare Redaktionsplan-Vorlage mit Ziel, Thema, Format, Material, Freigabe und Veröffentlichung. Für Selbstständige, Unternehmen und Creator.",
        heading:
            "Einen Redaktionsplan erstellen, den Du im Alltag nutzen kannst",
        answer: "Ein brauchbarer Redaktionsplan verbindet ein Thema mit einem bestimmten Ziel, Format, Termin und einer verantwortlichen Person. Er sollte auch zeigen, welches Material fehlt und wer Inhalte freigibt. Ein Plan ist eine Arbeitshilfe, keine Zusage von Reichweite oder Kundenanfragen.",
        sections: [
            {
                title: "Themen aus tatsächlichen Fragen ableiten",
                text: "Sammle zunächst Fragen, die Kunden oder Zuschauer wirklich stellen. Dazu können Leistungsumfang, Vorbereitung oder der Ablauf eines Auftrags gehören. Entscheide dann, welche Frage ein Beitrag beantworten soll. Das ergibt konkretere Inhalte als eine Liste austauschbarer Motivationssprüche.",
            },
            {
                title: "Die Vorlage in eine Tabelle übernehmen",
                text: "Du kannst diese Felder in Deinem vorhandenen Tabellenprogramm nutzen. Für den Einstieg reicht ein Kanal; jede zusätzliche Plattform braucht eigene Formate und einen realistischen Pflegeaufwand.",
                table: {
                    columns: ["Spalte", "Was darin steht"],
                    rows: [
                        [
                            "Frage oder Thema",
                            "Welche konkrete Frage beantwortet der Beitrag?",
                        ],
                        [
                            "Ziel",
                            "Informieren, einen Ablauf erklären oder ein Angebot vorstellen?",
                        ],
                        [
                            "Format",
                            "Welches passende Format nutzt der ausgewählte Kanal?",
                        ],
                        [
                            "Material",
                            "Welche freigegebenen Bilder, Texte und Nachweise fehlen noch?",
                        ],
                        ["Verantwortung", "Wer erstellt und wer prüft?"],
                        [
                            "Status",
                            "Idee, in Arbeit, Rückfrage, freigegeben oder veröffentlicht?",
                        ],
                        [
                            "Termin",
                            "Wann ist eine Veröffentlichung sinnvoll und machbar?",
                        ],
                        [
                            "Rückmeldung",
                            "Welche tatsächlichen Fragen oder Reaktionen folgten?",
                        ],
                    ],
                },
            },
            {
                title: "Den Plan anhand echter Rückmeldungen überarbeiten",
                text: "Wenn ein Beitrag neue Rückfragen auslöst, kannst Du sie für ein Folgethema nutzen. Einzelne Reaktionen sind noch kein Beleg einer langfristigen Wirkung. Halte fest, was veröffentlicht wurde, welche Angaben aktualisiert werden müssen und ob ein Format mit Deinem verfügbaren Material gut funktioniert.",
            },
        ],
        prepare: [
            "Einen vorhandenen Kanal auswählen",
            "Häufige Fragen sammeln",
            "Freigegebenes Material zusammenstellen",
            "Erstellung und Freigabe voneinander unterscheiden",
        ],
        boundary:
            "Keine plattformunabhängige Erfolgsformel. Foto- und Videoproduktion, Veröffentlichung und laufende Betreuung sind keine automatische Folge eines Planungspakets.",
        questions: [
            {
                question: "Muss ich täglich veröffentlichen?",
                answer: "Die Vorlage setzt keinen bestimmten Rhythmus voraus. Ein Terminplan muss zu Deinem Material, Deiner Zielgruppe und der verlässlich verfügbaren Arbeit passen.",
            },
            {
                question: "Kann Avelsorn den Plan für mich erarbeiten?",
                answer: "Das Social-Media-Planungspaket beschreibt einen begrenzten Umfang mit Formaten und Themen. Eine laufende Veröffentlichung oder Betreuung wird dadurch nicht automatisch beauftragt.",
            },
        ],
        services: ["social-media", "creator"],
        packages: ["social-media", "creator"],
        related: [
            "/branchen/streamer",
            "/branchen/influencer",
            "/leistungen/social-media",
        ],
    }),
    guide({
        slug: "website-oder-webanwendung",
        title: "Website oder Webanwendung: Was brauchst Du?",
        description:
            "Leistungen erklären oder einen Arbeitsprozess abbilden? Kriterien für die Entscheidung zwischen Website, bestehendem Werkzeug und individueller Webanwendung.",
        heading: "Informationen zeigen oder einen Vorgang bearbeiten?",
        answer: "Eine Website hilft vor allem beim Informieren und Kontaktaufnehmen. Eine Webanwendung bildet zusätzlich konkrete Arbeitsschritte und gespeicherte Zustände ab, häufig mit Rollen und geschütztem Zugriff. Entscheidend ist die Aufgabe, nicht die Bezeichnung oder der Wunsch nach möglichst vielen Funktionen.",
        sections: [
            {
                title: "Wann eine Website ausreicht",
                text: "Wenn Besucher Leistungen, Angebot, Standort und Kontakt verstehen sollen, ist eine klar strukturierte Website oft der passende Ausgangspunkt. Ein einzelnes Formular kann ergänzen, ohne dass daraus bereits ein umfassendes Portal entsteht. Entscheidend ist, was nach dem Absenden tatsächlich passieren soll.",
            },
            {
                title: "Wann eine Anwendung geprüft werden sollte",
                text: "Wiederkehrender Zugriff auf private Informationen, verschiedene Rollen oder ein mehrstufiger Bearbeitungsprozess können eine Anwendung sinnvoll machen. Vor einer individuellen Entwicklung lohnt sich auch der Blick auf vorhandene Werkzeuge.",
                table: {
                    columns: ["Frage", "Bedeutung für die Planung"],
                    rows: [
                        [
                            "Nur informieren?",
                            "Seitenstruktur und verständliche Inhalte stehen im Vordergrund.",
                        ],
                        [
                            "Daten je Kunde speichern?",
                            "Zuordnung, Zugriff und Aufbewahrung müssen geklärt werden.",
                        ],
                        [
                            "Mehrere Rollen?",
                            "Erlaubte Aktionen werden für jede Rolle beschrieben.",
                        ],
                        [
                            "Ein vorhandenes Werkzeug?",
                            "Nutzen, Kosten und mögliche Ergänzungen zuerst vergleichen.",
                        ],
                        [
                            "Laufende Arbeit damit?",
                            "Betrieb, Fehlerfälle und Pflege gehören zum Projekt.",
                        ],
                    ],
                },
            },
            {
                title: "Die kleinste passende Lösung beschreiben",
                text: "Beginne mit einem konkreten Vorgang und einem überprüfbaren Ergebnis. Eine manuelle Übergabe kann zunächst genügen, wenn eine komplexe Integration keinen nachvollziehbaren Nutzen hat. Ein Kundenportal ist kein bloßes Zusatzdesign: Es benötigt eigene Anforderungen, Tests und einen geklärten Betrieb.",
            },
        ],
        prepare: [
            "Den wichtigsten Besuchs- oder Arbeitsvorgang",
            "Welche Daten gespeichert werden müssen",
            "Wer welche Aktionen ausführen darf",
            "Vorhandene Werkzeuge und Pflegebedarf",
        ],
        boundary:
            "Die Einordnung ersetzt keine individuelle Anforderungsprüfung. Ein Portal oder Shop ist kein Bestandteil des veröffentlichten Onepager-Basisumfangs.",
        questions: [
            {
                question: "Kann eine Website später erweitert werden?",
                answer: "Ja, wenn Architektur, Daten und Rechte dafür geeignet geplant werden. Nicht jede Funktion lässt sich jedoch ohne neue Anforderungen oder zusätzlichen Aufwand ergänzen.",
            },
            {
                question:
                    "Ist eine individuelle Anwendung immer die bessere Lösung?",
                answer: "Nein. Ein vorhandenes Werkzeug oder ein kleinerer Prozessschritt kann passender sein. Die Entscheidung hängt von Anforderungen, Pflege und tatsächlichem Bedarf ab.",
            },
        ],
        services: ["websites-software"],
        packages: ["website"],
        related: [
            "/loesungen/kundenportale",
            "/wissen/website-briefing",
            "/wissen/schnittstellen-pruefen",
        ],
    }),
    guide({
        slug: "automatisierung-oder-ki",
        title: "Automatisierung oder KI: Eine Entscheidungshilfe",
        description:
            "Wann feste Regeln reichen und wann KI-Vorschläge geprüft werden können. Eine praktische Entscheidungshilfe für Daten, Fehlerfälle und menschliche Freigaben.",
        heading: "Nicht jede wiederkehrende Aufgabe braucht KI",
        answer: "Feste Regeln passen zu eindeutig definierten Eingaben und Abläufen. KI kann bei geeigneten freien Texten einen Vorschlag liefern, benötigt aber einen geplanten Umgang mit unklaren oder falschen Ergebnissen. Zuerst sollten Aufgabe, Daten und Folgen eines Fehlers beschrieben werden.",
        sections: [
            {
                title: "Mit der einfach prüfbaren Regel beginnen",
                text: "Eine im Formular ausgewählte Anfrageart lässt sich eindeutig weiterleiten. Dafür muss kein freier Text interpretiert werden. Auch eine Erinnerung an fehlende Unterlagen kann eine feste Auslöse- und Abbruchregel haben. Solche Regeln lassen sich oft klar testen und erklären.",
            },
            {
                title: "KI als begrenzten Vorschlag planen",
                text: "Wenn unterschiedliche freie Texte bereits vorliegen, kann eine Zuordnung oder ein Entwurf als Unterstützung infrage kommen. Das Ergebnis darf nicht mit Gewissheit oder einer fachlichen Entscheidung verwechselt werden.",
                table: {
                    columns: ["Prüffrage", "Mögliche Konsequenz"],
                    rows: [
                        [
                            "Gibt es eindeutige Felder?",
                            "Zuerst feste Regeln oder eine bessere Erfassung prüfen.",
                        ],
                        [
                            "Muss freier Text verstanden werden?",
                            "Eine begrenzte Vorschlagsfunktion kann untersucht werden.",
                        ],
                        [
                            "Was passiert bei einem Fehler?",
                            "Prüfschritt, Ausweichweg und Zuständigkeit festlegen.",
                        ],
                        [
                            "Sind Daten freigegeben?",
                            "Vor einer externen Verarbeitung erst Anforderungen und Rechte klären.",
                        ],
                        [
                            "Wie wird verglichen?",
                            "Geeignete Normal- und Grenzfälle vorab festhalten.",
                        ],
                    ],
                },
            },
            {
                title: "Den Test am Vorgang bewerten",
                text: "Ein Pilot sollte nicht nur passende Beispiele enthalten. Berücksichtige auch leere, widersprüchliche und unbekannte Eingaben. Notiere, wann eine Person eingreifen muss. Eine einzelne gelungene Vorführung zeigt noch nicht, dass eine unbeaufsichtigte Verarbeitung im Alltag zuverlässig oder zulässig ist.",
            },
        ],
        prepare: [
            "Konkrete Aufgabe und Eingaben",
            "Normal- und Grenzfälle ohne vertrauliche Daten",
            "Folgen einer falschen Zuordnung",
            "Verantwortung für Prüfung und Freigabe",
        ],
        boundary:
            "Keine Zusage fehlerfreier KI oder bestimmter Einsparungen. Externe Dienste und die Zulässigkeit von Datenverarbeitungen werden projektbezogen und mit erforderlichen Fachfreigaben geklärt.",
        questions: [
            {
                question: "Spart KI automatisch mehr Zeit als eine Regel?",
                answer: "Das lässt sich ohne den konkreten Ablauf nicht behaupten. Zusätzliche Prüfung und Fehlerbehandlung gehören zum Vergleich dazu.",
            },
            {
                question: "Kann zunächst ohne KI begonnen werden?",
                answer: "Ja. Eine bessere Erfassung und klare Zuständigkeiten können bereits helfen. Ein späterer KI-Baustein wird nur bei passender Aufgabe und geklärten Bedingungen geprüft.",
            },
        ],
        services: ["digitalisierung-ki", "unternehmensberatung"],
        packages: ["digitaler-ablauf"],
        related: [
            "/wissen/prozessaufnahme-vorlage",
            "/loesungen/anfragen-vorsortieren",
        ],
    }),
    guide({
        slug: "geschaeftsidee-testen",
        title: "Geschäftsidee prüfen: Fragen vor der Selbstständigkeit",
        description:
            "Eine erste Geschäftsidee mit konkreten Kundenfragen, abgegrenztem Angebot und offenen Voraussetzungen prüfen. Praktische Orientierung ohne Erfolgsversprechen.",
        heading: "Eine Geschäftsidee mit konkreten Fragen prüfen",
        answer: "Eine Idee wird greifbarer, wenn Du eine bestimmte Zielgruppe, deren Problem und eine klar begrenzte Leistung beschreibst. Erste Gespräche können zeigen, welche Annahmen noch offen sind. Sie beweisen jedoch noch keine tragfähige Nachfrage oder ein wirtschaftlich erfolgreiches Unternehmen.",
        sections: [
            {
                title: "Eine Leistung statt eines großen Schlagworts beschreiben",
                text: "„Etwas mit Social Media“ lässt offen, was Du lieferst. Eine erste Leistungsbeschreibung nennt Aufgabe, Ergebnis, benötigte Zuarbeit und Grenzen. Du kannst unterschiedliche Tätigkeitsfelder vergleichen, solltest für einen ersten Test aber eine konkrete Richtung auswählen. Persönliche Fähigkeiten und verfügbare Mittel gehören dazu.",
            },
            {
                title: "Fragen für ein erstes Gespräch",
                text: "Nutze die Fragen als Gesprächshilfe und notiere tatsächliche Antworten getrennt von Deiner eigenen Einschätzung. Eine freundliche Reaktion ist nicht automatisch eine verbindliche Zahlungsbereitschaft.",
                table: {
                    columns: ["Thema", "Mögliche Frage"],
                    rows: [
                        ["Problem", "Wie erledigst Du die Aufgabe heute?"],
                        [
                            "Häufigkeit",
                            "Wann ist dieses Problem zuletzt aufgetreten?",
                        ],
                        [
                            "Auswirkung",
                            "Welche Rückfragen oder Handgriffe entstehen dadurch?",
                        ],
                        [
                            "Erwartung",
                            "Was müsste ein brauchbares Ergebnis enthalten?",
                        ],
                        [
                            "Entscheidung",
                            "Wer entscheidet über eine Beauftragung?",
                        ],
                        [
                            "Offene Frage",
                            "Was müsstest Du vor einer Entscheidung noch wissen?",
                        ],
                    ],
                },
            },
            {
                title: "Danach die nächsten Prüfungen festhalten",
                text: "Aus Gesprächen können Änderungen am Angebot entstehen. Halte auch fest, was noch nicht belegt ist: tatsächlicher Aufwand, Nachfrage, Preis, notwendige Kenntnisse oder formale Voraussetzungen. Steuerliche und rechtliche Fragen werden mit geeigneten Fachpersonen geklärt. Ein erster Test ist eine Entscheidungshilfe, keine Zusage beruflicher Unabhängigkeit.",
            },
        ],
        prepare: [
            "Bisherige Erfahrungen und Fähigkeiten",
            "Eine mögliche Zielgruppe",
            "Ein beschriebenes Ergebnis",
            "Offene Annahmen und vorhandene Rückmeldungen",
        ],
        boundary:
            "Allgemeine Vorbereitung, keine Rechts-, Steuer-, Fördermittel- oder persönliche Finanzberatung. Ein vollständiger Businessplan und ein garantierter Geschäftserfolg werden nicht behauptet.",
        questions: [
            {
                question: "Brauche ich vor der Beratung eine fertige Idee?",
                answer: "Nein. Das Einstiegspaket zur Vorbereitung einer Selbstständigkeit ist auch für Menschen gedacht, die mögliche Tätigkeitsfelder erst vergleichen möchten.",
            },
            {
                question:
                    "Sind erste positive Gespräche ein ausreichender Nachweis?",
                answer: "Sie können Hinweise geben, ersetzen aber keine weitere Prüfung von Aufwand, tatsächlicher Nachfrage und Voraussetzungen. Halte Annahmen und belegte Rückmeldungen getrennt fest.",
            },
        ],
        services: ["gruendung"],
        packages: ["neustart", "gruendung"],
        related: [
            "/beruflich-neu-starten",
            "/zielgruppen/gruender",
            "/wissen/website-briefing",
        ],
    }),
];
