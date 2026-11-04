import fs from "node:fs";
import assert from "node:assert/strict";
const config = JSON.parse(fs.readFileSync("data/qa-config.json", "utf8"));
const state = JSON.parse(fs.readFileSync("data/qa-state.json", "utf8"));
const response = await fetch(config.baseUrl + "/api/account/export", {
    headers: { Cookie: state.customerCookie },
});
assert.equal(response.status, 200);
const data = await response.json();
const refunded = process.argv.includes("--refunded");
assert.equal(data.orders.length, 1);
assert.equal(data.orders[0].status, refunded ? "refunded" : "cancelled");
assert.equal(data.orders[0].paidCents, refunded ? 0 : 9900);
assert.equal(data.packages.length, 1);
assert.equal(data.packages[0].status, "cancelled");
assert.ok(data.packages[0].cancelledAt);
assert.equal(data.packages[0].usedSeconds, 30);
assert.equal(data.time.length, 1);
assert.equal(data.time[0].durationSeconds, 60);
assert.equal(data.time[0].chargedSeconds, 30);
assert.equal(data.time[0].revision, 1);
assert.equal(data.documents.filter((d) => d.kind === "correction").length, 2);
assert.equal(data.documents.filter((d) => d.kind === "invoice").length, 2);
assert.equal(
    data.documents.reduce((sum, d) => sum + d.amountCents, 0),
    0,
);
assert.ok(data.documents.every((d) => d.number && d.finalizedAt));
const report = {
    checkedAt: new Date().toISOString(),
    environment: "isolated-local-qa",
    contractCancelled: true,
    refunded,
    paidCents: data.orders[0].paidCents,
    packageCancelled: true,
    actualSeconds: data.time[0].durationSeconds,
    chargedSeconds: data.time[0].chargedSeconds,
    revision: 1,
    invoiceCount: 2,
    correctionCount: 2,
    netDocumentCents: 0,
};
fs.writeFileSync(
    `tests/output/ledger-${refunded ? "refunded" : "cancelled"}.json`,
    JSON.stringify(report, null, 2),
);
console.log(
    "HTTP-Nachprüfung bestanden: Vertragsstatus, Paketende, korrigiertes Zeitkonto und vollständige Belegkette stimmen überein. Rückzahlung " +
        (refunded ? "nachgewiesen." : "noch nicht verbucht."),
);
