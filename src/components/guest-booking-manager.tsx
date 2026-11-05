"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Booking = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    topic: string;
    startsAt: string;
    endsAt: string;
    status: string;
    sequence: number;
};
export function GuestBookingManager({
    businessPhone,
}: {
    businessPhone: string;
}) {
    const [now, setNow] = useState(0);
    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [busy, setBusy] = useState(false);
    const [day, setDay] = useState("");
    const [slots, setSlots] = useState<{ value: string; label: string }[]>([]);
    const [at, setAt] = useState("");
    const [slotsLoading, setSlotsLoading] = useState(false);
    const initialRequest = useRef<Promise<Response> | null>(null);
    useEffect(() => {
        let active = true;
        const timer = setInterval(() => setNow(Date.now()), 15000);
        const frame = requestAnimationFrame(() => setNow(Date.now()));
        // Fragments never reach HTTP logs or referrer headers. Remove before any fetch.
        if (!initialRequest.current) {
            const token = new URLSearchParams(location.hash.slice(1)).get(
                "zugang",
            );
            if (location.hash)
                history.replaceState(null, "", location.pathname);
            initialRequest.current = token
                ? fetch("/api/guest-bookings", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ operation: "access", token }),
                  })
                : fetch("/api/guest-bookings", { cache: "no-store" });
        }
        initialRequest.current
            .then(async (r) => {
                const data = await r.clone().json();
                if (!r.ok) throw Error(data.error);
                if (active) setBooking(data.booking);
            })
            .catch((e) => {
                if (active)
                    setMessage(
                        e instanceof Error
                            ? e.message
                            : "Die Termindaten konnten nicht geladen werden.",
                    );
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
            clearInterval(timer);
            cancelAnimationFrame(frame);
        };
    }, []);
    useEffect(() => {
        if (!day) return;
        const controller = new AbortController();
        fetch("/api/slots?public=1&day=" + day, {
            signal: controller.signal,
            cache: "no-store",
        })
            .then(async (r) => {
                const data = await r.json();
                if (!r.ok) throw Error(data.error);
                setSlots(data);
            })
            .catch((e) => {
                if (!controller.signal.aborted) setMessage(e.message);
            })
            .finally(() => {
                if (!controller.signal.aborted) setSlotsLoading(false);
            });
        return () => controller.abort();
    }, [day]);
    async function change(action: "cancel" | "reschedule") {
        if (!booking || busy) return;
        setBusy(true);
        setMessage("");
        try {
            const r = await fetch("/api/guest-bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    operation: "change",
                    action,
                    startsAt: action === "reschedule" ? at : undefined,
                    sequence: booking.sequence,
                }),
            });
            const data = await r.json();
            if (!r.ok) {
                const fresh = await fetch("/api/guest-bookings", {
                    cache: "no-store",
                });
                if (fresh.ok) setBooking((await fresh.json()).booking);
                throw Error(data.error);
            }
            setBooking(data.booking);
            setMessage(
                action === "cancel"
                    ? "Dein Termin wurde abgesagt. Du erhältst eine E-Mail zur Bestätigung."
                    : "Dein Termin wurde verschoben. Du erhältst eine aktualisierte Bestätigung per E-Mail.",
            );
            setAt("");
            setDay("");
            setSlots([]);
        } catch (e) {
            setMessage(
                e instanceof Error
                    ? e.message
                    : "Die Änderung konnte nicht gespeichert werden.",
            );
        } finally {
            setBusy(false);
        }
    }
    if (loading) return <p role="status">Dein Termin wird geladen …</p>;
    if (!booking)
        return (
            <section className="quiet-panel">
                <h2>Geschützten Termin öffnen</h2>
                <p role="status">
                    {message ||
                        "Öffne bitte den Zugangslink aus Deiner Bestätigungs-E-Mail."}
                </p>
                <p>
                    Du erreichst uns bei Rückfragen unter{" "}
                    <a href={"tel:" + businessPhone.replace(/[^+\d]/g, "")}>
                        {businessPhone}
                    </a>
                    .
                </p>
                <Link className="arrow-link" href="/kalender">
                    Zur Terminauswahl ↗
                </Link>
            </section>
        );
    const date = new Intl.DateTimeFormat("de-DE", {
        dateStyle: "full",
        timeStyle: "short",
        timeZone: "Europe/Berlin",
    }).format(new Date(booking.startsAt));
    const editable =
        booking.status === "confirmed" && Date.parse(booking.startsAt) > now;
    return (
        <section className="quiet-panel guest-confirmation">
            <h2>
                {booking.status === "cancelled"
                    ? "Dein Termin ist abgesagt"
                    : booking.status === "completed"
                      ? "Dein Erstgespräch ist abgeschlossen"
                      : "Dein Erstgespräch ist bestätigt"}
            </h2>
            <p>
                <strong>{date} Uhr</strong>
                <br />
                15 Minuten · Telefonisch · Europe/Berlin · 0 €
            </p>
            {booking.status === "confirmed" && (
                <p>Ich melde mich zum gebuchten Termin telefonisch bei Dir.</p>
            )}
            <dl>
                <dt>Name</dt>
                <dd>
                    {booking.firstName} {booking.lastName}
                </dd>
                <dt>Deine Telefonnummer</dt>
                <dd>{booking.phone}</dd>
                <dt>E-Mail für die Bestätigung</dt>
                <dd>{booking.email}</dd>
                <dt>Dein Anliegen</dt>
                <dd>{booking.topic}</dd>
            </dl>
            <p>
                Du erreichst mich bei Rückfragen unter{" "}
                <a href={"tel:" + businessPhone.replace(/[^+\d]/g, "")}>
                    {businessPhone}
                </a>
                . Bewahre Deine Bestätigungs-E-Mail mit dem persönlichen
                Zugangslink auf und gib ihn nicht weiter.
            </p>
            {editable && (
                <div className="guest-management">
                    <details>
                        <summary>Termin verschieben</summary>
                        <form
                            className="action-form"
                            onSubmit={(e) => {
                                e.preventDefault();
                                void change("reschedule");
                            }}
                        >
                            <label>
                                Neues Datum
                                <input
                                    type="date"
                                    value={day}
                                    min={new Intl.DateTimeFormat("en-CA", {
                                        timeZone: "Europe/Berlin",
                                    }).format(new Date())}
                                    required
                                    onChange={(e) => {
                                        setDay(e.target.value);
                                        setAt("");
                                        setSlots([]);
                                        setSlotsLoading(
                                            Boolean(e.target.value),
                                        );
                                    }}
                                />
                            </label>
                            <label>
                                Freie Uhrzeit · Europe/Berlin
                                <select
                                    required
                                    value={at}
                                    onChange={(e) => setAt(e.target.value)}
                                    disabled={!day || slotsLoading || busy}
                                >
                                    <option value="">
                                        {slotsLoading
                                            ? "Freie Zeiten werden geladen …"
                                            : "Uhrzeit auswählen"}
                                    </option>
                                    {slots.map((slot) => (
                                        <option
                                            value={slot.value}
                                            key={slot.value}
                                        >
                                            {slot.label}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <button
                                className="button"
                                disabled={!at || busy || slotsLoading}
                            >
                                Verschiebung bestätigen
                            </button>
                            {day && !slotsLoading && !slots.length && (
                                <p>
                                    Keine freien Zeiten. Bitte wähle ein anderes
                                    Datum.
                                </p>
                            )}
                        </form>
                    </details>
                    <details>
                        <summary>Termin absagen</summary>
                        <p>Möchtest Du den Telefontermin absagen?</p>
                        <button
                            className="button"
                            disabled={busy}
                            onClick={() => void change("cancel")}
                        >
                            Absage bestätigen
                        </button>
                    </details>
                </div>
            )}
            {message && (
                <p role="status" className="calendar-message">
                    {message}
                </p>
            )}
            <Link href="/" className="arrow-link">
                Zur Startseite ↗
            </Link>
        </section>
    );
}
