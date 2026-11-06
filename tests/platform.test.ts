import { beforeAll, afterAll, describe, it, expect } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { eq } from "drizzle-orm";
import * as schema from "../src/server/schema";
import { price } from "../src/server/config";
import {
    digest,
    encrypt,
    decrypt,
    passwordHash,
    passwordMatches,
    owns,
    isMinor,
} from "../src/server/security";
import { book, slots, changeBooking, ics } from "../src/server/calendar";
import {
    purchasePackage,
    confirmPayment,
    createOffer,
    sendOffer,
    respondOffer,
    issueInvoice,
    cancelInvoice,
    recordRefund,
    editDocument,
} from "../src/server/finance";
import { register, consumeToken, issueToken } from "../src/server/auth";
import { manualTime, timer } from "../src/server/projects";
import type { Database } from "../src/server/db";
import { checkOrigin } from "../src/server/security";
import { cleanHtml } from "../src/server/content";
import { documentPdf } from "../src/server/pdf";
import { PDFDocument, PDFRawStream, PDFArray, PDFName } from "pdf-lib";
import { inflateSync } from "node:zlib";

async function renderedPdfText(bytes: Buffer) {
    const pdf = await PDFDocument.load(bytes);
    const text: string[] = [];
    for (const page of pdf.getPages()) {
        const contents = page.node.Contents();
        const streams =
            contents instanceof PDFArray
                ? contents.asArray().map((item) => pdf.context.lookup(item))
                : [contents];
        for (const stream of streams) {
            if (!(stream instanceof PDFRawStream)) continue;
            const raw =
                stream.dict.get(PDFName.of("Filter"))?.toString() ===
                "/FlateDecode"
                    ? inflateSync(stream.getContents())
                    : Buffer.from(stream.getContents());
            for (const match of raw
                .toString("latin1")
                .matchAll(/<([0-9A-Fa-f]+)>\s*Tj/g))
                text.push(Buffer.from(match[1], "hex").toString("latin1"));
        }
    }
    return text.join("\n");
}
import { upload } from "../src/server/files";
import { runTasks } from "../src/server/tasks";
import {
    exportSnapshot,
    sealSnapshot,
    openSnapshot,
    restoreEmpty,
} from "../src/server/backup";
import {
    requestContractApproval,
    confirmContractApproval,
} from "../src/server/guardian";
import { verifyMeetingToken } from "../src/server/video";

const local = new PGlite();
const database = drizzle(local, { schema });
let customer: schema.User, other: schema.User, admin: schema.User;
it("verwendet für den 18. Geburtstag den Berliner Kalendertag", () => {
    const person = { birthDate: "2008-06-01" };
    expect(isMinor(person, new Date("2026-05-31T21:59:59Z"))).toBe(true);
    expect(isMinor(person, new Date("2026-05-31T22:00:00Z"))).toBe(false);
});
it("lehnt eine eigene Registrierung unter sieben Jahren vor dem Speichern ab", async () => {
    const child = new Date();
    child.setUTCFullYear(child.getUTCFullYear() - 5);
    const email = "unter-sieben@example.test";
    await expect(
        register({
            name: "QA Kind",
            email,
            birthDate: child.toISOString().slice(0, 10),
            password: "Test-Passwort-fuer-Kind",
            terms: true,
            guardianEmail: "vertretung@example.test",
            guardianName: "QA Vertretung",
        }),
    ).rejects.toMatchObject({ status: 422 });
    expect(
        await database
            .select()
            .from(schema.users)
            .where(eq(schema.users.email, email)),
    ).toHaveLength(0);
});
beforeAll(async () => {
    process.env.APP_SECRET = "12".repeat(32);
    process.env.PUBLIC_BASE_URL = "http://localhost:3001";
    process.env.BACKUP_KEY = "34".repeat(32);
    process.env.LOCAL_STORAGE_PATH = "tests/output/private-test";
    (
        globalThis as unknown as { platformConnection: unknown }
    ).platformConnection = {
        db: database as unknown as Database,
        local,
        close: () => local.close(),
    };
    await migrate(database, { migrationsFolder: "drizzle" });
    await database.insert(schema.settings).values([
        { key: "legal_full_name", value: "Testanbieter" },
        { key: "business_street", value: "Teststraße 1" },
        { key: "business_postcode", value: "12345" },
        { key: "business_city", value: "Teststadt" },
        { key: "vat_id_if_available", value: "DE123456789" },
    ]);
    const hash = await passwordHash("Test-Passwort-2026!");
    const common = {
        passwordHash: hash,
        birthDate: "1990-01-01",
        termsAt: new Date(),
        verifiedAt: new Date(),
        onboardingAt: new Date(),
        billingAddress: "Teststraße 1, 12345 Teststadt",
        phone: "+49000000000",
    };
    [customer, other, admin] = await database
        .insert(schema.users)
        .values([
            { ...common, name: "Kunde A", email: "a@example.test" },
            { ...common, name: "Kunde B", email: "b@example.test" },
            {
                ...common,
                name: "Admin",
                email: "admin@example.test",
                role: "admin",
            },
        ])
        .returning();
});
afterAll(async () => {
    await local.close();
    delete (globalThis as unknown as { platformConnection?: unknown })
        .platformConnection;
});

describe("Preis- und Sicherheitsregeln", () => {
    it("berechnet alle verbindlichen Preise serverseitig", () => {
        expect(price("intro", 15)).toBe(0);
        expect(price("upgrade", 45)).toBe(1900);
        expect(price("consultation", 30)).toBe(2900);
        expect(price("consultation", 60)).toBe(2900);
        expect(price("consultation", 90)).toBe(5800);
        expect(price("package12")).toBe(9900);
        expect(price("unlimited")).toBe(29900);
        expect(() => price("consultation", 45)).toThrow();
    });
    it("speichert keine Klartextpasswörter und erkennt falsche Passwörter", async () => {
        const hash = await passwordHash("Ein-sicheres-Passwort!");
        expect(hash).not.toContain("Ein-sicheres");
        expect(await passwordMatches("Ein-sicheres-Passwort!", hash)).toBe(
            true,
        );
        expect(await passwordMatches("falsch", hash)).toBe(false);
    });
    it("verschlüsselt vertrauliche Warteschlangeninhalte authentifiziert", () => {
        const encrypted = encrypt("Vertrauliche Nachricht");
        expect(encrypted).not.toContain("Vertrauliche");
        expect(decrypt(encrypted)).toBe("Vertrauliche Nachricht");
        expect(() => decrypt(encrypted.slice(0, -4) + "AAAA")).toThrow();
    });
    it("verhindert fremde Kundenzugriffe unabhängig von IDs", () => {
        expect(() => owns(customer, { userId: other.id })).toThrow();
        expect(owns(customer, { userId: customer.id }).userId).toBe(
            customer.id,
        );
    });
    it("verwirft fehlende oder fremde Origins für Mutationen", () => {
        expect(() =>
            checkOrigin(
                new Request("http://localhost:3001/api/action/profile", {
                    method: "POST",
                    headers: {
                        Origin: "https://fremd.example",
                        "Content-Type": "application/json",
                    },
                }),
            ),
        ).toThrow();
        expect(() =>
            checkOrigin(
                new Request("http://localhost:3001/api/action/profile", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                }),
            ),
        ).toThrow();
        expect(() =>
            checkOrigin(
                new Request("http://localhost:3001/api/action/profile", {
                    method: "POST",
                    headers: {
                        Origin: "http://localhost:3001",
                        "Content-Type": "application/json",
                    },
                }),
            ),
        ).not.toThrow();
    });
    it("entfernt Skripte, Ereignisattribute und externe Trackingbilder aus Inhalten", () => {
        const html = cleanHtml(
            '<script>alert(1)</script><p onclick="alert(1)">Text</p><a href="javascript:alert(1)">Link</a><img src="https://fremd.example/pixel.png">',
        );
        expect(html).not.toContain("<script");
        expect(html).not.toContain("onclick");
        expect(html).not.toContain("javascript:");
        expect(html).not.toContain("fremd.example");
        expect(html).toContain("Text");
    });
});
describe("Registrierung und Token", () => {
    it("registriert echte Daten, verhindert doppelte E-Mail und verwendet Bestätigungstoken einmal", async () => {
        const input = {
            name: "Neue Kundin",
            email: "neu@example.test",
            password: "Lang-und-sicher-2026!",
            birthDate: "1991-04-10",
            terms: true,
        };
        const result = await register(input);
        await expect(register(input)).rejects.toThrow("bereits registriert");
        const token = await database.transaction((tx) =>
            issueToken(
                result.id,
                "verify",
                tx as unknown as Parameters<typeof issueToken>[2],
            ),
        );
        expect(
            await database.transaction((tx) =>
                consumeToken(
                    token,
                    "verify",
                    undefined,
                    tx as unknown as Parameters<typeof consumeToken>[3],
                ),
            ),
        ).toBe(result.id);
        await expect(
            database.transaction((tx) =>
                consumeToken(
                    token,
                    "verify",
                    undefined,
                    tx as unknown as Parameters<typeof consumeToken>[3],
                ),
            ),
        ).rejects.toThrow();
    });
    it("gibt Minderjährigen ohne überprüfte Zustimmung keine Buchung frei", async () => {
        await expect(
            book(
                {
                    ...customer,
                    birthDate: "2012-01-01",
                    guardianApprovedAt: null,
                },
                {
                    product: "intro",
                    minutes: 15,
                    startsAt: "2030-06-03T09:00:00Z",
                    channel: "phone",
                    terms: true,
                    earlyStart: false,
                    withdrawalAcknowledged: false,
                },
            ),
        ).rejects.toThrow("Zustimmung");
    });
    it("begrenzt OTP-Versuche und verbraucht den richtigen Code einmal", async () => {
        const code = await issueToken(admin.id, "admin_otp");
        for (let i = 0; i < 5; i++)
            expect(
                await database.transaction((tx) =>
                    consumeToken(
                        code === "000000" ? "000001" : "000000",
                        "admin_otp",
                        admin.id,
                        tx as unknown as Parameters<typeof consumeToken>[3],
                    ),
                ),
            ).toBeNull();
        await expect(
            database.transaction((tx) =>
                consumeToken(
                    code,
                    "admin_otp",
                    admin.id,
                    tx as unknown as Parameters<typeof consumeToken>[3],
                ),
            ),
        ).rejects.toThrow();
    });
});
describe("Kalender und Transaktionen", () => {
    it("berücksichtigt Berliner Sommer- und Winterzeit", async () => {
        const summer = await slots("2030-06-03", 60);
        const winter = await slots("2030-12-02", 60);
        expect(summer[0]).toEqual({
            label: "08:30",
            value: "2030-06-03T06:30:00.000Z",
        });
        expect(winter[0]).toEqual({
            label: "08:30",
            value: "2030-12-02T07:30:00.000Z",
        });
    });
    it("lässt bei parallelen Buchungen nur einen Kunden gewinnen", async () => {
        const input = {
            product: "intro" as const,
            minutes: 15,
            startsAt: "2030-06-03T09:00:00Z",
            channel: "phone" as const,
            terms: true,
            earlyStart: false,
            withdrawalAcknowledged: false,
        };
        await expect(
            book(customer, { ...input, channel: "video" }),
        ).rejects.toThrow("Dieser Termin findet telefonisch statt.");
        const results = await Promise.allSettled([
            book(customer, input),
            book(other, input),
        ]);
        expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(1);
        expect(results.filter((r) => r.status === "rejected")).toHaveLength(1);
    });
    it("erstellt aktualisierbare ICS und sperrt fremde Änderungen", async () => {
        const [booking] = await database.select().from(schema.bookings);
        const owner = booking.userId === customer.id ? customer : other;
        const stranger = owner.id === customer.id ? other : customer;
        expect(ics(booking)).toContain("DTSTART:20300603T090000Z");
        await expect(
            changeBooking(stranger, booking.id, "cancel"),
        ).rejects.toThrow("nicht gefunden");
        await changeBooking(
            owner,
            booking.id,
            "reschedule",
            "2030-06-03T10:00:00Z",
        );
        const [updated] = await database
            .select()
            .from(schema.bookings)
            .where(eq(schema.bookings.id, booking.id));
        expect(updated.sequence).toBe(1);
        expect(ics(updated)).toContain("SEQUENCE:1");
    });
    it("reserviert kostenpflichtige Termine höchstens 48 Stunden", async () => {
        const booking = await book(customer, {
            product: "consultation",
            minutes: 90,
            startsAt: "2030-06-04T09:00:00Z",
            channel: "phone",
            terms: true,
            earlyStart: true,
            withdrawalAcknowledged: true,
        });
        expect(booking.status).toBe("reserved");
        expect(
            booking.reservedUntil!.getTime() - Date.now(),
        ).toBeLessThanOrEqual(48 * 3600_000);
        const [order] = await database
            .select()
            .from(schema.orders)
            .where(eq(schema.orders.id, booking.orderId!));
        expect(order.amountCents).toBe(5800);
    });
});
describe("Pakete, Bankeingang und Rechnungen", () => {
    it("aktiviert erst nach tatsächlicher Adminbestätigung und verhindert Doppelverbuchung", async () => {
        const order = await purchasePackage(customer, "package12", true, true);
        expect((await database.select().from(schema.packages)).length).toBe(0);
        const data = {
            orderId: order.id,
            amountCents: 9900,
            bankReference: "geprüfter Bankbeleg",
            receivedAt: new Date().toISOString(),
            idempotencyKey: crypto.randomUUID(),
        };
        await confirmPayment(admin, data);
        await confirmPayment(admin, data);
        const packages = await database.select().from(schema.packages);
        expect(packages).toHaveLength(1);
        expect(packages[0].allowanceSeconds).toBe(43200);
        expect(
            packages[0].expiresAt.getTime() - packages[0].startsAt.getTime(),
        ).toBe(28 * 86400_000);
        const [invoice] = await database
            .select()
            .from(schema.documents)
            .where(eq(schema.documents.orderId, order.id));
        expect(invoice.status).toBe("paid");
        expect(invoice.number).toMatch(/^RE-\d{4}-0001$/);
    });
    it("berechnet Verlängerung ohne überlappende Laufzeit", async () => {
        const previous = (await database.select().from(schema.packages))[0];
        const order = await purchasePackage(customer, "package12", true, true);
        await confirmPayment(admin, {
            orderId: order.id,
            amountCents: 9900,
            bankReference: "Verlängerung geprüft",
            receivedAt: new Date().toISOString(),
            idempotencyKey: crypto.randomUUID(),
        });
        const [next] = await database
            .select()
            .from(schema.packages)
            .where(eq(schema.packages.orderId, order.id));
        expect(next.startsAt.getTime()).toBe(previous.expiresAt.getTime());
    });
    it("nimmt ein Angebot einmal an und erstellt genau einen Rechnungsentwurf", async () => {
        const offer = await createOffer(admin, {
            userId: other.id,
            description: "Vereinbarte Unterstützung",
            items: [
                { description: "Projektarbeit", quantity: 2, unitCents: 2900 },
            ],
        });
        await sendOffer(admin, offer.id);
        await respondOffer(
            other,
            offer.id,
            true,
            "Ich nehme dieses Angebot zahlungspflichtig an.",
        );
        await expect(
            respondOffer(other, offer.id, true, "Ich nehme erneut an."),
        ).rejects.toThrow();
        expect(
            await database
                .select()
                .from(schema.documents)
                .where(eq(schema.documents.parentId, offer.id)),
        ).toHaveLength(1);
    });
    it("verhindert negative, überlappende und kontingentüberschreitende Zeitbuchungen", async () => {
        const [project] = await database
            .insert(schema.projects)
            .values({
                userId: customer.id,
                adminId: admin.id,
                name: "Zeitprüfung",
                description: "Isoliertes Testprojekt",
                category: "Test",
            })
            .returning();
        const [pkg] = await database
            .select()
            .from(schema.packages)
            .where(eq(schema.packages.userId, customer.id));
        const start = new Date(pkg.startsAt.getTime() + 1000);
        const end = new Date(start.getTime() + 1000);
        await expect(
            manualTime(admin, {
                projectId: project.id,
                startsAt: end.toISOString(),
                endsAt: start.toISOString(),
                activity: "Test",
            }),
        ).rejects.toThrow();
    });
    it("verhindert Überschneidung und zusätzliche Kontingentbelastung", async () => {
        const [project] = await database.select().from(schema.projects);
        const [pkg] = await database
            .select()
            .from(schema.packages)
            .where(eq(schema.packages.userId, customer.id));
        const start = new Date(Date.now() - 3600_000);
        const end = new Date(Date.now() - 3500_000);
        await database
            .update(schema.packages)
            .set({
                startsAt: new Date(Date.now() - 86400_000),
                usedSeconds: 43190,
            })
            .where(eq(schema.packages.id, pkg.id));
        await expect(
            manualTime(admin, {
                projectId: project.id,
                packageId: pkg.id,
                startsAt: start.toISOString(),
                endsAt: end.toISOString(),
                activity: "Test",
            }),
        ).rejects.toThrow("kontingent");
        await manualTime(admin, {
            projectId: project.id,
            startsAt: start.toISOString(),
            endsAt: end.toISOString(),
            activity: "Interne Projektprüfung",
        });
        await expect(
            manualTime(admin, {
                projectId: project.id,
                startsAt: start.toISOString(),
                endsAt: end.toISOString(),
                activity: "Doppelte Zeit",
            }),
        ).rejects.toThrow("überschneidet");
    });
    it("erstellt echte PDFs und bewahrt finalisierte Dokumente bei späteren Profiländerungen", async () => {
        const invoices = await database.select().from(schema.documents);
        const invoice = invoices.find((d) => d.finalizedAt)!;
        const bytes = await documentPdf(invoice);
        expect(bytes.subarray(0, 4).toString()).toBe("%PDF");
        const [stored] = await database
            .select()
            .from(schema.documents)
            .where(eq(schema.documents.id, invoice.id));
        await database
            .update(schema.users)
            .set({ billingAddress: "Geänderte Anschrift" })
            .where(eq(schema.users.id, invoice.userId));
        expect(digest(await documentPdf(stored))).toBe(digest(bytes));
    });
    it("druckt keine entfernte Steuerzeile, kennzeichnet Entwürfe und verweigert neue endgültige PDFs mit fehlenden Pflichtangaben", async () => {
        const [template] = await database.select().from(schema.documents);
        const issuer = {
            legal_full_name: "Testanbieter",
            business_street: "Teststraße 1",
            business_postcode: "12345",
            business_city: "Teststadt",
            contact_email: "qa@example.test",
            account_holder: "Testanbieter",
            iban: "TESTKONTO",
            bic: "TESTBIC",
            bank_name: "Testbank",
            vat_id_if_available: "",
            small_business_id_if_available: "",
            tax_number: "ALT-NUMMER-NICHT-AUSGEBEN",
        };
        const sample = {
            ...template,
            id: crypto.randomUUID(),
            kind: "invoice",
            status: "draft",
            finalizedAt: null,
            pdfKey: null,
            pdfHash: null,
            amountCents: 24900,
            items: [
                { description: "Testleistung", quantity: 1, unitCents: 24900 },
            ],
            snapshot: {
                business: issuer,
                customer: {
                    name: "Testkunde",
                    billingAddress: "Testanschrift",
                },
            },
        };
        const small = await renderedPdfText(await documentPdf(sample));
        expect(small).toContain("Testanbieter");
        expect(small).not.toContain("ALT-NUMMER");
        expect(small).not.toContain("Steueridentifikation");
        expect(small).not.toContain("{{");
        expect(small).not.toContain("Rechnungsangaben gesondert prüfen");
        const larger = await renderedPdfText(
            await documentPdf({
                ...sample,
                amountCents: 34900,
                items: [
                    {
                        description: "Testleistung",
                        quantity: 1,
                        unitCents: 34900,
                    },
                ],
            }),
        );
        expect(larger).toContain("Ausstellerangaben zu vervollständigen");
        expect(larger).toContain("ENTWURF");
        expect(larger).not.toContain("ENTWICKLUNGSFASSUNG");
        await expect(
            documentPdf({
                ...sample,
                amountCents: 34900,
                finalizedAt: new Date(),
                status: "issued",
            }),
        ).rejects.toThrow("unvollständigen Ausstellerangaben");
        const identified = await renderedPdfText(
            await documentPdf({
                ...sample,
                amountCents: 34900,
                snapshot: {
                    ...sample.snapshot,
                    business: { ...issuer, vat_id_if_available: "DE123456789" },
                },
            }),
        );
        expect(identified).toContain("USt-IdNr.: DE123456789");
        expect(identified).not.toContain("ALT-NUMMER");
    });
});
describe("Dateien, Hintergrundaufgaben und Wiederherstellung", () => {
    it("prüft echte Dateitypen und speichert private Dateien mit Kundenzuordnung", async () => {
        await expect(
            upload(
                customer,
                new File(["<?php echo 1; ?>"], "bild.png", {
                    type: "image/png",
                }),
            ),
        ).rejects.toThrow("Dateityp");
        const file = await upload(
            customer,
            new File(["Projektunterlagen in UTF-8"], "projekt.txt", {
                type: "text/plain",
            }),
        );
        expect(file.userId).toBe(customer.id);
        expect(file.key).not.toContain("projekt.txt");
        expect(file.sha256).toBe(
            digest(Buffer.from("Projektunterlagen in UTF-8")),
        );
    });
    it("gibt abgelaufene Reservierungen frei und wiederholt keine Geschäftsnachrichten", async () => {
        const [reserved] = await database
            .select()
            .from(schema.bookings)
            .where(eq(schema.bookings.status, "reserved"));
        await database
            .update(schema.bookings)
            .set({ reservedUntil: new Date(Date.now() - 1000) })
            .where(eq(schema.bookings.id, reserved.id));
        const result = await runTasks();
        expect(result.expiredReservations).toBe(1);
        const before = (await database.select().from(schema.outbox)).length;
        await runTasks();
        expect((await database.select().from(schema.outbox)).length).toBe(
            before,
        );
        const [booking] = await database
            .select()
            .from(schema.bookings)
            .where(eq(schema.bookings.id, reserved.id));
        expect(booking.status).toBe("expired");
    });
    it("verschlüsselt Backups und stellt Daten samt privaten Dateien in einer isolierten leeren Datenbank wieder her", async () => {
        const snapshot = await exportSnapshot(database as unknown as Database);
        const sealed = sealSnapshot(snapshot);
        expect(sealed.includes(Buffer.from("a@example.test"))).toBe(false);
        const opened = openSnapshot(sealed);
        const restoreLocal = new PGlite();
        const target = drizzle(restoreLocal, { schema });
        await migrate(target, { migrationsFolder: "drizzle" });
        try {
            const result = await restoreEmpty(
                opened,
                target as unknown as Database,
            );
            expect(result.tables).toBeGreaterThan(30);
            expect((await target.select().from(schema.users)).length).toBe(
                (await database.select().from(schema.users)).length,
            );
            expect((await target.select().from(schema.files)).length).toBe(1);
            await expect(
                restoreEmpty(opened, target as unknown as Database),
            ).rejects.toThrow("leere");
        } finally {
            await restoreLocal.close();
        }
        const legacy = structuredClone(opened);
        for (const row of legacy.tables.users as Record<string, unknown>[]) {
            delete row.intro_credits;
            delete row.company;
        }
        delete legacy.tables.calendar_blocks;
        const legacyLocal = new PGlite();
        const legacyTarget = drizzle(legacyLocal, { schema });
        try {
            await migrate(legacyTarget, { migrationsFolder: "drizzle" });
            await restoreEmpty(legacy, legacyTarget as unknown as Database);
            const users = await legacyTarget.select().from(schema.users);
            expect(users.length).toBeGreaterThan(0);
            expect(users.every((user) => user.introCredits === 0)).toBe(true);
        } finally {
            await legacyLocal.close();
        }
    });
});
describe("Erweiterte Vertrags- und Kontingentgrenzen", () => {
    it("bewahrt Rechnungsnummern bei späterer Zahlung und storniert ausschließlich über eigenen Beleg", async () => {
        const offer = await createOffer(admin, {
            userId: other.id,
            description: "Gesondert vereinbarte Leistung",
            items: [{ description: "Umsetzung", quantity: 1, unitCents: 1900 }],
        });
        await sendOffer(admin, offer.id);
        await respondOffer(
            other,
            offer.id,
            true,
            "Ich nehme das konkrete Angebot zahlungspflichtig an.",
        );
        const [invoice] = await database
            .select()
            .from(schema.documents)
            .where(eq(schema.documents.parentId, offer.id));
        await issueInvoice(admin, invoice.id);
        const [issued] = await database
            .select()
            .from(schema.documents)
            .where(eq(schema.documents.id, invoice.id));
        const bytes = await documentPdf(issued);
        await confirmPayment(admin, {
            orderId: invoice.orderId!,
            amountCents: 1900,
            bankReference: "Geprüfter Zahlungseingang",
            receivedAt: new Date().toISOString(),
            idempotencyKey: crypto.randomUUID(),
        });
        const [paid] = await database
            .select()
            .from(schema.documents)
            .where(eq(schema.documents.id, invoice.id));
        expect(paid.status).toBe("paid");
        expect(paid.number).toBe(issued.number);
        expect(digest(await documentPdf(paid))).toBe(digest(bytes));
        await expect(
            editDocument(admin, {
                id: invoice.id,
                description: "Nachträgliche Änderung",
                items: invoice.items,
            }),
        ).rejects.toThrow("Finalisierte");
        const correction = await cancelInvoice(
            admin,
            invoice.id,
            "Vollständige Aufhebung nach dokumentierter Prüfung.",
        );
        expect(correction.amountCents).toBe(-1900);
        expect(correction.number).toMatch(/^ST-/);
        await expect(
            cancelInvoice(admin, invoice.id, "Noch ein Storno ohne Grundlage."),
        ).rejects.toThrow();
        await recordRefund(admin, {
            orderId: invoice.orderId!,
            amountCents: 1900,
            bankReference: "Geprüfte Rücküberweisung",
            receivedAt: new Date().toISOString(),
            idempotencyKey: crypto.randomUUID(),
        });
        const [order] = await database
            .select()
            .from(schema.orders)
            .where(eq(schema.orders.id, invoice.orderId!));
        expect(order.status).toBe("refunded");
        expect(order.paidCents).toBe(0);
    });
    it("beendet einen übergelaufenen Timer ohne negative Kontingente oder zusätzliche Kosten", async () => {
        const pkg = (
            await database
                .select()
                .from(schema.packages)
                .where(eq(schema.packages.userId, customer.id))
        ).find((p) => p.startsAt <= new Date() && p.expiresAt > new Date())!;
        const [project] = await database
            .select()
            .from(schema.projects)
            .where(eq(schema.projects.userId, customer.id));
        await database
            .update(schema.packages)
            .set({ usedSeconds: 43195 })
            .where(eq(schema.packages.id, pkg.id));
        await database.insert(schema.timeEntries).values({
            userId: customer.id,
            projectId: project.id,
            adminId: admin.id,
            packageId: pkg.id,
            startsAt: new Date(Date.now() - 20000),
            segmentAt: new Date(Date.now() - 20000),
            activity: "Begrenzter Timer",
            source: "timer",
            status: "running",
        });
        await timer(admin, { action: "stop" });
        const [updated] = await database
            .select()
            .from(schema.packages)
            .where(eq(schema.packages.id, pkg.id));
        expect(updated.usedSeconds).toBe(43200);
        const entries = await database.select().from(schema.timeEntries);
        const stopped = entries.find((t) => t.activity === "Begrenzter Timer")!;
        expect(stopped.durationSeconds).toBeGreaterThanOrEqual(20);
        expect(stopped.chargedSeconds).toBe(5);
        expect(stopped.status).toBe("stopped");
        await expect(timer(admin, { action: "stop" })).rejects.toThrow(
            "keinen aktiven",
        );
    });
    it("verbraucht eine konkrete Minderjährigenvertretung genau einmal", async () => {
        const [minor] = await database
            .insert(schema.users)
            .values({
                name: "Minderjährige Testperson",
                email: "minor@example.test",
                passwordHash: await passwordHash("Sicheres-Testpasswort-2026"),
                birthDate: "2012-01-01",
                termsAt: new Date(),
                verifiedAt: new Date(),
                onboardingAt: new Date(),
                guardianApprovedAt: new Date(),
                billingAddress: "Testanschrift",
                phone: "+4900000000",
            })
            .returning();
        await database.insert(schema.guardianConsents).values({
            userId: minor.id,
            name: "Erziehungsberechtigte Testperson",
            email: "guardian@example.test",
            scope: "registration",
            status: "approved",
            confirmedAt: new Date(),
            reviewedAt: new Date(),
        });
        await expect(
            purchasePackage(minor, "package12", true, true),
        ).rejects.toThrow("konkrete Bestellung");
        await requestContractApproval(minor, "package12");
        const [mail] = await database
            .select()
            .from(schema.outbox)
            .where(eq(schema.outbox.to, "guardian@example.test"));
        const token = new URL(decrypt(mail.ctaUrl!.slice(4))).searchParams.get(
            "token",
        )!;
        await confirmContractApproval(token, true);
        await expect(confirmContractApproval(token, true)).rejects.toThrow();
        const rows = await database
            .select()
            .from(schema.guardianConsents)
            .where(eq(schema.guardianConsents.userId, minor.id));
        const approval = rows.find((c) => c.status === "contract_review")!;
        await database
            .update(schema.guardianConsents)
            .set({ status: "contract_approved", reviewedAt: new Date() })
            .where(eq(schema.guardianConsents.id, approval.id));
        await purchasePackage(minor, "package12", true, true);
        await expect(
            purchasePackage(minor, "package12", true, true),
        ).rejects.toThrow("konkrete Bestellung");
        expect(
            await database
                .select()
                .from(schema.orders)
                .where(eq(schema.orders.userId, minor.id)),
        ).toHaveLength(1);
    });
    it("verwirft manipulierte Videoraumtokens", () => {
        expect(() =>
            verifyMeetingToken("ungueltig.signatur", customer.id),
        ).toThrow();
    });
});
