import type { Metadata } from "next";
import { Consent } from "@/components/consent";
import { cookies } from "next/headers";
import { BRAND } from "@/content/brand";
import { baseUrl } from "@/server/config";
import { searchIndexingAllowed } from "@/server/search-policy";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
    const name = BRAND.name;
    return {
        metadataBase: new URL(baseUrl()),
        title: { default: name, template: "%s · " + name },
        description:
            "Avelsorn: Websites und Webanwendungen, digitale Arbeitsabläufe und Beratung zur Selbstständigkeit. Aufgaben, Aufwand und Umsetzung nach Vereinbarung.",
        robots: {
            index: searchIndexingAllowed(),
            follow: searchIndexingAllowed(),
        },
        openGraph: { type: "website", locale: "de_DE", siteName: name },
        twitter: { card: "summary_large_image" },
        alternates: { canonical: baseUrl() },
    };
}

export const dynamic = "force-dynamic";

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const choice = (await cookies()).get("platform_consent")?.value ?? null;
    return (
        <html lang="de">
            <body>
                <a className="skip-link" href="#main">
                    Zum Inhalt springen
                </a>
                {children}
                <Consent initialChoice={choice} />
            </body>
        </html>
    );
}
