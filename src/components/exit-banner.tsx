"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const storageKey = "avelsorn-exit-shown";
let shownInTab = false;
const eligible = (path: string) =>
    [
        "/",
        "/preise",
        "/ablauf",
        "/ueber-mich",
        "/beruflich-neu-starten",
    ].includes(path) || /^\/(leistungen|zielgruppen|blog)(\/|$)/.test(path);

export function ExitBanner() {
    const pathname = usePathname();
    return eligible(pathname) ? <PageExitBanner key={pathname} /> : null;
}

function PageExitBanner() {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        try {
            if (shownInTab || sessionStorage.getItem(storageKey)) return;
        } catch {
            if (shownInTab) return;
        }
        const started = Date.now();
        const compact = () =>
            matchMedia("(max-width: 700px), (hover: none), (pointer: coarse)")
                .matches;
        let deepest = window.scrollY;
        let peak = window.scrollY;
        const show = () => {
            if (
                shownInTab ||
                Date.now() - started < 20_000 ||
                document.visibilityState !== "visible"
            )
                return;
            if (
                document.querySelector(
                    ".consent, dialog[open], .mobile-menu[open]",
                )
            )
                return;
            if (
                document.activeElement?.matches(
                    "input, textarea, select, [contenteditable=true]",
                )
            )
                return;
            shownInTab = true;
            try {
                sessionStorage.setItem(storageKey, "1");
            } catch {
                /* In-memory fallback for this tab. */
            }
            setOpen(true);
        };
        const leave = (event: MouseEvent) => {
            if (
                !compact() &&
                matchMedia("(hover: hover) and (pointer: fine)").matches &&
                event.relatedTarget === null &&
                event.clientY <= 0
            )
                show();
        };
        const scroll = () => {
            const y = window.scrollY;
            deepest = Math.max(deepest, y);
            if (!compact()) return;
            const readable =
                document.documentElement.scrollHeight - window.innerHeight;
            if (y > peak) peak = y;
            if (readable > 500 && deepest >= readable * 0.5 && peak - y >= 240)
                show();
        };
        document.addEventListener("mouseout", leave);
        window.addEventListener("scroll", scroll, { passive: true });
        return () => {
            document.removeEventListener("mouseout", leave);
            window.removeEventListener("scroll", scroll);
        };
    }, []);

    useEffect(() => {
        if (!open) return;
        const escape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setOpen(false);
        };
        const settings = () => setOpen(false);
        window.addEventListener("keydown", escape);
        window.addEventListener("consent-settings", settings);
        return () => {
            window.removeEventListener("keydown", escape);
            window.removeEventListener("consent-settings", settings);
        };
    }, [open]);

    if (!open) return null;
    return (
        <aside
            className="exit-banner"
            aria-labelledby="exit-banner-title"
            aria-live="polite"
        >
            <button
                type="button"
                className="exit-banner-close"
                aria-label="Hinweis schließen"
                onClick={() => setOpen(false)}
            >
                ×
            </button>
            <h2 id="exit-banner-title">Deine Aufgabe kurz besprechen</h2>
            <p>
                Wenn Du noch Fragen hast: Im kostenlosen Erstgespräch klären
                wir, wobei ich Dich unterstützen kann. 15 Minuten, ohne
                kostenpflichtige Beauftragung.
            </p>
            <Link
                className="button primary"
                href="/erstgespraech"
                onClick={() => setOpen(false)}
            >
                Erstgespräch vereinbaren ↗
            </Link>
            <button
                type="button"
                className="text-button"
                onClick={() => setOpen(false)}
            >
                Weiterlesen
            </button>
        </aside>
    );
}
