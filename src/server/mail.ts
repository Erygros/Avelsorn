import nodemailer from "nodemailer";
import { and, eq, lte } from "drizzle-orm";
import { db } from "./db";
import { outbox, files, documents, bookings, users } from "./schema";
import { decrypt, audit } from "./security";
import { business } from "./settings";
import { storage } from "./storage";
import { cleanHtml } from "./content";
import { notifyAdmin } from "./events";
import { BRAND } from "../content/brand";
import { baseUrl } from "./config";
import { brandLogoBytes } from "./brand";
import { ics } from "./calendar";

export const escape = (value: string) =>
    value.replace(
        /[&<>"']/g,
        (c) =>
            ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;",
            })[c]!,
    );
export async function emailHtml(
    subject: string,
    body: string,
    ctaUrl?: string | null,
    logoSource = baseUrl() + BRAND.logo,
) {
    const values = await business();
    return `<!doctype html><html lang="de"><head><meta charset="utf-8"><title>${escape(subject)}</title></head><body style="margin:0;background:#f5f6f2;color:#22251f;font-family:Arial,sans-serif"><table role="presentation" style="width:100%;padding:36px 15px"><tr><td><table role="presentation" style="width:100%;max-width:600px;margin:auto;background:#fff;border:1px solid #dedfd9;padding:40px"><tr><td><p style="margin:0 0 28px;padding:8px"><img src="${escape(logoSource)}" alt="${BRAND.name}" width="174" height="39" style="display:block;width:174px;max-width:100%;height:auto;border:0"></p><h1 style="font:normal 30px Arial,sans-serif;line-height:1.25">${escape(subject)}</h1><div style="font-size:14px;line-height:1.8;color:#555c4c">${body.startsWith("HTML:") ? cleanHtml(body.slice(5)) : escape(body).replace(/\n/g, "<br>")}</div>${ctaUrl && /^https?:\/\//.test(ctaUrl) ? `<p style="margin:28px 0"><a href="${escape(ctaUrl)}" style="display:inline-block;padding:14px 20px;color:#fff;background:#22251f;text-decoration:none">Im Portal öffnen →</a></p>` : ""}<hr style="border:0;border-top:1px solid #dedfd9;margin-top:32px"><p style="font-size:11px;color:#62665d;line-height:1.8">${escape(values.legal_full_name)}<br>${escape(values.business_street)}<br>${escape(values.business_postcode + " " + values.business_city)}<br>${escape(values.contact_email)}</p></td></tr></table></td></tr></table></body></html>`;
}
export async function sendOutboxBatch(max = 15, eventKey?: string) {
    if (
        !process.env.SMTP_HOST ||
        !process.env.SMTP_USERNAME ||
        !process.env.SMTP_PASSWORD ||
        !process.env.MAIL_FROM_ADDRESS
    )
        return { sent: 0, configured: false };
    const transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT ?? 465),
        secure: process.env.SMTP_SECURE !== "false",
        requireTLS: true,
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD,
        },
        connectionTimeout: 15000,
        socketTimeout: 20000,
        tls: { minVersion: "TLSv1.2" },
    });
    let sent = 0;
    for (let i = 0; i < max; i++) {
        const row = await db().transaction(async (tx) => {
            const [mail] = await tx
                .select()
                .from(outbox)
                .where(
                    and(
                        eq(outbox.status, "queued"),
                        lte(outbox.availableAt, new Date()),
                        eventKey ? eq(outbox.eventKey, eventKey) : undefined,
                    ),
                )
                .for("update", { skipLocked: true })
                .limit(1);
            if (!mail) return null;
            await tx
                .update(outbox)
                .set({
                    status: "sending",
                    claimedAt: new Date(),
                    attempts: mail.attempts + 1,
                })
                .where(eq(outbox.id, mail.id));
            return mail;
        });
        if (!row) break;
        try {
            const [calendarBooking] = row.calendarEvent
                ? await db()
                      .select()
                      .from(bookings)
                      .where(eq(bookings.id, row.calendarEvent.bookingId))
                : [];
            const [calendarOwner] = calendarBooking
                ? await db()
                      .select({ disabledAt: users.disabledAt })
                      .from(users)
                      .where(eq(users.id, calendarBooking.userId))
                : [];
            if (
                row.calendarEvent &&
                (!calendarBooking ||
                    !calendarOwner ||
                    calendarOwner.disabledAt ||
                    calendarBooking.sequence !== row.calendarEvent.sequence ||
                    calendarBooking.status !==
                        (row.calendarEvent.kind === "cancellation"
                            ? "cancelled"
                            : "confirmed"))
            ) {
                await db()
                    .update(outbox)
                    .set({ status: "cancelled" })
                    .where(eq(outbox.id, row.id));
                continue;
            }
            const body = decrypt(row.encryptedBody);
            const attachments = await Promise.all(
                row.attachmentKeys.map(async (key) => {
                    const [file] = await db()
                        .select()
                        .from(files)
                        .where(eq(files.key, key));
                    const [document] = file
                        ? []
                        : await db()
                              .select()
                              .from(documents)
                              .where(eq(documents.pdfKey, key));
                    return {
                        filename:
                            file?.name ??
                            (document?.number
                                ? document.number + ".pdf"
                                : (key.split("/").pop() ?? "Dokument.pdf")),
                        content: await storage().get(key),
                    };
                }),
            );
            const url = row.ctaUrl?.startsWith("enc:")
                ? decrypt(row.ctaUrl.slice(4))
                : row.ctaUrl;
            const ping = row.eventKey.startsWith("inquiry-ping:");
            await transport.sendMail({
                from: {
                    address: process.env.MAIL_FROM_ADDRESS!,
                    name: BRAND.name,
                },
                to: row.to,
                subject: row.subject,
                icalEvent: calendarBooking
                    ? {
                          filename: "avelsorn-termin.ics",
                          method:
                              calendarBooking.status === "cancelled"
                                  ? "CANCEL"
                                  : "PUBLISH",
                          content: ics(calendarBooking),
                      }
                    : undefined,
                text:
                    (body.startsWith("HTML:")
                        ? body.slice(5).replace(/<[^>]*>/g, " ")
                        : body) + (url ? "\n\n" + url : ""),
                html: ping
                    ? undefined
                    : await emailHtml(
                          row.subject,
                          body,
                          url,
                          "cid:" + BRAND.mailLogoCid,
                      ),
                attachments: ping
                    ? undefined
                    : [
                          ...attachments,
                          {
                              filename: "avelsorn-logo.png",
                              content: await brandLogoBytes(),
                              cid: BRAND.mailLogoCid,
                              contentDisposition: "inline",
                          },
                      ],
                messageId: `<${row.id}@${process.env.MAIL_FROM_ADDRESS!.split("@")[1]}>`,
            });
            await db()
                .update(outbox)
                .set({
                    status: "smtp_accepted",
                    sentAt: new Date(),
                    errorCode: null,
                })
                .where(eq(outbox.id, row.id));
            sent++;
        } catch (error) {
            const code =
                typeof error === "object" && error && "code" in error
                    ? String(error.code)
                    : "SMTP_ERROR";
            const responseCode =
                typeof error === "object" && error && "responseCode" in error
                    ? Number(error.responseCode)
                    : 0;
            const transient =
                ["ECONNECTION", "EDNS", "EAI_AGAIN", "ECONNREFUSED"].includes(
                    code,
                ) ||
                (responseCode >= 400 && responseCode < 500);
            const permanent =
                ["EAUTH", "EENVELOPE", "EMESSAGE"].includes(code) ||
                responseCode >= 500;
            const status =
                permanent || row.attempts >= 4
                    ? "failed"
                    : transient
                      ? "queued"
                      : "delivery_unknown";
            await db()
                .update(outbox)
                .set({
                    status,
                    availableAt: new Date(
                        Date.now() +
                            Math.min(3600, 60 * 2 ** row.attempts) * 1000,
                    ),
                    errorCode: code.slice(0, 50),
                })
                .where(eq(outbox.id, row.id));
            await audit(null, "mail.failed", "mail", row.id, { code });
            if (status !== "queued")
                await notifyAdmin(
                    "mail",
                    "E-Mail-Versand benötigt Deine Prüfung",
                    "Ein Versandvorgang ist fehlgeschlagen oder sein Übergabestatus ist unklar. Bitte prüfe das E-Mail-Center vor einem erneuten Versand.",
                    "mail-outage:" + new Date().toISOString().slice(0, 10),
                    "/admin/email",
                );
        }
    }
    return { sent, configured: true };
}
