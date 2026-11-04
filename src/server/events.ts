import { eq } from "drizzle-orm";
import { db, type Db } from "./db";
import { outbox, notifications, users } from "./schema";
import { encrypt } from "./security";
import { baseUrl } from "./config";

export async function queueMail(
    to: string,
    subject: string,
    body: string,
    eventKey: string,
    options: { userId?: string; url?: string; attachments?: string[] } = {},
    database: Db = db(),
) {
    await database
        .insert(outbox)
        .values({
            to,
            subject,
            encryptedBody: encrypt(body),
            eventKey,
            userId: options.userId,
            ctaUrl: options.url ? "enc:" + encrypt(options.url) : null,
            attachmentKeys: options.attachments ?? [],
            availableAt: new Date(),
        })
        .onConflictDoNothing({ target: outbox.eventKey });
}
export async function notify(
    userId: string,
    type: string,
    title: string,
    body: string,
    eventKey: string,
    url = "/konto",
    database: Db = db(),
) {
    await database
        .insert(notifications)
        .values({ userId, type, title, body, eventKey, url })
        .onConflictDoNothing({ target: notifications.eventKey });
    const [user] = await database
        .select()
        .from(users)
        .where(eq(users.id, userId));
    if (user)
        await queueMail(
            user.email,
            title,
            `Hallo ${user.name},\n\n${body}`,
            eventKey,
            { userId, url: baseUrl() + url },
            database,
        );
}
export async function notifyAdmin(
    type: string,
    title: string,
    body: string,
    eventKey: string,
    url = "/admin",
    database: Db = db(),
) {
    const [admin] = await database
        .select()
        .from(users)
        .where(eq(users.role, "admin"));
    if (admin)
        await notify(
            admin.id,
            type,
            title,
            body,
            "admin:" + eventKey,
            url,
            database,
        );
}
