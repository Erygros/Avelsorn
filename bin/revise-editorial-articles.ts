/** Local editorial maintenance. Refuses to replace independently edited articles. */
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { loadEnvConfig } from "@next/env";
import { eq } from "drizzle-orm";
import { connectDatabase } from "../src/server/db";
import { posts } from "../src/server/schema";
import { audit } from "../src/server/security";
import { initialArticles } from "../src/content/articles";

async function main() {
    loadEnvConfig(process.cwd());
    if (
        process.env.DATABASE_URL ||
        process.env.VERCEL ||
        process.env.PLATFORM_ENV === "production"
    )
        throw new Error(
            "Diese redaktionelle Überarbeitung ist ausschließlich lokal vorgesehen.",
        );
    const baselinePath = process.argv
        .find((arg) => arg.startsWith("--baseline="))
        ?.slice(11);
    if (!baselinePath)
        throw new Error(
            "--baseline mit gesicherter Ausgangsfassung erforderlich.",
        );
    const before = JSON.parse(readFileSync(baselinePath, "utf8")) as {
        slug: string;
        title: string;
        excerpt: string;
        body: string;
    }[];
    const apply = process.argv.includes("--apply");
    const connection = connectDatabase();
    const hash = (value: string) =>
        createHash("sha256").update(value).digest("hex");
    try {
        const result = await connection.db.transaction(async (tx) => {
            const changes = [];
            for (const next of initialArticles) {
                const [current] = await tx
                    .select()
                    .from(posts)
                    .where(eq(posts.slug, next.slug))
                    .for("update");
                if (!current) throw new Error("Artikel fehlt: " + next.slug);
                if (
                    current.title === next.title &&
                    current.body === next.body &&
                    current.excerpt === next.excerpt
                )
                    continue;
                const original = before.find(
                    (article) => article.slug === next.slug,
                );
                if (
                    !original ||
                    current.title !== original.title ||
                    current.body !== original.body ||
                    current.excerpt !== original.excerpt ||
                    (current.seoTitle && current.seoTitle !== original.title) ||
                    (current.metaDescription &&
                        current.metaDescription !== original.excerpt)
                )
                    throw new Error(
                        "Eigenständig bearbeiteter Artikel wird nicht überschrieben: " +
                            next.slug,
                    );
                changes.push({ current, next });
            }
            if (!apply)
                return {
                    dryRun: true,
                    articles: changes.map((change) => change.current.slug),
                };
            mkdirSync("data/editorial-backups", { recursive: true });
            const backup = `data/editorial-backups/${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
            writeFileSync(
                backup,
                JSON.stringify(
                    changes.map((change) => change.current),
                    null,
                    2,
                ),
            );
            for (const { current, next } of changes) {
                await tx
                    .update(posts)
                    .set({
                        title: next.title,
                        excerpt: next.excerpt,
                        body: next.body,
                        seoTitle: next.seoTitle,
                        metaDescription: next.metaDescription,
                        updatedAt: new Date(),
                    })
                    .where(eq(posts.id, current.id));
                await audit(
                    null,
                    "post.editorial_revised",
                    "post",
                    current.id,
                    {
                        reason: "Nutzerauftrag: konkrete Arbeitsbeispiele statt allgemeiner Werbetexte",
                        backup,
                        before: {
                            title: current.title,
                            bodySha256: hash(current.body),
                        },
                        after: {
                            title: next.title,
                            bodySha256: hash(next.body),
                        },
                    },
                    tx,
                );
            }
            return {
                dryRun: false,
                articles: changes.map((change) => change.current.slug),
                backup,
            };
        });
        console.log(JSON.stringify(result));
    } finally {
        await connection.close();
    }
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
