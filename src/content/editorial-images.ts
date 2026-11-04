import type { StaticImageData } from "next/image";
import hero from "../../public/editorial/hero-cleaned.png";
import processes from "../../Digitale-prozesse.jpg";
import website from "../../public/editorial/website-cleaned.png";
import socialMedia from "../../socialmedia.jpg";
import founding from "../../gründung.jpg";
import selfEmployment from "../../selbstständig.jpg";

export type EditorialAsset = {
    src: StaticImageData;
    alt: string;
};

// Vom Nutzer bereitgestellte KI-Motive; Hero und Website ohne Fantasiebeschriftung nachbearbeitet.
// Originaldateien im Projektstamm bleiben unverändert.
// Next/Image erzeugt lokal passende Bildgrößen und optimierte Auslieferungsformate.
export const heroImage: EditorialAsset = {
    src: hero,
    alt: "Arbeitsplatz mit Website-Skizzen im Notizbuch und einem Websiteentwurf auf dem Laptop",
};

export const articleImages: Record<string, EditorialAsset> = {
    "prozesse-sinnvoll-automatisieren": {
        src: processes,
        alt: "Papierkarten auf einem Tisch, mit Schnüren zu einem verzweigten Arbeitsablauf verbunden",
    },
    "website-klarer-naechster-schritt": {
        src: website,
        alt: "Websiteentwürfe auf Papier, Laptop und Smartphone für die Planung verschiedener Bildschirmgrößen",
    },
    "social-media-strategie-alltag": {
        src: socialMedia,
        alt: "Aufgeschlagener Redaktionsplan mit Bildabzügen neben einem Smartphone auf einem Tischstativ",
    },
    "positionierung-fuer-deine-gruendung": {
        src: founding,
        alt: "Ausgewählte Karten mit geometrischen Skizzen neben einem Notizbuch zur Angebotsplanung",
    },
    "digitale-selbststaendigkeit-erster-schritt": {
        src: selfEmployment,
        alt: "Kleiner Arbeitsplatz am Fenster mit Laptop, Projektordner und aufgeschlagenem Notizbuch",
    },
};
