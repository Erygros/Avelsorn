/** Explicit local owner import. Stop the main preview before running. */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { loadEnvConfig } from "@next/env";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { connectDatabase } from "../src/server/db";
import { settings, availability } from "../src/server/schema";
import { publicKeys } from "../src/server/config";
import { audit, lock } from "../src/server/security";

loadEnvConfig(process.cwd());
function validIban(value: string) {
    if (!/^DE\d{20}$/.test(value)) return false;
    let remainder = 0;
    for (const character of value.slice(4) + value.slice(0, 4)) {
        const digits = /[A-Z]/.test(character)
            ? String(character.charCodeAt(0) - 55)
            : character;
        for (const digit of digits)
            remainder = (remainder * 10 + Number(digit)) % 97;
    }
    return remainder === 1;
}
async function main() {
    if (
        process.env.VERCEL ||
        process.env.PLATFORM_ENV === "production" ||
        process.env.PRODUCTION_APPROVED === "true" ||
        process.env.DATABASE_URL
    )
        throw new Error(
            "Dieser Import ist ausschließlich für die lokale Hauptdatenbank vorgesehen.",
        );
    const expected = path.resolve("data/postgres");
    if (
        path.resolve(process.env.LOCAL_DATABASE_PATH ?? "data/postgres") !==
        expected
    )
        throw new Error(
            "Unerwartete Datenbank; kein Import in Test- oder Fremddatenbanken.",
        );
    const file = process.argv[2];
    if (!file) throw new Error("Pfad zur privaten Eingabedatei fehlt.");
    const profile = z
        .object({
            values: z.record(z.string(), z.string().max(2000)),
            hours: z.object({
                start: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
                end: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
            }),
            taxStatus: z.literal("small_business_self_reported"),
        })
        .parse(JSON.parse(readFileSync(file, "utf8")));
    if (profile.values.contact_email)
        z.email().parse(profile.values.contact_email);
    for (const key of Object.keys(profile.values))
        if (
            key === "brand_name" ||
            !publicKeys.includes(key as (typeof publicKeys)[number])
        )
            throw new Error("Unzulässiges Geschäftsfeld: " + key);
    if (profile.values.iban && !validIban(profile.values.iban))
        throw new Error("Ungültige IBAN-Prüfziffer.");
    if (
        profile.values.bic &&
        !/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(profile.values.bic)
    )
        throw new Error("Ungültiges BIC-Format.");
    if (profile.hours.start >= profile.hours.end || profile.hours.end > "23:59")
        throw new Error("Ungültiges Terminfenster.");
    const connection = connectDatabase();
    try {
        const before = {
            settings: await connection.db.select().from(settings),
            availability: await connection.db.select().from(availability),
        };
        mkdirSync("data/business-backups", { recursive: true });
        const stamp = new Date().toISOString().replace(/[:.]/g, "-");
        writeFileSync(
            "data/business-backups/before-" + stamp + ".json",
            JSON.stringify(before, null, 2),
            { mode: 0o600 },
        );
        await connection.db.transaction(async (tx) => {
            await lock("settings", tx);
            await lock("calendar", tx);
            for (const [key, value] of Object.entries(profile.values))
                await tx
                    .insert(settings)
                    .values({ key, value })
                    .onConflictDoUpdate({
                        target: settings.key,
                        set: { value, updatedAt: new Date() },
                    });
            await tx
                .insert(settings)
                .values({
                    key: "tax_status_declaration",
                    value: {
                        status: profile.taxStatus,
                        source: "owner",
                        recordedAt: new Date().toISOString(),
                    },
                })
                .onConflictDoUpdate({
                    target: settings.key,
                    set: {
                        value: {
                            status: profile.taxStatus,
                            source: "owner",
                            recordedAt: new Date().toISOString(),
                        },
                        updatedAt: new Date(),
                    },
                });
            for (let weekday = 1; weekday <= 7; weekday++) {
                const rows = await tx
                    .select()
                    .from(availability)
                    .where(eq(availability.weekday, weekday));
                if (rows.length)
                    await tx
                        .update(availability)
                        .set({
                            start: profile.hours.start,
                            end: profile.hours.end,
                            blocked: false,
                        })
                        .where(eq(availability.weekday, weekday));
                else
                    await tx.insert(availability).values({
                        weekday,
                        start: profile.hours.start,
                        end: profile.hours.end,
                        blocked: false,
                    });
            }
            const applied = await tx.select().from(settings);
            for (const [key, value] of Object.entries(profile.values)) {
                const row = applied.find((item) => item.key === key);
                // Match the business() presentation contract, including numeric JSON scalars.
                if (!row || String(row.value) !== value)
                    throw new Error(
                        "Prüfung des gespeicherten Geschäftsfelds fehlgeschlagen.",
                    );
            }
            await audit(
                null,
                "settings.owner_profile_applied",
                "settings",
                undefined,
                {
                    source: "explicit_owner_request",
                    keys: Object.keys(profile.values),
                    weeklyDays: 7,
                    zone: "Europe/Berlin",
                    taxStatus: profile.taxStatus,
                    ibanChecksumValidated: true,
                },
                tx,
            );
        });
        writeFileSync(
            "tests/output/owner-profile-import.json",
            JSON.stringify(
                {
                    fields: Object.keys(profile.values),
                    weeklyDays: 7,
                    ibanChecksumValid: true,
                    audited: true,
                    backupCreated: true,
                    mainDatabase: true,
                    productionApproved: false,
                },
                null,
                2,
            ),
        );
        console.log(
            "Geschäftsangaben und sieben Wochenregeln transaktional gespeichert, geprüft und auditiert. Keine Veröffentlichung.",
        );
    } finally {
        await connection.close();
    }
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
