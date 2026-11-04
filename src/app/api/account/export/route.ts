import { eq, inArray } from "drizzle-orm";
import { db } from "@/server/db";
import * as s from "@/server/schema";
import { requireUser, AppError, audit } from "@/server/security";
export async function GET() {
    try {
        const user = await requireUser();
        const database = db();
        const projectRows = await database
            .select()
            .from(s.projects)
            .where(eq(s.projects.userId, user.id));
        const ids = projectRows.map((p) => p.id);
        const profile = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            birthDate: user.birthDate,
            billingAddress: user.billingAddress,
            customerType: user.customerType,
            verifiedAt: user.verifiedAt,
            createdAt: user.createdAt,
        };
        const data = {
            profile,
            onboarding: await database
                .select()
                .from(s.onboarding)
                .where(eq(s.onboarding.userId, user.id)),
            bookings: await database
                .select()
                .from(s.bookings)
                .where(eq(s.bookings.userId, user.id)),
            orders: await database
                .select()
                .from(s.orders)
                .where(eq(s.orders.userId, user.id)),
            packages: await database
                .select()
                .from(s.packages)
                .where(eq(s.packages.userId, user.id)),
            projects: projectRows,
            tasks: ids.length
                ? await database
                      .select()
                      .from(s.tasks)
                      .where(inArray(s.tasks.projectId, ids))
                : [],
            time: await database
                .select()
                .from(s.timeEntries)
                .where(eq(s.timeEntries.userId, user.id)),
            messages: await database
                .select()
                .from(s.messages)
                .where(eq(s.messages.userId, user.id)),
            files: (
                await database
                    .select()
                    .from(s.files)
                    .where(eq(s.files.userId, user.id))
            ).map((file) => ({
                id: file.id,
                name: file.name,
                mime: file.mime,
                size: file.size,
                sha256: file.sha256,
                projectId: file.projectId,
                createdAt: file.createdAt,
            })),
            documents: await database
                .select()
                .from(s.documents)
                .where(eq(s.documents.userId, user.id)),
            privacyRequests: await database
                .select()
                .from(s.privacyRequests)
                .where(eq(s.privacyRequests.userId, user.id)),
        };
        await audit(user.id, "data.exported", "user", user.id);
        return new Response(JSON.stringify(data, null, 2), {
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Content-Disposition":
                    'attachment; filename="meine-daten.json"',
                "Cache-Control": "private, no-store",
            },
        });
    } catch (e) {
        return Response.json(
            {
                error:
                    e instanceof AppError
                        ? e.message
                        : "Export fehlgeschlagen.",
            },
            { status: e instanceof AppError ? e.status : 500 },
        );
    }
}
