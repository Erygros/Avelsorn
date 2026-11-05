import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
    const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
    const development = process.env.NODE_ENV !== "production";
    const policy = `default-src 'self'; script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${development ? " 'unsafe-eval'" : ""}; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'${development ? " ws:" : ""}; media-src 'self' blob:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'`;
    const headers = new Headers(request.headers);
    headers.set("x-nonce", nonce);
    headers.set("x-pathname", request.nextUrl.pathname);
    headers.set("Content-Security-Policy", policy);
    const isPreview =
        process.env.VERCEL_ENV === "preview" &&
        process.env.PLATFORM_ENV === "preview";
    const isProduction =
        process.env.PLATFORM_ENV === "production" || !!process.env.VERCEL;
    const adminActions = new Set([
        "setup",
        "login",
        "logout",
        "otp",
        "settings",
        "email-preview",
        "email-send",
        "backup-create",
        "page-save",
        "post-save",
        "payment",
        "refund",
        "invoice-issue",
        "invoice-cancel",
        "order-cancel",
        "document-edit",
        "project-create",
        "project-update",
        "task-update",
        "availability",
        "availability-week",
        "guardian-review",
        "guardian-contract-review",
        "admin-booking",
        "time-manual",
        "time-correct",
        "timer",
        "approval-request",
        "privacy-resolve",
        "media-save",
        "offer-create",
        "offer-send",
    ]);
    const action = request.nextUrl.pathname.match(
        /^\/api\/action\/([^/]+)$/,
    )?.[1];
    const setupPath =
        /^\/(admin|anmelden|otp|einrichtung)(\/|$)/.test(
            request.nextUrl.pathname,
        ) ||
        (!!action && adminActions.has(action)) ||
        /^\/api\/(files|backups|slots|documents)(\/|$)/.test(
            request.nextUrl.pathname,
        );
    if (
        isProduction &&
        request.nextUrl.protocol !== "https:" &&
        process.env.PUBLIC_BASE_URL?.startsWith("https://")
    )
        return NextResponse.redirect(
            new URL(
                request.nextUrl.pathname + request.nextUrl.search,
                process.env.PUBLIC_BASE_URL,
            ),
            308,
        );
    if (
        isProduction &&
        !isPreview &&
        process.env.PRODUCTION_APPROVED !== "true" &&
        !setupPath
    )
        return new NextResponse(
            "Die Plattform wird eingerichtet. Es liegt noch keine Veröffentlichungsfreigabe vor.",
            {
                status: 503,
                headers: {
                    "Content-Type": "text/plain; charset=utf-8",
                    "X-Robots-Tag": "noindex, nofollow",
                    "Retry-After": "86400",
                },
            },
        );
    if (isPreview) {
        if (
            !process.env.DATABASE_URL ||
            !process.env.DATABASE_PREVIEW_ROLE ||
            !/^avel_preview_[a-z0-9_]+$/.test(
                process.env.DATABASE_PREVIEW_ROLE,
            ) ||
            new URL(process.env.DATABASE_URL).username.split(".")[0] !==
                process.env.DATABASE_PREVIEW_ROLE ||
            process.env.SMTP_HOST ||
            process.env.STORAGE_PREFIX !==
                process.env.DATABASE_PREVIEW_ROLE + "/"
        )
            return new NextResponse(
                "Die isolierte Vorschau ist noch nicht konfiguriert.",
                {
                    status: 503,
                    headers: { "X-Robots-Tag": "noindex, nofollow" },
                },
            );
    }
    if (isProduction && !isPreview && !setupPath) {
        try {
            const { readiness } = await import("./server/settings");
            const missing = await readiness();
            if (missing.length)
                return new NextResponse(
                    "Die Plattform wird eingerichtet. Erforderliche Angaben oder Dienste fehlen noch.",
                    {
                        status: 503,
                        headers: {
                            "Content-Type": "text/plain; charset=utf-8",
                            "X-Robots-Tag": "noindex, nofollow",
                        },
                    },
                );
        } catch {
            return new NextResponse(
                "Die Plattform ist noch nicht betriebsbereit.",
                {
                    status: 503,
                    headers: { "X-Robots-Tag": "noindex, nofollow" },
                },
            );
        }
    }
    const response = NextResponse.next({ request: { headers } });
    response.headers.set("Content-Security-Policy", policy);
    if (isPreview) response.headers.set("X-Robots-Tag", "noindex, nofollow");
    if (isProduction)
        response.headers.set(
            "Strict-Transport-Security",
            "max-age=31536000; includeSubDomains",
        );
    if (
        /^\/(kalender\/gast|konto|admin|api|einrichtung|otp|anmelden|registrieren|passwort|email-bestaetigen|zustimmung|vertragszustimmung|entwicklung)/.test(
            request.nextUrl.pathname,
        )
    ) {
        response.headers.set("Cache-Control", "private, no-store");
        response.headers.set("X-Robots-Tag", "noindex, nofollow");
        response.headers.set("Referrer-Policy", "no-referrer");
    }
    return response;
}
export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|woff2)).*)",
    ],
};
