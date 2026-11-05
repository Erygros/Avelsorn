export const serviceSearchLinks: Record<string, string[]> = {
    unternehmensberatung: [
        "/wissen/prozessaufnahme-vorlage",
        "/loesungen/anfrageprozesse",
        "/branchen/hausverwaltungen",
    ],
    gruendung: [
        "/wissen/geschaeftsidee-testen",
        "/beruflich-neu-starten",
        "/wissen/website-briefing",
    ],
    "social-media": [
        "/wissen/redaktionsplan-vorlage",
        "/loesungen/lokaler-onlineauftritt",
        "/branchen/influencer",
    ],
    creator: [
        "/loesungen/kooperationsanfragen",
        "/branchen/streamer",
        "/branchen/influencer",
    ],
    "websites-software": [
        "/wissen/website-oder-webanwendung",
        "/loesungen/website-relaunch",
        "/loesungen/kundenportale",
    ],
    "digitalisierung-ki": [
        "/wissen/automatisierung-oder-ki",
        "/wissen/schnittstellen-pruefen",
        "/loesungen/anfragen-vorsortieren",
    ],
    "trading-etf": ["/branchen/trader", "/wissen/schnittstellen-pruefen"],
};
export const serviceQuestions: Record<
    string,
    { question: string; answer: string }[]
> = {
    unternehmensberatung: [
        {
            question: "Beginnen wir mit dem gesamten Unternehmen?",
            answer: "Für einen prüfbaren Einstieg grenzen wir meist einen konkreten Vorgang ab. Erst wenn dessen Schritte und Zuständigkeiten klar sind, lässt sich eine passende Änderung planen.",
        },
    ],
    gruendung: [
        {
            question: "Kann ich auch ohne ausgewählte Geschäftsidee beginnen?",
            answer: "Ja. Für die erste Orientierung gibt es das Paket zur Vorbereitung einer Selbstständigkeit. Ein bereits ausgewähltes Angebot wird in einem gesonderten Gründungspaket ausgearbeitet.",
        },
    ],
    "social-media": [
        {
            question: "Werden meine Beiträge auch veröffentlicht?",
            answer: "Das veröffentlichte Planungspaket umfasst definierte Formate und Themen. Laufende Veröffentlichung, Produktion und Betreuung sind nicht automatisch enthalten.",
        },
    ],
    creator: [
        {
            question: "Erhalte ich dadurch eine Kooperation?",
            answer: "Eine Kooperation oder bestimmte Einnahmen werden nicht zugesagt. Die Arbeit betrifft Deinen Auftritt, vereinbarte Unterlagen und organisatorische Abläufe.",
        },
    ],
    "websites-software": [
        {
            question:
                "Ist eine individuelle Webanwendung im Websitepaket enthalten?",
            answer: "Nein. Das Websitepaket beschreibt einen Onepager-Basisumfang. Ein Kundenportal, Shop oder eine andere individuelle Anwendung benötigt eine eigene Anforderungsaufnahme und ein gesondertes Angebot.",
        },
    ],
    "digitalisierung-ki": [
        {
            question: "Braucht die Verbesserung zwingend KI?",
            answer: "Nein. Verständliche Eingaben, feste Regeln oder eine bessere Übergabe können ausreichen. KI wird nur für passende Teilaufgaben mit geklärten Daten und Prüfschritten untersucht.",
        },
    ],
    "trading-etf": [
        {
            question:
                "Erhalte ich persönliche Kauf- oder Verkaufsempfehlungen?",
            answer: "Nein. Dieser Informationsbereich behandelt ausschließlich allgemeine Grundlagen. Individuelle Anlageberatung, Handelssignale und eine Portfolioverwaltung werden nicht angeboten.",
        },
    ],
};
export const articleSearchLinks = new Map<string, readonly string[]>([
    [
        "prozesse-sinnvoll-automatisieren",
        ["/wissen/prozessaufnahme-vorlage", "/wissen/automatisierung-oder-ki"],
    ],
    [
        "website-klarer-naechster-schritt",
        ["/wissen/website-briefing", "/loesungen/website-relaunch"],
    ],
    [
        "social-media-strategie-alltag",
        ["/wissen/redaktionsplan-vorlage", "/loesungen/kooperationsanfragen"],
    ],
    [
        "positionierung-fuer-deine-gruendung",
        ["/wissen/geschaeftsidee-testen", "/wissen/website-kosten"],
    ],
    [
        "digitale-selbststaendigkeit-erster-schritt",
        ["/wissen/geschaeftsidee-testen", "/wissen/website-oder-webanwendung"],
    ],
]);
