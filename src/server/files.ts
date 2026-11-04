import { randomUUID } from "node:crypto";
import { fileTypeFromBuffer } from "file-type";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { files, projects, type User } from "./schema";
import { storage } from "./storage";
import { assert, owns, digest, audit } from "./security";
import { notify, notifyAdmin } from "./events";

const extensions: Record<string, string[]> = {
    "application/pdf": ["pdf"],
    "image/jpeg": ["jpg", "jpeg"],
    "image/png": ["png"],
    "image/webp": ["webp"],
    "image/gif": ["gif"],
    "application/zip": ["zip"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
        "docx",
    ],
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        "xlsx",
    ],
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        ["pptx"],
    "text/plain": ["txt", "md", "csv"],
};
export async function upload(
    user: User,
    file: File,
    projectId?: string,
    customerId?: string,
    category = "project",
) {
    assert(
        file.size > 0 && file.size <= 4 * 1024 * 1024,
        "Dateien dürfen höchstens 4 MB groß sein.",
    );
    const name = file.name.replace(/[\r\n\x00-\x1f/\\]/g, "_").slice(0, 180);
    const extension = name.split(".").pop()?.toLowerCase();
    assert(extension, "Die Datei benötigt eine Endung.");
    const bytes = Buffer.from(await file.arrayBuffer());
    const detected = await fileTypeFromBuffer(bytes);
    let mime = detected?.mime;
    if (!mime && ["txt", "md", "csv"].includes(extension)) {
        assert(!bytes.includes(0), "Die Datei ist kein gültiges Textdokument.");
        try {
            new TextDecoder("utf-8", { fatal: true }).decode(bytes);
        } catch {
            assert(false, "Textdokumente müssen UTF-8 verwenden.");
        }
        mime = "text/plain";
    }
    assert(
        mime && extensions[mime]?.includes(extension),
        "Dateiendung und tatsächlicher Dateityp passen nicht zu einem freigegebenen Format.",
    );
    const userId = user.role === "admin" ? customerId : user.id;
    assert(userId, "Eine Kundenzuordnung ist erforderlich.");
    if (projectId) {
        const [project] = await db()
            .select()
            .from(projects)
            .where(eq(projects.id, projectId));
        owns(user, project);
        assert(
            project.userId === userId,
            "Projekt und Kunde passen nicht zusammen.",
        );
    }
    const key = `uploads/${randomUUID()}.${extension}`;
    assert(
        ["project", "accounting", "public_media"].includes(category),
        "Ungültige Dateikategorie.",
    );
    if (category !== "project")
        assert(
            user.role === "admin",
            "Diese Dateikategorie ist der Administration vorbehalten.",
            403,
        );
    if (category === "public_media")
        assert(
            mime.startsWith("image/"),
            "Öffentliche Medien müssen freigegebene Bilddateien sein.",
        );
    await storage().put(key, bytes, mime);
    try {
        const [record] = await db()
            .insert(files)
            .values({
                userId,
                uploadedBy: user.id,
                projectId,
                name,
                key,
                mime,
                size: bytes.length,
                sha256: digest(bytes),
                category,
            })
            .returning();
        await audit(user.id, "file.uploaded", "file", record.id);
        if (user.role === "admin")
            await notify(
                userId,
                "file",
                "Neue Datei verfügbar",
                name,
                "file:" + record.id,
                "/konto/dateien",
            );
        else
            await notifyAdmin(
                "file",
                "Neue Kundendatei",
                name,
                "file:" + record.id,
                "/admin/dateien",
            );
        return record;
    } catch (error) {
        await storage().remove(key);
        throw error;
    }
}
