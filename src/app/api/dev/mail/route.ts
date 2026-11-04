import { z } from "zod";
import { desc } from "drizzle-orm";
import { db } from "@/server/db";
import { outbox } from "@/server/schema";
import {
    checkOrigin,
    assert,
    digest,
    decrypt,
    limit,
    AppError,
} from "@/server/security";
export async function POST(request: Request) {
    try {
        assert(
            process.env.PLATFORM_ENV !== "production" && !process.env.VERCEL,
            "Nicht verfügbar.",
            404,
        );
        checkOrigin(request);
        await limit("dev-mailbox", 20, 900);
        const { key } = z
            .object({ key: z.string().max(200) })
            .parse(await request.json());
        assert(
            process.env.SETUP_KEY &&
                digest(key) === digest(process.env.SETUP_KEY),
            "Ungültiger Einrichtungsschlüssel.",
            403,
        );
        const rows = await db()
            .select()
            .from(outbox)
            .orderBy(desc(outbox.createdAt))
            .limit(100);
        return Response.json(
            rows.map((m) => ({
                id: m.id,
                to: m.to,
                subject: m.subject,
                body: decrypt(m.encryptedBody),
                url: m.ctaUrl?.startsWith("enc:")
                    ? decrypt(m.ctaUrl.slice(4))
                    : m.ctaUrl,
                status: m.status,
            })),
            { headers: { "Cache-Control": "no-store" } },
        );
    } catch (e) {
        return Response.json(
            {
                error:
                    e instanceof AppError
                        ? e.message
                        : "Nachrichten konnten nicht gelesen werden.",
            },
            { status: e instanceof AppError ? e.status : 500 },
        );
    }
}
