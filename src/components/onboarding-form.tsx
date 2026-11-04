"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { onboardingFields } from "@/content/pages";

export function OnboardingForm({
    initial,
}: {
    initial: Record<string, string>;
}) {
    const [answers, setAnswers] = useState(initial);
    const [message, setMessage] = useState("");
    const [busy, setBusy] = useState(false);
    const router = useRouter();
    async function save(complete: boolean) {
        setBusy(true);
        try {
            const response = await fetch("/api/action/onboarding", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ answers, complete }),
            });
            const result = await response.json();
            setMessage(result.error ?? result.message);
            if (response.ok) router.refresh();
        } catch {
            setMessage("Verbindung fehlgeschlagen. Bitte versuche es erneut.");
        } finally {
            setBusy(false);
        }
    }
    return (
        <form
            className="action-form"
            onSubmit={(e) => {
                e.preventDefault();
                save(true);
            }}
        >
            <div className="field">
                <label htmlFor="interest">Dein Interessengebiet</label>
                <select
                    id="interest"
                    value={answers.interest ?? ""}
                    onChange={(e) =>
                        setAnswers({ ...answers, interest: e.target.value })
                    }
                >
                    <option value="">Bitte auswählen</option>
                    <option>Gründung</option>
                    <option>Unternehmensentwicklung</option>
                    <option>Social Media</option>
                    <option>Creator</option>
                    <option>Websites & Software</option>
                    <option>Digitalisierung & KI</option>
                    <option>Finanzbildung</option>
                </select>
            </div>
            {onboardingFields.map(([key, label, required]) => (
                <div className="field" key={key}>
                    <label htmlFor={key}>
                        {label}
                        {required ? " *" : ""}
                    </label>
                    <textarea
                        id={key}
                        value={answers[key] ?? ""}
                        onChange={(e) =>
                            setAnswers({ ...answers, [key]: e.target.value })
                        }
                        required={required}
                        rows={3}
                    />
                </div>
            ))}
            {answers.interest && (
                <div className="field">
                    <label htmlFor="specific">
                        {answers.interest === "Social Media" ||
                        answers.interest === "Creator"
                            ? "Welche Plattformen und Formate nutzt Du bereits?"
                            : answers.interest === "Websites & Software"
                              ? "Welche Aufgabe soll Deine digitale Lösung erfüllen?"
                              : answers.interest === "Gründung"
                                ? "Welche Geschäftsideen möchtest Du genauer prüfen?"
                                : "Welche konkrete Frage möchtest Du zuerst bearbeiten?"}
                    </label>
                    <textarea
                        id="specific"
                        value={answers.specific ?? ""}
                        onChange={(e) =>
                            setAnswers({ ...answers, specific: e.target.value })
                        }
                    />
                </div>
            )}
            <div className="button-row">
                <button
                    className="button"
                    type="button"
                    disabled={busy}
                    onClick={() => save(false)}
                >
                    Zwischenstand speichern
                </button>
                <button className="button primary" disabled={busy}>
                    Fragebogen abschließen ↗
                </button>
            </div>
            {message && <p role="status">{message}</p>}
        </form>
    );
}
