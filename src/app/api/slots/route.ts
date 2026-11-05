import { NextResponse } from "next/server";
import { slots } from "@/server/calendar";
import { AppError, requireUser, limit } from "@/server/security";
export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const publicIntro = url.searchParams.get("public") === "1";
        if (publicIntro) {
            await limit(
                "public-slots:" +
                    (request.headers
                        .get("x-vercel-forwarded-for")
                        ?.split(",")[0] ?? "local"),
                180,
                60,
            );
        } else await requireUser();
        return NextResponse.json(
            await slots(
                url.searchParams.get("day") ?? "",
                publicIntro ? 15 : Number(url.searchParams.get("minutes")),
            ),
            { headers: { "Cache-Control": "no-store" } },
        );
    } catch (e) {
        return NextResponse.json(
            {
                error:
                    e instanceof AppError
                        ? e.message
                        : "Verfügbarkeiten konnten nicht geladen werden.",
            },
            { status: e instanceof AppError ? e.status : 500 },
        );
    }
}
