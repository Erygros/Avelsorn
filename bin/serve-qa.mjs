import fs from "node:fs";
import { spawn } from "node:child_process";
if (process.env.VERCEL) throw new Error("QA ist ausschließlich lokal erlaubt.");
const config = JSON.parse(fs.readFileSync("data/qa-config.json", "utf8"));
const env = {
    ...process.env,
    PLATFORM_ENV: "development",
    PUBLIC_BASE_URL: config.baseUrl,
    LOCAL_DATABASE_PATH: config.databasePath,
    LOCAL_STORAGE_PATH: config.storagePath,
    DATABASE_URL: "",
    STORAGE_DRIVER: "local",
    APP_SECRET: config.appSecret,
    BACKUP_KEY: config.backupKey,
    SETUP_KEY: config.setupKey,
    VIDEO_DRIVER: "local",
    SMTP_HOST: "",
    SMTP_USERNAME: "",
    SMTP_PASSWORD: "",
    PRODUCTION_APPROVED: "false",
};
const child = spawn(
    process.execPath,
    [
        "node_modules/next/dist/bin/next",
        "start",
        "--hostname",
        "127.0.0.1",
        "--port",
        "3011",
    ],
    { env, stdio: "inherit", windowsHide: true },
);
child.on("exit", (code) => {
    process.exitCode = code ?? 0;
});
process.on("SIGINT", () => child.kill("SIGINT"));
