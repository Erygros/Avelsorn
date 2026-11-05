import nextEnv from "@next/env";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
nextEnv.loadEnvConfig(process.cwd());
const key = process.env.INDEXNOW_KEY;
if (key) {
    if (!/^indexnow-[a-f0-9]{32}$/.test(key))
        throw Error("INDEXNOW_KEY hat nicht das erwartete Format.");
    const root = path.resolve("public");
    const file = path.join(root, key + ".txt");
    if (path.dirname(file) !== root)
        throw Error("Ungültiger Verifizierungspfad.");
    if (existsSync(file)) {
        if (readFileSync(file, "utf8").trim() !== key)
            throw Error(
                "Vorhandene Verifizierungsdatei wird nicht überschrieben.",
            );
    } else writeFileSync(file, key, { flag: "wx" });
    console.log(
        "Optionale IndexNow-Verifizierungsdatei vorbereitet; keine URLs übermittelt.",
    );
}
