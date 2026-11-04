import Link from "next/link";
import {
    and,
    count,
    desc,
    eq,
    inArray,
    isNull,
    notInArray,
    sql,
} from "drizzle-orm";
import { db } from "@/server/db";
import * as s from "@/server/schema";
import { requireUser } from "@/server/security";
import { berlin, money } from "@/server/config";

export async function AdminOverview() {
    await requireUser(true);
    const [
        requests,
        unread,
        projects,
        outstanding,
        contacts,
        messages,
        customers,
    ] = await Promise.all([
        db()
            .select({ value: count() })
            .from(s.contacts)
            .where(eq(s.contacts.status, "open")),
        db()
            .select({ value: count() })
            .from(s.messages)
            .innerJoin(s.users, eq(s.users.id, s.messages.senderId))
            .where(
                and(eq(s.users.role, "customer"), isNull(s.messages.readAt)),
            ),
        db()
            .select({ value: count() })
            .from(s.projects)
            .where(notInArray(s.projects.status, ["completed", "archived"])),
        db()
            .select({
                value: sql<number>`coalesce(sum(${s.orders.amountCents} - ${s.orders.paidCents}), 0)`,
            })
            .from(s.orders)
            .where(inArray(s.orders.status, ["open", "partial", "overdue"])),
        db()
            .select()
            .from(s.contacts)
            .where(eq(s.contacts.status, "open"))
            .orderBy(desc(s.contacts.createdAt))
            .limit(6),
        db()
            .select({
                id: s.messages.id,
                customerId: s.messages.userId,
                name: s.users.name,
                body: s.messages.body,
                createdAt: s.messages.createdAt,
            })
            .from(s.messages)
            .innerJoin(s.users, eq(s.users.id, s.messages.senderId))
            .where(and(eq(s.users.role, "customer"), isNull(s.messages.readAt)))
            .orderBy(desc(s.messages.createdAt))
            .limit(5),
        db()
            .select({
                id: s.users.id,
                name: s.users.name,
                email: s.users.email,
                createdAt: s.users.createdAt,
                verifiedAt: s.users.verifiedAt,
                onboardingAt: s.users.onboardingAt,
            })
            .from(s.users)
            .where(eq(s.users.role, "customer"))
            .orderBy(desc(s.users.createdAt))
            .limit(5),
    ]);
    return (
        <>
            <div className="stat-grid portal-overview-stats">
                {[
                    [requests[0].value, "Offene Anfragen", "/admin/kontakt"],
                    [
                        unread[0].value,
                        "Ungelesene Nachrichten",
                        "/admin/nachrichten",
                    ],
                    [projects[0].value, "Aktive Aufträge", "/admin/projekte"],
                    [
                        money(Number(outstanding[0].value)),
                        "Offene Zahlungen",
                        "/admin/zahlungen",
                    ],
                ].map(([value, label, href]) => (
                    <Link
                        className="stat-card"
                        href={String(href)}
                        key={String(label)}
                    >
                        <span>{label}</span>
                        <strong>{value}</strong>
                        <span>Verwalten ↗</span>
                    </Link>
                ))}
            </div>
            <div className="portal-grid admin-workspace">
                <section className="panel admin-incoming">
                    <div className="panel-header">
                        <h2>Eingegangene Anfragen</h2>
                        <Link href="/admin/kontakt">Alle Anfragen ↗</Link>
                    </div>
                    {contacts.length ? (
                        <div className="portal-overview-list">
                            {contacts.map((contact) => (
                                <article key={contact.id}>
                                    <div className="admin-record-heading">
                                        <h3>{contact.subject}</h3>
                                        <time
                                            dateTime={contact.createdAt.toISOString()}
                                        >
                                            {berlin(contact.createdAt)}
                                        </time>
                                    </div>
                                    <p className="admin-sender">
                                        {contact.name} · {contact.email}
                                    </p>
                                    <p>
                                        {contact.body.slice(0, 220)}
                                        {contact.body.length > 220 ? "…" : ""}
                                    </p>
                                    <Link href="/admin/kontakt">
                                        Anfrage lesen ↗
                                    </Link>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <p className="empty-state">
                            Es liegen keine offenen Kontakt- oder Paket-Anfragen
                            vor.
                        </p>
                    )}
                </section>
                <section className="panel">
                    <div className="panel-header">
                        <h2>Nachrichten von Kunden</h2>
                        <Link href="/admin/nachrichten">Chat öffnen ↗</Link>
                    </div>
                    {messages.length ? (
                        <div className="portal-overview-list">
                            {messages.map((message) => (
                                <article key={message.id}>
                                    <h3>{message.name}</h3>
                                    <p>
                                        {message.body.slice(0, 160)}
                                        {message.body.length > 160 ? "…" : ""}
                                    </p>
                                    <Link
                                        href={
                                            "/admin/nachrichten?customer=" +
                                            message.customerId
                                        }
                                    >
                                        Nachricht beantworten ↗
                                    </Link>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <p className="empty-state">
                            Es gibt keine ungelesenen Nachrichten von Kunden.
                        </p>
                    )}
                </section>
                <section className="panel">
                    <div className="panel-header">
                        <h2>Neue Registrierungen</h2>
                        <Link href="/admin/kunden">Kunden verwalten ↗</Link>
                    </div>
                    {customers.length ? (
                        <div className="portal-overview-list">
                            {customers.map((customer) => (
                                <article key={customer.id}>
                                    <h3>{customer.name}</h3>
                                    <p>{customer.email}</p>
                                    <p>
                                        {customer.verifiedAt
                                            ? "E-Mail bestätigt"
                                            : "E-Mail-Bestätigung offen"}{" "}
                                        ·{" "}
                                        {customer.onboardingAt
                                            ? "Fragebogen vollständig"
                                            : "Fragebogen offen"}
                                    </p>
                                    <time
                                        dateTime={customer.createdAt.toISOString()}
                                    >
                                        {berlin(customer.createdAt)}
                                    </time>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <p className="empty-state">
                            Es sind noch keine Kunden registriert.
                        </p>
                    )}
                </section>
                <section className="panel">
                    <div className="panel-header">
                        <h2>Verwaltungsaufgaben</h2>
                    </div>
                    <div className="portal-task-links">
                        <Link href="/admin/angebote/neu">
                            Angebot erstellen ↗
                        </Link>
                        <Link href="/admin/kalender">
                            Buchungen verwalten ↗
                        </Link>
                        <Link href="/admin/datenschutz">
                            Datenschutzanfragen prüfen ↗
                        </Link>
                        <Link href="/admin/widerrufe">
                            Widerrufe bearbeiten ↗
                        </Link>
                    </div>
                </section>
            </div>
        </>
    );
}
