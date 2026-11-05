import { beforeAll, afterAll, it, expect, vi } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { eq, sql } from "drizzle-orm";
import * as s from "../src/server/schema";
import type { Database } from "../src/server/db";
import {
    servicePackages,
    findServicePackage,
} from "../src/content/service-packages";
import {
    requestServicePackage,
    assertCurrentBooking,
} from "../src/server/package-catalog";
import {
    createOffer,
    sendOffer,
    editDocument,
    respondOffer,
    confirmPayment,
    cancelOrder,
} from "../src/server/finance";
import { book, changeBooking } from "../src/server/calendar";
import { timer, manualTime } from "../src/server/projects";
import { decrypt } from "../src/server/security";
import { savedContractTerms } from "../src/server/contracts";
const local = new PGlite();
const database = drizzle(local, { schema: s });
let admin: s.User, customer: s.User, other: s.User;
beforeAll(async () => {
    process.env.APP_SECRET = "12".repeat(32);
    (
        globalThis as unknown as { platformConnection: unknown }
    ).platformConnection = {
        db: database as unknown as Database,
        local,
        close: () => local.close(),
    };
    await migrate(database, { migrationsFolder: "drizzle" });
    await database.insert(s.settings).values([
        { key: "legal_full_name", value: "Testanbieter" },
        { key: "business_street", value: "Teststraße 1" },
        { key: "business_postcode", value: "12345" },
        { key: "business_city", value: "Teststadt" },
        { key: "vat_id_if_available", value: "DE123456789" },
    ]);
    const shared = {
        passwordHash: "unused-test-hash",
        birthDate: "1990-01-01",
        termsAt: new Date(),
        verifiedAt: new Date(),
        onboardingAt: new Date(),
        billingAddress: "Prüfanschrift",
        phone: "+490000000",
    };
    [admin, customer, other] = await database
        .insert(s.users)
        .values([
            {
                ...shared,
                name: "QA Admin",
                email: "admin@packages.example.test",
                role: "admin",
            },
            {
                ...shared,
                name: "QA Kunde",
                email: "customer@packages.example.test",
            },
            {
                ...shared,
                name: "QA Anderer",
                email: "other@packages.example.test",
            },
        ])
        .returning();
});
afterAll(async () => {
    await local.close();
    delete (globalThis as unknown as { platformConnection?: unknown })
        .platformConnection;
});
async function accepted(key = "neustart", early = true) {
    const selected = findServicePackage(key)!;
    const doc = await createOffer(admin, {
        userId: customer.id,
        catalogKey: key,
        items: [
            {
                description: selected.name,
                quantity: 1,
                unitCents: selected.fromCents,
            },
        ],
        description:
            selected.includes.join("\n") +
            "\nLiefertermin: 10.06.2030 nach vollständiger Zuarbeit. Zahlung vor Beginn. Eine Korrekturrunde.",
    });
    await sendOffer(admin, doc.id);
    await respondOffer(
        customer,
        doc.id,
        true,
        "Ich nehme das Angebot verbindlich und zahlungspflichtig an.",
        early,
        early,
    );
    const [invoice] = await database
        .select()
        .from(s.documents)
        .where(eq(s.documents.parentId, doc.id));
    const [order] = await database
        .select()
        .from(s.orders)
        .where(eq(s.orders.id, invoice.orderId!));
    return { doc, invoice, order };
}
async function paid(key = "neustart", early = true) {
    const result = await accepted(key, early);
    await confirmPayment(admin, {
        orderId: result.order.id,
        amountCents: result.order.amountCents,
        bankReference: "QA tatsächlicher Zahlungseingang",
        receivedAt: new Date().toISOString(),
        idempotencyKey: crypto.randomUUID(),
    });
    return result;
}
it("bietet das Anfängerpaket ab 249 € und trennt es von der Vorbereitung einer gewählten Geschäftsidee", () => {
    expect(findServicePackage("neustart")?.fromCents).toBe(24900);
    expect(findServicePackage("gruendung")?.fromCents).toBe(39900);
    expect(servicePackages).toHaveLength(7);
    expect(findServicePackage("neustart")?.description).toContain(
        "fertige Idee",
    );
});
it("speichert eine unverbindliche Anfrage mit dem serverseitigen Paketpreis und Audit, ohne eine Bestellung anzulegen", async () => {
    vi.stubEnv("INQUIRY_NOTIFICATION_EMAIL", "ping@example.test");
    try {
        const result = await requestServicePackage({
            packageKey: "neustart",
            name: "QA Interessent",
            email: "inquiry@packages.example.test",
            body: "Ich möchte eine Selbstständigkeit vorbereiten und habe noch keine Geschäftsidee.",
            consent: true,
        });
        const mails = await database.select().from(s.outbox);
        const pings = mails.filter((mail) =>
            mail.eventKey.endsWith("package-inquiry:" + result.inquiryId),
        );
        expect(pings).toHaveLength(1);
        expect(pings[0]).toMatchObject({
            to: "ping@example.test",
            subject: "Avelsorn: Neue Anfrage",
            ctaUrl: null,
            attachmentKeys: [],
        });
        expect(decrypt(pings[0].encryptedBody)).toBe(
            "Eine neue Anfrage ist eingegangen.",
        );
    } finally {
        vi.unstubAllEnvs();
    }
    const rows = await database.select().from(s.contacts);
    expect(rows).toHaveLength(1);
    expect(rows[0].body).toContain("249");
    expect(rows[0].subject).toContain("Selbstständigkeit");
    expect(await database.select().from(s.orders)).toHaveLength(0);
    expect(
        await database
            .select()
            .from(s.auditEvents)
            .where(eq(s.auditEvents.action, "package.inquired")),
    ).toHaveLength(1);
    await expect(
        requestServicePackage({
            packageKey: "erfunden",
            name: "QA",
            email: "unknown@example.test",
            body: "Eine ausreichend lange Anfrage zur Prüfung.",
            consent: true,
        }),
    ).rejects.toThrow("vorhandenes Paket");
});
it("sperrt alte Neukäufe, verlangt eine Auftragszuordnung und erlaubt zugesagte Bestandstermine", () => {
    expect(() => assertCurrentBooking({ product: "consultation" })).toThrow();
    expect(() => assertCurrentBooking({ product: "upgrade" })).toThrow();
    expect(() => assertCurrentBooking({ product: "package12" })).toThrow();
    expect(() => assertCurrentBooking({ product: "project" })).toThrow();
    expect(() => assertCurrentBooking({ product: "intro" })).not.toThrow();
    expect(() =>
        assertCurrentBooking({
            product: "consultation",
            packageId: crypto.randomUUID(),
        }),
    ).not.toThrow();
});
it("verhindert Paketangebote und spätere Änderungen unter dem Einstiegspreis", async () => {
    await expect(
        createOffer(admin, {
            userId: customer.id,
            catalogKey: "neustart",
            description: "Paket",
            items: [{ description: "Paket", quantity: 1, unitCents: 24899 }],
        }),
    ).rejects.toThrow("mindestens");
    const doc = await createOffer(admin, {
        userId: customer.id,
        catalogKey: "neustart",
        description: "Vor Versand ergänzen: Umfang und Liefertermin",
        items: [{ description: "Paket", quantity: 1, unitCents: 24900 }],
    });
    await expect(sendOffer(admin, doc.id)).rejects.toThrow("vervollständige");
    await expect(
        editDocument(admin, {
            id: doc.id,
            description: "Paket",
            items: [{ description: "Paket", quantity: 1, unitCents: 1 }],
        }),
    ).rejects.toThrow("mindestens");
});
it("friert Umfang und Preis ein, legt erst nach vollständiger Zahlung ein Projekt an und stellt keine Stunden in Rechnung", async () => {
    const { doc, invoice, order } = await accepted();
    await expect(
        respondOffer(
            other,
            doc.id,
            true,
            "Ich nehme dieses Angebot zahlungspflichtig an.",
        ),
    ).rejects.toThrow();
    await confirmPayment(admin, {
        orderId: order.id,
        amountCents: 10000,
        bankReference: "QA Teilzahlung",
        receivedAt: new Date().toISOString(),
        idempotencyKey: crypto.randomUUID(),
    });
    expect(await database.select().from(s.projects)).toHaveLength(0);
    await confirmPayment(admin, {
        orderId: order.id,
        amountCents: 14900,
        bankReference: "QA Restzahlung",
        receivedAt: new Date().toISOString(),
        idempotencyKey: crypto.randomUUID(),
    });
    const [updated] = await database
        .select()
        .from(s.orders)
        .where(eq(s.orders.id, order.id));
    expect(updated.status).toBe("paid");
    expect(updated.amountCents).toBe(24900);
    const contract = updated.contract as {
        catalogPackage: { fromCents: number };
        projectId: string;
    };
    expect(contract.catalogPackage.fromCents).toBe(24900);
    expect(contract.projectId).toBeTruthy();
    expect(await database.select().from(s.packages)).toHaveLength(0);
    const [bill] = await database
        .select()
        .from(s.documents)
        .where(eq(s.documents.id, invoice.id));
    expect(bill.status).toBe("paid");
    expect(bill.amountCents).toBe(24900);
});
it("bucht nur enthaltene Gespräche eines eigenen bezahlten Pakets und storniert sie mit dem Auftrag", async () => {
    const { order } = await paid();
    const input = {
        product: "project" as const,
        serviceOrderId: order.id,
        minutes: 30,
        startsAt: "2030-06-03T09:00:00Z",
        channel: "phone" as const,
        terms: true,
        earlyStart: false,
        withdrawalAcknowledged: false,
    };
    await expect(book(other, input)).rejects.toThrow();
    const booking = await book(customer, input);
    expect(booking.serviceOrderId).toBe(order.id);
    expect(booking.orderId).toBeNull();
    await expect(
        book(customer, { ...input, startsAt: "2030-06-04T09:00:00Z" }),
    ).rejects.toThrow("bereits gebucht");
    await changeBooking(customer, booking.id, "cancel");
    const replacement = await book(customer, input);
    await cancelOrder(admin, order.id, "QA vollständige Vertragsstornierung");
    const [cancelled] = await database
        .select()
        .from(s.bookings)
        .where(eq(s.bookings.id, replacement.id));
    expect(cancelled.status).toBe("cancelled");
    const [updated] = await database
        .select()
        .from(s.orders)
        .where(eq(s.orders.id, order.id));
    const [project] = await database
        .select()
        .from(s.projects)
        .where(
            eq(
                s.projects.id,
                (updated.contract as { projectId: string }).projectId,
            ),
        );
    expect(project.status).toBe("archived");
});
it("schützt den vereinbarten Leistungsbeginn und verhindert Zeiteinträge vor der Zahlung", async () => {
    const { order } = await paid("creator", false);
    const [updated] = await database
        .select()
        .from(s.orders)
        .where(eq(s.orders.id, order.id));
    const projectId = (updated.contract as { projectId: string }).projectId;
    await expect(
        timer(admin, {
            action: "start",
            projectId,
            activity: "Unzulässiger vorzeitiger Start",
        }),
    ).rejects.toThrow("Leistungsbeginn");
    await expect(
        manualTime(admin, {
            projectId,
            startsAt: new Date(Date.now() - 60000).toISOString(),
            endsAt: new Date().toISOString(),
            activity: "Vor Zahlung",
        }),
    ).rejects.toThrow("keine weitere Arbeit");
});
it("nimmt einen vorzeitigen Beginn ohne ausdrückliche Bestätigung nicht an", async () => {
    const doc = await createOffer(admin, {
        userId: customer.id,
        catalogKey: "neustart",
        description:
            "Vereinbarter Umfang mit Aufgabenliste, einem Gespräch und einer Korrektur. Lieferung 10.06.2030, Zahlung vor Beginn.",
        items: [
            {
                description: "Selbstständigkeit vorbereiten",
                quantity: 1,
                unitCents: 24900,
            },
        ],
    });
    await sendOffer(admin, doc.id);
    await expect(
        respondOffer(
            customer,
            doc.id,
            true,
            "Ich nehme dieses Angebot verbindlich und zahlungspflichtig an.",
            true,
            false,
        ),
    ).rejects.toThrow();
    const [unchanged] = await database
        .select()
        .from(s.documents)
        .where(eq(s.documents.id, doc.id));
    expect(unchanged.status).toBe("sent");
});

it("übermittelt Angebot und Vertragsbestätigung vollständig und bewahrt die angebotene Rechtsfassung trotz späterer CMS-Änderung", async () => {
    await database.insert(s.pages).values({
        slug: "agb",
        title: "Vereinbarte Bedingungen",
        description: "Prüfung",
        body: "<p>Vereinbarte Fassung &amp; Mitwirkung.</p>",
    });
    try {
        const doc = await createOffer(admin, {
            userId: customer.id,
            catalogKey: "creator",
            description:
                "Einrichtung eines Creator-Auftritts, Lieferung nach Abstimmung bis 30.06.2030. Zahlung vor Beginn.",
            items: [
                {
                    description: "Creator-Auftritt",
                    quantity: 1,
                    unitCents: 19900,
                },
            ],
        });
        await sendOffer(admin, doc.id);
        const [sent] = await database
            .select()
            .from(s.documents)
            .where(eq(s.documents.id, doc.id));
        const original = savedContractTerms(sent.snapshot)!;
        await expect(
            respondOffer(
                admin,
                doc.id,
                true,
                "Ich nehme dieses Angebot stellvertretend zahlungspflichtig an.",
            ),
        ).rejects.toThrow("zugehörigen Kunden");
        expect(original.terms).toContain("Fassung & Mitwirkung.");
        const [offerMail] = await database
            .select()
            .from(s.outbox)
            .where(eq(s.outbox.eventKey, "offer:" + doc.id));
        expect(decrypt(offerMail.encryptedBody)).toContain("Creator-Auftritt");
        expect(decrypt(offerMail.encryptedBody)).toContain(
            original.withdrawalForm,
        );
        await database
            .update(s.pages)
            .set({ body: "<p>Spätere abweichende Bedingungen.</p>" })
            .where(eq(s.pages.slug, "agb"));
        await respondOffer(
            customer,
            doc.id,
            true,
            "Ich nehme dieses Angebot verbindlich und zahlungspflichtig an.",
            false,
            false,
        );
        const [invoice] = await database
            .select()
            .from(s.documents)
            .where(eq(s.documents.parentId, doc.id));
        const [order] = await database
            .select()
            .from(s.orders)
            .where(eq(s.orders.id, invoice.orderId!));
        const [mail] = await database
            .select()
            .from(s.outbox)
            .where(eq(s.outbox.eventKey, "contract:" + order.id));
        const copy = decrypt(mail.encryptedBody);
        expect(mail.to).toBe(customer.email);
        for (const text of [
            order.reference,
            customer.name,
            customer.billingAddress!,
            doc.description,
            "199",
            original.terms,
            original.withdrawal,
            original.withdrawalForm,
        ])
            expect(copy).toContain(text);
        expect(copy).not.toContain("Spätere abweichende Bedingungen");
        expect(savedContractTerms(order.contract)?.hash).toBe(original.hash);
        await expect(
            respondOffer(
                customer,
                doc.id,
                true,
                "Ich nehme dieses Angebot erneut zahlungspflichtig an.",
            ),
        ).rejects.toThrow();
        expect(
            await database
                .select()
                .from(s.outbox)
                .where(eq(s.outbox.eventKey, "contract:" + order.id)),
        ).toHaveLength(1);
    } finally {
        await database.delete(s.pages).where(eq(s.pages.slug, "agb"));
    }
});

it("rollt Vertragsannahme und Rechnung zurück, wenn die dauerhafte Bestätigung nicht gespeichert werden kann", async () => {
    const doc = await createOffer(admin, {
        userId: customer.id,
        description: "Einzelberatung nach Zahlung mit schriftlichem Ergebnis.",
        items: [
            { description: "Einzelberatung", quantity: 1, unitCents: 19900 },
        ],
    });
    await sendOffer(admin, doc.id);
    const before = (await database.select().from(s.orders)).length;
    await database.execute(
        sql`ALTER TABLE mail_outbox ADD CONSTRAINT qa_contract_outbox_failure CHECK (event_key NOT LIKE 'contract:%') NOT VALID`,
    );
    try {
        await expect(
            respondOffer(
                customer,
                doc.id,
                true,
                "Ich nehme dieses Angebot verbindlich und zahlungspflichtig an.",
            ),
        ).rejects.toThrow();
        expect((await database.select().from(s.orders)).length).toBe(before);
        expect(
            await database
                .select()
                .from(s.documents)
                .where(eq(s.documents.parentId, doc.id)),
        ).toHaveLength(0);
        const [unchanged] = await database
            .select()
            .from(s.documents)
            .where(eq(s.documents.id, doc.id));
        expect(unchanged.status).toBe("sent");
        expect(unchanged.respondedAt).toBeNull();
    } finally {
        await database.execute(
            sql`ALTER TABLE mail_outbox DROP CONSTRAINT qa_contract_outbox_failure`,
        );
    }
});

it("startet keine Projektarbeit, solange die Vertragsbestätigung nicht erfolgreich übermittelt wurde", async () => {
    const { order } = await paid("creator", true);
    const [current] = await database
        .select()
        .from(s.orders)
        .where(eq(s.orders.id, order.id));
    const projectId = (current.contract as { projectId: string }).projectId;
    const start = () =>
        timer(admin, {
            action: "start",
            projectId,
            activity: "Vereinbarte Umsetzung",
        });
    await expect(start()).rejects.toThrow("Vertragsbestätigung");
    await database
        .update(s.outbox)
        .set({ status: "delivery_unknown" })
        .where(eq(s.outbox.eventKey, "contract:" + order.id));
    await expect(start()).rejects.toThrow("Vertragsbestätigung");
    expect(
        await database
            .select()
            .from(s.timeEntries)
            .where(eq(s.timeEntries.projectId, projectId)),
    ).toHaveLength(0);
    await database
        .update(s.outbox)
        .set({ status: "smtp_accepted", sentAt: new Date() })
        .where(eq(s.outbox.eventKey, "contract:" + order.id));
    const running = await start();
    expect(running).toHaveProperty("status", "running");
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(Date.now() + 2000));
    try {
        await timer(admin, { action: "stop" });
    } finally {
        vi.useRealTimers();
    }
    const [entry] = await database
        .select()
        .from(s.timeEntries)
        .where(eq(s.timeEntries.projectId, projectId));
    expect(entry.status).toBe("stopped");
    expect(entry.durationSeconds).toBe(2);
});
