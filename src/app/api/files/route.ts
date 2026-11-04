import { requireUser, assert, AppError } from "@/server/security";
import { upload } from "@/server/files";
export async function POST(request: Request) {
    try {
        assert(
            request.headers.get("origin") ===
                new URL(process.env.PUBLIC_BASE_URL ?? request.url).origin,
            "Ungültige Anfragequelle.",
            403,
        );
        const user = await requireUser();
        if (user.role === "admin") await requireUser(true);
        assert(
            Number(request.headers.get("content-length") ?? 0) <=
                4.5 * 1024 * 1024,
            "Die Datei ist zu groß.",
            413,
        );
        const data = await request.formData();
        const file = data.get("file");
        assert(file instanceof File, "Bitte wähle eine Datei.");
        const record = await upload(
            user,
            file,
            String(data.get("projectId") ?? "") || undefined,
            String(data.get("userId") ?? "") || undefined,
            String(data.get("category") ?? "project"),
        );
        return Response.json({ id: record.id });
    } catch (error) {
        return Response.json(
            {
                error:
                    error instanceof AppError
                        ? error.message
                        : "Upload fehlgeschlagen.",
            },
            { status: error instanceof AppError ? error.status : 500 },
        );
    }
}
