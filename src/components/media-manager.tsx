import { and, eq, isNull, desc } from "drizzle-orm";
import { db } from "@/server/db";
import { media, files } from "@/server/schema";
import { ActionForm } from "./action-form";
import { UploadForm } from "./upload-form";
import { formatInTimeZone } from "date-fns-tz";
export async function MediaManager({ adminId }: { adminId: string }) {
    const assets = await db()
        .select()
        .from(files)
        .where(
            and(eq(files.category, "public_media"), isNull(files.deletedAt)),
        );
    const items = await db()
        .select()
        .from(media)
        .orderBy(desc(media.createdOn));
    return (
        <div className="portal-grid mt-8">
            <section className="panel">
                <h2 className="mb-5 text-3xl">Grafiken vorbereiten</h2>
                <p className="mb-5">
                    Lade eigene Unternehmensgrafiken hoch und wähle „Zur
                    Veröffentlichung vorgesehene Grafik“. Private Kundendateien
                    sind hier nicht als öffentliche Medien freigegeben.
                </p>
                <UploadForm
                    customers={[
                        { value: adminId, label: "Eigene Unternehmensmedien" },
                    ]}
                    projects={[]}
                />
            </section>
            <section className="panel">
                <h2 className="mb-5 text-3xl">Herkunft & Veröffentlichung</h2>
                {assets.length ? (
                    <ActionForm
                        action="media-save"
                        fields={[
                            {
                                name: "fileId",
                                label: "Mediendatei",
                                options: assets.map((f) => ({
                                    value: f.id,
                                    label: f.name,
                                })),
                                required: true,
                            },
                            {
                                name: "origin",
                                label: "Herkunft",
                                options: [
                                    { value: "original", label: "Original" },
                                    { value: "ai", label: "KI-generiert" },
                                ],
                            },
                            {
                                name: "source",
                                label: "Quelle / Urheberschaft",
                                required: true,
                            },
                            {
                                name: "alt",
                                label: "Alternativtext für die Grafik",
                                required: true,
                            },
                            {
                                name: "createdOn",
                                label: "Erstellt am · Europe/Berlin",
                                type: "datetime-local",
                                required: true,
                                value: formatInTimeZone(
                                    new Date(),
                                    "Europe/Berlin",
                                    "yyyy-MM-dd'T'HH:mm",
                                ),
                            },
                            {
                                name: "publishedAt",
                                label: "Veröffentlichung ab · Europe/Berlin (leer = Entwurf)",
                                type: "datetime-local",
                            },
                            {
                                name: "disclosure",
                                label: "Sichtbarer Offenlegungstext (bei KI-generierten Medien erforderlich)",
                                type: "textarea",
                            },
                            {
                                name: "publicationApproved",
                                label: "Ich bestätige die erforderlichen Nutzungsrechte und die Freigabe zur öffentlichen Darstellung.",
                                type: "checkbox",
                                required: true,
                            },
                        ]}
                        submit="Medienangaben speichern"
                    />
                ) : (
                    <p>
                        Lade zuerst eine Grafik in der vorgesehenen Kategorie
                        hoch.
                    </p>
                )}
                <div className="row-list mt-6">
                    {items.map((m) => (
                        <div key={m.id}>
                            <strong className="text-xs">{m.alt}</strong>
                            <p>
                                {m.origin === "ai"
                                    ? "KI-generiert"
                                    : "Original"}{" "}
                                · {m.source}
                            </p>
                            {m.disclosure && <p>{m.disclosure}</p>}
                            <p className="small-note">
                                {m.publishedAt
                                    ? "Öffentlicher Medienpfad: /api/media/" +
                                      m.id
                                    : "Noch nicht veröffentlicht"}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
