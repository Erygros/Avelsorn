import { services } from "../pages";
import { audiences, audiencePath } from "../audiences";
import { searchPages, searchHubs, searchPagePath } from "./index";
export const publicSitePaths = () => [
    "/",
    "/leistungen",
    "/preise",
    "/ablauf",
    "/zielgruppen",
    "/erstgespraech",
    "/kalender",
    "/kontakt",
    "/ueber-mich",
    "/blog",
    "/beruflich-neu-starten",
    "/paket-anfragen",
    ...audiences.map(audiencePath),
    ...services.map((s) => "/leistungen/" + s.slug),
    ...searchHubs.map((hub) => hub.path),
    ...searchPages.map(searchPagePath),
];
export function publicCmsPath(slug: string): string | null {
    if (!/^[a-z0-9]+(?:[/-][a-z0-9]+)*$/.test(slug)) return null;
    if (
        /^(admin|konto|api|entwicklung|kalender|branchen|loesungen|wissen|fragen|unternehmensberatung-castrop-rauxel|paket-anfragen|beruflich-neu-starten|anmelden|registrieren|passwort-vergessen|passwort-zuruecksetzen|email-bestaetigen|zustimmung|vertragszustimmung|otp|einrichtung)(\/|$)/.test(
            slug,
        )
    )
        return null;
    if (/^zielgruppen\//.test(slug)) return null;
    if (
        [
            "widerruf",
            "terminbuchung",
            "datenschutzerklaerung",
            "widerrufsformular",
            ...services.map((s) => s.slug),
        ].includes(slug)
    )
        return null;
    return "/" + slug;
}
