import { NextResponse } from "next/server";
import { slots } from "@/server/calendar";
import { AppError, requireUser } from "@/server/security";
export async function GET(request: Request) {
    try {
        await requireUser();
        const url = new URL(request.url);
        return NextResponse.json(
            await slots(
                url.searchParams.get("day") ?? "",
                Number(url.searchParams.get("minutes")),
            ),
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
