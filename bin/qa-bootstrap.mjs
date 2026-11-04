import fs from "node:fs";
const config = JSON.parse(fs.readFileSync("data/qa-config.json", "utf8"));
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
await post("setup", {
    key: config.setupKey,
    name: "QA Administration",
    email: config.adminEmail,
    password: config.password,
    birthDate: "1990-01-01",
});
const login = await post("login", {
    email: config.adminEmail,
    password: config.password,
});
const mails = await fetch(config.baseUrl + "/api/dev/mail", {
    method: "POST",
    headers: { Origin: config.baseUrl, "Content-Type": "application/json" },
    body: JSON.stringify({ key: config.setupKey }),
}).then((r) => r.json());
const otp = mails
    .find(
        (m) =>
            m.to === config.adminEmail &&
            m.subject === "Dein einmaliger Sicherheitscode",
    )
    ?.body.match(/\d{6}/)?.[0];
if (!otp) throw new Error("OTP fehlt");
const verified = await post("otp", { code: otp }, login.cookie);
fs.writeFileSync(
    "data/qa-state.json",
    JSON.stringify({ adminCookie: verified.cookie }),
    { mode: 0o600 },
);
console.log(
    "Echter HTTP-Ablauf Einrichtung → Anmeldung → E-Mail-OTP erfolgreich. Testzugang ausschließlich in separater QA-Datenbank.",
);
