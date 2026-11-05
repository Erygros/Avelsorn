import { contentDate, type SearchPage } from "./types";
export const generalSearchPages: SearchPage[] = [
    {
        kind: "local",
        slug: "unternehmensberatung-castrop-rauxel",
        updatedOn: contentDate,
        title: "Unternehmensberatung in Castrop-Rauxel · digitale Umsetzung",
        description:
            "Avelsorn mit Sitz in Castrop-Rauxel: persönliche Beratung zu Gründung, Website und digitalen Abläufen. Erstgespräch telefonisch, Projekte nach vereinbartem Umfang.",
        heading: "Beratung und digitale Umsetzung aus Castrop-Rauxel",
        answer: "Avelsorn hat seinen Sitz in Castrop-Rauxel. Enrico Gross unterstützt Gründer, Selbstständige und kleine Unternehmen bei Angebot, Arbeitsabläufen und digitalen Lösungen. Das kostenlose Erstgespräch findet telefonisch statt. Eine Zusammenarbeit ist deshalb auch möglich, wenn Dein Betrieb nicht in der unmittelbaren Umgebung liegt.",
        sections: [
            {
                title: "Eine konkrete Aufgabe für Deinen Betrieb",
                text: "Vielleicht erklärt Deine Website das Angebot noch nicht verständlich. Vielleicht werden Angaben im Team mehrfach übertragen oder eine erste selbstständige Tätigkeit ist noch nicht klar umrissen. Wir beginnen mit dieser Aufgabe und legen fest, ob Beratung, technische Umsetzung oder beides benötigt wird.",
            },
            {
                title: "Vom Telefongespräch zum vereinbarten Auftrag",
                text: "Im Erstgespräch schilderst Du kurz Dein Vorhaben. Danach kann ein konkretes Angebot entstehen, in dem Ergebnis, Zuarbeit, Gesamtpreis und Liefertermin beschrieben sind. Eine Anfrage beauftragt keine kostenpflichtige Arbeit. Während eines Auftrags können Projektinformationen, Rückfragen und Dokumente im geschützten Kundenkonto zusammengeführt werden.",
            },
            {
                title: "Geschäftssitz ist keine offene Sprechstunde",
                text: "Die Anbieteranschrift ist im Impressum angegeben. Daraus folgt kein frei zugängliches Ladenlokal oder eine ohne Abstimmung verfügbare Vor-Ort-Beratung. Für das Kennenlernen wählst Du einen Telefontermin. Ein besonderer Gesprächs- oder Projektbedarf wird vor einer Zusage individuell besprochen.",
            },
        ],
        prepare: [
            "Dein Vorhaben in wenigen Sätzen",
            "Welche Aufgabe Dich gerade aufhält",
            "Vorhandene Website oder verwendete Programme",
            "Welche Entscheidung Du zuerst klären möchtest",
        ],
        boundary:
            "Keine zusätzlichen Niederlassungen, lokalen Kundenreferenzen oder Vor-Ort-Termine werden behauptet. Die Zusammenarbeit und mögliche externe Kosten werden vorab konkret vereinbart.",
        questions: [
            {
                question: "Muss mein Unternehmen in Castrop-Rauxel sitzen?",
                answer: "Nein. Der telefonische Erstkontakt und die digitale Projektabstimmung sind nicht auf einen örtlichen Betrieb beschränkt. Entscheidend sind Aufgabe und vereinbarter Umfang.",
            },
            {
                question: "Kann ich ohne Termin zur Geschäftsanschrift kommen?",
                answer: "Eine offene Sprechstunde oder ein frei besuchbares Ladenlokal wird nicht angeboten. Nutze bitte den vereinbarten Telefontermin oder die veröffentlichten Kontaktwege.",
            },
        ],
        services: [
            "unternehmensberatung",
            "gruendung",
            "websites-software",
            "digitalisierung-ki",
        ],
        packages: ["neustart", "website"],
        related: ["/kontakt", "/impressum", "/branchen", "/loesungen"],
    },
    {
        kind: "questions",
        slug: "fragen",
        updatedOn: contentDate,
        title: "Häufige Fragen zu Beratung, Preisen und Zusammenarbeit",
        description:
            "Antworten zum kostenlosen Erstgespräch, individuellen Angeboten, Projektumfang, Zahlung und digitalen Umsetzungen bei Avelsorn. Mit passenden weiterführenden Seiten.",
        heading: "Was Du vor einer Zusammenarbeit wissen möchtest",
        answer: "Du kannst eine konkrete Aufgabe oder eine noch offene berufliche Idee mit Avelsorn besprechen. Das kostenlose Telefon-Erstgespräch verpflichtet Dich zu keiner kostenpflichtigen Zusammenarbeit. Ein Auftrag entsteht erst auf Grundlage eines konkret beschriebenen Angebots und Deiner ausdrücklichen Beauftragung.",
        sections: [
            {
                title: "Erst das Anliegen, dann der Umfang",
                text: "Ein Websiteprojekt unterscheidet sich von einer Prozessaufnahme oder einer beruflichen Orientierung. Damit ein Angebot passt, klären wir zunächst die Aufgabe, das gewünschte Ergebnis und die benötigte Zuarbeit. Du musst im Erstgespräch noch keine fertige technische Lösung benennen.",
            },
            {
                title: "Veröffentlichte Pakete geben einen Einstieg",
                text: "Die Preisseite enthält beschriebene Basisumfänge mit Einstiegspreisen. Sie sind keine Zusage unbegrenzter Arbeit. Zusätzliche Seiten, Funktionen oder externe Dienste werden ausdrücklich besprochen. Umfang, Liefertermin und Gesamtpreis stehen vor einer Beauftragung im konkreten Angebot.",
            },
            {
                title: "Fragen bleiben auch während eines Projekts sichtbar",
                text: "Für einen anschließenden Auftrag werden die relevanten Projektinformationen im Kundenkonto geführt. Dort können Rückfragen, Dateien, Aufgaben und Freigaben zugeordnet werden. Die Registrierung und E-Mail-Bestätigung für das Konto sind von einer Gastbuchung des kostenlosen Telefontermins getrennt.",
            },
        ],
        prepare: [
            "Welche Aufgabe Du besprechen möchtest",
            "Vorhandene Unterlagen nur anonymisiert für die Erstklärung",
            "Deine wichtigsten offenen Fragen",
        ],
        boundary:
            "Die Antworten beschreiben den veröffentlichten Ablauf. Für einen Auftrag gelten das konkrete Angebot und die dazugehörigen Vertragsinformationen. Es gibt keine zugesagten Umsätze, Reichweiten oder Einsparungen.",
        questions: [
            {
                question: "Ist das Erstgespräch wirklich kostenlos?",
                answer: "Ja. Das veröffentlichte Erstgespräch ist ein kostenloser Telefontermin von 15 Minuten. Daraus entsteht keine kostenpflichtige Beauftragung.",
            },
            {
                question: "Brauche ich dafür ein Kundenkonto?",
                answer: "Du kannst den kostenlosen Telefontermin als Gast mit den benötigten Kontaktdaten buchen. Ein reguläres Kundenkonto bleibt für eine spätere Zusammenarbeit ein eigener, geschützter Zugang mit E-Mail-Bestätigung.",
            },
            {
                question: "Übernimmt Avelsorn auch die praktische Arbeit?",
                answer: "Ja, wenn sie als konkreter Umfang vereinbart wird. Dazu können Websites, Formulare, Webanwendungen oder Verbesserungen eines digitalen Ablaufs gehören. Nicht jede externe Software gilt dadurch bereits als angebunden.",
            },
            {
                question: "Kann ich ohne fertige Geschäftsidee beginnen?",
                answer: "Ja. Das Paket zur Vorbereitung einer Selbstständigkeit ist auch für Menschen gedacht, die ihre Erfahrungen und mögliche Tätigkeitsfelder zunächst sortieren möchten.",
            },
            {
                question: "Wie wird ein kostenpflichtiger Auftrag bezahlt?",
                answer: "Du erhältst ein konkretes Angebot und bestätigst es ausdrücklich. Die Zahlung erfolgt per Überweisung. Nach geprüftem vollständigem Zahlungseingang wird das Paketprojekt angelegt; der zulässige Leistungsbeginn richtet sich auch nach den dazugehörigen Erklärungen.",
            },
            {
                question: "Sind alle Branchenbeispiele echte Referenzen?",
                answer: "Nein. Die Branchen- und Lösungsseiten beschreiben mögliche Aufgaben und Einsatzsituationen. Sie werden nicht als abgeschlossene Kundenprojekte oder Nachweis bestimmter Ergebnisse dargestellt.",
            },
        ],
        services: ["gruendung", "websites-software", "digitalisierung-ki"],
        packages: ["neustart", "website"],
        related: [
            "/preise",
            "/ablauf",
            "/kalender",
            "/ueber-mich",
            "/branchen",
        ],
    },
];
