import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    serverExternalPackages: ["@electric-sql/pglite", "pg"],
    poweredByHeader: false,
    devIndicators: false,
    images: { qualities: [75, 85] },
    outputFileTracingIncludes: {
        "/*": ["./public/brand/avelsorn-logo.png"],
    },
    outputFileTracingExcludes: {
        "*": ["./.tools/**/*", "./data/**/*", "./docs/**/*"],
    },
    async headers() {
        return [
            {
                source: "/:path*",
                headers: [
                    { key: "X-Content-Type-Options", value: "nosniff" },
                    { key: "X-Frame-Options", value: "DENY" },
                    {
                        key: "Referrer-Policy",
                        value: "strict-origin-when-cross-origin",
                    },
                    {
                        key: "Permissions-Policy",
                        value: "camera=(self), microphone=(self), geolocation=()",
                    },
                ],
            },
        ];
    },
    turbopack: {
        rules: {
            "*.css": {
                loaders: ["@tailwindcss/turbopack"],
                as: "*.css",
            },
        },
    },
};

export default nextConfig;
