import { describe, it, expect, afterEach, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Prices } from "../src/components/prices";
import { servicePackages } from "../src/content/service-packages";
import { serviceGroups, workExamples } from "../src/content/service-groups";
import { publicSitePaths } from "../src/content/search/urls";
import { serviceDetails } from "../src/content/service-details";
import { services } from "../src/content/pages";
import { publicNavigation } from "../src/content/navigation";
import { checkOrigin } from "../src/server/security";
import { baseUrl } from "../src/server/config";

afterEach(() => vi.unstubAllEnvs());
describe("Öffentliche Website", () => {
    it("ordnet jede Kernleistung genau einer Kategorie zu und erhält alle bisherigen Detailseiten", () => {
        const slugs = serviceGroups.flatMap((group) => group.slugs);
        expect(slugs).toHaveLength(6);
        expect(new Set(slugs).size).toBe(6);
        expect(slugs).not.toContain("trading-etf");
        expect(services.map((s) => s.slug).sort()).toEqual(
            [...slugs, "trading-etf"].sort(),
        );
        for (const service of services) {
            expect(
                serviceDetails[service.slug].audience.length,
            ).toBeGreaterThan(30);
            expect(
                serviceDetails[service.slug].preparation.length,
            ).toBeGreaterThan(30);
            for (const key of serviceDetails[service.slug].packages)
                expect(servicePackages.some((p) => p.key === key)).toBe(true);
        }
        for (const example of workExamples)
            if (example.link)
                expect(publicSitePaths()).toContain(example.link.href);
    });
    it("zeigt zentrale Preise, Umfang und Ergebnis ohne Aufklappen und erhält die Anfragelinks", () => {
        expect(servicePackages.map((p) => p.fromCents)).toEqual([
            19900, 24900, 34900, 39900, 49900, 69900, 129000,
        ]);
        const html = renderToStaticMarkup(createElement(Prices));
        for (const p of servicePackages) {
            const article = html
                .split(`id="${p.key}"`)[1]
                .split("</article>")[0];
            const visible = article.split("<details")[0];
            expect(visible).toContain(p.result.replace(/&/g, "&amp;"));
            for (const item of p.includes.slice(0, 3))
                expect(visible).toContain(item.replace(/&/g, "&amp;"));
            expect(article).toContain(`/paket-anfragen?paket=${p.key}`);
            expect(article).toContain("Leistungsumfang ansehen");
        }
    });
    it("hält die gewünschte Navigation flach und eindeutig", () => {
        expect(publicNavigation.map((entry) => entry[1])).toEqual([
            "Leistungen",
            "Für wen",
            "Preise",
            "Über Avelsorn",
            "Blog",
        ]);
        expect(new Set(publicNavigation.map((entry) => entry[0])).size).toBe(5);
    });
    it("erlaubt Vorschau-Origins nur im tatsächlichen Preview-Kontext", () => {
        vi.stubEnv("PUBLIC_BASE_URL", "https://www.avelsorn.de");
        vi.stubEnv("PLATFORM_ENV", "production");
        vi.stubEnv("VERCEL_ENV", "production");
        vi.stubEnv("VERCEL_BRANCH_URL", "preview.example.test");
        vi.stubEnv("VERCEL_URL", "deployment.example.test");
        const request = (origin: string) =>
            new Request("https://preview.example.test/api/guest-bookings", {
                method: "POST",
                headers: { Origin: origin, "Content-Type": "application/json" },
            });
        expect(() =>
            checkOrigin(request("https://preview.example.test")),
        ).toThrow();
        vi.stubEnv("PLATFORM_ENV", "preview");
        vi.stubEnv("VERCEL_ENV", "preview");
        expect(() =>
            checkOrigin(request("https://preview.example.test")),
        ).not.toThrow();
        expect(() =>
            checkOrigin(request("https://deployment.example.test")),
        ).not.toThrow();
        expect(() =>
            checkOrigin(request("https://foreign.example.test")),
        ).toThrow();
        expect(baseUrl()).toBe("https://preview.example.test");
    });
});
