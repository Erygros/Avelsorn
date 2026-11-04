import { Brand } from "./brand";
import { ConsentButton } from "./consent";
import Link from "next/link";
import { ExitBanner } from "./exit-banner";

export async function SiteShell({
    children,
    exitBanner = true,
}: {
    children: React.ReactNode;
    exitBanner?: boolean;
}) {
    return (
        <>
            <aside aria-label="Entwicklungsstatus" className="preview-note">
                Lokale Entwicklungsvorschau · Unternehmensangaben und
                Veröffentlichung stehen noch aus.
            </aside>
            <header className="site-header">
                <Brand />
                <nav aria-label="Hauptnavigation">
                    <Link href="/leistungen">Leistungen</Link>
                    <Link href="/preise">Preise</Link>
                    <Link href="/ablauf">So arbeiten wir</Link>
                    <Link href="/blog">Blog</Link>
                </nav>
                <div className="header-actions">
                    <Link className="login-link" href="/anmelden">
                        Mein Konto ↗
                    </Link>
                    <Link
                        className="button primary small"
                        href="/erstgespraech"
                    >
                        Erstgespräch <span aria-hidden="true">↗</span>
                    </Link>
                </div>
                <details className="mobile-menu">
                    <summary>Menü</summary>
                    <nav aria-label="Mobile Navigation">
                        <Link href="/leistungen">Leistungen</Link>
                        <Link href="/preise">Preise</Link>
                        <Link href="/ablauf">Ablauf</Link>
                        <Link href="/zielgruppen">Für wen ich arbeite</Link>
                        <Link href="/blog">Blog</Link>
                        <Link href="/anmelden">Mein Konto</Link>
                        <Link href="/erstgespraech">Erstgespräch</Link>
                    </nav>
                </details>
            </header>
            {children}
            <footer className="site-footer">
                <div className="footer-top">
                    <Brand />
                    <p>
                        Websites, digitale Abläufe und Unterstützung bei der
                        Gründung.
                    </p>
                    <Link href="/erstgespraech" className="arrow-link">
                        Erstgespräch vereinbaren ↗
                    </Link>
                </div>
                <div className="footer-links">
                    <Link href="/zielgruppen">Für wen ich arbeite</Link>
                    <Link href="/beruflich-neu-starten">
                        Beruflich neu starten
                    </Link>
                    <Link href="/kontakt">Kontakt</Link>
                    <Link href="/ueber-mich">Über Avelsorn</Link>
                    <Link href="/impressum">Impressum</Link>
                    <Link href="/datenschutz">Datenschutz</Link>
                    <Link href="/agb">AGB</Link>
                    <Link href="/widerruf">Vertrag widerrufen</Link>
                    <Link href="/barrierefreiheit">Barrierefreiheit</Link>
                    <ConsentButton />
                </div>
                <div className="footer-bottom">
                    <span>Beratung und Projektarbeit</span>
                    <span>Deutschland · Beratung per Telefon</span>
                </div>
            </footer>
            {exitBanner && <ExitBanner />}
        </>
    );
}
