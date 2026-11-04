import { z } from "zod";
import { and, eq, gt, ne, asc } from "drizzle-orm";
import { db } from "@/server/db";
import { videoSignals } from "@/server/schema";
import {
    requireUser,
    checkOrigin,
    AppError,
    assert,
    encrypt,
    decrypt,
} from "@/server/security";
import {
    meetingAccess,
    verifyMeetingToken,
    videoConfigured,
} from "@/server/video";

async function userAccess() {
    const user = await requireUser();
    if (user.role === "admin") await requireUser(true);
    return user;
}
export async function POST(request: Request) {
    try {
        checkOrigin(request);
        assert(videoConfigured(), "Video ist nicht konfiguriert.", 503);
        const user = await userAccess();
        const data = z
            .object({
                action: z.enum(["join", "refresh", "signal"]),
                bookingId: z.uuid().optional(),
                generation: z.number().int().optional(),
                token: z.string().optional(),
                payload: z.unknown().optional(),
            })
            .parse(await request.json());
        if (data.action === "join")
            return Response.json(
                await meetingAccess(user, data.bookingId!, true),
            );
        if (data.action === "refresh") {
            const refreshed = await meetingAccess(user, data.bookingId!);
            assert(
                refreshed.generation === data.generation,
                "Der Raum wurde neu gestartet. Bitte tritt erneut bei.",
                409,
            );
            return Response.json(refreshed);
        }
        assert(data.token, "Raumzugang erforderlich.", 403);
        const access = verifyMeetingToken(data.token, user.id);
        const current = await meetingAccess(user, access.bookingId);
        assert(
            current.generation === access.generation,
            "Der Raum wurde neu gestartet. Bitte tritt erneut bei.",
            409,
        );
        const encoded = JSON.stringify(data.payload);
        assert(encoded.length <= 20000, "Signal ist zu groß.");
        if (process.env.VIDEO_DRIVER === "local")
            await db()
                .insert(videoSignals)
                .values({
                    bookingId: access.bookingId,
                    senderId: user.id,
                    payload: encrypt(encoded),
                    expiresAt: new Date(Date.now() + 30 * 60_000),
                });
        else {
            const response = await fetch(
                process.env.VIDEO_PROVIDER_URL! + "/signals",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization:
                            "Bearer " + process.env.VIDEO_PROVIDER_SECRET,
                    },
                    body: JSON.stringify({
                        room: access.bookingId + ":" + access.generation,
                        sender: user.id,
                        payload: data.payload,
                    }),
                    signal: AbortSignal.timeout(10000),
                },
            );
            assert(response.ok, "Der Videodienst ist nicht erreichbar.", 503);
        }
        return Response.json({ ok: true });
    } catch (error) {
        return Response.json(
            {
                error:
                    error instanceof AppError
                        ? error.message
                        : "Die Videoverbindung konnte nicht vorbereitet werden.",
            },
            { status: error instanceof AppError ? error.status : 500 },
        );
    }
}
export async function GET(request: Request) {
    try {
        const user = await userAccess();
        const token = request.headers
            .get("authorization")
            ?.replace(/^Bearer /, "");
        assert(token, "Raumzugang erforderlich.", 403);
        const access = verifyMeetingToken(token, user.id);
        const current = await meetingAccess(user, access.bookingId);
        assert(
            current.generation === access.generation,
            "Der Raum wurde neu gestartet. Bitte tritt erneut bei.",
            409,
        );
        const after = new URL(request.url).searchParams.get("after");
        if (process.env.VIDEO_DRIVER === "local") {
            const rows = await db()
                .select()
                .from(videoSignals)
                .where(
                    and(
                        eq(videoSignals.bookingId, access.bookingId),
                        ne(videoSignals.senderId, user.id),
                        gt(videoSignals.expiresAt, new Date()),
                        after
                            ? gt(videoSignals.createdAt, new Date(after))
                            : undefined,
                    ),
                )
                .orderBy(asc(videoSignals.createdAt))
                .limit(100);
            return Response.json(
                rows.map((r) => ({
                    id: r.id,
                    at: r.createdAt.toISOString(),
                    payload: JSON.parse(decrypt(r.payload)),
                })),
                { headers: { "Cache-Control": "no-store" } },
            );
        }
        const response = await fetch(
            `${process.env.VIDEO_PROVIDER_URL}/signals?room=${encodeURIComponent(access.bookingId + ":" + access.generation)}&recipient=${user.id}&after=${encodeURIComponent(after ?? "")}`,
            {
                headers: {
                    Authorization:
                        "Bearer " + process.env.VIDEO_PROVIDER_SECRET,
                },
                signal: AbortSignal.timeout(10000),
                cache: "no-store",
            },
        );
        assert(response.ok, "Der Videodienst ist nicht erreichbar.", 503);
        return Response.json(await response.json());
    } catch (error) {
        return Response.json(
            {
                error:
                    error instanceof AppError
                        ? error.message
                        : "Signale konnten nicht abgerufen werden.",
            },
            { status: error instanceof AppError ? error.status : 500 },
        );
    }
}
