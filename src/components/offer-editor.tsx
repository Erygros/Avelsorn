"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { money } from "@/server/config";
import {
    servicePackages,
    findServicePackage,
} from "@/content/service-packages";
export function OfferEditor({
    customers,
    initial,
}: {
    customers: { value: string; label: string }[];
    initial?: {
        id: string;
        kind: string;
        userId: string;
        description: string;
        items: { description: string; quantity: number; unitCents: number }[];
    };
}) {
    const [items, setItems] = useState(
        initial?.items ?? [{ description: "", quantity: 1, unitCents: 0 }],
    );
    const [message, setMessage] = useState("");
    const [catalogKey, setCatalogKey] = useState("");
    const [busy, setBusy] = useState(false);
    const router = useRouter();
    async function save(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setBusy(true);
        const form = new FormData(e.currentTarget);
        try {
            const response = await fetch(
                "/api/action/" + (initial ? "document-edit" : "offer-create"),
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id: initial?.id,
                        userId: form.get("userId"),
                        description: form.get("description"),
                        items,
                        catalogKey: initial
                            ? undefined
                            : catalogKey || undefined,
                    }),
                },
            );
            const result = await response.json();
            if (!response.ok) throw new Error(result.error);
            router.push(
                initial?.kind === "invoice"
                    ? "/admin/rechnungen"
                    : "/admin/angebote",
            );
            router.refresh();
        } catch (e) {
            setMessage(
                e instanceof Error ? e.message : "Speichern fehlgeschlagen.",
            );
        } finally {
            setBusy(false);
        }
    }
    return (
        <form className="action-form" onSubmit={save}>
            {!initial && (
                <div className="field">
                    <label htmlFor="offer-package">
                        Leistungspaket als Angebotsgrundlage
                    </label>
                    <select
                        id="offer-package"
                        value={catalogKey}
                        onChange={(e) => {
                            const key = e.target.value;
                            setCatalogKey(key);
                            const selected = findServicePackage(key);
                            if (selected) {
                                setItems([
                                    {
                                        description:
                                            selected.name +
                                            " – Umfang gemäß Leistungsbeschreibung",
                                        quantity: 1,
                                        unitCents: selected.fromCents,
                                    },
                                ]);
                                const description = document.getElementById(
                                    "offer-description",
                                ) as HTMLTextAreaElement | null;
                                if (description)
                                    description.value = `${selected.name}\n\n${selected.includes.map((item) => "• " + item).join("\n")}\n\nNicht enthalten: ${selected.excludes}\nBenötigte Zuarbeit: ${selected.prepare}\n\nVor Versand ergänzen: konkreter Leistungsumfang, vereinbarte Ergebnisse, Mitwirkung, Liefertermin und Zahlungsbedingungen.`;
                            }
                        }}
                    >
                        <option value="">Individuelles Angebot</option>
                        {servicePackages.map((p) => (
                            <option value={p.key} key={p.key}>
                                {p.name} – ab {money(p.fromCents)}
                            </option>
                        ))}
                    </select>
                    <p>
                        Prüfe Umfang, Liefertermin und Gesamtpreis vor dem
                        Versand. Der Einstiegspreis ist die Untergrenze dieses
                        Pakets.
                    </p>
                </div>
            )}
            <div className="field">
                <label htmlFor="offer-customer">Kunde</label>
                <select
                    id="offer-customer"
                    name="userId"
                    required
                    defaultValue={initial?.userId}
                    disabled={!!initial}
                >
                    {customers.map((c) => (
                        <option key={c.value} value={c.value}>
                            {c.label}
                        </option>
                    ))}
                </select>
            </div>
            <div className="field">
                <label htmlFor="offer-description">
                    Leistungsbeschreibung und Zahlungsbedingungen
                </label>
                <textarea
                    id="offer-description"
                    name="description"
                    required
                    rows={4}
                    defaultValue={initial?.description}
                />
            </div>
            {items.map((item, i) => (
                <fieldset key={i} className="border border-[#dedfd9] p-4">
                    <legend>Position {i + 1}</legend>
                    <div className="field mb-4">
                        <label htmlFor={"item-" + i}>Leistung</label>
                        <input
                            id={"item-" + i}
                            value={item.description}
                            required
                            onChange={(e) =>
                                setItems(
                                    items.map((r, j) =>
                                        j === i
                                            ? {
                                                  ...r,
                                                  description: e.target.value,
                                              }
                                            : r,
                                    ),
                                )
                            }
                        />
                    </div>
                    <div className="form-grid">
                        <div className="field">
                            <label htmlFor={"qty-" + i}>Menge</label>
                            <input
                                id={"qty-" + i}
                                type="number"
                                min="1"
                                step="1"
                                value={item.quantity}
                                onChange={(e) =>
                                    setItems(
                                        items.map((r, j) =>
                                            j === i
                                                ? {
                                                      ...r,
                                                      quantity: Number(
                                                          e.target.value,
                                                      ),
                                                  }
                                                : r,
                                        ),
                                    )
                                }
                            />
                        </div>
                        <div className="field">
                            <label htmlFor={"unit-" + i}>
                                Einzelpreis in Euro
                            </label>
                            <input
                                id={"unit-" + i}
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.unitCents / 100}
                                onChange={(e) =>
                                    setItems(
                                        items.map((r, j) =>
                                            j === i
                                                ? {
                                                      ...r,
                                                      unitCents: Math.round(
                                                          Number(
                                                              e.target.value,
                                                          ) * 100,
                                                      ),
                                                  }
                                                : r,
                                        ),
                                    )
                                }
                            />
                        </div>
                    </div>
                    {items.length > 1 && (
                        <button
                            type="button"
                            className="text-button mt-3 text-xs"
                            onClick={() =>
                                setItems(items.filter((_, j) => j !== i))
                            }
                        >
                            Position entfernen
                        </button>
                    )}
                </fieldset>
            ))}
            <button
                className="button"
                type="button"
                onClick={() =>
                    setItems([
                        ...items,
                        { description: "", quantity: 1, unitCents: 0 },
                    ])
                }
            >
                Position hinzufügen +
            </button>
            <p>
                Gesamtbetrag:{" "}
                <strong>
                    {money(
                        items.reduce((n, i) => n + i.quantity * i.unitCents, 0),
                    )}
                </strong>
            </p>
            <p className="small-note">
                Keine gesonderte Umsatzsteuer.{" "}
                {initial?.kind === "invoice"
                    ? "Hier wird der Rechnungsentwurf gespeichert. Die Ausstellung erfolgt anschließend in der Rechnungsübersicht."
                    : "Angebote sind nach dem Versand sieben Tage gültig. Hier wird zunächst ein Entwurf gespeichert."}
            </p>
            <button className="button primary" disabled={busy}>
                {busy ? "Wird gespeichert …" : "Entwurf speichern ↗"}
            </button>
            {message && <p role="alert">{message}</p>}
        </form>
    );
}
