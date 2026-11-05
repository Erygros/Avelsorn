import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteShell } from "./site-shell";
import { heroImage } from "@/content/editorial-images";
import { EditorialPhoto } from "./editorial-photo";
import { audiences, audiencePath } from "@/content/audiences";
import { money } from "@/server/config";
import { findServicePackage } from "@/content/service-packages";
import { ServiceGroups } from "./service-groups";
import { collaborationSteps, serviceExamples } from "@/content/service-groups";

export async function Home() {
    return (
        <SiteShell>
            <main id="main">
                <section className="hero wrap optimized-hero">
                    <div className="hero-copy">
                        <h1 className="hero-heading">
                            Dein Unternehmen. Klare Strukturen. Digitale
                            Lösungen.
                        </h1>
                        <p className="lead">
                            Avelsorn unterstützt Gründer, Selbstständige und
                            Unternehmen dabei, Geschäftsideen zu entwickeln,
                            Arbeitsabläufe zu verbessern und individuelle
                            digitale Lösungen umzusetzen.
                        </p>
                        <p className="hero-intro-note">
                            Von der persönlichen Beratung bis zur praktischen
                            Umsetzung – alles aus einer Hand.
                        </p>
                        <div className="hero-cta">
                            <Link className="button primary" href="/kalender">
                                Kostenloses Erstgespräch vereinbaren{" "}
                                <ArrowUpRight size={18} aria-hidden="true" />
                            </Link>
                            <Link className="arrow-link" href="/leistungen">
                                Leistungen entdecken{" "}
                                <ArrowUpRight size={18} aria-hidden="true" />
                            </Link>
                        </div>
                        <ul className="hero-trust">
                            <li>Kostenloses Erstgespräch</li>
                            <li>Individuelle Projektpreise</li>
                            <li>Persönliche Beratung & Umsetzung</li>
                        </ul>
                    </div>
                    <EditorialPhoto
                        asset={heroImage}
                        className="hero-photo"
                        sizes="(max-width: 900px) calc(100vw - 40px), (max-width: 1352px) 45vw, 554px"
                        preload
                    />
                </section>
                <section
                    className="audience-strip"
                    aria-labelledby="audience-strip-title"
                >
                    <div className="wrap">
                        <h2 id="audience-strip-title">Für wen ich arbeite</h2>
                        <ul className="audience-links">
                            {audiences.map((audience) => (
                                <li key={audience.slug}>
                                    <Link href={audiencePath(audience)}>
                                        <span>{audience.name}</span>
                                        <ArrowUpRight
                                            size={16}
                                            strokeWidth={1.5}
                                            aria-hidden="true"
                                        />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
                <section
                    className="section wrap"
                    aria-labelledby="home-services-title"
                >
                    <div className="section-heading">
                        <h2 id="home-services-title">
                            Unternehmensberatung, die weiterdenkt und mit
                            anpackt.
                        </h2>
                        <p>
                            Eine Geschäftsidee prüfen, einen Ablauf ordnen oder
                            eine Website entwickeln: Wir klären, welche Aufgabe
                            ansteht und ob Beratung, Umsetzung oder beides
                            gebraucht wird.
                        </p>
                    </div>
                    <ServiceGroups />
                </section>
                <section className="approach-section">
                    <div className="wrap approach">
                        <div>
                            <h2>Von der Idee bis zur fertigen Lösung.</h2>
                            <p>
                                Manche Herausforderungen benötigen zunächst eine
                                klare Strategie. Andere lassen sich durch eine
                                konkrete technische Umsetzung lösen.
                            </p>
                            <p>
                                Bei Avelsorn besprechen wir gemeinsam, welche
                                Schritte sinnvoll sind. Anschließend kann ich
                                die vereinbarten digitalen Lösungen direkt für
                                Dich umsetzen.
                            </p>
                            <Link href="/ablauf" className="arrow-link">
                                So arbeiten wir zusammen{" "}
                                <ArrowUpRight size={17} aria-hidden="true" />
                            </Link>
                        </div>
                        <ol className="process-list">
                            {collaborationSteps.map(
                                ([name, description], i) => (
                                    <li key={name}>
                                        <span>0{i + 1}</span>
                                        <div>
                                            <h3>{name}</h3>
                                            <p>{description}</p>
                                        </div>
                                    </li>
                                ),
                            )}
                        </ol>
                    </div>
                </section>
                <section
                    className="section wrap"
                    aria-labelledby="examples-title"
                >
                    <div className="section-heading">
                        <h2 id="examples-title">
                            So können wir Dein Unternehmen unterstützen.
                        </h2>
                        <p>
                            Allgemeine Leistungsbeispiele zur Orientierung. Sie
                            beschreiben mögliche Aufgaben und sind keine
                            abgeschlossenen Kundenprojekte oder Referenzen.
                        </p>
                    </div>
                    <div className="example-grid">
                        {serviceExamples.map((example) => (
                            <article key={example.slug}>
                                <h3>{example.title}</h3>
                                <dl>
                                    <dt>Ausgangslage</dt>
                                    <dd>{example.problem}</dd>
                                    <dt>Mögliche Lösung</dt>
                                    <dd>{example.solution}</dd>
                                    <dt>Ziel</dt>
                                    <dd>{example.aim}</dd>
                                </dl>
                                <Link
                                    className="arrow-link"
                                    href={"/leistungen/" + example.slug}
                                >
                                    Leistung ansehen{" "}
                                    <ArrowUpRight
                                        size={17}
                                        aria-hidden="true"
                                    />
                                </Link>
                            </article>
                        ))}
                    </div>
                </section>
                <section className="portal-benefits-section">
                    <div className="wrap portal-benefits">
                        <div>
                            <h2>Dein Projekt. Jederzeit im Blick.</h2>
                            <p>
                                Während unserer Zusammenarbeit kannst Du
                                wichtige Informationen zu Deinem Auftrag zentral
                                einsehen. Projektfortschritt, Dokumente,
                                Rückfragen und Freigaben werden übersichtlich
                                zusammengeführt.
                            </p>
                            <Link href="/ueber-mich" className="arrow-link">
                                Dein Ansprechpartner bei Avelsorn{" "}
                                <ArrowUpRight size={17} aria-hidden="true" />
                            </Link>
                        </div>
                        <dl>
                            {[
                                [
                                    "Projekte und Aufgaben",
                                    "Vereinbarte Aufgaben, Status und Fortschritt im Kundenkonto einsehen.",
                                ],
                                [
                                    "Dokumente und Dateien",
                                    "Unterlagen zu Deinem Auftrag an einem geschützten Ort abrufen.",
                                ],
                                [
                                    "Rückfragen und Freigaben",
                                    "Projektfragen im Chat klären und Arbeitsergebnisse prüfen und freigeben.",
                                ],
                                [
                                    "Arbeitsnachweise",
                                    "Erfasste Tätigkeiten und Zeiten zu Deinem Auftrag nachvollziehen.",
                                ],
                            ].map(([title, text]) => (
                                <div key={title}>
                                    <dt>{title}</dt>
                                    <dd>{text}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </section>
                <section className="section wrap price-preview">
                    <div>
                        <h2>Was die Zusammenarbeit kostet</h2>
                        <p>
                            Du beauftragst einen beschriebenen Umfang zu einem
                            vereinbarten Gesamtpreis. Das Paket zur Vorbereitung
                            einer Selbstständigkeit beginnt bei{" "}
                            {money(findServicePackage("neustart")!.fromCents)}{" "}
                            einmalig – auch ohne fertige Geschäftsidee. Für
                            Websites, digitale Abläufe und vorhandene Auftritte
                            gibt es eigene Pakete.
                        </p>
                        <Link href="/preise" className="arrow-link">
                            Preise und Paketumfang{" "}
                            <ArrowUpRight size={17} aria-hidden="true" />
                        </Link>
                        <Link
                            href="/beruflich-neu-starten"
                            className="arrow-link mt-5"
                        >
                            Beruflich neu starten{" "}
                            <ArrowUpRight size={17} aria-hidden="true" />
                        </Link>
                    </div>
                    <div className="price-preview-card">
                        <h3>Das kostenlose Erstgespräch</h3>
                        <div className="price-amount">
                            0 €<span>/ 15 Minuten</span>
                        </div>
                        <p>
                            Du schilderst Deine Aufgabe. Wir besprechen, ob und
                            wie ich Dich unterstützen kann. Eine
                            kostenpflichtige Beauftragung entsteht daraus nicht.
                        </p>
                        <Link href="/kalender" className="button primary">
                            Freien Termin auswählen{" "}
                            <ArrowUpRight size={18} aria-hidden="true" />
                        </Link>
                    </div>
                </section>
            </main>
        </SiteShell>
    );
}
