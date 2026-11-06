import Link from "next/link";
export function BusinessProcesses() {
    return (
        <section
            className="section wrap business-processes"
            aria-labelledby="process-work-title"
        >
            <div className="section-heading">
                <h2 id="process-work-title">
                    Wo im Betrieb Arbeit doppelt anfällt
                </h2>
                <p>
                    Eine Anfrage wird weitergeleitet, Angaben werden aus einer
                    E-Mail in eine Tabelle kopiert und beim nächsten Übergang
                    fehlen Unterlagen. Wir gehen solche Abläufe mit Deinem Team
                    durch und überarbeiten Zuständigkeiten, Übergaben und die
                    verwendeten Werkzeuge.
                </p>
            </div>
            <dl className="process-work-examples">
                <div>
                    <dt>Anfragen vollständig erfassen</dt>
                    <dd>
                        Ein Formular sammelt die benötigten Angaben. Eine
                        vereinbarte Anbindung überträgt sie in das vorhandene
                        System und weist die Bearbeitung zu.
                    </dd>
                </div>
                <div>
                    <dt>Unterlagen und Freigaben zuordnen</dt>
                    <dd>
                        Dein Team sieht, welche Unterlagen vorliegen, was fehlt
                        und wer als Nächstes zuständig ist. Wiederkehrende
                        Erinnerungen lassen sich bei Bedarf automatisieren.
                    </dd>
                </div>
                <div>
                    <dt>KI für eine abgegrenzte Aufgabe einsetzen</dt>
                    <dd>
                        Zum Beispiel eingehende Texte vorsortieren oder einen
                        Antwortentwurf vorbereiten. Wir legen erlaubte Daten,
                        Prüfschritte und die Freigabe durch eine Person fest.
                    </dd>
                </div>
            </dl>
            <div className="process-work-review">
                <h3>Die Entlastung am tatsächlichen Ablauf prüfen</h3>
                <p>
                    Vor einer Änderung halten wir Bearbeitungszeit, Rückfragen
                    und manuelle Übertragungen fest. Nach einem vereinbarten
                    Testlauf vergleichen wir dieselben Schritte. So lässt sich
                    beurteilen, welche Arbeit Dein Team tatsächlich einspart und
                    was noch angepasst werden muss.
                </p>
                <Link
                    href="/leistungen/digitalisierung-ki"
                    className="arrow-link"
                >
                    Prozessoptimierung und Automatisierung ansehen ↗
                </Link>
            </div>
        </section>
    );
}
