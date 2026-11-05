import { and, eq, gt, inArray, sql } from "drizzle-orm";
import { z } from "zod";
import { db, type Db } from "./db";
import { guestBookings, bookings, users, outbox } from "./schema";
import { assert, audit, digest, lock, secretToken } from "./security";
import { ensureFree, introDetails } from "./calendar";
import { queueMail, notifyAdmin } from "./events";
import { business } from "./settings";
import { baseUrl, berlin } from "./config";

export const guestInput = introDetails.omit({ company: true }).extend({
    email: z.email().trim().toLowerCase().max(254),
    topic: z.string().trim().min(3, "Beschreibe Dein Anliegen kurz.").max(2000),
    startsAt: z.iso.datetime(),
    terms: z.literal(true),
    requestId: z.uuid(),
    website: z.string().max(0).optional(),
});
export type GuestBooking = typeof guestBookings.$inferSelect;
export const guestAccessDays = 30;
export function guestView(booking: GuestBooking) {
    return {
        id: booking.id,
        firstName: booking.firstName,
        lastName: booking.lastName,
        email: booking.email,
        phone: booking.phone,
        topic: booking.topic,
        startsAt: booking.startsAt.toISOString(),
        endsAt: booking.endsAt.toISOString(),
        status: booking.status,
        sequence: booking.sequence,
    };
}
export async function guestAccess(token: string, database: Db = db()) {
    assert(
        /^[A-Za-z0-9_-]{43}$/.test(token),
        "Der Zugangslink ist ungültig oder abgelaufen.",
        401,
    );
    const [booking] = await database
        .select()
        .from(guestBookings)
        .where(
            and(
                eq(guestBookings.tokenHash, digest(token)),
                gt(guestBookings.accessExpiresAt, new Date()),
            ),
        );
    assert(booking, "Der Zugangslink ist ungültig oder abgelaufen.", 401);
    return booking;
}
export async function guestMessage(booking: GuestBooking, database: Db = db()) {
    const values = await business(database);
    return [
        "Hallo " + booking.firstName + ",",
        booking.status === "cancelled"
            ? "Dein kostenloses Erstgespräch wurde abgesagt. Zu diesem Termin erfolgt kein Anruf."
            : "Dein kostenloses und unverbindliches Erstgespräch (15 Minuten):\n" +
              berlin(booking.startsAt) +
              " Uhr (Europe/Berlin).\nIch melde mich zum gebuchten Termin telefonisch bei Dir.",
        "Deine Telefonnummer: " + booking.phone,
        "Bei Rückfragen erreichst Du mich unter: " + values.public_phone,
        "Verschieben oder absagen kannst Du über den geschützten Link aus Deiner Terminbestätigung. Dieser Link gilt bis 30 Tage nach dem aktuell gebuchten Termin. Gib ihn bitte nicht weiter.",
        "Freundliche Grüße\n" + values.legal_full_name + "\nAvelsorn",
    ].join("\n\n");
}
export async function guestNotice(
    booking: GuestBooking,
    kind: "confirmation" | "cancellation" | "reminder",
    database: Db,
    token?: string,
    reminderHours?: number,
) {
    const subject =
        kind === "cancellation"
            ? "Dein Erstgespräch bei Avelsorn – Terminabsage"
            : kind === "reminder"
              ? "Erinnerung an Dein Erstgespräch bei Avelsorn"
              : "Dein Erstgespräch bei Avelsorn – Terminbestätigung";
    await queueMail(
        booking.email,
        subject,
        await guestMessage(booking, database),
        `guest:${booking.id}:${booking.sequence}:${kind}${reminderHours ? ":" + reminderHours : ""}`,
        {
            url: token
                ? baseUrl() + "/kalender/gast#zugang=" + token
                : undefined,
            calendarEvent: {
                guestBookingId: booking.id,
                sequence: booking.sequence,
                kind,
            },
        },
        database,
    );
}
export async function bookGuest(raw: unknown) {
    const input = guestInput.parse(raw);
    const token = secretToken();
    return db().transaction(async (tx) => {
        await lock("calendar", tx);
        const [retry] = await tx
            .select({ id: guestBookings.id })
            .from(guestBookings)
            .where(eq(guestBookings.requestId, input.requestId));
        assert(
            !retry,
            "Diese Buchungsanfrage wurde bereits verarbeitet. Bitte prüfe Deine Bestätigungs-E-Mail, bevor Du erneut buchst.",
            409,
        );
        const start = new Date(input.startsAt),
            end = new Date(start.getTime() + 900_000);
        assert(
            start.getTime() <= Date.now() + 365 * 86400_000,
            "Bitte wähle einen Termin innerhalb der nächsten zwölf Monate.",
        );
        await ensureFree(start, end, tx);
        const previousGuests = await tx
            .select({ id: guestBookings.id })
            .from(guestBookings)
            .where(
                and(
                    eq(guestBookings.email, input.email),
                    inArray(guestBookings.status, ["confirmed", "completed"]),
                ),
            );
        const previousCustomer = await tx
            .select({ id: bookings.id })
            .from(bookings)
            .innerJoin(users, eq(users.id, bookings.userId))
            .where(
                and(
                    sql`lower(${users.email}) = ${input.email}`,
                    eq(bookings.product, "intro"),
                    inArray(bookings.status, ["confirmed", "completed"]),
                ),
            );
        assert(
            !previousGuests.length && !previousCustomer.length,
            "Für diese Kontaktdaten wurde bereits ein Erstgespräch gebucht. Nutze bitte Deine Terminbestätigung oder melde Dich bei uns.",
            409,
        );
        const [booking] = await tx
            .insert(guestBookings)
            .values({
                firstName: input.firstName,
                lastName: input.lastName,
                email: input.email,
                phone: input.phone,
                topic: input.topic,
                startsAt: start,
                endsAt: end,
                tokenHash: digest(token),
                accessExpiresAt: new Date(
                    end.getTime() + guestAccessDays * 86400_000,
                ),
                requestId: input.requestId,
            })
            .returning();
        await guestNotice(booking, "confirmation", tx, token);
        await notifyAdmin(
            "contact",
            "Neues Erstgespräch ohne Kundenkonto",
            "Ein kostenloses Telefongespräch wurde gebucht. Kontaktdaten und Anliegen stehen im Kalender.",
            "guest-booking:" + booking.id,
            "/admin/kalender?booking=" + booking.id,
            tx,
        );
        await audit(
            null,
            "guest-booking.created",
            "guest_booking",
            booking.id,
            undefined,
            tx,
        );
        return { booking: guestView(booking), token };
    });
}
export async function changeGuest(
    id: string,
    action: "cancel" | "reschedule" | "complete" | "note",
    options: {
        token?: string;
        adminId?: string;
        startsAt?: string;
        notes?: string;
        expectedSequence?: number;
    },
) {
    return db().transaction(async (tx) => {
        await lock("calendar", tx);
        const [booking] = await tx
            .select()
            .from(guestBookings)
            .where(eq(guestBookings.id, id));
        assert(booking, "Der Termin wurde nicht gefunden.", 404);
        if (options.adminId) {
            const [admin] = await tx
                .select()
                .from(users)
                .where(eq(users.id, options.adminId));
            assert(
                admin?.role === "admin" && !admin.disabledAt,
                "Administratorzugang erforderlich.",
                403,
            );
        } else {
            const accessed = await guestAccess(options.token ?? "", tx);
            assert(accessed.id === id, "Kein Zugriff auf diesen Termin.", 403);
            assert(
                action === "cancel" || action === "reschedule",
                "Diese Aktion ist nicht erlaubt.",
                403,
            );
            assert(
                booking.startsAt > new Date(),
                "Der Termin hat bereits begonnen.",
            );
        }
        if (options.expectedSequence !== undefined)
            assert(
                booking.sequence === options.expectedSequence,
                "Der Termin wurde bereits geändert. Lade die aktuellen Daten neu.",
                409,
            );
        if (action === "note") {
            const notes = z.string().trim().max(10000).parse(options.notes);
            await tx
                .update(guestBookings)
                .set({ notes })
                .where(eq(guestBookings.id, id));
        } else {
            assert(
                booking.status === "confirmed",
                "Dieser Termin ist nicht mehr änderbar.",
                409,
            );
            if (action === "complete")
                assert(
                    booking.endsAt <= new Date(),
                    "Nur bereits beendete Termine können abgeschlossen werden.",
                );
            const start =
                action === "reschedule"
                    ? new Date(z.iso.datetime().parse(options.startsAt))
                    : booking.startsAt;
            const end = new Date(start.getTime() + 900_000);
            if (action === "reschedule") {
                assert(
                    start.getTime() <= Date.now() + 365 * 86400_000,
                    "Bitte wähle einen Termin innerhalb der nächsten zwölf Monate.",
                );
                await ensureFree(start, end, tx, undefined, id);
            }
            const [updated] = await tx
                .update(guestBookings)
                .set({
                    startsAt: start,
                    endsAt: end,
                    status:
                        action === "cancel"
                            ? "cancelled"
                            : action === "complete"
                              ? "completed"
                              : "confirmed",
                    sequence: booking.sequence + 1,
                    updatedAt: new Date(),
                    accessExpiresAt: new Date(
                        end.getTime() + guestAccessDays * 86400_000,
                    ),
                })
                .where(eq(guestBookings.id, id))
                .returning();
            await tx
                .update(outbox)
                .set({ status: "cancelled" })
                .where(
                    and(
                        eq(outbox.status, "queued"),
                        sql`${outbox.calendarEvent}->>'guestBookingId' = ${id}`,
                    ),
                );
            if (action !== "complete")
                await guestNotice(
                    updated,
                    action === "cancel" ? "cancellation" : "confirmation",
                    tx,
                    options.token,
                );
            if (!options.adminId)
                await notifyAdmin(
                    "booking",
                    "Erstgespräch aktualisiert",
                    action === "cancel"
                        ? "Ein Gast hat seinen Termin abgesagt."
                        : "Ein Gast hat seinen Termin verschoben.",
                    `guest-change:${id}:${updated.sequence}`,
                    "/admin/kalender?booking=" + id,
                    tx,
                );
        }
        await audit(
            options.adminId ?? null,
            "guest-booking." + action,
            "guest_booking",
            id,
            undefined,
            tx,
        );
        const [current] = await tx
            .select()
            .from(guestBookings)
            .where(eq(guestBookings.id, id));
        return guestView(current);
    });
}
