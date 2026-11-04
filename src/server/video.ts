import { createHmac, timingSafeEqual } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "./db";
import {
    bookings,
    orders,
    videoRooms,
    videoSignals,
    type User,
} from "./schema";
import { assert, owns, key, lock } from "./security";

export const videoConfigured = () => {
    const driver = process.env.VIDEO_DRIVER;
    if (driver === "local")
        return !process.env.VERCEL && process.env.PLATFORM_ENV !== "production";
    return (
        driver !== "disabled" &&
        Boolean(
            process.env.VIDEO_PROVIDER_URL && process.env.VIDEO_PROVIDER_SECRET,
        )
    );
};
export async function meetingAccess(user: User, id: string, join = false) {
    const [booking] = await db()
        .select()
        .from(bookings)
        .where(eq(bookings.id, id));
    owns(user, booking);
    assert(
        booking.product !== "intro" &&
            booking.channel === "video" &&
            booking.status === "confirmed",
        "Dieser Videoraum ist nicht verfügbar.",
        403,
    );
    if (booking.product === "project") {
        const [order] = booking.serviceOrderId
            ? await db()
                  .select()
                  .from(orders)
                  .where(eq(orders.id, booking.serviceOrderId))
            : [];
        assert(
            order?.userId === booking.userId &&
                order.status === "paid" &&
                !order.cancelledAt,
            "Der Videoraum setzt einen vollständig bezahlten, aktiven Auftrag voraus.",
            403,
        );
    }
    const now = Date.now();
    assert(
        now >= booking.startsAt.getTime() - 15 * 60_000 &&
            now <= booking.endsAt.getTime() + 30 * 60_000,
        "Der Videoraum öffnet 15 Minuten vor dem Termin und schließt 30 Minuten danach.",
        403,
    );
    let [room] = await db()
        .select()
        .from(videoRooms)
        .where(eq(videoRooms.bookingId, id));
    if (join)
        room = await db().transaction(async (tx) => {
            await lock("video:" + id, tx);
            const [current] = await tx
                .select()
                .from(videoRooms)
                .where(eq(videoRooms.bookingId, id));
            const repeat =
                current &&
                (user.role === "admin"
                    ? current.adminJoinedAt
                    : current.customerJoinedAt);
            const generation = (current?.generation ?? 1) + (repeat ? 1 : 0);
            if (repeat)
                await tx
                    .delete(videoSignals)
                    .where(eq(videoSignals.bookingId, id));
            const values = {
                generation,
                customerJoinedAt:
                    user.role === "admin"
                        ? repeat
                            ? null
                            : current?.customerJoinedAt
                        : new Date(),
                adminJoinedAt:
                    user.role === "admin"
                        ? new Date()
                        : repeat
                          ? null
                          : current?.adminJoinedAt,
                updatedAt: new Date(),
            };
            const [next] = await tx
                .insert(videoRooms)
                .values({ bookingId: id, ...values })
                .onConflictDoUpdate({
                    target: videoRooms.bookingId,
                    set: values,
                })
                .returning();
            return next;
        });
    assert(room, "Der Raum wurde noch nicht geöffnet.", 409);
    const payload = Buffer.from(
        JSON.stringify({
            bookingId: id,
            userId: user.id,
            generation: room.generation,
            exp: Math.floor(Date.now() / 1000) + 15 * 60,
        }),
    ).toString("base64url");
    const signature = createHmac("sha256", key())
        .update(payload)
        .digest("base64url");
    let iceServers: RTCIceServer[] = [];
    if (process.env.VIDEO_TURN_HOST && process.env.VIDEO_TURN_SECRET) {
        const username = `${Math.floor(Date.now() / 1000) + 3600}:${user.id}`;
        const credential = createHmac("sha1", process.env.VIDEO_TURN_SECRET)
            .update(username)
            .digest("base64");
        iceServers = [
            {
                urls: process.env.VIDEO_TURN_HOST.split(","),
                username,
                credential,
            },
        ];
    }
    if (process.env.VERCEL || process.env.PLATFORM_ENV === "production")
        assert(
            process.env.VIDEO_DRIVER !== "local" &&
                process.env.VIDEO_PROVIDER_URL,
            "Produktive Videodienste sind nicht eingerichtet.",
            503,
        );
    return {
        token: payload + "." + signature,
        bookingId: id,
        generation: room.generation,
        initiator: user.role !== "admin",
        iceServers,
        expiresAt: Date.now() + 15 * 60_000,
        local: process.env.VIDEO_DRIVER === "local",
    };
}
export function verifyMeetingToken(
    token: string,
    userId: string,
): { bookingId: string; userId: string; generation: number; exp: number } {
    const [payload, signature] = token.split(".");
    assert(payload && signature, "Ungültiger Raumzugang.", 403);
    const expected = createHmac("sha256", key()).update(payload).digest();
    const received = Buffer.from(signature, "base64url");
    assert(
        received.length === expected.length &&
            timingSafeEqual(received, expected),
        "Ungültiger Raumzugang.",
        403,
    );
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    assert(
        data.userId === userId && data.exp > Date.now() / 1000,
        "Der Raumzugang ist abgelaufen.",
        403,
    );
    return data;
}
