/** Read-only local inventory for the editorial completion audit. Stop the preview first. */
import { writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { loadEnvConfig } from "@next/env";
import { eq } from "drizzle-orm";
import { connectDatabase } from "../src/server/db";
import { pages, posts, auditEvents } from "../src/server/schema";
import { initialArticles } from "../src/content/articles";

async function main() {
    loadEnvConfig(process.cwd());
    if (process.env.DATABASE_URL || process.env.VERCEL)
        throw new Error("Nur für die lokale Inhaltsprüfung vorgesehen.");
    const connection = connectDatabase();
    try {
        const cmsPages = await connection.db.select().from(pages);
        const articles = await connection.db.select().from(posts);
        const editorialEvents = await connection.db
            .select({ id: auditEvents.id, resourceId: auditEvents.resourceId })
            .from(auditEvents)
            .where(eq(auditEvents.action, "post.editorial_revised"));
        const report = {
            checkedAt: new Date().toISOString(),
            cmsPages,
            articles: articles.map((article) => {
                const source = initialArticles.find(
                    (item) => item.slug === article.slug,
                );
                return {
                    slug: article.slug,
                    title: article.title,
                    status: article.status,
                    bodySha256: createHash("sha256")
                        .update(article.body)
                        .digest("hex"),
                    matchesSource:
                        source?.title === article.title &&
                        source?.body === article.body &&
                        source?.excerpt === article.excerpt,
                    hasEditorialAudit: editorialEvents.some(
                        (event) => event.resourceId === article.id,
                    ),
                };
            }),
            editorialAuditEvents: editorialEvents.length,
        };
        writeFileSync(
            "tests/output/editorial-inventory.json",
            JSON.stringify(report, null, 2),
        );
        console.log(
            JSON.stringify({
                cmsPages: cmsPages.length,
                articles: report.articles,
                editorialAuditEvents: report.editorialAuditEvents,
            }),
        );
    } finally {
        await connection.close();
    }
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
