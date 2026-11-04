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
    const router = useRouter();
    useEffect(() => {
        const controller = new AbortController();
        fetch(`/api/slots?day=${day}&minutes=${minutes}`, {
            signal: controller.signal,
        })
            .then((r) => r.json())
            .then((data) => {
                if (Array.isArray(data)) setSlots(data);
                else setMessage(data.error);
            })
            .catch(() => {});
        return () => controller.abort();
    }, [day, minutes]);
    async function save(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const response = await fetch("/api/action/booking-change", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, action: "reschedule", startsAt: at }),
        });
        const result = await response.json();
        setMessage(
            result.error ??
                "Dein Termin wurde verschoben. Die Kalendereinladung ist aktualisiert.",
        );
        if (response.ok) router.refresh();
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
                        }}
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
                    >
                        <option value="">Startzeit auswählen</option>
                        {slots.map((s) => (
                            <option value={s.value} key={s.value}>
                                {s.label}
                            </option>
                        ))}
                    </select>
                </div>
                <button className="button" disabled={!at}>
                    Verschiebung bestätigen ↗
                </button>
                {message && <p role="status">{message}</p>}
            </form>
        </details>
    );
}
