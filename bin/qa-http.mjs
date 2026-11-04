import fs from "node:fs";
const config = JSON.parse(fs.readFileSync("data/qa-config.json", "utf8"));
const state = JSON.parse(fs.readFileSync("data/qa-state.json", "utf8"));
const report = [];
async function post(
    action,
    data,
    cookie,
    expected = 200,
    origin = config.baseUrl,
) {
    const response = await fetch(config.baseUrl + "/api/action/" + action, {
        method: "POST",
        headers: {
            Origin: origin,
            "Content-Type": "application/json",
            ...(cookie ? { Cookie: cookie } : {}),
        },
        body: JSON.stringify(data),
    });
    const result = await response.json();
    if (response.status !== expected)
        throw new Error(
            action +
                ": expected " +
                expected +
                ", got " +
                response.status +
                " " +
                JSON.stringify(result),
        );
    return {
        data: result,
        cookie: response.headers.get("set-cookie")?.split(";")[0] ?? cookie,
    };
}
async function page(path, cookie) {
    const response = await fetch(config.baseUrl + path, {
        headers: cookie ? { Cookie: cookie } : {},
    });
    const html = await response.text();
    if (
        response.status !== 200 ||
        html.includes("Die Seite konnte gerade nicht geladen werden.")
    )
        throw new Error("Page failed: " + path + " " + response.status);
    report.push({ path, status: response.status });
}
for (const path of [
    "/",
    "/leistungen",
    "/preise",
    "/ablauf",
    "/zielgruppen",
    "/ueber-mich",
    "/erstgespraech",
    "/kontakt",
    "/blog",
    "/impressum",
    "/datenschutz",
    "/agb",
    "/widerrufsbelehrung",
    "/widerruf",
    "/barrierefreiheit",
    "/cookies",
    "/leistungen/unternehmensberatung",
    "/leistungen/gruendung",
    "/leistungen/social-media",
    "/leistungen/creator",
    "/leistungen/websites-software",
    "/leistungen/digitalisierung-ki",
    "/leistungen/trading-etf",
])
    await page(path);
const login = await post("login", {
    email: config.customerEmail,
    password: config.password,
});
state.customerCookie = login.cookie;
for (const path of [
    "/konto",
    "/konto/termine",
    "/konto/buchen",
    "/konto/pakete",
    "/konto/zeit",
    "/konto/projekte",
    "/konto/aufgaben",
    "/konto/dateien",
    "/konto/freigaben",
    "/konto/nachrichten",
    "/konto/angebote",
    "/konto/rechnungen",
    "/konto/benachrichtigungen",
    "/konto/fragebogen",
    "/konto/profil",
    "/konto/datenschutz",
    "/konto/support",
])
    await page(path, login.cookie);
for (const section of [
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
])
    await page("/admin" + (section ? "/" + section : ""), state.adminCookie);
await post("settings", { brand_name: "Verbotene Änderung" }, login.cookie, 403);
for (const action of ["order-cancel", "time-correct"]) {
    await post(action, {}, login.cookie, 403);
    report.push({ check: `Kunde darf ${action} nicht ausführen`, status: 403 });
}
report.push({
    check: "Kunde kann keine Admin-Einstellungen ändern",
    status: 403,
});
await post(
    "profile",
    {
        name: "Fremde Anfrage",
        phone: "",
        billingAddress: "",
        customerType: "consumer",
    },
    login.cookie,
    403,
    "https://fremd.example",
);
report.push({ check: "Fremde Origin abgewehrt", status: 403 });
const exportResponse = await fetch(config.baseUrl + "/api/account/export", {
    headers: { Cookie: login.cookie },
});
const exported = await exportResponse.json();
if (
    exported.profile.passwordHash ||
    JSON.stringify(exported).includes("scrypt-v1")
)
    throw new Error("Passwortdaten im Export");
state.customerId = exported.profile.id;
await post(
    "project-create",
    {
        userId: state.customerId,
        name: "QA Projekt",
        description: "Echte isolierte End-to-End-Prüfung",
        category: "Prüfung",
    },
    state.adminCookie,
);
const form = new FormData();
form.set(
    "file",
    new File(["Isolierte QA-Prüfdatei"], "pruefung.txt", {
        type: "text/plain",
    }),
);
const uploaded = await fetch(config.baseUrl + "/api/files", {
    method: "POST",
    headers: { Origin: config.baseUrl, Cookie: login.cookie },
    body: form,
});
const file = await uploaded.json();
if (!uploaded.ok) throw new Error("Upload failed " + JSON.stringify(file));
state.fileId = file.id;
const otherEmail = `anderer-kunde-${crypto.randomUUID()}@qa.example.test`;
await post("register", {
    name: "QA Anderer Kunde",
    email: otherEmail,
    password: config.password,
    birthDate: "1990-01-01",
    terms: true,
});
const other = await post("login", {
    email: otherEmail,
    password: config.password,
});
const denied = await fetch(config.baseUrl + "/api/files/" + file.id, {
    headers: { Cookie: other.cookie },
});
if (denied.status !== 404) throw new Error("Cross-customer file leak");
report.push({ check: "Direkter fremder Dateizugriff abgewehrt", status: 404 });
const own = await fetch(config.baseUrl + "/api/files/" + file.id, {
    headers: { Cookie: login.cookie },
});
if (!own.ok || (await own.text()) !== "Isolierte QA-Prüfdatei")
    throw new Error("Own file inaccessible");
report.push({ check: "Eigener privater Download erfolgreich", status: 200 });
fs.writeFileSync("data/qa-state.json", JSON.stringify(state), { mode: 0o600 });
fs.mkdirSync("tests/output", { recursive: true });
fs.writeFileSync("tests/output/http-qa.json", JSON.stringify(report, null, 2));
console.log(
    `${report.length} echte HTTP-Seiten- und Sicherheitsprüfungen erfolgreich. Keine produktiven externen Dienste verwendet.`,
);
