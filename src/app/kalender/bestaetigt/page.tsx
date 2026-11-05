import { requireUser, currentUser } from "@/server/security";
import { notFound, redirect } from "next/navigation";
import { db } from "@/server/db";
import { bookings } from "@/server/schema";
import { eq } from "drizzle-orm";
import { SiteShell } from "@/components/site-shell";
import { berlin } from "@/server/config";
import Link from "next/link";
import { RescheduleForm } from "@/components/reschedule-form";
import { ActionForm } from "@/components/action-form";
export default async function BookingSuccess({
    searchParams,
}: {
    searchParams: Promise<{ id?: string }>;
}) {
    const user = await currentUser();
    if (!user) redirect("/kalender");
    if (user.role === "admin") await requireUser(true);
    const { id } = await searchParams;
    const [booking] = await db()
        .select()
        .from(bookings)
        .where(eq(bookings.id, id ?? ""));
    if (
        !booking ||
        (user.role !== "admin" && booking.userId !== user.id) ||
        booking.product !== "intro"
    )
        notFound();
    return (
        <SiteShell exitBanner={false}>
            <main id="main" className="wrap calendar-page">
                <header className="page-heading">
                    <h1>
                        {booking.status === "cancelled"
                            ? "Dein Termin ist abgesagt"
                            : "Dein Termin ist gebucht"}
                    </h1>
                </header>
                <section className="calendar-details">
                    <h2>{berlin(booking.startsAt)}</h2>
                    <p>15 Minuten · Telefonisch</p>
                    {booking.status === "cancelled" ? (
                        <p>Zu diesem Termin erfolgt kein Anruf.</p>
                    ) : (
                        <p>
                            Ich rufe Dich unter{" "}
                            {booking.contactPhone ?? user.phone} an.
                        </p>
                    )}
                    <p>
                        {booking.status === "cancelled"
                            ? "Die Absage"
                            : "Die Terminbestätigung"}{" "}
                        wird an Deine hinterlegte E-Mail-Adresse versendet.
                    </p>
                    <div className="record-actions">
                        <a
                            className="button"
                            href={"/api/bookings/" + booking.id + "/ics"}
                        >
                            Im Kalender speichern
                        </a>
                        <Link className="button" href="/konto/termine">
                            Meine Termine
                        </Link>
                        {booking.status === "confirmed" && (
                            <>
                                <RescheduleForm id={booking.id} minutes={15} />
                                <ActionForm
                                    action="booking-change"
                                    values={{
                                        id: booking.id,
                                        action: "cancel",
                                    }}
                                    submit="Termin absagen"
                                />
                            </>
                        )}
                    </div>
                </section>
            </main>
        </SiteShell>
    );
}
