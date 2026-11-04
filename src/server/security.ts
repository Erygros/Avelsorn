import {
    createHash,
    randomBytes,
    createCipheriv,
    createDecipheriv,
    timingSafeEqual,
    scrypt as scryptCb,
} from "node:crypto";
import { cookies } from "next/headers";
import { and, eq, gt, sql } from "drizzle-orm";
import { db, type Db } from "./db";
import {
    sessions,
    users,
    locks,
    rateLimits,
    auditEvents,
    type User,
} from "./schema";

const scrypt = (value: string, salt: string): Promise<Buffer> =>
    new Promise((resolve, reject) =>
        scryptCb(
            value,
            salt,
            64,
            { N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024 },
            (error, result) => (error ? reject(error) : resolve(result)),
        ),
    );
export class AppError extends Error {
    constructor(
        message: string,
        public status = 400,
    ) {
        super(message);
    }
}
export function assert(
    value: unknown,
    message: string,
    status = 400,
): asserts value {
    if (!value) throw new AppError(message, status);
}
export const digest = (value: string | Buffer) =>
    createHash("sha256").update(value).digest("hex");
export const secretToken = () => randomBytes(32).toString("base64url");
export function key(): Buffer {
    const raw = process.env.APP_SECRET;
    if (!raw || Buffer.from(raw, "hex").length !== 32)
        throw new Error(
            "APP_SECRET muss ein zufälliger 32-Byte-Hexwert sein. npm run setup:local ausführen.",
        );
    return Buffer.from(raw, "hex");
}
export function encrypt(value: string): string {
    const iv = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", key(), iv);
    const body = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
    return Buffer.concat([iv, cipher.getAuthTag(), body]).toString("base64");
}
export function decrypt(value: string): string {
    const data = Buffer.from(value, "base64");
    const cipher = createDecipheriv("aes-256-gcm", key(), data.subarray(0, 12));
    cipher.setAuthTag(data.subarray(12, 28));
    return Buffer.concat([
        cipher.update(data.subarray(28)),
        cipher.final(),
    ]).toString("utf8");
}
export async function passwordHash(value: string) {
    assert(
        value.length >= 12 && value.length <= 128,
        "Dein Passwort muss 12 bis 128 Zeichen enthalten.",
    );
    const salt = randomBytes(16).toString("hex");
    const derived = await scrypt(value, salt);
    return `scrypt-v1:${salt}:${derived.toString("hex")}`;
}
export async function passwordMatches(
    value: string,
    stored: string,
): Promise<boolean> {
    const [algorithm, salt, hash] = stored.split(":");
    if (algorithm !== "scrypt-v1" || !salt || !hash || value.length > 128)
        return false;
    const derived = await scrypt(value, salt);
    const expected = Buffer.from(hash, "hex");
    return (
        expected.length === derived.length && timingSafeEqual(derived, expected)
    );
}
export async function audit(
    actorId: string | null,
    action: string,
    resource: string,
    resourceId?: string,
    metadata?: unknown,
    database: Db = db(),
) {
    await database
        .insert(auditEvents)
        .values({ actorId, action, resource, resourceId, metadata });
}
export async function lock(name: string, database: Db) {
    await database.insert(locks).values({ name }).onConflictDoNothing();
    await database
        .update(locks)
        .set({ version: sql`${locks.version} + 1` })
        .where(eq(locks.name, name));
}
export async function limit(
    keyName: string,
    max: number,
    seconds: number,
    database: Db = db(),
) {
    const keyHash = digest(keyName);
    const now = new Date();
    const [row] = await database
        .insert(rateLimits)
        .values({
            key: keyHash,
            count: 1,
            expiresAt: new Date(now.getTime() + seconds * 1000),
        })
        .onConflictDoUpdate({
            target: rateLimits.key,
            set: {
                count: sql`CASE WHEN ${rateLimits.expiresAt} <= ${now} THEN 1 ELSE ${rateLimits.count}+1 END`,
                expiresAt: sql`CASE WHEN ${rateLimits.expiresAt} <= ${now} THEN ${new Date(now.getTime() + seconds * 1000)} ELSE ${rateLimits.expiresAt} END`,
            },
        })
        .returning();
    assert(
        row.count <= max,
        "Zu viele Versuche. Bitte versuche es später erneut.",
        429,
    );
}
export async function currentUser(): Promise<
    (User & { sessionId: string; adminVerified: boolean }) | null
> {
    const jar = await cookies();
    const token = jar.get("platform_session")?.value;
    if (!token) return null;
    const [row] = await db()
        .select({ user: users, session: sessions })
        .from(sessions)
        .innerJoin(users, eq(users.id, sessions.userId))
        .where(
            and(
                eq(sessions.tokenHash, digest(token)),
                gt(sessions.expiresAt, new Date()),
            ),
        );
    return row && !row.user.disabledAt
        ? {
              ...row.user,
              sessionId: row.session.id,
              adminVerified: row.session.adminVerified,
          }
        : null;
}
export async function requireUser(admin = false) {
    const user = await currentUser();
    assert(user, "Bitte melde Dich an.", 401);
    if (admin)
        assert(
            user.role === "admin" && user.adminVerified,
            "Administratorzugang mit Sicherheitscode erforderlich.",
            403,
        );
    return user;
}
export function isMinor(
    user: Pick<User, "birthDate">,
    at = new Date(),
): boolean {
    const birth = new Date(user.birthDate + "T00:00:00Z");
    const adult = new Date(birth);
    adult.setUTCFullYear(adult.getUTCFullYear() + 18);
    return adult > at;
}
export function readyCustomer(user: User, paid = false) {
    assert(user.verifiedAt, "Bestätige zuerst Deine E-Mail-Adresse.", 403);
    assert(user.onboardingAt, "Schließe zuerst Deinen Fragebogen ab.", 422);
    if (isMinor(user))
        assert(
            user.guardianApprovedAt,
            "Die überprüfte Zustimmung Deiner Erziehungsberechtigten fehlt.",
            422,
        );
    if (paid)
        assert(
            user.billingAddress,
            "Ergänze zuerst Deine Rechnungsanschrift.",
            422,
        );
}
export function owns(user: User, row: { userId: string } | undefined) {
    assert(
        row && (user.role === "admin" || row.userId === user.id),
        "Der Eintrag wurde nicht gefunden.",
        404,
    );
    return row;
}
export function checkOrigin(request: Request) {
    const origin = request.headers.get("origin");
    const expected = new URL(process.env.PUBLIC_BASE_URL ?? request.url).origin;
    assert(
        origin === expected,
        "Die Anfrage stammt nicht von dieser Anwendung.",
        403,
    );
    assert(
        request.headers.get("content-type")?.startsWith("application/json"),
        "JSON-Anfrage erforderlich.",
        415,
    );
}
