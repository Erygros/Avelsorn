export const legal: Record<
    string,
    {
        title: string;
        description: string;
        sections: {
            title: string;
            text: string;
            links?: { label: string; href: string }[];
        }[];
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
                text: "Enrico Gross betreibt Avelsorn als Einzelunternehmer. Angeboten werden Beratung und Projektarbeit zu Websites, digitalen Arbeitsabläufen, Onlineauftritten und der Vorbereitung einer Selbstständigkeit. Für die Leistungen gilt die Steuerbefreiung für Kleinunternehmer gemäß § 19 UStG; Umsatzsteuer wird nicht gesondert ausgewiesen.",
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
                text: "Verantwortlich für die Verarbeitung ist Enrico Gross, handelnd unter Avelsorn. Die Anschrift, Telefonnummer und E-Mail-Adresse findest Du auf dieser Seite. Du kannst Dein Anliegen auch über das Kontaktformular oder die Datenschutzfunktion im Kundenkonto einreichen.",
            },
            {
                title: "Aufruf der Website und Kontaktanfragen",
                text: "Bei einem Seitenaufruf verarbeiten die technischen Dienste insbesondere IP-Adresse, angeforderte Adresse, Zeitpunkt und technische Browser- und Verbindungsinformationen, um die Website auszuliefern und Angriffe zu erkennen. Grundlage ist Art. 6 Abs. 1 Buchst. f DSGVO; unser Interesse ist ein sicherer und verlässlicher Betrieb. Bei einer Kontakt- oder Paketanfrage verarbeiten wir Deine angegebenen Kontaktdaten und Dein Anliegen zur Bearbeitung. Soweit die Anfrage auf einen Vertrag gerichtet ist, gilt Art. 6 Abs. 1 Buchst. b DSGVO; sonst gilt unser berechtigtes Interesse an der Beantwortung nach Buchst. f. Der Inhaber erhält zusätzlich einen E-Mail-Hinweis über den Eingang, ohne den Inhalt der Anfrage.",
            },
            {
                title: "Konto und Sicherheit",
                text: "Zur Kontoführung verarbeiten wir Name, E-Mail-Adresse, Geburtsdatum, Passwort-Hash und erforderliche Zustimmungsnachweise. Sitzungen, Einmalcodes und Sicherheitsprotokolle schützen Deinen Zugang. Das Geburtsdatum dient der Altersprüfung; bei Minderjährigen wird die erforderliche Zustimmung oder Vertretung gesondert geprüft.",
            },
            {
                title: "Beratung und Vertragsabwicklung",
                text: "Fragebogen, Termine, Nachrichten, Projekte, Zeitnachweise, Dateien, Angebote, Bestellungen und Rechnungsdaten dienen der Vorbereitung und Durchführung der vereinbarten Leistungen. Für telefonische Termine benötigen wir Deine Rufnummer. Die Angabe eines Unternehmens und eine Beschreibung Deines Anliegens sind bei der Erstgesprächsbuchung freiwillig. Rechtsgrundlage ist Art. 6 Abs. 1 Buchst. b DSGVO; gesetzliche Dokumentationspflichten beruhen auf Art. 6 Abs. 1 Buchst. c DSGVO. Ohne die jeweils als erforderlich gekennzeichneten Angaben können wir das Konto, den Termin oder den Vertrag nicht bearbeiten. Es findet keine ausschließlich automatisierte Entscheidung mit rechtlicher oder ähnlich erheblicher Wirkung statt.",
            },
            {
                title: "Empfänger und technische Dienste",
                text: "Vercel Inc. stellt die Webanwendung bereit. Supabase Pte. Ltd. (Singapur) stellt die PostgreSQL-Datenbank und den privaten Dateispeicher bereit; das verwendete Projekt liegt in Irland. Checkdomain stellt Domain und geschäftliches E-Mail-Postfach bereit. Mit allen drei Anbietern bestehen Vereinbarungen zur Auftragsverarbeitung. Die Dienste erhalten die für ihren jeweiligen Zweck erforderlichen Verbindungs- und Inhaltsdaten. Vercel verarbeitet Anwendungsanfragen auch in den USA; eine EU-Datenbankregion schließt Zugriffe aus anderen Ländern beim Dienstbetrieb nicht generell aus. Für Übermittlungen in Länder ohne einschlägigen Angemessenheitsbeschluss sehen die Vereinbarungen mit Vercel und Supabase die EU-Standardvertragsklauseln als Garantien nach Art. 46 DSGVO vor. Informationen der Anbieter zu Verarbeitung, Unterauftragnehmern und Übermittlungsmechanismen findest Du unter den folgenden Links. Auskunft zu den für Deinen Vorgang eingesetzten Garantien und eine Kopie erhältst Du auf Anfrage. Kundeninhalte werden nicht öffentlich zugänglich gemacht.",
                links: [
                    {
                        label: "Vercel: Datenschutz",
                        href: "https://vercel.com/legal/privacy-notice",
                    },
                    {
                        label: "Supabase: Datenstandorte und Übermittlungen",
                        href: "https://supabase.com/legal/privacy-resources/data-residency-and-transfers-faq",
                    },
                    {
                        label: "Checkdomain: Datenschutz",
                        href: "https://www.checkdomain.de/agb/datenschutz/",
                    },
                ],
            },
            {
                title: "Video ohne Aufzeichnung",
                text: "Kostenlose Erstgespräche finden telefonisch statt. Eine integrierte Videofunktion ist derzeit deaktiviert. Gespräche werden von Avelsorn nicht aufgezeichnet.",
            },
            {
                title: "Aufbewahrung",
                text: "Dein Konto wird für die Dauer der Kontonutzung geführt; eine Löschanfrage wird unter Berücksichtigung bestehender Verträge und gesetzlicher Pflichten bearbeitet. Projektdateien sind grundsätzlich sechs Monate nach Projektabschluss zur Löschung vorgesehen. Du wirst vorab benachrichtigt; bei verspäteter Benachrichtigung bleibt eine Frist von mindestens sieben Tagen. Buchungsbelege werden regelmäßig acht Jahre, steuerlich erforderliche Bücher und Aufzeichnungen zehn Jahre und aufbewahrungspflichtige Geschäftskorrespondenz sechs Jahre ab dem jeweiligen gesetzlichen Fristbeginn aufbewahrt. Laufende Verfahren können eine längere Speicherung erfordern. Sonstige Anfragen und Kommunikationsdaten werden nur so lange benötigt, wie die Bearbeitung und gegebenenfalls die Geltendmachung oder Abwehr konkreter Ansprüche es erfordern. Abgelaufene Sitzungen werden bei der nächsten Aufgabenverarbeitung gelöscht, Einmalcodes spätestens sieben Tage und Zugriffslimits spätestens einen Tag nach Ablauf. Anwendungssicherungen werden nach 30 Tagen entfernt. Aufbewahrungspflichtige Unterlagen werden von einer Kontolöschung ausgenommen und zweckgebunden erhalten.",
            },
            {
                title: "Deine Rechte",
                text: "Du kannst Auskunft, Berichtigung, Löschung, Einschränkung und Datenübertragbarkeit verlangen und einer Verarbeitung auf Grundlage berechtigter Interessen widersprechen. Einwilligungen kannst Du für die Zukunft widerrufen. Gesetzliche Aufbewahrungspflichten können einer sofortigen Löschung einzelner Daten entgegenstehen. Du kannst Dich bei einer Datenschutzaufsichtsbehörde beschweren.",
            },
            {
                title: "Beschwerde bei einer Aufsichtsbehörde",
                text: "Du kannst Dich insbesondere an die Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen wenden: Postfach 20 04 44, 40102 Düsseldorf, E-Mail poststelle@ldi.nrw.de. Du kannst ebenso die Aufsichtsbehörde an Deinem gewöhnlichen Aufenthaltsort, Arbeitsplatz oder am Ort eines vermuteten Verstoßes kontaktieren.",
                links: [
                    {
                        label: "LDI NRW: Beschwerde einreichen",
                        href: "https://www.ldi.nrw.de/",
                    },
                ],
            },
            {
                title: "Cookies und Statistiken",
                text: "Notwendige Cookies sichern Sitzungen und speichern Deine Datenschutzauswahl. Optionale, eigene Besucherstatistiken werden ausschließlich nach Deiner aktiven Zustimmung erhoben. Die Auswahl lässt sich jederzeit über Cookie-Einstellungen ändern.",
                links: [
                    {
                        label: "Cookies und lokale Speicherung im Detail",
                        href: "/cookies",
                    },
                ],
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
                text: "Die veröffentlichten Einstiegspreise beziehen sich auf den jeweils beschriebenen Basisumfang. Maßgeblich ist der Gesamtpreis im konkret angenommenen Angebot. Für die Leistungen gilt die Steuerbefreiung für Kleinunternehmer gemäß § 19 UStG; Umsatzsteuer wird nicht gesondert ausgewiesen. Zahlungsart ist Banküberweisung; der Zahlungseingang wird nach Prüfung bestätigt. Ein Projekt wird nach vollständiger Zahlung angelegt. Der zulässige Leistungsbeginn richtet sich außerdem nach den bei Annahme abgegebenen Erklärungen.",
            },
            {
                title: "Leistungspakete und Zusatzaufgaben",
                text: "Die Pakete beziehen sich auf vereinbarte Arbeitsergebnisse. Umfang, enthaltene Projektgespräche und Korrekturrunden werden im Angebot festgehalten. Weitere Aufgaben und externe Kosten benötigen eine gesonderte Vereinbarung. Es gibt keine automatische Verlängerung oder pauschal unbegrenzte Betreuung. Bereits abgeschlossene Verträge behalten ihre vereinbarten Bedingungen.",
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
                text: "Du hast das Recht, diesen Vertrag innerhalb von vierzehn Tagen ohne Angabe von Gründen zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses. Diese Belehrung betrifft Verträge über Dienstleistungen, die Du als Verbraucher im Fernabsatz abschließt.",
            },
            {
                title: "Wie Du widerrufst",
                text: "Um Dein Widerrufsrecht auszuüben, musst Du Enrico Gross (Avelsorn) unter der auf dieser Seite angegebenen Anschrift, E-Mail-Adresse oder Telefonnummer mittels einer eindeutigen Erklärung über Deinen Entschluss informieren, diesen Vertrag zu widerrufen, etwa mit einem Brief oder einer E-Mail. Du kannst das unten bereitgestellte Musterformular verwenden; dies ist nicht vorgeschrieben. Du kannst Deinen Widerruf auch über die elektronische Widerrufsfunktion erklären. Wir bestätigen den elektronischen Eingang unverzüglich per E-Mail. Zur Wahrung der Frist reicht es aus, dass Du die Mitteilung vor Ablauf der Widerrufsfrist absendest.",
            },
            {
                title: "Folgen des Widerrufs",
                text: "Wenn Du diesen Vertrag widerrufst, zahlen wir Dir alle Zahlungen, die wir von Dir erhalten haben, einschließlich etwaiger Lieferkosten (mit Ausnahme zusätzlicher Kosten aufgrund einer anderen als der angebotenen günstigsten Standardlieferung), unverzüglich und spätestens binnen vierzehn Tagen ab Eingang Deines Widerrufs zurück. Wir verwenden dasselbe Zahlungsmittel wie bei Deiner ursprünglichen Zahlung, es sei denn, mit Dir wurde ausdrücklich etwas anderes vereinbart. Für die Rückzahlung berechnen wir keine Entgelte.",
            },
            {
                title: "Beginn während der Widerrufsfrist",
                text: "Hast Du verlangt, dass die Dienstleistungen während der Widerrufsfrist beginnen, zahlst Du uns bei einem Widerruf einen angemessenen Betrag. Dieser entspricht dem Anteil der bis zum Zugang Deines Widerrufs bereits erbrachten Dienstleistungen am Gesamtumfang der vereinbarten Leistungen, sofern die gesetzlichen Informationsvoraussetzungen erfüllt sind. Bei einer zahlungspflichtigen Dienstleistung erlischt das Widerrufsrecht mit der vollständigen Erbringung, wenn Du vor dem Beginn ausdrücklich dem vorzeitigen Beginn zugestimmt und Deine Kenntnis bestätigt hast, dass Du bei vollständiger Vertragserfüllung Dein Widerrufsrecht verlierst. Ein Terminbeginn allein lässt das Recht nicht erlöschen.",
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
                text: "platform_session enthält eine zufällige Sitzungskennung für die Anmeldung und läuft nach zwölf Stunden ab. Es ist nicht per JavaScript lesbar. platform_consent speichert für 180 Tage, ob Du optionalen Statistiken zugestimmt hast. platform_visitor enthält für denselben Zeitraum eine zufällige Kennung, um die gespeicherte Entscheidung zuzuordnen; sie ist nicht per JavaScript lesbar. Diese Cookies gelten für diese Website, werden im HTTPS-Betrieb sicher übertragen und nutzen SameSite=Lax. Notwendige Speicherung erfolgt nach § 25 Abs. 2 TDDDG; die anschließende Verarbeitung dient dem sicheren Betrieb und der Berücksichtigung Deiner Auswahl nach Art. 6 Abs. 1 Buchst. f DSGVO beziehungsweise der angeforderten Kontonutzung nach Buchst. b.",
            },
            {
                title: "Optionale Statistiken",
                text: "Besucherstatistiken werden nur nach aktiver Zustimmung nach § 25 Abs. 1 TDDDG und Art. 6 Abs. 1 Buchst. a DSGVO erhoben. Gespeichert werden die Anzahl von Seitenaufrufen pro Tag und öffentlichem Seitenpfad, ohne individuelles Bewegungsprofil in der Statistik. Konto-, Admin- und Anmeldeseiten werden nicht gezählt. Es gibt keine externe Google-Analytics-Integration. Ablehnung und Zustimmung sind direkt erreichbar.",
            },
            {
                title: "Lokale Speicherung im Browser",
                text: "Wenn Du im Kalender einen Termin auswählst, speichert avelsorn-intro-slot ausschließlich Datum und Uhrzeit lokal, damit Deine Auswahl nach Anmeldung oder E-Mail-Bestätigung erhalten bleibt. Der Eintrag wird bei erfolgreicher Buchung oder bei der Prüfung eines abgelaufenen oder nicht mehr verfügbaren Termins entfernt; Du kannst ihn auch über die Browserdaten löschen. Es werden darin keine Kontaktdaten gespeichert. avelsorn-exit-shown merkt sich bis zum Schließen des Tabs, ob der Hinweis zum Erstgespräch bereits angezeigt wurde. Beide Einträge werden nicht für Besucherstatistiken verwendet.",
            },
            {
                title: "Auswahl ändern",
                text: "Über Cookie-Einstellungen im Fußbereich kannst Du Deine Auswahl jederzeit ändern und eine Einwilligung mit Wirkung für die Zukunft widerrufen.",
            },
        ],
    },
};
