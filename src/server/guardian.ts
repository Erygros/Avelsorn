import { and, eq, isNull, gt } from "drizzle-orm";
import { db, type Db } from "./db";
import { guardianConsents, tokens, documents, type User } from "./schema";
import {
    assert,
    audit,
    digest,
    isMinor,
    lock,
    secretToken,
    owns,
} from "./security";
import { queueMail, notifyAdmin } from "./events";
import { price, products, baseUrl, type ProductKey, money } from "./config";

export function contractScope(product: ProductKey, minutes?: number): string {
    return `contract:${product}:${minutes ?? 0}:${price(product, minutes)}`;
}
export async function requestContractApproval(
    user: User,
    product: ProductKey,
    minutes?: number,
) {
    assert(
        isMinor(user),
        "Dieser Ablauf ist für erforderliche Minderjährigenvertretung vorgesehen.",
    );
    assert(
        user.guardianApprovedAt,
        "Die grundlegende Vertretungsberechtigung muss zuerst geprüft werden.",
    );
    if (product === "consultation" || product === "upgrade")
        assert(
            (products[product].durations as readonly number[]).includes(
                minutes ?? 0,
            ),
            "Ungültige Beratungsdauer.",
        );
    assert(product !== "intro", "Das Erstgespräch ist kostenlos.");
    return db().transaction(async (tx) => {
        await lock("identity", tx);
        const [base] = await tx
            .select()
            .from(guardianConsents)
            .where(
                and(
                    eq(guardianConsents.userId, user.id),
                    eq(guardianConsents.status, "approved"),
                    eq(guardianConsents.scope, "registration"),
                ),
            );
        assert(
            base,
            "Eine geprüfte erziehungsberechtigte Person ist erforderlich.",
        );
        const scope = contractScope(product, minutes);
        const token = secretToken();
        const [consent] = await tx
            .insert(guardianConsents)
            .values({
                userId: user.id,
                email: base.email,
                name: base.name,
                scope,
                status: "contract_pending",
            })
            .returning();
        await tx
            .insert(tokens)
            .values({
                userId: user.id,
                purpose: "guardian_contract:" + consent.id,
                hash: digest(token),
                expiresAt: new Date(Date.now() + 7 * 86400_000),
            });
        await queueMail(
            base.email,
            "Bitte prüfe diese konkrete Bestellung",
            `Für ${user.name} ist folgende konkrete Bestellung vorgesehen: ${products[product].name}${minutes ? " · " + minutes + " Minuten" : ""}, Gesamtpreis ${money(price(product, minutes))}. ${products[product].description} Keine automatische Verlängerung. Mit der Erklärung vertrittst Du die minderjährige Person für genau eine solche Bestellung. Bitte prüfe Leistung, Preis und Bedingungen, bevor Du zustimmst.`,
            "guardian-contract:" + consent.id,
            {
                userId: user.id,
                url: baseUrl() + "/vertragszustimmung?token=" + token,
            },
            tx,
        );
        await audit(
            user.id,
            "guardian.contract_requested",
            "guardian_consent",
            consent.id,
            { scope },
            tx,
        );
        return {
            message:
                "Die konkrete Bestellanfrage wurde Deiner erziehungsberechtigten Person zur Prüfung bereitgestellt. Nach Bestätigung und administrativer Prüfung kann genau eine passende Bestellung ausgeführt werden.",
        };
    });
}
export async function confirmContractApproval(
    token: string,
    declaration: boolean,
) {
    assert(
        declaration,
        "Eine ausdrückliche Vertretungserklärung ist erforderlich.",
    );
    return db().transaction(async (tx) => {
        const [access] = await tx
            .select()
            .from(tokens)
            .where(
                and(
                    eq(tokens.hash, digest(token)),
                    isNull(tokens.usedAt),
                    gt(tokens.expiresAt, new Date()),
                ),
            )
            .for("update");
        assert(
            access?.purpose.startsWith("guardian_contract:"),
            "Der Link ist ungültig oder abgelaufen.",
        );
        const id = access.purpose.slice("guardian_contract:".length);
        const [consent] = await tx
            .select()
            .from(guardianConsents)
            .where(eq(guardianConsents.id, id));
        assert(
            consent?.status === "contract_pending",
            "Diese Erklärung wurde bereits bearbeitet.",
        );
        await tx
            .update(tokens)
            .set({ usedAt: new Date() })
            .where(eq(tokens.id, access.id));
        await tx
            .update(guardianConsents)
            .set({ status: "contract_review", confirmedAt: new Date() })
            .where(eq(guardianConsents.id, id));
        await notifyAdmin(
            "guardian",
            "Vertragsvertretung zur Prüfung",
            "Eine konkrete kostenpflichtige Bestellung wurde durch eine erziehungsberechtigte Person bestätigt. Bitte prüfe den Vorgang.",
            "guardian-contract:" + id,
            "/admin/kunden",
            tx,
        );
        return {
            message:
                "Deine ausdrückliche Erklärung wurde dokumentiert. Nach administrativer Prüfung steht genau eine passende Bestellung zur Verfügung.",
        };
    });
}
export async function consumeContractApproval(
    user: User,
    product: ProductKey,
    minutes: number | undefined,
    database: Db,
) {
    return consumeApprovalScope(
        user,
        contractScope(product, minutes),
        database,
    );
}
export async function consumeApprovalScope(
    user: User,
    scope: string,
    database: Db,
) {
    if (!isMinor(user)) return;
    const [consent] = await database
        .select()
        .from(guardianConsents)
        .where(
            and(
                eq(guardianConsents.userId, user.id),
                eq(guardianConsents.scope, scope),
                eq(guardianConsents.status, "contract_approved"),
                gt(
                    guardianConsents.reviewedAt,
                    new Date(Date.now() - 7 * 86400_000),
                ),
            ),
        )
        .for("update");
    assert(
        consent,
        "Für diese konkrete Bestellung fehlt eine bestätigte und geprüfte Vertretungserklärung. Fordere sie zuerst in Deinem Profil an.",
        422,
    );
    await database
        .update(guardianConsents)
        .set({ status: "contract_consumed" })
        .where(eq(guardianConsents.id, consent.id));
    await audit(
        user.id,
        "guardian.contract_consumed",
        "guardian_consent",
        consent.id,
        undefined,
        database,
    );
}
export async function requestOfferApproval(user: User, id: string) {
    assert(
        isMinor(user) && user.guardianApprovedAt,
        "Eine geprüfte erziehungsberechtigte Person ist erforderlich.",
    );
    return db().transaction(async (tx) => {
        await lock("identity", tx);
        const [offer] = await tx
            .select()
            .from(documents)
            .where(eq(documents.id, id));
        owns(user, offer);
        assert(
            offer.kind === "offer" &&
                offer.status === "sent" &&
                offer.validUntil! > new Date(),
            "Das Angebot ist nicht mehr gültig.",
        );
        const [base] = await tx
            .select()
            .from(guardianConsents)
            .where(
                and(
                    eq(guardianConsents.userId, user.id),
                    eq(guardianConsents.scope, "registration"),
                    eq(guardianConsents.status, "approved"),
                ),
            );
        assert(base, "Geprüfte Vertretungsberechtigung erforderlich.");
        const token = secretToken();
        const [consent] = await tx
            .insert(guardianConsents)
            .values({
                userId: user.id,
                name: base.name,
                email: base.email,
                scope: `offer:${id}:${offer.amountCents}`,
                status: "contract_pending",
            })
            .returning();
        await tx
            .insert(tokens)
            .values({
                userId: user.id,
                purpose: "guardian_contract:" + consent.id,
                hash: digest(token),
                expiresAt: new Date(
                    Math.min(
                        Date.now() + 7 * 86400_000,
                        offer.validUntil!.getTime(),
                    ),
                ),
            });
        await queueMail(
            base.email,
            "Ein konkretes Angebot zur Prüfung",
            `${user.name} möchte das Angebot ${offer.number} über ${money(offer.amountCents)} annehmen. Leistungsbeschreibung: ${offer.description}. Die Vertretung gilt nur für dieses Angebot und genau eine Annahme.`,
            "guardian-contract:" + consent.id,
            {
                userId: user.id,
                url: baseUrl() + "/vertragszustimmung?token=" + token,
            },
            tx,
        );
        return {
            message:
                "Die konkrete Angebotsannahme wurde zur Zustimmung und Prüfung bereitgestellt.",
        };
    });
}
