"use client";
import { useState, useEffect } from "react";
import { products, money, price, type ProductKey } from "@/server/config";
import { useRouter } from "next/navigation";

export function BookingForm({
    initial = "intro",
    video = false,
    packages = [],
    customers,
    serviceOrders = [],
    initialOrderId,
}: {
    initial?: ProductKey;
    video?: boolean;
    packages?: { id: string; label: string }[];
    customers?: { value: string; label: string }[];
    serviceOrders?: { id: string; label: string; userId?: string }[];
    initialOrderId?: string;
}) {
    const [product, setProduct] = useState<ProductKey>(
        initial === "project" &&
            serviceOrders.some((order) => order.id === initialOrderId)
            ? "project"
            : "intro",
    );
    const [minutes, setMinutes] = useState<number>(
        products[product].durations[0],
    );
    const [packageId, setPackageId] = useState("");
    const [serviceOrderId, setServiceOrderId] = useState(
        serviceOrders.some((order) => order.id === initialOrderId)
            ? initialOrderId!
            : "",
    );
    const [customerId, setCustomerId] = useState(customers?.[0]?.value ?? "");
    const [day, setDay] = useState(
        new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Berlin" }),
    );
    const [slots, setSlots] = useState<{ value: string; label: string }[]>([]);
    const [at, setAt] = useState("");
    const [message, setMessage] = useState("");
    const [busy, setBusy] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    useEffect(() => {
        let cancelled = false;
        fetch(`/api/slots?day=${day}&minutes=${minutes}`)
            .then((r) => r.json())
            .then((data) => {
                if (cancelled) return;
                if (Array.isArray(data)) setSlots(data);
                else {
                    setSlots([]);
                    setMessage(data.error);
                }
            })
            .catch(() =>
                setMessage("Verfügbarkeiten konnten nicht geladen werden."),
            )
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [day, minutes]);
    async function submit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setBusy(true);
        setMessage("");
        const data = new FormData(e.currentTarget);
        try {
            const response = await fetch(
                "/api/action/" + (customers ? "admin-booking" : "booking"),
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        product,
                        minutes,
                        packageId: packageId || undefined,
                        serviceOrderId: serviceOrderId || undefined,
                        userId: customers ? customerId : undefined,
                        startsAt: at,
                        channel: data.get("channel"),
                        terms: data.has("terms"),
                        earlyStart: data.has("earlyStart"),
                        withdrawalAcknowledged: data.has(
                            "withdrawalAcknowledged",
                        ),
                    }),
                },
            );
            const result = await response.json();
            if (!response.ok) throw new Error(result.error);
            router.push(customers ? "/admin/kalender" : "/konto/termine");
            router.refresh();
        } catch (e) {
            setMessage(
                e instanceof Error ? e.message : "Buchung fehlgeschlagen.",
            );
        } finally {
            setBusy(false);
        }
    }
    return (
        <form className="booking-form" onSubmit={submit}>
            <div className="booking-main">
                {serviceOrders.length > 0 && (
                    <div className="field">
                        <label htmlFor="service-order">
                            Bezahltes Leistungspaket
                        </label>
                        <select
                            id="service-order"
                            value={serviceOrderId}
                            onChange={(e) => {
                                setServiceOrderId(e.target.value);
                                setPackageId("");
                                setProduct(
                                    e.target.value ? "project" : "intro",
                                );
                                setMinutes(e.target.value ? 30 : 15);
                                setAt("");
                                setLoading(true);
                            }}
                        >
                            <option value="">Kostenloses Erstgespräch</option>
                            {serviceOrders
                                .filter(
                                    (order) =>
                                        !customers ||
                                        order.userId === customerId,
                                )
                                .map((order) => (
                                    <option key={order.id} value={order.id}>
                                        {order.label}
                                    </option>
                                ))}
                        </select>
                        <p>
                            Die Termindauer dient der Kalenderplanung. Für
                            enthaltene Projektgespräche wird kein zusätzlicher
                            Stundenpreis berechnet.
                        </p>
                    </div>
                )}
                {customers && (
                    <div className="field">
                        <label htmlFor="booking-customer">Kunde</label>
                        <select
                            id="booking-customer"
                            required
                            value={customerId}
                            onChange={(e) => {
                                setCustomerId(e.target.value);
                                setServiceOrderId("");
                                setPackageId("");
                                setProduct("intro");
                                setMinutes(15);
                                setAt("");
                                setLoading(true);
                            }}
                        >
                            {customers.map((c) => (
                                <option value={c.value} key={c.value}>
                                    {c.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                {packages.length > 0 && (
                    <div className="field">
                        <label htmlFor="booking-package">
                            Aus einem bestehenden Paket buchen
                        </label>
                        <select
                            id="booking-package"
                            value={packageId}
                            onChange={(e) => {
                                setPackageId(e.target.value);
                                setServiceOrderId("");
                                if (e.target.value) {
                                    setProduct("consultation");
                                    setMinutes(60);
                                    setLoading(true);
                                    setAt("");
                                }
                            }}
                        >
                            <option value="">Kostenloses Erstgespräch</option>
                            {packages.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                <div className="field">
                    <label htmlFor="product">Deine Beratung</label>
                    <select
                        id="product"
                        disabled={!!packageId || !!serviceOrderId}
                        value={product}
                        onChange={(e) => {
                            const value = e.target.value as ProductKey;
                            setProduct(value);
                            setMinutes(products[value].durations[0]);
                            setLoading(true);
                            setAt("");
                        }}
                    >
                        {Object.entries(products)
                            .filter(
                                ([key]) =>
                                    key === "intro" ||
                                    (key === "consultation" && !!packageId) ||
                                    (key === "project" && !!serviceOrderId),
                            )
                            .map(([key, p]) => (
                                <option key={key} value={key}>
                                    {p.name}
                                </option>
                            ))}
                    </select>
                </div>
                <div className="form-grid">
                    <div className="field">
                        <label htmlFor="day">Dein Datum</label>
                        <input
                            id="day"
                            type="date"
                            value={day}
                            onChange={(e) => {
                                setDay(e.target.value);
                                setLoading(true);
                                setAt("");
                            }}
                            required
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="duration">Dauer</label>
                        <select
                            id="duration"
                            value={minutes}
                            onChange={(e) => {
                                setMinutes(Number(e.target.value));
                                setLoading(true);
                                setAt("");
                            }}
                        >
                            {products[product].durations.map((m) => (
                                <option key={m} value={m}>
                                    {m} Minuten
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <fieldset>
                    <legend>Freie Startzeiten · Europe/Berlin</legend>
                    {loading ? (
                        <p role="status">Verfügbarkeit wird geprüft …</p>
                    ) : slots.length ? (
                        <div className="slots">
                            {slots.map((slot) => (
                                <label
                                    className={
                                        "slot " +
                                        (at === slot.value ? "selected" : "")
                                    }
                                    key={slot.value}
                                >
                                    <input
                                        type="radio"
                                        name="slot"
                                        value={slot.value}
                                        required
                                        checked={at === slot.value}
                                        onChange={() => setAt(slot.value)}
                                    />
                                    {slot.label}
                                </label>
                            ))}
                        </div>
                    ) : (
                        <p className="empty-state">
                            An diesem Tag gibt es keine passenden freien Zeiten.
                            Wähle bitte ein anderes Datum.
                        </p>
                    )}
                </fieldset>
                <div className="field">
                    <label htmlFor="channel">Wie möchtest Du sprechen?</label>
                    <select id="channel" name="channel">
                        <option value="phone">
                            Telefon · wir rufen Dich an
                        </option>
                        {video && product === "project" && serviceOrderId && (
                            <option value="video">
                                Video · im geschützten Raum
                            </option>
                        )}
                    </select>
                </div>
            </div>
            <aside className="booking-summary">
                <h2>{products[product].name}</h2>
                <p>{products[product].description}</p>
                {product === "project" ? (
                    <p className="notice my-4">
                        Im bereits bezahlten Paket enthalten. Die Buchung löst
                        keine weitere Zahlung aus. Für den Leistungsbeginn gilt
                        Dein angenommenes Angebot.
                    </p>
                ) : (
                    <div className="price-amount">
                        {money(packageId ? 0 : price(product, minutes))}
                        <span>
                            {packageId
                                ? "zusätzliche Zahlung · wird auf Dein Paket angerechnet"
                                : "Gesamtpreis"}
                        </span>
                    </div>
                )}
                <p>
                    {minutes} Minuten
                    {product === "project" || packageId
                        ? " · Enthaltener Pakettermin"
                        : product === "intro"
                          ? " · Kostenlos"
                          : " · Zahlung per Überweisung"}
                </p>
                <label className="check">
                    <input type="checkbox" name="terms" required />
                    <span>
                        Ich akzeptiere die{" "}
                        <a href="/agb" target="_blank">
                            AGB
                        </a>{" "}
                        und habe die{" "}
                        <a href="/widerrufsbelehrung" target="_blank">
                            Widerrufsbelehrung
                        </a>{" "}
                        gelesen.
                    </span>
                </label>
                {product !== "intro" && product !== "project" && !packageId && (
                    <>
                        <label className="check">
                            <input type="checkbox" name="earlyStart" />
                            <span>
                                Ich verlange ausdrücklich den Beginn der
                                Dienstleistung vor Ablauf der Widerrufsfrist,
                                sofern mein Termin darin liegt.
                            </span>
                        </label>
                        <label className="check">
                            <input
                                type="checkbox"
                                name="withdrawalAcknowledged"
                            />
                            <span>
                                Mir ist bekannt, dass das Widerrufsrecht bei
                                vollständiger Vertragserfüllung unter den
                                gesetzlichen Voraussetzungen erlischt und bei
                                vorherigem Widerruf gegebenenfalls anteiliger
                                Wertersatz geschuldet ist.
                            </span>
                        </label>
                        <p className="small-note">
                            Reservierung höchstens 48 Stunden oder bis zum
                            früheren Terminbeginn. Bestätigung nach geprüftem
                            Zahlungseingang.
                        </p>
                    </>
                )}
                <button className="button primary" disabled={busy || !at}>
                    {busy
                        ? "Wird gebucht …"
                        : packageId
                          ? "Termin aus Paket verbindlich buchen"
                          : product === "intro"
                            ? "Kostenlos verbindlich buchen"
                            : product === "project"
                              ? "Enthaltenen Termin buchen"
                              : "Zahlungspflichtig bestellen"}{" "}
                    ↗
                </button>
                {message && (
                    <p role="alert" className="form-error">
                        {message}
                    </p>
                )}
            </aside>
        </form>
    );
}
