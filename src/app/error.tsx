"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
    return (
        <main id="main" className="error-page">
            <h1>Die Seite konnte nicht geladen werden</h1>
            <p>
                Die Seite konnte gerade nicht geladen werden. Deine
                gespeicherten Daten werden dadurch nicht verändert.
            </p>
            <button className="button primary" onClick={reset}>
                Erneut laden ↗
            </button>
        </main>
    );
}
