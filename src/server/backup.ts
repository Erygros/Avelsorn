import { randomBytes, createCipheriv, createDecipheriv } from "node:crypto";
import { gzipSync, gunzipSync } from "node:zlib";
import { sql, eq } from "drizzle-orm";
import type { AnyPgTable } from "drizzle-orm/pg-core";
import { getTableName } from "drizzle-orm";
import { db, type Database } from "./db";
import * as s from "./schema";
import { storage } from "./storage";
import { assert, digest, audit } from "./security";

const tables: AnyPgTable[] = [
    s.users,
    s.sessions,
    s.tokens,
    s.settings,
    s.locks,
    s.auditEvents,
    s.rateLimits,
    s.onboarding,
    s.guardianConsents,
    s.availability,
    s.orders,
    s.bookings,
    s.packages,
    s.payments,
    s.projects,
    s.tasks,
    s.timeEntries,
    s.projectComments,
    s.approvals,
    s.files,
    s.messages,
    s.documents,
    s.sequences,
    s.notifications,
    s.outbox,
    s.posts,
    s.pages,
    s.media,
    s.contacts,
    s.privacyRequests,
    s.consents,
    s.statistics,
    s.withdrawals,
    s.jobReceipts,
    s.videoSignals,
    s.videoRooms,
    s.calendarBlocks,
];
type Snapshot = {
    format: 1;
    createdAt: string;
    appSecret: string;
    tables: Record<string, unknown[]>;
    files: Record<string, string>;
};
function backupKey() {
    assert(
        process.env.BACKUP_KEY &&
            /^[0-9a-f]{64}$/i.test(process.env.BACKUP_KEY),
        "Ein gesonderter BACKUP_KEY ist erforderlich.",
    );
    return Buffer.from(process.env.BACKUP_KEY, "hex");
}
export async function exportSnapshot(
    database: Database = db(),
): Promise<Snapshot> {
    const result: Snapshot = {
        format: 1,
        createdAt: new Date().toISOString(),
        appSecret: process.env.APP_SECRET!,
        tables: {},
        files: {},
    };
    await database.transaction(async (tx) => {
        for (const table of tables) {
            const name = getTableName(table);
            const raw = await tx.execute(
                sql`SELECT * FROM ${sql.identifier(name)}`,
            );
            result.tables[name] = raw.rows;
        }
    });
    const files = await database.select().from(s.files);
    const documents = await database.select().from(s.documents);
    const keys = new Set([
        ...files.filter((f) => !f.deletedAt).map((f) => f.key),
        ...documents.map((d) => d.pdfKey).filter((key): key is string => !!key),
    ]);
    for (const key of keys)
        result.files[key] = (await storage().get(key)).toString("base64");
    return result;
}
export function sealSnapshot(snapshot: Snapshot): Buffer {
    const iv = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", backupKey(), iv);
    const compressed = gzipSync(Buffer.from(JSON.stringify(snapshot)));
    const body = Buffer.concat([cipher.update(compressed), cipher.final()]);
    return Buffer.concat([Buffer.from("UBP1"), iv, cipher.getAuthTag(), body]);
}
export function openSnapshot(data: Buffer): Snapshot {
    assert(
        data.subarray(0, 4).toString() === "UBP1",
        "Unbekanntes Backupformat.",
    );
    const cipher = createDecipheriv(
        "aes-256-gcm",
        backupKey(),
        data.subarray(4, 16),
    );
    cipher.setAuthTag(data.subarray(16, 32));
    const compressed = Buffer.concat([
        cipher.update(data.subarray(32)),
        cipher.final(),
    ]);
    const result = JSON.parse(
        gunzipSync(compressed, { maxOutputLength: 512 * 1024 * 1024 }).toString(
            "utf8",
        ),
    );
    assert(
        result.format === 1 && result.tables && result.files,
        "Ungültiges Backup.",
    );
    return result;
}
export async function restoreEmpty(snapshot: Snapshot, database: Database) {
    const [existing] = await database
        .select({ id: s.users.id })
        .from(s.users)
        .limit(1);
    assert(
        !existing,
        "Wiederherstellung ist ausschließlich in eine leere, separat migrierte Datenbank erlaubt.",
        409,
    );
    await database.transaction(async (tx) => {
        for (const table of tables) {
            const name = getTableName(table);
            const rows = snapshot.tables[name];
            if (rows?.length)
                await tx.execute(
                    sql`INSERT INTO ${sql.identifier(name)} SELECT * FROM jsonb_populate_recordset(NULL::${sql.identifier(name)},${JSON.stringify(rows)}::jsonb)`,
                );
        }
    });
    // Files are restored only after all database constraints passed.
    for (const [key, value] of Object.entries(snapshot.files))
        await storage().put(
            key,
            Buffer.from(value, "base64"),
            "application/octet-stream",
        );
    return {
        tables: Object.keys(snapshot.tables).length,
        files: Object.keys(snapshot.files).length,
    };
}
export async function createBackup(actorId: string | null) {
    const [record] = await db()
        .insert(s.backups)
        .values({ status: "running" })
        .returning();
    try {
        const snapshot = await exportSnapshot();
        const data = sealSnapshot(snapshot);
        const key = `backups/${record.id}.backup`;
        await storage().put(key, data, "application/octet-stream");
        await db()
            .update(s.backups)
            .set({
                status: "completed",
                key,
                sha256: digest(data),
                size: data.length,
            })
            .where(eq(s.backups.id, record.id));
        await audit(actorId, "backup.created", "backup", record.id);
        return { id: record.id };
    } catch (error) {
        await db()
            .update(s.backups)
            .set({ status: "failed", errorCode: "BACKUP_FAILED" })
            .where(eq(s.backups.id, record.id));
        throw error;
    }
}
