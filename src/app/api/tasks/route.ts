import { runTasks } from "@/server/tasks";
import { digest } from "@/server/security";
export const runtime = "nodejs";
export async function POST(request: Request) {
    const expected = process.env.TASKS_SECRET;
    const token = request.headers.get("authorization")?.replace(/^Bearer /, "");
    if (!expected || !token || digest(expected) !== digest(token))
        return Response.json({ error: "Nicht autorisiert." }, { status: 401 });
    return Response.json(await runTasks());
}
