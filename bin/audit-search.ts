/** Read-only crawl. No publication, indexing submission, tracking or database write. */
import { mkdirSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { publicSitePaths } from "../src/content/search/urls";
import { searchPages, searchHubs, searchPagePath } from "../src/content/search";

const decode = (value: string) =>
    value.replace(
        /&(#x[0-9a-f]+|#\d+|amp|quot|apos|lt|gt|nbsp);/gi,
        (_match, entity: string) => {
            const names: Record<string, string> = {
                amp: "&",
                quot: '"',
                apos: "'",
                lt: "<",
                gt: ">",
                nbsp: " ",
            };
            if (entity.startsWith("#")) {
                const number =
                    entity[1].toLowerCase() === "x"
                        ? parseInt(entity.slice(2), 16)
                        : Number(entity.slice(1));
                return number >= 0 && number <= 0x10ffff
                    ? String.fromCodePoint(number)
                    : "";
            }
            return names[entity.toLowerCase()];
        },
    );
const text = (value: string) =>
    decode(
        value
            .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
            .replace(/<[^>]*>/g, " ")
            .replace(/\s+/g, " ")
            .trim(),
    );
function attributes(tag: string) {
    return Object.fromEntries(
        [...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map((item) => [
            item[1],
            decode(item[2]),
        ]),
    );
}
type Finding = {
    severity: "P0" | "P1" | "P2";
    path: string;
    code: string;
    detail: string;
};
type Page = {
    path: string;
    status: number;
    finalUrl: string;
    title: string;
    description: string;
    canonical: string;
    h1: string[];
    noindex: boolean;
    words: number;
    structuredTypes: string[];
    links: string[];
    bodyHash: string;
    durationMs: number;
};
async function main() {
    const option =
        process.argv.find((value) => value.startsWith("--base="))?.slice(7) ??
        "https://www.avelsorn.de";
    const base = new URL(option);
    if (
        !["http:", "https:"].includes(base.protocol) ||
        base.username ||
        base.password
    )
        throw Error("Ungültige Auditadresse.");
    const catalog = process.argv.includes("--catalog");
    const expectIndexable = process.argv.includes("--expect-indexable");
    const headers: Record<string, string> = {
        "User-Agent": "AvelsornReadOnlySeoAudit/1.0",
    };
    if (process.env.SEO_AUDIT_OIDC_TOKEN)
        headers["x-vercel-trusted-oidc-idp-token"] =
            process.env.SEO_AUDIT_OIDC_TOKEN;
    const findings: Finding[] = [],
        records: Page[] = [],
        visited = new Set<string>();
    const pending = new Set<string>([
        "/",
        ...(catalog ? publicSitePaths() : []),
    ]);
    const privatePath =
        /^\/(admin|konto|api|einrichtung|entwicklung|otp|anmelden|registrieren|passwort[^/]*|email-bestaetigen|zustimmung|vertragszustimmung)(\/|$)/;
    const fetchPage = (path: string) =>
        fetch(new URL(path, base), {
            headers,
            signal: AbortSignal.timeout(30000),
        });
    const robotsResponse = await fetchPage("/robots.txt"),
        robots = await robotsResponse.text();
    const sitemapResponse = await fetchPage("/sitemap.xml"),
        sitemap = await sitemapResponse.text();
    for (const match of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
        const url = new URL(decode(match[1]));
        if (url.origin === base.origin) pending.add(url.pathname);
    }
    if (expectIndexable && /^Disallow:\s*\/\s*$/m.test(robots))
        findings.push({
            severity: "P0",
            path: "/robots.txt",
            code: "public-crawl-blocked",
            detail: "Die geprüfte Veröffentlichungsumgebung sperrt alle Crawler.",
        });
    while (pending.size && visited.size < 300) {
        const path = pending.values().next().value!;
        pending.delete(path);
        if (visited.has(path) || privatePath.test(path)) continue;
        visited.add(path);
        const started = performance.now(),
            response = await fetchPage(path),
            html = await response.text();
        const meta = [...html.matchAll(/<meta\b[^>]*>/g)].map((item) =>
            attributes(item[0]),
        );
        const description =
            meta.find((item) => item.name === "description")?.content ?? "";
        const canonical =
            [...html.matchAll(/<link\b[^>]*>/g)]
                .map((item) => attributes(item[0]))
                .find((item) => item.rel === "canonical")?.href ?? "";
        const title = text(html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "");
        const h1 = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map(
            (item) => text(item[1]),
        );
        const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? "";
        const noindex = /noindex/i.test(
            [
                response.headers.get("x-robots-tag"),
                ...meta
                    .filter((item) => item.name === "robots")
                    .map((item) => item.content),
            ].join(" "),
        );
        const structuredTypes: string[] = [];
        function types(value: unknown) {
            if (!value || typeof value !== "object") return;
            if (Array.isArray(value)) {
                value.forEach(types);
                return;
            }
            for (const [key, item] of Object.entries(value)) {
                if (key === "@type")
                    structuredTypes.push(
                        ...(Array.isArray(item) ? item : [item]).filter(
                            (v): v is string => typeof v === "string",
                        ),
                    );
                else types(item);
            }
        }
        for (const match of html.matchAll(
            /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
        )) {
            try {
                types(JSON.parse(match[1]));
            } catch {
                findings.push({
                    severity: "P1",
                    path,
                    code: "invalid-jsonld",
                    detail: "Strukturierte Daten sind nicht als JSON lesbar.",
                });
            }
        }
        const links: string[] = [];
        for (const match of html.matchAll(/<a\b[^>]*href="([^"]*)"/g)) {
            let url: URL;
            try {
                url = new URL(decode(match[1]), response.url);
            } catch {
                continue;
            }
            if (url.origin !== base.origin || privatePath.test(url.pathname))
                continue;
            links.push(url.pathname);
            if (
                !/\.[a-z0-9]{2,5}$/i.test(url.pathname) &&
                !url.pathname.startsWith("/kalender/")
            )
                pending.add(url.pathname);
        }
        const body = text(main);
        const record: Page = {
            path,
            status: response.status,
            finalUrl: response.url,
            title,
            description,
            canonical,
            h1,
            noindex,
            words: body.split(/\s+/).filter(Boolean).length,
            structuredTypes: [...new Set(structuredTypes)],
            links: [...new Set(links)],
            bodyHash: createHash("sha256").update(body).digest("hex"),
            durationMs: Math.round(performance.now() - started),
        };
        records.push(record);
        if (new URL(response.url).origin !== base.origin)
            findings.push({
                severity: "P0",
                path,
                code: "unexpected-origin",
                detail: "Die Antwort stammt nicht aus der geprüften Umgebung.",
            });
        if (response.status !== 200)
            findings.push({
                severity: "P0",
                path,
                code: "http-error",
                detail: "HTTP " + response.status,
            });
        if (h1.length !== 1)
            findings.push({
                severity: "P1",
                path,
                code: "h1-count",
                detail: "Anzahl H1: " + h1.length,
            });
        if (!title || !description || !canonical)
            findings.push({
                severity: "P1",
                path,
                code: "metadata-missing",
                detail: "Titel, Beschreibung oder Canonical fehlen.",
            });
        if (expectIndexable && noindex && !path.startsWith("/kalender/"))
            findings.push({
                severity: "P1",
                path,
                code: "public-noindex",
                detail: "Öffentliche Zielseite ist als noindex markiert.",
            });
        if (canonical && new URL(canonical).origin !== base.origin)
            findings.push({
                severity: "P1",
                path,
                code: "canonical-origin",
                detail: "Canonical liegt außerhalb der geprüften Umgebung.",
            });
        if (visited.size % 20 === 0)
            console.log(visited.size + " Seiten geprüft.");
    }
    for (const field of ["title", "description"] as const) {
        const groups = new Map<string, string[]>();
        for (const record of records.filter(
            (item) => item.status === 200 && (!expectIndexable || !item.noindex),
        ))
            groups.set(record[field], [
                ...(groups.get(record[field]) ?? []),
                record.path,
            ]);
        for (const [value, paths] of groups)
            if (value && paths.length > 1)
                findings.push({
                    severity: "P2",
                    path: paths.join(", "),
                    code: "duplicate-" + field,
                    detail: value,
                });
    }
    mkdirSync("tests/output", { recursive: true });
    const filename =
        base.hostname === "localhost"
            ? "search-local-audit"
            : base.hostname.includes("vercel.app")
              ? "search-preview-audit"
              : "search-production-audit";
    const result = {
        checkedAt: new Date().toISOString(),
        base: base.origin,
        expectIndexable,
        catalogIncluded: catalog,
        robots: { status: robotsResponse.status, text: robots },
        sitemap: {
            status: sitemapResponse.status,
            urls: [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((item) =>
                decode(item[1]),
            ),
        },
        truncated: pending.size > 0,
        pages: records,
        findings,
    };
    writeFileSync(
        "tests/output/" + filename + ".json",
        JSON.stringify(result, null, 2),
    );
    const lines = [
        "# Inhalts- und Suchintentionen",
        "",
        "Themen aus Angebot und Kundenfragen, keine gemessenen Suchvolumen oder Rankings. Bestehende Leistungen und Blogartikel bleiben zusätzlich erhalten.",
        "",
        "| Pfad | Bereich | Eigenständiges Thema | Leistungen | Pakete |",
        "| --- | --- | --- | --- | --- |",
        ...searchPages.map(
            (page) =>
                `| ${searchPagePath(page)} | ${page.kind} | ${page.heading} | ${page.services.join(", ")} | ${page.packages.join(", ") || "individuelles Angebot"} |`,
        ),
        "",
        "Hubs: " + searchHubs.map((hub) => hub.path).join(", "),
    ];
    writeFileSync("docs/SEARCH_CONTENT_MAP.md", lines.join("\n") + "\n");
    console.log(
        JSON.stringify({
            pages: records.length,
            catalogDetails: searchPages.length,
            catalogHubs: searchHubs.length,
            truncated: result.truncated,
            p0: findings.filter((f) => f.severity === "P0").length,
            p1: findings.filter((f) => f.severity === "P1").length,
            p2: findings.filter((f) => f.severity === "P2").length,
        }),
    );
    if (result.truncated || findings.some((f) => f.severity === "P0"))
        process.exitCode = 1;
}
main().catch((error) => {
    console.error(
        error instanceof Error ? error.message : "Audit fehlgeschlagen",
    );
    process.exitCode = 1;
});
