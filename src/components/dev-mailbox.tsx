"use client";
import { useState } from "react";
export function DevMailbox() {
    const [mails, setMails] = useState<
        {
            id: string;
            to: string;
            subject: string;
            body: string;
            url: string | null;
            status: string;
        }[]
    >([]);
    const [message, setMessage] = useState("");
    async function load(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const response = await fetch("/api/dev/mail", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key: form.get("key") }),
        });
        const result = await response.json();
        if (response.ok) {
            setMails(result);
            setMessage(
                result.length
                    ? ""
                    : "Noch keine Entwicklungsnachrichten vorhanden.",
            );
        } else setMessage(result.error);
    }
    return (
        <main id="main" className="wrap py-16">
            <h1 className="my-6">E-Mail-Ausgang prüfen.</h1>
            <p className="mb-8 max-w-xl">
                Diese Nachrichten wurden tatsächlich von der Anwendung erzeugt
                und lokal gespeichert. Es wurde keine SMTP-Zustellung behauptet.
                Zugang nur mit dem lokal erzeugten Einrichtungsschlüssel; im
                Produktionsmodus gesperrt.
            </p>
            <form className="action-form max-w-xl" onSubmit={load}>
                <div className="field">
                    <label htmlFor="dev-key">
                        Lokaler Einrichtungsschlüssel
                    </label>
                    <input
                        id="dev-key"
                        name="key"
                        type="password"
                        required
                        autoComplete="off"
                    />
                </div>
                <button className="button primary">
                    Lokale Nachrichten laden ↗
                </button>
            </form>
            {message && (
                <p role="status" className="my-5">
                    {message}
                </p>
            )}
            <div className="grid gap-5 mt-10">
                {mails.map((m) => (
                    <article className="panel" key={m.id}>
                        <h2 className="text-2xl my-3">{m.subject}</h2>
                        <span className="record-meta">
                            {m.to} · {m.status}
                        </span>
                        <pre className="whitespace-pre-wrap font-sans text-sm">
                            {m.body}
                        </pre>
                        {m.url && (
                            <a className="arrow-link mt-5" href={m.url}>
                                Aktionslink öffnen ↗
                            </a>
                        )}
                    </article>
                ))}
            </div>
        </main>
    );
}
