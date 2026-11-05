import Link from "next/link";
import { SiteShell } from "./site-shell";
import { JsonLd } from "./json-ld";
import {
    searchPages,
    searchHubs,
    searchPagePath,
    sectionFor,
    type SearchPage,
} from "@/content/search";
import { searchStructuredData } from "@/content/search/structured";
import { services } from "@/content/pages";
import {
    findServicePackage,
    packageInquiryPath,
} from "@/content/service-packages";
import { baseUrl, money } from "@/server/config";

export function SearchCards({ pages }: { pages: SearchPage[] }) {
    return (
        <ul className="search-card-grid">
            {pages.map((page) => (
                <li key={searchPagePath(page)}>
                    <Link href={searchPagePath(page)}>
                        <h2>{page.heading}</h2>
                        <p>{page.description}</p>
                        <span className="arrow-link">
                            Ansehen <span aria-hidden="true">↗</span>
                        </span>
                    </Link>
                </li>
            ))}
        </ul>
    );
}
export function SearchHub({ hub }: { hub: (typeof searchHubs)[number] }) {
    const pages = searchPages.filter((page) =>
        (hub.kinds as readonly string[]).includes(page.kind),
    );
    return (
        <SiteShell>
            <main id="main">
                <header className="page-heading wrap">
                    <h1>{hub.title}</h1>
                    <p className="lead">{hub.description}</p>
                </header>
                <div className="page-body wrap">
                    {hub.path === "/branchen" && (
                        <p className="search-hub-note">
                            Die Seiten beschreiben mögliche Aufgaben und
                            passende Arbeitsweisen. Sie sind keine Liste
                            abgeschlossener Kundenprojekte. Falls Deine Branche
                            nicht genannt ist, kannst Du eine konkrete Aufgabe
                            trotzdem besprechen.
                        </p>
                    )}
                    <SearchCards pages={pages} />
                    <nav
                        className="search-related"
                        aria-label="Weitere Themenbereiche"
                    >
                        {searchHubs
                            .filter((item) => item.path !== hub.path)
                            .map((item) => (
                                <Link
                                    className="arrow-link"
                                    href={item.path}
                                    key={item.path}
                                >
                                    {item.name} ↗
                                </Link>
                            ))}
                        <Link className="arrow-link" href="/fragen">
                            Fragen zur Zusammenarbeit ↗
                        </Link>
                    </nav>
                </div>
            </main>
        </SiteShell>
    );
}
export async function SearchLanding({ page }: { page: SearchPage }) {
    const hub = searchHubs.find((item) => item.path === sectionFor(page.kind));
    return (
        <SiteShell>
            <main id="main">
                <JsonLd value={searchStructuredData(page, baseUrl())} />
                <header className="page-heading wrap search-heading">
                    <nav
                        className="breadcrumbs"
                        aria-label="Brotkrümelnavigation"
                    >
                        <Link href="/">Startseite</Link>
                        {hub && (
                            <>
                                <span aria-hidden="true">/</span>
                                <Link href={hub.path}>{hub.name}</Link>
                            </>
                        )}
                    </nav>
                    <h1>{page.heading}</h1>
                    <p className="lead">{page.answer}</p>
                    <div className="hero-cta">
                        {page.kind === "guide" ? (
                            <a className="button" href="#abschnitt-2">
                                Zur Vorlage oder Übersicht ↓
                            </a>
                        ) : (
                            <Link className="button primary" href="/kalender">
                                Kostenloses Erstgespräch ↗
                            </Link>
                        )}
                        <Link
                            className="arrow-link"
                            href={
                                page.kind === "guide" ? "/kalender" : "/preise"
                            }
                        >
                            {page.kind === "guide"
                                ? "Deine Aufgabe besprechen ↗"
                                : "Preise und Leistungsumfang ↗"}
                        </Link>
                    </div>
                </header>
                <div className="page-body wrap search-detail-layout">
                    <article className="search-article">
                        <nav
                            className="search-on-page"
                            aria-label="Auf dieser Seite"
                        >
                            {page.sections.map((section, index) => (
                                <a
                                    href={"#abschnitt-" + (index + 1)}
                                    key={section.title}
                                >
                                    {section.title}
                                </a>
                            ))}
                            <a href="#fragen">Fragen und Antworten</a>
                        </nav>
                        {page.sections.map((section, index) => (
                            <section
                                id={"abschnitt-" + (index + 1)}
                                key={section.title}
                            >
                                <h2>{section.title}</h2>
                                <p>{section.text}</p>
                                {section.items && (
                                    <ul>
                                        {section.items.map((item) => (
                                            <li key={item}>{item}</li>
                                        ))}
                                    </ul>
                                )}
                                {section.table && (
                                    <div
                                        className="search-table-region"
                                        role="region"
                                        aria-label={
                                            section.title + ": Übersicht"
                                        }
                                        tabIndex={0}
                                    >
                                        <table>
                                            <caption>{section.title}</caption>
                                            <thead>
                                                <tr>
                                                    {section.table.columns.map(
                                                        (column) => (
                                                            <th
                                                                scope="col"
                                                                key={column}
                                                            >
                                                                {column}
                                                            </th>
                                                        ),
                                                    )}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {section.table.rows.map(
                                                    (row) => (
                                                        <tr key={row[0]}>
                                                            {row.map(
                                                                (cell, i) =>
                                                                    i === 0 ? (
                                                                        <th
                                                                            scope="row"
                                                                            key={
                                                                                i
                                                                            }
                                                                        >
                                                                            {
                                                                                cell
                                                                            }
                                                                        </th>
                                                                    ) : (
                                                                        <td
                                                                            key={
                                                                                i
                                                                            }
                                                                        >
                                                                            {
                                                                                cell
                                                                            }
                                                                        </td>
                                                                    ),
                                                            )}
                                                        </tr>
                                                    ),
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </section>
                        ))}
                        <section>
                            <h2>Was Du vorbereiten kannst</h2>
                            <ul>
                                {page.prepare.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </section>
                        <section>
                            <h2>Umfang und Grenzen</h2>
                            <p>{page.boundary}</p>
                        </section>
                        <section id="fragen">
                            <h2>Fragen und Antworten</h2>
                            {page.questions.map((item) => (
                                <details
                                    className="search-question"
                                    key={item.question}
                                >
                                    <summary>{item.question}</summary>
                                    <p>{item.answer}</p>
                                </details>
                            ))}
                        </section>
                        <p className="search-editorial">
                            Redaktion: <Link href="/ueber-mich">Avelsorn</Link>{" "}
                            · Inhaltlicher Stand:{" "}
                            <time dateTime={page.updatedOn}>
                                {new Intl.DateTimeFormat("de-DE", {
                                    dateStyle: "long",
                                    timeZone: "UTC",
                                }).format(
                                    new Date(page.updatedOn + "T12:00:00Z"),
                                )}
                            </time>
                        </p>
                    </article>
                    <aside className="search-aside">
                        <section className="quiet-panel">
                            <h2>Deine Aufgabe besprechen</h2>
                            <p>
                                Im kostenlosen Telefon-Erstgespräch klären wir,
                                ob und wie ich Dich unterstützen kann. Daraus
                                entsteht keine kostenpflichtige Beauftragung.
                            </p>
                            <Link className="button primary" href="/kalender">
                                Kostenloses Erstgespräch ↗
                            </Link>
                        </section>
                        {page.services.length > 0 && (
                            <section>
                                <h2>Passende Leistungen</h2>
                                <ul>
                                    {page.services.map((slug) => {
                                        const service = services.find(
                                            (item) => item.slug === slug,
                                        )!;
                                        return (
                                            <li key={slug}>
                                                <Link
                                                    href={"/leistungen/" + slug}
                                                >
                                                    {service.title} ↗
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </section>
                        )}
                        <section>
                            <h2>Preise und Beauftragung</h2>
                            {page.packages.length ? (
                                page.packages.map((key) => {
                                    const p = findServicePackage(key)!;
                                    return (
                                        <div
                                            className="search-package"
                                            key={key}
                                        >
                                            <h3>{p.name}</h3>
                                            <p>
                                                ab {money(p.fromCents)} einmalig
                                            </p>
                                            <p>{p.result}</p>
                                            <Link
                                                className="arrow-link"
                                                href={"/preise#" + key}
                                            >
                                                Enthaltene Leistungen ↗
                                            </Link>
                                            <Link
                                                className="arrow-link"
                                                href={packageInquiryPath(key)}
                                            >
                                                Paket unverbindlich anfragen ↗
                                            </Link>
                                        </div>
                                    );
                                })
                            ) : (
                                <p>
                                    Für diese Aufgabe wird nach Klärung der
                                    Anforderungen ein individuelles Angebot
                                    erstellt.{" "}
                                    <Link href="/kontakt">
                                        Aufgabe beschreiben ↗
                                    </Link>
                                </p>
                            )}
                        </section>
                    </aside>
                </div>
                <section className="wrap search-related">
                    <h2>Passend dazu</h2>
                    <ul>
                        {page.related.map((path) => {
                            const related = searchPages.find(
                                (item) => searchPagePath(item) === path,
                            );
                            const relatedHub = searchHubs.find(
                                (item) => item.path === path,
                            );
                            const names: Record<string, string> = {
                                "/preise": "Preise und Paketumfang",
                                "/ablauf": "So arbeiten wir zusammen",
                                "/kalender": "Telefontermin auswählen",
                                "/ueber-mich": "Über Avelsorn",
                                "/kontakt": "Kontakt aufnehmen",
                                "/impressum": "Anbieterangaben",
                                "/beruflich-neu-starten":
                                    "Selbstständigkeit vorbereiten",
                                "/zielgruppen/gruender":
                                    "Unterstützung für Gründer",
                                "/leistungen/social-media":
                                    "Social-Media-Planung",
                            };
                            return (
                                <li key={path}>
                                    <Link href={path}>
                                        {related?.heading ??
                                            relatedHub?.name ??
                                            names[path] ??
                                            path}{" "}
                                        ↗
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </section>
            </main>
        </SiteShell>
    );
}
