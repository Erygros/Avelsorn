import { and, eq, inArray, lt, gt, sql } from "drizzle-orm";
import { db, type Db } from "./db";
import {
    projects,
    timeEntries,
    packages,
    approvals,
    bookings,
    orders,
    type User,
} from "./schema";
import { assert, owns, lock, audit } from "./security";
import { notify, notifyAdmin } from "./events";
import {
    assertNoTimeOverlap,
    timePeriod,
    committedSeconds,
} from "./time-ledger";

async function projectFor(user: User, id: string, database: Db) {
    const [project] = await database
        .select()
        .from(projects)
        .where(eq(projects.id, id));
    owns(user, project);
    return project;
}
async function assertServiceWork(projectId: string, at: Date, database: Db) {
    const [order] = await database
        .select()
        .from(orders)
        .where(sql`${orders.contract}->>'projectId' = ${projectId}`);
    if (!order) return;
    const contract = order.contract as { workMayStartAt?: string };
    assert(
        order.paidAt &&
            at >= order.paidAt &&
            (!order.cancelledAt || at < order.cancelledAt),
        "Für diesen Auftrag darf keine weitere Arbeit erfasst werden.",
    );
    assert(
        !contract.workMayStartAt || at >= new Date(contract.workMayStartAt),
        "Die Arbeit liegt vor dem vereinbarten Leistungsbeginn.",
    );
    return true;
}
export async function manualTime(
    admin: User,
    input: {
        projectId: string;
        packageId?: string;
        startsAt: string;
        endsAt: string;
        activity: string;
        description?: string;
        adminComment?: string;
    },
) {
    assert(admin.role === "admin", "Administratorzugang erforderlich.", 403);
    const { start, end, seconds } = timePeriod(
        input.startsAt,
        input.endsAt,
        24 * 3600,
    );
    return db().transaction(async (tx) => {
        await lock("timer", tx);
        const project = await projectFor(admin, input.projectId, tx);
        const serviceWork = await assertServiceWork(project.id, start, tx);
        assert(
            !serviceWork || !input.packageId,
            "Leistungspakete werden nicht auf frühere Stundenkontingente angerechnet.",
        );
        await assertNoTimeOverlap(admin.id, start, end, tx);
        await chargePackage(
            project.userId,
            input.packageId,
            seconds,
            start,
            end,
            tx,
        );
        const [entry] = await tx
            .insert(timeEntries)
            .values({
                ...input,
                userId: project.userId,
                adminId: admin.id,
                startsAt: start,
                endsAt: end,
                durationSeconds: seconds,
                chargedSeconds: input.packageId ? seconds : 0,
                segments: [
                    { start: start.toISOString(), end: end.toISOString() },
                ],
                source: "manual",
                status: "stopped",
                charged: !!input.packageId,
            })
            .returning();
        await audit(
            admin.id,
            "time.manual",
            "time_entry",
            entry.id,
            { seconds },
            tx,
        );
        return entry;
    });
}
async function chargePackage(
    userId: string,
    packageId: string | undefined,
    seconds: number,
    start: Date,
    end: Date,
    database: Db,
) {
    if (!packageId) return;
    const [pkg] = await database
        .select()
        .from(packages)
        .where(eq(packages.id, packageId))
        .for("update");
    assert(
        pkg &&
            pkg.userId === userId &&
            pkg.startsAt <= start &&
            pkg.expiresAt >= end &&
            (!pkg.cancelledAt || pkg.cancelledAt >= end),
        "Das Paket passt nicht zu Kunde oder Leistungszeitraum.",
    );
    const reserved = await database
        .select()
        .from(bookings)
        .where(
            and(
                eq(bookings.packageId, packageId),
                eq(bookings.status, "confirmed"),
            ),
        );
    const committed = reserved.reduce(
        (total, b) =>
            total + (b.endsAt.getTime() - b.startsAt.getTime()) / 1000,
        0,
    );
    assert(
        pkg.allowanceSeconds === null ||
            pkg.usedSeconds + committed + seconds <= pkg.allowanceSeconds,
        "Das Stundenkontingent ist aufgebraucht oder für bestätigte Beratungen gebunden. Eine neue kostenpflichtige Arbeit benötigt eine ausdrückliche Kundenentscheidung.",
        409,
    );
    await database
        .update(packages)
        .set({ usedSeconds: pkg.usedSeconds + seconds })
        .where(eq(packages.id, packageId));
}
export async function timer(
    admin: User,
    input: {
        action: "start" | "pause" | "resume" | "stop";
        projectId?: string;
        packageId?: string;
        activity?: string;
        description?: string;
    },
) {
    assert(admin.role === "admin", "Administratorzugang erforderlich.", 403);
    return db().transaction(async (tx) => {
        await lock("timer", tx);
        const [active] = await tx
            .select()
            .from(timeEntries)
            .where(
                and(
                    eq(timeEntries.adminId, admin.id),
                    inArray(timeEntries.status, ["running", "paused"]),
                ),
            );
        const now = new Date();
        if (input.action === "start") {
            assert(
                !active,
                "Es gibt bereits einen laufenden oder pausierten Timer.",
                409,
            );
            assert(
                input.projectId && input.activity,
                "Projekt und Tätigkeit sind erforderlich.",
            );
            const project = await projectFor(admin, input.projectId, tx);
            const serviceWork = await assertServiceWork(project.id, now, tx);
            assert(
                !serviceWork || !input.packageId,
                "Leistungspakete werden nicht auf frühere Stundenkontingente angerechnet.",
            );
            let packageId = input.packageId;
            if (!packageId && !serviceWork) {
                const [activePackage] = await tx
                    .select()
                    .from(packages)
                    .where(
                        and(
                            eq(packages.userId, project.userId),
                            eq(packages.status, "active"),
                            lt(packages.startsAt, now),
                            gt(packages.expiresAt, now),
                        ),
                    );
                packageId = activePackage?.id;
            }
            if (packageId) {
                const [pkg] = await tx
                    .select()
                    .from(packages)
                    .where(eq(packages.id, packageId));
                assert(
                    pkg &&
                        pkg.status === "active" &&
                        pkg.userId === project.userId &&
                        pkg.startsAt <= now &&
                        pkg.expiresAt > now &&
                        (pkg.allowanceSeconds === null ||
                            pkg.usedSeconds < pkg.allowanceSeconds),
                    "Dieses Paket hat kein verfügbares Kontingent.",
                );
                const committed = await committedSeconds(pkg.id, tx);
                assert(
                    pkg.allowanceSeconds === null ||
                        pkg.usedSeconds + committed < pkg.allowanceSeconds,
                    "Das verbleibende Kontingent ist bereits für bestätigte Beratungen gebunden.",
                    409,
                );
            }
            const [entry] = await tx
                .insert(timeEntries)
                .values({
                    userId: project.userId,
                    projectId: project.id,
                    packageId,
                    adminId: admin.id,
                    startsAt: now,
                    segmentAt: now,
                    status: "running",
                    activity: input.activity,
                    description: input.description,
                    source: "timer",
                })
                .returning();
            return entry;
        }
        assert(active, "Es gibt keinen aktiven Timer.", 409);
        if (input.action === "resume") {
            assert(active.status === "paused", "Der Timer ist nicht pausiert.");
            await assertServiceWork(active.projectId, now, tx);
            await tx
                .update(timeEntries)
                .set({ status: "running", segmentAt: now })
                .where(eq(timeEntries.id, active.id));
            return { ok: true };
        }
        const segments = [
            ...active.segments,
            ...(active.segmentAt
                ? [
                      {
                          start: active.segmentAt.toISOString(),
                          end: now.toISOString(),
                      },
                  ]
                : []),
        ];
        const seconds = segments.reduce(
            (total, segment) =>
                total +
                Math.max(
                    0,
                    Math.floor(
                        (new Date(segment.end).getTime() -
                            new Date(segment.start).getTime()) /
                            1000,
                    ),
                ),
            0,
        );
        if (input.action === "pause") {
            assert(active.status === "running", "Der Timer läuft nicht.");
            await tx
                .update(timeEntries)
                .set({
                    status: "paused",
                    segmentAt: null,
                    durationSeconds: seconds,
                    segments,
                })
                .where(eq(timeEntries.id, active.id));
            return { ok: true };
        }
        assert(seconds > 0, "Der Timer enthält noch keine volle Sekunde.");
        let chargedSeconds = 0;
        if (active.packageId) {
            const [pkg] = await tx
                .select()
                .from(packages)
                .where(eq(packages.id, active.packageId))
                .for("update");
            assert(
                pkg?.userId === active.userId,
                "Das Paket passt nicht zum Kunden.",
            );
            const eligible = segments.reduce(
                (total, segment) =>
                    total +
                    Math.max(
                        0,
                        Math.floor(
                            (Math.min(
                                new Date(segment.end).getTime(),
                                pkg.expiresAt.getTime(),
                                pkg.cancelledAt?.getTime() ?? Infinity,
                            ) -
                                Math.max(
                                    new Date(segment.start).getTime(),
                                    pkg.startsAt.getTime(),
                                )) /
                                1000,
                        ),
                    ),
                0,
            );
            const reserved = await tx
                .select()
                .from(bookings)
                .where(
                    and(
                        eq(bookings.packageId, pkg.id),
                        eq(bookings.status, "confirmed"),
                    ),
                );
            const committed = reserved.reduce(
                (total, b) =>
                    total + (b.endsAt.getTime() - b.startsAt.getTime()) / 1000,
                0,
            );
            chargedSeconds = Math.min(
                eligible,
                pkg.allowanceSeconds === null
                    ? eligible
                    : Math.max(
                          0,
                          pkg.allowanceSeconds - pkg.usedSeconds - committed,
                      ),
            );
            await tx
                .update(packages)
                .set({ usedSeconds: pkg.usedSeconds + chargedSeconds })
                .where(eq(packages.id, pkg.id));
            if (chargedSeconds < seconds)
                await notifyAdmin(
                    "time",
                    "Timer über Paketgrenze beendet",
                    `${seconds - chargedSeconds} Sekunden wurden als nicht zusätzlich berechneter Aufwand dokumentiert. Für neue kostenpflichtige Arbeiten ist eine ausdrückliche Kundenentscheidung erforderlich.`,
                    "time-overrun:" + active.id,
                    "/admin/zeit",
                    tx,
                );
        }
        await tx
            .update(timeEntries)
            .set({
                status: "stopped",
                segmentAt: null,
                endsAt: now,
                durationSeconds: seconds,
                chargedSeconds,
                segments,
                charged: !!active.packageId,
                updatedAt: now,
            })
            .where(eq(timeEntries.id, active.id));
        await audit(
            admin.id,
            "time.stopped",
            "time_entry",
            active.id,
            { seconds, chargedSeconds },
            tx,
        );
        return { ok: true };
    });
}
export type TimeCorrectionInput = {
    id: string;
    expectedRevision: number;
    projectId?: string;
    packageId?: string;
    startsAt: string;
    endsAt: string;
    chargeMinutes: number;
    activity: string;
    description: string;
    adminComment: string;
    reason: string;
};

export async function correctTime(admin: User, input: TimeCorrectionInput) {
    assert(admin.role === "admin", "Administratorzugang erforderlich.", 403);
    assert(
        input.reason.trim().length >= 10,
        "Bitte dokumentiere den Korrekturgrund mit mindestens zehn Zeichen.",
    );
    assert(input.activity.trim().length > 0, "Bitte beschreibe die Tätigkeit.");
    const { start, end, seconds } = timePeriod(input.startsAt, input.endsAt);
    const chargedSeconds = Math.round(input.chargeMinutes * 60);
    assert(
        Number.isSafeInteger(chargedSeconds) &&
            chargedSeconds >= 0 &&
            chargedSeconds <= seconds,
        "Die anzurechnende Zeit muss zwischen null und der tatsächlichen Dauer liegen.",
    );
    return db().transaction(async (tx) => {
        await lock("timer", tx);
        const [entry] = await tx
            .select()
            .from(timeEntries)
            .where(eq(timeEntries.id, input.id))
            .for("update");
        assert(
            entry?.status === "stopped",
            "Nur abgeschlossene Zeitbuchungen können korrigiert werden.",
            409,
        );
        assert(
            entry.revision === input.expectedRevision,
            "Die Zeitbuchung wurde inzwischen geändert. Lade die Ansicht neu, bevor Du eine weitere Korrektur speicherst.",
            409,
        );
        const project = await projectFor(
            admin,
            input.projectId ?? entry.projectId,
            tx,
        );
        const serviceWork = await assertServiceWork(project.id, start, tx);
        assert(
            !serviceWork || (!input.packageId && chargedSeconds === 0),
            "Leistungspakete erhalten keine zusätzliche Stundenabrechnung oder Belastung früherer Zeitpakete.",
        );
        assert(
            project.userId === entry.userId,
            "Eine Zeitbuchung kann nicht auf einen anderen Kunden übertragen werden.",
        );
        const unchangedPeriod =
            start.getTime() === entry.startsAt.getTime() &&
            end.getTime() === entry.endsAt?.getTime();
        const segments =
            unchangedPeriod && entry.segments.length
                ? entry.segments
                : [{ start: start.toISOString(), end: end.toISOString() }];
        const durationSeconds = segments.reduce(
            (sum, segment) =>
                sum +
                Math.floor(
                    (new Date(segment.end).getTime() -
                        new Date(segment.start).getTime()) /
                        1000,
                ),
            0,
        );
        assert(
            chargedSeconds <= durationSeconds,
            "Die anzurechnende Zeit darf die tatsächlichen Arbeitssegmente nicht überschreiten.",
        );
        for (const segment of segments)
            await assertNoTimeOverlap(
                entry.adminId,
                new Date(segment.start),
                new Date(segment.end),
                tx,
                entry.id,
            );
        assert(
            input.packageId || chargedSeconds === 0,
            "Ohne Paketzuordnung darf keine Zeit auf ein Paket angerechnet werden.",
        );
        const ids = Array.from(
            new Set(
                [entry.packageId, input.packageId].filter(
                    (id): id is string => !!id,
                ),
            ),
        );
        const ledgerPackages = ids.length
            ? await tx
                  .select()
                  .from(packages)
                  .where(inArray(packages.id, ids))
                  .orderBy(packages.id)
                  .for("update")
            : [];
        if (input.packageId) {
            const pkg = ledgerPackages.find((p) => p.id === input.packageId);
            assert(
                pkg &&
                    pkg.userId === entry.userId &&
                    pkg.startsAt <= start &&
                    pkg.expiresAt >= end &&
                    (!pkg.cancelledAt || pkg.cancelledAt >= end),
                "Das Paket passt nicht zu Kunde oder Leistungszeitraum.",
            );
        }
        for (const pkg of ledgerPackages) {
            const previous =
                entry.packageId === pkg.id ? entry.chargedSeconds : 0;
            const next = input.packageId === pkg.id ? chargedSeconds : 0;
            const used = pkg.usedSeconds - previous + next;
            const committed = await committedSeconds(pkg.id, tx);
            assert(
                used >= 0 &&
                    (pkg.allowanceSeconds === null ||
                        used + committed <= pkg.allowanceSeconds),
                "Die Korrektur überschreitet das verfügbare Paketkontingent oder widerspricht dem bisherigen Zeitkonto.",
                409,
            );
            await tx
                .update(packages)
                .set({ usedSeconds: used })
                .where(eq(packages.id, pkg.id));
        }
        const values = {
            projectId: project.id,
            packageId: input.packageId ?? null,
            startsAt: start,
            endsAt: end,
            durationSeconds,
            chargedSeconds,
            charged: !!input.packageId,
            activity: input.activity,
            description: input.description,
            adminComment: input.adminComment,
            segments,
            revision: entry.revision + 1,
            updatedAt: new Date(),
        };
        const [updated] = await tx
            .update(timeEntries)
            .set(values)
            .where(eq(timeEntries.id, entry.id))
            .returning();
        await audit(
            admin.id,
            "time.corrected",
            "time_entry",
            entry.id,
            { reason: input.reason, before: entry, after: updated },
            tx,
        );
        await notify(
            entry.userId,
            "time",
            "Ein Zeitnachweis wurde korrigiert",
            `${input.activity}: Der aktualisierte Zeitnachweis und das zugehörige Kontingent sind in Deinem Kundenkonto sichtbar. Grund: ${input.reason}`,
            `time-corrected:${entry.id}:${updated.revision}`,
            "/konto/zeit",
            tx,
        );
        return updated;
    });
}
export async function requestApproval(
    admin: User,
    input: { projectId: string; version: string; description: string },
) {
    assert(admin.role === "admin", "Administratorzugang erforderlich.", 403);
    return db().transaction(async (tx) => {
        const project = await projectFor(admin, input.projectId, tx);
        const [approval] = await tx
            .insert(approvals)
            .values({ ...input, requestedBy: admin.id })
            .returning();
        await tx
            .update(projects)
            .set({ status: "approval" })
            .where(eq(projects.id, project.id));
        await notify(
            project.userId,
            "approval",
            "Deine Freigabe ist gefragt",
            input.description,
            "approval:" + approval.id,
            "/konto/freigaben",
            tx,
        );
        return approval;
    });
}
export async function respondApproval(
    user: User,
    input: { id: string; status: "approved" | "changes"; comment: string },
) {
    return db().transaction(async (tx) => {
        const [approval] = await tx
            .select()
            .from(approvals)
            .where(eq(approvals.id, input.id))
            .for("update");
        assert(
            approval?.status === "pending",
            "Diese Anfrage wurde bereits beantwortet.",
            409,
        );
        const project = await projectFor(user, approval.projectId, tx);
        await tx
            .update(approvals)
            .set({
                status: input.status,
                comment: input.comment,
                respondedBy: user.id,
                respondedAt: new Date(),
            })
            .where(eq(approvals.id, input.id));
        await tx
            .update(projects)
            .set({
                status: input.status === "approved" ? "in_progress" : "waiting",
            })
            .where(eq(projects.id, project.id));
        await notifyAdmin(
            "approval",
            input.status === "approved"
                ? "Ergebnis freigegeben"
                : "Änderung angefordert",
            `${user.name}: ${project.name}`,
            "approval-response:" + input.id,
            "/admin/projekte",
            tx,
        );
        await audit(
            user.id,
            "approval." + input.status,
            "approval",
            input.id,
            undefined,
            tx,
        );
        return { ok: true };
    });
}
