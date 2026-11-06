import { randomInt } from "node:crypto";
import { and, eq, gt, isNull, lt } from "drizzle-orm";
import { db, type Db } from "./db";
import { users, sessions, tokens, guardianConsents } from "./schema";
import {
    assert,
    assertAccountAge,
    audit,
    digest,
    isMinor,
    limit,
    passwordHash,
    passwordMatches,
    secretToken,
    lock,
} from "./security";
import { queueMail, notifyAdmin } from "./events";
import { baseUrl } from "./config";
import { z } from "zod";

const emailSchema = z
    .email()
    .max(254)
    .transform((v) => v.trim().toLowerCase());
export const registrationSchema = z.object({
    name: z.string().trim().min(2).max(100),
    email: emailSchema,
    password: z.string().min(12).max(128),
    birthDate: z.iso.date(),
    terms: z.literal(true),
    guardianEmail: z.union([emailSchema, z.literal("")]).optional(),
    guardianName: z.string().trim().max(100).optional(),
    returnTo: z.literal("/kalender").optional(),
});
type Purpose = "verify" | "reset" | "admin_otp" | "guardian";
export async function issueToken(
    userId: string,
    purpose: Purpose,
    database: Db = db(),
    returnTo?: "/kalender",
) {
    const token =
        purpose === "admin_otp"
            ? String(randomInt(100000, 1000000))
            : secretToken();
    await database
        .update(tokens)
        .set({ usedAt: new Date() })
        .where(
            and(
                eq(tokens.userId, userId),
                eq(tokens.purpose, purpose),
                isNull(tokens.usedAt),
            ),
        );
    await database.insert(tokens).values({
        userId,
        purpose,
        hash: digest(token),
        expiresAt: new Date(
            Date.now() + (purpose === "admin_otp" ? 10 : 60) * 60_000,
        ),
    });
    const [user] = await database
        .select()
        .from(users)
        .where(eq(users.id, userId));
    let recipient = user.email;
    if (purpose === "guardian") {
        const [consent] = await database
            .select()
            .from(guardianConsents)
            .where(eq(guardianConsents.userId, userId));
        recipient = consent.email;
    }
    const subject = {
        verify: "Bestätige Deine E-Mail-Adresse",
        reset: "Dein Passwort zurücksetzen",
        admin_otp: "Dein einmaliger Sicherheitscode",
        guardian: "Zustimmung zur Plattformnutzung",
    }[purpose];
    const route = {
        verify: "email-bestaetigen",
        reset: "passwort-zuruecksetzen",
        guardian: "zustimmung",
        admin_otp: "otp",
    }[purpose];
    await queueMail(
        recipient,
        subject,
        purpose === "admin_otp"
            ? `Dein einmaliger Code: ${token}. Er gilt zehn Minuten.`
            : "Bitte öffne den folgenden Link. Er gilt 60 Minuten und kann einmal verwendet werden.",
        `${purpose}:${digest(token)}`,
        {
            userId,
            url:
                purpose === "admin_otp"
                    ? undefined
                    : `${baseUrl()}/${route}?token=${token}${purpose === "verify" && returnTo ? "&next=%2Fkalender" : ""}`,
        },
        database,
    );
    return token;
}
export async function consumeToken(
    token: string,
    purpose: Purpose,
    userId?: string,
    database: Db = db(),
) {
    const conditions = [
        eq(tokens.purpose, purpose),
        isNull(tokens.usedAt),
        gt(tokens.expiresAt, new Date()),
        lt(tokens.attempts, 5),
    ];
    if (userId) conditions.push(eq(tokens.userId, userId));
    if (purpose !== "admin_otp")
        conditions.push(eq(tokens.hash, digest(token)));
    const [row] = await database
        .select()
        .from(tokens)
        .where(and(...conditions))
        .for("update");
    assert(row, "Der Link oder Code ist ungültig oder abgelaufen.", 422);
    await database
        .update(tokens)
        .set({ attempts: row.attempts + 1 })
        .where(eq(tokens.id, row.id));
    if (row.hash !== digest(token)) return null;
    await database
        .update(tokens)
        .set({ usedAt: new Date() })
        .where(eq(tokens.id, row.id));
    return row.userId;
}
export async function register(input: unknown) {
    const data = registrationSchema.parse(input);
    assert(
        new Date(data.birthDate) < new Date(),
        "Bitte prüfe Dein Geburtsdatum.",
    );
    assertAccountAge(data);
    await limit("register:" + data.email, 5, 3600);
    return db().transaction(async (tx) => {
        await lock("identity", tx);
        const exists = await tx
            .select({ id: users.id })
            .from(users)
            .where(eq(users.email, data.email));
        assert(
            !exists.length,
            "Diese E-Mail-Adresse ist bereits registriert.",
            409,
        );
        const minor = isMinor({ birthDate: data.birthDate });
        if (minor)
            assert(
                data.guardianEmail &&
                    data.guardianEmail !== data.email &&
                    data.guardianName,
                "Bitte gib Name und E-Mail-Adresse einer erziehungsberechtigten Person an.",
            );
        const [user] = await tx
            .insert(users)
            .values({
                name: data.name,
                email: data.email,
                passwordHash: await passwordHash(data.password),
                birthDate: data.birthDate,
                termsAt: new Date(),
            })
            .returning();
        if (minor) {
            await tx.insert(guardianConsents).values({
                userId: user.id,
                email: data.guardianEmail!,
                name: data.guardianName!,
                scope: "registration",
            });
            await issueToken(user.id, "guardian", tx);
        }
        await issueToken(user.id, "verify", tx, data.returnTo);
        await audit(user.id, "registered", "user", user.id, undefined, tx);
        await notifyAdmin(
            "registration",
            "Neue Registrierung",
            `${user.name} hat ein Konto angelegt.`,
            "registration:" + user.id,
            "/admin/kunden",
            tx,
        );
        return { id: user.id };
    });
}
export async function login(email: string, password: string) {
    email = emailSchema.parse(email);
    await limit("login:" + email, 10, 900);
    const [user] = await db()
        .select()
        .from(users)
        .where(eq(users.email, email));
    // Run the same expensive KDF for unknown accounts to reduce enumeration by timing.
    const fallback =
        "scrypt-v1:00000000000000000000000000000000:" + "00".repeat(64);
    const valid = await passwordMatches(
        password,
        user?.passwordHash ?? fallback,
    );
    assert(
        user && valid && !user.disabledAt,
        "E-Mail-Adresse oder Passwort stimmt nicht.",
        401,
    );
    const token = secretToken();
    await db().transaction(async (tx) => {
        await tx.insert(sessions).values({
            userId: user.id,
            tokenHash: digest(token),
            expiresAt: new Date(Date.now() + 12 * 3600_000),
        });
        if (user.role === "admin") await issueToken(user.id, "admin_otp", tx);
        await audit(user.id, "login", "session", undefined, undefined, tx);
    });
    return { token, admin: user.role === "admin" };
}
