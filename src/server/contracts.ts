import { and, eq } from "drizzle-orm";
import sanitizeHtml from "sanitize-html";
import { db, type Db } from "./db";
import { pages, orders, outbox, type User, type DocumentItem } from "./schema";
import { business } from "./settings";
import { legal } from "../content/legal";
import { money, berlin } from "./config";
import { digest, assert } from "./security";
import { notify } from "./events";
import { fromZonedTime, formatInTimeZone } from "date-fns-tz";

// Conservative contractual scheduling for Germany: consider regional holidays
// throughout Germany without inferring a customer's state from a free-text address.
// This does not decide whether an individual statutory withdrawal right has expired.
export function regularWorkStart(acceptedAt: Date) {
    const day = new Date(
        formatInTimeZone(acceptedAt, "Europe/Berlin", "yyyy-MM-dd") +
            "T12:00:00Z",
    );
    day.setUTCDate(day.getUTCDate() + 14);
    const holiday = (date: Date) => {
        const year = date.getUTCFullYear();
        const key = date.toISOString().slice(5, 10);
        if (
            [
                "01-01",
                "01-06",
                "03-08",
                "05-01",
                "08-08",
                "08-15",
                "09-20",
                "10-03",
                "10-31",
                "11-01",
                "12-25",
                "12-26",
            ].includes(key)
        )
            return true;
        // Gregorian Easter (Meeus/Jones/Butcher).
        const a = year % 19,
            b = Math.floor(year / 100),
            c = year % 100;
        const d = Math.floor(b / 4),
            e = b % 4,
            f = Math.floor((b + 8) / 25);
        const g = Math.floor((b - f + 1) / 3),
            h = (19 * a + b - d - g + 15) % 30;
        const i = Math.floor(c / 4),
            k = c % 4,
            l = (32 + 2 * e + 2 * i - h - k) % 7;
        const m = Math.floor((a + 11 * h + 22 * l) / 451),
            value = h + l - 7 * m + 114;
        const easter = Date.UTC(
            year,
            Math.floor(value / 31) - 1,
            (value % 31) + 1,
            12,
        );
        if (
            [-2, 1, 39, 50, 60].some(
                (offset) => date.getTime() === easter + offset * 86400_000,
            )
        )
            return true;
        const repentance = new Date(Date.UTC(year, 10, 22, 12));
        while (repentance.getUTCDay() !== 3)
            repentance.setUTCDate(repentance.getUTCDate() - 1);
        return date.getTime() === repentance.getTime();
    };
    while ([0, 6].includes(day.getUTCDay()) || holiday(day))
        day.setUTCDate(day.getUTCDate() + 1);
    day.setUTCDate(day.getUTCDate() + 1);
    return fromZonedTime(
        day.toISOString().slice(0, 10) + "T00:00:00",
        "Europe/Berlin",
    );
}

export type ContractTerms = {
    capturedAt: string;
    hash: string;
    provider: Record<string, string>;
    terms: string;
    withdrawal: string;
    withdrawalForm: string;
};

function plainHtml(html: string) {
    const text = sanitizeHtml(
        html.replace(/<\/(p|h[1-6]|li|blockquote|tr)>|<br\s*\/?\s*>/gi, "\n"),
        {
            allowedTags: [],
            allowedAttributes: {},
        },
    );
    return text
        .replace(
            /&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi,
            (match, entity: string) => {
                const named: Record<string, string> = {
                    amp: "&",
                    lt: "<",
                    gt: ">",
                    quot: '"',
                    apos: "'",
                    nbsp: " ",
                };
                if (!entity.startsWith("#"))
                    return named[entity.toLowerCase()] ?? match;
                const value = entity.toLowerCase().startsWith("#x")
                    ? parseInt(entity.slice(2), 16)
                    : Number(entity.slice(1));
                return value > 0 &&
                    value <= 0x10ffff &&
                    !(value >= 0xd800 && value <= 0xdfff)
                    ? String.fromCodePoint(value)
                    : "�";
            },
        )
        .trim();
}

export function savedContractTerms(
    snapshot: unknown,
): ContractTerms | undefined {
    const value = (snapshot as { contractTerms?: ContractTerms } | null)
        ?.contractTerms;
    return value?.terms && value.withdrawal && value.provider
        ? value
        : undefined;
}

export async function captureContractTerms(
    database: Db = db(),
): Promise<ContractTerms> {
    const provider = await business(database);
    const text = async (slug: "agb" | "widerrufsbelehrung") => {
        const [custom] = await database
            .select()
            .from(pages)
            .where(eq(pages.slug, slug));
        return custom
            ? `${custom.title}\n\n${plainHtml(custom.body)}`
            : legal[slug].sections
                  .map((section) => `${section.title}\n${section.text}`)
                  .join("\n\n");
    };
    const terms = await text("agb");
    const withdrawal = await text("widerrufsbelehrung");
    const withdrawalForm = `Muster-Widerrufsformular\nAn ${provider.legal_full_name} (Avelsorn), ${provider.business_street}, ${provider.business_postcode} ${provider.business_city}, ${provider.contact_email}.\nHiermit widerrufe ich den von mir abgeschlossenen Vertrag über die Erbringung der folgenden Dienstleistung:\nBezeichnung der Dienstleistung und gegebenenfalls Bestellnummer:\nBestellt am:\nName und Anschrift des Verbrauchers:\nDatum und Unterschrift des Verbrauchers (nur bei Mitteilung auf Papier).`;
    return {
        capturedAt: new Date().toISOString(),
        provider,
        terms,
        withdrawal,
        withdrawalForm,
        hash: digest(
            JSON.stringify({ provider, terms, withdrawal, withdrawalForm }),
        ),
    };
}

export function contractTermsText(terms: ContractTerms) {
    const p = terms.provider;
    return `Anbieter\n${p.legal_full_name} (Avelsorn)\n${p.business_street}\n${p.business_postcode} ${p.business_city}\n${p.business_country}\n${p.contact_email}\nTelefon: ${p.public_phone}\n\nAllgemeine Geschäftsbedingungen\n${terms.terms}\n\nWiderrufsbelehrung für Verbraucher\n${terms.withdrawal}\n\n${terms.withdrawalForm}`;
}

export function offerScopeText(doc: {
    number: string | null;
    description: string;
    amountCents: number;
    items: DocumentItem[];
}) {
    return `Angebot: ${doc.number ?? "Individuelles Angebot"}\n\nLeistungsumfang und vereinbarte Bedingungen\n${doc.description}\n\nPositionen\n${doc.items.map((item) => `${item.quantity} × ${item.description}: ${money(item.quantity * item.unitCents)}`).join("\n")}\n\nGesamtpreis: ${money(doc.amountCents)}\nFür diese Leistung gilt die Steuerbefreiung für Kleinunternehmer gemäß § 19 UStG. Umsatzsteuer wird nicht gesondert ausgewiesen.`;
}

export async function confirmContract(
    user: User,
    order: typeof orders.$inferSelect,
    details: string,
    contractTerms: ContractTerms,
    database: Db,
) {
    const contract = order.contract as Record<string, unknown>;
    const early = contract.earlyStart === true;
    const workStart =
        typeof contract.workMayStartAt === "string"
            ? `\nFrühester vertraglicher Leistungsbeginn: ${berlin(contract.workMayStartAt)} (Europe/Berlin). Zusätzlich ist die vollständige Zahlung erforderlich.`
            : "";
    const p = contractTerms.provider;
    const body = `Deine Vertragsbestätigung\n\nBestellreferenz: ${order.reference}\nVertragsschluss: ${berlin(order.acceptedAt ?? order.createdAt)} (Europe/Berlin)\nKunde: ${user.name}\nE-Mail: ${user.email}\nRechnungsanschrift: ${user.billingAddress ?? ""}\n\n${details}\n\nGesamtpreis: ${money(order.amountCents)}\nZahlungsart: Banküberweisung. Die Zahlungsfrist ergibt sich aus dem angenommenen Angebot beziehungsweise der Rechnung.\nKontoinhaber: ${p.account_holder}\nIBAN: ${p.iban}\nBIC: ${p.bic}\nZahlungsreferenz: ${order.reference}\n\nVertragsannahme: ${String(contract.declaration ?? "Verbindliche Bestellung der vereinbarten Leistung")}\nVorzeitiger Leistungsbeginn ausdrücklich verlangt: ${early ? "Ja" : "Nein"}\nKenntnis vom Erlöschen des Widerrufsrechts bei vollständiger Leistung bestätigt: ${contract.withdrawalAcknowledged === true ? "Ja" : "Nein"}${workStart}\n\n${contractTermsText(contractTerms)}\n\nDiese E-Mail enthält die bei Vertragsschluss vereinbarte Fassung. Bitte bewahre sie für Deine Unterlagen auf.`;
    await database
        .update(orders)
        .set({
            contract: {
                ...contract,
                contractTerms,
                confirmation: { eventKey: "contract:" + order.id, body },
            },
        })
        .where(and(eq(orders.id, order.id), eq(orders.userId, user.id)));
    await notify(
        user.id,
        "contract",
        "Deine Vertragsbestätigung · " + order.reference,
        body,
        "contract:" + order.id,
        "/konto/angebote",
        database,
    );
}

export async function assertContractConfirmation(
    order: typeof orders.$inferSelect,
    at: Date,
    database: Db,
) {
    const confirmation = (
        order.contract as { confirmation?: { eventKey?: string } }
    ).confirmation;
    if (!confirmation?.eventKey) return; // Existing historical contracts are not rewritten.
    const [mail] = await database
        .select()
        .from(outbox)
        .where(
            and(
                eq(outbox.eventKey, confirmation.eventKey),
                eq(outbox.userId, order.userId),
            ),
        );
    assert(
        mail?.status === "smtp_accepted" && mail.sentAt && mail.sentAt <= at,
        "Vor dem Leistungsbeginn muss die Vertragsbestätigung erfolgreich per E-Mail übermittelt sein. Prüfe den Versand im E-Mail-Bereich.",
        409,
    );
}
