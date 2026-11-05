const privatePath =
    /^\/(admin|konto|api|einrichtung|entwicklung|kalender\/(?:gast|bestaetigt)|anmelden|registrieren|otp|passwort[^/]*|email-bestaetigen|zustimmung|vertragszustimmung)(\/|$)/;
export function indexNowPayload(origin: string, key: string, input: string[]) {
    const site = new URL(origin);
    if (
        site.protocol !== "https:" ||
        site.username ||
        site.password ||
        site.pathname !== "/" ||
        site.search ||
        site.hash ||
        /(^localhost$|\.vercel\.app$)/.test(site.hostname)
    )
        throw Error("Nur eine öffentliche HTTPS-Produktivdomain ist zulässig.");
    if (!/^indexnow-[a-f0-9]{32}$/.test(key))
        throw Error("Gültiger serverseitiger IndexNow-Schlüssel erforderlich.");
    const urls = [
        ...new Set(
            input.map((value) => {
                const url = new URL(value);
                if (
                    url.origin !== site.origin ||
                    url.search ||
                    url.hash ||
                    url.username ||
                    url.password ||
                    privatePath.test(url.pathname)
                )
                    throw Error(
                        "Private, fremde oder parameterisierte URLs werden nicht übermittelt.",
                    );
                return url.href;
            }),
        ),
    ];
    if (!urls.length || urls.length > 10000)
        throw Error(
            "Zwischen einer und 10.000 öffentlichen URLs erforderlich.",
        );
    return {
        host: site.host,
        key,
        keyLocation: new URL("/" + key + ".txt", site).href,
        urlList: urls,
    };
}
export async function sendIndexNow(
    payload: ReturnType<typeof indexNowPayload>,
    fetcher: typeof fetch = fetch,
) {
    const response = await fetcher("https://www.bing.com/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(30000),
    });
    if (response.status !== 200 && response.status !== 202)
        throw Error(
            "IndexNow hat die Übermittlung nicht angenommen (HTTP " +
                response.status +
                ").",
        );
    return {
        received: true,
        verificationPending: response.status === 202,
        indexed: false,
        status: response.status,
        urlCount: payload.urlList.length,
    };
}
