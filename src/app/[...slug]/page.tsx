import { notFound } from "next/navigation";
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
import { articleImages } from "@/content/editorial-images";
import { audiences, audiencePath } from "@/content/audiences";
import { ProfessionalNetwork } from "@/components/professional-network";

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
            service?.description ??
            document?.description ??
            (path === "zielgruppen"
                ? "Beratung und Projektarbeit für Unternehmen, Selbstständige, Gründer, Freelancer und Creator. Finde die Unterstützung passend zu Deiner Situation."
                : "Avelsorn unterstützt Dich bei Websites, digitalen Arbeitsabläufen und der Vorbereitung Deiner Selbstständigkeit."),
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

        body = (
            <div className="detail-grid">
                <section>
                    <h2>Mögliche Aufgaben</h2>
                    <ul className="editorial-list">
                        {service.topics.map((topic) => (
                            <li key={topic}>{topic}</li>
                        ))}
                    </ul>
                </section>
                <aside className="quiet-panel">
                    <h2>Auftrag und Ergebnis</h2>
                    <p>{service.outcome}</p>
                    <Link href="/erstgespraech" className="button primary">
                        Aufgabe im Erstgespräch besprechen{" "}
                        <ArrowUpRight size={17} />
                    </Link>
                </aside>
            </div>
        );
    } else if (path === "leistungen") {
        title = "Leistungen";
        intro =
            "Hier findest Du die Aufgaben, zu denen Du Beratung oder Projektarbeit beauftragen kannst. Auf der jeweiligen Seite beschreibe ich den möglichen Umfang und die benötigten Vorbereitungen.";
        body = (
            <div className="service-grid">
                {services.map((s) => (
                    <Link
                        className="service-card"
                        href={"/leistungen/" + s.slug}
                        key={s.slug}
                    >
                        <h2>{s.title}</h2>
                        <p>{s.description}</p>
                        <ArrowUpRight size={22} />
                    </Link>
                ))}
            </div>
        );
    } else if (path === "preise") {
        title = "Preise und Buchung";
        intro =
            "Das Erstgespräch ist kostenlos. Für weitere Leistungen fragst Du ein Paket an. Nach Klärung der Aufgabe erhältst Du Umfang, Liefertermin und Gesamtpreis als konkretes Angebot. Eine Anfrage ist noch keine Bestellung.";

        body = <Prices />;
    } else if (path === "erstgespraech" || path === "terminbuchung") {
        title = "Ein kostenloses Erstgespräch buchen";
        intro =
            "Im 15-minütigen Erstgespräch beschreibst Du Deine Aufgabe. Wir klären, ob ich sie übernehmen kann und was dafür benötigt wird. Das Gespräch kostet nichts; eine weitere Beauftragung entscheidest Du danach.";

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
                            <h2>Anmelden oder Konto erstellen</h2>
                            <p>
                                Nutze Dein vorhandenes Konto oder registriere
                                Dich direkt im Buchungsablauf und bestätige
                                Deine E-Mail-Adresse.
                            </p>
                        </div>
                    </li>
                    <li>
                        <span>03</span>
                        <div>
                            <h2>Telefonnummer bestätigen</h2>
                            <p>
                                Prüfe Deine Kontaktdaten und bestätige den
                                kostenlosen Termin. Ich rufe Dich zur
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
            "Vom ersten Termin bis zur Prüfung der Arbeitsergebnisse nutzen wir Dein Kundenkonto. Dort findest Du Buchungen, Projektdateien, Rückfragen und Dokumente zum Auftrag.";

        body = (
            <ol className="process-list wide-process">
                {[
                    [
                        "Kennenlernen",
                        "Nach Registrierung, E-Mail-Bestätigung und Fragebogen wählen wir einen ersten Termin. In 15 kostenlosen Minuten besprechen wir Deine Ausgangslage.",
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
        title = "Für wen ich arbeite";
        intro =
            "Die Aufgaben unterscheiden sich je nachdem, ob Du einen Betrieb führst, Deine Selbstständigkeit vorbereitest oder projektweise arbeitest. Hier findest Du die Unterstützung passend zu Deiner Situation.";
        body = (
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
        );
    } else if (path === "ueber-mich") {
        const values = await business();
        title = "Über Avelsorn";
        intro =
            "Avelsorn verbindet Beratung mit der Arbeit an Websites, digitalen Abläufen und Gründungsvorhaben. Du kannst eine konkrete Aufgabe besprechen und die vereinbarte Umsetzung beauftragen.";
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
                        Die persönliche Vorstellung wird vor der
                        Veröffentlichung ergänzt.
                    </p>
                )}
                <h2>Beratung oder Umsetzung beauftragen</h2>
                <p>
                    Du kannst Beratung zu einer Aufgabe buchen oder die
                    Bearbeitung beauftragen. Bei einer Website legen wir
                    beispielsweise Seiten, Inhalte und Funktionen fest. Bei
                    einem Arbeitsablauf beschreiben wir die einzelnen Schritte
                    und prüfen die vorhandenen Werkzeuge. Änderungen am Umfang
                    und zusätzliche Kosten besprechen wir, bevor ich daran
                    arbeite.
                </p>
                <ProfessionalNetwork />
                <Link href="/kontakt" className="button">
                    Kontakt aufnehmen ↗
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
                        Wenn Du zunächst klären möchtest, ob ich Deine Aufgabe
                        übernehmen kann, kannst Du ein kostenloses Erstgespräch
                        vereinbaren.
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
                <Link href="/widerrufsbelehrung">Widerrufsbelehrung lesen</Link>
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
                {articles.map((p, i) => (
                    <Link
                        href={"/blog/" + p.slug}
                        className="article-card"
                        key={p.id}
                    >
                        {articleImages[p.slug] && (
                            <EditorialPhoto
                                asset={articleImages[p.slug]}
                                className="article-cover"
                                sizes="(max-width: 640px) calc(100vw - 40px), (max-width: 900px) calc((100vw - 105px) / 2), (max-width: 1150px) calc((100vw - 140px) / 3), (max-width: 1352px) calc((100vw - 182px) / 3), 390px"
                                preload={i === 0}
                            />
                        )}
                        <h2>{p.title}</h2>
                        <p>{p.excerpt}</p>
                        <span className="arrow-link">Weiterlesen ↗</span>
                    </Link>
                ))}
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
        body = (
            <>
                {articleImages[post.slug] && (
                    <EditorialPhoto
                        asset={articleImages[post.slug]}
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
