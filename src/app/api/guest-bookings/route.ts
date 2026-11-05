import { after, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z, ZodError } from "zod";
import {
    AppError,
    assert,
    checkOrigin,
    digest,
    limit,
} from "@/server/security";
import {
    bookGuest,
    changeGuest,
    guestAccess,
    guestView,
} from "@/server/guest-bookings";
import { sendOutboxBatch } from "@/server/mail";

export const runtime = "nodejs";
const cookieName = "avelsorn_guest_booking";
const headers = {
    "Cache-Control": "private, no-store",
    "Referrer-Policy": "no-referrer",
    "X-Robots-Tag": "noindex, nofollow",
};
function failure(error: unknown) {
    if (error instanceof AppError)
        return NextResponse.json(
            { error: error.message },
            { status: error.status, headers },
        );
    if (error instanceof ZodError || error instanceof SyntaxError)
        return NextResponse.json(
            {
                error: "Bitte prüfe Deine Kontaktdaten, Dein Anliegen und die Terminauswahl.",
            },
            { status: 422, headers },
        );
    console.error(
        "Guest booking operation failed",
        error instanceof Error ? error.name : "unknown",
    );
    return NextResponse.json(
        {
            error: "Der Termin konnte nicht verarbeitet werden. Bitte versuche es erneut oder kontaktiere uns.",
        },
        { status: 500, headers },
    );
}
function cookieOptions(request: Request) {
    return {
        httpOnly: true,
        secure: new URL(request.url).protocol === "https:",
        sameSite: "lax" as const,
        path: "/api/guest-bookings",
        maxAge: 30 * 86400,
    };
}
export async function GET() {
    try {
        const token = (await cookies()).get(cookieName)?.value ?? "";
        const booking = await guestAccess(token);
        return NextResponse.json({ booking: guestView(booking) }, { headers });
    } catch (e) {
        return failure(e);
    }
}
export async function POST(request: Request) {
    try {
        checkOrigin(request);
        assert(
            Number(request.headers.get("content-length") ?? 0) <= 16000,
            "Die Anfrage ist zu groß.",
            413,
        );
        const text = await request.text();
        assert(
            Buffer.byteLength(text, "utf8") <= 16000,
            "Die Anfrage ist zu groß.",
            413,
        );
        const data = z
            .object({ operation: z.enum(["book", "access", "change"]) })
            .passthrough()
            .parse(JSON.parse(text));
        const ip = process.env.VERCEL
            ? (request.headers.get("x-vercel-forwarded-for")?.split(",")[0] ??
              "unknown")
            : "local";
        await limit("guest-api:" + ip, 30, 3600);
        if (data.operation === "access") {
            const token = z
                .string()
                .regex(/^[A-Za-z0-9_-]{43}$/)
                .parse(data.token);
            const booking = await guestAccess(token);
            const response = NextResponse.json(
                { booking: guestView(booking) },
                { headers },
            );
            response.cookies.set(cookieName, token, cookieOptions(request));
            return response;
        }
        if (data.operation === "change") {
            const input = z
                .object({
                    action: z.enum(["cancel", "reschedule"]),
                    startsAt: z.iso.datetime().optional(),
                    sequence: z.number().int().nonnegative(),
                })
                .parse(data);
            const token = (await cookies()).get(cookieName)?.value ?? "";
            const booking = await guestAccess(token);
            assert(
                input.sequence === booking.sequence,
                "Der Termin wurde bereits geändert. Lade die aktuellen Daten neu.",
                409,
            );
            const updated = await changeGuest(booking.id, input.action, {
                token,
                startsAt: input.startsAt,
                expectedSequence: input.sequence,
            });
            after(async () => {
                await sendOutboxBatch(5);
            });
            return NextResponse.json({ booking: updated }, { headers });
        }
        assert(data.operation === "book", "Unbekannte Aktion.");
        const email = z.email().trim().toLowerCase().parse(data.email);
        await limit("guest-email:" + digest(email), 5, 86400);
        const result = await bookGuest(data);
        const response = NextResponse.json(
            { booking: result.booking },
            { status: 201, headers },
        );
        response.cookies.set(cookieName, result.token, cookieOptions(request));
        after(async () => {
            await sendOutboxBatch(5);
        });
        return response;
    } catch (e) {
        return failure(e);
    }
}
