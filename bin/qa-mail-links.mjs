import fs from "node:fs";
const config = JSON.parse(fs.readFileSync("data/qa-config.json", "utf8"));
const state = JSON.parse(fs.readFileSync("data/qa-state.json", "utf8"));
const response = await fetch(config.baseUrl + "/api/dev/mail", {
    method: "POST",
    headers: { Origin: config.baseUrl, "Content-Type": "application/json" },
    body: JSON.stringify({ key: config.setupKey }),
});
if (!response.ok)
    throw new Error("Geschützter lokaler Mailausgang nicht verfügbar.");
const mails = await response.json();
state.verificationUrl = mails.find(
    (m) =>
        m.to === config.customerEmail &&
        m.subject === "Bestätige Deine E-Mail-Adresse",
)?.url;
if (!state.verificationUrl) throw new Error("Verifizierungsnachricht fehlt.");
fs.writeFileSync("data/qa-state.json", JSON.stringify(state), { mode: 0o600 });
console.log(
    "Tatsächlich erzeugte Verifizierungsnachricht im geschützten lokalen Mailausgang gefunden.",
);
