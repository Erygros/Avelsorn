import { after, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z, ZodError } from "zod";
import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/server/db";
import * as s from "@/server/schema";
import {
    AppError,
    assert,
    audit,
    checkOrigin,
    currentUser,
    digest,
    isMinor,
    limit,
    lock,
    owns,
    passwordHash,
    passwordMatches,
    requireUser,
    secretToken,
} from "@/server/security";
import { changeGuest } from "@/server/guest-bookings";
import { register, login, consumeToken, issueToken } from "@/server/auth";
import { setSetting, getSetting } from "@/server/settings";
import { productKey, publicKeys } from "@/server/config";
import { book, changeBooking, introDetails } from "@/server/calendar";
import {
    confirmPayment,
    createOffer,
    sendOffer,
    respondOffer,
    editDocument,
    issueInvoice,
    cancelInvoice,
    cancelOrder,
    recordRefund,
} from "@/server/finance";
import {
    inquiryPingKey,
    notify,
    notifyAdmin,
    queueMail,
} from "@/server/events";
import { onboardingFields } from "@/content/pages";
import {
    manualTime,
    correctTime,
    timer,
    requestApproval,
    respondApproval,
} from "@/server/projects";
import { cleanHtml } from "@/server/content";
import { emailHtml, sendOutboxBatch } from "@/server/mail";
import { encrypt } from "@/server/security";
import { createBackup } from "@/server/backup";
import {
    confirmContractApproval,
    requestOfferApproval,
} from "@/server/guardian";
import { resolvePrivacy } from "@/server/privacy";
import {
    packageInquirySchema,
    requestServicePackage,
    assertCurrentBooking,
} from "@/server/package-catalog";

const str = z.string().trim().min(1).max(10000);
const uuid = z.uuid();
const optionalUuid = z
    .union([uuid, z.literal("")])
    .optional()
    .transform((v) => v || undefined);
export const runtime = "nodejs";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ action: string }> },
) {
    try {
        checkOrigin(request);
        const length = Number(request.headers.get("content-length") ?? 0);
        assert(length <= 200_000, "Die Anfrage ist zu groß.", 413);
        const text = await request.text();
        assert(text.length <= 200_000, "Die Anfrage ist zu groß.", 413);
        const data: unknown = JSON.parse(text);
        const { action } = await params;
        const remote = process.env.VERCEL
            ? (request.headers.get("x-vercel-forwarded-for")?.split(",")[0] ??
              "unknown")
            : "local";
        await limit("request:" + action + ":" + remote, 120, 60);
        const result = await dispatch(action, data);
        if (!["contact", "package-inquiry"].includes(action))
            after(async () => {
                await sendOutboxBatch(5);
            });
        return NextResponse.json(result ?? { ok: true });
    } catch (error) {
        if (error instanceof ZodError)
            return NextResponse.json(
                {
                    error:
                        "Bitte prüfe Deine Angaben: " +
                        error.issues
                            .map((i) => i.path.join(".") + ": " + i.message)
                            .join(" · "),
                },
                { status: 422 },
            );
        if (error instanceof AppError)
            return NextResponse.json(
                { error: error.message },
                { status: error.status },
            );
        if (error instanceof SyntaxError)
            return NextResponse.json(
                { error: "Die Anfrage enthält ungültige Daten." },
                { status: 400 },
            );
        console.error("action_failed", {
            name: error instanceof Error ? error.name : "unknown",
        });
        return NextResponse.json(
            {
                error: "Die Anfrage konnte nicht gespeichert werden. Bitte versuche es erneut.",
            },
            { status: 500 },
        );
    }
}

async function dispatch(action: string, input: unknown): Promise<unknown> {
    if (action === "register") {
        await register(input);
        return {
            redirect: "/anmelden",
            message:
                "Dein Konto wurde angelegt. Bitte bestätige Deine E-Mail-Adresse.",
        };
    }
    if (action === "login") {
        const data = z
            .object({ email: z.email(), password: z.string().max(128) })
            .parse(input);
        const result = await login(data.email, data.password);
        const jar = await cookies();
        const old = jar.get("platform_session")?.value;
        if (old)
            await db()
                .delete(s.sessions)
                .where(eq(s.sessions.tokenHash, digest(old)));
        jar.set("platform_session", result.token, {
            httpOnly: true,
            secure: process.env.PUBLIC_BASE_URL?.startsWith("https://"),
            sameSite: "lax",
            path: "/",
            maxAge: 12 * 3600,
        });
        return { redirect: result.admin ? "/otp" : "/konto" };
    }
    if (action === "logout") {
        const jar = await cookies();
        const token = jar.get("platform_session")?.value;
        if (token)
            await db()
                .delete(s.sessions)
                .where(eq(s.sessions.tokenHash, digest(token)));
        jar.delete("platform_session");
        return { redirect: "/" };
    }
    if (action === "forgot") {
        const { email } = z
            .object({ email: z.email().transform((v) => v.toLowerCase()) })
            .parse(input);
        await limit("reset:" + email, 3, 3600);
        const [user] = await db()
            .select()
            .from(s.users)
            .where(eq(s.users.email, email));
        if (user)
            await db().transaction((tx) => issueToken(user.id, "reset", tx));
        return {
            message:
                "Wenn ein passendes Konto existiert, wird ein Link zum Zurücksetzen bereitgestellt.",
        };
    }
    if (action === "reset") {
        const data = z
            .object({ token: str, password: z.string().min(12).max(128) })
            .parse(input);
        await db().transaction(async (tx) => {
            const userId = await consumeToken(
                data.token,
                "reset",
                undefined,
                tx,
            );
            assert(userId, "Der Link ist ungültig.", 422);
            await tx
                .update(s.users)
                .set({
                    passwordHash: await passwordHash(data.password),
                    updatedAt: new Date(),
                })
                .where(eq(s.users.id, userId));
            await tx.delete(s.sessions).where(eq(s.sessions.userId, userId));
            await audit(
                userId,
                "password.reset",
                "user",
                userId,
                undefined,
                tx,
            );
        });
        return { redirect: "/anmelden" };
    }
    if (action === "verify") {
        const { token, next } = z
            .object({ token: str, next: z.literal("/kalender").optional() })
            .parse(input);
        await db().transaction(async (tx) => {
            const userId = await consumeToken(token, "verify", undefined, tx);
            assert(userId, "Der Link ist ungültig.", 422);
            await tx
                .update(s.users)
                .set({ verifiedAt: new Date() })
                .where(eq(s.users.id, userId));
            await audit(
                userId,
                "email.verified",
                "user",
                userId,
                undefined,
                tx,
            );
        });
        return {
            redirect: next ?? "/konto",
            message: "Deine E-Mail-Adresse ist bestätigt.",
        };
    }
    if (action === "guardian-confirm") {
        const data = z
            .object({ token: str, declaration: z.literal(true) })
            .parse(input);
        await db().transaction(async (tx) => {
            const userId = await consumeToken(
                data.token,
                "guardian",
                undefined,
                tx,
            );
            assert(userId, "Der Link ist ungültig.", 422);
            await tx
                .update(s.guardianConsents)
                .set({ confirmedAt: new Date(), status: "awaiting_review" })
                .where(
                    and(
                        eq(s.guardianConsents.userId, userId),
                        eq(s.guardianConsents.scope, "registration"),
                    ),
                );
            await notifyAdmin(
                "guardian",
                "Zustimmung zur Prüfung",
                "Eine erziehungsberechtigte Person hat die Erklärung bestätigt. Bitte prüfe die Vertretungsberechtigung datensparsam.",
                "guardian:" + userId,
                "/admin/kunden",
                tx,
            );
        });
        return {
            message:
                "Deine Erklärung wurde gespeichert. Die Administration prüft die Vertretungsberechtigung vor Freigabe.",
        };
    }
    if (action === "guardian-contract-confirm") {
        const data = z
            .object({ token: str, declaration: z.literal(true) })
            .parse(input);
        return confirmContractApproval(data.token, data.declaration);
    }
    if (action === "consent") {
        const { statistics } = z
            .object({ statistics: z.boolean() })
            .parse(input);
        const jar = await cookies();
        const visitor = jar.get("platform_visitor")?.value ?? secretToken();
        const user = await currentUser();
        await db().insert(s.consents).values({
            visitorId: visitor,
            userId: user?.id,
            statistics,
            version: "2026-10-26",
        });
        const options = {
            sameSite: "lax" as const,
            secure: process.env.PUBLIC_BASE_URL?.startsWith("https://"),
            path: "/",
            maxAge: 180 * 86400,
        };
        jar.set("platform_visitor", visitor, { ...options, httpOnly: true });
        jar.set(
            "platform_consent",
            statistics ? "statistics" : "necessary",
            options,
        );
        return { ok: true };
    }
    if (action === "package-inquiry") {
        const data = packageInquirySchema.parse(input);
        await limit("package-inquiry:" + data.email, 5, 3600);
        const { inquiryId, message } = await requestServicePackage(data);
        after(async () => {
            await sendOutboxBatch(
                1,
                inquiryPingKey("package-inquiry:" + inquiryId),
            );
        });
        return { message };
    }
    if (action === "contact") {
        const data = z
            .object({
                name: str.max(100),
                email: z.email(),
                subject: str.max(200),
                body: str.max(5000),
                consent: z.literal(true),
                website: z.string().max(0).optional(),
            })
            .parse(input);
        await limit("contact:" + data.email, 5, 3600);
        const row = await db().transaction(async (tx) => {
            const [contact] = await tx
                .insert(s.contacts)
                .values(data)
                .returning();
            await notifyAdmin(
                "contact",
                "Neue Kontaktanfrage",
                `${data.name}: ${data.subject}`,
                "contact:" + contact.id,
                "/admin/kontakt",
                tx,
            );
            return contact;
        });
        after(async () => {
            await sendOutboxBatch(1, inquiryPingKey("contact:" + row.id));
        });
        return { message: "Deine Anfrage wurde gespeichert." };
    }
    if (action === "withdrawal") {
        const data = z
            .object({
                name: str.max(100),
                email: z.email(),
                contractReference: str.max(500),
                statement: str.max(5000),
                confirmed: z.literal(true),
            })
            .parse(input);
        await limit("withdrawal:" + data.email, 10, 3600);
        const reference = "WI-" + secretToken().slice(0, 16);
        await db().transaction(async (tx) => {
            const [row] = await tx
                .insert(s.withdrawals)
                .values({ ...data, reference })
                .returning();
            await queueMail(
                data.email,
                "Eingangsbestätigung Deines Widerrufs",
                `Dein Widerruf ist am ${row.createdAt.toISOString()} eingegangen.\n\nReferenz: ${reference}\nName: ${data.name}\nE-Mail für die Bestätigung: ${data.email}\nVertrag: ${data.contractReference}\nErklärung: ${data.statement}`,
                "withdrawal:" + row.id,
                {},
                tx,
            );
            await notifyAdmin(
                "withdrawal",
                "Widerruf eingegangen",
                reference,
                "withdrawal:" + row.id,
                "/admin/widerrufe",
                tx,
            );
            await audit(
                null,
                "withdrawal.received",
                "withdrawal",
                row.id,
                { reference },
                tx,
            );
        });
        return {
            message: `Dein Widerruf wurde gespeichert. Eingangsreferenz: ${reference}. Die Eingangsbestätigung wurde für den Versand bereitgestellt.`,
        };
    }
    if (action === "setup") {
        const data = z
            .object({
                key: str,
                name: str.max(100),
                email: z.email().transform((v) => v.toLowerCase()),
                password: z.string().min(12).max(128),
                birthDate: z.iso.date(),
            })
            .parse(input);
        await limit("setup", 10, 3600);
        assert(
            process.env.SETUP_KEY &&
                digest(data.key) === digest(process.env.SETUP_KEY),
            "Der Einrichtungsschlüssel stimmt nicht.",
            403,
        );
        assert(
            !isMinor({ birthDate: data.birthDate }),
            "Das Administratorkonto benötigt eine volljährige Betreiberperson.",
        );
        await db().transaction(async (tx) => {
            await lock("identity", tx);
            assert(
                !(await getSetting("setup_complete", false, tx)),
                "Die Ersteinrichtung ist bereits abgeschlossen.",
                409,
            );
            const existing = await tx
                .select()
                .from(s.users)
                .where(eq(s.users.role, "admin"));
            assert(
                !existing.length,
                "Es existiert bereits ein Administrator.",
                409,
            );
            const [admin] = await tx
                .insert(s.users)
                .values({
                    name: data.name,
                    email: data.email,
                    passwordHash: await passwordHash(data.password),
                    role: "admin",
                    birthDate: data.birthDate,
                    termsAt: new Date(),
                    verifiedAt: new Date(),
                })
                .returning();
            await setSetting("setup_complete", true, tx);
            await audit(
                admin.id,
                "setup.completed",
                "user",
                admin.id,
                undefined,
                tx,
            );
        });
        return { redirect: "/anmelden" };
    }
    const user = await requireUser();
    if (user.role === "admin" && action !== "otp") await requireUser(true);
    if (action === "guardian-contract-request") {
        throw new AppError(
            "Die Zustimmung wird für das konkrete neue Angebot angefordert. Bitte öffne das Angebot im Kundenkonto.",
            410,
        );
    }
    if (action === "guardian-offer-request")
        return requestOfferApproval(
            user,
            z.object({ id: uuid }).parse(input).id,
        );
    if (action === "otp") {
        assert(user.role === "admin", "Administratorzugang erforderlich.", 403);
        const { code } = z
            .object({ code: z.string().regex(/^\d{6}$/) })
            .parse(input);
        await limit("otp:" + user.id, 10, 900);
        const id = await db().transaction((tx) =>
            consumeToken(code, "admin_otp", user.id, tx),
        );
        assert(id, "Der Code stimmt nicht oder ist abgelaufen.", 422);
        // Rotate the cookie and database token on elevation.
        const token = secretToken();
        await db()
            .update(s.sessions)
            .set({ adminVerified: true, tokenHash: digest(token) })
            .where(eq(s.sessions.id, user.sessionId));
        (await cookies()).set("platform_session", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.PUBLIC_BASE_URL?.startsWith("https://"),
            path: "/",
            maxAge: 12 * 3600,
        });
        return { redirect: "/admin" };
    }
    if (action === "resend-verification") {
        await limit("verify:" + user.id, 3, 3600);
        await db().transaction((tx) => issueToken(user.id, "verify", tx));
        return { message: "Ein neuer Bestätigungslink wurde bereitgestellt." };
    }
    if (action === "profile") {
        const data = z
            .object({
                name: str.max(100),
                phone: z.string().max(50),
                billingAddress: z.string().max(2000),
                customerType: z.enum(["consumer", "business"]),
            })
            .parse(input);
        await db()
            .update(s.users)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(s.users.id, user.id));
        await audit(user.id, "profile.updated", "user", user.id);
        return { ok: true };
    }
    if (action === "password") {
        const data = z
            .object({
                currentPassword: str,
                password: z.string().min(12).max(128),
            })
            .parse(input);
        assert(
            await passwordMatches(data.currentPassword, user.passwordHash),
            "Dein aktuelles Passwort stimmt nicht.",
        );
        await db().transaction(async (tx) => {
            await tx
                .update(s.users)
                .set({ passwordHash: await passwordHash(data.password) })
                .where(eq(s.users.id, user.id));
            await tx.delete(s.sessions).where(eq(s.sessions.userId, user.id));
            await audit(
                user.id,
                "password.changed",
                "user",
                user.id,
                undefined,
                tx,
            );
        });
        (await cookies()).delete("platform_session");
        return { redirect: "/anmelden" };
    }
    if (action === "onboarding") {
        const data = z
            .object({
                answers: z.record(z.string(), z.string().max(5000)),
                complete: z.boolean(),
            })
            .parse(input);
        if (data.complete)
            for (const [key, label, required] of onboardingFields)
                if (required)
                    assert(
                        data.answers[key]?.trim(),
                        `Bitte ergänze: ${label}`,
                    );
        await db().transaction(async (tx) => {
            await tx
                .insert(s.onboarding)
                .values({
                    userId: user.id,
                    answers: data.answers,
                    completedAt: data.complete ? new Date() : null,
                })
                .onConflictDoUpdate({
                    target: s.onboarding.userId,
                    set: {
                        answers: data.answers,
                        completedAt: data.complete ? new Date() : null,
                        updatedAt: new Date(),
                    },
                });
            if (data.complete) {
                await tx
                    .update(s.users)
                    .set({ onboardingAt: new Date() })
                    .where(eq(s.users.id, user.id));
                await notifyAdmin(
                    "onboarding",
                    "Fragebogen abgeschlossen",
                    `${user.name} hat den Fragebogen abgeschlossen.`,
                    "onboarding:" + user.id,
                    "/admin/onboarding",
                    tx,
                );
            }
        });
        return {
            message: data.complete
                ? "Dein Fragebogen ist abgeschlossen."
                : "Dein Zwischenstand ist gespeichert.",
        };
    }
    if (action === "booking") {
        const data = z
            .object({
                product: productKey,
                minutes: z.number().int(),
                startsAt: z.iso.datetime(),
                channel: z.enum(["phone", "video"]),
                terms: z.literal(true),
                earlyStart: z.boolean(),
                withdrawalAcknowledged: z.boolean(),
                packageId: uuid.optional(),
                serviceOrderId: uuid.optional(),
            })
            .parse(input);
        assertCurrentBooking(data);
        return book(user, data);
    }
    if (action === "intro-booking") {
        const data = z
            .object({
                startsAt: z.iso.datetime(),
                terms: z.literal(true),
                details: introDetails,
            })
            .parse(input);
        return book(user, {
            ...data,
            product: "intro",
            minutes: 15,
            channel: "phone",
            earlyStart: false,
            withdrawalAcknowledged: false,
        });
    }
    if (action === "booking-change") {
        const data = z
            .object({
                id: uuid,
                action: z.enum(["cancel", "reschedule", "complete"]),
                startsAt: z.iso.datetime().optional(),
            })
            .parse(input);
        return changeBooking(user, data.id, data.action, data.startsAt);
    }
    if (action === "package") {
        throw new AppError(
            "Die bisherigen Stunden- und Laufzeitpakete werden nicht mehr verkauft. Bitte frage ein Leistungspaket an.",
            410,
        );
    }
    if (action === "offer-response") {
        const data = z
            .object({
                id: uuid,
                accept: z.boolean(),
                declaration: str,
                earlyStart: z.boolean().default(false),
                withdrawalAcknowledged: z.boolean().default(false),
            })
            .parse(input);
        return respondOffer(
            user,
            data.id,
            data.accept,
            data.declaration,
            data.earlyStart,
            data.withdrawalAcknowledged,
        );
    }
    if (action === "message") {
        const data = z
            .object({
                body: str.max(5000),
                userId: optionalUuid,
                projectId: optionalUuid,
                fileId: optionalUuid,
            })
            .parse(input);
        const customerId = user.role === "admin" ? data.userId : user.id;
        assert(customerId, "Bitte wähle einen Kunden.");
        if (user.role === "admin") await requireUser(true);
        if (data.projectId) {
            const [project] = await db()
                .select()
                .from(s.projects)
                .where(eq(s.projects.id, data.projectId));
            assert(project?.userId === customerId, "Ungültiges Projekt.");
        }
        if (data.fileId) {
            const [file] = await db()
                .select()
                .from(s.files)
                .where(eq(s.files.id, data.fileId));
            assert(file?.userId === customerId, "Ungültige Datei.");
        }
        const [message] = await db()
            .insert(s.messages)
            .values({ ...data, userId: customerId, senderId: user.id })
            .returning();
        if (user.role === "admin")
            await notify(
                customerId,
                "chat",
                "Neue Nachricht",
                "Du hast eine neue Nachricht in Deinem Kundenkonto.",
                "chat:" + message.id,
                "/konto/nachrichten",
            );
        else
            await notifyAdmin(
                "chat",
                "Neue Kundennachricht",
                `${user.name} hat Dir geschrieben.`,
                "chat:" + message.id,
                "/admin/nachrichten",
            );
        return { ok: true };
    }
    if (action === "privacy-request") {
        const data = z
            .object({
                type: z.enum(["access", "export", "correction", "deletion"]),
                body: z.string().max(5000),
            })
            .parse(input);
        const [row] = await db()
            .insert(s.privacyRequests)
            .values({ ...data, userId: user.id })
            .returning();
        await notify(
            user.id,
            "privacy",
            "Deine Datenschutzanfrage ist eingegangen",
            "Wir bearbeiten Deine Anfrage unter Beachtung gesetzlicher Aufbewahrungsfristen.",
            "privacy:" + row.id,
            "/konto/datenschutz",
        );
        await notifyAdmin(
            "privacy",
            "Neue Datenschutzanfrage",
            `${user.name}: ${data.type}`,
            "privacy:" + row.id,
            "/admin/datenschutz",
        );
        return { ok: true };
    }
    if (action === "notification-read") {
        const { id } = z.object({ id: uuid }).parse(input);
        await db()
            .update(s.notifications)
            .set({ readAt: new Date() })
            .where(
                and(
                    eq(s.notifications.id, id),
                    eq(s.notifications.userId, user.id),
                ),
            );
        return { ok: true };
    }
    if (action === "task-request") {
        const data = z
            .object({
                projectId: uuid,
                title: str.max(200),
                description: z.string().max(5000),
            })
            .parse(input);
        const [project] = await db()
            .select()
            .from(s.projects)
            .where(eq(s.projects.id, data.projectId));
        owns(user, project);
        const [task] = await db()
            .insert(s.tasks)
            .values({ ...data, createdBy: user.id, status: "requested" })
            .returning();
        await notifyAdmin(
            "task",
            "Neue Aufgabenanfrage",
            data.title,
            "task:" + task.id,
            "/admin/aufgaben",
        );
        return { ok: true };
    }
    if (action === "approval-response")
        return respondApproval(
            user,
            z
                .object({
                    id: uuid,
                    status: z.enum(["approved", "changes"]),
                    comment: z.string().max(5000),
                })
                .parse(input),
        );
    if (action === "project-comment") {
        const data = z
            .object({ projectId: uuid, body: str.max(5000) })
            .parse(input);
        const [project] = await db()
            .select()
            .from(s.projects)
            .where(eq(s.projects.id, data.projectId));
        owns(user, project);
        await db()
            .insert(s.projectComments)
            .values({ ...data, userId: user.id });
        return { ok: true };
    }
    await requireUser(true);
    if (action === "guest-booking-change") {
        const data = z
            .object({
                id: uuid,
                action: z.enum(["cancel", "reschedule", "complete", "note"]),
                startsAt: z.iso.datetime().optional(),
                notes: z.string().max(10000).optional(),
                sequence: z.number().int().nonnegative().optional(),
            })
            .parse(input);
        return {
            ok: true,
            booking: await changeGuest(data.id, data.action, {
                adminId: user.id,
                startsAt: data.startsAt,
                notes: data.notes,
                expectedSequence: data.sequence,
            }),
        };
    }
    if (action === "calendar-note") {
        const data = z
            .object({ id: uuid, notes: z.string().max(5000) })
            .parse(input);
        await db().transaction(async (tx) => {
            const [saved] = await tx
                .update(s.bookings)
                .set({ notes: data.notes })
                .where(eq(s.bookings.id, data.id))
                .returning({ id: s.bookings.id });
            assert(saved, "Termin nicht gefunden.", 404);
            await audit(
                user.id,
                "booking.note",
                "booking",
                data.id,
                undefined,
                tx,
            );
        });
        return { ok: true };
    }
    if (action === "intro-credit") {
        const data = z
            .object({ userId: uuid, count: z.number().int().min(1).max(10) })
            .parse(input);
        await db().transaction(async (tx) => {
            await lock("calendar", tx);
            const [saved] = await tx
                .update(s.users)
                .set({
                    introCredits: sql`${s.users.introCredits}+${data.count}`,
                })
                .where(
                    and(
                        eq(s.users.id, data.userId),
                        eq(s.users.role, "customer"),
                    ),
                )
                .returning({ id: s.users.id });
            assert(saved, "Kunde nicht gefunden.", 404);
            await audit(
                user.id,
                "booking.intro_credit",
                "user",
                data.userId,
                { count: data.count },
                tx,
            );
        });
        return { ok: true };
    }
    if (action === "calendar-block") {
        const data = z
            .object({
                startsAt: z.iso.datetime(),
                endsAt: z.iso.datetime(),
                kind: z.enum(["blocked", "open"]),
                reason: z.string().trim().max(300),
            })
            .parse(input);
        assert(
            new Date(data.endsAt) > new Date(data.startsAt),
            "Das Ende muss nach dem Beginn liegen.",
        );
        await db().transaction(async (tx) => {
            await lock("calendar", tx);
            const [row] = await tx
                .insert(s.calendarBlocks)
                .values({
                    ...data,
                    startsAt: new Date(data.startsAt),
                    endsAt: new Date(data.endsAt),
                })
                .returning();
            await audit(
                user.id,
                "calendar.interval_added",
                "calendar",
                row.id,
                { kind: data.kind },
                tx,
            );
        });
        return { ok: true };
    }
    if (action === "calendar-block-remove") {
        const data = z.object({ id: uuid }).parse(input);
        await db().transaction(async (tx) => {
            await lock("calendar", tx);
            await tx
                .delete(s.calendarBlocks)
                .where(eq(s.calendarBlocks.id, data.id));
            await audit(
                user.id,
                "calendar.interval_removed",
                "calendar",
                data.id,
                undefined,
                tx,
            );
        });
        return { ok: true };
    }
    if (action === "media-save") {
        const data = z
            .object({
                fileId: uuid,
                origin: z.enum(["original", "ai"]),
                source: str.max(1000),
                alt: str.max(500),
                createdOn: z.iso.datetime(),
                publishedAt: z.string(),
                disclosure: z.string().max(1000),
                publicationApproved: z.literal(true),
            })
            .parse(input);
        const [file] = await db()
            .select()
            .from(s.files)
            .where(eq(s.files.id, data.fileId));
        assert(
            file?.category === "public_media" && file.mime.startsWith("image/"),
            "Lade das Bild zuerst als öffentliche Mediendatei hoch.",
        );
        assert(
            data.origin !== "ai" || data.disclosure.trim().length >= 10,
            "KI-generierte Medien benötigen einen verständlichen Offenlegungstext.",
        );
        const publishedAt = data.publishedAt
            ? new Date(data.publishedAt)
            : null;
        assert(
            !publishedAt || Number.isFinite(publishedAt.getTime()),
            "Ungültiger Veröffentlichungszeitpunkt.",
        );
        const [item] = await db()
            .insert(s.media)
            .values({
                ...data,
                createdOn: new Date(data.createdOn),
                publishedAt,
            })
            .returning();
        await audit(user.id, "media.publication_approved", "media", item.id, {
            origin: data.origin,
        });
        return { ok: true };
    }
    if (action === "admin-booking") {
        const data = z
            .object({
                userId: uuid,
                product: productKey,
                minutes: z.number().int(),
                startsAt: z.iso.datetime(),
                channel: z.enum(["phone", "video"]),
                terms: z.literal(true),
                earlyStart: z.boolean(),
                withdrawalAcknowledged: z.boolean(),
                packageId: optionalUuid,
                serviceOrderId: optionalUuid,
            })
            .parse(input);
        const [customer] = await db()
            .select()
            .from(s.users)
            .where(
                and(eq(s.users.id, data.userId), eq(s.users.role, "customer")),
            );
        assert(customer, "Kunde nicht gefunden.");
        assertCurrentBooking(data);
        return book(customer, data, user.id);
    }
    if (action === "availability-week") {
        const data = z
            .object({
                weekday: z.number().int().min(1).max(7),
                blocked: z.boolean(),
                start: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/),
                end: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/),
            })
            .parse(input);
        assert(
            data.blocked || data.start < data.end,
            "Das Ende muss nach dem Beginn liegen.",
        );
        await db().transaction(async (tx) => {
            await lock("calendar", tx);
            const [existing] = await tx
                .select()
                .from(s.availability)
                .where(eq(s.availability.weekday, data.weekday));
            if (existing)
                await tx
                    .update(s.availability)
                    .set(data)
                    .where(eq(s.availability.id, existing.id));
            else await tx.insert(s.availability).values(data);
            await audit(
                user.id,
                "availability.week_changed",
                "calendar",
                String(data.weekday),
                undefined,
                tx,
            );
        });
        return { ok: true };
    }
    if (action === "guardian-contract-review") {
        const { id } = z.object({ id: uuid }).parse(input);
        const [consent] = await db()
            .select()
            .from(s.guardianConsents)
            .where(
                and(
                    eq(s.guardianConsents.id, id),
                    eq(s.guardianConsents.status, "contract_review"),
                ),
            );
        assert(consent?.confirmedAt, "Eine bestätigte Erklärung fehlt.");
        await db()
            .update(s.guardianConsents)
            .set({ status: "contract_approved", reviewedAt: new Date() })
            .where(eq(s.guardianConsents.id, id));
        await audit(
            user.id,
            "guardian.contract_approved",
            "guardian_consent",
            id,
        );
        return { ok: true };
    }
    if (action === "document-edit")
        return editDocument(
            user,
            z
                .object({
                    id: uuid,
                    description: str,
                    items: z
                        .array(
                            z.object({
                                description: str,
                                quantity: z.number().int().positive(),
                                unitCents: z.number().int().nonnegative(),
                            }),
                        )
                        .min(1)
                        .max(100),
                })
                .parse(input),
        );
    if (action === "invoice-issue")
        return issueInvoice(user, z.object({ id: uuid }).parse(input).id);
    if (action === "invoice-cancel") {
        const data = z
            .object({
                id: uuid,
                reason: str,
                mode: z.enum(["correction", "contract"]),
            })
            .parse(input);
        return cancelInvoice(user, data.id, data.reason, data.mode);
    }
    if (action === "order-cancel") {
        const data = z
            .object({ orderId: uuid, reason: str.min(10) })
            .parse(input);
        return cancelOrder(user, data.orderId, data.reason);
    }
    if (action === "refund")
        return recordRefund(
            user,
            z
                .object({
                    orderId: uuid,
                    amountCents: z.number().int().positive(),
                    bankReference: str.max(200),
                    receivedAt: str,
                    idempotencyKey: str,
                })
                .parse(input),
        );
    if (action === "backup-create") return createBackup(user.id);
    if (action === "post-save") {
        const data = z
            .object({
                id: uuid.optional(),
                title: str.max(200),
                slug: z
                    .string()
                    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
                    .max(200),
                category: str.max(100),
                excerpt: str.max(1000),
                body: str.max(100000),
                seoTitle: z.string().max(200),
                metaDescription: z.string().max(500),
                status: z.enum(["draft", "published", "scheduled", "archived"]),
                publishAt: z.string(),
            })
            .parse(input);
        const publishAt = data.publishAt
            ? new Date(data.publishAt)
            : data.status === "published"
              ? new Date()
              : null;
        assert(
            !publishAt || Number.isFinite(publishAt.getTime()),
            "Ungültiger Veröffentlichungszeitpunkt.",
        );
        assert(
            data.status !== "scheduled" ||
                (publishAt && publishAt > new Date()),
            "Geplante Veröffentlichung benötigt einen zukünftigen Zeitpunkt.",
        );
        const values = {
            ...data,
            body: cleanHtml(data.body),
            publishAt,
            updatedAt: new Date(),
        };
        let id = data.id;
        if (id)
            await db().update(s.posts).set(values).where(eq(s.posts.id, id));
        else {
            const [post] = await db()
                .insert(s.posts)
                .values(values)
                .returning();
            id = post.id;
        }
        await audit(user.id, "post.saved", "post", id, { status: data.status });
        return { ok: true, id };
    }
    if (action === "page-save") {
        const data = z
            .object({
                slug: z.string().regex(/^[a-z0-9]+(?:[-/][a-z0-9]+)*$/),
                title: str.max(200),
                description: str.max(1000),
                body: str.max(100000),
            })
            .parse(input);
        assert(
            !/^(admin|konto|api|entwicklung|kalender|branchen|loesungen|wissen|fragen|unternehmensberatung-castrop-rauxel|paket-anfragen|beruflich-neu-starten|anmelden|registrieren|passwort-vergessen|passwort-zuruecksetzen|email-bestaetigen|zustimmung|vertragszustimmung|otp|einrichtung)(\/|$)/.test(
                data.slug,
            ) &&
                !/^zielgruppen\//.test(data.slug) &&
                ![
                    "terminbuchung",
                    "datenschutzerklaerung",
                    "widerrufsformular",
                    "widerruf",
                ].includes(data.slug),
            "Dieser Pfad gehört zu einer Systemseite oder Weiterleitung. Verwende für einen redaktionellen Inhalt einen eigenen Seitenpfad; Rechtstexte bearbeitest Du unter ihrem Hauptpfad.",
        );
        await db()
            .insert(s.pages)
            .values({ ...data, body: cleanHtml(data.body) })
            .onConflictDoUpdate({
                target: s.pages.slug,
                set: {
                    ...data,
                    body: cleanHtml(data.body),
                    updatedAt: new Date(),
                },
            });
        await audit(user.id, "page.saved", "page", data.slug);
        return { ok: true };
    }
    if (action === "email-preview") {
        const data = z
            .object({
                userId: uuid,
                subject: str.max(200),
                body: str.max(50000),
                attachmentIds: z.array(uuid).max(5).optional(),
            })
            .parse(input);
        const [recipient] = await db()
            .select()
            .from(s.users)
            .where(eq(s.users.id, data.userId));
        assert(recipient, "Empfänger nicht gefunden.");
        const attachments = data.attachmentIds?.length
            ? await db()
                  .select()
                  .from(s.files)
                  .where(inArray(s.files.id, data.attachmentIds))
            : [];
        assert(
            attachments.every(
                (f) =>
                    (f.userId === recipient.id || f.userId === user.id) &&
                    !f.deletedAt,
            ),
            "Ein Anhang ist diesem Empfänger nicht zugeordnet.",
        );
        assert(
            attachments.reduce((sum, f) => sum + f.size, 0) <= 10 * 1024 * 1024,
            "Anhänge dürfen zusammen höchstens 10 MB groß sein.",
        );
        const body = "HTML:" + cleanHtml(data.body);
        const [draft] = await db()
            .insert(s.outbox)
            .values({
                userId: recipient.id,
                to: recipient.email,
                subject: data.subject,
                encryptedBody: encrypt(body),
                eventKey: "manual:" + secretToken(),
                attachmentKeys: attachments.map((f) => f.key),
                status: "draft",
                availableAt: new Date(),
            })
            .returning();
        return {
            id: draft.id,
            html: await emailHtml(data.subject, body),
            attachments: attachments.map((f) => f.name),
        };
    }
    if (action === "email-send") {
        const { id } = z.object({ id: uuid }).parse(input);
        const rows = await db()
            .update(s.outbox)
            .set({ status: "queued", availableAt: new Date() })
            .where(and(eq(s.outbox.id, id), eq(s.outbox.status, "draft")))
            .returning();
        assert(
            rows.length,
            "Dieser Entwurf wurde bereits freigegeben oder existiert nicht.",
            409,
        );
        await audit(user.id, "mail.released", "mail", id);
        return { ok: true };
    }
    if (action === "time-manual")
        return manualTime(
            user,
            z
                .object({
                    projectId: uuid,
                    packageId: optionalUuid,
                    startsAt: str,
                    endsAt: str,
                    activity: str.max(200),
                    description: z.string().max(5000).optional(),
                    adminComment: z.string().max(5000).optional(),
                })
                .parse(input),
        );
    if (action === "time-correct")
        return correctTime(
            user,
            z
                .object({
                    id: uuid,
                    expectedRevision: z.number().int().nonnegative(),
                    projectId: uuid.optional(),
                    packageId: optionalUuid,
                    startsAt: str,
                    endsAt: str,
                    chargeMinutes: z
                        .number()
                        .min(0)
                        .max(31 * 1440),
                    activity: str.max(200),
                    description: z.string().max(5000),
                    adminComment: z.string().max(5000),
                    reason: str.min(10).max(5000),
                })
                .parse(input),
        );
    if (action === "timer")
        return timer(
            user,
            z
                .object({
                    action: z.enum(["start", "pause", "resume", "stop"]),
                    projectId: uuid.optional(),
                    packageId: optionalUuid,
                    activity: str.max(200).optional(),
                    description: z.string().max(5000).optional(),
                })
                .parse(input),
        );
    if (action === "approval-request")
        return requestApproval(
            user,
            z
                .object({
                    projectId: uuid,
                    version: str.max(100),
                    description: str.max(5000),
                })
                .parse(input),
        );
    if (action === "settings") {
        const data = z.record(z.string(), z.string().max(2000)).parse(input);
        for (const key of Object.keys(data)) {
            assert(
                key !== "brand_name" &&
                    publicKeys.includes(key as (typeof publicKeys)[number]),
                "Dieses Feld darf hier nicht geändert werden.",
            );
        }
        await db().transaction(async (tx) => {
            for (const [key, value] of Object.entries(data))
                await setSetting(key, value, tx);
            await audit(
                user.id,
                "settings.updated",
                "settings",
                undefined,
                {
                    keys: Object.keys(data),
                },
                tx,
            );
        });
        return { ok: true };
    }
    if (action === "payment")
        return confirmPayment(
            user,
            z
                .object({
                    orderId: uuid,
                    amountCents: z.number().int().positive(),
                    bankReference: str.max(200),
                    receivedAt: str,
                    idempotencyKey: str,
                })
                .parse(input),
        );
    if (action === "offer-create")
        return createOffer(
            user,
            z
                .object({
                    userId: uuid,
                    catalogKey: z.string().max(80).optional(),
                    description: str,
                    items: z
                        .array(
                            z.object({
                                description: str,
                                quantity: z.number().int().positive(),
                                unitCents: z.number().int().nonnegative(),
                            }),
                        )
                        .min(1)
                        .max(100),
                })
                .parse(input),
        );
    if (action === "offer-send")
        return sendOffer(user, z.object({ id: uuid }).parse(input).id);
    if (action === "project-create") {
        const data = z
            .object({
                userId: uuid,
                name: str.max(200),
                description: str,
                category: str.max(100),
            })
            .parse(input);
        const [project] = await db()
            .insert(s.projects)
            .values({ ...data, adminId: user.id })
            .returning();
        await audit(user.id, "project.created", "project", project.id);
        await notify(
            data.userId,
            "project",
            "Dein neues Projekt",
            data.name,
            "project:" + project.id,
            "/konto/projekte",
        );
        return { ok: true };
    }
    if (action === "project-update") {
        const data = z
            .object({
                id: uuid,
                status: z.enum([
                    "requested",
                    "planned",
                    "in_progress",
                    "waiting",
                    "approval",
                    "completed",
                    "archived",
                ]),
                progressOverride: z.number().int().min(0).max(100).optional(),
            })
            .parse(input);
        await db()
            .update(s.projects)
            .set({
                status: data.status,
                progressOverride: data.progressOverride,
                completedAt: data.status === "completed" ? new Date() : null,
                updatedAt: new Date(),
            })
            .where(eq(s.projects.id, data.id));
        await audit(user.id, "project.updated", "project", data.id, {
            status: data.status,
        });
        return { ok: true };
    }
    if (action === "task-update") {
        const data = z
            .object({
                id: uuid,
                status: z.enum(["planned", "in_progress", "done", "declined"]),
            })
            .parse(input);
        await db()
            .update(s.tasks)
            .set({ status: data.status, updatedAt: new Date() })
            .where(eq(s.tasks.id, data.id));
        await audit(user.id, "task.updated", "task", data.id, {
            status: data.status,
        });
        return { ok: true };
    }
    if (action === "availability") {
        const data = z
            .object({
                day: z.iso.date(),
                blocked: z.boolean(),
                start: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/),
                end: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/),
                reason: z.string().max(200),
            })
            .parse(input);
        assert(
            data.blocked || data.start < data.end,
            "Das Ende muss nach dem Beginn liegen.",
        );
        await db().transaction(async (tx) => {
            await lock("calendar", tx);
            await tx
                .insert(s.availability)
                .values(data)
                .onConflictDoUpdate({ target: s.availability.day, set: data });
            await audit(
                user.id,
                "availability.changed",
                "calendar",
                data.day,
                undefined,
                tx,
            );
        });
        return { ok: true };
    }
    if (action === "guardian-review") {
        const { userId } = z.object({ userId: uuid }).parse(input);
        const [consent] = await db()
            .select()
            .from(s.guardianConsents)
            .where(
                and(
                    eq(s.guardianConsents.userId, userId),
                    eq(s.guardianConsents.status, "awaiting_review"),
                ),
            );
        assert(consent?.confirmedAt, "Eine bestätigte Erklärung fehlt.");
        await db().transaction(async (tx) => {
            await tx
                .update(s.guardianConsents)
                .set({ status: "approved", reviewedAt: new Date() })
                .where(eq(s.guardianConsents.id, consent.id));
            await tx
                .update(s.users)
                .set({ guardianApprovedAt: new Date() })
                .where(eq(s.users.id, userId));
            await audit(
                user.id,
                "guardian.approved",
                "user",
                userId,
                undefined,
                tx,
            );
        });
        return { ok: true };
    }
    if (action === "privacy-resolve") {
        const data = z
            .object({
                id: uuid,
                resolution: str,
                performDeletion: z.boolean().optional(),
            })
            .parse(input);
        return resolvePrivacy(
            user,
            data.id,
            data.resolution,
            data.performDeletion ?? false,
        );
    }
    throw new AppError("Diese Aktion ist nicht verfügbar.", 404);
}
