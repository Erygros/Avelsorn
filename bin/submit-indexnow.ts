/** Dry run by default. Execute --submit only after an approved production release. */
import { loadEnvConfig } from "@next/env";
import { writeFileSync, mkdirSync } from "node:fs";
import { publicSitePaths } from "../src/content/search/urls";
import { indexNowPayload, sendIndexNow } from "../src/server/indexnow";
async function main() {
    loadEnvConfig(process.cwd());
    const origin = "https://www.avelsorn.de";
    const submit = process.argv.includes("--submit");
    const key = process.env.INDEXNOW_KEY;
    const sitemapResponse = await fetch(origin + "/sitemap.xml", {
        signal: AbortSignal.timeout(30000),
    });
    if (!sitemapResponse.ok)
        throw Error("Produktive Sitemap nicht erreichbar.");
    const xml = await sitemapResponse.text();
    const published = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
        m[1].replace(/&amp;/g, "&"),
    );
    const paths = new Set(published.map((url) => new URL(url).pathname));
    const missing = publicSitePaths().filter((path) => !paths.has(path));
    if (!submit) {
        console.log(
            JSON.stringify({
                submitted: false,
                publishedUrls: published.length,
                newCatalogNotYetInSitemap: missing.length,
                keyConfigured: Boolean(key),
                note: "Nur Planung. Kein Indexierungsaufruf; --submit erst nach ausdrücklicher Veröffentlichungsfreigabe.",
            }),
        );
        return;
    }
    if (
        process.env.PLATFORM_ENV === "preview" ||
        process.env.VERCEL_ENV === "preview"
    )
        throw Error("Keine Übermittlung aus einer Preview.");
    if (!key)
        throw Error(
            "INDEXNOW_KEY fehlt in der ignorierten Serverkonfiguration.",
        );
    if (missing.length)
        throw Error(
            "Der vollständige freigegebene Inhaltsstand ist noch nicht in der produktiven Sitemap.",
        );
    const home = await fetch(origin, { signal: AbortSignal.timeout(30000) });
    const html = await home.text();
    if (
        !home.ok ||
        new URL(home.url).origin !== origin ||
        /noindex/i.test(home.headers.get("x-robots-tag") ?? "") ||
        /<meta[^>]*name="robots"[^>]*content="[^"]*noindex/i.test(html)
    )
        throw Error("Die Produktivseite ist nicht zur Indexierung verfügbar.");
    const payload = indexNowPayload(origin, key, published);
    const verification = await fetch(payload.keyLocation, {
        signal: AbortSignal.timeout(30000),
    });
    if (!verification.ok || (await verification.text()).trim() !== key)
        throw Error(
            "Die veröffentlichte IndexNow-Verifizierungsdatei fehlt oder passt nicht.",
        );
    const result = await sendIndexNow(payload);
    mkdirSync("tests/output", { recursive: true });
    writeFileSync(
        "tests/output/indexnow-receipt.json",
        JSON.stringify(
            {
                checkedAt: new Date().toISOString(),
                host: payload.host,
                ...result,
            },
            null,
            2,
        ),
    );
    console.log(JSON.stringify(result));
}
main().catch((error) => {
    console.error(
        error instanceof Error ? error.message : "IndexNow fehlgeschlagen",
    );
    process.exitCode = 1;
});
