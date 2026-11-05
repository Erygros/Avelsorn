export type SearchSection = {
    title: string;
    text: string;
    items?: string[];
    table?: { columns: string[]; rows: string[][] };
};
export type SearchPage = {
    kind: "industry" | "solution" | "guide" | "local" | "questions";
    slug: string;
    title: string;
    description: string;
    heading: string;
    answer: string;
    sections: SearchSection[];
    prepare: string[];
    boundary: string;
    questions: { question: string; answer: string }[];
    services: string[];
    packages: string[];
    related: string[];
    updatedOn: string;
};
export const contentDate = "2026-11-05";
export const searchHubs = [
    {
        path: "/branchen",
        name: "Branchen",
        title: "Digitale Lösungen für Deinen Betrieb",
        description:
            "Konkrete Aufgaben für Kanzleien, Hausverwaltungen, Gastronomie, Handel und digitale Selbstständige. Finde den Einstieg passend zu Deinem Betrieb.",
        kinds: ["industry"],
    },
    {
        path: "/loesungen",
        name: "Digitale Lösungen",
        title: "Welche Aufgabe möchtest Du vereinfachen?",
        description:
            "Anfrageprozesse, Unterlagen, Freigaben, Kundenportale und individuelle Webanwendungen: So kann eine klar abgegrenzte technische Umsetzung aussehen.",
        kinds: ["solution"],
    },
    {
        path: "/wissen",
        name: "Wissen und Vorlagen",
        title: "Dein Vorhaben genauer vorbereiten",
        description:
            "Praktische Checklisten, Vorlagen und Entscheidungshilfen für Website, Selbstständigkeit und digitale Abläufe. Ohne Anmeldung direkt nutzbar.",
        kinds: ["guide"],
    },
] as const;
export const sectionFor = (kind: SearchPage["kind"]) =>
    kind === "industry"
        ? "/branchen"
        : kind === "solution"
          ? "/loesungen"
          : kind === "guide"
            ? "/wissen"
            : "";
export const searchPagePath = (page: SearchPage) =>
    sectionFor(page.kind) + "/" + page.slug;
