import { formatInTimeZone } from "date-fns-tz";
import { timeEntries } from "@/server/schema";
import { ActionForm, type Field } from "./action-form";

export function TimeCorrectionForm({
    entry,
    projects,
    packages,
}: {
    entry: typeof timeEntries.$inferSelect;
    projects: { value: string; label: string }[];
    packages: { value: string; label: string }[];
}) {
    if (entry.status !== "stopped" || !entry.endsAt) return null;
    const dateField = (name: string, label: string, value: Date): Field => ({
        name,
        label,
        type: "datetime-local",
        required: true,
        value: formatInTimeZone(
            value,
            "Europe/Berlin",
            "yyyy-MM-dd'T'HH:mm:ss",
        ),
        originalInstant: value.toISOString(),
    });
    return (
        <details className="mt-3">
            <summary className="cursor-pointer underline">
                Zeitnachweis korrigieren
            </summary>
            <p className="small-note mb-4">
                Der Korrekturgrund sowie vorheriger und neuer Stand werden
                protokolliert. Paketkontingente werden gemeinsam mit dem
                Zeitnachweis aktualisiert. Bei unverändertem Beginn und Ende
                bleiben Timerpausen erhalten. Geänderte Zeitgrenzen ersetzen den
                Nachweis durch einen zusammenhängenden Arbeitszeitraum.
            </p>
            <ActionForm
                action="time-correct"
                values={{ id: entry.id, expectedRevision: entry.revision }}
                fields={[
                    {
                        name: "projectId",
                        label: "Projekt",
                        options: projects,
                        required: true,
                        value: entry.projectId,
                    },
                    {
                        name: "packageId",
                        label: "Paket",
                        options: [
                            { value: "", label: "Ohne Paketbelastung" },
                            ...packages,
                        ],
                        value: entry.packageId ?? "",
                    },
                    dateField(
                        "startsAt",
                        "Beginn · Europe/Berlin",
                        entry.startsAt,
                    ),
                    dateField("endsAt", "Ende · Europe/Berlin", entry.endsAt),
                    {
                        name: "chargeMinutes",
                        label: "Davon auf das Paket anzurechnen (Minuten)",
                        type: "number",
                        required: true,
                        min: "0",
                        step: "0.01",
                        value: (entry.chargedSeconds / 60).toFixed(2),
                    },
                    {
                        name: "activity",
                        label: "Tätigkeit",
                        required: true,
                        value: entry.activity,
                    },
                    {
                        name: "description",
                        label: "Beschreibung für den Kunden",
                        type: "textarea",
                        value: entry.description ?? "",
                    },
                    {
                        name: "adminComment",
                        label: "Interner Administrationskommentar",
                        type: "textarea",
                        value: entry.adminComment ?? "",
                    },
                    {
                        name: "reason",
                        label: "Korrekturgrund (mindestens 10 Zeichen)",
                        type: "textarea",
                        required: true,
                    },
                ]}
                submit="Korrektur nachvollziehbar speichern"
                success="Der Zeitnachweis und die zugehörigen Kontingente wurden gemeinsam korrigiert."
            />
        </details>
    );
}
