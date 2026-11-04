import { writeFileSync, mkdirSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { initialArticles } from "../src/content/articles";
import { posts } from "../src/server/schema";

async function main() {
    if (process.env.VERCEL)
        throw new Error("QA ist ausschließlich lokal erlaubt.");
    mkdirSync("data", { recursive: true });
    const run = randomBytes(5).toString("hex");
    const config = {
        run,
        baseUrl: "http://localhost:3011",
        databasePath: `data/qa-${run}/postgres`,
        storagePath: `data/qa-${run}/private`,
        appSecret: randomBytes(32).toString("hex"),
        backupKey: randomBytes(32).toString("hex"),
        setupKey: randomBytes(24).toString("hex"),
        password: randomBytes(24).toString("base64url"),
        adminEmail: "admin@qa.example.test",
        customerEmail: "kunde@qa.example.test",
    };
    mkdirSync(`data/qa-${run}`, { recursive: true });
    writeFileSync("data/qa-config.json", JSON.stringify(config), {
        mode: 0o600,
    });
    const local = new PGlite(config.databasePath);
    const database = drizzle(local);
    try {
        await migrate(database, { migrationsFolder: "drizzle" });
        for (const article of initialArticles)
            await database
                .insert(posts)
                .values({
                    ...article,
                    status: "published",
                    publishAt: new Date(),
                });
    } finally {
        await local.close();
    }
    console.log(
        "Isolierte QA-Datenbank vorbereitet. Keine Testkonten in der Hauptdatenbank angelegt.",
    );
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
