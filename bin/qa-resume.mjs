import fs from "node:fs";
const config = JSON.parse(fs.readFileSync("data/qa-config.json", "utf8"));
const state = JSON.parse(fs.readFileSync("data/qa-state.json", "utf8"));
async function post(action, data, cookie) {
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
    if (!response.ok) throw new Error(action + ": " + JSON.stringify(result));
    return {
        data: result,
        cookie: response.headers.get("set-cookie")?.split(";")[0] ?? cookie,
    };
}
async function mails() {
    return fetch(config.baseUrl + "/api/dev/mail", {
        method: "POST",
        headers: { Origin: config.baseUrl, "Content-Type": "application/json" },
        body: JSON.stringify({ key: config.setupKey }),
    }).then((r) => r.json());
}
const admin = await post("login", {
    email: config.adminEmail,
    password: config.password,
});
const otp = (await mails())
    .find(
        (m) =>
            m.to === config.adminEmail &&
            m.subject === "Dein einmaliger Sicherheitscode",
    )
    ?.body.match(/\d{6}/)?.[0];
if (!otp) throw new Error("OTP fehlt.");
state.adminCookie = (await post("otp", { code: otp }, admin.cookie)).cookie;
state.customerCookie = (
    await post("login", {
        email: config.customerEmail,
        password: config.password,
    })
).cookie;
const profile = await fetch(config.baseUrl + "/api/account/export", {
    headers: { Cookie: state.customerCookie },
}).then((r) => r.json());
if (!profile.profile.verifiedAt) {
    await post("resend-verification", {}, state.customerCookie);
    const url = (await mails()).find(
        (m) =>
            m.to === config.customerEmail &&
            m.subject === "Bestätige Deine E-Mail-Adresse",
    )?.url;
    if (!url) throw new Error("Bestätigungsnachricht fehlt.");
    await post("verify", { token: new URL(url).searchParams.get("token") });
}
await post(
    "profile",
    {
        name: "QA Kunde",
        phone: "+4900000000",
        billingAddress: "Isolierte QA-Testanschrift",
        customerType: "consumer",
    },
    state.customerCookie,
);
await post(
    "onboarding",
    {
        answers: Object.fromEntries(
            [
                "situation",
                "industry",
                "strengths",
                "goals",
                "challenges",
                "time",
                "support",
            ].map((key) => [key, "Isolierte lokale Ablaufprüfung"]),
        ),
        complete: true,
    },
    state.customerCookie,
);
fs.writeFileSync("data/qa-state.json", JSON.stringify(state), { mode: 0o600 });
for (const [name, cookie] of [
    ["admin", state.adminCookie],
    ["kunde", state.customerCookie],
]) {
    const split = cookie.indexOf("=");
    fs.writeFileSync(
        `data/qa-browser-${name}.json`,
        JSON.stringify({
            cookies: [
                {
                    name: cookie.slice(0, split),
                    value: cookie.slice(split + 1),
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
        { mode: 0o600 },
    );
}
console.log(
    "QA-Zugänge über echte Anmeldung und OTP erneuert; Kundenprofil und Fragebogen vorbereitet. Browserzustände ausschließlich lokal gespeichert.",
);
