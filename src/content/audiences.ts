export type Audience = {
    slug: string;
    name: string;
    title: string;
    description: string;
    heading: string;
    intro: string;
    summary: string;
    situations: { title: string; text: string }[];
    example: { title: string; text: string; result: string };
    prepare: string[];
    services: string[];
    questions: { question: string; answer: string }[];
};

export const audiences: Audience[] = [
    {
        slug: "unternehmen",
        name: "Unternehmen",
        title: "Beratung für Unternehmen: Abläufe und Digitalisierung",
        description:
            "Avelsorn unterstützt kleine Unternehmen bei digitalen Abläufen, Websites und internen Werkzeugen – von der Aufgabenklärung bis zur vereinbarten Umsetzung.",
        heading: "Weniger manuelle Übergaben im Betrieb",
        intro: "Kundenanfragen landen in mehreren Postfächern, Informationen werden doppelt erfasst und Dein Team fragt fehlenden Unterlagen hinterher. Wir prüfen mit Euch Zuständigkeiten und Arbeitsschritte, vereinfachen den Ablauf und setzen vereinbarte Automatisierungen um. Ob dadurch Zeit frei wird, vergleichen wir am Ablauf vor und nach einem Testlauf.",
        summary:
            "Für kleine Unternehmen, die einzelne Prozesse verbessern oder ein konkretes digitales Projekt bearbeiten lassen möchten.",
        situations: [
            {
                title: "Anfragen und Übergaben ordnen",
                text: "Wir schauen uns an, wie eine Anfrage bei Euch eingeht, wer sie bearbeitet und wo Informationen verloren gehen. Daraus können ein gemeinsames Formular, ein übersichtlicher Bearbeitungsstand oder eine klare Zuständigkeit entstehen.",
            },
            {
                title: "Übertragungen und Rückfragen reduzieren",
                text: "Einmal erfasste Angaben können über eine geeignete Schnittstelle ins nächste System übernommen werden. Wir prüfen Eure Werkzeuge und legen fest, wann eine Übertragung ausgelöst wird, wer Fehler sieht und wie unvollständige Angaben nachgefordert werden.",
            },
            {
                title: "KI mit einem festen Prüfschritt einsetzen",
                text: "Für wiederkehrende Texte kann KI eine Zuordnung oder einen Antwortentwurf vorbereiten. Wir bestimmen die zulässigen Daten, testen typische Fehler und legen fest, wer das Ergebnis vor der weiteren Verwendung prüft. Bei Bedarf ergänzen wir dafür eine interne Webanwendung.",
            },
        ],
        example: {
            title: "Beispiel: Vom E-Mail-Postfach zur geordneten Anfrage",
            text: "Ein möglicher Auftrag beginnt mit einem Blick auf Euren bisherigen Anfrageprozess. Gemeinsam legen wir Pflichtangaben, Zuständigkeiten und Rückmeldungen fest. Anschließend können wir ein passendes Formular oder eine vereinbarte technische Anbindung umsetzen.",
            result: "Als Arbeitsergebnis vereinbaren wir zum Beispiel ein nutzbares Anfrageformular samt dokumentiertem Ablauf. Welche Technik dafür passt, entscheiden wir nach Prüfung Eurer vorhandenen Systeme.",
        },
        prepare: [
            "Welcher Ablauf kostet Euch regelmäßig Zeit?",
            "Welche Programme und Daten sind daran beteiligt?",
            "Wer kann Anforderungen und spätere Änderungen freigeben?",
        ],
        services: [
            "unternehmensberatung",
            "digitalisierung-ki",
            "websites-software",
        ],
        questions: [
            {
                question: "Müssen wir unsere vorhandenen Systeme ersetzen?",
                answer: "Das klären wir anhand der konkreten Aufgabe. Bestehende Werkzeuge können weitergenutzt oder ergänzt werden, wenn sie die Anforderungen erfüllen. Eine neue Anwendung ist nur eine der möglichen Lösungen.",
            },
            {
                question:
                    "Kannst Du mit jemandem aus unserem Team zusammenarbeiten?",
                answer: "Ja. Wir legen fest, wer den Ablauf erläutert, Zugänge bereitstellt und Ergebnisse prüft. So können Fragen und Freigaben über eine vereinbarte Ansprechperson laufen.",
            },
        ],
    },
    {
        slug: "selbststaendige",
        name: "Selbstständige",
        title: "Beratung für Selbstständige: Website und Arbeitsabläufe",
        description:
            "Unterstützung für Selbstständige bei Angebot, Website und wiederkehrenden Aufgaben. Avelsorn berät und übernimmt klar vereinbarte Projektarbeit.",
        heading: "Website und Abläufe für Selbstständige",
        intro: "Du bearbeitest Aufträge und kümmerst Dich nebenbei um Anfragen, Website und Organisation. Wir helfen Dir, eine dieser Aufgaben anzugehen: das Angebot verständlicher beschreiben, die Website überarbeiten oder einen wiederkehrenden Ablauf vereinfachen.",
        summary:
            "Für Selbstständige mit laufendem Geschäft, die eine konkrete Aufgabe abgeben oder ihren Arbeitsalltag besser organisieren möchten.",
        situations: [
            {
                title: "Dein Angebot verständlich beschreiben",
                text: "Wenn Du häufig dieselben Rückfragen bekommst, schauen wir auf Deine Leistungsbeschreibung. Was übernimmst Du, was benötigen Kunden dafür und wie beginnt ein Auftrag? Diese Informationen bilden die Grundlage für Deine Website oder Angebotsunterlagen.",
            },
            {
                title: "Die eigene Website fertigstellen",
                text: "Vielleicht fehlen Texte, eine klare Seitenstruktur oder ein Kontaktformular. Wir halten fest, welche Bestandteile fehlen und was Du selbst liefern möchtest. Die vereinbarte Gestaltung und technische Umsetzung können wir übernehmen.",
            },
            {
                title: "Wiederkehrende Handgriffe reduzieren",
                text: "Terminabsprachen, Rückfragen und das Einsammeln von Unterlagen lassen sich oft übersichtlicher organisieren. Wir prüfen einen einzelnen Ablauf und richten bei Bedarf Vorlagen, Formulare oder geeignete Verbindungen zwischen vorhandenen Werkzeugen ein.",
            },
        ],
        example: {
            title: "Beispiel: Kunden vor dem ersten Termin informieren",
            text: "Ein möglicher Auftrag ist eine Seite, auf der Deine Leistung, die benötigten Unterlagen und der Weg zur Anfrage zusammenkommen. Wir sammeln die häufigsten Rückfragen und entscheiden, welche davon die Seite direkt beantworten soll.",
            result: "Vereinbart werden können eine überarbeitete Leistungsseite und ein dazu passendes Anfrageformular. Ob sich dadurch Rückfragen reduzieren, lässt sich erst im tatsächlichen Einsatz beurteilen.",
        },
        prepare: [
            "Welche Aufgabe verschiebst Du seit mehreren Wochen?",
            "Welche Fragen stellen neue Kunden immer wieder?",
            "Welche Website oder Werkzeuge nutzt Du bereits?",
        ],
        services: [
            "unternehmensberatung",
            "websites-software",
            "digitalisierung-ki",
        ],
        questions: [
            {
                question:
                    "Kann ich auch nur eine einzelne Aufgabe beauftragen?",
                answer: "Ja. Du kannst mit einer abgegrenzten Aufgabe beginnen, etwa einer Leistungsseite oder einem Formular. Umfang, benötigte Inhalte und Aufwand besprechen wir vor der Beauftragung.",
            },
            {
                question:
                    "Was unterscheidet diese Unterstützung von der für Freelancer?",
                answer: "Hier stehen der laufende Betrieb und die Kundenorganisation im Vordergrund. Die Freelancer-Seite geht genauer auf projektbasierte Arbeit, Portfolio, Briefings und die Abgrenzung einzelner Aufträge ein.",
            },
        ],
    },
    {
        slug: "gruender",
        name: "Gründer",
        title: "Beratung für Gründer: Angebot und ersten Auftritt planen",
        description:
            "Du bereitest Deine Selbstständigkeit vor? Mit Avelsorn konkretisierst Du Dein Angebot, planst erste Schritte und entwickelst Deinen digitalen Auftritt.",
        heading: "Angebot und Website vor der Gründung",
        intro: "Was möchtest Du anbieten, wer braucht es und wie sollen erste Kunden davon erfahren? Wenn Du eine Selbstständigkeit vorbereitest, arbeiten wir mit Dir an diesen Fragen und unterstützen Dich bei einem überschaubaren ersten Auftritt.",
        summary:
            "Für Menschen vor der Gründung oder in der ersten Aufbauphase, die ihr Angebot konkretisieren und erste Aufgaben umsetzen möchten.",
        situations: [
            {
                title: "Aus einer Idee ein Angebot formulieren",
                text: "Wir beschreiben, für wen Dein Angebot gedacht ist, welches Anliegen es bearbeitet und was konkret enthalten sein soll. Dabei halten wir auch fest, welche Annahmen Du noch durch Gespräche mit möglichen Kunden prüfen möchtest.",
            },
            {
                title: "Den Startumfang festlegen",
                text: "Nicht jede Idee muss sofort umgesetzt werden. Wir sammeln die anstehenden Aufgaben, klären Abhängigkeiten und legen fest, was Du für den ersten Kontakt mit Kunden tatsächlich benötigst. Daraus entsteht eine nachvollziehbare Aufgabenliste.",
            },
            {
                title: "Einen ersten digitalen Auftritt erstellen",
                text: "Eine verständliche Website, ein Kontaktweg und passende Inhalte können zum Start gehören. Wir können die vereinbarten Seiten und Funktionen umsetzen. Du behältst dabei den Überblick über Umfang und gesondert freizugebende externe Kosten.",
            },
        ],
        example: {
            title: "Beispiel: Eine Dienstleistung erstmals vorstellen",
            text: "Du möchtest mit einer Dienstleistung starten, kannst sie bisher aber nur im Gespräch erklären. Wir formulieren eine erste Leistungsbeschreibung, sammeln die typischen Fragen möglicher Kunden und legen einen Kontaktweg fest.",
            result: "Ein vereinbartes Ergebnis kann eine Angebotsbeschreibung mit einer schlanken Website sein. Die Nachfrage nach Deinem Angebot muss sich anschließend am Markt zeigen; eine Umsatz- oder Erfolgsgarantie gibt es nicht.",
        },
        prepare: [
            "Welche Fähigkeiten oder Leistungen möchtest Du anbieten?",
            "Mit welchen möglichen Kunden hast Du bereits gesprochen?",
            "Welchen zeitlichen und finanziellen Rahmen hast Du für den Start?",
        ],
        services: ["gruendung", "websites-software", "social-media"],
        questions: [
            {
                question: "Brauche ich schon einen fertigen Businessplan?",
                answer: "Nein. Für das erste Gespräch reicht eine Beschreibung Deiner Idee und der Fragen, die Dich gerade beschäftigen. Vorhandene Notizen oder eine erste Angebotsbeschreibung können wir als Ausgangspunkt nutzen.",
            },
            {
                question:
                    "Übernimmst Du auch Steuerberatung oder rechtliche Gründungsfragen?",
                answer: "Unser Angebot auf dieser Seite umfasst die Planung Deines Angebots und praktische digitale Projektarbeit. Für verbindliche steuerliche oder rechtliche Fragen beziehst Du entsprechend qualifizierte Fachleute ein. Benötigte Inhalte für Deine Website stellst Du nach dieser Klärung bereit.",
            },
        ],
    },
    {
        slug: "freelancer",
        name: "Freelancer",
        title: "Beratung für Freelancer: Portfolio und Projektabläufe",
        description:
            "Portfolio, Briefings und klare Projektabläufe: Avelsorn unterstützt Freelancer dabei, ihre Leistungen darzustellen und Kundenprojekte zu organisieren.",
        heading: "Portfolio, Briefings und Projektablauf",
        intro: "Du arbeitest projektweise und wechselst zwischen Akquise, Umsetzung und Abstimmung. Wir unterstützen Dich dabei, Deine Arbeit im Portfolio verständlich zu zeigen und den Weg von der ersten Anfrage bis zur Übergabe besser vorzubereiten.",
        summary:
            "Für projektbasiert arbeitende Freelancer, die ihr Portfolio überarbeiten oder Anfragen, Leistungsumfang und Freigaben klarer organisieren möchten.",
        situations: [
            {
                title: "Ein Portfolio mit verständlichen Projekten",
                text: "Gemeinsam wählen wir aus, welche Arbeiten Du zeigen darfst und welche Informationen für Interessenten wichtig sind. Deine eigene Rolle, die Aufgabenstellung und der tatsächlich erbrachte Beitrag stehen dabei im Mittelpunkt. Wir können den passenden Webauftritt umsetzen.",
            },
            {
                title: "Ein Briefing vorbereiten",
                text: "Welche Informationen brauchst Du, bevor Du einen Auftrag einschätzen kannst? Wir strukturieren Fragen zu Ziel, Lieferumfang, vorhandenen Materialien und Fristen. Daraus kann ein wiederverwendbarer Fragebogen oder ein digitales Anfrageformular werden.",
            },
            {
                title: "Projektgrenzen und Freigaben sichtbar machen",
                text: "Unklare Rückmeldungen und zusätzliche Wünsche erschweren die Planung. Wir beschreiben einen Ablauf für Zwischenstände, Feedback und Übergabe und prüfen, welche Vorlagen oder Werkzeuge Dich dabei unterstützen können.",
            },
        ],
        example: {
            title: "Beispiel: Anfragen für Gestaltungsprojekte vorbereiten",
            text: "Ein möglicher Auftrag verbindet Deine Portfolioseite mit einem Briefingformular. Interessenten beschreiben Aufgabe, vorhandene Inhalte und gewünschten Termin. Du entscheidest, welche Angaben für eine erste Einschätzung erforderlich sind.",
            result: "Das vereinbarte Arbeitsergebnis kann eine Portfolioseite mit einem nutzbaren Fragebogen sein. Welche Anfragen daraus zu Aufträgen werden, hängt unter anderem von Nachfrage, Angebot und Deiner Auswahl ab.",
        },
        prepare: [
            "Welche Art von Projekten möchtest Du künftig übernehmen?",
            "Welche eigenen Arbeiten darfst Du öffentlich zeigen?",
            "Welche Informationen fehlen Dir häufig bei einer Anfrage?",
        ],
        services: [
            "websites-software",
            "unternehmensberatung",
            "digitalisierung-ki",
        ],
        questions: [
            {
                question:
                    "Kannst Du mein vorhandenes Portfolio weiterentwickeln?",
                answer: "Wir können zunächst Inhalte, Aufbau und technische Grundlage gemeinsam prüfen. Danach vereinbaren wir gezielte Änderungen oder einen neuen Aufbau, falls die vorhandene Lösung die Anforderungen nicht abdeckt.",
            },
            {
                question: "Schreibst Du auch meine Kundenverträge?",
                answer: "Wir können Leistungsumfang und organisatorische Abläufe für Deine Projektarbeit beschreiben. Die rechtliche Ausgestaltung und Prüfung Deiner Verträge gehört in die Hände entsprechend qualifizierter Fachleute.",
            },
        ],
    },
    {
        slug: "creator",
        name: "Creator",
        title: "Beratung für Creator: Contentplanung und Kooperationen",
        description:
            "Avelsorn unterstützt Creator bei Contentabläufen, Mediakit und Kooperationsanfragen sowie einer eigenen Website – mit konkret vereinbarter Umsetzung.",
        heading: "Content planen und Anfragen bearbeiten",
        intro: "Neben Deinen Inhalten fallen Planung, Abstimmungen und Anfragen an. Wir unterstützen Dich beim Aufbau dieser Abläufe und bei digitalen Unterlagen, mit denen Du Deine Arbeit gegenüber möglichen Kooperationspartnern vorstellen kannst.",
        summary:
            "Für Creator und Influencer, die ihre Contentarbeit organisieren, Kooperationen vorbereiten oder eine eigene Anlaufstelle neben ihren Plattformprofilen entwickeln möchten.",
        situations: [
            {
                title: "Content planbar vorbereiten",
                text: "Wir schauen auf Deine Formate, verfügbare Zeit und bisherigen Veröffentlichungsabläufe. Daraus kann ein Redaktionsplan entstehen, der Ideen, Produktion, Material und Veröffentlichung zusammenführt und sich im Alltag pflegen lässt.",
            },
            {
                title: "Ein Mediakit zusammenstellen",
                text: "Du stellst aktuelle, belegbare Angaben zu Deinen Kanälen und bisherigen Arbeiten bereit. Wir unterstützen Dich bei Struktur und verständlicher Darstellung. Zahlen, Referenzen und Kooperationen werden ausschließlich aus Deinen tatsächlichen Angaben übernommen.",
            },
            {
                title: "Kooperationsanfragen und eigene Website",
                text: "Welche Marken passen zu Deinen Inhalten, welche Leistungen möchtest Du anbieten und welche Angaben brauchst Du für eine Anfrage? Wir strukturieren diese Fragen und können eine eigene Website mit Kontaktmöglichkeit oder Kooperationsformular umsetzen.",
            },
        ],
        example: {
            title: "Beispiel: Eine Anlaufstelle für Markenanfragen",
            text: "Ein möglicher Auftrag ist eine kompakte Website mit Vorstellung Deiner Formate, einem freigegebenen Mediakit und einem Kooperationsformular. Wir legen fest, welche Informationen öffentlich erscheinen und welche Du erst auf Anfrage weitergeben möchtest.",
            result: "Als Ergebnis können Website, Mediakit und ein dokumentierter Anfrageablauf vereinbart werden. Neue Kooperationen oder steigende Reichweite lassen sich damit nicht garantieren.",
        },
        prepare: [
            "Welche Kanäle und Formate betreibst Du?",
            "Welche aktuellen Kennzahlen kannst Du belegen und freigeben?",
            "Wo stocken Planung oder Abstimmung derzeit?",
        ],
        services: ["creator", "social-media", "websites-software"],
        questions: [
            {
                question: "Brauchst Du Zugriff auf meine Social-Media-Konten?",
                answer: "Für die erste Planung reichen in der Regel Deine Beschreibungen und freigegebene Informationen. Falls eine spätere Aufgabe Zugriff erfordert, klären wir vorher Zweck und Berechtigungen. Passwörter gehören nicht in Kontaktformulare oder Briefings.",
            },
            {
                question: "Vermittelst Du Kooperationen mit Marken?",
                answer: "Diese Unterstützung umfasst die Vorbereitung Deiner Unterlagen und Abläufe sowie vereinbarte digitale Projektarbeit. Eine Vermittlung oder Zusage von Markenkooperationen ist damit nicht verbunden.",
            },
        ],
    },
];

export const audiencePath = (audience: Audience) =>
    `/zielgruppen/${audience.slug}`;
export const findAudience = (slug: string) =>
    audiences.find((a) => a.slug === slug);
