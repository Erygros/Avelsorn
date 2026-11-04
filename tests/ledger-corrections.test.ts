import { beforeAll, afterAll, it, expect } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { eq } from "drizzle-orm";
import * as s from "../src/server/schema";
import type { Database } from "../src/server/db";
import {
    cancelInvoice,
    cancelOrder,
    issueInvoice,
    editDocument,
    recordRefund,
} from "../src/server/finance";
import { correctTime, manualTime, timer } from "../src/server/projects";

const local = new PGlite();
const db = drizzle(local, { schema: s });
let admin: s.User, customer: s.User, other: s.User;
const ago = (seconds: number) => new Date(Date.now() - seconds * 1000);
beforeAll(async () => {
    process.env.APP_SECRET = "12".repeat(32);
    process.env.PUBLIC_BASE_URL = "http://localhost:3001";
    (
        globalThis as unknown as { platformConnection: unknown }
    ).platformConnection = {
        db: db as unknown as Database,
        local,
        close: () => local.close(),
    };
    await migrate(db, { migrationsFolder: "drizzle" });
    const shared = {
        passwordHash: "unused-test-hash",
        birthDate: "1990-01-01",
        termsAt: new Date(),
        verifiedAt: new Date(),
        onboardingAt: new Date(),
        billingAddress: "Testanschrift",
        phone: "+490000000",
    };
    [admin, customer, other] = await db
        .insert(s.users)
        .values([
            {
                ...shared,
                name: "Admin",
                email: "admin@ledger.example.test",
                role: "admin",
            },
            { ...shared, name: "Kunde", email: "customer@ledger.example.test" },
            {
                ...shared,
                name: "Anderer Kunde",
                email: "other@ledger.example.test",
            },
        ])
        .returning();
});
afterAll(async () => {
    await local.close();
    (
        globalThis as unknown as { platformConnection: unknown }
    ).platformConnection = undefined;
});
async function fixture() {
    const [order] = await db
        .insert(s.orders)
        .values({
            userId: customer.id,
            reference: crypto.randomUUID(),
            product: "package12",
            amountCents: 9900,
            paidCents: 9900,
            status: "paid",
            paidAt: ago(3600),
            acceptedAt: ago(86400),
            contract: {},
        })
        .returning();
    const [pkg] = await db
        .insert(s.packages)
        .values({
            userId: customer.id,
            orderId: order.id,
            product: "package12",
            startsAt: ago(20 * 86400),
            expiresAt: new Date(Date.now() + 28 * 86400_000),
            allowanceSeconds: 43200,
        })
        .returning();
    const [project] = await db
        .insert(s.projects)
        .values({
            userId: customer.id,
            adminId: admin.id,
            name: "Kontenprüfung",
            description: "Test",
            category: "Test",
        })
        .returning();
    const [invoice] = await db
        .insert(s.documents)
        .values({
            userId: customer.id,
            orderId: order.id,
            kind: "invoice",
            status: "paid",
            number: "RE-TEST-" + crypto.randomUUID(),
            amountCents: 9900,
            items: [{ description: "Paket", quantity: 1, unitCents: 9900 }],
            description: "Paket",
            issuedAt: ago(3600),
            finalizedAt: ago(3600),
            snapshot: {},
        })
        .returning();
    return { order, pkg, project, invoice };
}
it("berichtigt eine bezahlte Rechnung ohne Leistungssperre oder erneuten Zahlungseingang", async () => {
    const { order, pkg, invoice } = await fixture();
    const correction = await cancelInvoice(
        admin,
        invoice.id,
        "Berichtigung der Leistungsbeschreibung.",
        "correction",
    );
    expect(correction.amountCents).toBe(-9900);
    expect(correction.replacementId).toBeTruthy();
    expect(
        (await db.select().from(s.orders).where(eq(s.orders.id, order.id)))[0]
            .status,
    ).toBe("paid");
    expect(
        (await db.select().from(s.packages).where(eq(s.packages.id, pkg.id)))[0]
            .status,
    ).toBe("active");
    await editDocument(admin, {
        id: correction.replacementId!,
        description: "Präzisierte Leistungsbeschreibung",
        items: [{ description: "Paketberatung", quantity: 1, unitCents: 9900 }],
    });
    await expect(
        editDocument(admin, {
            id: correction.replacementId!,
            description: "Verteuerung",
            items: [{ description: "Paket", quantity: 1, unitCents: 10000 }],
        }),
    ).rejects.toThrow("Bestellung");
    await issueInvoice(admin, correction.replacementId!);
    const [replacement] = await db
        .select()
        .from(s.documents)
        .where(eq(s.documents.id, correction.replacementId!));
    expect(replacement.status).toBe("paid");
    expect(replacement.number).toMatch(/^RE-/);
    expect(await db.select().from(s.payments)).toHaveLength(0);
    await expect(
        cancelInvoice(admin, invoice.id, "Doppelte Korrektur verhindern."),
    ).rejects.toThrow();
});
it("storniert Vertrag, Paket und zukünftige Termine gemeinsam; Rückzahlung bleibt ein eigener Bankvorgang", async () => {
    const { order, pkg, invoice } = await fixture();
    const [booking] = await db
        .insert(s.bookings)
        .values({
            userId: customer.id,
            packageId: pkg.id,
            product: "regular",
            channel: "phone",
            startsAt: new Date(Date.now() + 86400_000),
            endsAt: new Date(Date.now() + 90000_000),
            status: "confirmed",
        })
        .returning();
    await cancelInvoice(
        admin,
        invoice.id,
        "Vertrag vollständig aufgehoben.",
        "contract",
    );
    expect(
        (await db.select().from(s.packages).where(eq(s.packages.id, pkg.id)))[0]
            .cancelledAt,
    ).toBeInstanceOf(Date);
    const [cancelled] = await db
        .select()
        .from(s.bookings)
        .where(eq(s.bookings.id, booking.id));
    expect(cancelled.status).toBe("cancelled");
    expect(cancelled.sequence).toBe(1);
    expect(
        (await db.select().from(s.orders).where(eq(s.orders.id, order.id)))[0]
            .paidCents,
    ).toBe(9900);
    expect(await db.select().from(s.payments)).toHaveLength(0);
    await recordRefund(admin, {
        orderId: order.id,
        amountCents: 9900,
        bankReference: "Tatsächlicher Bankbeleg",
        receivedAt: new Date().toISOString(),
        idempotencyKey: crypto.randomUUID(),
    });
    expect(
        (await db.select().from(s.orders).where(eq(s.orders.id, order.id)))[0]
            .status,
    ).toBe("refunded");
    await expect(
        cancelOrder(admin, order.id, "Doppelte Aufhebung verhindern."),
    ).rejects.toThrow("bereits");
});
it("hebt eine unbezahlte Bestellung mit Entwurf ohne erfundene Rechnungsnummer auf", async () => {
    const [order] = await db
        .insert(s.orders)
        .values({
            userId: customer.id,
            reference: crypto.randomUUID(),
            product: "package12",
            amountCents: 9900,
            acceptedAt: new Date(),
            contract: {},
        })
        .returning();
    const [draft] = await db
        .insert(s.documents)
        .values({
            userId: customer.id,
            orderId: order.id,
            kind: "invoice",
            status: "draft",
            description: "Unbezahlter Entwurf",
            items: [],
            amountCents: 9900,
        })
        .returning();
    expect(
        (await cancelOrder(admin, order.id, "Auf Kundenwunsch aufgehoben."))
            .correctionIds,
    ).toHaveLength(0);
    const [updated] = await db
        .select()
        .from(s.documents)
        .where(eq(s.documents.id, draft.id));
    expect(updated.status).toBe("cancelled");
    expect(updated.number).toBeNull();
    await expect(issueInvoice(admin, draft.id)).rejects.toThrow();
});
it("korrigiert Kontingentbelastung atomar, protokolliert und verwirft einen veralteten Bearbeitungsstand", async () => {
    const { pkg, project } = await fixture();
    const entry = await manualTime(admin, {
        projectId: project.id,
        packageId: pkg.id,
        startsAt: ago(10 * 86400).toISOString(),
        endsAt: ago(10 * 86400 - 600).toISOString(),
        activity: "Ursprüngliche Arbeit",
    });
    const input = {
        id: entry.id,
        expectedRevision: 0,
        projectId: project.id,
        packageId: pkg.id,
        startsAt: entry.startsAt.toISOString(),
        endsAt: entry.endsAt!.toISOString(),
        chargeMinutes: 5,
        activity: "Korrigierte Arbeit",
        description: "Nachgeprüft",
        adminComment: "Intern geprüft",
        reason: "Nur fünf Minuten waren anzurechnen.",
    };
    const updated = await correctTime(admin, input);
    expect(updated.revision).toBe(1);
    expect(updated.chargedSeconds).toBe(300);
    expect(
        (await db.select().from(s.packages).where(eq(s.packages.id, pkg.id)))[0]
            .usedSeconds,
    ).toBe(300);
    const [audit] = await db
        .select()
        .from(s.auditEvents)
        .where(eq(s.auditEvents.resourceId, entry.id))
        .orderBy(s.auditEvents.createdAt)
        .then((rows) => rows.filter((r) => r.action === "time.corrected"));
    expect(audit.metadata).toMatchObject({
        reason: input.reason,
        before: { chargedSeconds: 600 },
        after: { chargedSeconds: 300, revision: 1 },
    });
    await expect(correctTime(admin, input)).rejects.toThrow("inzwischen");
    await correctTime(admin, {
        ...input,
        expectedRevision: 1,
        packageId: undefined,
        chargeMinutes: 0,
    });
    expect(
        (await db.select().from(s.packages).where(eq(s.packages.id, pkg.id)))[0]
            .usedSeconds,
    ).toBe(0);
    await expect(
        correctTime(customer, { ...input, expectedRevision: 2 }),
    ).rejects.toThrow("Administrator");
    const [foreign] = await db
        .insert(s.projects)
        .values({
            userId: other.id,
            adminId: admin.id,
            name: "Fremdprojekt",
            description: "Test",
            category: "Test",
        })
        .returning();
    await expect(
        correctTime(admin, {
            ...input,
            expectedRevision: 2,
            projectId: foreign.id,
        }),
    ).rejects.toThrow("anderen Kunden");
});
it("berücksichtigt reservierte Paketzeiten bei Korrekturen und rollt abgelehnte Änderungen vollständig zurück", async () => {
    const { pkg, project } = await fixture();
    const entry = await manualTime(admin, {
        projectId: project.id,
        packageId: pkg.id,
        startsAt: ago(9 * 86400).toISOString(),
        endsAt: ago(9 * 86400 - 600).toISOString(),
        activity: "Gebundene Zeit",
    });
    await db
        .update(s.packages)
        .set({ allowanceSeconds: 900 })
        .where(eq(s.packages.id, pkg.id));
    await db
        .insert(s.bookings)
        .values({
            userId: customer.id,
            packageId: pkg.id,
            product: "regular",
            channel: "phone",
            startsAt: new Date(Date.now() + 86400_000),
            endsAt: new Date(Date.now() + 86900_000),
            status: "confirmed",
        });
    await expect(
        correctTime(admin, {
            id: entry.id,
            expectedRevision: 0,
            projectId: project.id,
            packageId: pkg.id,
            startsAt: entry.startsAt.toISOString(),
            endsAt: entry.endsAt!.toISOString(),
            chargeMinutes: 10,
            activity: "Mehr Zeit",
            description: "",
            adminComment: "",
            reason: "Das Kontingent ist bereits gebunden.",
        }),
    ).rejects.toThrow("Paketkontingent");
    expect(
        (await db.select().from(s.packages).where(eq(s.packages.id, pkg.id)))[0]
            .usedSeconds,
    ).toBe(600);
    expect(
        (
            await db
                .select()
                .from(s.timeEntries)
                .where(eq(s.timeEntries.id, entry.id))
        )[0].revision,
    ).toBe(0);
});
it("bewahrt Timerpausen bei Textkorrekturen und erlaubt manuelle Arbeit nur innerhalb freier Pausen", async () => {
    const { project } = await fixture();
    const start = ago(8 * 86400),
        end = new Date(start.getTime() + 1800_000);
    const segments = [
        {
            start: start.toISOString(),
            end: new Date(start.getTime() + 300_000).toISOString(),
        },
        {
            start: new Date(start.getTime() + 1200_000).toISOString(),
            end: end.toISOString(),
        },
    ];
    const [entry] = await db
        .insert(s.timeEntries)
        .values({
            userId: customer.id,
            projectId: project.id,
            adminId: admin.id,
            startsAt: start,
            endsAt: end,
            segments,
            durationSeconds: 900,
            activity: "Mit Pause",
            source: "timer",
            status: "stopped",
        })
        .returning();
    await manualTime(admin, {
        projectId: project.id,
        startsAt: new Date(start.getTime() + 400_000).toISOString(),
        endsAt: new Date(start.getTime() + 1000_000).toISOString(),
        activity: "Arbeit in freier Pause",
    });
    await expect(
        manualTime(admin, {
            projectId: project.id,
            startsAt: start.toISOString(),
            endsAt: new Date(start.getTime() + 200_000).toISOString(),
            activity: "Überlappende Arbeit",
        }),
    ).rejects.toThrow("überschneidet");
    const corrected = await correctTime(admin, {
        id: entry.id,
        expectedRevision: 0,
        startsAt: start.toISOString(),
        endsAt: end.toISOString(),
        chargeMinutes: 0,
        activity: "Text berichtigt",
        description: "",
        adminComment: "",
        reason: "Nur die Beschreibung wurde berichtigt.",
    });
    expect(corrected.durationSeconds).toBe(900);
    expect(corrected.segments).toEqual(segments);
});
it("beendet einen Timer nach Vertragsstorno und belastet nur bis zum Stornierungszeitpunkt", async () => {
    const { order, pkg, project } = await fixture();
    const start = ago(120);
    await db
        .insert(s.timeEntries)
        .values({
            userId: customer.id,
            projectId: project.id,
            adminId: admin.id,
            packageId: pkg.id,
            startsAt: start,
            segmentAt: start,
            activity: "Laufende Arbeit",
            source: "timer",
            status: "running",
        });
    await cancelOrder(
        admin,
        order.id,
        "Vertrag während laufender Arbeit aufgehoben.",
    );
    const [cancelled] = await db
        .select()
        .from(s.packages)
        .where(eq(s.packages.id, pkg.id));
    await db
        .update(s.packages)
        .set({ cancelledAt: new Date(start.getTime() + 60_000) })
        .where(eq(s.packages.id, pkg.id));
    await timer(admin, { action: "stop" });
    expect(
        (await db.select().from(s.packages).where(eq(s.packages.id, pkg.id)))[0]
            .usedSeconds,
    ).toBe(60);
    expect(cancelled.status).toBe("cancelled");
    await expect(
        timer(admin, {
            action: "start",
            projectId: project.id,
            packageId: pkg.id,
            activity: "Neue Arbeit",
        }),
    ).rejects.toThrow();
});
