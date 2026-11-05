import { headers } from "next/headers";
export async function JsonLd({ value }: { value: unknown }) {
    return (
        <script
            type="application/ld+json"
            nonce={(await headers()).get("x-nonce") ?? undefined}
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(value).replace(/</g, "\\u003c"),
            }}
        />
    );
}
