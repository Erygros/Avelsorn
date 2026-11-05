"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Contact = {
    name: string;
    email: string;
    phone: string;
    company: string;
    verified: boolean;
    admin: boolean;
};
const dayKey = (date: Date) =>
    new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Berlin" }).format(
        date,
    );
const addDay = (day: string, amount: number) =>
    new Date(new Date(day + "T12:00:00Z").getTime() + amount * 86400000)
        .toISOString()
        .slice(0, 10);
function rememberSlot(value: string | null) {
    try {
        if (value) localStorage.setItem("avelsorn-intro-slot", value);
        else localStorage.removeItem("avelsorn-intro-slot");
    } catch {
        /* Booking still works when browser storage is unavailable. */
    }
}
export function PublicCalendar({ user }: { user: Contact | null }) {
    const router = useRouter();
    const today = dayKey(new Date());
    const [day, setDay] = useState(today);
    const [month, setMonth] = useState(today.slice(0, 7));
    const [slots, setSlots] = useState<{ value: string; label: string }[]>([]);
    const [selected, setSelected] = useState("");
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState("");
    const requestId = useRef<string | null>(null);
    useEffect(() => {
        const frame = requestAnimationFrame(() => {
            let saved: string | null = null;
            try {
                saved = localStorage.getItem("avelsorn-intro-slot");
            } catch {
                return;
            }
            if (
                saved &&
                Number.isFinite(Date.parse(saved)) &&
                new Date(saved) > new Date()
            ) {
                const key = dayKey(new Date(saved));
                setDay(key);
                setMonth(key.slice(0, 7));
                setSelected(saved);
            } else if (saved) rememberSlot(null);
        });
        return () => cancelAnimationFrame(frame);
    }, []);
    useEffect(() => {
        let active = true;
        let pending = false;
        const controller = new AbortController();
        const refresh = () => {
            if (pending || document.hidden) return;
            pending = true;
            fetch("/api/slots?public=1&day=" + day, {
                cache: "no-store",
                signal: controller.signal,
            })
                .then(async (r) => {
                    const data = await r.json();
                    if (!r.ok) throw Error(data.error);
                    if (active) {
                        setSlots(data);
                        setLoading(false);
                    }
                })
                .catch((e) => {
                    if (active) {
                        setMessage(e.message);
                        setLoading(false);
                    }
                })
                .finally(() => {
                    pending = false;
                });
        };
        refresh();
        const timer = window.setInterval(refresh, 30000);
        window.addEventListener("focus", refresh);
        return () => {
            active = false;
            controller.abort();
            window.clearInterval(timer);
            window.removeEventListener("focus", refresh);
        };
    }, [day]);
    const chooseDay = (value: string) => {
        setDay(value);
        setSelected("");
        if (value !== day) setLoading(true);
        setMessage("");
        rememberSlot(null);
    };
    const chooseSlot = (value: string) => {
        requestId.current = null;
        setSelected(value);
        rememberSlot(value);
        setMessage("");
    };
    const first = month + "-01";
    const offset = (new Date(first + "T12:00:00Z").getUTCDay() + 6) % 7;
    const days = new Date(
        Number(month.slice(0, 4)),
        Number(month.slice(5)),
        0,
    ).getDate();
    async function submit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setBusy(true);
        setMessage("");
        const form = new FormData(event.currentTarget);
        const val = (name: string) => String(form.get(name) ?? "");
        try {
            if (!requestId.current) requestId.current = crypto.randomUUID();
            {
                const r = await fetch(
                    user ? "/api/action/intro-booking" : "/api/guest-bookings",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            operation: "book",
                            requestId: requestId.current,
                            email: val("email"),
                            website: val("website"),
                            firstName: val("firstName"),
                            lastName: val("lastName"),
                            phone: val("phone"),
                            topic: val("topic"),
                            startsAt: selected,
                            terms: form.has("terms"),
                            details: {
                                firstName: val("firstName"),
                                lastName: val("lastName"),
                                phone: val("phone"),
                                company: val("company"),
                                topic: val("topic"),
                            },
                        }),
                    },
                );
                const data = await r.json();
                if (!r.ok) {
                    if (r.status === 409) {
                        setLoading(true);
                        setDay(day);
                        const fresh = await fetch(
                            "/api/slots?public=1&day=" + day,
                        );
                        if (fresh.ok) setSlots(await fresh.json());
                        setLoading(false);
                        setSelected("");
                        rememberSlot(null);
                    }
                    throw Error(data.error);
                }
                rememberSlot(null);
                router.push(
                    user
                        ? "/kalender/bestaetigt?id=" + data.id
                        : "/kalender/gast",
                );
                router.refresh();
            }
        } catch (e) {
            setMessage(
                e instanceof Error ? e.message : "Bitte versuche es erneut.",
            );
        } finally {
            setBusy(false);
        }
    }
    return (
        <div className="appointment-layout">
            <section className="calendar-picker" aria-label="Termin auswählen">
                <div className="calendar-toolbar">
                    <button
                        className="button small"
                        type="button"
                        aria-label="Vorheriger Monat"
                        disabled={month <= today.slice(0, 7)}
                        onClick={() => {
                            const d = addDay(first, -1);
                            setMonth(d.slice(0, 7));
                        }}
                    >
                        ←
                    </button>
                    <h2 aria-live="polite">
                        {new Intl.DateTimeFormat("de-DE", {
                            month: "long",
                            year: "numeric",
                            timeZone: "UTC",
                        }).format(new Date(first + "T12:00:00Z"))}
                    </h2>
                    <button
                        className="button small"
                        type="button"
                        aria-label="Nächster Monat"
                        onClick={() =>
                            setMonth(addDay(first, days).slice(0, 7))
                        }
                    >
                        →
                    </button>
                </div>
                <div className="month-picker">
                    {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((d) => (
                        <span
                            className="weekday-label"
                            key={d}
                            aria-hidden="true"
                        >
                            {d}
                        </span>
                    ))}
                    {Array.from({ length: offset }, (_, i) => (
                        <span key={"empty" + i} />
                    ))}
                    {Array.from({ length: days }, (_, i) => {
                        const value =
                            month + "-" + String(i + 1).padStart(2, "0");
                        return (
                            <button
                                key={value}
                                type="button"
                                aria-pressed={day === value}
                                disabled={value < today}
                                onClick={() => chooseDay(value)}
                                aria-label={new Intl.DateTimeFormat("de-DE", {
                                    dateStyle: "full",
                                    timeZone: "UTC",
                                }).format(new Date(value + "T12:00Z"))}
                            >
                                {i + 1}
                            </button>
                        );
                    })}
                </div>
                <h3>
                    {new Intl.DateTimeFormat("de-DE", {
                        dateStyle: "full",
                        timeZone: "UTC",
                    }).format(new Date(day + "T12:00Z"))}
                </h3>
                <p className="calendar-timezone">
                    15 Minuten · Telefonisch · Europe/Berlin
                </p>
                <div
                    className="slot-grid"
                    aria-busy={loading}
                    aria-label="Verfügbare Startzeiten"
                >
                    {loading ? (
                        <p role="status">Freie Zeiten werden geladen …</p>
                    ) : slots.length ? (
                        slots.map((slot) => (
                            <button
                                type="button"
                                key={slot.value}
                                className="button"
                                aria-pressed={selected === slot.value}
                                onClick={() => chooseSlot(slot.value)}
                            >
                                {slot.label}
                            </button>
                        ))
                    ) : (
                        <p>
                            Für diesen Tag sind keine freien Zeiten verfügbar.
                        </p>
                    )}
                </div>
            </section>
            <section className="calendar-details" aria-label="Buchungsdaten">
                <h2>{selected ? "Dein Erstgespräch" : "Wähle einen Termin"}</h2>
                {selected && (
                    <p className="selected-appointment">
                        {new Intl.DateTimeFormat("de-DE", {
                            dateStyle: "long",
                            timeStyle: "short",
                            timeZone: "Europe/Berlin",
                        }).format(new Date(selected))}{" "}
                        Uhr
                    </p>
                )}
                {!selected ? (
                    <p>Wähle einen Tag und eine freie Uhrzeit.</p>
                ) : user?.admin ? (
                    <p>
                        Termine für Kunden legst Du im{" "}
                        <Link href="/admin/kalender">Admin-Kalender</Link> an.
                    </p>
                ) : (
                    <form onSubmit={submit} className="action-form">
                        {!user && (
                            <p>
                                Du kannst ohne Kundenkonto buchen. Du hast
                                bereits ein Konto?{" "}
                                <Link href="/anmelden?next=/kalender">
                                    Anmelden
                                </Link>
                            </p>
                        )}
                        {
                            <>
                                <div className="form-row">
                                    <label>
                                        Vorname
                                        <input
                                            name="firstName"
                                            autoComplete="given-name"
                                            required
                                            defaultValue={
                                                user?.name.split(" ")[0]
                                            }
                                            maxLength={50}
                                        />
                                    </label>
                                    <label>
                                        Nachname
                                        <input
                                            name="lastName"
                                            autoComplete="family-name"
                                            required
                                            defaultValue={user?.name
                                                .split(" ")
                                                .slice(1)
                                                .join(" ")}
                                            maxLength={80}
                                        />
                                    </label>
                                </div>
                                {user ? (
                                    <p>E-Mail-Adresse: {user.email}</p>
                                ) : (
                                    <label>
                                        E-Mail-Adresse
                                        <input
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            maxLength={254}
                                        />
                                    </label>
                                )}
                                <label>
                                    Telefonnummer
                                    <input
                                        name="phone"
                                        type="tel"
                                        autoComplete="tel"
                                        required
                                        defaultValue={user?.phone}
                                        maxLength={30}
                                    />
                                </label>
                                {user && (
                                    <label>
                                        Unternehmen (optional)
                                        <input
                                            name="company"
                                            autoComplete="organization"
                                            defaultValue={user.company}
                                            maxLength={200}
                                        />
                                    </label>
                                )}
                                <label>
                                    Dein Anliegen
                                    <textarea
                                        name="topic"
                                        required
                                        minLength={3}
                                        maxLength={2000}
                                        rows={4}
                                    />
                                </label>
                                {!user && (
                                    <label
                                        className="guest-honeypot"
                                        aria-hidden="true"
                                    >
                                        Website
                                        <input
                                            name="website"
                                            tabIndex={-1}
                                            autoComplete="off"
                                        />
                                    </label>
                                )}
                                <label className="check">
                                    <input
                                        name="terms"
                                        type="checkbox"
                                        required
                                    />
                                    Ich bestätige den kostenlosen Telefontermin
                                    und habe die{" "}
                                    <Link href="/datenschutz">
                                        Datenschutzhinweise
                                    </Link>{" "}
                                    gelesen.
                                </label>
                                {user && !user.verified && (
                                    <p role="status">
                                        Bestätige zuerst Deine E-Mail-Adresse.
                                        Lade diese Seite danach neu.
                                    </p>
                                )}
                                <button
                                    className="button primary"
                                    disabled={
                                        busy || Boolean(user && !user.verified)
                                    }
                                >
                                    {busy
                                        ? "Termin wird gebucht …"
                                        : "Kostenlosen Termin verbindlich buchen"}
                                </button>
                            </>
                        }
                    </form>
                )}
                {message && (
                    <p role="status" className="calendar-message">
                        {message}
                    </p>
                )}
            </section>
        </div>
    );
}
