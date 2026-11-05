"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
export function RescheduleForm({
    id,
    minutes,
}: {
    id: string;
    minutes: number;
}) {
    const [day, setDay] = useState(
        new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Berlin" }),
    );
    const [slots, setSlots] = useState<{ value: string; label: string }[]>([]);
    const [at, setAt] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const router = useRouter();
    useEffect(() => {
        if (!day) return;
        const controller = new AbortController();
        fetch(`/api/slots?day=${day}&minutes=${minutes}`, {
            signal: controller.signal,
        })
            .then(async (r) => {
                const data = await r.json();
                if (!r.ok) throw Error(data.error);
                return data;
            })
            .then((data) => {
                if (Array.isArray(data)) setSlots(data);
                else setMessage(data.error);
            })
            .catch((e) => {
                if (!controller.signal.aborted)
                    setMessage(
                        e instanceof Error
                            ? e.message
                            : "Freie Zeiten konnten nicht geladen werden.",
                    );
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false);
            });
        return () => controller.abort();
    }, [day, minutes]);
    async function save(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!at || busy) return;
        setBusy(true);
        setMessage("");
        try {
            const response = await fetch("/api/action/booking-change", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id,
                    action: "reschedule",
                    startsAt: at,
                }),
            });
            const result = await response.json();
            setMessage(
                result.error ??
                    "Dein Termin wurde verschoben. Die Kalendereinladung ist aktualisiert.",
            );
            if (response.ok) router.refresh();
        } catch {
            setMessage(
                "Die Verbindung ist unterbrochen. Bitte versuche es erneut.",
            );
        } finally {
            setBusy(false);
        }
    }
    return (
        <details className="mt-3">
            <summary className="cursor-pointer underline">
                Termin verschieben
            </summary>
            <form className="action-form mt-4 min-w-52" onSubmit={save}>
                <div className="field">
                    <label htmlFor={"reschedule-day-" + id}>Neues Datum</label>
                    <input
                        id={"reschedule-day-" + id}
                        type="date"
                        value={day}
                        onChange={(e) => {
                            setDay(e.target.value);
                            setAt("");
                            setSlots([]);
                            setMessage("");
                            setLoading(Boolean(e.target.value));
                        }}
                        disabled={busy}
                        required
                    />
                </div>
                <div className="field">
                    <label htmlFor={"reschedule-time-" + id}>
                        Freier Beginn · Europe/Berlin
                    </label>
                    <select
                        id={"reschedule-time-" + id}
                        value={at}
                        onChange={(e) => setAt(e.target.value)}
                        required
                        disabled={loading || busy || !day}
                    >
                        <option value="">
                            {loading
                                ? "Freie Zeiten werden geladen …"
                                : "Startzeit auswählen"}
                        </option>
                        {slots.map((s) => (
                            <option value={s.value} key={s.value}>
                                {s.label}
                            </option>
                        ))}
                    </select>
                </div>
                <button className="button" disabled={!at || busy || loading}>
                    Verschiebung bestätigen ↗
                </button>
                {message && <p role="status">{message}</p>}
            </form>
        </details>
    );
}
