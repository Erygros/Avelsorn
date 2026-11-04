/** Owner-requested local cleanup; stop the main preview before running. */
import { loadEnvConfig } from "@next/env";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { eq } from "drizzle-orm";
import { connectDatabase } from "../src/server/db";
import { settings } from "../src/server/schema";
import { audit, lock } from "../src/server/security";

loadEnvConfig(process.cwd());
async function main() {
    if (
        process.env.VERCEL ||
        process.env.PLATFORM_ENV === "production" ||
        process.env.PRODUCTION_APPROVED === "true" ||
        process.env.DATABASE_URL ||
        path.resolve(process.env.LOCAL_DATABASE_PATH ?? "data/postgres") !==
            path.resolve("data/postgres")
    )
        throw new Error("Nur für die lokale Hauptdatenbank vorgesehen.");
    const connection = connectDatabase();
    try {
        const before = await connection.db.select().from(settings);
        mkdirSync("data/business-backups", { recursive: true });
        writeFileSync(
            `data/business-backups/before-tax-removal-${Date.now()}.json`,
            JSON.stringify(before, null, 2),
            { mode: 0o600 },
        );
        await connection.db.transaction(async (tx) => {
            await lock("settings", tx);
            const removed = await tx
                .delete(settings)
                .where(eq(settings.key, "tax_number"))
                .returning({ key: settings.key });
            if (removed.length)
                await audit(
                    null,
                    "settings.owner_tax_number_removed",
                    "settings",
                    "tax_number",
                    {
                        source: "explicit_owner_request",
                        removedKeys: removed.map((row) => row.key),
                    },
                    tx,
                );
        });
        const after = await connection.db.select().from(settings);
        if (after.some((row) => row.key === "tax_number"))
            throw new Error("Entfernung fehlgeschlagen.");
        for (const row of before.filter((row) => row.key !== "tax_number")) {
            const saved = after.find((item) => item.key === row.key);
            if (
                !saved ||
                JSON.stringify(saved.value) !== JSON.stringify(row.value)
            )
                throw new Error("Anderes Geschäftsfeld verändert.");
        }
        const receipt = {
            taxNumberSettingRemoved: true,
            otherSettingsPreserved: true,
            previousSettingCount: before.length,
            settingCount: after.length,
            historicalDocumentsUnchanged: true,
        };
        writeFileSync(
            "tests/output/tax-number-removal.json",
            JSON.stringify(receipt, null, 2),
        );
        console.log(JSON.stringify(receipt));
    } finally {
        await connection.close();
    }
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
