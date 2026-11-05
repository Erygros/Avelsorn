import {
    beforeAll,
    beforeEach,
    afterAll,
    afterEach,
    expect,
    it,
    vi,
} from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import nodemailer, { type SendMailOptions } from "nodemailer";
import { sendOutboxBatch } from "../src/server/mail";
import sitemap from "../src/app/sitemap";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import * as s from "../src/server/schema";
import type { Database } from "../src/server/db";
import {
    bookGuest,
    changeGuest,
    guestAccess,
    guestView,
} from "../src/server/guest-bookings";
import { book, slots } from "../src/server/calendar";
import { decrypt } from "../src/server/security";
import { runTasks } from "../src/server/tasks";
import { exportSnapshot, restoreEmpty } from "../src/server/backup";
import * as events from "../src/server/events";

const local = new PGlite();
const database = drizzle(local, { schema: s });
let admin: s.User, customer: s.User;
const input = (
    email = "gast@example.test",
    startsAt = "2030-06-03T06:30:00.000Z",
) => ({
    firstName: "Erika",
    lastName: "Gast",
    email,
    phone: "+49 155 12345678",
    topic: "Eine Website für meinen Betrieb",
    startsAt,
    terms: true,
    requestId: randomUUID(),
});
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
    vi.stubEnv("APP_SECRET", "14".repeat(32));
    vi.stubEnv("PUBLIC_BASE_URL", "https://example.test");
    vi.stubEnv("BACKUP_KEY", "");
    vi.stubEnv("SMTP_HOST", "");
    vi.stubEnv("INQUIRY_NOTIFICATION_EMAIL", "owner@example.test");
    for (const t of [
        s.outbox,
        s.notifications,
        s.bookings,
        s.guestBookings,
        s.pages,
        s.calendarBlocks,
        s.availability,
        s.users,
        s.settings,
    ])
        await database.delete(t);
    const shared = {
        passwordHash: "fixture",
        birthDate: "1990-01-01",
        termsAt: new Date(),
        verifiedAt: new Date(),
        phone: "+4915512345678",
    };
    [admin, customer] = await database
        .insert(s.users)
        .values([
            {
                ...shared,
                name: "Admin",
                email: "admin@example.test",
                role: "admin",
            },
            { ...shared, name: "Kunde", email: "kunde@example.test" },
        ])
        .returning();
    await database.insert(s.settings).values([
        { key: "public_phone", value: "+493012345678" },
        { key: "legal_full_name", value: "Testanbieter" },
        { key: "public_base_url", value: "https://example.test" },
    ]);
});
afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    vi.unstubAllEnvs();
});
afterAll(() => local.close());
const regular = (startsAt: string) =>
    book(customer, {
        product: "intro",
        minutes: 15,
        channel: "phone",
        startsAt,
        terms: true,
        earlyStart: false,
        withdrawalAcknowledged: false,
    });

it("speichert einen Gast ohne Konto und hält Kontaktdaten aus privaten Ping-Mails heraus", async () => {
    const { booking, token } = await bookGuest(input());
    expect(await database.select().from(s.users)).toHaveLength(2);
    const stored = await guestAccess(token);
    expect(stored.tokenHash).not.toBe(token);
    expect(guestView(stored)).not.toHaveProperty("tokenHash");
    expect(guestView(stored)).not.toHaveProperty("notes");
    expect(
        (await slots("2030-06-03", 15)).some(
            (slot) => slot.value === booking.startsAt,
        ),
    ).toBe(false);
    const mail = await database.select().from(s.outbox);
    const confirmation = mail.find((m) => m.to === "gast@example.test")!;
    expect(decrypt(confirmation.encryptedBody)).toContain(
        "Ich melde mich zum gebuchten Termin telefonisch bei Dir.",
    );
    expect(decrypt(confirmation.encryptedBody)).toContain("+493012345678");
    expect(decrypt(confirmation.ctaUrl!.slice(4))).toBe(
        "https://example.test/kalender/gast#zugang=" + token,
    );
    expect(confirmation.ctaUrl).not.toContain(token);
    expect(confirmation.calendarEvent?.guestBookingId).toBe(booking.id);
    const ping = mail.find((m) => m.to === "owner@example.test")!;
    expect(decrypt(ping.encryptedBody)).toBe(
        "Eine neue Anfrage ist eingegangen.",
    );
    expect(await database.select().from(s.notifications)).toHaveLength(1);
});
it("serialisiert konkurrierende Gast- und Kontobuchungen", async () => {
    const result = await Promise.allSettled([
        bookGuest(input()),
        regular("2030-06-03T06:30:00.000Z"),
    ]);
    expect(result.filter((r) => r.status === "fulfilled")).toHaveLength(1);
    expect(
        (await database.select().from(s.bookings)).length +
            (await database.select().from(s.guestBookings)).length,
    ).toBe(1);
});
it("verhindert Gastkollisionen, Wiederholungen und idempotente Wiederholung", async () => {
    const request = input();
    await bookGuest(request);
    await expect(
        bookGuest(input("zweiter@example.test")),
    ).rejects.toMatchObject({ status: 409 });
    await expect(bookGuest(request)).rejects.toMatchObject({ status: 409 });
    await expect(
        bookGuest(input("GAST@example.test", "2030-06-03T07:00:00.000Z")),
    ).rejects.toMatchObject({ status: 409 });
    expect(await database.select().from(s.guestBookings)).toHaveLength(1);
});
it("verhindert Erstgespräch-Wiederholungen über den jeweils anderen Buchungsweg", async () => {
    await bookGuest(input(customer.email));
    await expect(regular("2030-06-03T07:00:00.000Z")).rejects.toMatchObject({
        status: 409,
    });
    const [guest] = await database.select().from(s.guestBookings);
    await changeGuest(guest.id, "cancel", { adminId: admin.id });
    await regular("2030-06-03T07:00:00.000Z");
    await expect(
        bookGuest(input(customer.email, "2030-06-03T08:00:00.000Z")),
    ).rejects.toMatchObject({ status: 409 });
});
it("weist ungültige Eingaben und Termine ab", async () => {
    for (const invalid of [
        { ...input(), topic: "" },
        { ...input(), email: "falsch" },
        { ...input(), phone: "abc" },
        { ...input(), terms: false },
        { ...input(), website: "spam" },
        { ...input(), startsAt: "2030-06-03T06:31:00.000Z" },
        { ...input(), startsAt: "2030-06-03T02:00:00.000Z" },
        { ...input(), startsAt: "2029-01-01T08:00:00.000Z" },
    ])
        await expect(bookGuest(invalid)).rejects.toBeDefined();
    expect(await database.select().from(s.guestBookings)).toHaveLength(0);
});
it("erlaubt nur dem Tokeninhaber oder Admin Änderungen, ohne interne Notizen preiszugeben", async () => {
    const a = await bookGuest(input()),
        b = await bookGuest(
            input("b@example.test", "2030-06-03T07:00:00.000Z"),
        );
    await expect(guestAccess("x".repeat(43))).rejects.toMatchObject({
        status: 401,
    });
    await expect(
        changeGuest(a.booking.id, "cancel", { token: b.token }),
    ).rejects.toMatchObject({ status: 403 });
    await expect(
        changeGuest(a.booking.id, "note", { token: a.token, notes: "privat" }),
    ).rejects.toMatchObject({ status: 403 });
    await expect(
        changeGuest(a.booking.id, "cancel", { adminId: customer.id }),
    ).rejects.toMatchObject({ status: 403 });
    await changeGuest(a.booking.id, "note", {
        adminId: admin.id,
        notes: "Interne Notiz",
    });
    expect((await guestAccess(a.token)).notes).toBe("Interne Notiz");
    expect(guestView(await guestAccess(a.token))).not.toHaveProperty("notes");
});
it("verschiebt und storniert mit Versionsschutz und unterdrückt veraltete Mails", async () => {
    const { booking, token } = await bookGuest(input());
    const updated = await changeGuest(booking.id, "reschedule", {
        token,
        startsAt: "2030-06-03T08:00:00.000Z",
        expectedSequence: 0,
    });
    expect(updated.sequence).toBe(1);
    expect(
        (await slots("2030-06-03", 15)).some(
            (v) => v.value === booking.startsAt,
        ),
    ).toBe(true);
    await expect(
        changeGuest(booking.id, "cancel", { token, expectedSequence: 0 }),
    ).rejects.toMatchObject({ status: 409 });
    await changeGuest(booking.id, "cancel", { token, expectedSequence: 1 });
    const mails = await database.select().from(s.outbox);
    expect(
        mails.filter(
            (m) => m.calendarEvent?.guestBookingId && m.status === "queued",
        ),
    ).toHaveLength(1);
    expect(
        mails.find((m) => m.eventKey.endsWith(":cancellation"))?.calendarEvent
            ?.sequence,
    ).toBe(2);
});
it("erzeugt Erinnerungen einmal je Revision und schützt abgelaufene Zugänge", async () => {
    const { booking, token } = await bookGuest(input());
    vi.setSystemTime(new Date("2030-06-02T06:31:00Z"));
    expect((await runTasks()).reminders).toBe(1);
    expect((await runTasks()).reminders).toBe(0);
    vi.setSystemTime(new Date("2030-06-03T05:31:00Z"));
    expect((await runTasks()).reminders).toBe(1);
    await changeGuest(booking.id, "cancel", { token });
    expect(
        (await database.select().from(s.outbox)).filter(
            (m) => m.eventKey.includes(":reminder:") && m.status === "queued",
        ),
    ).toHaveLength(0);
    vi.setSystemTime(new Date("2030-08-01T00:00:00Z"));
    await expect(guestAccess(token)).rejects.toMatchObject({ status: 401 });
});
it("rollt die Buchung bei fehlgeschlagener Mailpersistenz zurück", async () => {
    vi.spyOn(events, "queueMail").mockRejectedValueOnce(
        new Error("outbox unavailable"),
    );
    await expect(bookGuest(input())).rejects.toThrow("outbox unavailable");
    expect(await database.select().from(s.guestBookings)).toHaveLength(0);
});
it("erhält Gastbuchungen und Zugangshashes bei Sicherung und Wiederherstellung", async () => {
    const { token } = await bookGuest(input());
    const snapshot = await exportSnapshot();
    expect(snapshot.tables.guest_bookings).toHaveLength(1);
    const target = new PGlite();
    const restored = drizzle(target, { schema: s });
    try {
        await migrate(restored, { migrationsFolder: "drizzle" });
        await restoreEmpty(snapshot, restored as unknown as Database);
        expect(
            (await guestAccess(token, restored as unknown as Database)).email,
        ).toBe("gast@example.test");
    } finally {
        await target.close();
    }
});

it("erstellt Kalenderanhänge am Mailadapter und verwirft eine veraltete Revision vor dem Versand", async () => {
    const sendMail = vi
        .fn<(mail: SendMailOptions) => Promise<{ messageId: string }>>()
        .mockResolvedValue({ messageId: "isolated-unit-mail" });
    vi.spyOn(nodemailer, "createTransport").mockReturnValue({
        sendMail,
    } as unknown as ReturnType<typeof nodemailer.createTransport>);
    for (const [key, value] of Object.entries({
        SMTP_HOST: "smtp.example.test",
        SMTP_USERNAME: "fixture",
        SMTP_PASSWORD: "fixture",
        MAIL_FROM_ADDRESS: "sender@example.test",
    }))
        vi.stubEnv(key, value);
    const { booking, token } = await bookGuest(input());
    const [confirmation] = (await database.select().from(s.outbox)).filter(
        (row) => row.calendarEvent?.guestBookingId === booking.id,
    );
    expect((await sendOutboxBatch(1, confirmation.eventKey)).sent).toBe(1);
    expect(sendMail.mock.calls[0][0]).toMatchObject({
        icalEvent: {
            content: expect.stringContaining(
                "UID:" + booking.id + "@avelsorn.de",
            ),
        },
        html: expect.stringContaining("Termin verwalten"),
    });
    await changeGuest(booking.id, "cancel", { token });
    await database
        .update(s.outbox)
        .set({ status: "queued" })
        .where(eq(s.outbox.id, confirmation.id));
    expect((await sendOutboxBatch(1, confirmation.eventKey)).sent).toBe(0);
    expect(sendMail).toHaveBeenCalledTimes(1);
    expect(
        (await sendOutboxBatch(1, "guest:" + booking.id + ":1:cancellation"))
            .sent,
    ).toBe(1);
    expect(sendMail.mock.calls[1][0]).toMatchObject({
        icalEvent: { content: expect.stringContaining("STATUS:CANCELLED") },
    });
    expect(sendMail.mock.calls[1][0]).toMatchObject({
        icalEvent: { content: expect.stringContaining("SEQUENCE:1") },
    });
});
it("führt kanonische Leistungs- und Über-Seiten in der Sitemap, keine Gastzugänge oder Alias-Duplikate", async () => {
    vi.stubEnv("PRODUCTION_APPROVED", "true");
    vi.stubEnv("PUBLIC_BASE_URL", "https://example.test");
    const rows = await sitemap();
    const urls = rows.map((row) => row.url);
    expect(urls).toContain("https://example.test/ueber-mich");
    expect(urls).toContain("https://example.test/leistungen/trading-etf");
    expect(urls).not.toContain("https://example.test/kalender/gast");
    expect(urls).not.toContain("https://example.test/gruendung");
    expect(new Set(urls).size).toBe(urls.length);
});

it("hält redaktionelle Seiten in der aktuellen Sitemap und filtert alte ungültige Systempfade", async () => {
    vi.stubEnv("PRODUCTION_APPROVED", "true");
    vi.stubEnv("PLATFORM_ENV", "production");
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("PUBLIC_BASE_URL", "https://example.test");
    await database.insert(s.pages).values([
        {
            slug: "eigener-ratgeber",
            title: "Eigener Inhalt",
            description: "Freigegebene redaktionelle Seite",
            body: "<p>Inhalt</p>",
        },
        {
            slug: "admin/alt",
            title: "Alt",
            description: "Ungültiger Altbestand",
            body: "<p>nicht öffentlich</p>",
        },
        {
            slug: "wissen/unbekannt",
            title: "Alt",
            description: "Nicht erreichbarer Systempfad",
            body: "<p>nicht öffentlich</p>",
        },
    ]);
    const list = await sitemap();
    expect(
        list.some(
            (item) =>
                item.url === "https://example.test/eigener-ratgeber" &&
                item.lastModified,
        ),
    ).toBe(true);
    expect(
        list.some(
            (item) =>
                item.url.includes("admin/alt") ||
                item.url.includes("wissen/unbekannt"),
        ),
    ).toBe(false);
    expect(
        list.some(
            (item) => item.url === "https://example.test/branchen/kioske",
        ),
    ).toBe(true);
    expect(
        list.some(
            (item) =>
                item.url === "https://example.test/wissen/website-briefing",
        ),
    ).toBe(true);
});
