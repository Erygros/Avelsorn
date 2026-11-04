import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { documents, users } from "./schema";
import { business } from "./settings";
import { storage } from "./storage";
import { digest } from "./security";
import { money, berlin } from "./config";
import { BRAND } from "../content/brand";
import { brandLogoBytes } from "./brand";

export async function documentPdf(
    doc: typeof documents.$inferSelect,
): Promise<Buffer> {
    if (doc.pdfKey && doc.finalizedAt) return storage().get(doc.pdfKey);
    const snapshot = doc.snapshot as {
        business?: Record<string, string>;
        customer?: { name: string; billingAddress: string };
        smallBusinessNotice?: string;
        paymentReference?: string;
    } | null;
    const values = snapshot?.business ?? (await business());
    const identifiers = [
        ["USt-IdNr.", values.vat_id_if_available],
        ["Kleinunternehmer-IdNr.", values.small_business_id_if_available],
    ].filter((entry): entry is [string, string] =>
        Boolean(entry[1] && !entry[1].includes("{{")),
    );
    const invoiceReview =
        doc.kind !== "offer" &&
        doc.amountCents > 25000 &&
        identifiers.length === 0;
    const [user] = await db()
        .select()
        .from(users)
        .where(eq(users.id, doc.userId));
    const pdf = await PDFDocument.create();
    pdf.setTitle(
        `${doc.kind === "offer" ? "Angebot" : "Rechnung"} ${doc.number ?? "Entwurf"}`,
    );
    pdf.setLanguage("de-DE");
    pdf.setCreator(BRAND.name);
    const calendarDate = (value: Date) =>
        new Intl.DateTimeFormat("de-DE", {
            timeZone: "Europe/Berlin",
            dateStyle: "medium",
        }).format(value);
    const regular = await pdf.embedFont(StandardFonts.Helvetica);
    const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
    let page = pdf.addPage([595.28, 841.89]);
    let y = 780;
    const text = (
        value: string,
        size = 10,
        font = regular,
        color = rgb(0.2, 0.22, 0.18),
        x = 50,
    ) => {
        const clean = value.replace(
            /[^\x20-\x7E\u00A0-\u00FF\u20AC\u2013\u2014\u2019]/g,
            " ",
        );
        if (y < 70) {
            page = pdf.addPage([595.28, 841.89]);
            y = 780;
        }
        page.drawText(clean, { x, y, size, font, color });
        y -= size * 1.6;
    };
    const wrap = (value: string, width = 490, size = 10) => {
        for (const paragraph of value.split("\n")) {
            let line = "";
            for (const word of paragraph.split(/\s+/)) {
                if (
                    regular.widthOfTextAtSize(line + " " + word, size) >
                        width &&
                    line
                ) {
                    text(line, size);
                    line = word;
                } else line += (line ? " " : "") + word;
            }
            text(line, size);
        }
    };
    const logo = await pdf.embedPng(await brandLogoBytes());
    const logoWidth = 160;
    const logoHeight = (logoWidth * logo.height) / logo.width;
    page.drawImage(logo, {
        x: 50,
        y: y - logoHeight,
        width: logoWidth,
        height: logoHeight,
    });
    y -= logoHeight + 52;
    text(
        doc.kind === "offer"
            ? "Angebot"
            : doc.kind === "correction"
              ? "Korrekturbeleg"
              : "Rechnung",
        35,
        regular,
    );
    y -= 10;
    text(doc.number ?? "ENTWURF · keine finalisierte Rechnung", 11, bold);
    text("Ausgestellt: " + calendarDate(doc.issuedAt ?? new Date()));
    if (doc.validUntil)
        text("Gültig bis: " + berlin(doc.validUntil) + " (Europe/Berlin)");
    if (
        doc.status === "draft" ||
        Object.entries(values).some(
            ([key, value]) =>
                ![
                    "vat_id_if_available",
                    "small_business_id_if_available",
                    "about_text",
                    "contact_hours",
                    "business_name",
                    "bic",
                ].includes(key) && value.includes("{{"),
        )
    )
        text(
            "ENTWICKLUNGSFASSUNG · Pflichtangaben prüfen",
            9,
            bold,
            rgb(0.55, 0.2, 0.15),
        );
    if (invoiceReview)
        text(
            "ENTWICKLUNGSFASSUNG · Rechnungsangaben gesondert prüfen",
            9,
            bold,
            rgb(0.55, 0.2, 0.15),
        );
    y -= 22;
    text("LEISTUNGSERBRINGER", 8, bold);
    wrap(
        `${values.legal_full_name}\n${values.business_street}\n${values.business_postcode} ${values.business_city}\n${values.contact_email}`,
    );
    y -= 10;
    text("LEISTUNGSEMPFÄNGER", 8, bold);
    wrap(
        `${snapshot?.customer?.name ?? user.name}\n${snapshot?.customer?.billingAddress ?? user.billingAddress ?? "Rechnungsanschrift fehlt"}`,
    );
    y -= 22;
    page.drawLine({
        start: { x: 50, y },
        end: { x: 545, y },
        thickness: 0.6,
        color: rgb(0.7, 0.73, 0.67),
    });
    y -= 25;
    text("LEISTUNG", 8, bold);
    wrap(doc.description);
    y -= 10;
    for (const item of doc.items) {
        wrap(item.description, 360, 11);
        text(
            `${item.quantity} × ${money(item.unitCents)} = ${money(item.quantity * item.unitCents)}`,
            10,
        );
        y -= 8;
    }
    y -= 10;
    page.drawLine({
        start: { x: 50, y },
        end: { x: 545, y },
        thickness: 0.6,
        color: rgb(0.7, 0.73, 0.67),
    });
    y -= 30;
    text("Gesamtbetrag: " + money(doc.amountCents), 19, bold);
    wrap(
        "Für diese Leistung gilt die Steuerbefreiung für Kleinunternehmer gemäß § 19 UStG.",
        490,
        9,
    );
    y -= 10;
    text(
        "Zahlungsstatus: " +
            (doc.status === "paid"
                ? "Bezahlt"
                : doc.status === "draft"
                  ? "Entwurf"
                  : "Offen"),
        10,
        bold,
    );
    wrap(
        `Kontoinhaber: ${values.account_holder}\nIBAN: ${values.iban}\nBIC: ${values.bic}\nBank: ${values.bank_name}\nZahlungsreferenz: ${snapshot?.paymentReference ?? "siehe Bestellung"}`,
    );
    for (const [label, value] of identifiers) {
        y -= 12;
        wrap(label + ": " + value, 490, 8);
    }
    if (doc.dueAt && doc.status !== "paid")
        text("Zahlbar bis: " + calendarDate(doc.dueAt), 9);
    const bytes = Buffer.from(await pdf.save());
    if (doc.finalizedAt) {
        const key = `documents/${doc.id}.pdf`;
        await storage().put(key, bytes, "application/pdf");
        await db()
            .update(documents)
            .set({ pdfKey: key, pdfHash: digest(bytes) })
            .where(eq(documents.id, doc.id));
    }
    return bytes;
}
