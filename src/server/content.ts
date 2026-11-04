import sanitizeHtml from "sanitize-html";
import { and, inArray, lte } from "drizzle-orm";
import { db } from "./db";
import { media } from "./schema";
export function cleanHtml(value: string) {
    return sanitizeHtml(value, {
        allowedTags: [
            "h2",
            "h3",
            "h4",
            "p",
            "br",
            "strong",
            "em",
            "u",
            "s",
            "ul",
            "ol",
            "li",
            "blockquote",
            "a",
            "table",
            "thead",
            "tbody",
            "tr",
            "th",
            "td",
            "img",
            "hr",
        ],
        allowedAttributes: {
            a: ["href", "title"],
            img: ["src", "alt", "width", "height"],
            th: ["colspan", "rowspan"],
            td: ["colspan", "rowspan"],
        },
        allowedSchemes: ["https", "mailto"],
        allowProtocolRelative: false,
        transformTags: {
            a: (_tag, attributes) => ({
                tagName: "a",
                attribs: { ...attributes, rel: "noopener noreferrer" },
            }),
        },
        exclusiveFilter: (frame) =>
            frame.tag === "img" &&
            (!frame.attribs.src?.startsWith("/") ||
                frame.attribs.src.startsWith("//")),
    });
}
export async function publicHtml(value: string) {
    let html = cleanHtml(value);
    const ids = Array.from(
        html.matchAll(/<img[^>]*src="\/api\/media\/([a-f0-9-]+)"[^>]*>/g),
    ).map((m) => m[1]);
    if (!ids.length) return html;
    const items = await db()
        .select()
        .from(media)
        .where(and(inArray(media.id, ids), lte(media.publishedAt, new Date())));
    const escape = (text: string) =>
        text.replace(
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
    html = html.replace(
        /<img[^>]*src="\/api\/media\/([a-f0-9-]+)"[^>]*>/g,
        (_match, id) => {
            const item = items.find((m) => m.id === id);
            if (!item) return "";
            return `<figure><img src="/api/media/${id}" alt="${escape(item.alt)}" loading="lazy">${item.origin === "ai" ? `<figcaption>${escape(item.disclosure ?? "KI-generierte Grafik")}</figcaption>` : ""}</figure>`;
        },
    );
    return html;
}
