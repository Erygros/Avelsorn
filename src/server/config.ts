import { z } from "zod";
z.config(z.locales.de());

export const publicKeys = [
    "brand_name",
    "domain",
    "public_base_url",
    "legal_full_name",
    "business_name",
    "business_street",
    "business_postcode",
    "business_city",
    "business_country",
    "public_phone",
    "contact_email",
    "vat_id_if_available",
    "small_business_id_if_available",
    "account_holder",
    "iban",
    "bic",
    "bank_name",
    "contact_hours",
    "about_text",
] as const;
export type BusinessKey = (typeof publicKeys)[number];
export const businessLabels: Record<BusinessKey, string> = {
    brand_name: "Markenname",
    domain: "Domain",
    public_base_url: "Öffentliche Basis-URL",
    legal_full_name: "Vollständiger Name",
    business_name: "Geschäftsbezeichnung",
    business_street: "Straße und Hausnummer",
    business_postcode: "Postleitzahl",
    business_city: "Ort",
    business_country: "Land",
    public_phone: "Telefon",
    contact_email: "Geschäftliche E-Mail",
    vat_id_if_available: "Umsatzsteuer-ID, falls vorhanden",
    small_business_id_if_available: "Kleinunternehmer-ID, falls vorhanden",
    account_holder: "Kontoinhaber",
    iban: "IBAN",
    bic: "BIC",
    bank_name: "Bank",
    contact_hours: "Erreichbarkeit",
    about_text: "Persönliche Vorstellung",
};
export const products = {
    project: {
        name: "Vereinbarter Projekttermin",
        price: 0,
        durations: [30, 60],
        description:
            "Gespräch zu einem bezahlten Leistungspaket. Der Termin ist im vereinbarten Paketpreis enthalten.",
    },
    intro: {
        name: "Kostenloses Erstgespräch",
        price: 0,
        durations: [15],
        description:
            "15 Minuten, um Deine Aufgabe und eine mögliche Zusammenarbeit zu besprechen.",
    },
    upgrade: {
        name: "45 Minuten Vertiefung",
        price: 1900,
        durations: [45],
        description:
            "Einmalig 45 weitere Minuten im separaten Folgetermin nach Deinem kostenlosen Erstgespräch.",
    },
    consultation: {
        name: "Einzelberatung",
        price: 2900,
        durations: [30, 60, 90],
        description:
            "29 € je angefangener Stunde. 30 oder 60 Minuten: 29 €. 90 Minuten: 58 €.",
    },
    package12: {
        name: "12 Stunden für 28 Tage",
        price: 9900,
        durations: [30, 60, 90],
        description:
            "12 Stunden für Beratung und Projektarbeit, flexibel innerhalb von 28 Tagen ab Zahlungseingang.",
    },
    unlimited: {
        name: "28 Tage ohne festes Stundenkontingent",
        price: 29900,
        durations: [30, 60, 90],
        description:
            "28 Tage ohne festes Stundenkontingent. Termine und Arbeiten nach Vereinbarung innerhalb verfügbarer Kapazität.",
    },
} as const;
export const productKey = z.enum([
    "project",
    "intro",
    "upgrade",
    "consultation",
    "package12",
    "unlimited",
]);
export type ProductKey = z.infer<typeof productKey>;
export function price(product: ProductKey, minutes?: number): number {
    if (product === "consultation") {
        if (!minutes || ![30, 60, 90].includes(minutes))
            throw new Error("Ungültige Beratungsdauer.");
        return Math.ceil(minutes / 60) * 2900;
    }
    return products[product].price;
}
export const money = (cents: number) =>
    new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: cents % 100 ? 2 : 0,
    }).format(cents / 100);
export const berlin = (date: Date | string) =>
    new Intl.DateTimeFormat("de-DE", {
        timeZone: "Europe/Berlin",
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(date));
export const baseUrl = () =>
    (process.env.PLATFORM_ENV === "preview" && process.env.VERCEL_BRANCH_URL
        ? "https://" + process.env.VERCEL_BRANCH_URL
        : (process.env.PUBLIC_BASE_URL ?? "http://localhost:3001")
    ).replace(/\/$/, "");
