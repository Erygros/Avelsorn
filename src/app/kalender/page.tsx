import type { Metadata } from "next";
import { currentUser } from "@/server/security";
import { SiteShell } from "@/components/site-shell";
import { PublicCalendar } from "@/components/public-calendar";

export const metadata: Metadata = {
    title: "Kostenloses Erstgespräch vereinbaren",
    description:
        "Buche Dein kostenloses und unverbindliches 15-minütiges Erstgespräch mit Avelsorn.",
    alternates: { canonical: "/kalender" },
};
export default async function CalendarPage() {
    const user = await currentUser();
    return (
        <SiteShell exitBanner={false}>
            <main id="main" className="wrap calendar-page">
                <header className="page-heading">
                    <h1>Kostenloses Erstgespräch vereinbaren</h1>
                    <p className="lead">
                        Lass uns gemeinsam herausfinden, wie wir Dein Vorhaben
                        oder Unternehmen weiterentwickeln können. Buche jetzt
                        Dein kostenloses und unverbindliches 15-minütiges
                        Erstgespräch.
                    </p>
                </header>
                <PublicCalendar
                    user={
                        user
                            ? {
                                  name: user.name,
                                  email: user.email,
                                  phone: user.phone ?? "",
                                  company: user.company ?? "",
                                  verified: Boolean(user.verifiedAt),
                                  admin: user.role === "admin",
                              }
                            : null
                    }
                />
            </main>
        </SiteShell>
    );
}
