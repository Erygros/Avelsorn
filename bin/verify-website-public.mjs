import fs from "node:fs";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
const base = process.env.QA_BASE_URL ?? "http://localhost:3011";
assert.ok(
    base.startsWith("http://localhost:") || base.includes(".vercel.app"),
    "Use an isolated local or Vercel Preview target.",
);
const exe =
    process.env.AGENT_BROWSER_BIN ??
    "C:/Users/Enric/AppData/Local/npm-cache/_npx/6de2aa2fded2970c/node_modules/agent-browser/bin/agent-browser-win32-x64.exe";
const session = "website-validation-" + Date.now();
function run(args) {
    return new Promise((resolve, reject) => {
        const p = spawn(exe, ["--session", session, ...args], {
            windowsHide: true,
            stdio: ["ignore", "pipe", "pipe"],
        });
        let out = "",
            err = "";
        p.stdout.on("data", (d) => (out += d));
        p.stderr.on("data", (d) => (err += d));
        p.on("error", reject);
        p.on("close", (code) =>
            code === 0
                ? resolve(out)
                : reject(Error(args[0] + ": " + err.slice(0, 200))),
        );
    });
}
function parsed(value) {
    const r = JSON.parse(value);
    if (!r.success) throw Error("Browser inspection failed");
    return typeof r.data.result === "string"
        ? JSON.parse(r.data.result)
        : r.data.result;
}
const inventory = JSON.parse(
    fs.readFileSync("tests/output/editorial-final-http.json", "utf8"),
);
const paths = [
    ...new Set([
        ...inventory.pages.map((p) => p.path),
        "/kalender",
        "/kalender/gast",
        "/ueber-mich",
    ]),
];
const inspect = `JSON.stringify({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,h1:document.querySelectorAll('h1').length,title:document.title,description:document.querySelector('meta[name=description]')?.content,canonical:document.querySelector('link[rel=canonical]')?.href,ogTitle:document.querySelector('meta[property="og:title"]')?.content,developmentNote:!!document.querySelector('.preview-note'),heroCtaTop:document.querySelector('.hero-cta .primary')?.getBoundingClientRect().top,priceResults:Array.from(document.querySelectorAll('.pricing-card')).map(c=>({id:c.id,resultVisible:!!c.querySelector('.package-result')&&getComputedStyle(c.querySelector('.package-result')).display!=='none'&&!c.querySelector('.package-result').closest('details'),scopeVisible:c.querySelectorAll('.package-highlights li').length,detailsClosed:!c.querySelector('details')?.open})),links:Array.from(document.querySelectorAll('a[href]')).map(a=>a.getAttribute('href')).filter(h=>h.startsWith('/')&&!h.startsWith('//'))})`;
const reports = [],
    accessibility = [],
    http = [];
try {
    await run(["open", base]);
    await run(["find", "role", "button", "click", "--name", "Ablehnen"]).catch(
        () => {},
    );
    for (const width of [320, 768, 1440]) {
        await run(["set", "viewport", String(width), "900"]);
        for (const path of paths) {
            await run(["open", base + path]);
            await run(["wait", "--load", "networkidle"]);
            const r = parsed(
                await run([
                    "eval",
                    "-b",
                    Buffer.from(inspect).toString("base64"),
                    "--json",
                ]),
            );
            reports.push({ path, ...r });
            assert.ok(
                r.scrollWidth <= r.width,
                "Horizontal overflow: " + path + " at " + width,
            );
            assert.equal(r.h1, 1, path + " must have one H1");
            assert.ok(!r.developmentNote, path);
            assert.ok(r.description, path + " description");
            assert.ok(r.canonical, path + " canonical");
            if (path === "/")
                assert.ok(
                    r.heroCtaTop < 844,
                    "Hero CTA must be reachable without long scrolling",
                );
            if (path === "/preise") {
                assert.equal(r.priceResults.length, 7);
                assert.ok(
                    r.priceResults.every(
                        (p) =>
                            p.resultVisible &&
                            p.scopeVisible === 3 &&
                            p.detailsClosed,
                    ),
                );
            }
        }
        console.log(width + "px: " + paths.length + " public pages passed.");
    }
    const links = [
        ...new Set(
            reports.flatMap((r) => r.links).map((h) => h.split(/[?#]/)[0]),
        ),
    ].filter(
        (h) =>
            !/^\/(api|admin|konto|entwicklung|einrichtung|otp|passwort|email-bestaetigen|zustimmung|vertragszustimmung)/.test(
                h,
            ),
    );
    for (const path of links) {
        const r = await fetch(base + path);
        http.push({ path, status: r.status });
        assert.equal(r.status, 200, path);
    }
    for (const path of [
        "/",
        "/leistungen",
        "/preise",
        "/erstgespraech",
        "/kalender",
        "/kalender/gast",
        "/ueber-mich",
        "/kontakt",
        "/paket-anfragen",
        "/leistungen/websites-software",
        "/leistungen/digitalisierung-ki",
        "/impressum",
        "/datenschutz",
        "/agb",
        "/widerruf",
        "/cookies",
        "/barrierefreiheit",
    ]) {
        await run(["open", base + path]);
        const r = JSON.parse(
            await run([
                "a11y",
                "--tags",
                "wcag2a,wcag2aa,wcag21aa,wcag22aa",
                "--json",
            ]),
        );
        accessibility.push({
            path,
            counts: r.data.counts,
            violations: r.data.violations,
            incomplete: r.data.incomplete,
        });
        assert.equal(r.data.counts.violations, 0, "Accessibility: " + path);
    }
    const home = reports.find((r) => r.path === "/" && r.width === 1440);
    assert.ok(home.title.includes("Unternehmensberatung"));
    assert.ok(home.ogTitle);
    assert.ok(home.canonical.endsWith("/"));
    const result = {
        checkedAt: new Date().toISOString(),
        base,
        layouts: reports.map((record) => Object.fromEntries(Object.entries(record).filter(([key]) => key !== "links"))),
        http,
        accessibility,
    };
    fs.writeFileSync(
        "tests/output/website-public-validation.json",
        JSON.stringify(result, null, 2),
    );
    console.log(
        JSON.stringify({
            layoutChecks: reports.length,
            linkChecks: http.length,
            a11yPages: accessibility.length,
            violations: 0,
        }),
    );
} finally {
    fs.writeFileSync(
        "tests/output/website-public-partial.json",
        JSON.stringify({ layouts: reports, accessibility, http }, null, 2),
    );
    await run(["close"]).catch(() => {});
}
