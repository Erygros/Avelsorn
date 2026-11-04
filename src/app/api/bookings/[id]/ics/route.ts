import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { bookings } from "@/server/schema";
import { requireUser, owns, AppError } from "@/server/security";
import { ics } from "@/server/calendar";
export async function GET(
    _: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const user = await requireUser();
        if (user.role === "admin") await requireUser(true);
        const [booking] = await db()
            .select()
            .from(bookings)
            .where(eq(bookings.id, (await params).id));
        owns(user, booking);
        return new Response(ics(booking), {
            headers: {
                "Content-Type": "text/calendar; charset=utf-8",
                "Content-Disposition": 'attachment; filename="termin.ics"',
                "Cache-Control": "private, no-store",
            },
        });
    } catch (e) {
        return Response.json(
            { error: e instanceof AppError ? e.message : "Nicht verfügbar." },
            { status: e instanceof AppError ? e.status : 500 },
        );
    }
}
