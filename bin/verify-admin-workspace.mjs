import fs from "node:fs";
import assert from "node:assert/strict";
const cfg = JSON.parse(fs.readFileSync("data/qa-config.json", "utf8"));
const state = JSON.parse(fs.readFileSync("data/qa-state.json", "utf8"));
const results = [];
for (const [prefix, cookie, sections] of [
    [
        "/admin",
        state.adminCookie,
        [
            "",
            "kunden",
            "onboarding",
            "kalender",
            "beratungen",
            "projekte",
            "aufgaben",
            "zeit",
            "pakete",
            "nachrichten",
            "dateien",
            "angebote",
            "rechnungen",
            "zahlungen",
            "email",
            "benachrichtigungen",
            "blog",
            "inhalte",
            "kontakt",
            "datenschutz",
            "widerrufe",
            "einstellungen",
            "system",
            "sicherheit",
            "backups",
            "status",
        ],
    ],
    [
        "/konto",
        state.customerCookie,
        [
            "",
            "termine",
            "buchen",
            "pakete",
            "zeit",
            "projekte",
            "aufgaben",
            "dateien",
            "freigaben",
            "nachrichten",
            "angebote",
            "rechnungen",
            "benachrichtigungen",
            "fragebogen",
            "profil",
            "datenschutz",
            "support",
        ],
    ],
]) {
    for (const section of sections) {
        const path = prefix + (section ? "/" + section : "");
        const r = await fetch(cfg.baseUrl + path, {
            headers: { Cookie: cookie },
            redirect: "manual",
        });
        const html = await r.text();
        assert.equal(r.status, 200, path);
        assert.ok(
            !html.includes("Die Seite konnte gerade nicht geladen werden."),
            path,
        );
        if (prefix === "/admin")
            assert.ok(
                !/href="\/konto(?:\/|\?|\")/.test(html),
                path + " links to customer portal",
            );
        if (path === "/admin") {
            assert.ok(html.includes("Eingegangene Anfragen"));
            assert.ok(
                !html.includes("Deine Zusammenarbeit. Klar organisiert."),
            );
        }
        if (prefix === "/konto") {
            assert.ok(
                !/href="\/admin(?:\/|\?|\")/.test(html),
                path + " contains admin link",
            );
            assert.ok(
                html.includes("portal-compact"),
                path + " compact layout",
            );
            assert.ok(
                !html.includes('aria-label="Adminnavigation"'),
                path + " admin navigation",
            );
        }
        if (path === "/konto") assert.ok(html.includes("Dein Kundenkonto"));
        if (path === "/konto/profil")
            assert.ok(
                html.includes('href="/widerruf"'),
                "Withdrawal remains reachable",
            );
        results.push({ path, status: r.status });
    }
}
for (const path of [
    "/admin/buchen",
    "/admin/profil",
    "/admin/fragebogen",
    "/admin/termine",
    "/admin/freigaben",
    "/admin/support",
]) {
    const r = await fetch(cfg.baseUrl + path, {
        headers: { Cookie: state.adminCookie },
        redirect: "manual",
    });
    assert.equal(r.status, 404, path);
    results.push({ path, status: 404 });
}
const denied = await fetch(cfg.baseUrl + "/admin", {
    headers: { Cookie: state.customerCookie },
    redirect: "manual",
});
assert.equal(denied.status, 404);
fs.writeFileSync(
    "tests/output/admin-workspace-http.json",
    JSON.stringify({ results, customerDenied: 404 }, null, 2),
);
console.log(JSON.stringify({ checks: results.length + 1, failures: 0 }));
