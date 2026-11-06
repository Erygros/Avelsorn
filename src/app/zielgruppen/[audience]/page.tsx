import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { audiences, audiencePath, findAudience } from "@/content/audiences";
import { services } from "@/content/pages";
import { BRAND } from "@/content/brand";
import { SiteShell } from "@/components/site-shell";
import { baseUrl } from "@/server/config";

type Props = { params: Promise<{ audience: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const audience = findAudience((await params).audience);
    if (!audience) notFound();
    const url = baseUrl() + audiencePath(audience);
    return {
        title: audience.title,
        description: audience.description,
        alternates: { canonical: url },
        openGraph: {
            title: audience.title + " · " + BRAND.name,
            description: audience.description,
            url,
            siteName: BRAND.name,
            locale: "de_DE",
            type: "website",
        },
    };
}

export default async function AudiencePage({ params }: Props) {
    const audience = findAudience((await params).audience);
    if (!audience) notFound();
    const url = baseUrl() + audiencePath(audience);
    const breadcrumbs = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Startseite",
                item: baseUrl(),
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Für wen wir arbeiten",
                item: baseUrl() + "/zielgruppen",
            },
            {
                "@type": "ListItem",
                position: 3,
                name: audience.name,
                item: url,
            },
        ],
    };
    return (
        <SiteShell>
            <main id="main" className="audience-page">
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(breadcrumbs).replace(
                            /</g,
                            "\\u003c",
                        ),
                    }}
                />
                <header className="audience-heading wrap">
                    <nav
                        className="breadcrumbs"
                        aria-label="Brotkrümelnavigation"
                    >
                        <Link href="/">Startseite</Link>
                        <span aria-hidden="true">/</span>
                        <Link href="/zielgruppen">Für wen wir arbeiten</Link>
                        <span aria-hidden="true">/</span>
                        <span aria-current="page">{audience.name}</span>
                    </nav>
                    <h1>{audience.heading}</h1>
                    <p className="lead">{audience.intro}</p>
                    <Link href="/erstgespraech" className="button primary">
                        Anliegen im Erstgespräch besprechen{" "}
                        <ArrowUpRight size={18} aria-hidden="true" />
                    </Link>
                    <p className="audience-booking-note">
                        15 Minuten · kostenlos · per Telefon oder Video
                    </p>
                </header>
                <div className="wrap audience-layout">
                    <div>
                        <section aria-labelledby="audience-topics">
                            <h2 id="audience-topics">
                                Wobei wir Dich unterstützen können
                            </h2>
                            <div className="audience-topics">
                                {audience.situations.map((s) => (
                                    <article key={s.title}>
                                        <h3>{s.title}</h3>
                                        <p>{s.text}</p>
                                    </article>
                                ))}
                            </div>
                        </section>
                        <section
                            className="audience-example"
                            aria-labelledby="audience-example-title"
                        >
                            <h2 id="audience-example-title">
                                {audience.example.title}
                            </h2>
                            <p>{audience.example.text}</p>
                            <p>{audience.example.result}</p>
                        </section>
                        <section
                            className="audience-faq"
                            aria-labelledby="audience-questions"
                        >
                            <h2 id="audience-questions">
                                Fragen zur Zusammenarbeit
                            </h2>
                            {audience.questions.map((q) => (
                                <details key={q.question}>
                                    <summary>{q.question}</summary>
                                    <p>{q.answer}</p>
                                </details>
                            ))}
                        </section>
                    </div>
                    <aside className="audience-sidebar">
                        <section className="quiet-panel">
                            <h2>Für das erste Gespräch</h2>
                            <p>
                                Diese Fragen helfen uns, Deine Aufgabe
                                einzugrenzen:
                            </p>
                            <ul>
                                {audience.prepare.map((q) => (
                                    <li key={q}>{q}</li>
                                ))}
                            </ul>
                            <p>
                                Danach besprechen wir einen möglichen Umfang,
                                benötigte Inhalte und den Aufwand. Du
                                entscheidest, ob Du eine kostenpflichtige
                                Zusammenarbeit beauftragen möchtest.
                            </p>
                            <Link href="/preise" className="arrow-link">
                                Preise und Angebote ansehen{" "}
                                <ArrowUpRight size={16} aria-hidden="true" />
                            </Link>
                        </section>
                        <section
                            className="audience-services"
                            aria-labelledby="audience-services-title"
                        >
                            <h2 id="audience-services-title">
                                Passende Leistungen
                            </h2>
                            {audience.services
                                .map((slug) =>
                                    services.find((s) => s.slug === slug),
                                )
                                .filter((s) => s !== undefined)
                                .map((s) => (
                                    <Link
                                        key={s.slug}
                                        href={`/leistungen/${s.slug}`}
                                    >
                                        {s.title}
                                        <ArrowUpRight
                                            size={17}
                                            aria-hidden="true"
                                        />
                                    </Link>
                                ))}
                            <Link href="/ablauf">
                                Ablauf der Zusammenarbeit
                                <ArrowUpRight size={17} aria-hidden="true" />
                            </Link>
                        </section>
                    </aside>
                </div>
                <section
                    className="audience-related wrap"
                    aria-labelledby="audience-related-title"
                >
                    <h2 id="audience-related-title">
                        Auch eine andere Situation kann passen
                    </h2>
                    <nav aria-label="Weitere Zielgruppen">
                        {audiences
                            .filter((a) => a.slug !== audience.slug)
                            .map((a) => (
                                <Link href={audiencePath(a)} key={a.slug}>
                                    {a.name}
                                    <ArrowUpRight
                                        size={16}
                                        aria-hidden="true"
                                    />
                                </Link>
                            ))}
                    </nav>
                </section>
            </main>
        </SiteShell>
    );
}
