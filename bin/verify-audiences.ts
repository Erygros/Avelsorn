import { writeFileSync } from "node:fs";
import assert from "node:assert/strict";
import { audiences, audiencePath } from "../src/content/audiences";

async function main() {
    const origin = "http://localhost:3001";
    const report = [];
    const titles = new Set<string>();
    const descriptions = new Set<string>();
    const home = await (await fetch(origin)).text();
    const overview = await (await fetch(origin + "/zielgruppen")).text();
    for (const audience of audiences) {
        const path = audiencePath(audience);
        const response = await fetch(origin + path);
        const html = await response.text();
        assert.equal(response.status, 200, path);
        assert.equal((html.match(/<h1[ >]/g) ?? []).length, 1, path + " H1");
        const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
        const description = html.match(
            /<meta name="description" content="([^"]+)"/,
        )?.[1];
        assert.ok(title?.includes(audience.title), path + " title");
        assert.equal(description, audience.description, path + " description");
        assert.ok(!titles.has(title!), "Repeated title");
        assert.ok(!descriptions.has(description!), "Repeated description");
        titles.add(title!);
        descriptions.add(description!);
        assert.ok(
            html.includes(`rel="canonical" href="${origin + path}"`),
            path + " canonical",
        );
        assert.ok(
            html.includes('content="noindex, nofollow"'),
            "Local indexing guard",
        );
        assert.ok(home.includes(`href="${path}"`), path + " homepage link");
        assert.ok(overview.includes(`href="${path}"`), path + " overview link");
        const ld = html.match(
            /<script type="application\/ld\+json">(.*?)<\/script>/,
        )?.[1];
        const breadcrumb = JSON.parse(ld!);
        assert.equal(breadcrumb["@type"], "BreadcrumbList");
        assert.equal(breadcrumb.itemListElement.at(-1).item, origin + path);
        const hrefs = [
            ...new Set(
                Array.from(html.matchAll(/href="(\/[^"?#]*)"/g), (m) => m[1]),
            ),
        ].filter(
            (href) =>
                href.startsWith("/leistungen/") ||
                href.startsWith("/zielgruppen/") ||
                href === "/erstgespraech",
        );
        for (const href of hrefs)
            assert.equal((await fetch(origin + href)).status, 200, href);
        report.push({
            path,
            status: response.status,
            title,
            description,
            canonical: origin + path,
            uniqueH1: true,
            homepageLink: true,
            overviewLink: true,
            breadcrumb: true,
            checkedInternalLinks: hrefs.length,
            localNoindex: true,
        });
    }
    const unknown = await fetch(origin + "/zielgruppen/nicht-vorhanden");
    assert.equal(unknown.status, 404, "Unknown audience must be 404");
    writeFileSync(
        "tests/output/audiences-http.json",
        JSON.stringify(
            { pages: report, unknownStatus: unknown.status },
            null,
            2,
        ),
    );
    console.log(
        `${report.length} Zielgruppenseiten samt Metadaten und internen Links geprüft; unbekannte Zielgruppe: 404.`,
    );
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
