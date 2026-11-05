/** Read-only runtime checks supplementing the manual editorial review. */
import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import { services } from "../src/content/pages";
import { audiences, audiencePath } from "../src/content/audiences";
import { initialArticles } from "../src/content/articles";
import { legal } from "../src/content/legal";
import { servicePackages } from "../src/content/service-packages";

async function main() {
    const base = "http://localhost:3001";
    const escape = (value: string) =>
        value
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#x27;");
    const paths = [
        ...new Set([
            "/",
            "/leistungen",
            "/preise",
            "/erstgespraech",
            "/kalender",
            "/ablauf",
            "/zielgruppen",
            "/ueber-mich",
            "/kontakt",
            "/blog",
            "/widerruf",
            "/beruflich-neu-starten",
            "/paket-anfragen",
            ...services.map((s) => "/leistungen/" + s.slug),
            ...audiences.map(audiencePath),
            ...initialArticles.map((article) => "/blog/" + article.slug),
            ...Object.keys(legal).map((slug) => "/" + slug),
            ...[
                "anmelden",
                "registrieren",
                "passwort-vergessen",
                "passwort-zuruecksetzen",
                "email-bestaetigen",
                "zustimmung",
                "vertragszustimmung",
                "otp",
                "einrichtung",
            ].map((slug) => "/" + slug),
        ]),
    ];
    const retired =
        /Gemeinsam geht es weiter|Mehr Zeit fürs Wesentliche|Deine Idee verdient einen guten Anfang|Persönlich\. Praktisch\. Digital\.|Gedanken, die|Du musst ihn nicht allein gehen|Struktur schaffen\. Möglichkeiten erkennen|Kreativität mit Struktur verbinden/;
    const report = [];
    for (const path of paths) {
        const response = await fetch(base + path);
        const html = await response.text();
        assert.equal(response.status, 200, path);
        assert.equal((html.match(/<h1[ >]/g) ?? []).length, 1, path + " H1");
        assert.ok(!retired.test(html), path + " retired copy");
        assert.ok(
            !/class="(?:eyebrow|auth-art|service-icon)"/.test(html),
            path + " decorative templates",
        );
        assert.ok(html.includes("Avelsorn"), path + " brand");
        assert.ok(
            !/Lokale Entwicklungsvorschau|Entwicklungsfassung:|Keine Produktionsfreigabe/.test(
                html,
            ),
            path + " developer notes absent",
        );
        const service = services.find((s) => path === "/leistungen/" + s.slug);
        if (service) {
            assert.ok(
                html.includes(escape(service.headline)),
                path + " heading",
            );
            for (const topic of service.topics)
                assert.ok(html.includes(escape(topic)), path + " topic");
        }
        const article = initialArticles.find(
            (article) => path === "/blog/" + article.slug,
        );
        if (article) {
            assert.ok(
                html.includes(escape(article.title)),
                path + " revised title",
            );
            assert.ok(
                html.includes(escape(article.excerpt)),
                path + " revised excerpt",
            );
            assert.ok(
                html.includes("KI-generiertes Motiv"),
                path + " image disclosure",
            );
        }
        if (path === "/preise")
            for (const product of servicePackages)
                assert.ok(html.includes(escape(product.name)), "product names");
        report.push({
            path,
            status: response.status,
            uniqueH1: true,
            retiredCopyAbsent: true,
            revisedArticle: Boolean(article),
            currentService: Boolean(service),
        });
    }
    for (const [alias, target] of [
        ["/terminbuchung", "/erstgespraech"],
        ["/datenschutzerklaerung", "/datenschutz"],
        ["/widerrufsformular", "/widerruf"],
    ]) {
        const response = await fetch(base + alias);
        assert.equal(response.status, 200, alias);
        assert.ok(
            (await response.text()).includes(
                `rel="canonical" href="${base + target}"`,
            ),
            alias + " canonical",
        );
    }
    assert.equal((await fetch(base + "/nicht-vorhanden")).status, 404);
    writeFileSync(
        "tests/output/editorial-final-http.json",
        JSON.stringify({ pages: report, aliases: 3, unknown: 404 }, null, 2),
    );
    console.log(
        JSON.stringify({
            pages: report.length,
            aliases: 3,
            unknown: 404,
            failures: 0,
        }),
    );
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
