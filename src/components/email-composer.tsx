"use client";
import { useState } from "react";
import { RichEditor } from "./rich-editor";
import { useRouter } from "next/navigation";

export function EmailComposer({
    customers,
    attachments = [],
}: {
    customers: { value: string; label: string }[];
    attachments?: { id: string; name: string; userId: string }[];
}) {
    const [attachmentIds, setAttachmentIds] = useState<string[]>([]);
    const [body, setBody] = useState("<p>Hallo,</p><p></p>");
    const [recipient, setRecipient] = useState(customers[0]?.value ?? "");
    const [subject, setSubject] = useState("");
    const [busy, setBusy] = useState(false);
    const [preview, setPreview] = useState<{
        id: string;
        html: string;
        attachments: string[];
    } | null>(null);
    const [message, setMessage] = useState("");
    const router = useRouter();
    async function prepare(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setBusy(true);
        setMessage("");
        try {
            const response = await fetch("/api/action/email-preview", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: recipient,
                    subject,
                    body,
                    attachmentIds,
                }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error);
            setPreview(result);
        } catch (e) {
            setMessage(
                e instanceof Error
                    ? e.message
                    : "Die Vorschau konnte nicht geladen werden.",
            );
        } finally {
            setBusy(false);
        }
    }
    async function send() {
        if (!preview) return;
        setBusy(true);
        try {
            const response = await fetch("/api/action/email-send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: preview.id }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error);
            setMessage(
                "Die E-Mail ist in der Versandwarteschlange. Eine SMTP-Übergabe ist noch keine Bestätigung des Posteingangs.",
            );
            setPreview(null);
            router.refresh();
        } catch (e) {
            setMessage(
                e instanceof Error
                    ? e.message
                    : "Die Freigabe konnte nicht gespeichert werden.",
            );
        } finally {
            setBusy(false);
        }
    }
    return (
        <div>
            {preview ? (
                <>
                    <h3 className="mb-4">Vorschau vor dem Versand</h3>
                    <iframe
                        title="E-Mail-Vorschau"
                        srcDoc={preview.html}
                        sandbox=""
                        className="w-full h-[550px] border border-[#dedfd9] bg-white"
                    />
                    {preview.attachments.length > 0 && (
                        <p className="my-4">
                            Anhänge: {preview.attachments.join(", ")}
                        </p>
                    )}
                    <div className="button-row mt-5">
                        <button
                            className="button"
                            disabled={busy}
                            onClick={() => setPreview(null)}
                        >
                            Weiter bearbeiten
                        </button>
                        <button
                            className="button primary"
                            disabled={busy}
                            onClick={send}
                        >
                            Für den Versand freigeben ↗
                        </button>
                    </div>
                </>
            ) : (
                <form className="action-form" onSubmit={prepare}>
                    <div className="field">
                        <label htmlFor="mail-customer">Empfänger</label>
                        <select
                            name="userId"
                            id="mail-customer"
                            required
                            value={recipient}
                            onChange={(e) => {
                                setRecipient(e.target.value);
                                setAttachmentIds([]);
                            }}
                        >
                            {customers.map((c) => (
                                <option key={c.value} value={c.value}>
                                    {c.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="field">
                        <label htmlFor="mail-subject">Betreff</label>
                        <input
                            id="mail-subject"
                            name="subject"
                            required
                            maxLength={200}
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="mail-template">
                            Mit einer Vorlage beginnen
                        </label>
                        <select
                            id="mail-template"
                            defaultValue=""
                            onChange={(e) => {
                                const name = (
                                    customers
                                        .find((c) => c.value === recipient)
                                        ?.label.split("·")[0]
                                        .trim() ?? ""
                                ).replace(
                                    /[&<>]/g,
                                    (c) =>
                                        ({
                                            "&": "&amp;",
                                            "<": "&lt;",
                                            ">": "&gt;",
                                        })[c]!,
                                );
                                const templates: Record<
                                    string,
                                    { subject: string; body: string }
                                > = {
                                    question: {
                                        subject:
                                            "Eine Rückfrage zu Deinem Vorhaben",
                                        body:
                                            "<p>Hallo " +
                                            name +
                                            ",</p><p>für den nächsten gemeinsamen Schritt möchten wir eine Frage mit Dir klären:</p><p></p><p>Antworte gern direkt im geschützten Kundenchat.</p>",
                                    },
                                    project: {
                                        subject: "Ein Update zu Deinem Projekt",
                                        body:
                                            "<p>Hallo " +
                                            name +
                                            ",</p><p>hier findest Du einen Überblick zum aktuellen Stand unserer Zusammenarbeit:</p><ul><li>Bearbeiteter Schritt:</li><li>Nächster Schritt:</li><li>Offene Entscheidung:</li></ul>",
                                    },
                                    appointment: {
                                        subject:
                                            "Abstimmung zu Deinem Beratungstermin",
                                        body:
                                            "<p>Hallo " +
                                            name +
                                            ",</p><p>zu unserem nächsten Beratungstermin möchten wir Folgendes mit Dir abstimmen:</p><p></p><p>Die bestätigten Termindaten findest Du in Deinem Kundenkonto.</p>",
                                    },
                                };
                                const template = templates[e.target.value];
                                if (template) {
                                    setSubject(template.subject);
                                    setBody(template.body);
                                }
                            }}
                        >
                            <option value="">Individuelle Nachricht</option>
                            <option value="question">Rückfrage</option>
                            <option value="project">Projektupdate</option>
                            <option value="appointment">
                                Terminabstimmung
                            </option>
                        </select>
                    </div>
                    <RichEditor value={body} onChange={setBody} />
                    {attachments.length > 0 && (
                        <fieldset className="border border-[#dedfd9] p-4">
                            <legend className="px-2">
                                Datei-Anhänge · bis 10 MB insgesamt
                            </legend>
                            {attachments
                                .filter((f) => f.userId === recipient)
                                .map((f) => (
                                    <label className="check my-2" key={f.id}>
                                        <input
                                            type="checkbox"
                                            name="attachmentIds"
                                            value={f.id}
                                            checked={attachmentIds.includes(
                                                f.id,
                                            )}
                                            onChange={(e) =>
                                                setAttachmentIds(
                                                    e.target.checked
                                                        ? [
                                                              ...attachmentIds,
                                                              f.id,
                                                          ]
                                                        : attachmentIds.filter(
                                                              (id) =>
                                                                  id !== f.id,
                                                          ),
                                                )
                                            }
                                        />
                                        {f.name}
                                    </label>
                                ))}
                        </fieldset>
                    )}
                    <button className="button primary" disabled={busy}>
                        {busy ? "Wird vorbereitet …" : "Vorschau erstellen ↗"}
                    </button>
                </form>
            )}
            {message && (
                <p role="status" className="mt-4">
                    {message}
                </p>
            )}
        </div>
    );
}
