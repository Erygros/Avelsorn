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
    type User,
} from "./schema";
import { assert, audit, lock, readyCustomer, owns } from "./security";
import { products, price, type ProductKey, berlin } from "./config";
import { notify, notifyAdmin } from "./events";
import { randomUUID } from "node:crypto";
import { videoConfigured } from "./video";
import { consumeContractApproval } from "./guardian";
import { assertNoTimeOverlap } from "./time-ledger";
import { catalogFromSnapshot } from "./package-catalog";

const active = () =>
    or(
        eq(bookings.status, "confirmed"),
        and(
            eq(bookings.status, "reserved"),
            gt(bookings.reservedUntil, new Date()),
        ),
    );
export async function windowFor(day: string, database: Db = db()) {
    assert(/^\d{4}-\d{2}-\d{2}$/.test(day), "Ungültiges Datum.");
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
export async function slots(day: string, minutes: number, database: Db = db()) {
    assert([15, 30, 45, 60, 90].includes(minutes), "Ungültige Dauer.");
    const window = await windowFor(day, database);
    if (!window) return [];
    const occupied = await database
        .select()
        .from(bookings)
        .where(
            and(
                active(),
                lt(bookings.startsAt, window.end),
                gt(bookings.endsAt, window.start),
            ),
        );
    const results: { value: string; label: string }[] = [];
    for (
        let at = window.start.getTime();
        at + minutes * 60_000 <= window.end.getTime();
        at += 15 * 60_000
    ) {
        const end = at + minutes * 60_000;
        if (
            at <= Date.now() ||
            occupied.some(
                (b) => b.startsAt.getTime() < end && b.endsAt.getTime() > at,
            )
        )
            continue;
        results.push({
            value: new Date(at).toISOString(),
            label: formatInTimeZone(at, "Europe/Berlin", "HH:mm"),
        });
    }
    return results;
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
    const window = await windowFor(day, database);
    assert(
        window && start >= window.start && end <= window.end,
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
};
export async function book(user: User, input: BookingInput, actorId = user.id) {
    if (input.product === "project")
        return bookProjectMeeting(user, input, actorId);
    assert(
        !["package12", "unlimited"].includes(input.product) || input.packageId,
        "Pakete werden als eigenständige Leistung bestellt. Buche einen Beratungstermin anschließend aus Deinem aktiven Paket.",
    );
    readyCustomer(user, input.product !== "intro" && !input.packageId);
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
        if (input.product === "intro")
            assert(
                !existing.some((b) => b.product === "intro"),
                "Das kostenlose Erstgespräch kann einmal gebucht werden.",
                409,
            );
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
        await notifyAdmin(
            "booking",
            "Neue Terminbuchung",
            `${user.name}: ${berlin(start)}`,
            "booking:" + booking.id,
            "/admin/kalender",
            tx,
        );
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
            user.role === "admin" || booking.startsAt > new Date(),
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
    return [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Beratungsplattform//DE",
        "METHOD:PUBLISH",
        "BEGIN:VEVENT",
        `UID:${booking.id}@platform`,
        `DTSTAMP:${stamp(new Date())}`,
        `DTSTART:${stamp(booking.startsAt)}`,
        `DTEND:${stamp(booking.endsAt)}`,
        `SEQUENCE:${booking.sequence}`,
        `SUMMARY:${products[booking.product as ProductKey]?.name ?? "Beratung"}`,
        `STATUS:${booking.status === "cancelled" ? "CANCELLED" : booking.status === "reserved" ? "TENTATIVE" : "CONFIRMED"}`,
        "END:VEVENT",
        "END:VCALENDAR",
        "",
    ].join("\r\n");
}
