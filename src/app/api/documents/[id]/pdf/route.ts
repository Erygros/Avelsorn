import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { documents } from "@/server/schema";
import { requireUser, owns, AppError, assert } from "@/server/security";
import { documentPdf } from "@/server/pdf";
export async function GET(
    _: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const user = await requireUser();
        if (user.role === "admin") await requireUser(true);
        const [doc] = await db()
            .select()
            .from(documents)
            .where(eq(documents.id, (await params).id));
        owns(user, doc);
        assert(
            user.role === "admin" ||
                doc.kind !== "offer" ||
                doc.status !== "draft",
            "Nicht verfügbar.",
            404,
        );
        const bytes = await documentPdf(doc);
        return new Response(new Uint8Array(bytes), {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${doc.number ?? "Entwurf"}.pdf"`,
                "Cache-Control": "private, no-store",
            },
        });
    } catch (e) {
        return Response.json(
            {
                error:
                    e instanceof AppError
                        ? e.message
                        : "Dokument konnte nicht erstellt werden.",
            },
            { status: e instanceof AppError ? e.status : 500 },
        );
    }
}
