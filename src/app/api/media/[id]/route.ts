import { and, eq, lte } from "drizzle-orm";
import { db } from "@/server/db";
import { media, files } from "@/server/schema";
import { storage } from "@/server/storage";
export async function GET(
    _: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const [item] = await db()
        .select({ media, files })
        .from(media)
        .innerJoin(files, eq(files.id, media.fileId))
        .where(
            and(
                eq(media.id, (await params).id),
                lte(media.publishedAt, new Date()),
                eq(files.category, "public_media"),
            ),
        );
    if (!item || item.files.deletedAt || !item.files.mime.startsWith("image/"))
        return new Response(null, { status: 404 });
    const bytes = await storage().get(item.files.key);
    return new Response(new Uint8Array(bytes), {
        headers: {
            "Content-Type": item.files.mime,
            "Content-Disposition": "inline",
            "X-Content-Type-Options": "nosniff",
            "Cache-Control": "public, max-age=3600",
        },
    });
}
