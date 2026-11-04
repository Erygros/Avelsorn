export type ServicePackage = {
    key: string;
    name: string;
    fromCents: number;
    audience: string;
    description: string;
    includes: string[];
    excludes: string;
    prepare: string;
    meetings: number;
};

export const servicePackages: ServicePackage[] = [
    {
        key: "creator",
        name: "Creator-Profilcheck",
        fromCents: 19900,
        audience: "Creator mit einem vorhandenen Kanal",
        description:
            "Du möchtest wissen, ob Dein Profil verständlich zeigt, welche Inhalte Du veröffentlichst und für wen sie gedacht sind.",
        includes: [
            "Prüfung eines vorhandenen Kanals",
            "Ein überarbeiteter Profiltext",
            "Zehn Beitragsideen mit kurzer Themenbeschreibung",
            "Ein Auswertungsgespräch und eine gebündelte Korrekturrunde",
        ],
        excludes:
            "Kein Mediakit, keine Videobearbeitung und keine laufende Kanalbetreuung.",
        prepare:
            "Link zu Deinem Kanal, Beschreibung Deiner Inhalte und die Fragen, die Du klären möchtest.",
        meetings: 1,
    },
    {
        key: "neustart",
        name: "Selbstständigkeit vorbereiten",
        fromCents: 24900,
        audience:
            "Menschen vor einer beruflichen Veränderung – auch ohne fertige Geschäftsidee",
        description:
            "Du möchtest beruflich etwas verändern und prüfst, ob eine Selbstständigkeit zu Deinen Fähigkeiten und Deinem Alltag passen könnte. Eine fertige Idee oder Gründungserfahrung brauchst Du dafür nicht.",
        includes: [
            "Deine beruflichen Erfahrungen, Fähigkeiten und verfügbaren Mittel aufnehmen",
            "Bis zu drei mögliche Tätigkeitsfelder mit Voraussetzungen und offenen Fragen vergleichen",
            "Eine erste Angebotsidee für ein ausgewähltes Tätigkeitsfeld beschreiben",
            "Eine schriftliche Aufgabenliste für erste Gespräche mit möglichen Kunden",
            "Ein Auswertungsgespräch und eine gebündelte Korrekturrunde",
        ],
        excludes:
            "Keine Jobvermittlung, Rechts- oder Steuerberatung; kein vollständiger Businessplan und keine Website-Erstellung. Einnahmen oder wirtschaftliche Unabhängigkeit werden nicht zugesagt.",
        prepare:
            "Deine bisherige Tätigkeit, Interessen, Erfahrungen und Fragen zur beruflichen Veränderung. Du kannst auch angeben, was Du künftig vermeiden möchtest.",
        meetings: 1,
    },
    {
        key: "freelancer",
        name: "Freelancer-Auftritt",
        fromCents: 34900,
        audience: "Freelancer mit vorhandenen Arbeiten oder einem Portfolio",
        description:
            "Du möchtest Deine bisherigen Arbeiten und Leistungen für neue Kunden verständlicher darstellen.",
        includes: [
            "Prüfung eines vorhandenen Portfolios",
            "Eine überarbeitete Leistungsbeschreibung",
            "Eine wiederverwendbare Briefingvorlage für Kundenanfragen",
            "Ein Auswertungsgespräch und eine gebündelte Korrekturrunde",
        ],
        excludes:
            "Keine neue Website, keine Bearbeitung sämtlicher Referenzprojekte und keine rechtliche Vertragsprüfung.",
        prepare:
            "Portfolio-Link, freigegebene Arbeitsbeispiele und Beschreibung der gewünschten Aufträge.",
        meetings: 1,
    },
    {
        key: "gruendung",
        name: "Gründungsangebot ausarbeiten",
        fromCents: 39900,
        audience: "Gründer mit einer bereits ausgewählten Geschäftsidee",
        description:
            "Du hast Dich für eine Tätigkeit entschieden und möchtest daraus ein Angebot für erste Kundengespräche machen.",
        includes: [
            "Eine Leistung und ihren enthaltenen Umfang schriftlich ausarbeiten",
            "Eine Zielgruppe und deren typische Anliegen beschreiben",
            "Benötigte Inhalte und Kontaktwege für den Start festlegen",
            "Eine priorisierte Aufgabenliste",
            "Ein Auswertungsgespräch und eine gebündelte Korrekturrunde",
        ],
        excludes:
            "Keine Rechts- oder Steuerberatung, Fördermittelprüfung, Website-Erstellung oder vollständiger Businessplan.",
        prepare:
            "Deine Geschäftsidee, bisherige Überlegungen und vorhandene Rückmeldungen möglicher Kunden.",
        meetings: 1,
    },
    {
        key: "social-media",
        name: "Social-Media-Planung",
        fromCents: 49900,
        audience: "Selbstständige und Unternehmen mit einem bestehenden Kanal",
        description:
            "Du benötigst einen bearbeitbaren Themenplan für ein vorhandenes Angebot und einen ausgewählten Kanal.",
        includes: [
            "Prüfung eines Kanals und Deiner bisherigen Inhalte",
            "Drei wiederverwendbare Beitragsformate",
            "Ein Redaktionsplan mit acht Themen",
            "Ein Auswertungsgespräch und eine gebündelte Korrekturrunde",
        ],
        excludes:
            "Keine laufende Veröffentlichung, Foto-/Videoproduktion, Anzeigenkosten oder Zusage einer bestimmten Reichweite.",
        prepare:
            "Kanal-Link, Leistungsbeschreibung und freigegebene vorhandene Inhalte.",
        meetings: 1,
    },
    {
        key: "digitaler-ablauf",
        name: "Digitalen Ablauf verbessern",
        fromCents: 69900,
        audience:
            "Unternehmen und Selbstständige mit einer wiederkehrenden Aufgabe",
        description:
            "Dein Team überträgt Angaben mehrfach oder fragt fehlenden Unterlagen hinterher. Wir prüfen einen Vorgang und vereinbaren eine technische Verbesserung – bei passender Aufgabe auch mit KI-Unterstützung.",
        includes: [
            "Einen vorhandenen Ablauf, Zuständigkeiten und manuelle Arbeitsschritte aufnehmen",
            "Eine Verbesserung samt benötigten Daten und Prüfschritten planen",
            "Eine im Angebot genau bezeichnete technische Umsetzung",
            "Dokumentation der Bedienung und bekannter Fehlerfälle",
            "Zwei Projektgespräche und eine gebündelte Korrekturrunde",
        ],
        excludes:
            "Keine pauschale Anbindung beliebiger Systeme, eigene Serverinfrastruktur oder unbefristete Wartung. Externe Dienste und Lizenzen werden gesondert vereinbart.",
        prepare:
            "Beschreibung des Ablaufs, beteiligte Programme und Angaben zu vorhandenen Schnittstellen.",
        meetings: 2,
    },
    {
        key: "website",
        name: "Website erstellen",
        fromCents: 129000,
        audience:
            "Selbstständige, Gründer und Unternehmen mit einem beschriebenen Angebot",
        description:
            "Eine Website als Onepager für Dein Angebot, auf Mobilgeräten und am Desktop nutzbar.",
        includes: [
            "Eine Seitenstruktur für einen Onepager",
            "Gestaltung und responsive Umsetzung auf Basis Deiner freigegebenen Inhalte",
            "Ein Kontaktformular",
            "Technische SEO-Grundlagen wie Seitentitel und Beschreibung",
            "Zwei Projektgespräche, Übergabe und eine gebündelte Korrekturrunde",
        ],
        excludes:
            "Keine zusätzlichen Unterseiten, Shops, Kundenportale, Fotoproduktion oder rechtliche Textprüfung. Domain, E-Mail und externe Dienste sind nicht im Preis enthalten; eine Hostinginfrastruktur wird nicht eingerichtet.",
        prepare:
            "Freigegebene Texte, Bilder, Markenunterlagen und die benötigten rechtlichen Unternehmensangaben.",
        meetings: 2,
    },
];
export const findServicePackage = (key: string) =>
    servicePackages.find((p) => p.key === key);
export const packageInquiryPath = (key: string) =>
    `/paket-anfragen?paket=${encodeURIComponent(key)}`;
