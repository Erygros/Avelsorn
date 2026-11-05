/** Configures the hosted Supabase scheduler after the production route is ready. */
import {
    readFileSync,
    writeFileSync,
    mkdtempSync,
    unlinkSync,
    rmdirSync,
    existsSync,
} from "node:fs";
import path from "node:path";
import { tmpdir } from "node:os";
import { spawn } from "node:child_process";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());
async function main() {
    const projectRef = process.argv[2];
    const cli = process.env.SUPABASE_CLI_PATH;
    const secret = process.env.TASKS_SECRET;
    const base = process.env.PUBLIC_BASE_URL;
    if (
        !projectRef ||
        !/^[a-z]{20}$/.test(projectRef) ||
        !cli ||
        !secret ||
        !/^[a-f0-9]{64}$/i.test(secret) ||
        !base?.startsWith("https://")
    )
        throw new Error(
            "Projekt, CLI-Pfad, HTTPS-Adresse und Aufgabenschlüssel sind erforderlich.",
        );
    const linked = readFileSync(
        path.resolve("data/supabase-avel/supabase/.temp/project-ref"),
        "utf8",
    ).trim();
    if (linked !== projectRef)
        throw new Error("Die Supabase-Verknüpfung stimmt nicht überein.");
    const origin = new URL(base).origin.replace(/'/g, "''");
    const directory = mkdtempSync(path.join(tmpdir(), "avelsorn-reminders-"));
    const file = path.join(directory, "schedule.sql");
    try {
        writeFileSync(
            file,
            `
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;
DO $body$
DECLARE existing uuid;
BEGIN
 SELECT id INTO existing FROM vault.secrets WHERE name='avelsorn_tasks_secret';
 IF existing IS NULL THEN
   PERFORM vault.create_secret('${secret}','avelsorn_tasks_secret','Avelsorn task authentication');
 ELSE
   PERFORM vault.update_secret(existing,'${secret}');
 END IF;
END $body$;
SELECT cron.schedule('avelsorn-reminders','* * * * *',
 $job$ SELECT net.http_post(
   url:='${origin}/api/tasks',
   headers:=jsonb_build_object('Content-Type','application/json','Authorization','Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name='avelsorn_tasks_secret')),
   body:='{}'::jsonb,
   timeout_milliseconds:=55000
 ); $job$
);
`,
            { mode: 0o600 },
        );
        const code = await new Promise<number | null>((resolve, reject) => {
            const child = spawn(
                cli,
                [
                    "db",
                    "query",
                    "--linked",
                    "--workdir",
                    "data/supabase-avel",
                    "-f",
                    file,
                ],
                { stdio: ["ignore", "ignore", "ignore"], windowsHide: true },
            );
            child.on("error", reject);
            child.on("close", resolve);
        });
        if (code !== 0)
            throw new Error(
                "Supabase-Zeitplanung konnte nicht gespeichert werden.",
            );
        console.log("Supabase-Erinnerungen im Minutentakt konfiguriert.");
    } finally {
        // This directory is created above and contains only this invocation's SQL.
        if (existsSync(file)) unlinkSync(file);
        rmdirSync(directory);
    }
}
main().catch((error) => {
    console.error(
        error instanceof Error ? error.message : "Konfiguration fehlgeschlagen",
    );
    process.exitCode = 1;
});
