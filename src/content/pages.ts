export type Service = {
    slug: string;
    title: string;
    short: string;
    headline: string;
    description: string;
    topics: string[];
    outcome: string;
};
export const services: Service[] = [
    {
        slug: "unternehmensberatung",
        title: "Unternehmensentwicklung",
        short: "Zuständigkeiten klären, Übergaben vereinfachen und doppelte Arbeit im Betrieb reduzieren.",
        headline: "Abläufe im Unternehmen prüfen und überarbeiten",
        description:
            "Wenn Anfragen liegen bleiben oder Informationen mehrfach erfasst werden, sehen wir uns den betroffenen Ablauf gemeinsam mit Deinem Team an. Wer übernimmt welche Aufgabe? Wo fehlen Freigaben oder Unterlagen? Wir überarbeiten Zuständigkeiten und Übergaben und prüfen, welche Arbeitsschritte sich mit vorhandenen Werkzeugen vereinfachen lassen.",
        topics: [
            "Zuständigkeiten und Übergaben in einem Arbeitsablauf festhalten",
            "Doppelte Dateneingaben und unnötige Rückfragen aufspüren",
            "Vorlagen und Freigaben für wiederkehrende Vorgänge einrichten",
            "Bearbeitungszeiten vor und nach einer Änderung vergleichen",
        ],
        outcome:
            "Ein Auftrag kann einen überarbeiteten Anfrageprozess mit festen Zuständigkeiten, Vorlagen und dokumentierten Übergaben umfassen. Wir halten den Ausgangsablauf fest und prüfen nach einem Testlauf, ob Übertragungen, Rückfragen und Bearbeitungszeit zurückgehen. Technische Automatisierungen können wir als abgegrenzte Umsetzung ergänzen.",
    },
    {
        slug: "gruendung",
        title: "Gründung & Selbstständigkeit",
        short: "Angebot beschreiben, Zielgruppe eingrenzen und den ersten Auftritt vorbereiten.",
        headline: "Die eigene Selbstständigkeit vorbereiten",
        description:
            "Wir besprechen, welche Leistung Du anbieten möchtest, wer dafür infrage kommt und welche Erfahrungen Du mitbringst. Anschließend halten wir fest, was Du noch prüfen musst und welche Unterlagen oder Webseiten Du für erste Kundengespräche brauchst.",
        topics: [
            "Fähigkeiten und Erfahrungen mit möglichen Tätigkeiten abgleichen",
            "Digitale Dienstleistungen und Produkte als Geschäftsmodelle vergleichen",
            "Leistung, Zielgruppe und Angebotsumfang schriftlich beschreiben",
            "Aufgaben für den Start und die Kundengewinnung planen",
        ],
        outcome:
            "Mögliche Arbeitsergebnisse sind eine erste Leistungsbeschreibung, eine Liste offener Fragen und eine Planung für Deinen Webauftritt. Steuerliche und rechtliche Einzelfragen klärst Du mit entsprechend qualifizierten Fachpersonen.",
    },
    {
        slug: "social-media",
        title: "Social Media",
        short: "Profil, Themen und Veröffentlichungstermine für Deine Kanäle festlegen.",
        headline: "Social-Media-Profile und Veröffentlichungen planen",
        description:
            "Wir prüfen, welche Inhalte Du veröffentlichen möchtest, wen Du damit ansprichst und wie viel Zeit Du dafür hast. Wir unterstützen Dich bei Profiltexten, Themenauswahl und einem Redaktionsplan, den Du regelmäßig pflegen kannst.",
        topics: [
            "Profiltexte, Kontaktangaben und Verlinkungen überarbeiten",
            "Themen, Beitragsformate und Veröffentlichungstermine planen",
            "Leistungsangebote in Beiträgen verständlich erklären",
            "Rückfragen und vorhandene Plattformdaten für die Themenplanung auswerten",
        ],
        outcome:
            "Wir können zum Beispiel Profiltexte, wiederkehrende Beitragsformate und einen Veröffentlichungsplan erarbeiten. Welche Beiträge Menschen tatsächlich erreichen, hängt auch von Plattform und Nachfrage ab; eine bestimmte Reichweite ist nicht Bestandteil des Auftrags.",
    },
    {
        slug: "creator",
        title: "Creator & Influencer",
        short: "Mediakit, Kooperationsanfragen und die Organisation Deiner Contentarbeit.",
        headline: "Unterlagen und Abläufe für Creator",
        description:
            "Du möchtest Deine Formate gegenüber möglichen Kooperationspartnern vorstellen oder Anfragen besser bearbeiten. Wir sammeln die dafür benötigten Angaben und entscheiden, wie Mediakit, eigene Website und Anfrageprozess zusammenpassen.",
        topics: [
            "Themen und Zielgruppen Deiner Kanäle beschreiben",
            "Mediakit und Angaben für Kooperationsanfragen zusammenstellen",
            "Einnahmeformen wie Kooperationen und digitale Produkte vergleichen",
            "Creator-Websites und digitale Werkzeuge",
        ],
        outcome:
            "Ein vereinbarter Auftrag kann ein Mediakit aus Deinen belegbaren Kanalangaben oder ein Kooperationsformular auf Deiner Website sein. Eine Vermittlung von Kooperationen oder Zusage von Einnahmen gehört nicht dazu.",
    },
    {
        slug: "websites-software",
        title: "Websites & Software",
        short: "Webseiten, Kontaktformulare und individuelle Webanwendungen entwickeln.",
        headline: "Websites und Webanwendungen erstellen",
        description:
            "Wir erstellen Websites und Webanwendungen nach vereinbartem Umfang. Vor der Entwicklung klären wir Seitenstruktur, Inhalte, Funktionen und benötigte Zugänge. Bei einer bestehenden Website prüfen wir, welche Teile weiterverwendet werden können.",
        topics: [
            "Websites und Landingpages",
            "Individuelle Webanwendungen und Kundenportale",
            "Digitale Formulare und Automatisierungen",
            "Technische Einrichtung und Weiterentwicklung",
        ],
        outcome:
            "Wir legen fest, welche Seiten und Funktionen wir liefern und wie Du sie prüfst. Dazu können ein Kontaktformular, ein geschützter Bereich oder die Überarbeitung vorhandener Seiten gehören. Externe Kosten werden vorab besprochen und entstehen nur mit Deiner Zustimmung.",
    },
    {
        slug: "digitalisierung-ki",
        title: "Prozessoptimierung & Automatisierung",
        short: "Formulare, Daten und vorhandene Programme verbinden; KI bei geeigneten Teilaufgaben einbinden.",
        headline: "Wiederkehrende Handgriffe im Betrieb automatisieren",
        description:
            "Dein Team überträgt dieselben Angaben zwischen Programmen, erinnert an fehlende Unterlagen oder sortiert wiederkehrende Anfragen. Wir prüfen den Ablauf und die vorhandenen Schnittstellen. Anschließend richten wir die vereinbarte Automatisierung ein und testen sie mit typischen Fällen und Fehlern. KI kann etwa Texte vorsortieren oder Antwortentwürfe vorbereiten, wenn Daten und Prüfschritte dafür geeignet sind.",
        topics: [
            "Anfragen aus einem Formular an das zuständige Team übergeben",
            "Daten zwischen vorhandenen Werkzeugen übertragen",
            "Erinnerungen und Freigaben für fehlende Unterlagen einrichten",
            "KI-gestützte Sortierung oder Textentwürfe mit menschlicher Freigabe testen",
            "Manuelle Arbeitsschritte und Bearbeitungszeit vor und nach dem Testlauf vergleichen",
        ],
        outcome:
            "Du erhältst den vereinbarten Ablauf samt Bedienhinweisen, Prüfschritten und einem Vorgehen bei Fehlern. Welche Arbeit entfällt und wie viel Zeit das Team spart, prüfen wir am tatsächlichen Vorgang. Verwendete Daten, Zugriffsrechte, externe Dienste und laufende Kosten stimmen wir vor der Umsetzung ab.",
    },
    {
        slug: "trading-etf",
        title: "Trading- & ETF-Grundlagen",
        short: "Funktionsweise, Kosten und Risiken von ETFs und Trading besprechen.",
        headline: "ETF- und Trading-Grundlagen verstehen",
        description:
            "Hier geht es ausschließlich um allgemeine Wissensvermittlung: Wie funktionieren Märkte, ETFs und technische Handelsabläufe? Welche Kosten und Risiken solltest Du grundsätzlich verstehen?",
        topics: [
            "Grundlagen von ETFs und Trading",
            "Marktmechanismen und technische Funktionsweisen",
            "Kosten, Schwankungen und Verlustrisiken",
            "Allgemeine Finanzbildung",
        ],
        outcome:
            "Keine individuelle Anlageberatung, keine persönlichen Kauf- oder Verkaufsempfehlungen, keine Portfolioverwaltung und keine Erfolgsgarantien. Es werden keine persönlichen Anlageentscheidungen für Dich getroffen.",
    },
];
export const onboardingFields = [
    ["situation", "Deine aktuelle berufliche Situation", true],
    ["industry", "Deine gewünschte Branche", true],
    ["experience", "Welche Erfahrungen bringst Du mit?", false],
    ["strengths", "Deine persönlichen Stärken", true],
    ["technical", "Deine technischen Fähigkeiten", false],
    ["goals", "Was möchtest Du erreichen?", true],
    ["challenges", "Was fordert Dich gerade heraus?", true],
    ["time", "Wie viel Zeit steht Dir zur Verfügung?", true],
    ["support", "Welche Unterstützung wünschst Du Dir?", true],
    ["presence", "Deine Website oder Social-Media-Präsenz", false],
    ["notes", "Was möchtest Du noch mitteilen?", false],
] as const;
export const projectStatuses: Record<string, string> = {
    requested: "Angefragt",
    planned: "Geplant",
    in_progress: "In Bearbeitung",
    waiting: "Wartet auf Kunden",
    approval: "Freigabe erforderlich",
    completed: "Abgeschlossen",
    archived: "Archiviert",
};
export const statuses: Record<string, string> = {
    ...projectStatuses,
    open: "Offen",
    partial: "Teilweise bezahlt",
    paid: "Bezahlt",
    overdue: "Überfällig",
    cancelled: "Storniert",
    refunded: "Erstattet",
    reserved: "Reserviert",
    confirmed: "Bestätigt",
    expired: "Abgelaufen",
    active: "Aktiv",
    draft: "Entwurf",
    sent: "Versendet",
    issued: "Ausgestellt",
    accepted: "Angenommen",
    declined: "Abgelehnt",
    pending: "Ausstehend",
    approved: "Freigegeben",
    changes: "Änderung angefordert",
    running: "Läuft",
    paused: "Pausiert",
    stopped: "Beendet",
    queued: "In Warteschlange",
    smtp_accepted: "An SMTP übergeben",
    failed: "Fehlgeschlagen",
    done: "Erledigt",
    received: "Eingegangen",
};
