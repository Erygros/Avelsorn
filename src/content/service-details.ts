export const serviceDetails: Record<
    string,
    {
        audience: string;
        problem: string;
        preparation: string;
        packages: string[];
        process: string;
    }
> = {
    unternehmensberatung: {
        audience:
            "Kleine Unternehmen und Selbstständige, bei denen Zuständigkeiten, Rückfragen oder Übergaben im Alltag zu viel Abstimmung erfordern.",
        problem:
            "Eine Anfrage wird weitergereicht, Angaben fehlen und niemand weiß sicher, welcher Schritt als Nächstes ansteht. Wir betrachten den konkreten Vorgang statt pauschal die gesamte Organisation umzubauen.",
        preparation:
            "Ein Beispiel für den betroffenen Vorgang, die beteiligten Aufgaben und Programme sowie Deine bisherigen Beobachtungen. Vertrauliche Kundendaten benötigen wir für das Erstgespräch nicht.",
        packages: ["digitaler-ablauf"],
        process:
            "Wir nehmen den bisherigen Ablauf auf, stimmen Zuständigkeiten und Änderungen ab und erproben den vereinbarten Vorgang. Für eine technische Umsetzung legen wir Daten, Schnittstellen und Prüfkriterien gesondert fest.",
    },
    gruendung: {
        audience:
            "Menschen, die eine Selbstständigkeit prüfen, und Gründer, die eine ausgewählte Idee in ein verständliches Angebot übersetzen möchten.",
        problem:
            "Was kannst Du anbieten, wer braucht es und welche Fragen müssen vor dem Start geklärt werden? Wir unterscheiden zwischen einer ersten beruflichen Orientierung und der Ausarbeitung einer bereits ausgewählten Idee.",
        preparation:
            "Deine bisherigen Tätigkeiten und Fähigkeiten, Interessen und verfügbare Mittel. Wenn es schon eine Idee gibt: Deine Überlegungen zum Angebot und Rückmeldungen möglicher Kunden.",
        packages: ["neustart", "gruendung"],
        process:
            "Wir halten Deine Ausgangssituation fest, vergleichen passende Möglichkeiten und arbeiten die ausgewählte Richtung aus. Du prüfst die schriftlichen Ergebnisse; offene rechtliche und steuerliche Fragen gehen an entsprechend qualifizierte Fachpersonen.",
    },
    "social-media": {
        audience:
            "Selbstständige und Unternehmen, die ihren bestehenden Kanal gezielter nutzen und ihre Inhalte regelmäßig planen möchten.",
        problem:
            "Das Angebot ist vorhanden, doch die Themen entstehen jedes Mal neu oder das Profil erklärt nicht, wofür Du angesprochen werden möchtest. Ein bearbeitbarer Plan verbindet Dein Angebot mit konkreten Beitragsideen.",
        preparation:
            "Der Link zum ausgewählten Kanal, Deine Leistungsbeschreibung und freigegebene Inhalte. Hilfreich sind häufige Kundenfragen und vorhandene Plattformauswertungen ohne Zugangsdaten.",
        packages: ["social-media"],
        process:
            "Wir prüfen Kanal und Angebot, legen wiederverwendbare Formate fest und besprechen den Themenplan. Du erhältst die vereinbarten Texte und Unterlagen zur weiteren Bearbeitung; Veröffentlichung und laufende Betreuung sind separat abzustimmen.",
    },
    creator: {
        audience:
            "Creator, Influencer und Streamer, die ihr vorhandenes Profil, ihre Unterlagen oder die Bearbeitung von Kooperationsanfragen überarbeiten möchten.",
        problem:
            "Deine Inhalte sind sichtbar, aber Profil und Unterlagen erklären nicht ausreichend, was Deinen Kanal ausmacht. Oder Anfragen landen unvollständig und ungeordnet bei Dir.",
        preparation:
            "Kanal-Links, Deine Formate und die Fragen, die Du klären möchtest. Für ein Mediakit benötigen wir belegbare, freigegebene Kanalangaben; für einen Anfrageprozess dessen gewünschte Schritte.",
        packages: ["creator"],
        process:
            "Wir grenzen die Aufgabe ein: Profilcheck, Unterlagen oder ein technischer Anfrageprozess. Danach werden die vereinbarten Inhalte erarbeitet und mit Dir geprüft. Größere Umsetzungen erhalten ein eigenes Angebot.",
    },
    "websites-software": {
        audience:
            "Gründer, Selbstständige und Unternehmen, die ihr Angebot online erklären oder eine konkrete Aufgabe durch eine Webanwendung abbilden möchten.",
        problem:
            "Eine Website beantwortet wichtige Kundenfragen nicht, Kontaktwege fehlen oder ein wiederkehrender Vorgang passt nicht zu den vorhandenen Programmen. Wir klären zuerst die benötigten Inhalte und Funktionen.",
        preparation:
            "Vorhandene Seiten und Markenunterlagen, freigegebene Texte und Bilder sowie eine Beschreibung der gewünschten Funktionen. Zugänge werden erst im vereinbarten, geschützten Projektprozess ausgetauscht.",
        packages: ["website", "digitaler-ablauf"],
        process:
            "Wir stimmen Struktur, Funktionen und Prüfkriterien ab. Wir entwickeln den vereinbarten Umfang, testen typische Abläufe und Fehlerfälle und stellen Dir die Ergebnisse zur Prüfung bereit. Die Übergabe und zusätzliche externe Dienste werden vorher festgelegt.",
    },
    "digitalisierung-ki": {
        audience:
            "Unternehmen und Selbstständige, deren Team Angaben mehrfach überträgt, Unterlagen nachfordert oder ähnliche Anfragen manuell sortiert.",
        problem:
            "Einzelne Handgriffe wiederholen sich täglich. Wir prüfen, ob sich ein klar abgegrenzter Vorgang mit vorhandenen Werkzeugen oder einer passenden Schnittstelle vereinfachen lässt. KI wird nur eingesetzt, wenn Daten, Aufgabe und menschliche Prüfung dazu passen.",
        preparation:
            "Eine Beschreibung des Vorgangs, beteiligte Programme, verfügbare Schnittstellen und typische Fehlerfälle. Datenschutz, Zugriffsrechte und externe laufende Kosten klären wir vor einer Anbindung.",
        packages: ["digitaler-ablauf"],
        process:
            "Wir dokumentieren den bisherigen Vorgang, planen eine konkrete Änderung und vereinbaren die Umsetzung. Anschließend testen wir Normal- und Fehlerfälle und übergeben Bedienhinweise. Den tatsächlichen Effekt beurteilen wir am Ablauf; eine bestimmte Einsparung wird nicht zugesagt.",
    },
    "trading-etf": {
        audience:
            "Menschen, die allgemeine Grundlagen zu ETFs, Märkten und technischen Handelsabläufen verstehen möchten.",
        problem:
            "Begriffe, Kosten und Risiken sind unklar. Hier geht es um allgemeine Finanzbildung, unabhängig von Deinen persönlichen Anlageentscheidungen.",
        preparation:
            "Die allgemeinen Begriffe und Fragen, die Du besprechen möchtest. Depotzugänge oder Angaben zu persönlichen Kauf- und Verkaufsentscheidungen werden nicht benötigt.",
        packages: [],
        process:
            "Du beschreibst Dein allgemeines Lernthema. Wir grenzen Inhalt und Umfang ab und vereinbaren ein individuelles Angebot. Es entstehen keine persönlichen Produktempfehlungen, Handelsaufträge oder Anlageentscheidungen.",
    },
};
