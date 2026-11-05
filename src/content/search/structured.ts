import type { Metadata } from "next";
import {
    searchPagePath,
    sectionFor,
    searchHubs,
    type SearchPage,
} from "./types";

export function searchMetadata(
    page: Pick<SearchPage, "title" | "description">,
    path: string,
    origin: string,
): Metadata {
    const url = new URL(path, origin).href;
    return {
        title: page.title,
        description: page.description,
        alternates: { canonical: url },
        openGraph: {
            title: page.title + " · Avelsorn",
            description: page.description,
            url,
            locale: "de_DE",
            siteName: "Avelsorn",
            type: "website",
            images: [
                {
                    url: new URL("/opengraph-image.png", origin).href,
                    width: 1200,
                    height: 630,
                    alt: "Avelsorn",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: page.title,
            description: page.description,
        },
    };
}
export function searchStructuredData(page: SearchPage, origin: string) {
    const path = searchPagePath(page),
        url = new URL(path, origin).href;
    const provider = new URL("/#avelsorn", origin).href;
    const hub = searchHubs.find((item) => item.path === sectionFor(page.kind));
    const trail = [
        { name: "Startseite", item: new URL("/", origin).href },
        ...(hub
            ? [{ name: hub.name, item: new URL(hub.path, origin).href }]
            : []),
        { name: page.heading, item: url },
    ];
    const webPage = {
        "@type": "WebPage",
        "@id": url + "#webpage",
        url,
        name: page.title,
        description: page.description,
        inLanguage: "de-DE",
        dateModified: page.updatedOn,
        isPartOf: { "@id": new URL("/#website", origin).href },
        breadcrumb: { "@id": url + "#breadcrumbs" },
        ...(page.kind === "industry" ||
        page.kind === "solution" ||
        page.kind === "local"
            ? { mainEntity: { "@id": url + "#service" } }
            : {}),
    };
    const detail =
        page.kind === "guide"
            ? {
                  "@type": "Article",
                  "@id": url + "#article",
                  headline: page.heading,
                  description: page.answer,
                  author: { "@id": provider },
                  publisher: { "@id": provider },
                  dateModified: page.updatedOn,
                  inLanguage: "de-DE",
                  mainEntityOfPage: { "@id": url + "#webpage" },
              }
            : page.kind !== "questions"
              ? {
                    "@type": "Service",
                    "@id": url + "#service",
                    name: page.heading,
                    description: page.answer,
                    url,
                    provider: { "@id": provider },
                    areaServed: { "@type": "Country", name: "Deutschland" },
                }
              : undefined;
    return {
        "@context": "https://schema.org",
        "@graph": [
            webPage,
            {
                "@type": "BreadcrumbList",
                "@id": url + "#breadcrumbs",
                itemListElement: trail.map((item, index) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    ...item,
                })),
            },
            ...(detail ? [detail] : []),
        ],
    };
}
