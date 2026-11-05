import fs from "node:fs";
import assert from "node:assert/strict";
const cfg = JSON.parse(fs.readFileSync("data/qa-config.json", "utf8"));
if (cfg.baseUrl !== "http://localhost:3011") throw Error("QA target");
async function post(action, data, cookie) {
    const r = await fetch(cfg.baseUrl + "/api/action/" + action, {
        method: "POST",
        headers: {
            Origin: cfg.baseUrl,
            "Content-Type": "application/json",
            ...(cookie ? { Cookie: cookie } : {}),
        },
        body: JSON.stringify(data),
    });
    const body = await r.json();
    return {
        status: r.status,
        body,
        cookie: r.headers.get("set-cookie")?.split(";")[0] ?? cookie,
    };
}
async function mails() {
    const r = await fetch(cfg.baseUrl + "/api/dev/mail", {
        method: "POST",
        headers: { Origin: cfg.baseUrl, "Content-Type": "application/json" },
        body: JSON.stringify({ key: cfg.setupKey }),
    });
    assert.equal(r.status, 200);
    return r.json();
}
const state = {};
let login = await post("login", {
    email: cfg.adminEmail,
    password: cfg.password,
});
assert.equal(login.status, 200);
const otp = (await mails())
    .find(
        (m) => m.to === cfg.adminEmail && m.subject.includes("Sicherheitscode"),
    )
    ?.body.match(/\d{6}/)?.[0];
assert.ok(otp);
state.adminCookie = (await post("otp", { code: otp }, login.cookie)).cookie;
const email = "calendar-" + Date.now() + "@qa.example.test";
const registered = await post("register", {
    name: "QA Kalender",
    email,
    password: cfg.password,
    birthDate: "1990-01-01",
    terms: true,
    returnTo: "/kalender",
});
assert.equal(registered.status, 200);
const verifyUrl = (await mails()).find(
    (m) => m.to === email && m.subject === "Bestätige Deine E-Mail-Adresse",
)?.url;
assert.ok(verifyUrl);
assert.equal(new URL(verifyUrl).searchParams.get("next"), "/kalender");
const verified = await post("verify", {
    token: new URL(verifyUrl).searchParams.get("token"),
    next: "/kalender",
});
assert.equal(verified.status, 200);
assert.equal(verified.body.redirect, "/kalender");
login = await post("login", { email, password: cfg.password });
assert.equal(login.status, 200);
state.customerCookie = login.cookie;
const day = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Berlin",
}).format(new Date(Date.now() + 45 * 86400000));
async function slots() {
    const r = await fetch(cfg.baseUrl + "/api/slots?public=1&day=" + day);
    assert.equal(r.status, 200);
    return r.json();
}
let free = await slots();
assert.ok(free.length > 3);
const details = {
    firstName: "QA",
    lastName: "Kalender",
    phone: "+49 155 12345678",
    company: "QA-Testfirma",
    topic: "Isolierte Kalenderprüfung",
};
const booked = await post(
    "intro-booking",
    { startsAt: free[0].value, terms: true, details },
    state.customerCookie,
);
assert.equal(booked.status, 200);
state.bookingId = booked.body.id;
state.userId = booked.body.userId;
state.startsAt = booked.body.startsAt;
state.day = day;
assert.equal(booked.body.contactPhone, "+4915512345678");
assert.equal(booked.body.company, "QA-Testfirma");
assert.ok(!(await slots()).some((s) => s.value === free[0].value));
const double = await post(
    "intro-booking",
    { startsAt: free[1].value, terms: true, details },
    state.customerCookie,
);
assert.equal(double.status, 409);
const forbidden = await post(
    "intro-credit",
    { userId: state.userId, count: 1 },
    state.customerCookie,
);
assert.equal(forbidden.status, 403);
const grant = await post(
    "intro-credit",
    { userId: state.userId, count: 1 },
    state.adminCookie,
);
assert.equal(grant.status, 200);
const additional = await post(
    "intro-booking",
    { startsAt: free[1].value, terms: true, details },
    state.customerCookie,
);
assert.equal(additional.status, 200);
state.secondBookingId = additional.body.id;
assert.equal(
    (
        await post(
            "calendar-note",
            { id: state.bookingId, notes: "Interne QA-Notiz" },
            state.adminCookie,
        )
    ).status,
    200,
);
const invite = await fetch(
    cfg.baseUrl + "/api/bookings/" + state.bookingId + "/ics",
    { headers: { Cookie: state.customerCookie } },
);
assert.equal(invite.status, 200);
assert.ok((await invite.text()).includes("Avelsorn ruft den Kunden"));
const ownerPage = await fetch(cfg.baseUrl + "/konto/termine", {
    headers: { Cookie: state.customerCookie },
});
assert.equal(ownerPage.status, 200);
assert.ok(!(await ownerPage.text()).includes("Interne QA-Notiz"));
const adminPage = await fetch(
    cfg.baseUrl + "/admin/kalender?booking=" + state.bookingId,
    { headers: { Cookie: state.adminCookie } },
);
assert.equal(adminPage.status, 200);
assert.ok((await adminPage.text()).includes("Interne QA-Notiz"));
const confirm = (await mails()).find(
    (m) => m.to === email && m.subject.includes("Terminbestätigung"),
);
assert.ok(confirm);
assert.ok(confirm.body.includes("Du musst uns nicht selbst anrufen"));
assert.ok(confirm.body.includes("+4915512345678"));
state.customerEmail = email;
for (const role of ["admin", "customer"]) {
    const cookie = state[role + "Cookie"].split("=").slice(1).join("=");
    fs.writeFileSync(
        "data/calendar-browser-" + role + ".json",
        JSON.stringify({
            cookies: [
                {
                    name: "platform_session",
                    value: cookie,
                    domain: "localhost",
                    path: "/",
                    httpOnly: true,
                    secure: false,
                    sameSite: "Lax",
                    expires: Math.floor(Date.now() / 1000) + 3600,
                },
            ],
            origins: [],
        }),
    );
}
fs.writeFileSync(
    "data/calendar-e2e-state.json",
    JSON.stringify(state, null, 2),
);
fs.writeFileSync(
    "tests/output/calendar-api-e2e.json",
    JSON.stringify(
        {
            registration: true,
            verified: true,
            noOnboardingRequired: true,
            publicSlots: true,
            transactionalBooking: true,
            repeatDenied: true,
            adminCredit: true,
            customerCannotGrant: true,
            internalNotePrivate: true,
            confirmationQueued: true,
            ics: true,
        },
        null,
        2,
    ),
);
console.log("Kalender-Ablauf über echte QA-APIs geprüft.");
