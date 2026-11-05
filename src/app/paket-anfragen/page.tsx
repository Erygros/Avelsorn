import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { ActionForm } from "@/components/action-form";
import {
    servicePackages,
    findServicePackage,
} from "@/content/service-packages";
import { money, baseUrl } from "@/server/config";
export const metadata: Metadata = {
    title: "Leistungspaket anfragen",
    description:
        "Beschreibe Deine Aufgabe und frage ein Avelsorn-Leistungspaket unverbindlich an. Vor einer Beauftragung erhältst Du Umfang und Gesamtpreis.",
    openGraph: {
        title: "Leistungspaket unverbindlich anfragen · Avelsorn",
        description:
            "Beschreibe Deine Aufgabe. Du erhältst vor einer Beauftragung ein individuelles Angebot mit Umfang und Gesamtpreis.",
        url: "/paket-anfragen",
        type: "website",
        locale: "de_DE",
        siteName: "Avelsorn",
    },
    alternates: { canonical: baseUrl() + "/paket-anfragen" },
};
export default async function PackageInquiry({
    searchParams,
}: {
    searchParams: Promise<{ paket?: string }>;
}) {
    const selected = findServicePackage(
        (await searchParams).paket ?? "neustart",
    );
    return (
        <SiteShell>
            <main id="main">
                <header className="page-heading wrap">
                    <h1>Ein Leistungspaket anfragen</h1>
                    <p className="lead">
                        Beschreibe, wobei Du Unterstützung suchst. Du brauchst
                        noch keinen fertigen Plan. Deine Anfrage ist
                        unverbindlich und löst keine Bestellung oder Zahlung
                        aus.
                    </p>
                </header>
                <div className="page-body wrap detail-grid">
                    <section className="form-panel" aria-label="Paket-Anfrage">
                        <ActionForm
                            action="package-inquiry"
                            submit="Unverbindliche Anfrage senden"
                            success="Deine Anfrage ist gespeichert."
                            fields={[
                                {
                                    name: "packageKey",
                                    label: "Gewünschtes Paket",
                                    type: "select",
                                    required: true,
                                    value: selected?.key ?? "neustart",
                                    options: servicePackages.map((p) => ({
                                        value: p.key,
                                        label:
                                            p.name +
                                            " – ab " +
                                            money(p.fromCents),
                                    })),
                                },
                                {
                                    name: "name",
                                    label: "Dein Name",
                                    required: true,
                                },
                                {
                                    name: "email",
                                    label: "Deine E-Mail-Adresse",
                                    type: "email",
                                    required: true,
                                },
                                {
                                    name: "body",
                                    label: "Was möchtest Du klären oder bearbeiten lassen?",
                                    type: "textarea",
                                    required: true,
                                    hint: "Mindestens 20 Zeichen. Für einen beruflichen Neustart reichen Deine bisherige Tätigkeit, Interessen und Fragen. Bitte keine vertraulichen Unterlagen oder Gesundheitsdaten senden.",
                                },
                                {
                                    name: "consent",
                                    label: "Ich habe die Datenschutzhinweise zur Bearbeitung meiner Anfrage gelesen.",
                                    type: "checkbox",
                                    required: true,
                                },
                            ]}
                        />
                        <p className="small-note">
                            <Link href="/datenschutz">
                                Datenschutzhinweise lesen
                            </Link>
                        </p>
                    </section>
                    <aside className="quiet-panel">
                        <h2>Was nach der Anfrage passiert</h2>
                        <p>
                            Ich prüfe Deine Angaben und kläre offene Fragen mit
                            Dir. Wenn der Auftrag passt, erhältst Du ein
                            konkretes Angebot. Darin stehen die enthaltenen
                            Leistungen, Deine Zuarbeit, der Liefertermin und der
                            verbindliche Gesamtpreis.
                        </p>
                        <p className="mt-4">
                            Wenn Du erst eine Selbstständigkeit als berufliche
                            Möglichkeit prüfen möchtest, wähle das Paket
                            „Selbstständigkeit vorbereiten“. Für eine bereits
                            ausgewählte Geschäftsidee ist „Gründungsangebot
                            ausarbeiten“ vorgesehen.
                        </p>
                        <Link href="/preise" className="arrow-link">
                            Alle Pakete und Leistungen ansehen ↗
                        </Link>
                    </aside>
                </div>
            </main>
        </SiteShell>
    );
}
