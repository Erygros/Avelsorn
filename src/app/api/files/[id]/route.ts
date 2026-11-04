import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { files } from "@/server/schema";
import { storage } from "@/server/storage";
import { requireUser, owns, AppError, assert } from "@/server/security";
export async function GET(
    _: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const user = await requireUser();
        if (user.role === "admin") await requireUser(true);
        const [file] = await db()
            .select()
            .from(files)
            .where(eq(files.id, (await params).id));
        owns(user, file);
        assert(!file.deletedAt, "Die Datei ist nicht mehr verfügbar.", 404);
        const data = await storage().get(file.key);
        return new Response(new Uint8Array(data), {
            headers: {
                "Content-Type": file.mime,
                "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(file.name)}`,
                "Cache-Control": "private, no-store",
                "X-Content-Type-Options": "nosniff",
            },
        });
    } catch (e) {
        return Response.json(
            {
                error:
                    e instanceof AppError
                        ? e.message
                        : "Datei nicht verfügbar.",
            },
            { status: e instanceof AppError ? e.status : 500 },
        );
    }
}
