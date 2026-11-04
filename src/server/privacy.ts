import { and, eq, inArray } from "drizzle-orm";
import { db } from "./db";
import * as s from "./schema";
import { assert, audit, passwordHash, secretToken } from "./security";
import { storage } from "./storage";
import { notify } from "./events";

export async function resolvePrivacy(
    admin: s.User,
    id: string,
    resolution: string,
    performDeletion: boolean,
) {
    assert(admin.role === "admin", "Administratorzugang erforderlich.", 403);
    assert(
        resolution.trim().length >= 20,
        "Dokumentiere die Prüfung und das Ergebnis nachvollziehbar.",
    );
    const [request] = await db()
        .select()
        .from(s.privacyRequests)
        .where(eq(s.privacyRequests.id, id));
    assert(
        request && request.status !== "completed",
        "Diese Anfrage wurde bereits bearbeitet.",
        409,
    );
    if (request.type !== "deletion" || !performDeletion) {
        assert(
            request.type !== "deletion",
            "Bei einer Löschanfrage muss die tatsächliche Löschung ausdrücklich bestätigt werden. Ausnahmen sind in der Bearbeitungsnotiz zu begründen.",
        );
        await db()
            .update(s.privacyRequests)
            .set({ status: "completed", resolution, completedAt: new Date() })
            .where(eq(s.privacyRequests.id, id));
        await notify(
            request.userId,
            "privacy",
            "Deine Datenschutzanfrage wurde bearbeitet",
            resolution,
            "privacy-completed:" + id,
            "/konto/datenschutz",
        );
        await audit(admin.id, "privacy.resolved", "privacy_request", id);
        return { ok: true };
    }
    const [target] = await db()
        .select()
        .from(s.users)
        .where(eq(s.users.id, request.userId));
    assert(
        target?.role === "customer",
        "Administratorkonten werden nicht über diesen Ablauf gelöscht.",
    );
    // Statutory invoices, orders, payment evidence and accounting files remain isolated for retention.
    const removable = await db()
        .select()
        .from(s.files)
        .where(
            and(eq(s.files.userId, target.id), eq(s.files.category, "project")),
        );
    for (const file of removable)
        if (!file.deletedAt) await storage().remove(file.key);
    await db().transaction(async (tx) => {
        await tx.delete(s.sessions).where(eq(s.sessions.userId, target.id));
        await tx.delete(s.tokens).where(eq(s.tokens.userId, target.id));
        await tx.delete(s.onboarding).where(eq(s.onboarding.userId, target.id));
        await tx
            .delete(s.guardianConsents)
            .where(eq(s.guardianConsents.userId, target.id));
        await tx
            .update(s.files)
            .set({ name: "Gelöschte Projektdatei", deletedAt: new Date() })
            .where(
                and(
                    eq(s.files.userId, target.id),
                    eq(s.files.category, "project"),
                ),
            );
        await tx
            .update(s.messages)
            .set({
                body: "Inhalt nach geprüfter Datenschutzanfrage gelöscht.",
                fileId: null,
            })
            .where(eq(s.messages.userId, target.id));
        const projects = await tx
            .select({ id: s.projects.id })
            .from(s.projects)
            .where(eq(s.projects.userId, target.id));
        const ids = projects.map((p) => p.id);
        if (ids.length) {
            await tx
                .update(s.projects)
                .set({
                    name: "Archiviertes Kundenprojekt",
                    description: "Inhalt nach Datenschutzprüfung entfernt.",
                    status: "archived",
                })
                .where(inArray(s.projects.id, ids));
            await tx
                .update(s.tasks)
                .set({ title: "Archivierte Aufgabe", description: null })
                .where(inArray(s.tasks.projectId, ids));
            await tx
                .update(s.projectComments)
                .set({ body: "Inhalt nach Datenschutzprüfung entfernt." })
                .where(inArray(s.projectComments.projectId, ids));
        }
        await tx
            .delete(s.notifications)
            .where(eq(s.notifications.userId, target.id));
        await tx
            .update(s.consents)
            .set({ userId: null })
            .where(eq(s.consents.userId, target.id));
        await tx
            .update(s.users)
            .set({
                name: "Gelöschtes Kundenkonto",
                email: target.id + "@deleted.invalid",
                passwordHash: await passwordHash(secretToken()),
                phone: null,
                birthDate: "1900-01-01",
                billingAddress: null,
                disabledAt: new Date(),
                updatedAt: new Date(),
            })
            .where(eq(s.users.id, target.id));
        await tx
            .update(s.privacyRequests)
            .set({
                status: "completed",
                resolution:
                    resolution +
                    " Aufbewahrungspflichtige Rechnungen, Bestellungen und Zahlungsnachweise wurden getrennt erhalten; übrige freigegebene Kontodaten gelöscht beziehungsweise pseudonymisiert.",
                completedAt: new Date(),
            })
            .where(eq(s.privacyRequests.id, id));
        await audit(
            admin.id,
            "privacy.deletion_executed",
            "privacy_request",
            id,
            {
                retained: [
                    "financial_documents",
                    "orders",
                    "payments",
                    "accounting_files",
                ],
            },
            tx,
        );
    });
    return {
        message:
            "Die freigegebenen Kontodaten wurden gelöscht beziehungsweise pseudonymisiert. Gesetzlich aufzubewahrende Unterlagen bleiben getrennt erhalten.",
    };
}
