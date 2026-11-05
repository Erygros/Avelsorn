import Link from "next/link";
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
            <div className="detail-grid service-detail-content">
                <div>
                    <section>
                        <h2>Für wen passt das?</h2>
                        <p>{detail.audience}</p>
                        <p>{detail.problem}</p>
                    </section>
                    <section>
                        <h2>Was ich konkret übernehme</h2>
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
            <Link className="arrow-link" href="/leistungen">
                Alle Leistungsbereiche ansehen ↗
            </Link>
        </>
    );
}
