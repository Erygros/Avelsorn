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

export const workExamples = [
    {
        title: "Sportverein",
        work: "Wir haben einen Sportverein bei seiner Arbeit unterstützt.",
        link: null,
    },
    {
        title: "Kioske und kleine Imbissbetriebe",
        work: "Wir haben lokale Betriebe zu ihrem Internetauftritt beraten. Dabei ging es darum, ihr Angebot verständlich zu zeigen und die digitale Kontaktaufnahme zu erleichtern.",
        link: {
            href: "/loesungen/lokaler-onlineauftritt",
            label: "Lokalen Onlineauftritt verbessern",
        },
    },
    {
        title: "Unternehmen mit vielen Arbeitsabläufen",
        work: "Wir haben Unternehmen mit vielen Arbeitsabläufen bei der Prozessoptimierung unterstützt. Ziel war, die Abläufe zu vereinfachen und wiederkehrende Arbeit leichter zu organisieren.",
        link: {
            href: "/leistungen/digitalisierung-ki",
            label: "Prozessoptimierung ansehen",
        },
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
        "Wir setzen die vereinbarten Aufgaben um. Ergebnisse, Rückfragen und Freigaben werden transparent dokumentiert.",
    ],
] as const;
