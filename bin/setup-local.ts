import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { loadEnvConfig } from "@next/env";
import { migrate } from "drizzle-orm/pglite/migrator";
import { migrate as migratePg } from "drizzle-orm/node-postgres/migrator";
import { drizzle } from "drizzle-orm/pglite";
import { connectDatabase } from "../src/server/db";
import { posts } from "../src/server/schema";
import { initialArticles } from "../src/content/articles";

async function main() {
    mkdirSync("data", { recursive: true });
    if (!existsSync(".env.local"))
        writeFileSync(
            ".env.local",
            `APP_SECRET=${randomBytes(32).toString("hex")}\nSETUP_KEY=${randomBytes(24).toString("hex")}\nPUBLIC_BASE_URL=http://localhost:3001\nSTORAGE_DRIVER=local\n`,
            { mode: 0o600 },
        );
    loadEnvConfig(process.cwd());
    if(!process.env.TASKS_SECRET){const env=readFileSync('.env.local','utf8');writeFileSync('.env.local',env+`\nTASKS_SECRET=${randomBytes(32).toString('hex')}\n`,{mode:0o600});}
    if (!process.env.BACKUP_KEY) {
        const env = readFileSync(".env.local", "utf8");
        writeFileSync(
            ".env.local",
            env + `\nBACKUP_KEY=${randomBytes(32).toString("hex")}\n`,
            { mode: 0o600 },
        );
    }
    const connection = connectDatabase();
    try {
        if (connection.local)
            await migrate(drizzle(connection.local), {
                migrationsFolder: "drizzle",
            });
        else await migratePg(connection.db, { migrationsFolder: "drizzle" });
        for (const article of initialArticles)
            await connection.db
                .insert(posts)
                .values({
                    ...article,
                    status: "published",
                    publishAt: new Date(),
                })
                .onConflictDoNothing({ target: posts.slug });
        console.log(
            "Datenbankmigrationen angewendet. Einrichtungsschlüssel liegt ausschließlich in .env.local (SETUP_KEY).",
        );
    } finally {
        await connection.close();
    }
    // Readability check without printing secrets.
    if (!readFileSync(".env.local", "utf8").includes("APP_SECRET="))
        throw new Error("APP_SECRET fehlt.");
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

