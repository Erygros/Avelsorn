import type { Metadata } from "next";
import { heroImage } from "@/content/editorial-images";

export const metadata: Metadata = {
    title: "Websites, Webanwendungen und Prozessoptimierung",
    description:
        "Avelsorn entwickelt Websites, Formulare und Webanwendungen und hilft Unternehmen, Selbstständigen und Vereinen, wiederkehrende Arbeitsabläufe zu vereinfachen.",
    openGraph: {
        type: "website",
        locale: "de_DE",
        siteName: "Avelsorn",
        title: "Avelsorn – Websites und Prozessoptimierung",
        description: "Wir bauen Websites und vereinfachen Arbeitsabläufe.",
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
