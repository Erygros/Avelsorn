import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { GuestBookingManager } from "@/components/guest-booking-manager";
import { business } from "@/server/settings";
export const metadata: Metadata = {
    title: "Dein Erstgespräch",
    robots: { index: false, follow: false },
};
export default async function GuestBookingPage() {
    const values = await business();
    return (
        <SiteShell exitBanner={false}>
            <main id="main" className="wrap calendar-page">
                <header className="page-heading">
                    <h1>Dein Termin bei Avelsorn</h1>
                </header>
                <GuestBookingManager businessPhone={values.public_phone} />
            </main>
        </SiteShell>
    );
}
