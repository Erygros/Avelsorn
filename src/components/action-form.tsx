"use client";
import { useState, useId } from "react";
import { useRouter } from "next/navigation";
import { fromZonedTime } from "date-fns-tz";

export type Field = {
    name: string;
    label: string;
    type?: string;
    required?: boolean;
    options?: { value: string; label: string }[];
    value?: string;
    hint?: string;
    min?: string;
    max?: string;
    step?: string;
    originalInstant?: string;
};
export function ActionForm({
    action,
    fields = [],
    values = {},
    submit = "Speichern",
    success = "Gespeichert.",
    redirect,
    children,
    exactSubmit = false,
}: {
    action: string;
    fields?: Field[];
    values?: Record<string, unknown>;
    submit?: string;
    success?: string;
    redirect?: string;
    children?: React.ReactNode;
    exactSubmit?: boolean;
}) {
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState(false);
    const router = useRouter();
    const formId = useId();
    async function send(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setBusy(true);
        setMessage("");
        const form = new FormData(event.currentTarget);
        const data: Record<string, unknown> = { ...values };
        try {
            for (const field of fields) {
                const value = form.get(field.name);
                data[field.name] =
                    field.type === "checkbox"
                        ? value === "on"
                        : field.type === "number"
                          ? Number(value)
                          : field.type === "currency"
                            ? Math.round(Number(value) * 100)
                            : field.type === "datetime-local" && value
                              ? (() => {
                                    const selected = fromZonedTime(
                                        String(value),
                                        "Europe/Berlin",
                                    );
                                    return field.originalInstant &&
                                        Math.floor(
                                            selected.getTime() / 1000,
                                        ) ===
                                            Math.floor(
                                                new Date(
                                                    field.originalInstant,
                                                ).getTime() / 1000,
                                            )
                                        ? field.originalInstant
                                        : selected.toISOString();
                                })()
                              : (value ?? "");
            }
            const response = await fetch("/api/action/" + action, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (!response.ok)
                throw new Error(
                    result.error ??
                        "Die Anfrage konnte nicht verarbeitet werden.",
                );
            setError(false);
            setMessage(result.message ?? success);
            if (result.redirect ?? redirect)
                router.push(result.redirect ?? redirect);
            else router.refresh();
        } catch (e) {
            setError(true);
            setMessage(
                e instanceof Error ? e.message : "Verbindung fehlgeschlagen.",
            );
        } finally {
            setBusy(false);
        }
    }
    return (
        <form onSubmit={send} className="action-form">
            {fields.map((field) => (
                <div
                    className={
                        "field " +
                        (field.type === "checkbox" ? "checkbox-field" : "")
                    }
                    key={field.name}
                >
                    {field.type === "checkbox" ? (
                        <label className="check">
                            <input
                                type="checkbox"
                                name={field.name}
                                required={field.required}
                            />
                            <span>{field.label}</span>
                        </label>
                    ) : (
                        <>
                            <label htmlFor={`${formId}-${field.name}`}>
                                {field.label}
                                {field.required && (
                                    <span aria-hidden="true"> *</span>
                                )}
                            </label>
                            {field.options ? (
                                <select
                                    id={`${formId}-${field.name}`}
                                    name={field.name}
                                    defaultValue={field.value}
                                    required={field.required}
                                >
                                    {field.options.map((o) => (
                                        <option value={o.value} key={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                            ) : field.type === "textarea" ? (
                                <textarea
                                    id={`${formId}-${field.name}`}
                                    name={field.name}
                                    required={field.required}
                                    defaultValue={field.value}
                                    rows={4}
                                />
                            ) : (
                                <input
                                    id={`${formId}-${field.name}`}
                                    name={field.name}
                                    type={
                                        field.type === "currency"
                                            ? "number"
                                            : (field.type ?? "text")
                                    }
                                    step={
                                        field.step ??
                                        (field.type === "currency"
                                            ? "0.01"
                                            : field.type === "datetime-local"
                                              ? "1"
                                              : undefined)
                                    }
                                    defaultValue={field.value}
                                    required={field.required}
                                    min={field.min}
                                    max={field.max}
                                    autoComplete={
                                        field.type === "password"
                                            ? "new-password"
                                            : field.name === "email"
                                              ? "email"
                                              : undefined
                                    }
                                />
                            )}
                        </>
                    )}
                    {field.hint && <small>{field.hint}</small>}
                </div>
            ))}
            {children}
            <button
                className="button primary"
                disabled={busy}
                aria-busy={busy}
                type="submit"
            >
                {busy && !exactSubmit ? "Wird verarbeitet …" : submit}
                {!exactSubmit && <span aria-hidden="true">↗</span>}
            </button>
            {message && (
                <p
                    className={error ? "form-error" : "form-success"}
                    role={error ? "alert" : "status"}
                >
                    {message}
                </p>
            )}
        </form>
    );
}
