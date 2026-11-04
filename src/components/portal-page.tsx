import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq, desc, sql, inArray } from "drizzle-orm";
import type { AnyPgColumn } from "drizzle-orm/pg-core";
import { db } from "@/server/db";
import * as s from "@/server/schema";
import { business, readiness } from "@/server/settings";
import {
    money,
    berlin,
    products,
    businessLabels,
    publicKeys,
    type ProductKey,
} from "@/server/config";
import { statuses, projectStatuses } from "@/content/pages";
import { PortalShell, adminNav, customerNav } from "./portal-shell";
import { ActionForm, type Field } from "./action-form";
import { OnboardingForm } from "./onboarding-form";
import { BookingForm } from "./booking-form";
import { LiveRefresh } from "./live-refresh";
import { UploadForm } from "./upload-form";
import { CmsEditor } from "./cms-editor";
import { OfferEditor } from "./offer-editor";
import { EmailComposer } from "./email-composer";
import { Meeting } from "./meeting";
import { videoConfigured } from "@/server/video";
import { isMinor } from "@/server/security";
import {
    servicePackages,
    packageInquiryPath,
} from "@/content/service-packages";
import { catalogFromSnapshot } from "@/server/package-catalog";
import { MediaManager } from "./media-manager";
import { RescheduleForm } from "./reschedule-form";
import { TimeCorrectionForm } from "./time-correction-form";
import { formatInTimeZone } from "date-fns-tz";
import { AdminOverview } from "./admin-overview";

export function Status({ value }: { value: string }) {
    return (
        <span className={"status " + value}>{statuses[value] ?? value}</span>
    );
}
const field = (
    name: string,
    label: string,
    type = "text",
    required = true,
    value?: string,
): Field => ({
    name,
    label,
    type,
    required,
    value:
        type === "datetime-local" && value
            ? formatInTimeZone(
                  new Date(value),
                  "Europe/Berlin",
                  "yyyy-MM-dd'T'HH:mm",
              )
            : type === "currency" && value
              ? (Number(value) / 100).toFixed(2)
              : value,
});
const Empty = ({ text }: { text: string }) => (
    <p className="empty-state">{text}</p>
);
const date = (value: Date | null) => (value ? berlin(value) : "—");
export function Table({
    heads,
    rows,
}: {
    heads: string[];
    rows: React.ReactNode[][];
}) {
    return rows.length ? (
        <div
            className="data-table-wrap"
            role="region"
            aria-label="Tabellenübersicht"
            tabIndex={0}
        >
            <table className="data-table">
                <thead>
                    <tr>
                        {heads.map((h) => (
                            <th key={h} scope="col">
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => (
                        <tr key={i}>
                            {row.map((cell, j) => (
                                <td key={j}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    ) : (
        <Empty text="Hier sind noch keine Einträge vorhanden." />
    );
}
export async function PortalPage({
    user,
    admin,
    section,
    query,
}: {
    user: s.User;
    admin: boolean;
    section: string;
    query: Record<string, string | undefined>;
}) {
    const customerChoices = admin ? await customerOptions() : [];
    const customerLabel = (id: string) =>
        customerChoices.find((customer) => customer.value === id)?.label ??
        "Kundenkonto";
    const paidServiceOrderChoices = admin
        ? (
              await db()
                  .select()
                  .from(s.orders)
                  .where(eq(s.orders.status, "paid"))
          )
              .filter(
                  (order) =>
                      !order.cancelledAt && catalogFromSnapshot(order.contract),
              )
              .map((order) => ({
                  id: order.id,
                  label: catalogFromSnapshot(order.contract)!.name,
                  userId: order.userId,
              }))
        : [];
    const nav = admin ? adminNav : customerNav;
    let title =
        section === "video"
            ? admin
                ? "Videotermin"
                : "Dein Videogespräch"
            : section === "angebote/neu" && admin
              ? "Angebotseditor"
              : nav.find(([slug]) => slug === section)?.[1];
    if (!title) notFound();
    const base = admin ? "/admin" : "/konto";
    const scope = (column: AnyPgColumn) =>
        admin ? undefined : eq(column, user.id);
    let body: React.ReactNode;
    if (!section && admin) {
        body = <AdminOverview />;
    } else if (!section) {
        const allBookings = await db()
            .select()
            .from(s.bookings)
            .where(scope(s.bookings.userId))
            .orderBy(s.bookings.startsAt);
        const allProjects = await db()
            .select()
            .from(s.projects)
            .where(scope(s.projects.userId));
        const activePackages = await db()
            .select()
            .from(s.packages)
            .where(
                and(scope(s.packages.userId), eq(s.packages.status, "active")),
            );
        const openOrders = await db()
            .select()
            .from(s.orders)
            .where(
                and(
                    scope(s.orders.userId),
                    inArray(s.orders.status, ["open", "partial", "overdue"]),
                ),
            );
        const paidPackageOrders = (
            await db()
                .select({ contract: s.orders.contract })
                .from(s.orders)
                .where(
                    and(
                        eq(s.orders.userId, user.id),
                        eq(s.orders.product, "offer"),
                        eq(s.orders.status, "paid"),
                    ),
                )
        ).filter((order) => catalogFromSnapshot(order.contract));
        const news = await db()
            .select()
            .from(s.notifications)
            .where(eq(s.notifications.userId, user.id))
            .orderBy(desc(s.notifications.createdAt))
            .limit(5);
        const next = allBookings.find(
            (b) =>
                b.startsAt > new Date() &&
                ["reserved", "confirmed"].includes(b.status),
        );
        body = (
            <>
                {!admin && (!user.verifiedAt || !user.onboardingAt) && (
                    <div className="notice">
                        <strong>Bereite Dein erstes Gespräch vor.</strong>
                        <p>
                            {!user.verifiedAt
                                ? "Bestätige Deine E-Mail-Adresse. "
                                : ""}
                            {!user.onboardingAt
                                ? "Ergänze Deinen Fragebogen, bevor Du einen Termin buchst."
                                : ""}
                        </p>
                        <div className="record-actions">
                            {!user.verifiedAt && (
                                <ActionForm
                                    action="resend-verification"
                                    submit="Bestätigungslink erneut anfordern"
                                />
                            )}
                            <Link href="/konto/fragebogen" className="button">
                                Zum Fragebogen ↗
                            </Link>
                        </div>
                    </div>
                )}
                <div className="stat-grid portal-overview-stats">
                    {[
                        [
                            next ? date(next.startsAt).split(",")[0] : "—",
                            "Dein nächster Termin",
                            next
                                ? products[next.product as ProductKey]?.name
                                : "Noch kein Termin gebucht",
                            "/konto/termine",
                        ],
                        [
                            activePackages.filter(
                                (item) => item.expiresAt > new Date(),
                            ).length + paidPackageOrders.length,
                            "Deine Pakete",
                            "Bezahlte Pakete und aktive Bestandsverträge",
                            "/konto/pakete",
                        ],
                        [
                            allProjects.filter(
                                (p) =>
                                    !["completed", "archived"].includes(
                                        p.status,
                                    ),
                            ).length,
                            "Deine Projekte",
                            "Alle Vorhaben an einem Ort",
                            "/konto/projekte",
                        ],
                        [
                            money(
                                openOrders.reduce(
                                    (sum, o) =>
                                        sum + o.amountCents - o.paidCents,
                                    0,
                                ),
                            ),
                            "Offene Zahlungen",
                            "Zahlung per Banküberweisung",
                            "/konto/rechnungen",
                        ],
                    ].map(([value, label, hint, href]) => (
                        <Link
                            href={String(href)}
                            className="stat-card"
                            key={String(label)}
                        >
                            <span>{label}</span>
                            <strong>{value}</strong>
                            <p>{hint}</p>
                        </Link>
                    ))}
                </div>
                <div className="portal-grid">
                    <section className="panel">
                        <div className="panel-header">
                            <h2>
                                {admin
                                    ? "Anstehende Beratungen"
                                    : "Dein nächstes Gespräch"}
                            </h2>
                            <Link
                                href={base + (admin ? "/kalender" : "/termine")}
                            >
                                Alle Termine ↗
                            </Link>
                        </div>
                        {next ? (
                            <>
                                <Status value={next.status} />
                                <h2 className="mt-5 text-3xl">
                                    {products[next.product as ProductKey]?.name}
                                </h2>
                                <p className="mt-3">
                                    {berlin(next.startsAt)} ·{" "}
                                    {next.channel === "phone"
                                        ? "Telefon"
                                        : "Video"}
                                </p>
                                <p>
                                    Europe/Berlin ·{" "}
                                    {Math.round(
                                        (next.endsAt.getTime() -
                                            next.startsAt.getTime()) /
                                            60000,
                                    )}{" "}
                                    Minuten
                                </p>
                                <Link
                                    className="arrow-link mt-5"
                                    href={
                                        base +
                                        (admin ? "/kalender" : "/termine")
                                    }
                                >
                                    Termindetails ansehen ↗
                                </Link>
                            </>
                        ) : (
                            <>
                                <Empty text="Aktuell ist kein kommender Termin eingetragen." />
                                {!admin && (
                                    <Link
                                        href="/konto/buchen"
                                        className="button mt-5"
                                    >
                                        Beratung buchen ↗
                                    </Link>
                                )}
                            </>
                        )}
                    </section>
                    <section className="panel">
                        <div className="panel-header">
                            <h2>Zuletzt passiert</h2>
                            <Link href={base + "/benachrichtigungen"}>
                                Alle ansehen ↗
                            </Link>
                        </div>
                        {news.length ? (
                            <div className="row-list">
                                {news.map((n) => (
                                    <div key={n.id}>
                                        <h3>{n.title}</h3>
                                        <p>{n.body}</p>
                                        <small>{berlin(n.createdAt)}</small>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <Empty text="Sobald es Neuigkeiten gibt, findest Du sie hier." />
                        )}
                    </section>
                    <section className="panel">
                        <div className="panel-header">
                            <h2>Deine Projekte</h2>
                            <Link href="/konto/projekte">Alle Projekte ↗</Link>
                        </div>
                        {allProjects.length ? (
                            <div className="portal-overview-list">
                                {allProjects.slice(0, 3).map((project) => (
                                    <article key={project.id}>
                                        <h3>{project.name}</h3>
                                        <Status value={project.status} />
                                        <p>
                                            {project.description.slice(0, 140)}
                                            {project.description.length > 140
                                                ? "…"
                                                : ""}
                                        </p>
                                        <Link
                                            href={
                                                "/konto/projekte?id=" +
                                                project.id
                                            }
                                        >
                                            Projekt öffnen ↗
                                        </Link>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <Empty text="Sobald ein Projekt zu Deinem Auftrag angelegt ist, findest Du es hier." />
                        )}
                    </section>
                    <section className="panel">
                        <div className="panel-header">
                            <h2>Unterlagen und Rückfragen</h2>
                        </div>
                        <div className="portal-task-links">
                            <Link href="/konto/angebote">
                                Angebote prüfen ↗
                            </Link>
                            <Link href="/konto/rechnungen">
                                Rechnungen ansehen ↗
                            </Link>
                            <Link href="/konto/dateien">
                                Projektdateien öffnen ↗
                            </Link>
                            <Link href="/konto/nachrichten">
                                Nachricht schreiben ↗
                            </Link>
                        </div>
                    </section>
                </div>
            </>
        );
    } else if (section === "buchen") {
        const active = await db()
            .select()
            .from(s.packages)
            .where(
                and(
                    eq(s.packages.userId, user.id),
                    eq(s.packages.status, "active"),
                ),
            );
        const serviceOrders = (
            await db()
                .select()
                .from(s.orders)
                .where(
                    and(
                        eq(s.orders.userId, user.id),
                        eq(s.orders.status, "paid"),
                    ),
                )
        )
            .filter(
                (order) =>
                    catalogFromSnapshot(order.contract) && !order.cancelledAt,
            )
            .map((order) => ({
                id: order.id,
                label: catalogFromSnapshot(order.contract)!.name,
            }));
        body = (
            <BookingForm
                initial={(query.product ?? "intro") as ProductKey}
                serviceOrders={serviceOrders}
                initialOrderId={query.order}
                video={videoConfigured()}
                packages={active.map((p) => ({
                    id: p.id,
                    label:
                        products[p.product as ProductKey].name +
                        " · bis " +
                        date(p.expiresAt),
                }))}
            />
        );
    } else if (section === "video")
        body = query.id ? (
            <Meeting bookingId={query.id} />
        ) : (
            <Empty text="Öffne Deinen Videoraum über einen bestätigten Termin." />
        );
    else if (section === "fragebogen") {
        const [row] = await db()
            .select()
            .from(s.onboarding)
            .where(eq(s.onboarding.userId, user.id));
        body = (
            <section className="form-panel">
                <p className="mb-6">
                    Deine Angaben helfen, das Gespräch vorzubereiten.
                    Pflichtfelder sind mit * gekennzeichnet. Du kannst Deinen
                    Zwischenstand speichern und später fortfahren.
                </p>
                <OnboardingForm initial={row?.answers ?? {}} />
            </section>
        );
    } else if (section === "profil")
        body = (
            <div className="portal-grid">
                <section className="form-panel">
                    <h2>Deine Kontaktdaten</h2>
                    <ActionForm
                        action="profile"
                        fields={[
                            field(
                                "name",
                                "Dein vollständiger Name",
                                "text",
                                true,
                                user.name,
                            ),
                            field(
                                "phone",
                                "Telefonnummer",
                                "tel",
                                false,
                                user.phone ?? "",
                            ),
                            field(
                                "billingAddress",
                                "Vollständige Rechnungsanschrift",
                                "textarea",
                                false,
                                user.billingAddress ?? "",
                            ),
                            {
                                name: "customerType",
                                label: "Du buchst als",
                                value: user.customerType,
                                options: [
                                    { value: "consumer", label: "Verbraucher" },
                                    { value: "business", label: "Unternehmer" },
                                ],
                            },
                        ]}
                    />
                    <p className="small-note">
                        E-Mail: {user.email} ·{" "}
                        {user.verifiedAt ? "Bestätigt" : "Noch nicht bestätigt"}
                    </p>
                </section>
                <section className="form-panel">
                    <h2>Passwort ändern</h2>
                    <ActionForm
                        action="password"
                        fields={[
                            field(
                                "currentPassword",
                                "Aktuelles Passwort",
                                "password",
                            ),
                            field(
                                "password",
                                "Neues Passwort (mindestens 12 Zeichen)",
                                "password",
                            ),
                        ]}
                        submit="Passwort ändern"
                    />
                </section>
                {isMinor(user) && (
                    <p>
                        Erforderliche Zustimmungen werden beim konkreten Angebot
                        im Bereich Angebote angefordert.
                    </p>
                )}
            </div>
        );
    else if (["termine", "kalender", "beratungen"].includes(section)) {
        const rows = await db()
            .select()
            .from(s.bookings)
            .where(scope(s.bookings.userId))
            .orderBy(desc(s.bookings.startsAt));
        body = (
            <>
                <Table
                    heads={[
                        ...(admin ? ["Kunde"] : []),
                        "Beratung",
                        "Termin · Europe/Berlin",
                        "Status",
                        "Aktionen",
                    ]}
                    rows={rows.map((b) => [
                        ...(admin ? [customerLabel(b.userId)] : []),
                        <div key="title">
                            {products[b.product as ProductKey]?.name ??
                                b.product}
                            <small className="block text-[9px]">{b.id}</small>
                        </div>,
                        <div key="time">
                            {date(b.startsAt)}
                            <br />
                            {b.channel === "phone" ? "Telefon" : "Video"}
                        </div>,
                        <Status key="status" value={b.status} />,
                        <div key="actions">
                            <a href={"/api/bookings/" + b.id + "/ics"}>
                                Kalendereinladung ↓
                            </a>
                            {b.channel === "video" &&
                                b.status === "confirmed" && (
                                    <Link
                                        className="block mt-2"
                                        href={base + "/video?id=" + b.id}
                                    >
                                        Videoraum öffnen ↗
                                    </Link>
                                )}
                            {["reserved", "confirmed"].includes(b.status) && (
                                <div className="record-actions">
                                    <ActionForm
                                        action="booking-change"
                                        values={{ id: b.id, action: "cancel" }}
                                        submit="Absagen"
                                    />
                                    <RescheduleForm
                                        id={b.id}
                                        minutes={Math.round(
                                            (b.endsAt.getTime() -
                                                b.startsAt.getTime()) /
                                                60000,
                                        )}
                                    />
                                    {admin && (
                                        <ActionForm
                                            action="booking-change"
                                            values={{
                                                id: b.id,
                                                action: "complete",
                                            }}
                                            submit="Als durchgeführt markieren"
                                        />
                                    )}
                                </div>
                            )}
                        </div>,
                    ])}
                />
                {admin ? (
                    <>
                        <section className="panel mt-6">
                            <h2 className="mb-6 text-2xl">
                                Termin für einen Kunden anlegen
                            </h2>
                            <BookingForm
                                customers={customerChoices}
                                serviceOrders={paidServiceOrderChoices}
                                video={videoConfigured()}
                            />
                        </section>
                        <section className="panel mt-6">
                            <h2 className="mb-6 text-2xl">
                                Tag sperren oder Sonderzeit eintragen
                            </h2>
                            <ActionForm
                                action="availability"
                                fields={[
                                    field("day", "Tag", "date"),
                                    field(
                                        "blocked",
                                        "Ganztägig sperren",
                                        "checkbox",
                                        false,
                                    ),
                                    field(
                                        "start",
                                        "Beginn",
                                        "time",
                                        true,
                                        "08:30",
                                    ),
                                    field("end", "Ende", "time", true, "17:00"),
                                    field("reason", "Hinweis", "text", false),
                                ]}
                            />
                        </section>
                        <section className="panel mt-6">
                            <h2 className="mb-6 text-2xl">
                                Wöchentliche Arbeitszeiten
                            </h2>
                            <ActionForm
                                action="availability-week"
                                fields={[
                                    {
                                        name: "weekday",
                                        label: "Wochentag",
                                        type: "number",
                                        required: true,
                                        options: [
                                            "Montag",
                                            "Dienstag",
                                            "Mittwoch",
                                            "Donnerstag",
                                            "Freitag",
                                            "Samstag",
                                            "Sonntag",
                                        ].map((label, i) => ({
                                            value: String(i + 1),
                                            label,
                                        })),
                                    },
                                    field(
                                        "blocked",
                                        "Diesen Wochentag sperren",
                                        "checkbox",
                                        false,
                                    ),
                                    field(
                                        "start",
                                        "Beginn",
                                        "time",
                                        true,
                                        "08:30",
                                    ),
                                    field("end", "Ende", "time", true, "17:00"),
                                ]}
                                submit="Wochenregel speichern"
                            />
                        </section>
                    </>
                ) : (
                    <Link href="/konto/buchen" className="button primary mt-6">
                        Neuen Termin buchen ↗
                    </Link>
                )}
            </>
        );
    } else if (section === "pakete") {
        const rows = await db()
            .select()
            .from(s.packages)
            .where(scope(s.packages.userId))
            .orderBy(desc(s.packages.createdAt));
        const pending = await db()
            .select()
            .from(s.orders)
            .where(
                and(
                    scope(s.orders.userId),
                    inArray(s.orders.product, ["package12", "unlimited"]),
                    inArray(s.orders.status, ["open", "partial"]),
                ),
            );
        const serviceOrders = (
            await db()
                .select()
                .from(s.orders)
                .where(
                    and(scope(s.orders.userId), eq(s.orders.product, "offer")),
                )
                .orderBy(desc(s.orders.createdAt))
        ).filter((order) => catalogFromSnapshot(order.contract));
        const values = await business();
        body = (
            <>
                {rows.length > 0 && (
                    <Table
                        heads={[
                            ...(admin ? ["Kunde"] : []),
                            "Paket",
                            "Laufzeit",
                            "Kontingent",
                            "Status",
                        ]}
                        rows={rows.map((p) => [
                            ...(admin ? [customerLabel(p.userId)] : []),
                            products[p.product as ProductKey]?.name,
                            <span key="period">
                                {date(p.startsAt)}
                                <br />
                                bis {date(p.expiresAt)}
                                {p.cancelledAt && (
                                    <>
                                        <br />
                                        Storniert am {date(p.cancelledAt)}
                                    </>
                                )}
                            </span>,
                            p.status === "cancelled"
                                ? `${(p.usedSeconds / 3600).toFixed(2)} Stunden erfasst · keine weitere Nutzung`
                                : p.allowanceSeconds === null
                                  ? "Ohne feste Stundenobergrenze"
                                  : `${((p.allowanceSeconds - p.usedSeconds) / 3600).toFixed(2)} von 12 Stunden verbleibend`,
                            <Status
                                key="s"
                                value={
                                    p.status === "cancelled"
                                        ? "cancelled"
                                        : p.expiresAt < new Date()
                                          ? "expired"
                                          : p.status
                                }
                            />,
                        ])}
                    />
                )}
                {pending.map((o) => (
                    <section className="panel mt-6" key={o.id}>
                        <h3>
                            Zahlung ausstehend ·{" "}
                            {products[o.product as ProductKey].name}
                        </h3>
                        <p>
                            {money(o.amountCents - o.paidCents)} ·
                            Verwendungszweck: {o.reference}
                        </p>
                        <p>
                            Kontoinhaber: {values.account_holder}
                            <br />
                            IBAN: {values.iban}
                            <br />
                            BIC: {values.bic}
                            <br />
                            Bank: {values.bank_name}
                        </p>
                        {values.iban.includes("{{") && (
                            <p className="notice mt-4">
                                Die Bankverbindung ist noch nicht eingerichtet.
                                Keine Überweisung möglich.
                            </p>
                        )}
                    </section>
                ))}
                <div className="project-list mt-6">
                    {serviceOrders.map((order) => {
                        const selected = catalogFromSnapshot(order.contract)!;
                        const contract = order.contract as {
                            projectId?: string;
                            description?: string;
                        };
                        return (
                            <section className="panel" key={order.id}>
                                <h2>{selected.name}</h2>
                                {admin && (
                                    <p className="record-meta">
                                        Auftraggeber:{" "}
                                        {customerLabel(order.userId)}
                                    </p>
                                )}
                                <p className="my-4">{contract.description}</p>
                                <p>
                                    Vereinbarter Gesamtpreis:{" "}
                                    {money(order.amountCents)}
                                </p>
                                <Status value={order.status} />
                                <p className="my-4">
                                    Bestellung: {order.reference}
                                </p>
                                {order.status === "paid" &&
                                    !order.cancelledAt && (
                                        <div className="button-row">
                                            <Link
                                                className="button"
                                                href={
                                                    base +
                                                    "/projekte?id=" +
                                                    contract.projectId
                                                }
                                            >
                                                Projekt öffnen ↗
                                            </Link>
                                            {!admin && (
                                                <Link
                                                    className="button"
                                                    href={
                                                        "/konto/buchen?product=project&order=" +
                                                        order.id
                                                    }
                                                >
                                                    Enthaltenes Projektgespräch
                                                    buchen ↗
                                                </Link>
                                            )}
                                        </div>
                                    )}
                                {["open", "partial"].includes(order.status) && (
                                    <p>
                                        Offen:{" "}
                                        {money(
                                            order.amountCents - order.paidCents,
                                        )}
                                        . Kontoinhaber: {values.account_holder};
                                        IBAN: {values.iban}; Verwendungszweck:{" "}
                                        {order.reference}.{" "}
                                        {values.iban.includes("{{")
                                            ? "Die Bankverbindung ist noch nicht eingerichtet; keine Überweisung möglich."
                                            : ""}
                                    </p>
                                )}
                            </section>
                        );
                    })}
                </div>
                {!admin && (
                    <section className="panel mt-6">
                        <h2>Weitere Leistungspakete</h2>
                        <p className="my-4">
                            Pakete werden nach Klärung des Umfangs als konkretes
                            Angebot beauftragt. Deine Anfrage löst noch keine
                            Zahlung aus.
                        </p>
                        <div className="button-row">
                            {servicePackages.map((p) => (
                                <Link
                                    className="button"
                                    href={packageInquiryPath(p.key)}
                                    key={p.key}
                                >
                                    {p.name} – ab {money(p.fromCents)}
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </>
        );
    } else if (section === "projekte") {
        const rows = await db()
            .select()
            .from(s.projects)
            .where(scope(s.projects.userId))
            .orderBy(desc(s.projects.createdAt));
        if (query.id) {
            const project = rows.find((p) => p.id === query.id);
            if (!project) notFound();
            const taskRows = await db()
                .select()
                .from(s.tasks)
                .where(eq(s.tasks.projectId, project.id));
            const comments = await db()
                .select()
                .from(s.projectComments)
                .where(eq(s.projectComments.projectId, project.id))
                .orderBy(desc(s.projectComments.createdAt));
            body = (
                <>
                    <section className="panel">
                        <Status value={project.status} />
                        <h2 className="mt-5 text-4xl">{project.name}</h2>
                        {admin && (
                            <p className="record-meta">
                                Auftraggeber: {customerLabel(project.userId)}
                            </p>
                        )}
                        <p className="mt-4 whitespace-pre-wrap">
                            {project.description}
                        </p>
                        {admin && (
                            <div className="mt-6">
                                <ActionForm
                                    action="project-update"
                                    values={{ id: project.id }}
                                    fields={[
                                        {
                                            name: "status",
                                            label: "Projektstatus",
                                            value: project.status,
                                            options: Object.entries(
                                                projectStatuses,
                                            ).map(([value, label]) => ({
                                                value,
                                                label,
                                            })),
                                        },
                                        {
                                            name: "progressOverride",
                                            label: "Manuell korrigierter Fortschritt in Prozent",
                                            type: "number",
                                            value: String(
                                                project.progressOverride ?? 0,
                                            ),
                                            min: "0",
                                            max: "100",
                                        },
                                    ]}
                                    submit="Projekt aktualisieren"
                                />
                            </div>
                        )}
                    </section>
                    <section className="panel mt-6">
                        <div className="panel-header">
                            <h2>Aufgaben & Meilensteine</h2>
                        </div>
                        <Table
                            heads={["Aufgabe", "Status", "Aktion"]}
                            rows={taskRows.map((t) => [
                                t.title,
                                <Status key="s" value={t.status} />,
                                admin ? (
                                    <ActionForm
                                        key="a"
                                        action="task-update"
                                        values={{ id: t.id }}
                                        fields={[
                                            {
                                                name: "status",
                                                label: "Neuer Status",
                                                options: [
                                                    "planned",
                                                    "in_progress",
                                                    "done",
                                                    "declined",
                                                ].map((value) => ({
                                                    value,
                                                    label:
                                                        statuses[value] ??
                                                        value,
                                                })),
                                            },
                                        ]}
                                        submit="Aktualisieren"
                                    />
                                ) : (
                                    "Deine Anfrage wird zuerst geprüft."
                                ),
                            ])}
                        />
                        <div className="mt-6">
                            <ActionForm
                                action="task-request"
                                values={{ projectId: project.id }}
                                fields={[
                                    field("title", "Neue Aufgabenanfrage"),
                                    field(
                                        "description",
                                        "Beschreibung",
                                        "textarea",
                                        false,
                                    ),
                                ]}
                                submit="Aufgabe anfragen"
                            />
                        </div>
                    </section>
                    <div className="portal-grid mt-6">
                        <section className="panel">
                            <h2 className="mb-6 text-3xl">
                                Austausch zum Ergebnis
                            </h2>
                            {comments.map((c) => (
                                <div key={c.id} className="message">
                                    <p>{c.body}</p>
                                    <small>{date(c.createdAt)}</small>
                                </div>
                            ))}
                            <ActionForm
                                action="project-comment"
                                values={{ projectId: project.id }}
                                fields={[
                                    field("body", "Dein Kommentar", "textarea"),
                                ]}
                                submit="Kommentar speichern"
                            />
                        </section>
                        {admin && (
                            <section className="panel">
                                <h2 className="mb-6 text-3xl">
                                    Freigabe anfordern
                                </h2>
                                <ActionForm
                                    action="approval-request"
                                    values={{ projectId: project.id }}
                                    fields={[
                                        field("version", "Version"),
                                        field(
                                            "description",
                                            "Was soll geprüft werden?",
                                            "textarea",
                                        ),
                                    ]}
                                    submit="Zur Prüfung senden"
                                />
                            </section>
                        )}
                    </div>
                </>
            );
        } else
            body = (
                <>
                    {rows.length ? (
                        <div className="project-list">
                            {await Promise.all(
                                rows.map(async (p) => {
                                    const taskRows = await db()
                                        .select()
                                        .from(s.tasks)
                                        .where(eq(s.tasks.projectId, p.id));
                                    const planned = taskRows.filter(
                                        (t) =>
                                            t.status !== "requested" &&
                                            t.status !== "declined",
                                    );
                                    const progress =
                                        p.progressOverride ??
                                        (planned.length
                                            ? Math.round(
                                                  (planned.filter(
                                                      (t) =>
                                                          t.status === "done",
                                                  ).length /
                                                      planned.length) *
                                                      100,
                                              )
                                            : 0);
                                    return (
                                        <Link
                                            href={base + "/projekte?id=" + p.id}
                                            className="project-card"
                                            key={p.id}
                                        >
                                            <Status value={p.status} />
                                            <h2>{p.name}</h2>
                                            {admin && (
                                                <p className="record-meta">
                                                    Auftraggeber:{" "}
                                                    {customerLabel(p.userId)}
                                                </p>
                                            )}
                                            <span className="record-meta">
                                                {p.category}
                                            </span>
                                            <p>{p.description}</p>
                                            <div className="progress-track">
                                                <progress
                                                    max={100}
                                                    value={progress}
                                                    aria-label={
                                                        "Projektfortschritt " +
                                                        progress +
                                                        " Prozent"
                                                    }
                                                />
                                            </div>
                                            <p>
                                                {progress} % abgeschlossen ·{" "}
                                                {planned.length} geplante
                                                Aufgaben
                                            </p>
                                        </Link>
                                    );
                                }),
                            )}
                        </div>
                    ) : (
                        <Empty text="Hier findest Du Deine Projekte, sobald eine Zusammenarbeit vereinbart und ein Projekt angelegt wurde." />
                    )}
                    {admin && (
                        <section className="panel mt-6">
                            <h2 className="mb-6 text-3xl">Projekt anlegen</h2>
                            <ActionForm
                                action="project-create"
                                fields={[
                                    {
                                        name: "userId",
                                        label: "Kunde",
                                        required: true,
                                        options: customerChoices,
                                    },
                                    field("name", "Projektname"),
                                    field("category", "Kategorie"),
                                    field(
                                        "description",
                                        "Beschreibung",
                                        "textarea",
                                    ),
                                ]}
                                submit="Projekt erstellen"
                            />
                        </section>
                    )}
                </>
            );
    } else if (section === "aufgaben") {
        const projectRows = await db()
            .select()
            .from(s.projects)
            .where(scope(s.projects.userId));
        const ids = projectRows.map((p) => p.id);
        const rows = ids.length
            ? await db()
                  .select()
                  .from(s.tasks)
                  .where(inArray(s.tasks.projectId, ids))
                  .orderBy(desc(s.tasks.createdAt))
            : [];
        body = (
            <Table
                heads={["Aufgabe", "Projekt", "Status", "Fälligkeit"]}
                rows={rows.map((t) => [
                    t.title,
                    <Link key="p" href={base + "/projekte?id=" + t.projectId}>
                        {projectRows.find((p) => p.id === t.projectId)?.name} ↗
                    </Link>,
                    <Status key="s" value={t.status} />,
                    date(t.dueAt),
                ])}
            />
        );
    } else if (section === "zeit") {
        const rows = await db()
            .select()
            .from(s.timeEntries)
            .where(scope(s.timeEntries.userId))
            .orderBy(desc(s.timeEntries.startsAt));
        const projectRows = await db()
            .select()
            .from(s.projects)
            .where(scope(s.projects.userId));
        const options = projectRows.map((p) => ({
            value: p.id,
            label: p.name,
        }));
        const active = rows.find((t) =>
            ["running", "paused"].includes(t.status),
        );
        const packageRows = admin ? await db().select().from(s.packages) : [];
        const packageField: Field = {
            name: "packageId",
            label: "Paketzuordnung",
            options: [
                {
                    value: "",
                    label: "Ohne manuelle Zuordnung (Leistungspakete bleiben ohne Stundenabrechnung)",
                },
                ...packageRows.map((p) => ({
                    value: p.id,
                    label:
                        products[p.product as ProductKey].name +
                        " · Kunde " +
                        (customerChoices.find((c) => c.value === p.userId)
                            ?.label ?? "Archiviertes Kundenkonto") +
                        " · bis " +
                        date(p.expiresAt),
                })),
            ],
        };
        body = (
            <>
                <Table
                    heads={[
                        "Datum",
                        "Projekt",
                        "Tätigkeit",
                        "Dauer",
                        "Erfassung",
                        "Details",
                    ]}
                    rows={rows.map((t) => [
                        date(t.startsAt),
                        projectRows.find((p) => p.id === t.projectId)?.name,
                        t.activity,
                        <span key="d">
                            {(t.durationSeconds / 3600).toFixed(2)} h gesamt ·{" "}
                            {(t.chargedSeconds / 3600).toFixed(2)} h auf Paket ·{" "}
                            <Status value={t.status} />
                        </span>,
                        t.source === "timer"
                            ? "Timer"
                            : t.source === "booking"
                              ? "Beratung"
                              : "Manuell",
                        <div key="details">
                            <p>{t.description ?? "—"}</p>
                            <p className="small-note">
                                Beginn: {date(t.startsAt)} · Ende:{" "}
                                {date(t.endsAt)}
                            </p>
                            {admin && (
                                <TimeCorrectionForm
                                    entry={t}
                                    projects={projectRows
                                        .filter((p) => p.userId === t.userId)
                                        .map((p) => ({
                                            value: p.id,
                                            label: p.name,
                                        }))}
                                    packages={packageRows
                                        .filter((p) => p.userId === t.userId)
                                        .map((p) => ({
                                            value: p.id,
                                            label:
                                                products[
                                                    p.product as ProductKey
                                                ].name +
                                                " · " +
                                                date(p.startsAt) +
                                                " bis " +
                                                date(p.expiresAt),
                                        }))}
                                />
                            )}
                        </div>,
                    ])}
                />
                {admin && (
                    <div className="portal-grid mt-6">
                        <section className="panel">
                            <h2 className="mb-6 text-3xl">Timer</h2>
                            {active ? (
                                <>
                                    <p>
                                        {active.activity} ·{" "}
                                        <Status value={active.status} />
                                    </p>
                                    <div className="record-actions">
                                        {active.status === "running" ? (
                                            <ActionForm
                                                action="timer"
                                                values={{ action: "pause" }}
                                                submit="Pause"
                                            />
                                        ) : (
                                            <ActionForm
                                                action="timer"
                                                values={{ action: "resume" }}
                                                submit="Fortsetzen"
                                            />
                                        )}
                                        <ActionForm
                                            action="timer"
                                            values={{ action: "stop" }}
                                            submit="Stoppen & buchen"
                                        />
                                    </div>
                                </>
                            ) : options.length ? (
                                <ActionForm
                                    action="timer"
                                    values={{ action: "start" }}
                                    fields={[
                                        {
                                            name: "projectId",
                                            label: "Projekt",
                                            options,
                                            required: true,
                                        },
                                        packageField,
                                        field("activity", "Tätigkeit"),
                                        field(
                                            "description",
                                            "Beschreibung",
                                            "textarea",
                                            false,
                                        ),
                                    ]}
                                    submit="Timer starten"
                                />
                            ) : (
                                <Empty text="Lege zuerst ein Kundenprojekt an." />
                            )}
                        </section>
                        <section className="panel">
                            <h2 className="mb-6 text-3xl">
                                Manuelle Zeitbuchung
                            </h2>
                            {options.length ? (
                                <ActionForm
                                    action="time-manual"
                                    fields={[
                                        {
                                            name: "projectId",
                                            label: "Projekt",
                                            options,
                                            required: true,
                                        },
                                        packageField,
                                        field(
                                            "startsAt",
                                            "Beginn · Europe/Berlin",
                                            "datetime-local",
                                        ),
                                        field(
                                            "endsAt",
                                            "Ende · Europe/Berlin",
                                            "datetime-local",
                                        ),
                                        field("activity", "Tätigkeit"),
                                        field(
                                            "description",
                                            "Beschreibung",
                                            "textarea",
                                            false,
                                        ),
                                    ]}
                                    submit="Zeit buchen"
                                />
                            ) : (
                                <Empty text="Lege zuerst ein Kundenprojekt an." />
                            )}
                        </section>
                    </div>
                )}
            </>
        );
    } else if (section === "nachrichten" || section === "support") {
        const customers = admin ? customerChoices : [];
        const customerId = admin
            ? (query.customer ?? customers[0]?.value)
            : user.id;
        const rows = customerId
            ? await db()
                  .select()
                  .from(s.messages)
                  .where(eq(s.messages.userId, customerId))
                  .orderBy(s.messages.createdAt)
            : [];
        const filtered = query.q
            ? rows.filter((m) =>
                  m.body.toLowerCase().includes(query.q!.toLowerCase()),
              )
            : rows;
        if (customerId)
            await db()
                .update(s.messages)
                .set({ readAt: new Date() })
                .where(
                    and(
                        eq(s.messages.userId, customerId),
                        isOtherSender(user.id),
                        sql`${s.messages.readAt} IS NULL`,
                    ),
                );
        body = (
            <>
                <LiveRefresh />
                <div className="chat-layout">
                    <section className="panel">
                        <div className="panel-header">
                            <h2>
                                {section === "support"
                                    ? "Deine Supportanfrage"
                                    : "Direkter Austausch"}
                            </h2>
                        </div>
                        <form className="flex gap-3 mb-6" method="get">
                            <input
                                name="q"
                                aria-label="Nachrichten durchsuchen"
                                defaultValue={query.q}
                                className="border border-[#cdd0c7] px-3 py-2 min-w-0 w-full"
                            />
                            {customerId && (
                                <input
                                    type="hidden"
                                    name="customer"
                                    value={customerId}
                                />
                            )}
                            <button className="button">Suchen</button>
                        </form>
                        <div
                            className="messages"
                            aria-label="Nachrichtenverlauf"
                        >
                            {filtered.length ? (
                                filtered.map((m) => (
                                    <div
                                        key={m.id}
                                        className={
                                            "message " +
                                            (m.senderId === user.id
                                                ? "mine"
                                                : "")
                                        }
                                    >
                                        <p>{m.body}</p>
                                        <small>
                                            {date(m.createdAt)} ·{" "}
                                            {m.readAt ? "Gelesen" : "Gesendet"}
                                        </small>
                                        {m.fileId && (
                                            <a
                                                className="block underline"
                                                href={"/api/files/" + m.fileId}
                                            >
                                                Anhang herunterladen
                                            </a>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <Empty text="Hier beginnt Euer Gespräch. Schreibe eine Nachricht, wenn Du eine Frage hast." />
                            )}
                        </div>
                        {customerId && (
                            <div className="chat-compose">
                                <ActionForm
                                    action="message"
                                    values={{ userId: customerId }}
                                    fields={[
                                        field(
                                            "body",
                                            "Deine Nachricht",
                                            "textarea",
                                        ),
                                    ]}
                                    submit="Nachricht senden"
                                />
                            </div>
                        )}
                    </section>
                    <aside className="panel">
                        <h2 className="mb-4 text-2xl">
                            {admin ? "Kunden" : "Gut verbunden"}
                        </h2>
                        {admin ? (
                            customers.map((c) => (
                                <Link
                                    className="block py-3 border-b border-[#dedfd9] text-xs"
                                    key={c.value}
                                    href={
                                        "/admin/nachrichten?customer=" + c.value
                                    }
                                >
                                    {c.label}
                                </Link>
                            ))
                        ) : (
                            <p>
                                Dieser Chat ist ausschließlich für Dich und die
                                Administration sichtbar. Für Projektaufgaben
                                kannst Du direkt eine Anfrage im jeweiligen
                                Projekt stellen.
                            </p>
                        )}
                    </aside>
                </div>
            </>
        );
    } else if (["angebote", "rechnungen"].includes(section)) {
        const kind = section === "angebote" ? "offer" : "invoice";
        const rows = await db()
            .select()
            .from(s.documents)
            .where(
                and(
                    scope(s.documents.userId),
                    kind === "invoice"
                        ? inArray(s.documents.kind, ["invoice", "correction"])
                        : eq(s.documents.kind, kind),
                    admin
                        ? undefined
                        : kind === "offer"
                          ? sql`${s.documents.status} != 'draft'`
                          : undefined,
                ),
            )
            .orderBy(desc(s.documents.createdAt));
        body = (
            <>
                <Table
                    heads={[
                        ...(admin ? ["Kunde"] : []),
                        "Dokument",
                        "Leistung",
                        "Betrag",
                        "Status",
                        "Aktionen",
                    ]}
                    rows={rows.map((d) => [
                        ...(admin ? [customerLabel(d.userId)] : []),
                        d.number ?? "Entwurf",
                        d.description,
                        money(d.amountCents),
                        <Status key="s" value={d.status} />,
                        <div key="a">
                            <a href={"/api/documents/" + d.id + "/pdf"}>
                                PDF herunterladen ↓
                            </a>
                            {kind === "offer" &&
                                d.status === "sent" &&
                                !admin && (
                                    <div className="mt-4">
                                        {isMinor(user) && (
                                            <ActionForm
                                                action="guardian-offer-request"
                                                values={{ id: d.id }}
                                                submit="Zustimmung zu diesem Angebot anfordern"
                                            />
                                        )}
                                        <ActionForm
                                            action="offer-response"
                                            values={{
                                                id: d.id,
                                                accept: true,
                                                declaration:
                                                    "Ich nehme das Angebot verbindlich und zahlungspflichtig an.",
                                            }}
                                            fields={[
                                                {
                                                    name: "earlyStart",
                                                    label: "Ich wünsche ausdrücklich den Beginn nach Zahlungseingang bereits innerhalb der Widerrufsfrist.",
                                                    type: "checkbox",
                                                    required: false,
                                                },
                                                {
                                                    name: "withdrawalAcknowledged",
                                                    label: "Ich habe die Hinweise zum frühzeitigen Leistungsbeginn und zum Widerrufsrecht gelesen.",
                                                    type: "checkbox",
                                                    required: false,
                                                },
                                            ]}
                                            submit="Zahlungspflichtig annehmen"
                                        />
                                        <div className="mt-2">
                                            <ActionForm
                                                action="offer-response"
                                                values={{
                                                    id: d.id,
                                                    accept: false,
                                                    declaration:
                                                        "Ich lehne dieses Angebot ab.",
                                                }}
                                                submit="Angebot ablehnen"
                                            />
                                        </div>
                                    </div>
                                )}
                            {admin && d.status === "draft" && (
                                <div className="record-actions">
                                    <Link
                                        className="button"
                                        href={"/admin/angebote/neu?id=" + d.id}
                                    >
                                        Entwurf bearbeiten ↗
                                    </Link>
                                    {kind === "offer" ? (
                                        <ActionForm
                                            action="offer-send"
                                            values={{ id: d.id }}
                                            submit="Angebot versenden"
                                        />
                                    ) : (
                                        <ActionForm
                                            action="invoice-issue"
                                            values={{ id: d.id }}
                                            submit="Rechnung finalisieren"
                                        />
                                    )}
                                </div>
                            )}
                            {admin &&
                                d.kind === "invoice" &&
                                d.finalizedAt &&
                                d.status !== "cancelled" && (
                                    <div className="mt-4">
                                        <ActionForm
                                            action="invoice-cancel"
                                            values={{ id: d.id }}
                                            fields={[
                                                {
                                                    name: "mode",
                                                    label: "Was soll geändert werden?",
                                                    options: [
                                                        {
                                                            value: "correction",
                                                            label: "Nur Rechnung berichtigen – Leistungen bleiben bestehen",
                                                        },
                                                        {
                                                            value: "contract",
                                                            label: "Bestellung und Leistungen vollständig stornieren",
                                                        },
                                                    ],
                                                    required: true,
                                                },
                                                field(
                                                    "reason",
                                                    "Korrekturgrund (mindestens 10 Zeichen)",
                                                    "textarea",
                                                ),
                                            ]}
                                            submit="Gewählte Korrektur verbindlich ausführen"
                                        />
                                    </div>
                                )}
                        </div>,
                    ])}
                />
                {admin && kind === "offer" && (
                    <section className="panel mt-6">
                        <h2 className="mb-6 text-3xl">Individuelles Angebot</h2>
                        <p className="mb-6">
                            Erstelle ein Angebot mit mehreren Positionen, Mengen
                            und Einzelpreisen. Es bleibt bis zum bewussten
                            Versand ein Entwurf.
                        </p>
                        <Link href="/admin/angebote/neu" className="button">
                            Angebotseditor öffnen ↗
                        </Link>
                    </section>
                )}
            </>
        );
    } else if (section === "benachrichtigungen") {
        const rows = await db()
            .select()
            .from(s.notifications)
            .where(eq(s.notifications.userId, user.id))
            .orderBy(desc(s.notifications.createdAt));
        body = rows.length ? (
            <div className="row-list panel">
                {rows.map((n) => (
                    <div key={n.id}>
                        <h3>{n.title}</h3>
                        <span className="record-meta">
                            {date(n.createdAt)} · {n.type}
                        </span>
                        <p>{n.body}</p>
                        <div className="record-actions">
                            <Link href={n.url} className="button">
                                Details öffnen ↗
                            </Link>
                            {!n.readAt && (
                                <ActionForm
                                    action="notification-read"
                                    values={{ id: n.id }}
                                    submit="Als gelesen markieren"
                                />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <Empty text="Du hast noch keine Benachrichtigungen." />
        );
    } else if (section === "einstellungen") {
        const values = await business();
        body = (
            <section className="form-panel">
                <h2>Geschäftliche Stammdaten</h2>
                <p className="mb-6">
                    Avelsorn und das Logo sind im Markenblatt festgelegt. Diese
                    Werte werden zentral für Website, Dokumente und Signaturen
                    verwendet. Geheimnisse werden ausschließlich über
                    Serverkonfiguration gepflegt.
                </p>
                <ActionForm
                    action="settings"
                    fields={publicKeys
                        .filter((key) => key !== "brand_name")
                        .map((key) =>
                            field(
                                key,
                                businessLabels[key],
                                key === "contact_email"
                                    ? "email"
                                    : key === "about_text"
                                      ? "textarea"
                                      : "text",
                                false,
                                values[key].includes("{{") ? "" : values[key],
                            ),
                        )}
                    submit="Geschäftsangaben speichern"
                />
            </section>
        );
    } else if (section === "zahlungen") {
        const rows = await db()
            .select()
            .from(s.orders)
            .orderBy(desc(s.orders.createdAt));
        body = (
            <Table
                heads={[
                    "Bestellung",
                    "Leistung",
                    "Gesamt / Offen",
                    "Status",
                    "Bankeingang prüfen",
                    "Bestellung stornieren",
                ]}
                rows={rows.map((o) => [
                    o.reference,
                    products[o.product as ProductKey]?.name ??
                        "Individuelles Angebot",
                    `${money(o.amountCents)} / ${money(o.amountCents - o.paidCents)}`,
                    <Status key="s" value={o.status} />,
                    ["open", "partial", "overdue"].includes(o.status) ? (
                        <ActionForm
                            key="a"
                            action="payment"
                            values={{
                                orderId: o.id,
                                idempotencyKey: crypto.randomUUID(),
                            }}
                            fields={[
                                field(
                                    "amountCents",
                                    "Tatsächlicher Betrag in Euro",
                                    "currency",
                                    true,
                                    String(o.amountCents - o.paidCents),
                                ),
                                field(
                                    "bankReference",
                                    "Referenz des geprüften Bankeingangs",
                                ),
                                field(
                                    "receivedAt",
                                    "Zahlungseingang · Europe/Berlin",
                                    "datetime-local",
                                    true,
                                    new Date().toISOString(),
                                ),
                            ]}
                            submit="Geprüften Zahlungseingang bestätigen"
                        />
                    ) : o.paidCents > 0 ? (
                        <ActionForm
                            action="refund"
                            values={{
                                orderId: o.id,
                                idempotencyKey: crypto.randomUUID(),
                            }}
                            fields={[
                                field(
                                    "amountCents",
                                    "Tatsächlich erstatteter Betrag in Euro",
                                    "currency",
                                    true,
                                    String(o.paidCents),
                                ),
                                field(
                                    "bankReference",
                                    "Referenz der geprüften Rücküberweisung",
                                ),
                                field(
                                    "receivedAt",
                                    "Rücküberweisung · Europe/Berlin",
                                    "datetime-local",
                                    true,
                                    new Date().toISOString(),
                                ),
                            ]}
                            submit="Geprüfte Rückzahlung dokumentieren"
                        />
                    ) : (
                        "Keine offene Forderung"
                    ),
                    !o.cancelledAt ? (
                        <details key="cancel">
                            <summary className="cursor-pointer underline">
                                Bestellung und Leistungen stornieren
                            </summary>
                            <p className="small-note">
                                Beendet zugehörige Pakete und laufende oder
                                kommende Termine. Finalisierte Rechnungen
                                erhalten einen Stornobeleg. Eine Rückzahlung
                                wird anschließend mit dem tatsächlichen
                                Bankbeleg dokumentiert.
                            </p>
                            <ActionForm
                                action="order-cancel"
                                values={{ orderId: o.id }}
                                fields={[
                                    {
                                        name: "reason",
                                        label: "Stornierungsgrund (mindestens 10 Zeichen)",
                                        type: "textarea",
                                        required: true,
                                    },
                                ]}
                                submit="Bestellung und Leistungen verbindlich stornieren"
                                success="Die Bestellung und die zugehörigen Leistungen wurden storniert."
                            />
                        </details>
                    ) : (
                        "Bereits storniert"
                    ),
                ])}
            />
        );
    } else if (section === "kunden" || section === "onboarding") {
        const rows = await db()
            .select()
            .from(s.users)
            .where(eq(s.users.role, "customer"))
            .orderBy(desc(s.users.createdAt));
        const forms = await db().select().from(s.onboarding);
        const guardians = await db().select().from(s.guardianConsents);
        body = (
            <Table
                heads={[
                    "Kunde",
                    "Registrierung",
                    "Verifizierung / Fragebogen",
                    "Details",
                ]}
                rows={rows.map((c) => [
                    <div key="c">
                        {c.name}
                        <br />
                        {c.email}
                    </div>,
                    date(c.createdAt),
                    `${c.verifiedAt ? "E-Mail bestätigt" : "E-Mail offen"} · ${c.onboardingAt ? "Fragebogen abgeschlossen" : "Fragebogen offen"}`,
                    <details key="d">
                        <summary className="cursor-pointer underline">
                            Angaben ansehen
                        </summary>
                        <div className="whitespace-pre-wrap mt-4">
                            {Object.entries(
                                forms.find((f) => f.userId === c.id)?.answers ??
                                    {},
                            ).map(([k, v]) => (
                                <p key={k}>
                                    <strong>{k}:</strong> {v}
                                </p>
                            ))}
                            {guardians
                                .filter(
                                    (g) =>
                                        g.userId === c.id &&
                                        g.status === "contract_review",
                                )
                                .map((g) => (
                                    <div key={g.id} className="my-4">
                                        <p>Konkrete Vertretung: {g.scope}</p>
                                        <ActionForm
                                            action="guardian-contract-review"
                                            values={{ id: g.id }}
                                            submit="Geprüfte konkrete Vertretung freigeben"
                                        />
                                    </div>
                                ))}
                            {guardians.find(
                                (g) =>
                                    g.userId === c.id &&
                                    g.status === "awaiting_review",
                            ) && (
                                <ActionForm
                                    action="guardian-review"
                                    values={{ userId: c.id }}
                                    submit="Geprüfte Vertretungsberechtigung freigeben"
                                />
                            )}
                        </div>
                    </details>,
                ])}
            />
        );
    } else if (section === "kontakt") {
        const rows = await db()
            .select()
            .from(s.contacts)
            .orderBy(desc(s.contacts.createdAt));
        body = (
            <Table
                heads={["Kontakt", "Betreff", "Nachricht", "Status"]}
                rows={rows.map((r) => [
                    `${r.name} · ${r.email}`,
                    r.subject,
                    r.body,
                    <Status key="s" value={r.status} />,
                ])}
            />
        );
    } else if (section === "datenschutz") {
        const rows = await db()
            .select()
            .from(s.privacyRequests)
            .where(scope(s.privacyRequests.userId))
            .orderBy(desc(s.privacyRequests.createdAt));
        body = (
            <>
                {!admin && (
                    <section className="form-panel mb-6">
                        <h2>Deine Daten. Deine Rechte.</h2>
                        <p className="mb-5">
                            Du kannst Auskunft, Export, Berichtigung oder
                            Löschung anfordern. Gesetzlich aufzubewahrende
                            Unterlagen werden gesondert behandelt.
                        </p>
                        <ActionForm
                            action="privacy-request"
                            fields={[
                                {
                                    name: "type",
                                    label: "Was möchtest Du anfordern?",
                                    options: [
                                        {
                                            value: "access",
                                            label: "Datenauskunft",
                                        },
                                        {
                                            value: "export",
                                            label: "Datenexport",
                                        },
                                        {
                                            value: "correction",
                                            label: "Berichtigung",
                                        },
                                        {
                                            value: "deletion",
                                            label: "Löschung",
                                        },
                                    ],
                                },
                                field(
                                    "body",
                                    "Dein Anliegen",
                                    "textarea",
                                    false,
                                ),
                            ]}
                            submit="Anfrage stellen"
                        />
                        <a
                            download="meine-daten.json"
                            className="arrow-link mt-6"
                            href="/api/account/export"
                        >
                            Gespeicherte Daten direkt exportieren ↓
                        </a>
                    </section>
                )}
                <Table
                    heads={["Anfrage", "Datum", "Status", "Bearbeitung"]}
                    rows={rows.map((r) => [
                        r.type,
                        date(r.createdAt),
                        <Status key="s" value={r.status} />,
                        admin && r.status !== "completed" ? (
                            <ActionForm
                                key="a"
                                action="privacy-resolve"
                                values={{ id: r.id }}
                                fields={[
                                    field(
                                        "resolution",
                                        "Bearbeitung und Aufbewahrungsprüfung dokumentieren (mindestens 20 Zeichen)",
                                        "textarea",
                                    ),
                                    field(
                                        "performDeletion",
                                        "Bei Löschanfragen: geprüfte tatsächliche Löschung ausführen; aufbewahrungspflichtige Unterlagen getrennt erhalten.",
                                        "checkbox",
                                        false,
                                    ),
                                ]}
                                submit="Bearbeitung abschließen"
                            />
                        ) : (
                            (r.resolution ?? "Wird bearbeitet")
                        ),
                    ])}
                />
            </>
        );
    } else if (section === "widerrufe") {
        const rows = await db()
            .select()
            .from(s.withdrawals)
            .orderBy(desc(s.withdrawals.createdAt));
        body = (
            <Table
                heads={["Referenz", "Vertrag", "Erklärung", "Eingang"]}
                rows={rows.map((r) => [
                    r.reference,
                    r.contractReference,
                    `${r.name} · ${r.email} · ${r.statement}`,
                    date(r.createdAt),
                ])}
            />
        );
    } else if (section === "sicherheit") {
        const rows = await db()
            .select()
            .from(s.auditEvents)
            .orderBy(desc(s.auditEvents.createdAt))
            .limit(200);
        body = (
            <Table
                heads={["Zeit", "Aktion", "Ressource", "Akteur"]}
                rows={rows.map((r) => [
                    date(r.createdAt),
                    r.action,
                    `${r.resource} · ${r.resourceId ?? "—"}`,
                    r.actorId ?? "System",
                ])}
            />
        );
    } else if (section === "status" || section === "system") {
        const missing = await readiness();
        body = (
            <div className="portal-grid">
                <section className="panel">
                    <h2 className="mb-6 text-3xl">Freigabestatus</h2>
                    <p>
                        Die lokale Anwendung ist von der späteren
                        Produktionsfreigabe getrennt. Es wurde keine externe
                        Infrastruktur eingerichtet.
                    </p>
                    <ul className="plain-list">
                        {missing.map((k) => (
                            <li key={k}>{k}: noch offen</li>
                        ))}
                    </ul>
                </section>
                <section className="panel">
                    <h2 className="mb-6 text-3xl">Konfigurierte Adapter</h2>
                    <p>
                        Datenbank:{" "}
                        {process.env.DATABASE_URL
                            ? "PostgreSQL-Netzwerkadapter"
                            : "Lokales persistentes PGlite/PostgreSQL"}
                        <br />
                        Dateien:{" "}
                        {process.env.STORAGE_DRIVER === "s3"
                            ? "Privater Objektspeicher"
                            : "Lokaler privater Speicher"}
                        <br />
                        SMTP:{" "}
                        {process.env.SMTP_HOST
                            ? "Konfiguriert, tatsächliche Zustellung separat prüfen"
                            : "Nicht konfiguriert · nur Warteschlange"}
                        <br />
                        Video:{" "}
                        {process.env.VIDEO_PROVIDER_URL
                            ? "Provider konfiguriert, Integration separat prüfen"
                            : "Nicht konfiguriert"}
                        <br />
                        Echtzeit: Authentifiziertes Polling
                    </p>
                </section>
            </div>
        );
    } else if (section === "freigaben") {
        const projectRows = await db()
            .select()
            .from(s.projects)
            .where(scope(s.projects.userId));
        const ids = projectRows.map((p) => p.id);
        const rows = ids.length
            ? await db()
                  .select()
                  .from(s.approvals)
                  .where(inArray(s.approvals.projectId, ids))
            : [];
        body = (
            <Table
                heads={[
                    "Projekt / Version",
                    "Ergebnis",
                    "Status",
                    "Deine Antwort",
                ]}
                rows={rows.map((r) => [
                    `${projectRows.find((p) => p.id === r.projectId)?.name} · ${r.version}`,
                    r.description,
                    <Status key="s" value={r.status} />,
                    r.status === "pending" ? (
                        <ActionForm
                            key="a"
                            action="approval-response"
                            values={{ id: r.id }}
                            fields={[
                                {
                                    name: "status",
                                    label: "Deine Entscheidung",
                                    options: [
                                        {
                                            value: "approved",
                                            label: "Ergebnis freigeben",
                                        },
                                        {
                                            value: "changes",
                                            label: "Änderung anfordern",
                                        },
                                    ],
                                },
                                field(
                                    "comment",
                                    "Kommentar",
                                    "textarea",
                                    false,
                                ),
                            ]}
                            submit="Antwort verbindlich speichern"
                        />
                    ) : (
                        (r.comment ?? "Antwort gespeichert")
                    ),
                ])}
            />
        );
    } else if (section === "dateien") {
        const rows = await db()
            .select()
            .from(s.files)
            .where(
                and(scope(s.files.userId), sql`${s.files.deletedAt} IS NULL`),
            )
            .orderBy(desc(s.files.createdAt));
        const projects = await db()
            .select()
            .from(s.projects)
            .where(scope(s.projects.userId));
        body = (
            <>
                <Table
                    heads={[
                        ...(admin ? ["Zuordnung"] : []),
                        "Datei",
                        "Typ / Größe",
                        "Datum",
                        "Download",
                    ]}
                    rows={rows.map((f) => [
                        ...(admin
                            ? [
                                  f.userId === user.id
                                      ? "Unternehmen"
                                      : customerLabel(f.userId),
                              ]
                            : []),
                        f.name,
                        `${f.mime} · ${(f.size / 1024).toFixed(1)} KB`,
                        date(f.createdAt),
                        <a key="d" href={"/api/files/" + f.id}>
                            Geschützt herunterladen ↓
                        </a>,
                    ])}
                />
                <section className="panel mt-6">
                    <h2 className="mb-6 text-3xl">Datei hochladen</h2>
                    <UploadForm
                        customers={
                            admin
                                ? [
                                      {
                                          value: user.id,
                                          label: "Eigene Unternehmensdateien",
                                      },
                                      ...customerChoices,
                                  ]
                                : undefined
                        }
                        projects={projects.map((p) => ({
                            value: p.id,
                            label: p.name,
                        }))}
                    />
                </section>
            </>
        );
    } else if (section === "angebote/neu") {
        const [draft] = query.id
            ? await db()
                  .select()
                  .from(s.documents)
                  .where(eq(s.documents.id, query.id))
            : [];
        if (query.id && draft?.status !== "draft") notFound();
        if (draft?.kind === "invoice") title = "Rechnungseditor";
        body = (
            <section className="form-panel">
                <OfferEditor customers={customerChoices} initial={draft} />
            </section>
        );
    } else if (section === "blog") {
        const rows = await db()
            .select()
            .from(s.posts)
            .orderBy(desc(s.posts.updatedAt));
        const post = rows.find((p) => p.id === query.id);
        body = query.edit ? (
            <section className="panel">
                <CmsEditor
                    initial={
                        post
                            ? {
                                  ...post,
                                  seoTitle: post.seoTitle ?? "",
                                  metaDescription: post.metaDescription ?? "",
                                  publishAt:
                                      post.publishAt?.toISOString() ?? "",
                              }
                            : undefined
                    }
                />
            </section>
        ) : (
            <>
                <Link href="/admin/blog?edit=1" className="button primary mb-6">
                    Beitrag erstellen ↗
                </Link>
                <Table
                    heads={["Titel", "Kategorie", "Status", "Aktionen"]}
                    rows={rows.map((p) => [
                        p.title,
                        p.category,
                        <Status key="s" value={p.status} />,
                        <Link key="a" href={"/admin/blog?edit=1&id=" + p.id}>
                            Bearbeiten ↗
                        </Link>,
                    ])}
                />
                <MediaManager adminId={user.id} />
            </>
        );
    } else if (section === "email") {
        const attachments = await db()
            .select({
                id: s.files.id,
                name: s.files.name,
                userId: s.files.userId,
            })
            .from(s.files)
            .where(sql`${s.files.deletedAt} IS NULL`);
        const rows = await db()
            .select({
                id: s.outbox.id,
                to: s.outbox.to,
                subject: s.outbox.subject,
                status: s.outbox.status,
                createdAt: s.outbox.createdAt,
                sentAt: s.outbox.sentAt,
                errorCode: s.outbox.errorCode,
            })
            .from(s.outbox)
            .orderBy(desc(s.outbox.createdAt))
            .limit(100);
        body = (
            <>
                <section className="panel">
                    <h2 className="mb-6 text-3xl">
                        Persönliche E-Mail verfassen
                    </h2>
                    <EmailComposer
                        customers={customerChoices}
                        attachments={attachments}
                    />
                </section>
                <section className="mt-6">
                    <Table
                        heads={["Empfänger", "Betreff", "Status", "Zeitpunkt"]}
                        rows={rows.map((m) => [
                            m.to,
                            m.subject,
                            <Status key="s" value={m.status} />,
                            date(m.sentAt ?? m.createdAt),
                        ])}
                    />
                </section>
            </>
        );
    } else if (section === "inhalte") {
        const rows = await db().select().from(s.pages);
        body = (
            <section className="form-panel">
                <h2>Website-Inhalte verwalten</h2>
                <p className="mb-6">
                    Ein Inhalt wird anhand seines URL-Pfads zugeordnet. HTML
                    wird vor dem Speichern bereinigt. Gesetzliche Angaben
                    bleiben zentral in den Geschäftseinstellungen.
                </p>
                <ActionForm
                    action="page-save"
                    fields={[
                        field("slug", "Seitenpfad ohne führenden Schrägstrich"),
                        field("title", "Seitentitel"),
                        field("description", "Meta-Beschreibung", "textarea"),
                        field("body", "Seiteninhalt als HTML", "textarea"),
                    ]}
                    submit="Inhalt speichern"
                />
                <div className="mt-6">
                    <Table
                        heads={["Pfad", "Titel", "Aktualisiert"]}
                        rows={rows.map((p) => [
                            p.slug,
                            p.title,
                            date(p.updatedAt),
                        ])}
                    />
                </div>
            </section>
        );
    } else if (section === "backups") {
        const rows = await db()
            .select()
            .from(s.backups)
            .orderBy(desc(s.backups.createdAt));
        body = (
            <>
                <section className="panel mb-6">
                    <h2 className="mb-4 text-3xl">
                        Verschlüsselte Datensicherung
                    </h2>
                    <p className="mb-5">
                        Sichert Datenbank, Geschäftseinstellungen und private
                        Dateien. Der gesonderte BACKUP_KEY muss sicher und
                        getrennt aufbewahrt werden. Wiederherstellung
                        ausschließlich in eine leere, separat migrierte
                        Datenbank.
                    </p>
                    <ActionForm
                        action="backup-create"
                        submit="Verschlüsselte Sicherung erstellen"
                    />
                </section>
                <Table
                    heads={["Erstellt", "Status", "Größe", "Download"]}
                    rows={rows.map((r) => [
                        date(r.createdAt),
                        <Status key="s" value={r.status} />,
                        r.size ? `${(r.size / 1024).toFixed(1)} KB` : "—",
                        r.status === "completed" ? (
                            <a key="d" href={"/api/backups/" + r.id}>
                                Verschlüsselte Sicherung ↓
                            </a>
                        ) : (
                            (r.errorCode ?? "Wird erstellt")
                        ),
                    ])}
                />
            </>
        );
    } else body = <Empty text="Dieser Bereich enthält noch keine Einträge." />;
    return (
        <PortalShell user={user} admin={admin} section={section}>
            <div className="portal-heading">
                <div>
                    <h1>
                        {!section
                            ? admin
                                ? "Anfragen und Verwaltung"
                                : "Dein Kundenkonto"
                            : title}
                    </h1>
                    <p>
                        {admin
                            ? !section
                                ? "Eingänge prüfen, Kunden betreuen und Aufträge verwalten."
                                : "Verwaltung aller zugehörigen Kundenvorgänge."
                            : !section
                              ? "Termine, Projekte und Unterlagen zu Deinen Aufträgen."
                              : "Alle Informationen aus Deinem geschützten Bereich."}
                    </p>
                </div>
                {!admin && !["buchen", "fragebogen"].includes(section) && (
                    <Link href="/konto/buchen" className="button primary small">
                        Beratung buchen ↗
                    </Link>
                )}
            </div>
            {body}
        </PortalShell>
    );
}
async function customerOptions() {
    return (
        await db()
            .select({
                id: s.users.id,
                name: s.users.name,
                email: s.users.email,
            })
            .from(s.users)
            .where(eq(s.users.role, "customer"))
    ).map((c) => ({ value: c.id, label: `${c.name} · ${c.email}` }));
}
function isOtherSender(id: string) {
    return sql`${s.messages.senderId} <> ${id}`;
}
