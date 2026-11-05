export const legal: Record<
    string,
    {
        title: string;
        description: string;
        sections: { title: string; text: string }[];
    }
> = {
    impressum: {
        title: "Impressum",
        description: "Informationen zum Anbieter dieser Plattform.",
        sections: [
            {
                title: "Anbieter und Kontakt",
                text: "Bei Fragen zu Avelsorn erreichst Du Enrico Gross über die oben genannten Kontaktdaten.",
            },
            {
                title: "Tätigkeit und Einordnung",
                text: "Avelsorn bietet Beratung und Projektarbeit zu digitalen Auftritten, Arbeitsabläufen und Selbstständigkeit an. Die Abrechnung ist auf die angegebene Kleinunternehmerregelung ohne gesonderten Umsatzsteuerausweis ausgerichtet.",
            },
        ],
    },
    datenschutz: {
        title: "Datenschutzhinweise",
        description:
            "Wie personenbezogene Daten in dieser Plattform verarbeitet werden.",
        sections: [
            {
                title: "Verantwortlichkeit und Kontakt",
                text: "Verantwortlich ist die in den Anbieterangaben genannte Person. Datenschutzanfragen kannst Du über die Kontaktseite oder im Kundenkonto stellen.",
            },
            {
                title: "Konto und Sicherheit",
                text: "Zur Kontoführung verarbeiten wir Name, E-Mail-Adresse, Geburtsdatum, Passwort-Hash und erforderliche Zustimmungsnachweise. Sitzungen, Einmalcodes und Sicherheitsprotokolle schützen Deinen Zugang. Das Geburtsdatum dient der Altersprüfung; bei Minderjährigen wird die erforderliche Zustimmung oder Vertretung gesondert geprüft.",
            },
            {
                title: "Beratung und Vertragsabwicklung",
                text: "Fragebogen, Termine, Nachrichten, Projekte, Zeitnachweise, Dateien, Angebote, Bestellungen und Rechnungsdaten dienen der Vorbereitung und Durchführung der vereinbarten Leistungen. Rechtsgrundlage ist insbesondere Art. 6 Abs. 1 Buchst. b DSGVO; gesetzliche Dokumentationspflichten beruhen auf Art. 6 Abs. 1 Buchst. c DSGVO.",
            },
            {
                title: "Empfänger und technische Dienste",
                text: "Für das Webhosting verwenden wir Vercel, für Datenbank und privaten Dateispeicher Supabase und für geschäftliche E-Mails Checkdomain. Das Supabase-Projekt speichert Daten in der Region Irland. Vercel verarbeitet Anwendungsanfragen auch in den USA. Zugriff auf Kundeninhalte erhalten nur berechtigte Personen. Auskunft zu Empfängern und den für Deinen Vorgang geltenden Übermittlungen erhältst Du über den angegebenen Datenschutzkontakt.",
            },
            {
                title: "Video ohne Aufzeichnung",
                text: "Kostenlose Erstgespräche finden telefonisch statt. Eine integrierte Videofunktion ist derzeit deaktiviert. Gespräche werden von Avelsorn nicht aufgezeichnet.",
            },
            {
                title: "Aufbewahrung",
                text: "Projektdateien werden grundsätzlich sechs Monate nach Projektabschluss aufbewahrt; vor ihrer Löschung erfolgt eine Benachrichtigung. Gesetzlich aufzubewahrende Rechnungs- und Buchhaltungsunterlagen werden getrennt behandelt. Für Sicherheits-, Konto- und Kommunikationsdaten gelten zweckbezogene Fristen, die vor Produktivbetrieb verbindlich dokumentiert werden.",
            },
            {
                title: "Deine Rechte",
                text: "Du kannst Auskunft, Berichtigung, Löschung, Einschränkung und Datenübertragbarkeit verlangen und einer Verarbeitung auf Grundlage berechtigter Interessen widersprechen. Einwilligungen kannst Du für die Zukunft widerrufen. Gesetzliche Aufbewahrungspflichten können einer sofortigen Löschung einzelner Daten entgegenstehen. Du kannst Dich bei einer Datenschutzaufsichtsbehörde beschweren.",
            },
            {
                title: "Cookies und Statistiken",
                text: "Notwendige Cookies sichern Sitzungen und speichern Deine Datenschutzauswahl. Optionale, eigene Besucherstatistiken werden ausschließlich nach Deiner aktiven Zustimmung erhoben. Die Auswahl lässt sich jederzeit über Cookie-Einstellungen ändern.",
            },
        ],
    },
    agb: {
        title: "Allgemeine Geschäftsbedingungen",
        description:
            "Grundlagen für die digitale Beratung und praktische Unterstützung.",
        sections: [
            {
                title: "Leistungen und Zusammenarbeit",
                text: "Die konkreten Leistungen ergeben sich aus der ausgewählten Beratung, dem Paket oder einem angenommenen individuellen Angebot. Erstgespräche finden telefonisch statt. Wenn Video verfügbar und vereinbart ist, kann ein Projektgespräch nach vollständiger Zahlung gebucht und per Video geführt werden. Ein bestimmter wirtschaftlicher Erfolg, Umsatz, Gewinn oder eine bestimmte Reichweite wird nicht zugesichert.",
            },
            {
                title: "Vertragsschluss",
                text: "Paket-Anfragen sind unverbindlich. Nach Klärung der Aufgabe erhältst Du ein konkretes Angebot mit Leistungsumfang, Zuarbeit, Liefertermin und vollständigem Gesamtpreis. Der Vertrag wird durch ausdrückliche zahlungspflichtige Annahme dieses Angebots geschlossen. Erklärung, Angebotsfassung und Preis werden protokolliert.",
            },
            {
                title: "Preise und Zahlung",
                text: "Die veröffentlichten Einstiegspreise beziehen sich auf den jeweils beschriebenen Basisumfang. Maßgeblich ist der Gesamtpreis im konkret angenommenen Angebot. Aufgrund des vorgesehenen Kleinunternehmerstatus wird keine Umsatzsteuer gesondert ausgewiesen. Zahlungsart ist Banküberweisung; der Zahlungseingang wird nach Prüfung bestätigt. Ein Projekt wird nach vollständiger Zahlung angelegt. Der zulässige Leistungsbeginn richtet sich außerdem nach den bei Annahme abgegebenen Erklärungen.",
            },
            {
                title: "Leistungspakete und Zusatzaufgaben",
                text: "Die neuen Pakete beziehen sich auf vereinbarte Arbeitsergebnisse und enthalten kein öffentlich verkauftes Stundenkontingent. Umfang, enthaltene Projektgespräche und Korrekturrunden werden im Angebot festgehalten. Weitere Aufgaben und externe Kosten benötigen eine gesonderte Vereinbarung. Es gibt keine automatische Verlängerung oder pauschal unbegrenzte Betreuung. Bereits abgeschlossene frühere Verträge behalten ihre vereinbarten Bedingungen.",
            },
            {
                title: "Externe Kosten",
                text: "Domain, Hosting, Softwarelizenzen und andere externe Kosten trägt der Kunde nur nach transparenter Abstimmung und entsprechender Zustimmung. Sie sind nicht automatisch im Beratungspreis enthalten.",
            },
            {
                title: "Terminänderung und Ausfall",
                text: "Termine können im Kundenkonto bis zu ihrem Beginn verschoben werden, sofern ein passender Termin verfügbar ist. Absagen werden dokumentiert. Gesetzliche Rechte bleiben unberührt; individuelle Vergütungs- oder Erstattungsfragen werden anhand des konkreten Vertrags und anwendbaren Rechts geklärt.",
            },
            {
                title: "Minderjährige",
                text: "Soweit Registrierung, Einwilligung oder Vertrag eine Zustimmung beziehungsweise Vertretung durch Erziehungsberechtigte erfordern, wird diese überprüfbar eingeholt. Ohne erforderliche Zustimmung wird keine kostenpflichtige Bestellung freigegeben.",
            },
            {
                title: "Finanzbildung und Fachgrenzen",
                text: "Trading- und ETF-Inhalte sind ausschließlich allgemeine Wissensvermittlung. Es erfolgen keine individuelle Anlageberatung, persönlichen Kauf- oder Verkaufsempfehlungen oder Portfolioverwaltung. Individuelle Rechts- und Steuerberatung wird nicht als Bestandteil der Leistungen angeboten.",
            },
            {
                title: "Gesetzliche Rechte",
                text: "Gesetzliche Verbraucherrechte, insbesondere das Widerrufsrecht und zwingende Haftungsregeln, gelten unabhängig von diesen Bedingungen.",
            },
        ],
    },
    widerrufsbelehrung: {
        title: "Widerrufsbelehrung",
        description:
            "Informationen zum gesetzlichen Widerrufsrecht für Verbraucher.",
        sections: [
            {
                title: "Widerrufsrecht",
                text: "Als Verbraucher hast Du bei einem Fernabsatzvertrag über Dienstleistungen grundsätzlich das Recht, den Vertrag innerhalb von 14 Tagen ohne Angabe von Gründen zu widerrufen. Die Frist beginnt mit dem Vertragsschluss, soweit die gesetzlichen Voraussetzungen und die erforderliche Belehrung vorliegen.",
            },
            {
                title: "Wie Du widerrufst",
                text: "Teile dem in den Anbieterangaben genannten Betreiber durch eine eindeutige Erklärung Deinen Entschluss mit. Du kannst das elektronische Widerrufsformular dieser Plattform verwenden oder Dich per E-Mail beziehungsweise auf anderem zulässigen Weg melden. Die Nutzung des Musterformulars ist nicht vorgeschrieben. Zur Fristwahrung genügt die rechtzeitige Absendung.",
            },
            {
                title: "Folgen des Widerrufs",
                text: "Im gesetzlichen Umfang werden erhaltene Zahlungen spätestens binnen 14 Tagen ab Eingang der Widerrufserklärung zurückgezahlt. Ein anderes Rückzahlungsmittel wird nur mit ausdrücklicher Vereinbarung und ohne zusätzliche Kosten eingesetzt.",
            },
            {
                title: "Beginn während der Widerrufsfrist",
                text: "Wenn Du ausdrücklich verlangst, dass die Dienstleistung während der Widerrufsfrist beginnt, und ordnungsgemäß belehrt wurdest, kann bei Widerruf ein angemessener Betrag für bis dahin erbrachte Leistungen geschuldet sein. Das Widerrufsrecht erlischt bei vollständiger Leistung nur unter den gesetzlichen Voraussetzungen, insbesondere nach erforderlicher ausdrücklicher Zustimmung und Bestätigung der Kenntnis vom Erlöschen. Ein bloßer Terminbeginn beseitigt das Recht nicht pauschal.",
            },
        ],
    },
    barrierefreiheit: {
        title: "Informationen zur Barrierefreiheit",
        description:
            "Stand der Barrierefreiheitsprüfung und Hinweise zum Melden von Nutzungshürden.",
        sections: [
            {
                title: "Unser Entwicklungsziel",
                text: "Die Plattform wird am Zielstandard WCAG 2.2 AA ausgerichtet. Dazu gehören semantische Struktur, Tastaturbedienung, sichtbarer Fokus, verständliche Formulare, ausreichende Kontraste und Unterstützung reduzierter Bewegung.",
            },
            {
                title: "Tatsächlicher Prüfstand",
                text: "Die vollständige Konformitätsprüfung ist noch nicht abgeschlossen. Eine Zertifizierung oder lückenlose Konformität wird nicht behauptet. Automatisierte Prüfungen werden durch manuelle Tastatur- und Layoutprüfungen ergänzt. Die Zugänglichkeit von PDF-Dokumenten wird gesondert bewertet.",
            },
            {
                title: "Eine Barriere melden",
                text: "Wenn Du Schwierigkeiten bei der Nutzung bemerkst, beschreibe die betroffene Seite, Dein Gerät und die gewünschte Handlung über das Kontaktformular. Wir prüfen die Meldung und suchen eine zugängliche Lösung.",
            },
        ],
    },
    cookies: {
        title: "Cookie-Informationen",
        description:
            "Welche Cookies die Anmeldung benötigt und wie Du optionale Statistiken ein- oder ausschaltest.",
        sections: [
            {
                title: "Notwendige Funktionen",
                text: "Ein Sitzungscookie ermöglicht den geschützten Zugang. Cookies zur Datenschutzentscheidung speichern Deine Auswahl. Diese Funktionen sind für Anmeldung, Sicherheit und die Berücksichtigung Deiner Entscheidung erforderlich.",
            },
            {
                title: "Optionale Statistiken",
                text: "Besucherstatistiken werden nur nach aktiver Zustimmung erhoben. Es gibt keine vorausgewählte optionale Zustimmung und keine externe Google-Analytics-Integration. Ablehnung und Zustimmung sind direkt erreichbar.",
            },
            {
                title: "Auswahl ändern",
                text: "Über Cookie-Einstellungen im Fußbereich kannst Du Deine Auswahl jederzeit ändern und eine Einwilligung mit Wirkung für die Zukunft widerrufen.",
            },
        ],
    },
};
