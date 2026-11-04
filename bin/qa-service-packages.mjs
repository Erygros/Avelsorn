/** Real HTTP flow, exclusively against the isolated local QA instance. */
import fs from "node:fs";
import assert from "node:assert/strict";
const config = JSON.parse(fs.readFileSync("data/qa-config.json", "utf8"));
assert.equal(config.baseUrl, "http://localhost:3011");
const state = JSON.parse(fs.readFileSync("data/qa-state.json", "utf8"));
const checks = [];
async function post(action, data, cookie, expected = 200) {
    const response = await fetch(config.baseUrl + "/api/action/" + action, {
        method: "POST",
        headers: {
            Origin: config.baseUrl,
            "Content-Type": "application/json",
            ...(cookie ? { Cookie: cookie } : {}),
        },
        body: JSON.stringify(data),
    });
    const result = await response.json();
    assert.equal(
        response.status,
        expected,
        `${action}: ${JSON.stringify(result)}`,
    );
    checks.push({ action, status: response.status });
    return result;
}
await post("register", {
    name: "QA Paketkunde",
    email: config.customerEmail,
    password: config.password,
    birthDate: "1990-01-01",
    terms: true,
});
// Reuse actual login, email verification and onboarding, without logging secrets.
const { spawnSync } = await import("node:child_process");
const prepared = spawnSync(process.execPath, ["bin/qa-resume.mjs"], {
    encoding: "utf8",
    windowsHide: true,
});
assert.equal(prepared.status, 0, prepared.stderr);
Object.assign(state, JSON.parse(fs.readFileSync("data/qa-state.json", "utf8")));
async function exported() {
    const r = await fetch(config.baseUrl + "/api/account/export", {
        headers: { Cookie: state.customerCookie },
    });
    assert.equal(r.status, 200);
    return r.json();
}
await post("package-inquiry", {
    packageKey: "neustart",
    name: "QA Anfrage",
    email: config.customerEmail,
    body: "Ich möchte eine Selbstständigkeit vorbereiten und habe noch keine Geschäftsidee.",
    consent: true,
});
assert.equal((await exported()).orders.length, 0);
await post("package", { product: "package12" }, state.customerCookie, 410);
await post(
    "booking",
    {
        product: "consultation",
        minutes: 60,
        startsAt: "2030-06-03T09:00:00.000Z",
        channel: "phone",
        terms: true,
        earlyStart: true,
        withdrawalAcknowledged: true,
    },
    state.customerCookie,
    410,
);
const customer = (await exported()).profile;
const input = {
    userId: customer.id,
    catalogKey: "neustart",
    description:
        "Erfahrungen aufnehmen, drei Tätigkeiten vergleichen, eine Angebotsidee und schriftliche Aufgabenliste. Ein Auswertungsgespräch und eine Korrekturrunde. Liefertermin: 10.06.2030 nach Zuarbeit. Zahlung vor Beginn.",
    items: [
        {
            description: "Selbstständigkeit vorbereiten",
            quantity: 1,
            unitCents: 24900,
        },
    ],
};
await post(
    "offer-create",
    {
        ...input,
        items: [{ description: "Paket", quantity: 1, unitCents: 24899 }],
    },
    state.adminCookie,
    400,
);
const offer = await post("offer-create", input, state.adminCookie);
await post("offer-send", { id: offer.id }, state.adminCookie);
await post(
    "offer-response",
    {
        id: offer.id,
        accept: true,
        declaration:
            "Ich nehme das Angebot verbindlich und zahlungspflichtig an.",
        earlyStart: true,
        withdrawalAcknowledged: true,
    },
    state.customerCookie,
);
let data = await exported();
const order = data.orders[0];
assert.equal(order.amountCents, 24900);
assert.equal(data.projects.length, 0);
await post(
    "payment",
    {
        orderId: order.id,
        amountCents: 24900,
        bankReference: "Isolierte QA-Zahlungsprüfung",
        receivedAt: new Date().toISOString(),
        idempotencyKey: crypto.randomUUID(),
    },
    state.adminCookie,
);
data = await exported();
assert.equal(data.orders[0].status, "paid");
assert.equal(data.projects.length, 1);
assert.equal(data.packages.length, 0);
assert.equal(data.documents.find((d) => d.kind === "invoice").status, "paid");
for (const path of [
    "/preise",
    "/beruflich-neu-starten",
    "/paket-anfragen?paket=neustart",
    "/konto/pakete",
    "/konto/buchen?product=project&order=" + order.id,
    "/admin/angebote",
    "/admin/kontakt",
]) {
    const cookie = path.startsWith("/admin")
        ? state.adminCookie
        : state.customerCookie;
    const r = await fetch(config.baseUrl + path, {
        headers: { Cookie: cookie },
    });
    const html = await r.text();
    assert.equal(r.status, 200, path);
    assert.ok(
        !html.includes("Die Seite konnte gerade nicht geladen werden."),
        path,
    );
    checks.push({ path, status: r.status });
}
fs.writeFileSync(
    "tests/output/service-packages-http.json",
    JSON.stringify(
        { checks, paidCents: 24900, projects: 1, legacyPackages: 0 },
        null,
        2,
    ),
);
console.log(
    JSON.stringify({
        checks: checks.length,
        failures: 0,
        paidCents: 24900,
        projects: 1,
        isolated: true,
    }),
);
