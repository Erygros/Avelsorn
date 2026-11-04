// Read-only checks against the local app; no accounts or business records created.
import { writeFileSync } from "node:fs";
const paths = ["/", "/leistungen", "/preise", "/ablauf", "/zielgruppen", "/ueber-mich",
    "/erstgespraech", "/kontakt", "/blog", "/impressum", "/datenschutz", "/agb",
    "/widerrufsbelehrung", "/widerruf", "/barrierefreiheit", "/cookies", "/anmelden",
    "/registrieren", "/passwort-vergessen", "/leistungen/unternehmensberatung",
    "/leistungen/gruendung", "/leistungen/social-media", "/leistungen/creator",
    "/leistungen/websites-software", "/leistungen/digitalisierung-ki", "/leistungen/trading-etf",
    "/blog/prozesse-sinnvoll-automatisieren", "/blog/website-klarer-naechster-schritt",
    "/blog/social-media-strategie-alltag", "/blog/positionierung-fuer-deine-gruendung",
    "/blog/digitale-selbststaendigkeit-erster-schritt"];
const report = [];
for (const path of paths) {
    const response = await fetch("http://localhost:3001" + path);
    const html = await response.text();
    const result = {
        path, status: response.status,
        brandedTitle: /<title>[^<]*Avelsorn/.test(html),
        logo: html.includes("avelsorn-logo.png"),
        oldPlaceholder: /Markenname in Vorbereitung|Klarer weiter\.|M7 35V13h11/.test(html),
        pageError: html.includes("Die Seite konnte gerade nicht geladen werden."),
    };
    report.push(result);
}
writeFileSync("tests/output/avelsorn-pages.json", JSON.stringify(report, null, 2));
const failures = report.filter(r => r.status !== 200 || !r.brandedTitle || !r.logo || r.oldPlaceholder || r.pageError);
console.log(JSON.stringify({checked: report.length, failures}));
if (failures.length) process.exitCode = 1;
