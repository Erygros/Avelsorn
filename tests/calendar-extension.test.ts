import {
    beforeAll,
    beforeEach,
    afterAll,
    afterEach,
    describe,
    it,
    expect,
    vi,
} from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { eq } from "drizzle-orm";
import * as s from "../src/server/schema";
import type { Database } from "../src/server/db";
import {
    book,
    slots,
    changeBooking,
    ics,
    phoneNumber,
} from "../src/server/calendar";
import { decrypt } from "../src/server/security";
import { runTasks } from "../src/server/tasks";
import { sendOutboxBatch } from "../src/server/mail";

const local = new PGlite();
const database = drizzle(local, { schema: s });
let a: s.User, b: s.User;
const input = {
    product: "intro" as const,
    minutes: 15,
    channel: "phone" as const,
    startsAt: "2030-06-03T06:30:00.000Z",
    terms: true,
    earlyStart: false,
    withdrawalAcknowledged: false,
    details: {
        firstName: "Test",
        lastName: "Kunde",
        phone: "+49 (155) 12345678",
        company: "Testunternehmen",
        topic: "Website",
    },
};
beforeAll(async () => {
    (
        globalThis as unknown as { platformConnection: unknown }
    ).platformConnection = {
        db: database as unknown as Database,
        local,
        close: () => local.close(),
    };
    await migrate(database, { migrationsFolder: "drizzle" });
});
beforeEach(async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2030-06-01T00:00:00Z"));
    vi.stubEnv("APP_SECRET", "13".repeat(32));
    vi.stubEnv("BACKUP_KEY", "");
    vi.stubEnv("SMTP_HOST", "");
    for (const table of [
        s.outbox,
        s.notifications,
        s.bookings,
        s.calendarBlocks,
        s.availability,
        s.users,
        s.settings,
    ])
        await database.delete(table);
    const shared = {
        passwordHash: "fixture",
        birthDate: "1990-01-01",
        termsAt: new Date(),
        verifiedAt: new Date(),
        phone: "+4915512345678",
    };
    [a, b] = await database
        .insert(s.users)
        .values([
            { ...shared, name: "Test A", email: "a@calendar.example.test" },
            { ...shared, name: "Test B", email: "b@calendar.example.test" },
        ])
        .returning();
    await database.insert(s.settings).values([
        { key: "legal_full_name", value: "Testberatung" },
        { key: "public_phone", value: "+493012345678" },
        { key: "public_base_url", value: "https://example.test" },
        { key: "contact_email", value: "office@calendar.example.test" },
    ]);
});
afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
});
afterAll(() => local.close());

describe("Öffentliches Erstgespräch und CRM", () => {
    it("liefert Viertelstunden ohne Vorlauf und beachtet Sommerzeit, Winterzeit und Wochenenden", async () => {
        const summer = await slots("2030-06-03", 15);
        expect(summer).toHaveLength(34);
        expect(summer[0]).toEqual({
            value: "2030-06-03T06:30:00.000Z",
            label: "08:30",
        });
        expect((await slots("2030-12-02", 15))[0].value).toBe(
            "2030-12-02T07:30:00.000Z",
        );
        expect(await slots("2030-06-02", 15)).toHaveLength(20);
        vi.setSystemTime(new Date("2030-06-03T06:29:59Z"));
        expect((await slots("2030-06-03", 15))[0].label).toBe("08:30");
        await expect(slots("2030-02-31", 15)).rejects.toThrow("Datum");
    });
    it("berücksichtigt Pausen, Urlaub und ausdrücklich freigegebene Zusatzzeiten", async () => {
        await database.insert(s.calendarBlocks).values([
            {
                startsAt: new Date("2030-06-03T06:30Z"),
                endsAt: new Date("2030-06-03T07:00Z"),
                kind: "blocked",
                reason: "Pause",
            },
            {
                startsAt: new Date("2030-06-03T05:45Z"),
                endsAt: new Date("2030-06-03T06:30Z"),
                kind: "open",
                reason: "Zusatzzeit",
            },
        ]);
        const available = await slots("2030-06-03", 15);
        expect(available).toHaveLength(35);
        expect(available.map((v) => v.label)).not.toContain("08:30");
        expect(available[0].label).toBe("07:45");
        await database
            .insert(s.availability)
            .values({ day: "2030-06-03", blocked: true });
        expect(await slots("2030-06-03", 15)).toHaveLength(3);
        await expect(
            book(a, { ...input, startsAt: "2030-06-03T06:31:00.000Z" }),
        ).rejects.toThrow("verfügbaren Zeiten");
        expect(await database.select().from(s.bookings)).toHaveLength(0);
    });
    it("bucht ohne Projektfragebogen, blockiert parallele Buchungen und übernimmt geprüfte Kontaktdaten", async () => {
        const attempts = await Promise.allSettled([
            book(a, input),
            book(b, input),
        ]);
        expect(attempts.filter((v) => v.status === "fulfilled")).toHaveLength(
            1,
        );
        const [booking] = await database.select().from(s.bookings);
        expect(booking).toMatchObject({
            status: "confirmed",
            contactPhone: "+4915512345678",
            company: "Testunternehmen",
            topic: "Website",
        });
        expect(
            (await slots("2030-06-03", 15)).map((v) => v.value),
        ).not.toContain(input.startsAt);
        const owner = booking.userId === a.id ? a : b;
        await expect(
            book(owner, { ...input, startsAt: "2030-06-03T07:00:00.000Z" }),
        ).rejects.toThrow("einmal");
        await database
            .update(s.users)
            .set({ introCredits: 1 })
            .where(eq(s.users.id, owner.id));
        await book(owner, { ...input, startsAt: "2030-06-03T07:00:00.000Z" });
        expect(
            (
                await database
                    .select()
                    .from(s.users)
                    .where(eq(s.users.id, owner.id))
            )[0].introCredits,
        ).toBe(0);
        await expect(
            book(owner, { ...input, startsAt: "2030-06-03T07:30:00.000Z" }),
        ).rejects.toThrow("einmal");
        expect(phoneNumber.safeParse("keine Nummer").success).toBe(false);
        await expect(
            book({ ...owner, disabledAt: new Date() }, input),
        ).rejects.toThrow("gesperrt");
    });
    it("versendet aktuelle Telefondetails, aktualisiert ICS und gibt verschobene sowie abgesagte Zeiten frei", async () => {
        const booking = await book(a, input);
        const [mail] = await database
            .select()
            .from(s.outbox)
            .where(eq(s.outbox.userId, a.id));
        expect(decrypt(mail.encryptedBody)).toContain("+493012345678");
        expect(decrypt(mail.encryptedBody)).toContain(
            "Du musst uns nicht selbst anrufen.",
        );
        expect(mail.subject).toBe(
            "Dein kostenloses Erstgespräch bei Avelsorn – Terminbestätigung",
        );
        expect(mail.calendarEvent?.sequence).toBe(0);
        await expect(changeBooking(b, booking.id, "cancel")).rejects.toThrow(
            "nicht gefunden",
        );
        await changeBooking(
            a,
            booking.id,
            "reschedule",
            "2030-06-04T06:30:00Z",
        );
        let [saved] = await database.select().from(s.bookings);
        expect(ics(saved)).toContain("UID:" + booking.id + "@avelsorn.de");
        expect(ics(saved)).toContain("SEQUENCE:1");
        expect(
            ics(saved)
                .split("\r\n")
                .every((line) => Buffer.byteLength(line, "utf8") <= 75),
        ).toBe(true);
        expect((await slots("2030-06-03", 15)).map((v) => v.value)).toContain(
            input.startsAt,
        );
        expect(
            (
                await database
                    .select()
                    .from(s.outbox)
                    .where(eq(s.outbox.id, mail.id))
            )[0].status,
        ).toBe("cancelled");
        await changeBooking(a, booking.id, "cancel");
        [saved] = await database.select().from(s.bookings);
        expect(ics(saved)).toContain("STATUS:CANCELLED");
        expect(ics(saved)).toContain("SEQUENCE:2");
        expect((await slots("2030-06-04", 15)).map((v) => v.value)).toContain(
            "2030-06-04T06:30:00.000Z",
        );
    });
    it("erzeugt Erinnerungen genau einmal je Revision und unterdrückt sie nach einer Absage", async () => {
        const booking = await book(a, input);
        vi.setSystemTime(new Date("2030-06-02T06:30:00Z"));
        await runTasks();
        await runTasks();
        let reminders = (await database.select().from(s.outbox)).filter(
            (m) => m.calendarEvent?.kind === "reminder",
        );
        expect(reminders).toHaveLength(1);
        expect(decrypt(reminders[0].encryptedBody)).toContain("+4915512345678");
        vi.setSystemTime(new Date("2030-06-03T05:30:00Z"));
        await runTasks();
        reminders = (await database.select().from(s.outbox)).filter(
            (m) => m.calendarEvent?.kind === "reminder",
        );
        expect(reminders).toHaveLength(2);
        await changeBooking(a, booking.id, "cancel");
        await runTasks();
        reminders = (await database.select().from(s.outbox)).filter(
            (m) => m.calendarEvent?.kind === "reminder",
        );
        expect(reminders.every((m) => m.status === "cancelled")).toBe(true);
        vi.stubEnv("SMTP_HOST", "unused.example.test");
        vi.stubEnv("SMTP_USERNAME", "unused");
        vi.stubEnv("SMTP_PASSWORD", "unused");
        vi.stubEnv("MAIL_FROM_ADDRESS", "unused@example.test");
        const key = "reminder:" + booking.id + ":0:24";
        expect((await sendOutboxBatch(1, key)).sent).toBe(0);
    });
});
