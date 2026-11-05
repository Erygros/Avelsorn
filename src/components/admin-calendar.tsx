"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ActionForm } from "./action-form";
import { RescheduleForm } from "./reschedule-form";

export type AdminAppointment = {
    id: string;
    userId?: string;
    guest?: boolean;
    sequence?: number;
    name: string;
    email: string;
    phone: string;
    company: string;
    topic: string;
    notes: string;
    startsAt: string;
    endsAt: string;
    createdAt: string;
    status: string;
    product: string;
};
const key = (instant: string) =>
    new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Berlin" }).format(
        new Date(instant),
    );
const shift = (day: string, n: number) =>
    new Date(new Date(day + "T12:00Z").getTime() + n * 86400000)
        .toISOString()
        .slice(0, 10);
const dateLabel = (day: string) =>
    new Intl.DateTimeFormat("de-DE", {
        dateStyle: "full",
        timeZone: "UTC",
    }).format(new Date(day + "T12:00Z"));
const clock = (instant: string) =>
    new Intl.DateTimeFormat("de-DE", {
        timeZone: "Europe/Berlin",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(instant));
const statusLabel: Record<string, string> = {
    confirmed: "Bestätigt",
    reserved: "Reserviert",
    cancelled: "Abgesagt",
    completed: "Abgeschlossen",
    expired: "Abgelaufen",
};
export function AdminCalendar({
    appointments,
    initialBooking,
}: {
    appointments: AdminAppointment[];
    initialBooking?: string;
}) {
    const [view, setView] = useState<"month" | "week" | "day" | "list">(
        "month",
    );
    const [day, setDay] = useState(key(new Date().toISOString()));
    const [selected, setSelected] = useState<string | null>(
        initialBooking ?? null,
    );
    const dialog = useRef<HTMLDialogElement>(null);
    const current = appointments.find((b) => b.id === selected);
    useEffect(() => {
        if (current && !dialog.current?.open) dialog.current?.showModal();
    }, [current]);
    const first = day.slice(0, 7) + "-01";
    const count = new Date(
        Number(day.slice(0, 4)),
        Number(day.slice(5, 7)),
        0,
    ).getDate();
    const offset = (new Date(first + "T12:00Z").getUTCDay() + 6) % 7;
    const weekStart = shift(
        day,
        -((new Date(day + "T12:00Z").getUTCDay() + 6) % 7),
    );
    const dates =
        view === "month"
            ? Array.from({ length: count }, (_, i) => shift(first, i))
            : view === "week"
              ? Array.from({ length: 7 }, (_, i) => shift(weekStart, i))
              : [day];
    const jump = (direction: number) => {
        if (view === "month") {
            const value =
                direction < 0 ? shift(first, -1) : shift(first, count);
            setDay(value.slice(0, 7) + "-01");
        } else setDay(shift(day, direction * (view === "week" ? 7 : 1)));
    };
    const itemsFor = (date: string) =>
        appointments
            .filter((b) => key(b.startsAt) === date)
            .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
    return (
        <section className="crm-calendar" aria-label="Administrationskalender">
            <div className="crm-toolbar">
                <div
                    className="calendar-view-tabs"
                    role="group"
                    aria-label="Kalenderansicht"
                >
                    {(
                        [
                            ["month", "Monat"],
                            ["week", "Woche"],
                            ["day", "Tag"],
                            ["list", "Liste"],
                        ] as const
                    ).map(([id, label]) => (
                        <button
                            key={id}
                            type="button"
                            className="button small"
                            aria-pressed={view === id}
                            onClick={() => setView(id)}
                        >
                            {label}
                        </button>
                    ))}
                </div>
                <div className="calendar-date-controls">
                    <button
                        type="button"
                        className="button small"
                        aria-label="Zurück"
                        onClick={() => jump(-1)}
                    >
                        ←
                    </button>
                    <label>
                        Datum
                        <input
                            type="date"
                            value={day}
                            onChange={(e) => {
                                if (e.target.value) setDay(e.target.value);
                            }}
                        />
                    </label>
                    <button
                        type="button"
                        className="button small"
                        aria-label="Weiter"
                        onClick={() => jump(1)}
                    >
                        →
                    </button>
                    <button
                        type="button"
                        className="button small"
                        onClick={() => setDay(key(new Date().toISOString()))}
                    >
                        Heute
                    </button>
                </div>
            </div>
            <h2>
                {view === "month"
                    ? new Intl.DateTimeFormat("de-DE", {
                          month: "long",
                          year: "numeric",
                          timeZone: "UTC",
                      }).format(new Date(first + "T12:00Z"))
                    : view === "list"
                      ? "Terminliste"
                      : dateLabel(day)}
            </h2>
            {view === "list" ? (
                <div className="calendar-agenda">
                    {appointments.length ? (
                        appointments
                            .toSorted((a, b) =>
                                a.startsAt.localeCompare(b.startsAt),
                            )
                            .map((b) => (
                                <button
                                    type="button"
                                    key={b.id}
                                    onClick={() => setSelected(b.id)}
                                >
                                    <time dateTime={b.startsAt}>
                                        {dateLabel(key(b.startsAt))} ·{" "}
                                        {clock(b.startsAt)}
                                    </time>
                                    <strong>{b.name}</strong>
                                    <span>
                                        {statusLabel[b.status] ?? b.status}
                                    </span>
                                </button>
                            ))
                    ) : (
                        <p>Keine Termine vorhanden.</p>
                    )}
                </div>
            ) : (
                <div className={"crm-grid crm-" + view}>
                    {view === "month" &&
                        Array.from({ length: offset }, (_, i) => (
                            <div
                                className="crm-calendar-empty"
                                key={"empty" + i}
                                aria-hidden="true"
                            />
                        ))}
                    {dates.map((date) => (
                        <section
                            key={date}
                            className={
                                "crm-day " +
                                (date === key(new Date().toISOString())
                                    ? "is-today"
                                    : "")
                            }
                        >
                            <button
                                type="button"
                                className="calendar-day-label"
                                aria-label={dateLabel(date)}
                                onClick={() => {
                                    setDay(date);
                                    setView("day");
                                }}
                            >
                                <time dateTime={date}>
                                    {view === "month"
                                        ? Number(date.slice(-2))
                                        : dateLabel(date)}
                                </time>
                            </button>
                            {itemsFor(date).map((b) => (
                                <button
                                    key={b.id}
                                    type="button"
                                    className={
                                        "calendar-event event-" + b.status
                                    }
                                    aria-label={
                                        clock(b.startsAt) +
                                        " " +
                                        b.name +
                                        " " +
                                        (statusLabel[b.status] ?? b.status)
                                    }
                                    onClick={() => setSelected(b.id)}
                                >
                                    <time>{clock(b.startsAt)}</time>
                                    <span>{b.name}</span>
                                    <small>
                                        {statusLabel[b.status] ?? b.status}
                                    </small>
                                </button>
                            ))}
                            {view !== "month" && !itemsFor(date).length && (
                                <p className="calendar-empty">Keine Termine.</p>
                            )}
                        </section>
                    ))}
                </div>
            )}
            <dialog
                ref={dialog}
                className="calendar-dialog"
                onClose={() => setSelected(null)}
                aria-labelledby="appointment-title"
            >
                {current && (
                    <>
                        <button
                            type="button"
                            className="button small dialog-close"
                            onClick={() => dialog.current?.close()}
                        >
                            Schließen
                        </button>
                        <h2 id="appointment-title">{current.name}</h2>
                        <dl className="appointment-facts">
                            <dt>Termin</dt>
                            <dd>
                                {dateLabel(key(current.startsAt))} ·{" "}
                                {clock(current.startsAt)}–
                                {clock(current.endsAt)} Uhr
                            </dd>
                            <dt>Dauer</dt>
                            <dd>
                                {Math.round(
                                    (Date.parse(current.endsAt) -
                                        Date.parse(current.startsAt)) /
                                        60000,
                                )}{" "}
                                Minuten
                            </dd>
                            <dt>Status</dt>
                            <dd>
                                {statusLabel[current.status] ?? current.status}
                            </dd>
                            <dt>Telefon</dt>
                            <dd>
                                <a
                                    href={
                                        "tel:" +
                                        current.phone.replace(/[^+\d]/g, "")
                                    }
                                >
                                    {current.phone || "—"}
                                </a>
                            </dd>
                            <dt>E-Mail</dt>
                            <dd>
                                <a href={"mailto:" + current.email}>
                                    {current.email}
                                </a>
                            </dd>
                            <dt>Unternehmen</dt>
                            <dd>{current.company || "—"}</dd>
                            <dt>Anliegen</dt>
                            <dd>{current.topic || "—"}</dd>
                            <dt>Gebucht am</dt>
                            <dd>
                                {dateLabel(key(current.createdAt))} ·{" "}
                                {clock(current.createdAt)} Uhr
                            </dd>
                        </dl>
                        <div className="record-actions">
                            {current.userId && (
                                <Link
                                    className="button"
                                    href={"/admin/kunden?id=" + current.userId}
                                >
                                    Kundendetails öffnen
                                </Link>
                            )}
                            {current.guest && (
                                <span>Gastbuchung · kein Kundenkonto</span>
                            )}
                            {current.phone && (
                                <a
                                    className="button"
                                    href={
                                        "tel:" +
                                        current.phone.replace(/[^+\d]/g, "")
                                    }
                                >
                                    Anrufen
                                </a>
                            )}
                            <a
                                className="button"
                                href={"mailto:" + current.email}
                            >
                                E-Mail senden
                            </a>
                        </div>
                        {["confirmed", "reserved"].includes(current.status) && (
                            <div className="record-actions">
                                <RescheduleForm
                                    id={current.id}
                                    sequence={current.sequence}
                                    action={
                                        current.guest
                                            ? "guest-booking-change"
                                            : "booking-change"
                                    }
                                    minutes={Math.round(
                                        (Date.parse(current.endsAt) -
                                            Date.parse(current.startsAt)) /
                                            60000,
                                    )}
                                />
                                <ActionForm
                                    action={
                                        current.guest
                                            ? "guest-booking-change"
                                            : "booking-change"
                                    }
                                    values={{
                                        id: current.id,
                                        sequence: current.sequence,
                                        action: "cancel",
                                    }}
                                    submit="Termin absagen"
                                />
                                <ActionForm
                                    action="booking-change"
                                    values={{
                                        id: current.id,
                                        action: "complete",
                                    }}
                                    submit="Als abgeschlossen markieren"
                                />
                            </div>
                        )}
                        <ActionForm
                            key={current.id + current.notes}
                            action={
                                current.guest
                                    ? "guest-booking-change"
                                    : "calendar-note"
                            }
                            values={{ id: current.id, action: "note" }}
                            fields={[
                                {
                                    name: "notes",
                                    label: "Interne Notiz",
                                    type: "textarea",
                                    value: current.notes,
                                },
                            ]}
                            submit="Notiz speichern"
                        />
                        {current.userId && (
                            <ActionForm
                                action="intro-credit"
                                values={{ userId: current.userId, count: 1 }}
                                submit="Weiteres kostenloses Erstgespräch freigeben"
                            />
                        )}
                    </>
                )}
            </dialog>
        </section>
    );
}
