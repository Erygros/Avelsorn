import Link from "next/link";
import { JsonLd } from "./json-ld";
import { baseUrl } from "@/server/config";
import { findSearchPage } from "@/content/search";
import {
    serviceSearchLinks,
    serviceQuestions,
} from "@/content/search/service-links";
import type { Service } from "@/content/pages";
import { serviceDetails } from "@/content/service-details";
import {
    findServicePackage,
    packageInquiryPath,
} from "@/content/service-packages";
import { money } from "@/server/config";

export function ServiceDetail({ service }: { service: Service }) {
    const detail = serviceDetails[service.slug];
    return (
        <>
            <JsonLd
                value={{
                    "@context": "https://schema.org",
                    "@graph": [
                        {
                            "@type": "Service",
                            "@id":
                                baseUrl() +
                                "/leistungen/" +
                                service.slug +
                                "#service",
                            name: service.title,
                            description: service.description,
                            url: baseUrl() + "/leistungen/" + service.slug,
                            provider: { "@id": baseUrl() + "/#avelsorn" },
                        },
                        {
                            "@type": "BreadcrumbList",
                            itemListElement: [
                                {
                                    "@type": "ListItem",
                                    position: 1,
                                    name: "Startseite",
                                    item: baseUrl() + "/",
                                },
                                {
                                    "@type": "ListItem",
                                    position: 2,
                                    name: "Leistungen",
                                    item: baseUrl() + "/leistungen",
                                },
                                {
                                    "@type": "ListItem",
                                    position: 3,
                                    name: service.title,
                                    item:
                                        baseUrl() +
                                        "/leistungen/" +
                                        service.slug,
                                },
                            ],
                        },
                    ],
                }}
            />
            <div className="detail-grid service-detail-content">
                <div>
                    <section>
                        <h2>Für wen passt das?</h2>
                        <p>{detail.audience}</p>
                        <p>{detail.problem}</p>
                    </section>
                    <section>
                        <h2>Was wir konkret übernehmen</h2>
                        <ul className="editorial-list">
                            {service.topics.map((topic) => (
                                <li key={topic}>{topic}</li>
                            ))}
                        </ul>
                    </section>
                    <section>
                        <h2>So arbeiten wir zusammen</h2>
                        <p>{detail.process}</p>
                        <Link href="/ablauf" className="arrow-link">
                            Vom Erstgespräch zum Auftrag ↗
                        </Link>
                    </section>
                    <section>
                        <h2>Was Du erhältst</h2>
                        <p>{service.outcome}</p>
                    </section>
                    <section>
                        <h2>Was wir dafür benötigen</h2>
                        <p>{detail.preparation}</p>
                    </section>
                </div>
                <aside className="quiet-panel service-price-panel">
                    <h2>Umfang und Preis</h2>
                    <p>
                        Vor der Beauftragung erhältst Du ein Angebot mit
                        beschriebenem Ergebnis, Gesamtpreis und Liefertermin.
                        Die Anfrage ist unverbindlich.
                    </p>
                    {detail.packages.map((key) => {
                        const p = findServicePackage(key)!;
                        return (
                            <div className="service-package-link" key={key}>
                                <h3>{p.name}</h3>
                                <p>ab {money(p.fromCents)} einmalig</p>
                                <Link
                                    className="arrow-link"
                                    href={"/preise#" + key}
                                >
                                    Leistungsumfang ansehen ↗
                                </Link>
                                <Link
                                    className="arrow-link"
                                    href={packageInquiryPath(key)}
                                >
                                    Paket anfragen ↗
                                </Link>
                            </div>
                        );
                    })}
                    {!detail.packages.length && (
                        <p>
                            Für ein abgegrenztes Thema erstellen wir ein
                            individuelles Angebot.
                        </p>
                    )}
                    <Link href="/kalender" className="button primary">
                        Im kostenlosen Erstgespräch klären ↗
                    </Link>
                </aside>
            </div>
            <section className="search-article supplementary-service">
                <h2>Häufig gefragt</h2>
                {serviceQuestions[service.slug].map((item) => (
                    <details className="search-question" key={item.question}>
                        <summary>{item.question}</summary>
                        <p>{item.answer}</p>
                    </details>
                ))}
            </section>
            <section className="search-related">
                <h2>Aufgaben und Vorbereitung</h2>
                <ul>
                    {serviceSearchLinks[service.slug].map((path) => (
                        <li key={path}>
                            <Link href={path}>
                                {findSearchPage(path)?.heading ??
                                    "Selbstständigkeit vorbereiten"}{" "}
                                ↗
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>
            <Link className="arrow-link" href="/leistungen">
                Alle Leistungsbereiche ansehen ↗
            </Link>
        </>
    );
}
