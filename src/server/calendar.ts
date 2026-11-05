import { and, eq, gt, lt, inArray, or, sql } from "drizzle-orm";
import { fromZonedTime, formatInTimeZone } from "date-fns-tz";
import { db, type Db } from "./db";
import {
    availability,
    bookings,
    orders,
    packages,
    documents,
    projects,
    timeEntries,
    calendarBlocks,
    users,
    outbox,
    notifications,
    type User,
} from "./schema";
import { assert, audit, lock, readyCustomer, owns, isMinor } from "./security";
import { products, price, type ProductKey, berlin } from "./config";
import { notify, notifyAdmin, queueMail } from "./events";
import { randomUUID } from "node:crypto";
import { videoConfigured } from "./video";
import { consumeContractApproval } from "./guardian";
import { assertNoTimeOverlap } from "./time-ledger";
import { catalogFromSnapshot } from "./package-catalog";
import { business } from "./settings";
import { z } from "zod";

export const phoneNumber = z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s()./-]/g, ""))
    .pipe(
        z
            .string()
            .regex(
                /^\+?[0-9]{7,15}$/,
                "Bitte gib eine gültige Telefonnummer an.",
            ),
    );
export const introDetails = z.object({
    firstName: z.string().trim().min(1).max(50),
    lastName: z.string().trim().min(1).max(80),
    phone: phoneNumber,
    company: z.string().trim().max(200).default(""),
    topic: z.string().trim().max(2000).default(""),
});

const active = () =>
    or(
        eq(bookings.status, "confirmed"),
        and(
            eq(bookings.status, "reserved"),
            gt(bookings.reservedUntil, new Date()),
        ),
    );
export async function windowFor(day: string, database: Db = db()) {
    assert(z.iso.date().safeParse(day).success, "Ungültiges Datum.");
    const weekday = new Date(day + "T12:00:00Z").getUTCDay() || 7;
    const rules = await database
        .select()
        .from(availability)
        .where(
            or(eq(availability.day, day), eq(availability.weekday, weekday)),
        );
    const exception = rules.find((r) => r.day === day);
    if (exception?.blocked) return null;
    const rule = exception ?? rules.find((r) => r.weekday === weekday);
    if (rule?.blocked) return null;
    const start = rule?.start ?? (weekday < 6 ? "08:30" : "12:00");
    const end = rule?.end ?? "17:00";
    return {
        start: fromZonedTime(`${day}T${start}:00`, "Europe/Berlin"),
        end: fromZonedTime(`${day}T${end}:00`, "Europe/Berlin"),
    };
}
async function dayWindows(day: string, database: Db) {
    const base = await windowFor(day, database);
    const start = fromZonedTime(day + "T00:00:00", "Europe/Berlin");
    const nextDay = new Date(new Date(day + "T12:00:00Z").getTime() + 86400_000)
        .toISOString()
        .slice(0, 10);
    const end = fromZonedTime(nextDay + "T00:00:00", "Europe/Berlin");
    const blocks = await database
        .select()
        .from(calendarBlocks)
        .where(
            and(
                lt(calendarBlocks.startsAt, end),
                gt(calendarBlocks.endsAt, start),
            ),
        );
    const windows = [
        ...(base ? [base] : []),
        ...blocks
            .filter((b) => b.kind === "open")
            .map((b) => ({
                start: b.startsAt > start ? b.startsAt : start,
                end: b.endsAt < end ? b.endsAt : end,
            })),
    ];
    return { windows, blocked: blocks.filter((b) => b.kind === "blocked") };
}
export async function slots(day: string, minutes: number, database: Db = db()) {
    assert([15, 30, 45, 60, 90].includes(minutes), "Ungültige Dauer.");
    const { windows, blocked } = await dayWindows(day, database);
    if (!windows.length) return [];
    const occupied = await database
        .select()
        .from(bookings)
        .where(
            and(
                active(),
                lt(
                    bookings.startsAt,
                    new Date(Math.max(...windows.map((w) => w.end.getTime()))),
                ),
                gt(
                    bookings.endsAt,
                    new Date(
                        Math.min(...windows.map((w) => w.start.getTime())),
                    ),
                ),
            ),
        );
    const results: { value: string; label: string }[] = [];
    for (const window of windows)
        for (
            let at = Math.ceil(window.start.getTime() / 900_000) * 900_000;
            at + minutes * 60_000 <= window.end.getTime();
            at += 15 * 60_000
        ) {
            const end = at + minutes * 60_000;
            if (
                at <= Date.now() ||
                formatInTimeZone(at, "Europe/Berlin", "yyyy-MM-dd") !== day ||
                blocked.some(
                    (b) =>
                        b.startsAt.getTime() < end && b.endsAt.getTime() > at,
                ) ||
                occupied.some(
                    (b) =>
                        b.startsAt.getTime() < end && b.endsAt.getTime() > at,
                )
            )
                continue;
            results.push({
                value: new Date(at).toISOString(),
                label: formatInTimeZone(at, "Europe/Berlin", "HH:mm"),
            });
        }
    return [
        ...new Map(results.map((slot) => [slot.value, slot])).values(),
    ].sort((a, b) => a.value.localeCompare(b.value));
}
async function ensureFree(
    start: Date,
    end: Date,
    database: Db,
    exclude?: string,
) {
    assert(
        Number.isFinite(start.getTime()) && start > new Date(),
        "Der Termin muss in der Zukunft liegen.",
    );
    const day = formatInTimeZone(start, "Europe/Berlin", "yyyy-MM-dd");
    const { windows, blocked } = await dayWindows(day, database);
    const minute = Number(formatInTimeZone(start, "Europe/Berlin", "mm"));
    assert(
        start.getUTCSeconds() === 0 &&
            start.getUTCMilliseconds() === 0 &&
            minute % 15 === 0 &&
            windows.some(
                (window) => start >= window.start && end <= window.end,
            ) &&
            !blocked.some((b) => b.startsAt < end && b.endsAt > start),
        "Der Termin liegt außerhalb der verfügbaren Zeiten.",
        409,
    );
    const overlapping = await database
        .select()
        .from(bookings)
        .where(
            and(
                active(),
                lt(bookings.startsAt, end),
                gt(bookings.endsAt, start),
            ),
        );
    assert(
        !overlapping.some((b) => b.id !== exclude),
        "Dieser Termin wurde inzwischen vergeben. Bitte wähle einen anderen.",
        409,
    );
}
export type BookingInput = {
    product: ProductKey;
    minutes: number;
    startsAt: string;
    channel: "phone" | "video";
    terms: boolean;
    earlyStart: boolean;
    withdrawalAcknowledged: boolean;
    packageId?: string;
    serviceOrderId?: string;
    details?: z.infer<typeof introDetails>;
};
export async function book(user: User, input: BookingInput, actorId = user.id) {
    assert(!user.disabledAt, "Dieses Kundenkonto ist gesperrt.", 403);
    if (input.product === "project")
        return bookProjectMeeting(user, input, actorId);
    assert(
        !["package12", "unlimited"].includes(input.product) || input.packageId,
        "Pakete werden als eigenständige Leistung bestellt. Buche einen Beratungstermin anschließend aus Deinem aktiven Paket.",
    );
    if (input.product === "intro") {
        assert(user.verifiedAt, "Bestätige zuerst Deine E-Mail-Adresse.", 403);
        assert(
            !isMinor(user) || user.guardianApprovedAt,
            "Die überprüfte Zustimmung Deiner Erziehungsberechtigten fehlt.",
            422,
        );
    } else readyCustomer(user, !input.packageId);
    const details = input.details
        ? introDetails.parse(input.details)
        : undefined;
    if (details)
        user = {
            ...user,
            name: details.firstName + " " + details.lastName,
            phone: details.phone,
            company: details.company,
        };
    assert(
        (products[input.product].durations as readonly number[]).includes(
            input.minutes,
        ),
        "Diese Dauer passt nicht zur Leistung.",
    );
    assert(input.terms, "Bitte akzeptiere die Vertragsbedingungen.");
    assert(
        input.channel === "phone",
        "Dieser Termin findet telefonisch statt.",
        422,
    );
    assert(user.phone, "Ergänze zuerst Deine Telefonnummer.");
    phoneNumber.parse(user.phone);
    const start = new Date(input.startsAt);
    const end = new Date(start.getTime() + input.minutes * 60_000);
    if (
        input.product !== "intro" &&
        !input.packageId &&
        start.getTime() < Date.now() + 14 * 86400_000
    )
        assert(
            input.earlyStart && input.withdrawalAcknowledged,
            "Für den Beginn innerhalb der Widerrufsfrist sind Deine ausdrücklichen Erklärungen erforderlich.",
        );
    return db().transaction(async (tx) => {
        await lock("calendar", tx);
        await ensureFree(start, end, tx);
        const existing = await tx
            .select()
            .from(bookings)
            .where(
                and(
                    eq(bookings.userId, user.id),
                    inArray(bookings.status, [
                        "reserved",
                        "confirmed",
                        "completed",
                    ]),
                ),
            );
        if (input.product === "intro") {
            const [current] = await tx
                .select()
                .from(users)
                .where(eq(users.id, user.id))
                .for("update");
            const repeated = existing.some((b) => b.product === "intro");
            assert(
                !repeated || current.introCredits > 0,
                "Das kostenlose Erstgespräch kann einmal gebucht werden.",
                409,
            );
            if (repeated)
                await tx
                    .update(users)
                    .set({ introCredits: current.introCredits - 1 })
                    .where(eq(users.id, user.id));
            if (details)
                await tx
                    .update(users)
                    .set({
                        name: user.name,
                        phone: user.phone,
                        company: user.company,
                        updatedAt: new Date(),
                    })
                    .where(eq(users.id, user.id));
        }
        if (input.product === "upgrade") {
            assert(
                existing.some(
                    (b) =>
                        b.product === "intro" &&
                        (b.status === "completed" || b.endsAt < new Date()),
                ),
                "Die Vertiefung wird nach Deinem Erstgespräch gebucht.",
            );
            assert(
                !existing.some((b) => b.product === "upgrade"),
                "Der Einführungspreis steht Dir einmal zur Verfügung.",
                409,
            );
        }
        let packageId: string | undefined;
        let orderId: string | undefined;
        if (input.packageId) {
            const [pkg] = await tx
                .select()
                .from(packages)
                .where(eq(packages.id, input.packageId))
                .for("update");
            owns(user, pkg);
            assert(
                pkg.status === "active" &&
                    pkg.startsAt <= start &&
                    pkg.expiresAt >= end,
                "Das Paket ist für diesen Termin nicht aktiv.",
            );
            const allocated = await tx
                .select({
                    seconds: sql<number>`COALESCE(SUM(EXTRACT(EPOCH FROM (${bookings.endsAt}-${bookings.startsAt}))),0)`,
                })
                .from(bookings)
                .where(
                    and(
                        eq(bookings.packageId, pkg.id),
                        eq(bookings.status, "confirmed"),
                    ),
                );
            assert(
                pkg.allowanceSeconds === null ||
                    pkg.usedSeconds +
                        Number(allocated[0].seconds) +
                        input.minutes * 60 <=
                        pkg.allowanceSeconds,
                "Das verbleibende Kontingent reicht für diesen Termin nicht aus.",
            );
            packageId = pkg.id;
        } else if (input.product !== "intro") {
            await consumeContractApproval(
                user,
                input.product,
                input.minutes,
                tx,
            );
            const amount = price(input.product, input.minutes);
            const [order] = await tx
                .insert(orders)
                .values({
                    userId: user.id,
                    reference: "BE-" + randomUUID(),
                    product: input.product,
                    amountCents: amount,
                    contract: {
                        ...input,
                        amountCents: amount,
                        termsVersion: "2026-10-26",
                        billingAddress: user.billingAddress,
                    },
                    acceptedAt: new Date(),
                })
                .returning();
            orderId = order.id;
            await tx.insert(documents).values({
                userId: user.id,
                orderId,
                kind: "invoice",
                items: [
                    {
                        description: products[input.product].name,
                        quantity: 1,
                        unitCents: amount,
                    },
                ],
                amountCents: amount,
                description: `${products[input.product].name} · ${berlin(start)}`,
            });
        }
        const reservedUntil = orderId
            ? new Date(Math.min(Date.now() + 48 * 3600_000, start.getTime()))
            : null;
        const [booking] = await tx
            .insert(bookings)
            .values({
                userId: user.id,
                orderId,
                packageId,
                product: input.product,
                channel: input.channel,
                startsAt: start,
                endsAt: end,
                status: orderId ? "reserved" : "confirmed",
                reservedUntil,
                contactName: user.name,
                contactEmail: user.email,
                contactPhone: user.phone,
                company: user.company,
                topic: details?.topic,
            })
            .returning();
        await audit(
            actorId,
            "booking.created",
            "booking",
            booking.id,
            { orderId },
            tx,
        );
        if (input.product === "intro")
            await bookingNotice(booking, "confirmation", tx);
        else
            await notify(
                user.id,
                "booking",
                orderId
                    ? "Dein Termin ist reserviert"
                    : "Dein Termin ist bestätigt",
                `${berlin(start)} · ${input.minutes} Minuten. ${orderId ? "Die Reservierung gilt bis " + berlin(reservedUntil!) + ". Bestätigt wird nach geprüftem Zahlungseingang." : "Du findest den Termin in Deinem Konto."}`,
                "booking:" + booking.id,
                "/konto/termine",
                tx,
            );
        const adminBody = `Kunde: ${user.name}\nDatum: ${berlin(start)}\nTelefon: ${user.phone}`;
        await notifyAdmin(
            "booking",
            input.product === "intro"
                ? "Neues Erstgespräch gebucht"
                : "Neue Terminbuchung",
            adminBody,
            "booking:" + booking.id,
            "/admin/kalender",
            tx,
        );
        if (input.product === "intro") {
            const values = await business(tx);
            const [admin] = await tx
                .select()
                .from(users)
                .where(eq(users.role, "admin"));
            if (
                values.contact_email &&
                !values.contact_email.includes("{{") &&
                values.contact_email !== admin?.email
            )
                await queueMail(
                    values.contact_email,
                    "Neues Erstgespräch gebucht",
                    adminBody,
                    "business-booking:" + booking.id,
                    {
                        url:
                            values.public_base_url +
                            "/admin/kalender?booking=" +
                            booking.id,
                    },
                    tx,
                );
        }
        return booking;
    });
}
async function bookProjectMeeting(
    user: User,
    input: BookingInput,
    actorId: string,
) {
    readyCustomer(user, false);
    assert(
        input.serviceOrderId && !input.packageId,
        "Bitte wähle Dein bezahltes Leistungspaket.",
    );
    assert([30, 60].includes(input.minutes), "Ungültige Termindauer.");
    assert(input.terms, "Bitte bestätige die Terminbedingungen.");
    if (input.channel === "phone")
        assert(user.phone, "Ergänze zuerst Deine Telefonnummer.");
    if (input.channel === "video")
        assert(
            videoConfigured(),
            "Videoberatung ist noch nicht eingerichtet. Bitte wähle Telefonberatung.",
            422,
        );
    const start = new Date(input.startsAt);
    const end = new Date(start.getTime() + input.minutes * 60_000);
    return db().transaction(async (tx) => {
        await lock("calendar", tx);
        const [order] = await tx
            .select()
            .from(orders)
            .where(eq(orders.id, input.serviceOrderId!))
            .for("update");
        owns(user, order);
        assert(
            order.status === "paid" && !order.cancelledAt,
            "Das Paket muss vollständig bezahlt und aktiv sein.",
        );
        const workMayStartAt = (order.contract as { workMayStartAt?: string })
            .workMayStartAt;
        assert(
            !workMayStartAt || start >= new Date(workMayStartAt),
            "Der gewünschte Termin liegt vor dem vereinbarten Leistungsbeginn.",
        );
        const selected = catalogFromSnapshot(order.contract);
        assert(
            selected &&
                Number.isInteger(selected.meetings) &&
                selected.meetings > 0,
            "Für diesen Auftrag sind keine Projektgespräche hinterlegt.",
        );
        const used = await tx
            .select({ id: bookings.id })
            .from(bookings)
            .where(
                and(
                    eq(bookings.serviceOrderId, order.id),
                    inArray(bookings.status, [
                        "confirmed",
                        "completed",
                        "reserved",
                    ]),
                ),
            );
        assert(
            used.length < selected.meetings,
            "Die im Angebot enthaltenen Projektgespräche sind bereits gebucht. Weitere Gespräche müssen gesondert vereinbart werden.",
        );
        await ensureFree(start, end, tx);
        const [booking] = await tx
            .insert(bookings)
            .values({
                userId: user.id,
                serviceOrderId: order.id,
                product: "project",
                channel: input.channel,
                startsAt: start,
                endsAt: end,
                status: "confirmed",
            })
            .returning();
        await audit(
            actorId,
            "project-meeting.booked",
            "booking",
            booking.id,
            { orderId: order.id, priceIncluded: true },
            tx,
        );
        await notify(
            user.id,
            "booking",
            "Dein Projekttermin ist bestätigt",
            `${selected.name}: ${berlin(start)}. Der Termin ist im vereinbarten Paketpreis enthalten.`,
            "project-booking:" + booking.id,
            "/konto/termine",
            tx,
        );
        await notifyAdmin(
            "booking",
            "Projekttermin gebucht",
            `${user.name}: ${selected.name}`,
            "project-booking:" + booking.id,
            "/admin/termine",
            tx,
        );
        return booking;
    });
}
export async function changeBooking(
    user: User,
    id: string,
    action: "cancel" | "reschedule" | "complete",
    startsAt?: string,
) {
    return db().transaction(async (tx) => {
        await lock("calendar", tx);
        const [booking] = await tx
            .select()
            .from(bookings)
            .where(eq(bookings.id, id));
        owns(user, booking);
        assert(
            ["reserved", "confirmed"].includes(booking.status),
            "Dieser Termin ist nicht mehr änderbar.",
        );
        assert(
            user.role === "admin" ||
                action === "reschedule" ||
                booking.startsAt > new Date(),
            "Der Termin hat bereits begonnen.",
        );
        if (action === "complete")
            assert(
                user.role === "admin",
                "Nur die Administration kann Termine abschließen.",
                403,
            );
        if (action === "complete") {
            await lock("timer", tx);
            assert(
                booking.status === "confirmed" && booking.endsAt <= new Date(),
                "Nur bestätigte, bereits beendete Termine können als durchgeführt erfasst werden.",
            );
            if (booking.packageId) {
                const [pkg] = await tx
                    .select()
                    .from(packages)
                    .where(eq(packages.id, booking.packageId))
                    .for("update");
                assert(pkg, "Das zugehörige Paket fehlt.");
                const seconds = Math.round(
                    (booking.endsAt.getTime() - booking.startsAt.getTime()) /
                        1000,
                );
                assert(
                    !pkg.cancelledAt || booking.endsAt <= pkg.cancelledAt,
                    "Dieser Termin liegt nach der wirksamen Paketstornierung.",
                );
                await assertNoTimeOverlap(
                    user.id,
                    booking.startsAt,
                    booking.endsAt,
                    tx,
                );
                assert(
                    pkg.allowanceSeconds === null ||
                        pkg.usedSeconds + seconds <= pkg.allowanceSeconds,
                    "Das Paketkontingent muss vor Abschluss abgeglichen werden.",
                );
                let [project] = await tx
                    .select()
                    .from(projects)
                    .where(
                        and(
                            eq(projects.userId, booking.userId),
                            eq(projects.category, "consultation"),
                        ),
                    );
                if (!project)
                    [project] = await tx
                        .insert(projects)
                        .values({
                            userId: booking.userId,
                            adminId: user.id,
                            name: "Beratung & Begleitung",
                            description:
                                "Zeitnachweise der tatsächlich durchgeführten Paketberatungen.",
                            category: "consultation",
                            status: "in_progress",
                        })
                        .returning();
                await tx.insert(timeEntries).values({
                    userId: booking.userId,
                    adminId: user.id,
                    projectId: project.id,
                    packageId: pkg.id,
                    startsAt: booking.startsAt,
                    endsAt: booking.endsAt,
                    durationSeconds: seconds,
                    chargedSeconds: seconds,
                    source: "booking",
                    status: "stopped",
                    charged: true,
                    activity: "Durchgeführte Paketberatung",
                    segments: [
                        {
                            start: booking.startsAt.toISOString(),
                            end: booking.endsAt.toISOString(),
                        },
                    ],
                });
                await tx
                    .update(packages)
                    .set({ usedSeconds: pkg.usedSeconds + seconds })
                    .where(eq(packages.id, pkg.id));
            }
        }
        if (action === "reschedule") {
            const start = new Date(startsAt!);
            const end = new Date(
                start.getTime() +
                    booking.endsAt.getTime() -
                    booking.startsAt.getTime(),
            );
            await ensureFree(start, end, tx, id);
            if (booking.serviceOrderId) {
                const [order] = await tx
                    .select()
                    .from(orders)
                    .where(eq(orders.id, booking.serviceOrderId));
                const workMayStartAt = (
                    order?.contract as { workMayStartAt?: string } | undefined
                )?.workMayStartAt;
                assert(
                    order?.status === "paid" && !order.cancelledAt,
                    "Das Leistungspaket ist nicht mehr aktiv.",
                );
                assert(
                    !workMayStartAt || start >= new Date(workMayStartAt),
                    "Der Termin liegt vor dem vereinbarten Leistungsbeginn.",
                );
            }
            await tx
                .update(bookings)
                .set({
                    startsAt: start,
                    endsAt: end,
                    sequence: booking.sequence + 1,
                    updatedAt: new Date(),
                    reservedUntil: booking.reservedUntil
                        ? new Date(
                              Math.min(
                                  booking.reservedUntil.getTime(),
                                  start.getTime(),
                              ),
                          )
                        : null,
                })
                .where(eq(bookings.id, id));
        } else {
            await tx
                .update(bookings)
                .set({
                    status: action === "cancel" ? "cancelled" : "completed",
                    sequence: booking.sequence + 1,
                    updatedAt: new Date(),
                })
                .where(eq(bookings.id, id));
            if (action === "cancel" && booking.orderId)
                await tx
                    .update(orders)
                    .set({ status: "cancelled", cancelledAt: new Date() })
                    .where(
                        and(
                            eq(orders.id, booking.orderId),
                            eq(orders.paidCents, 0),
                        ),
                    );
        }
        await audit(user.id, "booking." + action, "booking", id, undefined, tx);
        const [updated] = await tx
            .select()
            .from(bookings)
            .where(eq(bookings.id, id));
        await tx
            .update(outbox)
            .set({ status: "cancelled" })
            .where(
                and(
                    eq(outbox.status, "queued"),
                    sql`${outbox.calendarEvent}->>'bookingId' = ${id}`,
                ),
            );
        if (booking.product === "intro" && action !== "complete")
            await bookingNotice(
                updated,
                action === "cancel" ? "cancellation" : "confirmation",
                tx,
            );
        else
            await notify(
                booking.userId,
                "booking",
                "Dein Termin wurde aktualisiert",
                "Bitte prüfe die aktuellen Termindaten in Deinem Konto.",
                `booking:${id}:${action}:${booking.sequence + 1}`,
                "/konto/termine",
                tx,
            );
        return { ok: true };
    });
}
export function ics(booking: typeof bookings.$inferSelect): string {
    const stamp = (date: Date) =>
        date
            .toISOString()
            .replace(/[-:]/g, "")
            .replace(/\.\d{3}/, "");
    const lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Avelsorn//Terminbuchung//DE",
        booking.status === "cancelled" ? "METHOD:CANCEL" : "METHOD:PUBLISH",
        "BEGIN:VEVENT",
        `UID:${booking.id}@avelsorn.de`,
        `DTSTAMP:${stamp(new Date())}`,
        `LAST-MODIFIED:${stamp(booking.updatedAt)}`,
        `DTSTART:${stamp(booking.startsAt)}`,
        `DTEND:${stamp(booking.endsAt)}`,
        `SEQUENCE:${booking.sequence}`,
        `SUMMARY:${products[booking.product as ProductKey]?.name ?? "Beratung"}`,
        booking.channel === "phone"
            ? "DESCRIPTION:Avelsorn ruft den Kunden zum vereinbarten Termin telefonisch an."
            : "DESCRIPTION:Videogespräch im geschützten Kundenkonto.",
        booking.channel === "phone"
            ? "LOCATION:Telefonisch"
            : "LOCATION:Videogespräch",
        `STATUS:${booking.status === "cancelled" ? "CANCELLED" : booking.status === "reserved" ? "TENTATIVE" : "CONFIRMED"}`,
        "END:VEVENT",
        "END:VCALENDAR",
        "",
    ];
    return lines
        .map((line) => {
            let folded = "",
                current = "";
            for (const character of line) {
                if (Buffer.byteLength(current + character, "utf8") > 75) {
                    folded += current + "\r\n";
                    current = " ";
                }
                current += character;
            }
            return folded + current;
        })
        .join("\r\n");
}

export async function bookingMessage(
    booking: typeof bookings.$inferSelect,
    database: Db = db(),
) {
    const values = await business(database);
    const [owner] = booking.contactPhone
        ? []
        : await database
              .select()
              .from(users)
              .where(eq(users.id, booking.userId));
    const duration = Math.round(
        (booking.endsAt.getTime() - booking.startsAt.getTime()) / 60000,
    );
    return [
        booking.status === "cancelled"
            ? "Dein Termin wurde abgesagt."
            : "Vielen Dank für Deine Terminbuchung und Dein Interesse an Avelsorn.",
        booking.product === "intro"
            ? "Dein kostenloses und unverbindliches Erstgespräch"
            : "Dein Beratungstermin",
        "Datum: " +
            formatInTimeZone(booking.startsAt, "Europe/Berlin", "dd.MM.yyyy"),
        "Uhrzeit: " +
            formatInTimeZone(booking.startsAt, "Europe/Berlin", "HH:mm") +
            "–" +
            formatInTimeZone(booking.endsAt, "Europe/Berlin", "HH:mm") +
            " Uhr (Europe/Berlin)",
        "Dauer: " + duration + " Minuten",
        "Beratungsart: Telefonisch",
        booking.status === "cancelled"
            ? "Zu diesem Termin erfolgt kein Anruf."
            : "Du musst uns nicht selbst anrufen. Ich melde mich zum vereinbarten Termin persönlich telefonisch bei Dir.",
        "Deine hinterlegte Telefonnummer: " +
            (booking.contactPhone ?? owner?.phone ?? ""),
        booking.status === "cancelled"
            ? "Einen neuen Termin kannst Du über Deinen Kalender auswählen."
            : "Bitte stelle sicher, dass Du unter dieser Nummer erreichbar bist.",
        "Du erreichst mich bei Rückfragen unter: " + values.public_phone,
        "Du kannst den Termin in Deinem Kundenkonto verschieben oder absagen.",
        "Freundliche Grüße\n" +
            values.legal_full_name +
            "\nAvelsorn – Digitale Unternehmensberatung",
    ].join("\n\n");
}

export async function bookingNotice(
    booking: typeof bookings.$inferSelect,
    kind: "confirmation" | "cancellation",
    database: Db,
) {
    const [owner] = await database
        .select()
        .from(users)
        .where(eq(users.id, booking.userId));
    const title =
        kind === "cancellation"
            ? "Dein Erstgespräch bei Avelsorn – Terminabsage"
            : booking.sequence > 0
              ? "Dein Erstgespräch bei Avelsorn – Aktualisierte Terminbestätigung"
              : "Dein kostenloses Erstgespräch bei Avelsorn – Terminbestätigung";
    const eventKey = `intro:${booking.id}:${booking.sequence}:${kind}`;
    await database
        .insert(notifications)
        .values({
            userId: booking.userId,
            type: "booking",
            title,
            body: berlin(booking.startsAt),
            eventKey,
            url: "/konto/termine",
        })
        .onConflictDoNothing();
    await queueMail(
        owner.email,
        title,
        "Hallo " +
            (booking.contactName ?? owner.name).split(" ")[0] +
            ",\n\n" +
            (await bookingMessage(booking, database)),
        eventKey,
        {
            userId: owner.id,
            url: (await business(database)).public_base_url + "/konto/termine",
            calendarEvent: {
                bookingId: booking.id,
                sequence: booking.sequence,
                kind,
            },
        },
        database,
    );
}
