import { afterEach, describe, expect, it, vi } from "vitest";
import { searchPages, searchHubs, searchPagePath } from "../src/content/search";
import {
    searchMetadata,
    searchStructuredData,
} from "../src/content/search/structured";
import { publicSitePaths, publicCmsPath } from "../src/content/search/urls";
import {
    serviceSearchLinks,
    serviceQuestions,
} from "../src/content/search/service-links";
import { services } from "../src/content/pages";
import { servicePackages } from "../src/content/service-packages";
import { searchIndexingAllowed } from "../src/server/search-policy";
import robots from "../src/app/robots";
afterEach(() => vi.unstubAllEnvs());
describe("SEO-/GEO-/AEO-Inhaltsarchitektur", () => {
    it("erhält bestehende Leistungen und erschließt 32 eindeutige neue öffentliche Pfade", () => {
        const newPaths = [
            ...searchPages.map(searchPagePath),
            ...searchHubs.map((hub) => hub.path),
        ];
        expect(newPaths).toHaveLength(32);
        expect(new Set(newPaths).size).toBe(newPaths.length);
        const paths = publicSitePaths();
        expect(new Set(paths).size).toBe(paths.length);
        for (const s of services)
            expect(paths).toContain("/leistungen/" + s.slug);
        expect(searchPages.filter((p) => p.kind === "industry")).toHaveLength(
            11,
        );
        expect(searchPages.filter((p) => p.kind === "solution")).toHaveLength(
            8,
        );
        expect(searchPages.filter((p) => p.kind === "guide")).toHaveLength(8);
    });
    it("liefert für jede Seite eigenständige Antworten, Abschnitte und zugängliche Fragen statt gleicher Branchenkopien", () => {
        expect(new Set(searchPages.map((p) => p.answer)).size).toBe(
            searchPages.length,
        );
        const paragraphs = searchPages.flatMap((p) =>
            p.sections.map((section) => section.text),
        );
        expect(new Set(paragraphs).size).toBe(paragraphs.length);
        for (const page of searchPages) {
            expect(page.answer.trim()).not.toBe("");
            expect(page.sections.length).toBeGreaterThanOrEqual(3);
            expect(page.prepare.length).toBeGreaterThanOrEqual(3);
            expect(page.boundary.trim()).not.toBe("");
            expect(page.questions.length).toBeGreaterThanOrEqual(2);
            for (const section of page.sections)
                if (section.table)
                    for (const row of section.table.rows)
                        expect(row.length).toBe(section.table.columns.length);
        }
    });
    it("verlinkt nur existierende Inhalte, Leistungen und zentrale Pakete", () => {
        const paths = new Set([...publicSitePaths(), "/impressum"]);
        for (const page of searchPages) {
            for (const link of page.related)
                expect(
                    paths.has(link),
                    searchPagePath(page) + " → " + link,
                ).toBe(true);
            for (const slug of page.services)
                expect(services.some((s) => s.slug === slug)).toBe(true);
            for (const key of page.packages)
                expect(servicePackages.some((p) => p.key === key)).toBe(true);
        }
        for (const service of services) {
            expect(serviceQuestions[service.slug].length).toBeGreaterThan(0);
            for (const path of serviceSearchLinks[service.slug])
                expect(paths.has(path)).toBe(true);
        }
    });
    it("liefert individuelle Metadaten und ausschließlich umgebungsrichtige Canonicals", () => {
        expect(new Set(searchPages.map((p) => p.title)).size).toBe(
            searchPages.length,
        );
        expect(new Set(searchPages.map((p) => p.description)).size).toBe(
            searchPages.length,
        );
        for (const page of searchPages) {
            const meta = searchMetadata(
                page,
                searchPagePath(page),
                "https://preview.example.test",
            );
            expect(meta.alternates?.canonical).toBe(
                "https://preview.example.test" + searchPagePath(page),
            );
            expect(meta.description).toBe(page.description);
        }
    });
    it("zeichnet sichtbare Dienstleistungen und Artikel ohne erfundene Bewertungen oder Suchfunktionen aus", () => {
        for (const page of searchPages) {
            const json = JSON.stringify(
                searchStructuredData(page, "https://example.test"),
            );
            const graph = JSON.parse(json)["@graph"] as Record<
                string,
                unknown
            >[];
            expect(
                graph.some((node) => node["@type"] === "BreadcrumbList"),
            ).toBe(true);
            expect(graph.some((node) => node["@type"] === "Article")).toBe(
                page.kind === "guide",
            );
            expect(graph.some((node) => node["@type"] === "Service")).toBe(
                ["industry", "solution", "local"].includes(page.kind),
            );
            expect(json).not.toMatch(
                /AggregateRating|Review|SearchAction|FAQPage/,
            );
            expect(json).not.toContain('"datePublished"');
        }
    });
    it("nimmt keine geschützten, umgeleiteten oder systemseitigen CMS-Pfade in die Sitemap auf", () => {
        for (const path of [
            "admin/kunden",
            "konto",
            "api/files",
            "kalender/gast",
            "branchen/kioske",
            "wissen/abc",
            "zielgruppen/unternehmen",
            "fragen",
            "terminbuchung",
            "gruendung",
            "widerruf",
            "../privat",
        ])
            expect(publicCmsPath(path), path).toBeNull();
        expect(publicCmsPath("eigene-redaktion")).toBe("/eigene-redaktion");
        expect(publicCmsPath("datenschutz")).toBe("/datenschutz");
    });
    it("hält jede Vorschau selbst bei einem versehentlich gesetzten Veröffentlichungsflag aus dem Index", () => {
        vi.stubEnv("PRODUCTION_APPROVED", "true");
        vi.stubEnv("PLATFORM_ENV", "preview");
        vi.stubEnv("VERCEL_ENV", "preview");
        expect(searchIndexingAllowed()).toBe(false);
        expect(robots().rules).toEqual({ userAgent: "*", disallow: "/" });
        expect(robots().sitemap).toBeUndefined();
        vi.stubEnv("PLATFORM_ENV", "production");
        vi.stubEnv("VERCEL_ENV", "production");
        expect(searchIndexingAllowed()).toBe(true);
    });
    it("erlaubt öffentliche CMS-Bilder ohne private APIs für Suchcrawler freizugeben", () => {
        vi.stubEnv("PRODUCTION_APPROVED", "true");
        vi.stubEnv("PLATFORM_ENV", "production");
        vi.stubEnv("VERCEL_ENV", "production");
        const rule = robots().rules as {
            userAgent: string;
            allow: string[];
            disallow: string[];
        };
        expect(rule.userAgent).toBe("*");
        expect(rule.allow).toContain("/api/media/");
        expect(rule.disallow).toContain("/api");
        expect(rule.disallow).toContain("/konto");
        expect(rule.allow).not.toContain("/api/files");
    });
});
