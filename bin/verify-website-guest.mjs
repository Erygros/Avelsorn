import assert from "node:assert/strict";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
const cfg = JSON.parse(fs.readFileSync("data/qa-config.json", "utf8"));
const state = JSON.parse(
    fs.readFileSync("data/calendar-e2e-state.json", "utf8"),
);
assert.equal(cfg.baseUrl, "http://localhost:3011");
const checks = [];
async function post(data, cookie, expected = 200, origin = cfg.baseUrl) {
    const r = await fetch(cfg.baseUrl + "/api/guest-bookings", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Origin: origin,
            ...(cookie ? { Cookie: cookie } : {}),
        },
        body: JSON.stringify(data),
    });
    const result = await r.json();
    assert.equal(r.status, expected, JSON.stringify(result));
    checks.push({ operation: data.operation, status: r.status });
    return {
        data: result,
        cookie: r.headers.get("set-cookie")?.split(";")[0] ?? cookie,
        headers: r.headers,
    };
}
const day = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Berlin",
}).format(new Date(Date.now() + 50 * 86400000));
const slots = await fetch(cfg.baseUrl + "/api/slots?public=1&day=" + day).then(
    (r) => r.json(),
);
assert(slots.length > 4);
const input = {
    operation: "book",
    firstName: "QA",
    lastName: "Gast",
    email: "gast-" + Date.now() + "@qa.example.test",
    phone: "+4915512345678",
    topic: "Isolierte Prüfung eines Anfrageprozesses",
    startsAt: slots[0].value,
    terms: true,
    adultOrRepresentative: true,
    requestId: randomUUID(),
};
await post(input, null, 403, "https://foreign.example.test");
await post({ ...input, topic: "" }, null, 422);
const guest = await post(input, null, 201);
assert(guest.cookie);
assert(guest.headers.get("set-cookie").includes("HttpOnly"));
assert(guest.headers.get("set-cookie").includes("SameSite=lax"));
assert(guest.headers.get("set-cookie").includes("Path=/api/guest-bookings"));
let r = await fetch(cfg.baseUrl + "/api/guest-bookings");
assert.equal(r.status, 401);
checks.push({ operation: "anonymous-read-denied", status: 401 });
r = await fetch(cfg.baseUrl + "/api/guest-bookings", {
    headers: { Cookie: guest.cookie },
});
assert.equal(r.status, 200);
assert.equal((await r.json()).booking.id, guest.data.booking.id);
assert(r.headers.get("cache-control").includes("no-store"));
const adminPage = await fetch(
    cfg.baseUrl + "/admin/kalender?booking=" + guest.data.booking.id,
    { headers: { Cookie: state.adminCookie } },
).then((r) => r.text());
assert(adminPage.includes(input.topic));
assert(adminPage.includes(input.email));
const customerPage = await fetch(cfg.baseUrl + "/konto/termine", {
    headers: { Cookie: state.customerCookie },
}).then((r) => r.text());
assert(!customerPage.includes(input.email));
await post(
    {
        ...input,
        email: "zweiter-" + Date.now() + "@qa.example.test",
        requestId: randomUUID(),
    },
    null,
    409,
);
const mails = await fetch(cfg.baseUrl + "/api/dev/mail", {
    method: "POST",
    headers: { Origin: cfg.baseUrl, "Content-Type": "application/json" },
    body: JSON.stringify({ key: cfg.setupKey }),
}).then((r) => r.json());
const mail = mails.find(
    (m) => m.to === input.email && m.subject.includes("Terminbestätigung"),
);
assert(mail);
assert(
    mail.body.includes(
        "Ich melde mich zum gebuchten Termin telefonisch bei Dir.",
    ),
);
const token = new URL(mail.url).hash.slice("#zugang=".length);
assert(token.length === 43);
const access = await post({ operation: "access", token }, null);
assert.equal(access.data.booking.id, guest.data.booking.id);
await post(
    {
        operation: "change",
        action: "reschedule",
        startsAt: slots[2].value,
        sequence: 0,
    },
    guest.cookie,
);
await post(
    { operation: "change", action: "cancel", sequence: 0 },
    guest.cookie,
    409,
);
await post(
    { operation: "change", action: "cancel", sequence: 1 },
    guest.cookie,
);
const adminChange = await fetch(
    cfg.baseUrl + "/api/action/guest-booking-change",
    {
        method: "POST",
        headers: {
            Origin: cfg.baseUrl,
            "Content-Type": "application/json",
            Cookie: state.customerCookie,
        },
        body: JSON.stringify({
            id: guest.data.booking.id,
            action: "note",
            notes: "nicht erlaubt",
        }),
    },
);
assert.equal(adminChange.status, 403);
fs.writeFileSync(
    "tests/output/website-guest-http.json",
    JSON.stringify(
        {
            checkedAt: new Date().toISOString(),
            checks,
            httpOnlyScopedCookie: true,
            capabilityLink: true,
            adminCalendar: true,
            customerIsolation: true,
            mailOutboxPersisted: true,
            onlyLocalQa: true,
        },
        null,
        2,
    ),
);
fs.writeFileSync(
    "data/website-guest-browser.json",
    JSON.stringify({
        input,
        day,
        token,
        cookie: guest.cookie,
        bookingId: guest.data.booking.id,
    }),
);
console.log(
    JSON.stringify({
        checks: checks.length,
        adminCalendar: true,
        customerIsolation: true,
        mailOutboxPersisted: true,
        productionUntouched: true,
    }),
);
