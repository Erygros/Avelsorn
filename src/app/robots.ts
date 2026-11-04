import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
    return {
        rules:
            process.env.PRODUCTION_APPROVED === "true"
                ? {
                      userAgent: "*",
                      allow: "/",
                      disallow: ["/admin", "/konto", "/api", "/einrichtung"],
                  }
                : { userAgent: "*", disallow: "/" },
        sitemap:
            process.env.PRODUCTION_APPROVED === "true"
                ? (process.env.PUBLIC_BASE_URL ?? "") + "/sitemap.xml"
                : undefined,
    };
}
