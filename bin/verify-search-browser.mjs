import fs from "node:fs";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
const base = "http://localhost:3001";
const exe =
    process.env.AGENT_BROWSER_BIN ??
    "C:/Users/Enric/AppData/Local/npm-cache/_npx/6de2aa2fded2970c/node_modules/agent-browser/bin/agent-browser-win32-x64.exe";
const session = "search-review-" + Date.now();
const report = JSON.parse(
    fs.readFileSync("tests/output/search-local-audit.json", "utf8"),
);
const paths = report.pages
    .map((item) => item.path)
    .filter(
        (path) =>
            /^\/(branchen|loesungen|wissen)(\/|$)/.test(path) ||
            ["/fragen", "/unternehmensberatung-castrop-rauxel"].includes(path),
    );
assert.equal(paths.length, 32);
function run(args) {
    return new Promise((resolve, reject) => {
        const child = spawn(exe, ["--session", session, ...args], {
            windowsHide: true,
            stdio: ["ignore", "pipe", "pipe"],
        });
        let output = "",
            error = "";
        child.stdout.on("data", (data) => (output += data));
        child.stderr.on("data", (data) => (error += data));
        child.on("error", reject);
        child.on("close", (status) =>
            status === 0
                ? resolve(output)
                : reject(Error(args[0] + ": " + error.slice(0, 240))),
        );
    });
}
async function inspect(expression) {
    const value = JSON.parse(
        await run([
            "eval",
            "-b",
            Buffer.from(expression).toString("base64"),
            "--json",
        ]),
    );
    assert.ok(value.success);
    return typeof value.data.result === "string"
        ? JSON.parse(value.data.result)
        : value.data.result;
}
const layouts = [],
    accessibility = [];
let keyboard = false;
try {
    await run(["open", base]);
    await run(["wait", "--load", "networkidle"]);
    await run(["find", "role", "button", "click", "--name", "Ablehnen"]).catch(
        () => {},
    );
    await run(["wait", "--load", "networkidle"]);
    for (const width of [320, 768, 1440]) {
        await run(["set", "viewport", String(width), "900"]);
        for (const path of paths) {
            await run(["open", base + path]);
            await run(["wait", "--load", "networkidle"]);
            const info = await inspect(
                `JSON.stringify({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,h1:document.querySelectorAll('h1').length,answer:!!document.querySelector('.search-heading .lead'),canonical:document.querySelector('link[rel=canonical]')?.href,questions:document.querySelectorAll('.search-question').length,missingAnchors:Array.from(document.querySelectorAll('main a[href^="#"]')).filter(a=>!document.getElementById(a.getAttribute('href').slice(1))).length,ctaTop:document.querySelector('.search-heading .hero-cta .button')?.getBoundingClientRect().top})`,
            );
            layouts.push({ path, ...info });
            assert.ok(
                info.scrollWidth <= info.width,
                path + " overflow at " + width,
            );
            assert.equal(info.h1, 1, path);
            assert.equal(info.canonical, base + path);
            assert.equal(
                info.missingAnchors,
                0,
                path + " broken fragment links",
            );
            if (info.answer) {
                assert.ok(info.questions >= 2);
                assert.ok(info.ctaTop < 844, path + " CTA too far down");
            }
            if (width === 320) {
                const a11y = JSON.parse(
                    await run([
                        "a11y",
                        "--tags",
                        "wcag2a,wcag2aa,wcag21aa,wcag22aa",
                        "--json",
                    ]),
                );
                accessibility.push({
                    path,
                    counts: a11y.data.counts,
                    violations: a11y.data.violations,
                    incomplete: a11y.data.incomplete,
                });
            }
        }
        console.log(`${width}px: ${paths.length} neue Seiten geprüft.`);
    }
    await run(["set", "viewport", "390", "844"]);
    await run(["open", base + "/branchen/hausverwaltungen"]);
    await run(["wait", "--load", "networkidle"]);
    await inspect(
        `JSON.stringify(Boolean(document.querySelector('.search-question summary')?.focus() ?? document.activeElement.matches('.search-question summary')))`,
    );
    await run(["press", "Enter"]);
    keyboard = await inspect(
        "JSON.stringify(document.querySelector('.search-question').open && document.activeElement.matches('.search-question summary'))",
    );
    assert.equal(keyboard, true);
    await run(["open", base + "/branchen/kioske"]);
    await run(["wait", "--load", "networkidle"]);
    await run(["screenshot", "tests/output/search-kiosk-mobile.png"]);
    await run(["set", "viewport", "1440", "1000"]);
    await run(["open", base + "/wissen/website-briefing"]);
    await run(["wait", "--load", "networkidle"]);
    await run(["screenshot", "tests/output/search-briefing-desktop.png"]);
    const failures = accessibility.reduce(
        (count, page) => count + page.counts.violations,
        0,
    );
    console.log(
        JSON.stringify({
            layouts: layouts.length,
            a11yPages: accessibility.length,
            violations: failures,
            keyboard,
        }),
    );
    if (failures) process.exitCode = 1;
} finally {
    fs.writeFileSync(
        "tests/output/search-browser-audit.json",
        JSON.stringify(
            {
                checkedAt: new Date().toISOString(),
                base,
                layouts,
                accessibility,
                keyboard,
            },
            null,
            2,
        ),
    );
    await run(["close"]).catch(() => {});
}
