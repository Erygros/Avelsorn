import { headers } from "next/headers";
import { business } from "@/server/settings";
import { BRAND } from "@/content/brand";
import { baseUrl } from "@/server/config";
export async function BusinessStructuredData() {
    const values = await business();
    const present = (key: string) =>
        key && !key.includes("{{") ? key : undefined;
    const data = {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "@id": baseUrl() + "/#avelsorn",
        name: BRAND.name,
        url: baseUrl(),
        logo: baseUrl() + BRAND.logo,
        description:
            "Persönliche Unternehmensberatung und praktische Umsetzung von Websites und digitalen Arbeitsabläufen.",
        telephone: present(values.public_phone),
        email: present(values.contact_email),
        founder: present(values.legal_full_name)
            ? { "@type": "Person", name: values.legal_full_name }
            : undefined,
        address: present(values.business_street)
            ? {
                  "@type": "PostalAddress",
                  streetAddress: values.business_street,
                  postalCode: values.business_postcode,
                  addressLocality: values.business_city,
                  addressCountry: "DE",
              }
            : undefined,
    };
    return (
        <script
            type="application/ld+json"
            nonce={(await headers()).get("x-nonce") ?? undefined}
            dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@graph": [
                        data,
                        {
                            "@type": "WebSite",
                            "@id": baseUrl() + "/#website",
                            url: baseUrl(),
                            name: BRAND.name,
                            inLanguage: "de-DE",
                            publisher: { "@id": baseUrl() + "/#avelsorn" },
                        },
                    ],
                }).replace(/</g, "\\u003c"),
            }}
        />
    );
}
