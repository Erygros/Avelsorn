import type { MetadataRoute } from "next";
import { searchIndexingAllowed } from "@/server/search-policy";
import { baseUrl } from "@/server/config";
export const dynamic = "force-dynamic";
export default function robots(): MetadataRoute.Robots {
    return {
        // A shared group preserves private-path exclusions for all crawlers.
        // No new model-training preference is inferred from a search request.
        rules: searchIndexingAllowed()
            ? {
                  userAgent: "*",
                  allow: ["/", "/api/media/"],
                  disallow: [
                      "/admin",
                      "/konto",
                      "/api",
                      "/einrichtung",
                      "/entwicklung",
                      "/kalender/gast",
                      "/kalender/bestaetigt",
                  ],
              }
            : { userAgent: "*", disallow: "/" },
        sitemap: searchIndexingAllowed()
            ? new URL("/sitemap.xml", baseUrl()).href
            : undefined,
    };
}
