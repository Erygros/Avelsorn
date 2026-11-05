import type { Metadata } from "next";
import { heroImage } from "@/content/editorial-images";

export const metadata: Metadata = {
    title: "Unternehmensberatung und digitale Umsetzung",
    description:
        "Avelsorn unterstützt Dich bei Gründung, Unternehmensstrukturen, Websites und digitalen Abläufen. Persönliche Beratung und praktische Umsetzung nach Vereinbarung.",
    openGraph: {
        type: "website",
        locale: "de_DE",
        siteName: "Avelsorn",
        title: "Avelsorn – Unternehmensberatung und digitale Umsetzung",
        description: "Dein Unternehmen. Klare Strukturen. Digitale Lösungen.",
        url: "/",
        images: [
            {
                url: heroImage.src.src,
                width: heroImage.src.width,
                height: heroImage.src.height,
                alt: heroImage.alt,
            },
        ],
    },
    verification: {
        other: { "msvalidate.01": "297F8A28439EBAA41062071E4CCC9147" },
    },
};

export { Home as default } from "@/components/home";
