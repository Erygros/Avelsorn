import { notFound, permanentRedirect } from "next/navigation";
import Link from "next/link";
import { eq, and, lte, desc } from "drizzle-orm";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { AuthPage } from "@/components/auth-page";
import { Prices } from "@/components/prices";
import { ActionForm } from "@/components/action-form";
import { services } from "@/content/pages";
import { legal } from "@/content/legal";
import { business } from "@/server/settings";
import { db } from "@/server/db";
import { posts, pages } from "@/server/schema";
import { publicHtml } from "@/server/content";
import { baseUrl } from "@/server/config";
import { EditorialPhoto } from "@/components/editorial-photo";
import { articleImage } from "@/content/editorial-images";
import { audiences, audiencePath } from "@/content/audiences";
import { ProfessionalNetwork } from "@/components/professional-network";

import { ServiceGroups } from "@/components/service-groups";
import { ServiceDetail } from "@/components/service-detail";

import { findSearchPage, searchHubs } from "@/content/search";
import { searchMetadata } from "@/content/search/structured";
import { articleSearchLinks } from "@/content/search/service-links";
import { SearchLanding, SearchHub } from "@/components/search-content";
import { JsonLd } from "@/components/json-ld";

const authTitles: Record<string, string> = {
    anmelden: "Anmelden",
    registrieren: "Konto erstellen",
    "passwort-vergessen": "Passwort zurücksetzen",
    "passwort-zuruecksetzen": "Neues Passwort festlegen",
    "email-bestaetigen": "E-Mail-Adresse bestätigen",
    zustimmung: "Der Kontonutzung zustimmen",
    vertragszustimmung: "Zustimmung zur Bestellung",
    otp: "Einmalcode eingeben",
    einrichtung: "Administration einrichten",
};
const authSlugs = Object.keys(authTitles);
const publicAliases: Record<string, string> = {
    terminbuchung: "erstgespraech",
    datenschutzerklaerung: "datenschutz",
    widerrufsformular: "widerruf",
};
type Props = {
    params: Promise<{ slug: string[] }>;
    searchParams: Promise<Record<string, string | undefined>>;
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const requestedPath = (await params).slug.join("/");
    const path = publicAliases[requestedPath] ?? requestedPath;
    const searchPage = findSearchPage("/" + path);
    if (searchPage) return searchMetadata(searchPage, "/" + path, baseUrl());
    const hub = searchHubs.find((item) => item.path === "/" + path);
    if (hub)
        return searchMetadata(
            { title: hub.title, description: hub.description },
            hub.path,
            baseUrl(),
        );
    const service = services.find(
        (s) => path === "leistungen/" + s.slug || path === s.slug,
    );
    const document = legal[path];
    if (authSlugs.includes(path))
        return {
            title: authTitles[path],
            robots: { index: false, follow: false },
            referrer: "no-referrer",
        };
    const names: Record<string, string> = {
        preise: "Preise & Zusammenarbeit",
        leistungen: "Leistungen",
        erstgespraech: "Dein kostenloses Erstgespräch",
        kontakt: "Kontakt",
        ablauf: "So arbeiten wir zusammen",
        zielgruppen: "Zielgruppen: Beratung und Projektarbeit",
        "ueber-mich": "Über Avelsorn",
        blog: "Artikel zu Websites, Arbeitsabläufen und Selbstständigkeit",
        widerruf: "Vertrag widerrufen",
    };
    const descriptions: Record<string, string> = {
        preise: "Sieben Leistungspakete mit Einstiegspreisen, enthaltenen Aufgaben und konkreten Ergebnissen. Individuelles Angebot vor der Beauftragung, Zahlung per Überweisung.",
        leistungen:
            "Unternehmensberatung, digitale Unternehmenslösungen und Onlinepräsenz: konkrete Aufgaben, persönliche Abstimmung und praktische Umsetzung durch Avelsorn.",
        erstgespraech:
            "Buche Dein kostenloses 15-minütiges Telefonat mit Enrico Gross. Termin auswählen und Kontaktdaten angeben – auch ohne Kundenkonto.",
        kontakt:
            "Besprich Deine Frage mit Enrico Gross bei Avelsorn. Kontakt per Telefon, E-Mail oder Formular; für Projektfragen steht Kunden der geschützte Chat zur Verfügung.",
        ablauf: "So entsteht Dein Auftrag bei Avelsorn: Erstgespräch, konkretes Angebot, vereinbarte Umsetzung und dokumentierte Ergebnisse im Kundenportal.",
        zielgruppen:
            "Beratung und Projektarbeit für Unternehmen, Selbstständige, Gründer, Freelancer und Creator. Finde die Unterstützung passend zu Deiner Situation.",
        "ueber-mich":
            "Enrico Gross ist Dein persönlicher Ansprechpartner bei Avelsorn. Erfahre, welche Arbeiten wir übernehmen und wie wir Beratung und digitale Umsetzung verbinden.",
        blog: "Praktische Beiträge zu Websites, digitalen Arbeitsabläufen, Social Media, Gründung und Selbstständigkeit von Avelsorn.",
    };
    const [custom] = await db()
        .select()
        .from(pages)
        .where(eq(pages.slug, path));
    const [post] = path.startsWith("blog/")
        ? await db()
              .select()
              .from(posts)
              .where(
                  and(
                      eq(posts.slug, path.slice(5)),
                      eq(posts.status, "published"),
                      lte(posts.publishAt, new Date()),
                  ),
              )
        : [];
    const image = post ? articleImage(post.slug) : undefined;
    return {
        title:
            post?.seoTitle ??
            post?.title ??
            custom?.title ??
            service?.title ??
            document?.title ??
            names[path] ??
            "Seite nicht gefunden",
        description:
            post?.metaDescription ??
            post?.excerpt ??
            custom?.description ??
            service?.short ??
            document?.description ??
            descriptions[path] ??
            "Informationen von Avelsorn zu persönlicher Beratung und digitaler Umsetzung.",
        openGraph: {
            type: post ? "article" : "website",
            locale: "de_DE",
            siteName: "Avelsorn",
            title:
                post?.title ??
                custom?.title ??
                service?.title ??
                document?.title ??
                names[path] ??
                "Avelsorn",
            description:
                post?.metaDescription ??
                post?.excerpt ??
                custom?.description ??
                service?.short ??
                document?.description ??
                descriptions[path] ??
                "Persönliche Beratung und praktische Umsetzung bei Avelsorn.",
            url: "/" + (service ? "leistungen/" + service.slug : path),
            images: image
                ? [
                      {
                          url: image.src.src,
                          width: image.src.width,
                          height: image.src.height,
                          alt: image.alt,
                      },
                  ]
                : [
                      {
                          url: "/brand/avelsorn-logo.png",
                          width: 3200,
                          height: 712,
                          alt: "Avelsorn",
                      },
                  ],
        },
        alternates: {
            canonical:
                baseUrl() +
                "/" +
                (service ? "leistungen/" + service.slug : path),
        },
    };
}
export default async function PublicPage({ params, searchParams }: Props) {
    const requestedPath = (await params).slug.join("/");
    const path = publicAliases[requestedPath] ?? requestedPath;
    const query = await searchParams;
    const searchPage = findSearchPage("/" + path);
    if (searchPage) return <SearchLanding page={searchPage} />;
    const hub = searchHubs.find((item) => item.path === "/" + path);
    if (hub) return <SearchHub hub={hub} />;
    if (/^(branchen|loesungen|wissen)\//.test(path)) notFound();
    if (publicAliases[requestedPath]) permanentRedirect("/" + path);
    const aliasService = services.find((item) => item.slug === requestedPath);
    if (aliasService) permanentRedirect("/leistungen/" + aliasService.slug);
    if (authSlugs.includes(path))
        return (
            <AuthPage slug={path} token={query.token} returnTo={query.next} />
        );
    const [customPage] = await db()
        .select()
        .from(pages)
        .where(eq(pages.slug, path));
    const customHtml = customPage ? await publicHtml(customPage.body) : "";
    if (customPage && !legal[path])
        return (
            <SiteShell>
                <main id="main">
                    <section className="page-heading wrap">
                        <h1>{customPage.title}</h1>
                        <p className="lead">{customPage.description}</p>
                    </section>
                    <article
                        className="prose page-body"
                        dangerouslySetInnerHTML={{
                            __html: customHtml,
                        }}
                    />
                </main>
            </SiteShell>
        );
    const service = services.find(
        (s) => path === "leistungen/" + s.slug || path === s.slug,
    );
    const document =
        legal[path === "datenschutzerklaerung" ? "datenschutz" : path];
    let title = "",
        intro = "";
    let body: React.ReactNode;
    if (service) {
        title = service.headline;
        intro = service.description;

        body = <ServiceDetail service={service} />;
    } else if (path === "leistungen") {
        title = "Beratung und digitale Umsetzung";
        intro =
            "Unternehmensberatung, digitale Unternehmenslösungen und Onlinepräsenz: Finde den Bereich, der zu Deiner Aufgabe passt. Umfang und Ergebnis stimmen wir vor einer Beauftragung ab.";
        body = (
            <>
                <ServiceGroups overview />
                <section className="supplementary-service">
                    <h2>Konkrete digitale Aufgaben</h2>
                    <p>
                        Von der Anfrage bis zur Freigabe: Die Lösungsseiten
                        erklären mögliche Umsetzungen und benötigte
                        Vorbereitungen.
                    </p>
                    <Link className="arrow-link" href="/loesungen">
                        Digitale Lösungen ansehen ↗
                    </Link>
                    <h2 className="mt-8">Ergänzend: Finanzgrundlagen</h2>
                    <p>
                        Allgemeine Wissensvermittlung zu Märkten, Kosten und
                        Risiken. Keine individuelle Anlageberatung oder
                        persönlichen Produktempfehlungen.
                    </p>
                    <Link className="arrow-link" href="/leistungen/trading-etf">
                        Trading- und ETF-Grundlagen ansehen ↗
                    </Link>
                </section>
            </>
        );
    } else if (path === "preise") {
        title = "Preise und Buchung";
        intro =
            "Das Erstgespräch ist kostenlos. Für weitere Leistungen fragst Du ein Paket an. Nach Klärung der Aufgabe erhältst Du Umfang, Liefertermin und Gesamtpreis als konkretes Angebot. Eine Anfrage ist noch keine Bestellung.";

        body = <Prices />;
    } else if (path === "erstgespraech" || path === "terminbuchung") {
        title = "Ein kostenloses Erstgespräch buchen";
        intro =
            "Im 15-minütigen Erstgespräch beschreibst Du Deine Aufgabe. Wir klären, ob wir sie übernehmen können und was dafür benötigt wird. Das Gespräch kostet nichts; eine weitere Beauftragung entscheidest Du danach.";

        body = (
            <div className="detail-grid">
                <ol className="process-list">
                    <li>
                        <span>01</span>
                        <div>
                            <h2>Freien Termin auswählen</h2>
                            <p>
                                Wähle im Kalender einen Tag und eine freie
                                Uhrzeit für Dein 15-minütiges Gespräch.
                            </p>
                        </div>
                    </li>
                    <li>
                        <span>02</span>
                        <div>
                            <h2>Kontaktdaten angeben</h2>
                            <p>
                                Gib Vorname, Nachname, E-Mail-Adresse,
                                Telefonnummer und Dein Anliegen an. Ein
                                Kundenkonto ist dafür nicht erforderlich.
                            </p>
                        </div>
                    </li>
                    <li>
                        <span>03</span>
                        <div>
                            <h2>Telefonnummer bestätigen</h2>
                            <p>
                                Prüfe Deine Kontaktdaten und bestätige den
                                kostenlosen Termin. Wir rufen Dich zur
                                vereinbarten Uhrzeit an.
                            </p>
                        </div>
                    </li>
                </ol>
                <aside className="quiet-panel">
                    <h2>Termin auswählen</h2>
                    <p className="offer-facts">15 Minuten · 0 €</p>
                    <p>
                        Eine kurze Beschreibung Deiner Aufgabe reicht für das
                        Gespräch. Notiere gern, welche Fragen Du klären
                        möchtest.
                    </p>
                    <div className="intro-actions">
                        <Link className="button primary" href="/kalender">
                            Freien Termin auswählen ↗
                        </Link>
                    </div>
                </aside>
            </div>
        );
    } else if (path === "ablauf") {
        title = "So läuft ein Auftrag ab";
        intro =
            "Das Erstgespräch kannst Du ohne Kundenkonto buchen. Für einen anschließenden Auftrag nutzen wir Dein Kundenkonto: Dort findest Du Projektdateien, Rückfragen und Dokumente.";

        body = (
            <ol className="process-list wide-process">
                {[
                    [
                        "Kennenlernen",
                        "Du wählst einen freien Termin und bestätigst die benötigten Kontaktdaten. In 15 kostenlosen Minuten besprechen wir Deine Ausgangslage.",
                    ],
                    [
                        "Auftrag festlegen",
                        "Wir halten fest, welche Aufgabe bearbeitet werden soll und welche Inhalte oder Zugänge Du bereitstellst. Danach entscheidest Du über das konkrete Angebot für Dein Leistungspaket.",
                    ],
                    [
                        "Aufgaben bearbeiten",
                        "Wir vereinbaren Aufgaben und Termine. Im Kundenportal siehst Du Projekte, Zeitnachweise, Dateien und Freigaben. Fragen klären wir im eigenen Chat.",
                    ],
                    [
                        "Ergebnisse und Abrechnung prüfen",
                        "Im Portal kannst Du Zeitnachweise und Belege zu Deinem Auftrag einsehen. Wir klären Rückmeldungen zu den Ergebnissen. Weitere Leistungen benötigen eine neue ausdrückliche Beauftragung.",
                    ],
                ].map(([name, text], i) => (
                    <li key={name}>
                        <span>0{i + 1}</span>
                        <div>
                            <h2>{name}</h2>
                            <p>{text}</p>
                        </div>
                    </li>
                ))}
            </ol>
        );
    } else if (path === "zielgruppen") {
        title = "Für wen wir arbeiten";
        intro =
            "Die Aufgaben unterscheiden sich je nachdem, ob Du einen Betrieb führst, Deine Selbstständigkeit vorbereitest oder projektweise arbeitest. Hier findest Du die Unterstützung passend zu Deiner Situation.";
        body = (
            <>
                <div className="service-grid">
                    {audiences.map((audience) => (
                        <Link
                            className="service-card"
                            key={audience.slug}
                            href={audiencePath(audience)}
                        >
                            <h2>{audience.name}</h2>
                            <p>{audience.summary}</p>
                            <span className="arrow-link">
                                Aufgaben und Unterstützung ansehen{" "}
                                <ArrowUpRight size={17} aria-hidden="true" />
                            </span>
                        </Link>
                    ))}
                </div>
                <section className="supplementary-service">
                    <h2>Welche Aufgabe steht in Deinem Betrieb an?</h2>
                    <p>
                        In den Branchenbeispielen findest Du konkrete
                        Anforderungen, mögliche Abläufe und Grenzen der
                        technischen Umsetzung.
                    </p>
                    <Link className="arrow-link" href="/branchen">
                        Branchen und Aufgaben ansehen ↗
                    </Link>
                    <Link className="arrow-link" href="/loesungen">
                        Digitale Lösungen nach Aufgabe ↗
                    </Link>
                </section>
            </>
        );
    } else if (path === "ueber-mich") {
        const values = await business();
        title = "Über Avelsorn";
        intro =
            "Enrico Gross ist Dein Ansprechpartner bei Avelsorn. Wir beraten Dich zu unternehmerischen Fragen und setzen vereinbarte Arbeiten an Websites und digitalen Abläufen um.";
        body = (
            <div className="prose">
                {values.about_text && !values.about_text.includes("{{") ? (
                    <section>
                        <h2>
                            {values.legal_full_name.includes("{{")
                                ? "Persönliche Vorstellung"
                                : values.legal_full_name}
                        </h2>
                        <p className="whitespace-pre-line">
                            {values.about_text}
                        </p>
                    </section>
                ) : (
                    <p>
                        Bei Avelsorn besprichst Du Dein Vorhaben direkt mit
                        Enrico Gross. Wir klären gemeinsam, welche Aufgabe wir
                        für Dich übernehmen können und welche Fragen andere
                        Fachpersonen benötigen.
                    </p>
                )}
                <h2>Was wir übernehmen</h2>
                <p>
                    Du kannst Beratung zu einer Aufgabe buchen oder die
                    Bearbeitung beauftragen. Bei einer Website legen wir
                    beispielsweise Seiten, Inhalte und Funktionen fest. Bei
                    einem Arbeitsablauf beschreiben wir die einzelnen Schritte
                    und prüfen die vorhandenen Werkzeuge. Änderungen am Umfang
                    und zusätzliche Kosten besprechen wir, bevor wir daran
                    arbeiten.
                </p>
                <h2>Wie wir zusammenarbeiten</h2>
                <p>
                    Du erhältst vorab ein konkretes Angebot. Während der
                    Bearbeitung halten wir Aufgaben, Rückfragen und Freigaben im
                    Kundenportal fest. Wenn sich der Umfang ändert, stimmen wir
                    das ab, bevor zusätzliche Arbeit entsteht.
                </p>
                <h2>Warum Beratung und Umsetzung zusammengehören</h2>
                <p>
                    Ein Vorschlag hilft erst, wenn er zu Deinem Alltag passt.
                    Deshalb klären wir schon in der Planung, welche Inhalte,
                    Daten und Entscheidungen für die Umsetzung gebraucht werden.
                    Anschließend setzen wir die vereinbarten digitalen Arbeiten
                    um.
                </p>
                <ProfessionalNetwork />
                <Link href="/kalender" className="button">
                    Kostenloses Erstgespräch vereinbaren ↗
                </Link>
            </div>
        );
    } else if (path === "kontakt") {
        const values = await business();
        title = "Kontakt aufnehmen";
        intro =
            "Beschreibe kurz Dein Anliegen. Bitte sende hier keine vertraulichen Dokumente oder besonders sensiblen Daten. Bestehende Kunden nutzen für Projektfragen den geschützten Chat.";
        body = (
            <div className="detail-grid">
                <section className="form-panel">
                    <ActionForm
                        action="contact"
                        fields={[
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
                                name: "subject",
                                label: "Worum geht es?",
                                required: true,
                            },
                            {
                                name: "body",
                                label: "Deine Nachricht",
                                type: "textarea",
                                required: true,
                            },
                            {
                                name: "consent",
                                label: "Ich habe die Datenschutzhinweise zur Bearbeitung meiner Anfrage gelesen.",
                                type: "checkbox",
                                required: true,
                            },
                        ]}
                        submit="Anfrage senden"
                    />
                </section>
                <aside className="quiet-panel contact-aside">
                    <h2>Kontakt</h2>
                    {values.contact_email &&
                        !values.contact_email.includes("{{") && (
                            <p className="mt-4">
                                <a
                                    className="arrow-link"
                                    href={"mailto:" + values.contact_email}
                                >
                                    {values.contact_email}
                                </a>
                            </p>
                        )}
                    {values.public_phone &&
                        !values.public_phone.includes("{{") && (
                            <p className="mt-4">
                                <a
                                    className="arrow-link"
                                    href={
                                        "tel:" +
                                        values.public_phone.replace(
                                            /[^+\d]/g,
                                            "",
                                        )
                                    }
                                >
                                    {values.public_phone}
                                </a>
                            </p>
                        )}
                    {values.contact_hours &&
                        !values.contact_hours.includes("{{") && (
                            <p className="mt-4 mb-8">{values.contact_hours}</p>
                        )}
                    <h2>Kostenloses Erstgespräch</h2>
                    <p>
                        Wenn Du zunächst klären möchtest, ob wir Deine Aufgabe
                        übernehmen können, kannst Du ein kostenloses
                        Erstgespräch vereinbaren.
                    </p>
                    <Link href="/erstgespraech" className="button">
                        Mehr zum Erstgespräch ↗
                    </Link>
                </aside>
            </div>
        );
    } else if (document) {
        title = customPage?.title ?? document.title;
        intro = customPage?.description ?? document.description;

        const values = await business();
        body = (
            <div className="prose legal-prose">
                {["impressum", "datenschutz", "widerrufsbelehrung"].includes(
                    path,
                ) && (
                    <address>
                        {values.legal_full_name}
                        <br />
                        {values.business_street}
                        <br />
                        {values.business_postcode} {values.business_city}
                        <br />
                        {values.business_country}
                        <br />
                        <a href={"mailto:" + values.contact_email}>
                            {values.contact_email}
                        </a>
                        <br />
                        {values.public_phone.includes("{{") ? (
                            "Telefonnummer noch nicht hinterlegt"
                        ) : (
                            <a
                                href={
                                    "tel:" +
                                    values.public_phone.replace(/[^+\d]/g, "")
                                }
                            >
                                {values.public_phone}
                            </a>
                        )}
                        {values.contact_hours &&
                            !values.contact_hours.includes("{{") && (
                                <>
                                    <br />
                                    {values.contact_hours}
                                </>
                            )}
                        {path === "impressum" &&
                            values.vat_id_if_available &&
                            !values.vat_id_if_available.includes("{{") && (
                                <p>
                                    Umsatzsteuer-Identifikationsnummer:{" "}
                                    {values.vat_id_if_available}
                                </p>
                            )}
                    </address>
                )}
                {customPage ? (
                    <div dangerouslySetInnerHTML={{ __html: customHtml }} />
                ) : (
                    document.sections.map((section) => (
                        <section key={section.title}>
                            <h2>{section.title}</h2>
                            <p>{section.text}</p>
                            {section.links && (
                                <ul>
                                    {section.links.map((link) => (
                                        <li key={link.href}>
                                            <a href={link.href}>{link.label}</a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    ))
                )}
                {path === "impressum" && (
                    <section>
                        <h2>Verantwortlich für redaktionelle Inhalte</h2>
                        <p>
                            Verantwortlich im Sinne von § 18 Abs. 2 MStV:{" "}
                            {values.legal_full_name}, {values.business_street},{" "}
                            {values.business_postcode} {values.business_city}.
                        </p>
                    </section>
                )}
                {path === "widerrufsbelehrung" && (
                    <section>
                        <h2>Muster-Widerrufsformular</h2>
                        <p>
                            Wenn Du den Vertrag widerrufen möchtest, kannst Du
                            die folgende Erklärung übernehmen und ausgefüllt an
                            uns senden:
                        </p>
                        <blockquote>
                            <p>
                                An {values.legal_full_name} (Avelsorn),{" "}
                                {values.business_street},{" "}
                                {values.business_postcode}{" "}
                                {values.business_city}, {values.contact_email}.
                            </p>
                            <p>
                                Hiermit widerrufe ich den von mir
                                abgeschlossenen Vertrag über die Erbringung der
                                folgenden Dienstleistung:
                            </p>
                            <p>
                                Bezeichnung der Dienstleistung und
                                gegebenenfalls Bestellnummer:
                            </p>
                            <p>Bestellt am:</p>
                            <p>Name und Anschrift des Verbrauchers:</p>
                            <p>
                                Datum und Unterschrift des Verbrauchers (nur bei
                                Mitteilung auf Papier).
                            </p>
                        </blockquote>
                    </section>
                )}
                {["widerrufsbelehrung", "agb"].includes(path) && (
                    <Link className="button" href="/widerruf">
                        Vertrag widerrufen ↗
                    </Link>
                )}
            </div>
        );
    } else if (path === "widerruf" || path === "widerrufsformular") {
        title = "Vertrag widerrufen.";
        intro =
            "Du kannst Deinen Widerruf hier elektronisch erklären. Prüfe Deine Angaben, bevor Du die eindeutige Erklärung absendest.";

        body = (
            <section className="form-panel narrow">
                <ActionForm
                    action="withdrawal"
                    values={{ confirmed: true }}
                    fields={[
                        {
                            name: "name",
                            label: "Vollständiger Name",
                            required: true,
                        },
                        {
                            name: "email",
                            label: "E-Mail-Adresse für die Eingangsbestätigung",
                            type: "email",
                            required: true,
                        },
                        {
                            name: "contractReference",
                            label: "Bestellnummer oder eindeutige Vertragsbeschreibung",
                            required: true,
                        },
                        {
                            name: "statement",
                            label: "Ergänzende Erklärung (optional)",
                            type: "textarea",
                            value: "Hiermit widerrufe ich den von mir abgeschlossenen Vertrag über die oben bezeichnete Dienstleistung.",
                        },
                    ]}
                    submit="Widerruf bestätigen"
                    success="Dein Widerruf wurde dokumentiert. Die Eingangsbestätigung wurde für den Versand bereitgestellt."
                />
                <Link href="/widerrufsbelehrung" className="button mt-6">
                    Widerrufsbelehrung lesen
                </Link>
            </section>
        );
    } else if (path === "blog") {
        title = "Artikel zu Websites und Selbstständigkeit";
        intro =
            "Hinweise und Arbeitsbeispiele zur Vorbereitung Deiner Selbstständigkeit, zum Aufbau einer Website und zur Organisation wiederkehrender Aufgaben.";

        const articles = await db()
            .select()
            .from(posts)
            .where(
                and(
                    eq(posts.status, "published"),
                    lte(posts.publishAt, new Date()),
                ),
            )
            .orderBy(desc(posts.publishAt));
        body = articles.length ? (
            <div className="article-grid">
                {articles.map((p, i) => {
                    const image = articleImage(p.slug);
                    return (
                        <Link
                            href={"/blog/" + p.slug}
                            className="article-card"
                            key={p.id}
                        >
                            {image && (
                                <EditorialPhoto
                                    asset={image}
                                    className="article-cover"
                                    sizes="(max-width: 640px) calc(100vw - 40px), (max-width: 900px) calc((100vw - 105px) / 2), (max-width: 1150px) calc((100vw - 140px) / 3), (max-width: 1352px) calc((100vw - 182px) / 3), 390px"
                                    preload={i === 0}
                                />
                            )}
                            <h2>{p.title}</h2>
                            <p>{p.excerpt}</p>
                            <span className="arrow-link">Weiterlesen ↗</span>
                        </Link>
                    );
                })}
            </div>
        ) : (
            <p className="empty-state">
                Hier erscheinen die ersten redaktionellen Beiträge, sobald sie
                freigegeben sind.
            </p>
        );
    } else if (path.startsWith("blog/")) {
        const [post] = await db()
            .select()
            .from(posts)
            .where(
                and(
                    eq(posts.slug, path.slice(5)),
                    eq(posts.status, "published"),
                    lte(posts.publishAt, new Date()),
                ),
            );
        if (!post) notFound();
        title = post.title;
        intro = post.excerpt;

        const articleHtml = await publicHtml(post.body);
        const image = articleImage(post.slug);
        const related = (articleSearchLinks.get(post.slug) ?? []).flatMap(
            (path) => {
                const page = findSearchPage(path);
                return page ? [{ path, heading: page.heading }] : [];
            },
        );
        body = (
            <>
                <JsonLd
                    value={{
                        "@context": "https://schema.org",
                        "@type": "BlogPosting",
                        "@id": baseUrl() + "/blog/" + post.slug + "#article",
                        headline: post.title,
                        description: post.excerpt,
                        image: image
                            ? new URL(image.src.src, baseUrl()).href
                            : undefined,
                        datePublished: post.publishAt?.toISOString(),
                        dateModified: post.updatedAt.toISOString(),
                        inLanguage: "de-DE",
                        author: { "@id": baseUrl() + "/#avelsorn" },
                        publisher: { "@id": baseUrl() + "/#avelsorn" },
                        mainEntityOfPage: baseUrl() + "/blog/" + post.slug,
                    }}
                />
                <p className="search-editorial">
                    Redaktion: <Link href="/ueber-mich">Avelsorn</Link> ·
                    Aktualisiert am{" "}
                    <time dateTime={post.updatedAt.toISOString()}>
                        {new Intl.DateTimeFormat("de-DE", {
                            dateStyle: "long",
                            timeZone: "Europe/Berlin",
                        }).format(post.updatedAt)}
                    </time>
                </p>
                {image && (
                    <EditorialPhoto
                        asset={image}
                        className="article-feature"
                        sizes="(max-width: 640px) calc(100vw - 40px), (max-width: 900px) calc(100vw - 70px), 830px"
                        preload
                    />
                )}
                <article
                    className="prose"
                    dangerouslySetInnerHTML={{
                        __html: articleHtml,
                    }}
                />
                {related.length > 0 && (
                    <section className="search-related">
                        <h2>Vorlagen und nächste Schritte</h2>
                        <ul>
                            {related.map(({ path, heading }) => (
                                <li key={path}>
                                    <Link href={path}>{heading} ↗</Link>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </>
        );
    } else notFound();
    return (
        <SiteShell>
            <main id="main">
                <section className="page-heading wrap">
                    <h1>{title.replace(/\n/g, " ")}</h1>
                    <p className="lead">{intro}</p>
                </section>
                <div className="page-body wrap">{body}</div>
            </main>
        </SiteShell>
    );
}
