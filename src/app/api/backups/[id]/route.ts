import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { backups } from "@/server/schema";
import { storage } from "@/server/storage";
import { requireUser, assert, AppError, audit } from "@/server/security";
export async function GET(
    _: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const user = await requireUser(true);
        const [backup] = await db()
            .select()
            .from(backups)
            .where(eq(backups.id, (await params).id));
        assert(
            backup?.key && backup.status === "completed",
            "Backup nicht verfügbar.",
            404,
        );
        const bytes = await storage().get(backup.key);
        await audit(user.id, "backup.downloaded", "backup", backup.id);
        return new Response(new Uint8Array(bytes), {
            headers: {
                "Content-Type": "application/octet-stream",
                "Content-Disposition": `attachment; filename="sicherung-${backup.id}.backup"`,
                "Cache-Control": "private, no-store",
            },
        });
    } catch (e) {
        return Response.json(
            {
                error:
                    e instanceof AppError
                        ? e.message
                        : "Backup nicht verfügbar.",
            },
            { status: e instanceof AppError ? e.status : 500 },
        );
    }
}
