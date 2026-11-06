import Link from "next/link";
import { SiteShell } from "./site-shell";
import { ActionForm, type Field } from "./action-form";
import { and, eq, gt, isNull } from "drizzle-orm";
import { db } from "@/server/db";
import { tokens, guardianConsents } from "@/server/schema";
import { digest } from "@/server/security";
import { products, money, type ProductKey } from "@/server/config";
import { getSetting } from "@/server/settings";
import { notFound } from "next/navigation";
import { minorAccountPolicy } from "@/content/booking-policy";
const field = (
    name: string,
    label: string,
    type = "text",
    required = true,
): Field => ({ name, label, type, required });

export async function AuthPage({
    slug,
    token,
    returnTo,
}: {
    slug: string;
    token?: string;
    returnTo?: string;
}) {
    if (slug === "einrichtung" && (await getSetting("setup_complete", false)))
        notFound();
    const configurations: Record<
        string,
        {
            title: string;
            intro: string;
            action: string;
            fields: Field[];
            submit: string;
            values?: Record<string, unknown>;
        }
    > = {
        anmelden: {
            title: "Anmelden",
            intro: "Melde Dich an, um Termine zu buchen, Projektdateien zu öffnen oder Nachrichten zu lesen.",
            action: "login",
            fields: [
                field("email", "E-Mail-Adresse", "email"),
                field("password", "Passwort", "password"),
            ],
            submit: "Anmelden",
        },
        registrieren: {
            title: "Konto erstellen",
            intro: "Erstelle Dein Konto. Danach bestätigst Du Deine E-Mail-Adresse und beschreibst im Fragebogen Deine Aufgabe.",
            action: "register",
            fields: [
                field("name", "Dein vollständiger Name"),
                field("email", "E-Mail-Adresse", "email"),
                {
                    ...field("password", "Dein Passwort", "password"),
                    hint: "Mindestens 12 Zeichen. Verwende ein eigenes, sicheres Passwort.",
                },
                field("birthDate", "Geburtsdatum", "date"),
                field(
                    "guardianName",
                    "Name einer erziehungsberechtigten Person",
                    "text",
                    false,
                ),
                field(
                    "guardianEmail",
                    "E-Mail einer erziehungsberechtigten Person",
                    "email",
                    false,
                ),
                {
                    ...field(
                        "terms",
                        "Ich akzeptiere die AGB und habe die Datenschutzhinweise gelesen.",
                        "checkbox",
                    ),
                    hint: minorAccountPolicy,
                },
            ],
            submit: "Konto erstellen",
        },
        "passwort-vergessen": {
            title: "Passwort zurücksetzen",
            intro: "Gib Deine E-Mail-Adresse ein. Wenn ein Konto existiert, stellen wir einen sicheren Link bereit.",
            action: "forgot",
            fields: [field("email", "E-Mail-Adresse", "email")],
            submit: "Link anfordern",
        },
        "passwort-zuruecksetzen": {
            title: "Neues Passwort festlegen",
            intro: "Der Link ist zeitlich begrenzt und kann einmal verwendet werden.",
            action: "reset",
            fields: [field("password", "Neues Passwort", "password")],
            values: { token: token ?? "" },
            submit: "Passwort zurücksetzen",
        },
        "email-bestaetigen": {
            title: "E-Mail-Adresse bestätigen",
            intro: "Mit Deiner Bestätigung ordnen wir diese E-Mail-Adresse Deinem Konto zu.",
            action: "verify",
            fields: [],
            values: {
                token: token ?? "",
                ...(returnTo === "/kalender" ? { next: returnTo } : {}),
            },
            submit: "E-Mail-Adresse bestätigen",
        },
        zustimmung: {
            title: "Der Kontonutzung zustimmen",
            intro: "Du bestätigst als erziehungsberechtigte Person die Registrierung und Plattformnutzung. Kostenpflichtige Verträge benötigen zusätzlich eine Prüfung der erforderlichen Vertretung. Die Administration prüft Deine Berechtigung datensparsam; die Bestätigung dieses Links allein gibt Bestellungen noch nicht frei.",
            action: "guardian-confirm",
            fields: [
                field(
                    "declaration",
                    "Ich erkläre meine Erziehungsberechtigung und stimme der beschriebenen Plattformnutzung zu.",
                    "checkbox",
                ),
            ],
            values: { token: token ?? "" },
            submit: "Erklärung bestätigen",
        },
        vertragszustimmung: {
            title: "Zustimmung zur Bestellung",
            intro: "Bitte prüfe die Leistung und den Gesamtpreis. Deine ausdrückliche Vertretung gilt für genau eine passende Bestellung und wird vor ihrer Ausführung administrativ geprüft.",
            action: "guardian-contract-confirm",
            fields: [
                field(
                    "declaration",
                    "Ich vertrete die minderjährige Person für genau die beschriebene kostenpflichtige Bestellung, akzeptiere die AGB und habe die Widerrufsbelehrung einschließlich der Hinweise zum gewünschten frühzeitigen Leistungsbeginn gelesen.",
                    "checkbox",
                ),
            ],
            values: { token: token ?? "" },
            submit: "Kostenpflichtiger Bestellung ausdrücklich zustimmen",
        },
        otp: {
            title: "Einmalcode eingeben",
            intro: "Gib den sechsstelligen Code aus Deiner Sicherheits-E-Mail ein. Er gilt zehn Minuten.",
            action: "otp",
            fields: [
                {
                    ...field("code", "Einmalcode"),
                    hint: "Der Code kann einmal verwendet werden.",
                },
            ],
            submit: "Sicher anmelden",
        },
        einrichtung: {
            title: "Administration einrichten",
            intro: "Lege Deinen Inhaberzugang mit dem privaten Einrichtungsschlüssel an. Verwende Deine geschäftliche E-Mail-Adresse und ein eigenes sicheres Passwort.",
            action: "setup",
            fields: [
                field("key", "Einrichtungsschlüssel", "password"),
                field("name", "Dein vollständiger Name"),
                field("email", "Administrator-E-Mail", "email"),
                field("birthDate", "Geburtsdatum", "date"),
                field("password", "Administrator-Passwort", "password"),
            ],
            submit: "Administratorkonto anlegen",
        },
    };
    const configuration = configurations[slug];
    if (slug === "vertragszustimmung" && token) {
        const [access] = await db()
            .select()
            .from(tokens)
            .where(
                and(
                    eq(tokens.hash, digest(token)),
                    isNull(tokens.usedAt),
                    gt(tokens.expiresAt, new Date()),
                ),
            );
        const [consent] = access?.purpose.startsWith("guardian_contract:")
            ? await db()
                  .select()
                  .from(guardianConsents)
                  .where(
                      eq(
                          guardianConsents.id,
                          access.purpose.slice("guardian_contract:".length),
                      ),
                  )
            : [];
        if (consent) {
            const [, product, minutes, cents] = consent.scope.split(":");
            const offer = products[product as ProductKey];
            configuration.intro = `${offer?.name ?? "Individuelle Leistung"} · ${minutes !== "0" ? minutes + " Minuten · " : ""}Gesamtpreis ${money(Number(cents))}. ${offer?.description ?? ""} Keine automatische Verlängerung. Du vertrittst die minderjährige Person für genau eine solche Bestellung. Prüfe AGB und Widerrufsbelehrung vor Deiner Erklärung.`;
        }
    }
    return (
        <SiteShell>
            <main id="main" className="auth-layout wrap">
                <div className="auth-intro">
                    <h1>{configuration.title}</h1>
                    <p className="lead">{configuration.intro}</p>
                </div>
                <section
                    className="form-panel"
                    aria-label={configuration.title}
                >
                    <ActionForm {...configuration} />
                    {slug === "anmelden" && (
                        <div className="form-links">
                            <Link href="/passwort-vergessen">
                                Passwort vergessen?
                            </Link>
                            <p>
                                Noch kein Konto?{" "}
                                <Link href="/registrieren">
                                    Jetzt registrieren ↗
                                </Link>
                            </p>
                        </div>
                    )}
                    {slug === "registrieren" && (
                        <p className="small-note">
                            Schon registriert?{" "}
                            <Link href="/anmelden">Hier anmelden</Link>.{" "}
                            <Link href="/agb">AGB</Link> ·{" "}
                            <Link href="/datenschutz">Datenschutz</Link>
                        </p>
                    )}
                </section>
            </main>
        </SiteShell>
    );
}
