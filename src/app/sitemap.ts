import type { MetadataRoute } from "next";
import { and, eq, lte } from "drizzle-orm";
import { db } from "@/server/db";
import { posts } from "@/server/schema";
import { services } from "@/content/pages";
import { audiences, audiencePath } from "@/content/audiences";
import { baseUrl } from "@/server/config";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    if (process.env.PRODUCTION_APPROVED !== "true") return [];
    const articles = await db()
        .select()
        .from(posts)
        .where(
            and(
                eq(posts.status, "published"),
                lte(posts.publishAt, new Date()),
            ),
        );
    return [
        "",
        "/leistungen",
        "/preise",
        "/ablauf",
        "/zielgruppen",
        "/erstgespraech",
        "/kontakt",
        "/blog",
        "/beruflich-neu-starten",
        "/paket-anfragen",
        ...audiences.map(audiencePath),
        ...services.map((s) => "/leistungen/" + s.slug),
    ]
        .map((path) => ({ url: baseUrl() + path }))
        .concat(
            articles.map((p) => ({
                url: baseUrl() + "/blog/" + p.slug,
                lastModified: p.updatedAt,
            })),
        );
}
