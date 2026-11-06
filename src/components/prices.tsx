import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { money } from "@/server/config";
import {
    servicePackages,
    packageInquiryPath,
} from "@/content/service-packages";

export function Prices() {
    return (
        <>
            <p className="quiet-panel price-tax-note">
                Für diese Leistungen gilt die Steuerbefreiung für
                Kleinunternehmer gemäß § 19 UStG. Umsatzsteuer wird nicht
                gesondert ausgewiesen.
            </p>
            <div className="pricing-grid service-package-grid">
                {servicePackages.map((p) => (
                    <article
                        className={
                            "pricing-card " +
                            (p.key === "neustart" ? "featured" : "")
                        }
                        key={p.key}
                        id={p.key}
                    >
                        <h2>{p.name}</h2>
                        <div className="price-amount">
                            <span>ab</span> {money(p.fromCents)}
                            <span>einmalig</span>
                        </div>
                        <p>{p.audience}</p>
                        <p className="my-4">{p.description}</p>
                        <ul className="package-highlights">
                            {p.includes.slice(0, 3).map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                        <p className="package-result">
                            <strong>Dein Ergebnis</strong>
                            {p.result}
                        </p>
                        <details className="package-scope">
                            <summary>Leistungsumfang ansehen</summary>
                            <ul>
                                {p.includes.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                            <p>
                                <strong>Nicht enthalten:</strong> {p.excludes}
                            </p>
                            <p className="mt-4">
                                <strong>Für die Vorbereitung:</strong>{" "}
                                {p.prepare}
                            </p>
                        </details>
                        <Link
                            href={packageInquiryPath(p.key)}
                            className={
                                "button " +
                                (p.key === "neustart" ? "primary" : "")
                            }
                        >
                            Paket unverbindlich anfragen{" "}
                            <ArrowUpRight size={17} aria-hidden="true" />
                        </Link>
                    </article>
                ))}
            </div>
            <section className="information-grid">
                <div>
                    <h3>Vom Einstiegspreis zum Angebot</h3>
                    <p>
                        Der angegebene Preis gilt für den beschriebenen
                        Basisumfang. Nach Deiner Anfrage klären wir die Aufgabe,
                        benötigte Unterlagen und Änderungen am Umfang. Vor einer
                        Beauftragung erhältst Du ein Angebot mit dem
                        vollständigen Gesamtpreis und einem vereinbarten
                        Liefertermin.
                    </p>
                </div>
                <div>
                    <h3>Umfang und zusätzliche Aufgaben</h3>
                    <p>
                        Du beauftragst die im Angebot beschriebenen Ergebnisse.
                        Zusätzliche Aufgaben oder Korrekturrunden werden vorher
                        gesondert vereinbart. Eine laufende Betreuung und eine
                        automatische Verlängerung sind nicht enthalten.
                    </p>
                </div>
                <div>
                    <h3>Zahlung und Projektbeginn</h3>
                    <p>
                        Du prüfst und bestätigst das konkrete Angebot im
                        Kundenkonto. Die Zahlung erfolgt per Überweisung. Nach
                        geprüftem Zahlungseingang wird Dein Paketprojekt
                        angelegt. Externe Kosten entstehen nur nach vorheriger
                        Abstimmung und Zustimmung.
                    </p>
                </div>
            </section>
            <section className="package-intro-panel">
                <h2>Erst klären, welches Paket passt</h2>
                <p>
                    Wenn Du noch unsicher bist, kannst Du ein kostenloses
                    Erstgespräch buchen. Daraus entsteht keine kostenpflichtige
                    Beauftragung.
                </p>
                <Link href="/erstgespraech" className="button">
                    Kostenloses Erstgespräch{" "}
                    <ArrowUpRight size={17} aria-hidden="true" />
                </Link>
            </section>
        </>
    );
}
