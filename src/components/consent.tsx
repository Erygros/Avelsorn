"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Consent({ initialChoice }: { initialChoice: string | null }) {
    const [open, setOpen] = useState(initialChoice === null);
    const [statistics, setStatistics] = useState(
        initialChoice === "statistics",
    );
    const [error, setError] = useState("");
    const pathname = usePathname();
    const tracked = useRef("");
    useEffect(() => {
        if (!statistics || open || tracked.current === pathname) return;
        tracked.current = pathname;
        fetch("/api/statistics", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ path: pathname }),
        }).catch(() => {});
    }, [statistics, open, pathname]);
    useEffect(() => {
        const listener = () => setOpen(true);
        window.addEventListener("consent-settings", listener);
        return () => window.removeEventListener("consent-settings", listener);
    }, []);
    async function save(value: boolean) {
        try {
            const response = await fetch("/api/action/consent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ statistics: value }),
            });
            if (response.ok) {
                setStatistics(value);
                setOpen(false);
            } else
                setError(
                    "Die Auswahl konnte nicht gespeichert werden. Bitte versuche es erneut.",
                );
        } catch {
            setError(
                "Die Verbindung ist unterbrochen. Deine Auswahl wurde noch nicht gespeichert.",
            );
        }
    }
    if (!open) return null;
    return (
        <aside className="consent" aria-label="Cookie-Einstellungen">
            <div>
                <h2>Cookie-Einstellungen</h2>
                <p>
                    Notwendige Cookies ermöglichen Anmeldung und Sicherheit.
                    Optionale, eigene Besucherstatistiken aktivieren wir nur mit
                    Deiner Zustimmung.
                </p>
                <label className="check">
                    <input
                        type="checkbox"
                        checked={statistics}
                        onChange={(e) => setStatistics(e.target.checked)}
                    />{" "}
                    Optionale Besucherstatistiken
                </label>
                <Link href="/datenschutz">Datenschutzhinweise lesen</Link>
                {error && <p role="alert">{error}</p>}
            </div>
            <div className="consent-actions">
                <button className="button" onClick={() => save(false)}>
                    Ablehnen
                </button>
                <button className="button" onClick={() => save(statistics)}>
                    Auswahl speichern
                </button>
                <button className="button primary" onClick={() => save(true)}>
                    Zustimmen
                </button>
            </div>
        </aside>
    );
}
export function ConsentButton() {
    return (
        <button
            className="text-button"
            onClick={() => window.dispatchEvent(new Event("consent-settings"))}
        >
            Cookie-Einstellungen
        </button>
    );
}
