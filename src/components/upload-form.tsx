"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export function UploadForm({
    customers,
    projects,
}: {
    customers?: { value: string; label: string }[];
    projects: { value: string; label: string }[];
}) {
    const [message, setMessage] = useState("");
    const [busy, setBusy] = useState(false);
    const router = useRouter();
    async function send(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setBusy(true);
        const data = new FormData(e.currentTarget);
        if (!data.get("projectId")) data.delete("projectId");
        try {
            const response = await fetch("/api/files", {
                method: "POST",
                body: data,
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error);
            setMessage("Deine Datei wurde geschützt gespeichert.");
            router.refresh();
        } catch (e) {
            setMessage(
                e instanceof Error ? e.message : "Upload fehlgeschlagen.",
            );
        } finally {
            setBusy(false);
        }
    }
    return (
        <form className="action-form" onSubmit={send}>
            {customers && (
                <div className="field">
                    <label htmlFor="upload-customer">Kunde</label>
                    <select id="upload-customer" name="userId" required>
                        {customers.map((c) => (
                            <option value={c.value} key={c.value}>
                                {c.label}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            {customers && (
                <div className="field">
                    <label htmlFor="upload-category">Dateikategorie</label>
                    <select id="upload-category" name="category">
                        <option value="project">Private Projektdatei</option>
                        <option value="accounting">
                            Aufbewahrungspflichtiger Buchhaltungsbeleg
                        </option>
                        <option value="public_media">
                            Zur Veröffentlichung vorgesehene Grafik
                        </option>
                    </select>
                </div>
            )}
            <div className="field">
                <label htmlFor="upload-project">Projekt (optional)</label>
                <select id="upload-project" name="projectId">
                    <option value="">Ohne Projektzuordnung</option>
                    {projects.map((p) => (
                        <option value={p.value} key={p.value}>
                            {p.label}
                        </option>
                    ))}
                </select>
            </div>
            <div className="field">
                <label htmlFor="upload-file">Datei auswählen</label>
                <input
                    id="upload-file"
                    name="file"
                    type="file"
                    required
                    accept=".pdf,.jpg,.jpeg,.png,.webp,.gif,.txt,.md,.csv,.zip,.docx,.xlsx,.pptx"
                />
                <small>
                    PDF, Bilder, UTF-8-Text, Office-Dokumente oder ZIP ·
                    höchstens 4 MB. Private Speicherung, Download nur mit
                    Berechtigung.
                </small>
            </div>
            <button className="button primary" disabled={busy}>
                {busy ? "Wird hochgeladen …" : "Datei geschützt hochladen ↗"}
            </button>
            {message && <p role="status">{message}</p>}
        </form>
    );
}
