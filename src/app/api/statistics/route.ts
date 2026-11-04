import { cookies } from "next/headers";
import { eq, desc, sql } from "drizzle-orm";
import { db } from "@/server/db";
import { consents, statistics } from "@/server/schema";
import { checkOrigin } from "@/server/security";
export async function POST(request: Request) {
    try {
        checkOrigin(request);
        const jar = await cookies();
        const visitor = jar.get("platform_visitor")?.value;
        if (!visitor || jar.get("platform_consent")?.value !== "statistics")
            return new Response(null, { status: 204 });
        const [choice] = await db()
            .select()
            .from(consents)
            .where(eq(consents.visitorId, visitor))
            .orderBy(desc(consents.createdAt))
            .limit(1);
        if (!choice?.statistics) return new Response(null, { status: 204 });
        const body = await request.json();
        const path = body.path;
        if (
            typeof path !== "string" ||
            path.length > 200 ||
            !/^\/[a-z0-9/-]*$/.test(path) ||
            /^\/(konto|admin|api|entwicklung|anmelden|registrieren|passwort|email|otp|zustimmung|vertragszustimmung|einrichtung)/.test(
                path,
            )
        )
            return new Response(null, { status: 204 });
        const day = new Intl.DateTimeFormat("en-CA", {
            timeZone: "Europe/Berlin",
        }).format(new Date());
        await db()
            .insert(statistics)
            .values({ day, path })
            .onConflictDoUpdate({
                target: [statistics.day, statistics.path],
                set: { views: sql`${statistics.views}+1` },
            });
        return new Response(null, { status: 204 });
    } catch {
        return new Response(null, { status: 204 });
    }
}
