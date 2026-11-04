"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { RichEditor } from "./rich-editor";
import { fromZonedTime, formatInTimeZone } from "date-fns-tz";

export type PostInput = {
    id?: string;
    title: string;
    slug: string;
    category: string;
    excerpt: string;
    body: string;
    seoTitle: string;
    metaDescription: string;
    status: string;
    publishAt: string;
};
export function CmsEditor({ initial }: { initial?: PostInput }) {
    const [data, setData] = useState<PostInput>(
        initial
            ? {
                  ...initial,
                  publishAt: initial.publishAt
                      ? formatInTimeZone(
                            new Date(initial.publishAt),
                            "Europe/Berlin",
                            "yyyy-MM-dd'T'HH:mm",
                        )
                      : "",
              }
            : {
                  title: "",
                  slug: "",
                  category: "Digitale Arbeit",
                  excerpt: "",
                  body: "<p></p>",
                  seoTitle: "",
                  metaDescription: "",
                  status: "draft",
                  publishAt: "",
              },
    );
    const [message, setMessage] = useState("");
    const [busy, setBusy] = useState(false);
    const router = useRouter();
    async function save(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setBusy(true);
        try {
            const response = await fetch("/api/action/post-save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...data,
                    publishAt: data.publishAt
                        ? fromZonedTime(
                              data.publishAt,
                              "Europe/Berlin",
                          ).toISOString()
                        : "",
                }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error);
            setMessage("Der Beitrag wurde gespeichert.");
            router.push("/admin/blog");
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
            {(
                [
                    ["title", "Titel"],
                    ["slug", "URL-Slug (klein, mit Bindestrichen)"],
                    ["category", "Kategorie"],
                    ["excerpt", "Kurzbeschreibung"],
                    ["seoTitle", "SEO-Titel"],
                    ["metaDescription", "Meta-Beschreibung"],
                ] as const
            ).map(([key, label]) => (
                <div className="field" key={key}>
                    <label htmlFor={key}>{label}</label>
                    <input
                        id={key}
                        value={data[key]}
                        required={[
                            "title",
                            "slug",
                            "excerpt",
                            "category",
                        ].includes(key)}
                        onChange={(e) =>
                            setData({ ...data, [key]: e.target.value })
                        }
                    />
                </div>
            ))}
            <div>
                <span className="block text-xs font-semibold mb-2">
                    Beitragsinhalt
                </span>
                <RichEditor
                    value={data.body}
                    onChange={(body) => setData({ ...data, body })}
                />
            </div>
            <div className="form-grid">
                <div className="field">
                    <label htmlFor="post-status">Veröffentlichungsstatus</label>
                    <select
                        id="post-status"
                        value={data.status}
                        onChange={(e) =>
                            setData({ ...data, status: e.target.value })
                        }
                    >
                        <option value="draft">Entwurf</option>
                        <option value="published">Veröffentlichen</option>
                        <option value="scheduled">Geplant</option>
                        <option value="archived">Archiviert</option>
                    </select>
                </div>
                <div className="field">
                    <label htmlFor="publish-at">
                        Veröffentlichen am · Europe/Berlin
                    </label>
                    <input
                        id="publish-at"
                        type="datetime-local"
                        value={data.publishAt}
                        onChange={(e) =>
                            setData({ ...data, publishAt: e.target.value })
                        }
                    />
                </div>
            </div>
            <button className="button primary" disabled={busy}>
                {busy ? "Wird gespeichert …" : "Beitrag speichern ↗"}
            </button>
            {message && <p role="status">{message}</p>}
            <p className="small-note">
                Öffentliche Beiträge erscheinen nur nach Freigabe. HTML wird
                serverseitig bereinigt. Kommentare sind deaktiviert.
            </p>
        </form>
    );
}
