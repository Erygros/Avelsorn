"use client";
import { useState } from "react";
import { products, money, price, type ProductKey } from "@/server/config";
export function GuardianRequests() {
    const [product, setProduct] = useState<ProductKey>("consultation");
    const [minutes, setMinutes] = useState(60);
    const [message, setMessage] = useState("");
    async function send(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const response = await fetch("/api/action/guardian-contract-request", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                product,
                minutes: ["package12", "unlimited"].includes(product)
                    ? undefined
                    : minutes,
            }),
        });
        const result = await response.json();
        setMessage(result.error ?? result.message);
    }
    return (
        <section className="panel mt-6">
            <h2 className="mb-5 text-3xl">
                Zustimmung zu einer konkreten Bestellung
            </h2>
            <p className="mb-5">
                Unter 18 Jahren benötigen wir eine ausdrückliche und geprüfte
                Vertretung für die konkrete kostenpflichtige Bestellung. Die
                Freigabe gilt einmalig und sieben Tage. Sie bestellt noch keine
                Leistung und löst keine Zahlung aus.
            </p>
            <form className="action-form" onSubmit={send}>
                <div className="field">
                    <label htmlFor="guardian-product">
                        Gewünschte Leistung
                    </label>
                    <select
                        id="guardian-product"
                        value={product}
                        onChange={(e) => {
                            const value = e.target.value as ProductKey;
                            setProduct(value);
                            setMinutes(products[value].durations[0]);
                        }}
                    >
                        {Object.entries(products)
                            .filter(([key]) => key !== "intro")
                            .map(([key, p]) => (
                                <option key={key} value={key}>
                                    {p.name}
                                </option>
                            ))}
                    </select>
                </div>
                {!["package12", "unlimited"].includes(product) && (
                    <div className="field">
                        <label htmlFor="guardian-duration">Dauer</label>
                        <select
                            id="guardian-duration"
                            value={minutes}
                            onChange={(e) => setMinutes(Number(e.target.value))}
                        >
                            {products[product].durations.map((m) => (
                                <option key={m} value={m}>
                                    {m} Minuten
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                <p>
                    Gesamtpreis:{" "}
                    <strong>{money(price(product, minutes))}</strong>
                    <br />
                    {products[product].description}
                </p>
                <button className="button primary">
                    Konkrete Zustimmung anfordern ↗
                </button>
                {message && <p role="status">{message}</p>}
            </form>
        </section>
    );
}
