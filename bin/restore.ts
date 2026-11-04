import { loadEnvConfig } from "@next/env";
import { readFileSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { openSnapshot, restoreEmpty } from "../src/server/backup";
import type { Database } from "../src/server/db";
loadEnvConfig(process.cwd());
async function main() {
    const source = process.argv[2],
        target = process.argv[3];
    if (!source || !target)
        throw new Error(
            "Aufruf: npx tsx bin/restore.ts <Sicherungsdatei> <neuer-leerer-Zielordner>",
        );
    if (process.env.VERCEL)
        throw new Error(
            "Die lokale Wiederherstellung ist auf Vercel nicht verfügbar.",
        );
    const root = path.resolve(target);
    if (existsSync(root))
        throw new Error(
            "Der Zielordner darf noch nicht existieren. Bestehende Daten werden nicht überschrieben.",
        );
    const snapshot = openSnapshot(readFileSync(path.resolve(source)));
    mkdirSync(root, { recursive: true });
    process.env.LOCAL_STORAGE_PATH = path.join(root, "private");
    const local = new PGlite(path.join(root, "postgres"));
    const database = drizzle(local);
    try {
        await migrate(database, { migrationsFolder: "drizzle" });
        const result = await restoreEmpty(
            snapshot,
            database as unknown as Database,
        );
        writeFileSync(
            path.join(root, ".env.restored"),
            `APP_SECRET=${snapshot.appSecret}\nLOCAL_DATABASE_PATH=${path.join(root, "postgres")}\nLOCAL_STORAGE_PATH=${path.join(root, "private")}\nSTORAGE_DRIVER=local\nPLATFORM_ENV=development\nPUBLIC_BASE_URL=http://localhost:3001\n`,
            { flag: "wx", mode: 0o600 },
        );
        console.log(
            `Wiederherstellung abgeschlossen: ${result.tables} Tabellen, ${result.files} Dateien. Wiederhergestellte Geheimniskonfiguration liegt ausschließlich in .env.restored im neuen Zielordner.`,
        );
    } finally {
        await local.close();
    }
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
