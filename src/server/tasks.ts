import { and, eq, lte, gt, lt, inArray, isNull, desc } from "drizzle-orm";
import { addMonths } from "date-fns";
import { db } from "./db";
import * as s from "./schema";
import { notify, notifyAdmin, queueMail } from "./events";
import { audit } from "./security";
import { sendOutboxBatch } from "./mail";
import { documentPdf } from "./pdf";
import { storage } from "./storage";
import { createBackup } from "./backup";

export async function runTasks() {
    const now = new Date();
    const results = {
        expiredReservations: 0,
        reminders: 0,
        expiredPackages: 0,
        publishedPosts: 0,
        deletedFiles: 0,
        invoices: 0,
        mail: { sent: 0, configured: false },
    };
    const expired = await db()
        .update(s.bookings)
        .set({ status: "expired", sequence: 1, updatedAt: now })
        .where(
            and(
                eq(s.bookings.status, "reserved"),
                lte(s.bookings.reservedUntil, now),
            ),
        )
        .returning();
    for (const booking of expired) {
        if (booking.orderId)
            await db()
                .update(s.orders)
                .set({ status: "cancelled", cancelledAt: now })
                .where(
                    and(
                        eq(s.orders.id, booking.orderId),
                        eq(s.orders.paidCents, 0),
                    ),
                );
        await notify(
            booking.userId,
            "booking",
            "Deine Reservierung ist abgelaufen",
            "Die Reservierungsfrist ist verstrichen. Der Termin wurde wieder freigegeben. Wenn bereits eine Überweisung unterwegs ist, melde Dich zur Klärung im Portal.",
            "reservation-expired:" + booking.id,
            "/konto/termine",
        );
        results.expiredReservations++;
    }
    const upcoming = await db()
        .select()
        .from(s.bookings)
        .where(
            and(
                eq(s.bookings.status, "confirmed"),
                gt(s.bookings.startsAt, now),
            ),
        );
    for (const booking of upcoming)
        for (const hours of [24, 1]) {
            const due = new Date(booking.startsAt.getTime() - hours * 3600_000);
            if (due <= now && due >= booking.createdAt) {
                const event = `reminder:${booking.id}:${booking.sequence}:${hours}`;
                const existing = await db()
                    .select()
                    .from(s.notifications)
                    .where(eq(s.notifications.eventKey, event));
                if (!existing.length) {
                    await notify(
                        booking.userId,
                        "reminder",
                        `Dein Termin beginnt in weniger als ${hours} ${hours === 1 ? "Stunde" : "Stunden"}`,
                        "Die aktuellen Termindaten findest Du im Kundenkonto.",
                        event,
                        "/konto/termine",
                    );
                    results.reminders++;
                }
            }
        }
    const expiredPackages = await db()
        .update(s.packages)
        .set({ status: "expired" })
        .where(
            and(
                eq(s.packages.status, "active"),
                lte(s.packages.expiresAt, now),
            ),
        )
        .returning();
    for (const pkg of expiredPackages) {
        await notify(
            pkg.userId,
            "package",
            "Dein Paket ist abgelaufen",
            "Es gibt keine automatische Verlängerung. Eine weitere Zusammenarbeit kannst Du ausdrücklich neu bestellen.",
            "package-expired:" + pkg.id,
            "/konto/pakete",
        );
        results.expiredPackages++;
    }
    const ending = await db()
        .select()
        .from(s.packages)
        .where(
            and(
                eq(s.packages.status, "active"),
                gt(s.packages.expiresAt, now),
                lte(
                    s.packages.expiresAt,
                    new Date(now.getTime() + 3 * 86400_000),
                ),
            ),
        );
    for (const pkg of ending) {
        await notify(
            pkg.userId,
            "package",
            "Dein Paket läuft bald ab",
            "Du entscheidest selbst über eine neue Laufzeit. Es erfolgt keine automatische Bestellung.",
            "package-ending:" + pkg.id,
            "/konto/pakete",
        );
        await notifyAdmin(
            "package",
            "Ein Kundenpaket läuft bald ab",
            "Bitte prüfe bei Bedarf die noch offenen Projektaufgaben.",
            "package-ending:" + pkg.id,
            "/admin/pakete",
        );
    }
    const published = await db()
        .update(s.posts)
        .set({ status: "published", updatedAt: now })
        .where(
            and(eq(s.posts.status, "scheduled"), lte(s.posts.publishAt, now)),
        )
        .returning();
    results.publishedPosts = published.length;
    const finalInvoices = await db()
        .select()
        .from(s.documents)
        .where(
            and(
                eq(s.documents.kind, "invoice"),
                inArray(s.documents.status, ["paid", "issued"]),
            ),
        );
    for (const invoice of finalInvoices) {
        const key = "invoice-mail:" + invoice.id;
        const sent = await db()
            .select()
            .from(s.outbox)
            .where(eq(s.outbox.eventKey, key));
        if (!sent.length) {
            await documentPdf(invoice);
            const [fresh] = await db()
                .select()
                .from(s.documents)
                .where(eq(s.documents.id, invoice.id));
            const [user] = await db()
                .select()
                .from(s.users)
                .where(eq(s.users.id, invoice.userId));
            if (fresh.pdfKey) {
                await queueMail(
                    user.email,
                    `Deine Rechnung ${fresh.number}`,
                    `Hallo ${user.name},\n\nDeine Rechnung ist beigefügt. Den Zahlungsstatus und alle Dokumente findest Du im Kundenportal.`,
                    key,
                    {
                        userId: user.id,
                        url:
                            (process.env.PUBLIC_BASE_URL ??
                                "http://localhost:3001") + "/konto/rechnungen",
                        attachments: [fresh.pdfKey],
                    },
                );
                results.invoices++;
            }
        }
        if (invoice.status === "issued" && invoice.dueAt)
            for (const days of [3, 7])
                if (
                    now.getTime() >=
                    invoice.dueAt.getTime() + days * 86400_000
                ) {
                    const [order] = invoice.orderId
                        ? await db()
                              .select()
                              .from(s.orders)
                              .where(eq(s.orders.id, invoice.orderId))
                        : [];
                    if (
                        order &&
                        ["open", "partial", "overdue"].includes(order.status) &&
                        order.paidCents < order.amountCents
                    )
                        await notify(
                            invoice.userId,
                            "payment",
                            "Freundliche Zahlungserinnerung",
                            `Zu Deiner Rechnung ${invoice.number} ist noch ein Betrag offen. Falls Du bereits überwiesen hast, melde Dich gern zur Klärung.`,
                            `invoice-reminder:${invoice.id}:${days}`,
                            "/konto/rechnungen",
                        );
                }
    }
    const completedProjects = await db()
        .select()
        .from(s.projects)
        .where(eq(s.projects.status, "completed"));
    for (const project of completedProjects)
        if (project.completedAt)
            await db()
                .update(s.files)
                .set({ deleteAfter: addMonths(project.completedAt, 6) })
                .where(
                    and(
                        eq(s.files.projectId, project.id),
                        eq(s.files.category, "project"),
                        isNull(s.files.deleteAfter),
                    ),
                );
    const retentionFiles = await db()
        .select()
        .from(s.files)
        .where(
            and(
                eq(s.files.category, "project"),
                isNull(s.files.deletedAt),
                lte(
                    s.files.deleteAfter,
                    new Date(now.getTime() + 14 * 86400_000),
                ),
            ),
        );
    for (const file of retentionFiles) {
        if (!file.noticeAt) {
            await notify(
                file.userId,
                "file",
                "Eine Projektdatei wird bald gelöscht",
                `${file.name} erreicht die vorgesehene Aufbewahrungsfrist. Bitte sichere benötigte Unterlagen rechtzeitig. Gesetzlich aufzubewahrende Rechnungen sind hiervon ausgenommen.`,
                "file-retention:" + file.id,
                "/konto/dateien",
            );
            await db()
                .update(s.files)
                .set({ noticeAt: now })
                .where(eq(s.files.id, file.id));
        } else if (
            file.deleteAfter! <= now &&
            file.noticeAt.getTime() <= now.getTime() - 7 * 86400_000
        ) {
            await storage().remove(file.key);
            await db()
                .update(s.files)
                .set({ deletedAt: now })
                .where(eq(s.files.id, file.id));
            await audit(null, "file.retention_deleted", "file", file.id);
            results.deletedFiles++;
        }
    }
    const stale = await db()
        .update(s.outbox)
        .set({ status: "delivery_unknown", errorCode: "STALE_DELIVERY_REVIEW" })
        .where(
            and(
                eq(s.outbox.status, "sending"),
                lt(s.outbox.claimedAt, new Date(now.getTime() - 15 * 60_000)),
            ),
        )
        .returning();
    for (const mail of stale)
        await notifyAdmin(
            "mail",
            "Unklarer Versandstatus",
            "Bitte prüfe den tatsächlichen Versand, bevor eine Nachricht erneut gesendet wird. So vermeiden wir unkontrollierte Doppelzustellungen.",
            "mail-unknown:" + mail.id,
            "/admin/email",
        );
    await db().delete(s.sessions).where(lte(s.sessions.expiresAt, now));
    await db()
        .delete(s.tokens)
        .where(lt(s.tokens.expiresAt, new Date(now.getTime() - 7 * 86400_000)));
    await db().delete(s.videoSignals).where(lte(s.videoSignals.expiresAt, now));
    await db()
        .delete(s.rateLimits)
        .where(lt(s.rateLimits.expiresAt, new Date(now.getTime() - 86400_000)));
    const [lastBackup] = await db()
        .select()
        .from(s.backups)
        .where(eq(s.backups.status, "completed"))
        .orderBy(desc(s.backups.createdAt))
        .limit(1);
    if (
        process.env.BACKUP_KEY &&
        (!lastBackup ||
            lastBackup.createdAt.getTime() < now.getTime() - 86400_000)
    ) {
        try {
            await createBackup(null);
        } catch {
            await notifyAdmin(
                "backup",
                "Automatische Sicherung fehlgeschlagen",
                "Bitte prüfe Schlüssel, Speicher und Datenbank. Die letzte erfolgreiche Sicherung und der Prüfstatus sind im Adminbereich sichtbar.",
                "backup-failed:" + now.toISOString().slice(0, 10),
                "/admin/backups",
            );
        }
    }
    const oldBackups = await db()
        .select()
        .from(s.backups)
        .where(
            and(
                eq(s.backups.status, "completed"),
                lt(
                    s.backups.createdAt,
                    new Date(now.getTime() - 30 * 86400_000),
                ),
            ),
        );
    for (const backup of oldBackups)
        if (backup.key) {
            await storage().remove(backup.key);
            await db()
                .update(s.backups)
                .set({ status: "deleted", key: null })
                .where(eq(s.backups.id, backup.id));
        }
    results.mail = await sendOutboxBatch();
    await db()
        .insert(s.jobReceipts)
        .values({ key: "last-tasks-run", completedAt: now })
        .onConflictDoUpdate({
            target: s.jobReceipts.key,
            set: { completedAt: now },
        });
    return results;
}
