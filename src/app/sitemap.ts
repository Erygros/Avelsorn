import type { MetadataRoute } from "next";
import { and, eq, lte } from "drizzle-orm";
import { db } from "@/server/db";
import { posts, pages } from "@/server/schema";
import { searchPages, searchPagePath } from "@/content/search";
import { publicSitePaths, publicCmsPath } from "@/content/search/urls";
import { baseUrl } from "@/server/config";
import { searchIndexingAllowed } from "@/server/search-policy";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    if (!searchIndexingAllowed()) return [];
    const database = db();
    const articles = await database
        .select()
        .from(posts)
        .where(
            and(
                eq(posts.status, "published"),
                lte(posts.publishAt, new Date()),
            ),
        );
    const custom = await database
        .select({ slug: pages.slug, updatedAt: pages.updatedAt })
        .from(pages);
    const entries = new Map<string, MetadataRoute.Sitemap[number]>();
    for (const path of publicSitePaths())
        entries.set(path, { url: new URL(path, baseUrl()).href });
    for (const page of searchPages)
        entries.set(searchPagePath(page), {
            url: new URL(searchPagePath(page), baseUrl()).href,
            lastModified: page.updatedOn,
        });
    for (const page of custom) {
        const path = publicCmsPath(page.slug);
        if (path)
            entries.set(path, {
                url: new URL(path, baseUrl()).href,
                lastModified: page.updatedAt,
            });
    }
    for (const article of articles) {
        const path = "/blog/" + article.slug;
        entries.set(path, {
            url: new URL(path, baseUrl()).href,
            lastModified: article.updatedAt,
        });
    }
    return [...entries.values()];
}
