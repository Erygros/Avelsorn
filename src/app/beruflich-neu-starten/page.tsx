import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import {
    findServicePackage,
    packageInquiryPath,
} from "@/content/service-packages";
import { money, baseUrl } from "@/server/config";
export const metadata: Metadata = {
    title: "Selbstständigkeit vorbereiten – auch ohne Geschäftsidee",
    description:
        "Beruflich neu orientieren und eine Selbstständigkeit prüfen: Fähigkeiten aufnehmen, Tätigkeiten vergleichen und eine Angebotsidee ausarbeiten. Ab 249 € einmalig.",
    alternates: { canonical: baseUrl() + "/beruflich-neu-starten" },
};
export default function CareerStart() {
    const selected = findServicePackage("neustart")!;
    return (
        <SiteShell>
            <main id="main">
                <header className="page-heading wrap">
                    <h1>Deine erste selbstständige Tätigkeit vorbereiten</h1>
                    <p className="lead">
                        Du möchtest beruflich etwas verändern, weißt aber noch
                        nicht, welche selbstständige Tätigkeit infrage kommt. In
                        diesem Paket arbeiten wir von Deinen bisherigen
                        Erfahrungen aus. Eine fertige Geschäftsidee oder
                        Erfahrung mit einer Gründung ist nicht nötig.
                    </p>
                </header>
                <div className="page-body wrap detail-grid">
                    <div className="career-start-copy">
                        <section>
                            <h2>Womit wir anfangen</h2>
                            <p>
                                Du beschreibst Deine bisherige Arbeit, Aufgaben,
                                die Dir liegen, und Tätigkeiten, die Du künftig
                                vermeiden möchtest. Dazu kommen Deine
                                Interessen, vorhandene Kenntnisse und die
                                Mittel, die Du für einen Einstieg einsetzen
                                kannst. Du entscheidest, welche Angaben Du
                                teilen möchtest.
                            </p>
                        </section>
                        <section>
                            <h2>Mögliche Tätigkeiten vergleichen</h2>
                            <p>
                                Wir halten bis zu drei Tätigkeitsfelder fest und
                                vergleichen sie anhand derselben Fragen: Welche
                                Leistung könntest Du anbieten? Wer könnte sie
                                benötigen? Welche Kenntnisse, Ausstattung und
                                Vorbereitungen fehlen noch? So entsteht eine
                                schriftliche Gegenüberstellung, mit der Du Deine
                                nächsten Recherchen gezielt angehen kannst.
                            </p>
                        </section>
                        <section>
                            <h2>Eine erste Angebotsidee aufschreiben</h2>
                            <p>
                                Für ein ausgewähltes Tätigkeitsfeld formulieren
                                wir eine erste Leistung mit Zielgruppe und
                                möglichem Umfang. Das kann beispielsweise die
                                Betreuung organisatorischer Aufgaben oder eine
                                digitale Dienstleistung sein. Welche Tätigkeit
                                passt, hängt von Deinen Angaben ab.
                            </p>
                        </section>
                        <section>
                            <h2>Nachfrage außerhalb des Gesprächs prüfen</h2>
                            <p>
                                Du erhältst eine Aufgabenliste für erste
                                Gespräche mit möglichen Kunden: Was möchtest Du
                                zeigen, welche Fragen stellst Du und welche
                                Annahmen müssen noch bestätigt werden? Ob jemand
                                Dein Angebot benötigt und beauftragt, lässt sich
                                erst mit diesen Rückmeldungen beurteilen.
                            </p>
                        </section>
                        <section>
                            <h2>Was dieses Paket nicht übernimmt</h2>
                            <p>
                                Es enthält weder Jobvermittlung noch Rechts-,
                                Steuer- oder Fördermittelberatung. Ein
                                vollständiger Businessplan, eine Website und
                                laufende Betreuung werden gesondert vereinbart.
                                Kündigungs-, Einkommens- oder
                                Finanzierungsentscheidungen triffst Du anhand
                                Deiner Situation und gegebenenfalls fachlicher
                                Beratung.
                            </p>
                        </section>
                    </div>
                    <aside className="quiet-panel">
                        <h2>{selected.name}</h2>
                        <p className="package-price">
                            ab {money(selected.fromCents)} einmalig
                        </p>
                        <ul className="package-deliverables">
                            {selected.includes.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                        <p>
                            Nach Deiner unverbindlichen Anfrage klären wir den
                            Umfang. Erst das konkrete Angebot enthält den
                            verbindlichen Gesamtpreis und den Liefertermin.
                        </p>
                        <Link
                            href={packageInquiryPath(selected.key)}
                            className="button primary"
                        >
                            Paket unverbindlich anfragen ↗
                        </Link>
                        <Link href="/erstgespraech" className="arrow-link">
                            Zunächst ein kostenloses Erstgespräch ↗
                        </Link>
                    </aside>
                </div>
            </main>
        </SiteShell>
    );
}
