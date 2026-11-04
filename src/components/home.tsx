import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteShell } from "./site-shell";
import { services } from "@/content/pages";
import { heroImage } from "@/content/editorial-images";
import { EditorialPhoto } from "./editorial-photo";
import { audiences, audiencePath } from "@/content/audiences";
import { money } from "@/server/config";
import { findServicePackage } from "@/content/service-packages";
import { BusinessProcesses } from "./business-processes";
import { ProfessionalNetwork } from "./professional-network";

export async function Home() {
    return (
        <SiteShell>
            <main id="main">
                <section className="hero wrap">
                    <div className="hero-copy">
                        <h1 className="hero-heading">
                            Beratung und Projektarbeit
                        </h1>
                        <p className="lead">
                            Ich erstelle Websites, richte digitale Abläufe ein
                            und unterstütze Dich bei Gründungs- und
                            Unternehmensfragen. Vor einer Zusammenarbeit klären
                            wir, welche Aufgabe Du abgeben möchtest, was ich
                            dafür benötige und welcher Aufwand entsteht.
                        </p>
                        <p className="hero-intro-note">
                            Im ersten Gespräch schilderst Du Dein Anliegen. Wir
                            klären, ob ich Dir dabei helfen kann. Das Gespräch
                            dauert 15 Minuten und kostet nichts.
                        </p>
                        <div className="hero-cta">
                            <Link
                                className="button primary"
                                href="/erstgespraech"
                            >
                                Erstgespräch vereinbaren{" "}
                                <ArrowUpRight size={18} aria-hidden="true" />
                            </Link>
                        </div>
                    </div>
                    <EditorialPhoto
                        asset={heroImage}
                        className="hero-photo"
                        sizes="(max-width: 640px) calc(100vw - 40px), (max-width: 1352px) 45vw, 554px"
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
                            Was ich für Dich übernehmen kann
                        </h2>
                        <p>
                            Du kannst eine einzelne Aufgabe beauftragen oder
                            zunächst Beratung dazu buchen. Auf den
                            Leistungsseiten beschreibe ich, welche Arbeiten
                            möglich sind und was wir dafür festlegen müssen.
                        </p>
                    </div>
                    <div className="home-service-list">
                        {services.slice(0, 6).map((service) => (
                            <Link
                                href={"/leistungen/" + service.slug}
                                key={service.slug}
                            >
                                <h3>{service.title}</h3>
                                <p>{service.short}</p>
                                <ArrowUpRight size={19} aria-hidden="true" />
                            </Link>
                        ))}
                    </div>
                    <Link className="arrow-link" href="/leistungen">
                        Alle Leistungen ansehen{" "}
                        <ArrowUpRight size={17} aria-hidden="true" />
                    </Link>
                </section>
                <BusinessProcesses />
                <div className="wrap">
                    <ProfessionalNetwork />
                </div>
                <section className="approach-section">
                    <div className="wrap approach">
                        <div>
                            <h2>Vor dem Auftrag klären wir die Aufgabe</h2>
                            <p>
                                Eine Website zu überarbeiten ist ein anderer
                                Auftrag als einen internen Ablauf einzurichten.
                                Deshalb halten wir fest, was Du benötigst,
                                welche Inhalte Du lieferst und woran Du das
                                Ergebnis prüfen kannst.
                            </p>
                            <Link className="button" href="/ablauf">
                                Ablauf der Zusammenarbeit{" "}
                                <ArrowUpRight size={18} aria-hidden="true" />
                            </Link>
                        </div>
                        <ol className="process-list">
                            <li>
                                <span aria-hidden="true">01</span>
                                <div>
                                    <h3>Aufgabe besprechen</h3>
                                    <p>
                                        Du beschreibst im Erstgespräch, was
                                        ansteht und welche Unterlagen oder
                                        Systeme bereits vorhanden sind.
                                    </p>
                                </div>
                            </li>
                            <li>
                                <span aria-hidden="true">02</span>
                                <div>
                                    <h3>Umfang und Aufwand festhalten</h3>
                                    <p>
                                        Wir vereinbaren Aufgaben, benötigte
                                        Zugänge und Freigaben. Du entscheidest
                                        über eine kostenpflichtige Beauftragung.
                                    </p>
                                </div>
                            </li>
                            <li>
                                <span aria-hidden="true">03</span>
                                <div>
                                    <h3>Arbeitsergebnisse prüfen</h3>
                                    <p>
                                        Im Kundenportal findest Du die zu Deinem
                                        Auftrag gehörenden Dateien,
                                        Zeitnachweise und Rückfragen. Änderungen
                                        stimmen wir dort ab.
                                    </p>
                                </div>
                            </li>
                        </ol>
                    </div>
                </section>
                <section className="section wrap price-preview">
                    <div>
                        <h2>Was die Zusammenarbeit kostet</h2>
                        <p>
                            Du beauftragst ein beschriebenes Leistungspaket.
                            Wenn Du Dich beruflich verändern und eine
                            Selbstständigkeit prüfen möchtest, beginnt das
                            Einstiegspaket bei{" "}
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
                            Paket für den beruflichen Einstieg ansehen ↗
                        </Link>
                    </div>
                    <div className="price-preview-card">
                        <h3>Das kostenlose Erstgespräch</h3>
                        <div className="price-amount">
                            0 €<span>/ 15 Minuten</span>
                        </div>
                        <p>
                            Wir besprechen Deine Aufgabe und ob ich sie
                            übernehmen kann. Für die Terminbuchung legst Du ein
                            Konto an, bestätigst Deine E-Mail-Adresse und füllst
                            den Fragebogen aus.
                        </p>
                        <Link href="/erstgespraech" className="button primary">
                            Zur Terminbuchung{" "}
                            <ArrowUpRight size={18} aria-hidden="true" />
                        </Link>
                    </div>
                </section>
            </main>
        </SiteShell>
    );
}
