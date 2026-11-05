import { describe, expect, it, vi } from "vitest";
import { indexNowPayload, sendIndexNow } from "../src/server/indexnow";
const key = "indexnow-" + "ab".repeat(16);
describe("Kontrollierte IndexNow-Übermittlung", () => {
    it("erzeugt einen deduplizierten Payload mit passender Schlüsseldatei", () => {
        const payload = indexNowPayload("https://example.test", key, [
            "https://example.test/",
            "https://example.test/wissen/briefing",
            "https://example.test/",
        ]);
        expect(payload.host).toBe("example.test");
        expect(payload.urlList).toHaveLength(2);
        expect(payload.keyLocation).toBe(
            "https://example.test/" + key + ".txt",
        );
    });
    it("weist Preview, private Ziele und personenbezogene Parameter ab", () => {
        for (const origin of [
            "http://example.test",
            "https://localhost",
            "https://demo.vercel.app",
            "https://example.test/unterordner",
        ])
            expect(() => indexNowPayload(origin, key, [origin])).toThrow();
        for (const url of [
            "https://foreign.test/",
            "https://example.test/admin",
            "https://example.test/konto/dateien",
            "https://example.test/api/files",
            "https://example.test/kalender/gast",
            "https://example.test/anmelden",
            "https://example.test/?token=private",
            "https://example.test/#zugang=private",
        ])
            expect(() =>
                indexNowPayload("https://example.test", key, [url]),
            ).toThrow();
    });
    it("blockiert leere oder übergroße Meldungen und ungeeignete Schlüssel", () => {
        expect(() =>
            indexNowPayload("https://example.test", key, []),
        ).toThrow();
        expect(() =>
            indexNowPayload(
                "https://example.test",
                key,
                Array.from(
                    { length: 10001 },
                    (_, i) => "https://example.test/seite-" + i,
                ),
            ),
        ).toThrow();
        expect(() =>
            indexNowPayload("https://example.test", "../secret", [
                "https://example.test/",
            ]),
        ).toThrow();
    });
    it("meldet Empfang und ausstehende Verifizierung, niemals eine erwiesene Indexierung", async () => {
        const payload = indexNowPayload("https://example.test", key, [
            "https://example.test/",
        ]);
        const request = vi
            .fn<typeof fetch>()
            .mockResolvedValue(new Response(null, { status: 202 }));
        expect(await sendIndexNow(payload, request)).toMatchObject({
            received: true,
            verificationPending: true,
            indexed: false,
            status: 202,
        });
        expect(request).toHaveBeenCalledWith(
            "https://www.bing.com/indexnow",
            expect.objectContaining({
                method: "POST",
                body: JSON.stringify(payload),
            }),
        );
        request.mockResolvedValueOnce(new Response(null, { status: 200 }));
        expect(await sendIndexNow(payload, request)).toMatchObject({
            received: true,
            verificationPending: false,
            indexed: false,
        });
    });
    it("gibt API-Fehler nicht als erfolgreiche Übermittlung aus", async () => {
        const payload = indexNowPayload("https://example.test", key, [
            "https://example.test/",
        ]);
        const request = vi
            .fn<typeof fetch>()
            .mockResolvedValue(new Response(null, { status: 429 }));
        await expect(sendIndexNow(payload, request)).rejects.toThrow(
            "HTTP 429",
        );
    });
});
