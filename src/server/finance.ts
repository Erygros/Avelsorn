import { and, eq, sql, inArray, or, gt } from "drizzle-orm";
import { db, type Db } from "./db";
import {
    orders,
    payments,
    packages,
    bookings,
    documents,
    sequences,
    users,
    projects,
    type User,
    type DocumentItem,
} from "./schema";
import { assert, audit, lock, owns, readyCustomer } from "./security";
import { products, price } from "./config";
import { notify, notifyAdmin } from "./events";
import { randomUUID } from "node:crypto";
import { business, invoiceIssuerMissing } from "./settings";
import {
    catalogSelection,
    catalogFromSnapshot,
    assertCatalogAmount,
} from "./package-catalog";
import { consumeContractApproval, consumeApprovalScope } from "./guardian";

export async function purchasePackage(
    user: User,
    product: "package12" | "unlimited",
    terms: boolean,
    earlyStart: boolean,
) {
    readyCustomer(user, true);
    assert(
        terms && earlyStart,
        "Bitte bestätige die Vertragsbedingungen und den gewünschten Beginn nach Zahlungseingang.",
    );
    return db().transaction(async (tx) => {
        await lock("finance", tx);
        await consumeContractApproval(user, product, undefined, tx);
        const [order] = await tx
            .insert(orders)
            .values({
                userId: user.id,
                reference: "BE-" + randomUUID(),
                product,
                amountCents: price(product),
                contract: {
                    product,
                    amountCents: price(product),
                    durationDays: 28,
                    autoRenew: false,
                    termsVersion: "2026-10-26",
                    earlyStart,
                    billingAddress: user.billingAddress,
                },
                acceptedAt: new Date(),
            })
            .returning();
        await tx.insert(documents).values({
            userId: user.id,
            orderId: order.id,
            kind: "invoice",
            items: [
                {
                    description: products[product].name,
                    quantity: 1,
                    unitCents: price(product),
                },
            ],
            amountCents: price(product),
            description: products[product].description,
        });
        await notify(
            user.id,
            "order",
            "Deine Paketbestellung",
            `Deine Zahlungsreferenz lautet ${order.reference}. Die Laufzeit beginnt erst nach geprüftem Zahlungseingang.`,
            "order:" + order.id,
            "/konto/pakete",
            tx,
        );
        await notifyAdmin(
            "payment",
            "Neue Zahlung wartet auf Prüfung",
            `${user.name} hat ein Paket bestellt.`,
            "order:" + order.id,
            "/admin/zahlungen",
            tx,
        );
        await audit(
            user.id,
            "package.ordered",
            "order",
            order.id,
            undefined,
            tx,
        );
        return order;
    });
}
export async function nextNumber(prefix: "RE" | "AN" | "ST", database: Db) {
    const name = `${prefix}-${new Intl.DateTimeFormat("en", { timeZone: "Europe/Berlin", year: "numeric" }).format(new Date())}`;
    const [sequence] = await database
        .insert(sequences)
        .values({ name, value: 1 })
        .onConflictDoUpdate({
            target: sequences.name,
            set: { value: sql`${sequences.value}+1` },
        })
        .returning();
    return `${name}-${String(sequence.value).padStart(4, "0")}`;
}
export async function confirmPayment(
    admin: User,
    input: {
        orderId: string;
        amountCents: number;
        bankReference: string;
        receivedAt: string;
        idempotencyKey: string;
    },
) {
    assert(admin.role === "admin", "Administratorzugang erforderlich.", 403);
    assert(
        Number.isSafeInteger(input.amountCents) && input.amountCents > 0,
        "Der Zahlungsbetrag muss positiv sein.",
    );
    assert(
        input.bankReference.trim().length >= 2 &&
            input.idempotencyKey.length >= 16,
        "Bankreferenz und eindeutiger Vorgangsschlüssel erforderlich.",
    );
    const received = new Date(input.receivedAt);
    assert(
        Number.isFinite(received.getTime()) && received <= new Date(),
        "Ungültiges Zahlungseingangsdatum.",
    );
    return db().transaction(async (tx) => {
        await lock("finance", tx);
        await lock("calendar", tx);
        const [previous] = await tx
            .select()
            .from(payments)
            .where(eq(payments.idempotencyKey, input.idempotencyKey));
        if (previous) {
            assert(
                previous.orderId === input.orderId &&
                    previous.amountCents === input.amountCents,
                "Der Vorgangsschlüssel wurde bereits anders verwendet.",
                409,
            );
            return previous;
        }
        const [order] = await tx
            .select()
            .from(orders)
            .where(eq(orders.id, input.orderId));
        assert(
            order && !["paid", "cancelled", "refunded"].includes(order.status),
            "Diese Bestellung kann keine weitere Zahlung erhalten.",
            409,
        );
        assert(
            order.paidCents + input.amountCents <= order.amountCents,
            "Der Betrag überschreitet die offene Forderung.",
        );
        const [booking] = await tx
            .select()
            .from(bookings)
            .where(eq(bookings.orderId, order.id));
        if (booking)
            assert(
                booking.status === "reserved" &&
                    booking.reservedUntil! > new Date(),
                "Die Reservierung ist abgelaufen. Bitte kläre eine neue Buchung, bevor Du die Zahlung zuordnest.",
                409,
            );
        const [payment] = await tx
            .insert(payments)
            .values({ ...input, adminId: admin.id, receivedAt: received })
            .returning();
        const paid = order.paidCents + input.amountCents;
        const complete = paid === order.amountCents;
        await tx
            .update(orders)
            .set({
                paidCents: paid,
                status: complete ? "paid" : "partial",
                paidAt: complete ? received : null,
            })
            .where(eq(orders.id, order.id));
        if (complete) {
            if (booking)
                await tx
                    .update(bookings)
                    .set({
                        status: "confirmed",
                        reservedUntil: null,
                        updatedAt: new Date(),
                    })
                    .where(eq(bookings.id, booking.id));
            if (
                ["package12", "unlimited"].includes(order.product) &&
                !booking
            ) {
                const active = await tx
                    .select()
                    .from(packages)
                    .where(
                        and(
                            eq(packages.userId, order.userId),
                            eq(packages.status, "active"),
                        ),
                    );
                const start = new Date(
                    Math.max(
                        received.getTime(),
                        ...active.map((p) => p.expiresAt.getTime()),
                    ),
                );
                const expires = new Date(start.getTime() + 28 * 86400_000);
                await tx.insert(packages).values({
                    userId: order.userId,
                    orderId: order.id,
                    product: order.product,
                    startsAt: start,
                    expiresAt: expires,
                    allowanceSeconds:
                        order.product === "package12" ? 43200 : null,
                });
                await notify(
                    order.userId,
                    "package",
                    "Dein Paket ist aktiviert",
                    "Die Laufzeit und das verfügbare Kontingent findest Du in Deinem Konto. Bei einer Verlängerung schließt die neue Laufzeit an das bestehende Paket an.",
                    "package:" + order.id,
                    "/konto/pakete",
                    tx,
                );
            }
            const contract = order.contract as {
                catalogPackage?: ReturnType<typeof catalogSelection>;
                projectId?: string;
                description?: string;
            };
            if (contract.catalogPackage && !contract.projectId) {
                const [project] = await tx
                    .insert(projects)
                    .values({
                        userId: order.userId,
                        adminId: admin.id,
                        name: contract.catalogPackage.name,
                        category: contract.catalogPackage.key,
                        description:
                            contract.description ??
                            "Leistungsumfang gemäß angenommenem Angebot.",
                        status: "planned",
                    })
                    .returning();
                await tx
                    .update(orders)
                    .set({ contract: { ...contract, projectId: project.id } })
                    .where(eq(orders.id, order.id));
                await audit(
                    admin.id,
                    "package.project_created",
                    "project",
                    project.id,
                    { orderId: order.id },
                    tx,
                );
                await notify(
                    order.userId,
                    "project",
                    "Dein Paketprojekt ist angelegt",
                    "Der bestätigte Zahlungseingang ist erfasst. Dein vereinbarter Leistungsumfang steht im Projekt.",
                    "package-project:" + order.id,
                    "/konto/projekte?id=" + project.id,
                    tx,
                );
            }
            const invoice = await tx
                .select()
                .from(documents)
                .where(
                    and(
                        eq(documents.orderId, order.id),
                        eq(documents.kind, "invoice"),
                        inArray(documents.status, ["draft", "issued"]),
                    ),
                );
            const values = await business(tx);
            const [customer] = await tx
                .select()
                .from(users)
                .where(eq(users.id, order.userId));
            for (const doc of invoice) {
                const missing = invoiceIssuerMissing(values, doc.amountCents);
                if (
                    doc.status === "draft" &&
                    (missing.length || !customer.billingAddress)
                ) {
                    await notifyAdmin(
                        "invoice",
                        "Rechnungsangaben vervollständigen",
                        "Die Zahlung wurde erfasst. Die Rechnung bleibt ein Entwurf, bis die fehlenden Aussteller- oder Kundenangaben ergänzt sind: " +
                            [
                                ...missing,
                                ...(!customer.billingAddress
                                    ? ["Kundenanschrift"]
                                    : []),
                            ].join(", "),
                        "invoice-details:" + doc.id,
                        "/admin/rechnungen",
                        tx,
                    );
                    continue;
                }
                if (doc.status === "issued")
                    await tx
                        .update(documents)
                        .set({ status: "paid" })
                        .where(eq(documents.id, doc.id));
                else
                    await tx
                        .update(documents)
                        .set({
                            number: await nextNumber("RE", tx),
                            status: "paid",
                            issuedAt: new Date(),
                            finalizedAt: new Date(),
                            dueAt: new Date(Date.now() + 7 * 86400_000),
                            snapshot: {
                                catalogPackage: contract.catalogPackage,
                                documentStatus: "paid",
                                business: values,
                                customer: {
                                    name: customer.name,
                                    billingAddress: customer.billingAddress,
                                },
                                paidAt: received.toISOString(),
                                paymentReference: order.reference,
                                smallBusinessNotice:
                                    "Für diese Leistung gilt die Steuerbefreiung für Kleinunternehmer gemäß § 19 UStG.",
                            },
                        })
                        .where(eq(documents.id, doc.id));
            }
            await notify(
                order.userId,
                "payment",
                "Deine Zahlung ist bestätigt",
                "Der tatsächliche Bankeingang wurde geprüft. Deine Buchung beziehungsweise Dein Paket ist jetzt bestätigt.",
                "payment-complete:" + order.id,
                "/konto/rechnungen",
                tx,
            );
        }
        await audit(
            admin.id,
            "payment.recorded",
            "order",
            order.id,
            {
                amountCents: input.amountCents,
                bankReference: input.bankReference,
            },
            tx,
        );
        return payment;
    });
}
export function totalItems(items: DocumentItem[]) {
    assert(
        items.length > 0 && items.length <= 100,
        "Ein Dokument benötigt 1 bis 100 Positionen.",
    );
    const sum = items.reduce((total, item) => {
        assert(
            item.description.trim().length > 0 &&
                Number.isInteger(item.quantity) &&
                item.quantity > 0 &&
                Number.isSafeInteger(item.unitCents) &&
                item.unitCents >= 0,
            "Ungültige Position. Mengen müssen positive ganze Zahlen sein.",
        );
        return total + item.quantity * item.unitCents;
    }, 0);
    assert(
        Number.isSafeInteger(sum) && sum <= 100_000_000,
        "Der Gesamtbetrag ist zu hoch.",
    );
    return sum;
}
export async function createOffer(
    admin: User,
    input: {
        userId: string;
        items: DocumentItem[];
        description: string;
        catalogKey?: string;
    },
) {
    assert(admin.role === "admin", "Administratorzugang erforderlich.", 403);
    return db().transaction(async (tx) => {
        await lock("finance", tx);
        const { catalogKey, ...fields } = input;
        const snapshot = { catalogPackage: catalogSelection(catalogKey) };
        assertCatalogAmount(snapshot, totalItems(input.items));
        const [offer] = await tx
            .insert(documents)
            .values({
                ...fields,
                snapshot,
                kind: "offer",
                status: "draft",
                amountCents: totalItems(input.items),
            })
            .returning();
        await audit(
            admin.id,
            "offer.created",
            "document",
            offer.id,
            undefined,
            tx,
        );
        return offer;
    });
}
export async function sendOffer(admin: User, id: string) {
    assert(admin.role === "admin", "Administratorzugang erforderlich.", 403);
    return db().transaction(async (tx) => {
        await lock("finance", tx);
        const [doc] = await tx
            .select()
            .from(documents)
            .where(eq(documents.id, id));
        assert(
            doc?.kind === "offer" && doc.status === "draft",
            "Das Angebot kann nicht versendet werden.",
        );
        assertCatalogAmount(doc.snapshot, doc.amountCents);
        assert(
            !doc.description.includes("Vor Versand ergänzen:"),
            "Bitte vervollständige Leistungsumfang, Liefertermin und Zahlungsbedingungen vor dem Versand.",
        );
        const [customer] = await tx
            .select()
            .from(users)
            .where(eq(users.id, doc.userId));
        await tx
            .update(documents)
            .set({
                number: await nextNumber("AN", tx),
                status: "sent",
                issuedAt: new Date(),
                finalizedAt: new Date(),
                validUntil: new Date(Date.now() + 7 * 86400_000),
                snapshot: {
                    catalogPackage: catalogFromSnapshot(doc.snapshot),
                    preparedById: admin.id,
                    business: await business(tx),
                    customer: {
                        name: customer.name,
                        billingAddress: customer.billingAddress,
                    },
                },
                updatedAt: new Date(),
            })
            .where(eq(documents.id, id));
        await notify(
            doc.userId,
            "offer",
            "Ein Angebot für Dich",
            "Dein Angebot ist sieben Tage gültig. Du kannst es im Kundenportal prüfen, annehmen oder ablehnen.",
            "offer:" + id,
            "/konto/angebote",
            tx,
        );
        await audit(admin.id, "offer.sent", "document", id, undefined, tx);
        return { ok: true };
    });
}
export async function editDocument(
    admin: User,
    input: { id: string; items: DocumentItem[]; description: string },
) {
    assert(admin.role === "admin", "Administratorzugang erforderlich.", 403);
    return db().transaction(async (tx) => {
        await lock("finance", tx);
        const [doc] = await tx
            .select()
            .from(documents)
            .where(eq(documents.id, input.id));
        assert(
            doc?.status === "draft" && !doc.finalizedAt,
            "Finalisierte Dokumente dürfen nur durch einen Korrekturbeleg geändert werden.",
            409,
        );
        const amountCents = totalItems(input.items);
        assertCatalogAmount(doc.snapshot, amountCents);
        if (doc.orderId) {
            const [order] = await tx
                .select()
                .from(orders)
                .where(eq(orders.id, doc.orderId));
            assert(
                !order.cancelledAt && order.amountCents === amountCents,
                "Eine bereits angenommene Bestellung darf nicht über den Rechnungsentwurf verteuert oder verändert werden.",
            );
        }
        await tx
            .update(documents)
            .set({
                items: input.items,
                description: input.description,
                amountCents,
                updatedAt: new Date(),
            })
            .where(eq(documents.id, input.id));
        await audit(
            admin.id,
            "document.edited",
            "document",
            input.id,
            {
                before: { items: doc.items, description: doc.description },
                after: { items: input.items, description: input.description },
            },
            tx,
        );
        return { ok: true };
    });
}
export async function issueInvoice(admin: User, id: string) {
    assert(admin.role === "admin", "Administratorzugang erforderlich.", 403);
    return db().transaction(async (tx) => {
        await lock("finance", tx);
        const [doc] = await tx
            .select()
            .from(documents)
            .where(eq(documents.id, id));
        assert(
            doc?.kind === "invoice" && doc.status === "draft",
            "Diese Rechnung kann nicht finalisiert werden.",
            409,
        );
        const [customer] = await tx
            .select()
            .from(users)
            .where(eq(users.id, doc.userId));
        assert(
            customer.billingAddress,
            "Die Rechnungsanschrift des Kunden fehlt.",
        );
        const issuer = await business(tx);
        const missing = invoiceIssuerMissing(issuer, doc.amountCents);
        assert(
            !missing.length,
            "Die Rechnung bleibt ein Entwurf. Fehlende Angaben: " +
                missing.join(", "),
        );
        const [order] = doc.orderId
            ? await tx.select().from(orders).where(eq(orders.id, doc.orderId))
            : [];
        assert(
            !order?.cancelledAt,
            "Zu einer stornierten Bestellung kann keine Rechnung ausgestellt werden.",
            409,
        );
        const paid =
            doc.amountCents === 0 ||
            (!!order && order.paidCents === order.amountCents);
        await tx
            .update(documents)
            .set({
                number: await nextNumber("RE", tx),
                status: paid ? "paid" : "issued",
                issuedAt: new Date(),
                dueAt: new Date(Date.now() + 7 * 86400_000),
                finalizedAt: new Date(),
                snapshot: {
                    catalogPackage: catalogFromSnapshot(doc.snapshot),
                    business: issuer,
                    customer: {
                        name: customer.name,
                        billingAddress: customer.billingAddress,
                    },
                    paymentReference: order?.reference,
                    paidAt: order?.paidAt?.toISOString(),
                    noPaymentRequired: doc.amountCents === 0,
                },
            })
            .where(eq(documents.id, id));
        await audit(admin.id, "invoice.issued", "document", id, undefined, tx);
        return { ok: true };
    });
}
export type InvoiceCancellationMode = "correction" | "contract";

async function createStorno(
    database: Db,
    admin: User,
    doc: typeof documents.$inferSelect,
    reason: string,
) {
    const [correction] = await database
        .insert(documents)
        .values({
            userId: doc.userId,
            orderId: doc.orderId,
            parentId: doc.id,
            kind: "correction",
            number: await nextNumber("ST", database),
            status: "issued",
            items: doc.items.map((item) => ({
                ...item,
                unitCents: -item.unitCents,
            })),
            amountCents: -doc.amountCents,
            description: `Storno zu ${doc.number}: ${reason}`,
            snapshot: doc.snapshot,
            issuedAt: new Date(),
            finalizedAt: new Date(),
        })
        .returning();
    await database
        .update(documents)
        .set({ status: "cancelled", updatedAt: new Date() })
        .where(eq(documents.id, doc.id));
    await audit(
        admin.id,
        "invoice.cancelled",
        "document",
        doc.id,
        { reason, correctionId: correction.id },
        database,
    );
    return correction;
}

async function cancelContractState(
    database: Db,
    admin: User,
    orderId: string,
    reason: string,
) {
    const [order] = await database
        .select()
        .from(orders)
        .where(eq(orders.id, orderId))
        .for("update");
    assert(
        order && !order.cancelledAt,
        "Diese Bestellung wurde bereits storniert.",
        409,
    );
    const at = new Date();
    const contract = order.contract as { projectId?: string };
    if (contract.projectId) {
        await database
            .update(projects)
            .set({ status: "archived", updatedAt: at })
            .where(eq(projects.id, contract.projectId));
        await audit(
            admin.id,
            "package.project_archived",
            "project",
            contract.projectId,
            { orderId, reason },
            database,
        );
    }
    await database
        .update(orders)
        .set({
            status: order.status === "refunded" ? "refunded" : "cancelled",
            cancelledAt: at,
        })
        .where(eq(orders.id, orderId));
    const cancelledPackages = await database
        .update(packages)
        .set({ status: "cancelled", cancelledAt: at })
        .where(eq(packages.orderId, orderId))
        .returning();
    const affected = await database
        .update(bookings)
        .set({
            status: "cancelled",
            reservedUntil: null,
            sequence: sql`${bookings.sequence}+1`,
            updatedAt: at,
        })
        .where(
            and(
                inArray(bookings.status, ["confirmed", "reserved"]),
                gt(bookings.endsAt, at),
                or(
                    eq(bookings.orderId, orderId),
                    eq(bookings.serviceOrderId, orderId),
                    cancelledPackages.length
                        ? inArray(
                              bookings.packageId,
                              cancelledPackages.map((p) => p.id),
                          )
                        : undefined,
                ),
            ),
        )
        .returning();
    await database
        .update(documents)
        .set({ status: "cancelled", updatedAt: at })
        .where(
            and(
                eq(documents.orderId, orderId),
                eq(documents.kind, "invoice"),
                eq(documents.status, "draft"),
            ),
        );
    for (const booking of affected)
        await notify(
            booking.userId,
            "booking",
            "Dein Termin wurde storniert",
            "Der Termin wurde zusammen mit der zugehörigen Bestellung storniert. Die Kalendereinladung wurde aktualisiert.",
            `order-cancel-booking:${orderId}:${booking.id}`,
            "/konto/termine",
            database,
        );
    await audit(
        admin.id,
        "order.cancelled",
        "order",
        orderId,
        {
            reason,
            packageIds: cancelledPackages.map((p) => p.id),
            bookingIds: affected.map((b) => b.id),
            paidCents: order.paidCents,
        },
        database,
    );
    await notify(
        order.userId,
        "order",
        "Deine Bestellung wurde storniert",
        "Die zugehörigen Pakete und noch laufenden oder kommenden Termine sind storniert. Bereits erbrachte Leistungen und Belege bleiben nachvollziehbar. Eine erforderliche Rückzahlung wird gesondert geprüft und dokumentiert.",
        "order-cancelled:" + orderId,
        "/konto/pakete",
        database,
    );
}

export async function cancelOrder(
    admin: User,
    orderId: string,
    reason: string,
) {
    assert(admin.role === "admin", "Administratorzugang erforderlich.", 403);
    assert(
        reason.trim().length >= 10,
        "Bitte dokumentiere den Stornierungsgrund.",
    );
    return db().transaction(async (tx) => {
        await lock("finance", tx);
        await lock("calendar", tx);
        const [order] = await tx
            .select()
            .from(orders)
            .where(eq(orders.id, orderId));
        assert(
            order && !order.cancelledAt,
            "Diese Bestellung wurde bereits storniert.",
            409,
        );
        const finalized = await tx
            .select()
            .from(documents)
            .where(
                and(
                    eq(documents.orderId, orderId),
                    eq(documents.kind, "invoice"),
                    inArray(documents.status, ["issued", "paid"]),
                ),
            );
        const corrections = [];
        for (const doc of finalized)
            corrections.push(await createStorno(tx, admin, doc, reason));
        await cancelContractState(tx, admin, orderId, reason);
        return { ok: true, correctionIds: corrections.map((d) => d.id) };
    });
}

export async function cancelInvoice(
    admin: User,
    id: string,
    reason: string,
    mode: InvoiceCancellationMode = "correction",
) {
    assert(admin.role === "admin", "Administratorzugang erforderlich.", 403);
    assert(
        reason.trim().length >= 10,
        "Bitte dokumentiere den Grund der Korrektur.",
    );
    return db().transaction(async (tx) => {
        await lock("finance", tx);
        if (mode === "contract") await lock("calendar", tx);
        const [doc] = await tx
            .select()
            .from(documents)
            .where(eq(documents.id, id));
        assert(
            doc?.kind === "invoice" &&
                doc.finalizedAt &&
                doc.status !== "cancelled",
            "Diese Rechnung kann nicht storniert werden.",
            409,
        );
        const previous = await tx
            .select()
            .from(documents)
            .where(
                and(
                    eq(documents.parentId, id),
                    eq(documents.kind, "correction"),
                ),
            );
        assert(
            !previous.length,
            "Für diese Rechnung besteht bereits ein Stornobeleg.",
            409,
        );
        const correction = await createStorno(tx, admin, doc, reason);
        let replacementId: string | undefined;
        if (mode === "contract") {
            assert(
                doc.orderId,
                "Diese Rechnung ist keiner Bestellung zugeordnet.",
            );
            await cancelContractState(tx, admin, doc.orderId, reason);
        } else {
            if (doc.orderId) {
                const [order] = await tx
                    .select()
                    .from(orders)
                    .where(eq(orders.id, doc.orderId));
                assert(
                    order && !order.cancelledAt && order.status !== "refunded",
                    "Für diese Bestellung ist eine Rechnungskorrektur ohne Vertragsklärung nicht möglich.",
                    409,
                );
            }
            const [replacement] = await tx
                .insert(documents)
                .values({
                    userId: doc.userId,
                    orderId: doc.orderId,
                    parentId: doc.id,
                    kind: "invoice",
                    status: "draft",
                    items: doc.items,
                    amountCents: doc.amountCents,
                    description: `Berichtigte Rechnung zu ${doc.number}. ${doc.description}`,
                })
                .returning();
            replacementId = replacement.id;
            await audit(
                admin.id,
                "invoice.replacement_created",
                "document",
                replacement.id,
                { originalId: doc.id, correctionId: correction.id, reason },
                tx,
            );
        }
        await notify(
            doc.userId,
            "invoice",
            "Korrekturbeleg erstellt",
            mode === "correction"
                ? `Zu Deiner Rechnung ${doc.number} wurde ein Stornobeleg und ein Entwurf für eine berichtigte Rechnung erstellt. Deine Bestellung, Dein Paket und Deine Termine bleiben bestehen. Es wird keine neue Zahlung ausgelöst.`
                : `Zu Deiner Rechnung ${doc.number} wurde ein Stornobeleg angelegt und die zugehörige Bestellung storniert. Eine gegebenenfalls erforderliche Rückzahlung wird getrennt geprüft.`,
            "invoice-correction:" + correction.id,
            "/konto/rechnungen",
            tx,
        );
        return { ...correction, replacementId };
    });
}
export async function recordRefund(
    admin: User,
    input: {
        orderId: string;
        amountCents: number;
        bankReference: string;
        receivedAt: string;
        idempotencyKey: string;
    },
) {
    assert(admin.role === "admin", "Administratorzugang erforderlich.", 403);
    assert(
        Number.isSafeInteger(input.amountCents) && input.amountCents > 0,
        "Die Erstattung muss positiv sein.",
    );
    return db().transaction(async (tx) => {
        await lock("finance", tx);
        const [existing] = await tx
            .select()
            .from(payments)
            .where(eq(payments.idempotencyKey, input.idempotencyKey));
        if (existing) {
            assert(
                existing.orderId === input.orderId &&
                    existing.amountCents === -input.amountCents,
                "Der Schlüssel wurde bereits anders verwendet.",
                409,
            );
            return existing;
        }
        const [order] = await tx
            .select()
            .from(orders)
            .where(eq(orders.id, input.orderId));
        assert(
            order && order.paidCents >= input.amountCents,
            "Die Erstattung überschreitet den bestätigten Zahlungseingang.",
        );
        const receivedAt = new Date(input.receivedAt);
        assert(
            Number.isFinite(receivedAt.getTime()) && receivedAt <= new Date(),
            "Ungültiges Datum.",
        );
        const [refund] = await tx
            .insert(payments)
            .values({
                ...input,
                amountCents: -input.amountCents,
                adminId: admin.id,
                receivedAt,
                kind: "refund",
            })
            .returning();
        await tx
            .update(orders)
            .set({
                paidCents: order.paidCents - input.amountCents,
                status:
                    order.paidCents === input.amountCents
                        ? "refunded"
                        : order.status,
            })
            .where(eq(orders.id, order.id));
        await audit(
            admin.id,
            "refund.recorded",
            "order",
            order.id,
            { amountCents: input.amountCents },
            tx,
        );
        return refund;
    });
}
export async function respondOffer(
    user: User,
    id: string,
    accept: boolean,
    declaration: string,
    earlyStart = false,
    withdrawalAcknowledged = false,
) {
    readyCustomer(user, true);
    assert(
        !earlyStart || withdrawalAcknowledged,
        "Bitte bestätige die Hinweise zum Beginn innerhalb der Widerrufsfrist.",
    );
    return db().transaction(async (tx) => {
        await lock("finance", tx);
        const [doc] = await tx
            .select()
            .from(documents)
            .where(eq(documents.id, id));
        owns(user, doc);
        assert(
            doc.kind === "offer" &&
                doc.status === "sent" &&
                doc.validUntil! > new Date(),
            "Dieses Angebot kann nicht mehr beantwortet werden.",
            409,
        );
        assert(
            declaration.trim().length > 10,
            "Eine eindeutige Erklärung ist erforderlich.",
        );
        if (accept)
            await consumeApprovalScope(
                user,
                `offer:${id}:${doc.amountCents}`,
                tx,
            );
        await tx
            .update(documents)
            .set({
                status: accept ? "accepted" : "declined",
                respondedAt: new Date(),
                acceptance: declaration,
            })
            .where(eq(documents.id, id));
        if (accept) {
            const [order] = await tx
                .insert(orders)
                .values({
                    userId: user.id,
                    reference: "BE-" + randomUUID(),
                    product: "offer",
                    amountCents: doc.amountCents,
                    contract: {
                        offerId: id,
                        items: doc.items,
                        description: doc.description,
                        declaration,
                        catalogPackage: catalogFromSnapshot(doc.snapshot),
                        earlyStart,
                        withdrawalAcknowledged,
                        workMayStartAt: new Date(
                            Date.now() + (earlyStart ? 0 : 14 * 86400_000),
                        ).toISOString(),
                    },
                    acceptedAt: new Date(),
                })
                .returning();
            await tx.insert(documents).values({
                userId: user.id,
                orderId: order.id,
                parentId: id,
                kind: "invoice",
                status: "draft",
                items: doc.items,
                amountCents: doc.amountCents,
                description: doc.description,
                snapshot: { catalogPackage: catalogFromSnapshot(doc.snapshot) },
            });
        }
        await notifyAdmin(
            "offer",
            accept ? "Angebot angenommen" : "Angebot abgelehnt",
            `${user.name} hat das Angebot beantwortet.`,
            "offer-response:" + id,
            "/admin/angebote",
            tx,
        );
        await audit(
            user.id,
            accept ? "offer.accepted" : "offer.declined",
            "document",
            id,
            { declaration },
            tx,
        );
        return { ok: true };
    });
}
