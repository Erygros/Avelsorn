import { eq } from "drizzle-orm";
import { db, type Db } from "./db";
import { settings } from "./schema";
import { publicKeys } from "./config";
import { BRAND } from "../content/brand";

export async function getSetting<T>(
    key: string,
    fallback: T,
    database: Db = db(),
): Promise<T> {
    const [row] = await database
        .select()
        .from(settings)
        .where(eq(settings.key, key));
    return row ? (row.value as T) : fallback;
}
export async function setSetting(
    key: string,
    value: unknown,
    database: Db = db(),
) {
    await database
        .insert(settings)
        .values({ key, value })
        .onConflictDoUpdate({
            target: settings.key,
            set: { value, updatedAt: new Date() },
        });
}
export async function business(database: Db = db()) {
    const rows = await database.select().from(settings);
    const map = new Map(rows.map((r) => [r.key, r.value]));
    return Object.fromEntries(
        publicKeys.map((key) => [
            key,
            key === "brand_name"
                ? BRAND.name
                : String(map.get(key) ?? `{{${key.toUpperCase()}}}`),
        ]),
    ) as Record<(typeof publicKeys)[number], string>;
}
export async function readiness() {
    const values = await business();
    const required = publicKeys.filter(
        (k) =>
            ![
                "business_name",
                "bic",
                "vat_id_if_available",
                "small_business_id_if_available",
                "contact_hours",
                "about_text",
            ].includes(k),
    );
    const missing: string[] = required.filter(
        (k) => !values[k] || values[k].includes("{{"),
    );
    if (!process.env.DATABASE_URL) missing.push("PostgreSQL-Netzwerkdienst");
    if (
        process.env.STORAGE_DRIVER !== "s3" ||
        !process.env.S3_BUCKET ||
        !process.env.S3_ACCESS_KEY_ID ||
        !process.env.S3_SECRET_ACCESS_KEY
    )
        missing.push("Privater dauerhafter Dateispeicher");
    if (
        !process.env.SMTP_HOST ||
        !process.env.SMTP_USERNAME ||
        !process.env.SMTP_PASSWORD ||
        !process.env.MAIL_FROM_ADDRESS
    )
        missing.push("SMTP");
    const videoDriver =
        process.env.VIDEO_DRIVER ??
        (process.env.VIDEO_PROVIDER_URL || process.env.VIDEO_PROVIDER_SECRET
            ? "provider"
            : "disabled");
    if (
        videoDriver !== "disabled" &&
        (videoDriver === "local" ||
            !process.env.VIDEO_PROVIDER_URL ||
            !process.env.VIDEO_PROVIDER_SECRET)
    )
        missing.push("Videodienst");
    if (!process.env.APP_SECRET || !process.env.BACKUP_KEY)
        missing.push("Sicherheits- und Backupschlüssel");
    if (!process.env.PUBLIC_BASE_URL?.startsWith("https://"))
        missing.push("Öffentliche HTTPS-Basis-URL");
    if (values.public_base_url !== process.env.PUBLIC_BASE_URL)
        missing.push("Übereinstimmende zentrale Basis-URL");
    if (process.env.PRODUCTION_APPROVED !== "true")
        missing.push("Veröffentlichungsfreigabe");
    return missing;
}
