import { z } from "zod";
import { findServicePackage } from "../content/service-packages";
import { assert, audit } from "./security";
import { db } from "./db";
import { contacts } from "./schema";
import { notifyAdmin, queueMail } from "./events";
import { money } from "./config";

export const packageInquirySchema = z.object({
    packageKey: z.string().min(1).max(80),
    name: z.string().trim().min(2).max(100),
    email: z.email(),
    body: z.string().trim().min(20).max(5000),
    consent: z.literal(true),
    website: z.string().max(0).optional(),
});
export async function requestServicePackage(
    input: z.infer<typeof packageInquirySchema>,
) {
    const data = packageInquirySchema.parse(input);
    const selected = findServicePackage(data.packageKey);
    assert(selected, "Bitte wähle ein vorhandenes Paket.");
    return db().transaction(async (tx) => {
        const [row] = await tx
            .insert(contacts)
            .values({
                name: data.name,
                email: data.email,
                subject: `Paket-Anfrage: ${selected.name}`,
                body: `Paket: ${selected.key}\nEinstiegspreis: ab ${money(selected.fromCents)} einmalig\nUnverbindliche Anfrage – keine Bestellung.\n\n${data.body}`,
            })
            .returning();
        await audit(
            null,
            "package.inquired",
            "contact",
            row.id,
            { packageKey: selected.key, fromCents: selected.fromCents },
            tx,
        );
        await notifyAdmin(
            "contact",
            "Neue Paket-Anfrage",
            `${data.name}: ${selected.name}`,
            "package-inquiry:" + row.id,
            "/admin/kontakt",
            tx,
        );
        await queueMail(
            data.email,
            "Deine Paket-Anfrage bei Avelsorn",
            `Deine Anfrage zum Paket „${selected.name}“ wurde gespeichert. Einstiegspreis: ab ${money(selected.fromCents)} einmalig. Diese Anfrage ist noch keine Bestellung. Vor einer Beauftragung erhältst Du den konkreten Leistungsumfang und Gesamtpreis.`,
            "package-inquiry-receipt:" + row.id,
            {},
            tx,
        );
        return {
            inquiryId: row.id,
            message:
                "Deine Anfrage ist gespeichert. Sie ist noch keine Bestellung. Nach Klärung des Umfangs erhältst Du ein Angebot mit dem verbindlichen Gesamtpreis.",
        };
    });
}
export function assertCurrentBooking(input: {
    product: string;
    packageId?: string;
    serviceOrderId?: string;
}) {
    assert(
        input.product === "intro" ||
            (input.product === "consultation" && !!input.packageId) ||
            (input.product === "project" && !!input.serviceOrderId),
        "Neue kostenpflichtige Leistungen werden als Paket mit einem konkreten Angebot vereinbart. Stunden- und Laufzeitpakete können nicht mehr neu bestellt werden.",
        410,
    );
}
export function catalogSelection(key?: string) {
    if (!key) return undefined;
    const selected = findServicePackage(key);
    assert(selected, "Unbekanntes Leistungspaket.");
    return { ...selected, includes: [...selected.includes] };
}
export function catalogFromSnapshot(snapshot: unknown) {
    return (
        snapshot as {
            catalogPackage?: ReturnType<typeof catalogSelection>;
        } | null
    )?.catalogPackage;
}
export function assertCatalogAmount(snapshot: unknown, amount: number) {
    const selected = catalogFromSnapshot(snapshot);
    if (selected)
        assert(
            amount >= selected.fromCents,
            `Der Gesamtpreis für dieses Paket muss mindestens ${money(selected.fromCents)} betragen.`,
        );
}
