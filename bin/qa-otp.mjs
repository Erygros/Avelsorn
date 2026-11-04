import fs from "node:fs";
const config = JSON.parse(fs.readFileSync("data/qa-config.json", "utf8"));
const state = JSON.parse(fs.readFileSync("data/qa-state.json", "utf8"));
const response = await fetch(config.baseUrl + "/api/dev/mail", {
    method: "POST",
    headers: { Origin: config.baseUrl, "Content-Type": "application/json" },
    body: JSON.stringify({ key: config.setupKey }),
});
const mails = await response.json();
const code = mails
    .find(
        (m) =>
            m.to === config.adminEmail &&
            m.subject === "Dein einmaliger Sicherheitscode",
    )
    ?.body.match(/\d{6}/)?.[0];
if (!code) throw new Error("OTP fehlt.");
state.adminOtp = code;
fs.writeFileSync("data/qa-state.json", JSON.stringify(state), { mode: 0o600 });
console.log(
    "Aktueller QA-Sicherheitscode aus dem tatsächlich erzeugten lokalen E-Mail-Ausgang bereitgestellt.",
);
