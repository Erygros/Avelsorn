import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
export default function NotFound() {
    return (
        <SiteShell exitBanner={false}>
            <main id="main" className="not-found-page wrap">
                <p className="not-found-code">
                    <span className="sr-only">Fehler </span>404
                </p>
                <div className="not-found-copy">
                    <h1>Seite nicht gefunden</h1>
                    <p>
                        Unter dieser Adresse ist keine Seite verfügbar. Prüfe
                        die Schreibweise oder wähle einen der folgenden
                        Bereiche.
                    </p>
                    <div className="button-row">
                        <Link href="/" className="button primary">
                            Zur Startseite ↗
                        </Link>
                        <Link href="/leistungen" className="button">
                            Leistungen ansehen ↗
                        </Link>
                    </div>
                    <p className="not-found-contact">
                        Du suchst etwas Bestimmtes?{" "}
                        <Link href="/kontakt">Schreib mir eine Nachricht.</Link>
                    </p>
                </div>
            </main>
        </SiteShell>
    );
}
