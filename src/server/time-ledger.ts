import { and, eq, gt, inArray, lt, or } from "drizzle-orm";
import type { Db } from "./db";
import { timeEntries, bookings } from "./schema";
import { assert } from "./security";

export function timePeriod(
    startsAt: string,
    endsAt: string,
    maxSeconds = 31 * 86400,
) {
    const start = new Date(startsAt),
        end = new Date(endsAt);
    const seconds = Math.floor((end.getTime() - start.getTime()) / 1000);
    assert(
        Number.isFinite(seconds) &&
            seconds > 0 &&
            seconds <= maxSeconds &&
            end <= new Date(),
        "Prüfe Beginn und Ende. Der Zeitraum muss positiv sein und vollständig in der Vergangenheit liegen.",
    );
    return { start, end, seconds };
}

export async function assertNoTimeOverlap(
    adminId: string,
    start: Date,
    end: Date,
    database: Db,
    excludeId?: string,
) {
    const rows = await database
        .select()
        .from(timeEntries)
        .where(
            and(
                eq(timeEntries.adminId, adminId),
                lt(timeEntries.startsAt, end),
                or(
                    gt(timeEntries.endsAt, start),
                    inArray(timeEntries.status, ["running", "paused"]),
                ),
            ),
        );
    const now = new Date();
    const conflict = rows.some((entry) => {
        if (entry.id === excludeId) return false;
        const segments = entry.segments.length
            ? [...entry.segments]
            : entry.endsAt
              ? [
                    {
                        start: entry.startsAt.toISOString(),
                        end: entry.endsAt.toISOString(),
                    },
                ]
              : [];
        if (entry.status === "running")
            segments.push({
                start: (entry.segmentAt ?? entry.startsAt).toISOString(),
                end: now.toISOString(),
            });
        return segments.some(
            (segment) =>
                new Date(segment.start) < end && new Date(segment.end) > start,
        );
    });
    assert(
        !conflict,
        "Der Zeitraum überschneidet sich mit einer anderen Zeitbuchung.",
        409,
    );
}

export async function committedSeconds(packageId: string, database: Db) {
    const rows = await database
        .select()
        .from(bookings)
        .where(
            and(
                eq(bookings.packageId, packageId),
                eq(bookings.status, "confirmed"),
            ),
        );
    return rows.reduce(
        (total, booking) =>
            total +
            Math.round(
                (booking.endsAt.getTime() - booking.startsAt.getTime()) / 1000,
            ),
        0,
    );
}
