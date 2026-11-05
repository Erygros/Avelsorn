export const serviceGroups = [
    {
        key: "beratung",
        title: "Unternehmensberatung",
        description:
            "Wir schaffen Klarheit bei unternehmerischen Entscheidungen, entwickeln tragfähige Strukturen und erarbeiten konkrete nächste Schritte.",
        subjects:
            "Geschäftsmodelle, Positionierung, Gründung und Arbeitsabläufe",
        slugs: ["unternehmensberatung", "gruendung"],
    },
    {
        key: "digital",
        title: "Digitale Unternehmenslösungen",
        description:
            "Wir entwickeln digitale Lösungen, die zu Deinem Unternehmen passen und wiederkehrende Aufgaben vereinfachen.",
        subjects:
            "Websites, Webanwendungen, Formulare, Automatisierung und geeignete KI-Anwendungen",
        slugs: ["websites-software", "digitalisierung-ki"],
    },
    {
        key: "praesenz",
        title: "Marketing & Onlinepräsenz",
        description:
            "Wir unterstützen Dich dabei, Deine Leistungen verständlich zu präsentieren und Deine digitale Präsenz gezielt weiterzuentwickeln.",
        subjects:
            "Social Media, Profiloptimierung, Contentplanung und Creator-Beratung",
        slugs: ["social-media", "creator"],
    },
];

// General examples, deliberately separate from any future verified case reports.
export const serviceExamples = [
    {
        title: "Digitaler Anfrageprozess",
        problem:
            "Kundenanfragen erreichen das Unternehmen über unterschiedliche Kanäle. Informationen müssen mehrfach übertragen werden.",
        solution:
            "Ein digitales Anfrageformular erfasst die benötigten Angaben und überträgt sie strukturiert an die zuständige Stelle.",
        aim: "Weniger manuelle Arbeit und eine übersichtlichere Bearbeitung.",
        slug: "digitalisierung-ki",
    },
    {
        title: "Professioneller Webseitenauftritt",
        problem:
            "Ein Unternehmen besitzt keine passende Website oder der vorhandene Auftritt erklärt die Leistungen nicht verständlich.",
        solution:
            "Entwicklung einer modernen Website mit klarer Leistungsdarstellung, Kontaktmöglichkeiten und responsivem Design.",
        aim: "Interessenten können sich schneller informieren und einfacher Kontakt aufnehmen.",
        slug: "websites-software",
    },
    {
        title: "Gründung strukturieren",
        problem:
            "Eine Geschäftsidee ist vorhanden, aber Zielgruppe, Leistungsangebot und nächste Schritte sind noch unklar.",
        solution:
            "Gemeinsame Ausarbeitung des Angebots, Eingrenzung der Zielgruppe und Entwicklung eines konkreten Maßnahmenplans.",
        aim: "Eine verständliche Ausgangsbasis für die weiteren Gründungsschritte.",
        slug: "gruendung",
    },
];

export const collaborationSteps = [
    [
        "Verstehen",
        "Wir besprechen Deine Ausgangssituation, Deine Ziele und die Herausforderungen, die Du lösen möchtest.",
    ],
    [
        "Planen",
        "Wir legen fest, welche Maßnahmen sinnvoll sind, welche Ergebnisse entstehen sollen und welchen Umfang das Projekt hat.",
    ],
    [
        "Umsetzen",
        "Ich setze die vereinbarten Aufgaben um. Ergebnisse, Rückfragen und Freigaben werden transparent dokumentiert.",
    ],
] as const;
