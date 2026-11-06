import Link from "next/link";
import {
    LayoutDashboard,
    CalendarDays,
    CalendarPlus,
    FolderOpen,
    Clock3,
    MessageSquare,
    FileText,
    Settings,
    ShieldCheck,
    Bell,
    Users,
    Layers,
    BookOpen,
    ArrowUpRight,
    ListTodo,
    FileUp,
    CircleCheck,
    ScrollText,
    ReceiptEuro,
    ClipboardList,
    UserRound,
    LifeBuoy,
    Mail,
    Newspaper,
    Contact,
    Landmark,
    Database,
    Activity,
    LockKeyhole,
} from "lucide-react";
import { Brand } from "./brand";
import { ActionForm } from "./action-form";
import type { User } from "@/server/schema";
import { PortalSectionSelect } from "./portal-section-select";

export const customerNav = [
    ["", "Übersicht"],
    ["termine", "Meine Termine"],
    ["buchen", "Buchen"],
    ["pakete", "Pakete"],
    ["zeit", "Zeitnachweise"],
    ["projekte", "Projekte"],
    ["aufgaben", "Aufgaben"],
    ["dateien", "Dateien"],
    ["freigaben", "Freigaben"],
    ["nachrichten", "Nachrichten"],
    ["angebote", "Angebote"],
    ["rechnungen", "Rechnungen"],
    ["benachrichtigungen", "Mitteilungen"],
    ["fragebogen", "Fragebogen"],
    ["profil", "Profil"],
    ["datenschutz", "Datenschutz"],
    ["support", "Support"],
];
export const adminNav = [
    ["", "Übersicht"],
    ["kunden", "Kunden"],
    ["onboarding", "Fragebögen"],
    ["kalender", "Kalender"],
    ["beratungen", "Beratungen"],
    ["projekte", "Projekte"],
    ["aufgaben", "Aufgaben"],
    ["zeit", "Zeit"],
    ["pakete", "Pakete"],
    ["nachrichten", "Chat"],
    ["dateien", "Dateien"],
    ["angebote", "Angebote"],
    ["rechnungen", "Rechnungen"],
    ["zahlungen", "Zahlungen"],
    ["email", "E-Mails"],
    ["benachrichtigungen", "Mitteilungen"],
    ["blog", "Blog"],
    ["inhalte", "Website"],
    ["kontakt", "Anfragen"],
    ["datenschutz", "Datenschutz"],
    ["widerrufe", "Widerrufe"],
    ["einstellungen", "Stammdaten"],
    ["system", "Konfiguration"],
    ["sicherheit", "Protokoll"],
    ["backups", "Backups"],
    ["status", "Status"],
];
const adminGroups = [
    { title: "Übersicht", slug: "", icon: LayoutDashboard, sections: [""] },
    {
        title: "Anfragen",
        slug: "kontakt",
        icon: Contact,
        sections: ["kontakt", "datenschutz", "widerrufe"],
    },
    {
        title: "Kunden",
        slug: "kunden",
        icon: Users,
        sections: ["kunden", "onboarding"],
    },
    {
        title: "Kalender",
        slug: "kalender",
        icon: CalendarDays,
        sections: ["kalender", "beratungen"],
    },
    {
        title: "Aufträge",
        slug: "projekte",
        icon: FolderOpen,
        sections: [
            "projekte",
            "aufgaben",
            "zeit",
            "pakete",
            "dateien",
            "nachrichten",
            "video",
        ],
    },
    {
        title: "Finanzen",
        slug: "angebote",
        icon: ReceiptEuro,
        sections: ["angebote", "angebote/neu", "rechnungen", "zahlungen"],
    },
    {
        title: "Inhalte",
        slug: "blog",
        icon: BookOpen,
        sections: ["blog", "inhalte", "email"],
    },
    {
        title: "System",
        slug: "einstellungen",
        icon: Settings,
        sections: [
            "einstellungen",
            "system",
            "sicherheit",
            "backups",
            "status",
            "benachrichtigungen",
        ],
    },
];
const customerGroups = [
    { title: "Übersicht", slug: "", icon: LayoutDashboard, sections: [""] },
    {
        title: "Termine",
        slug: "termine",
        icon: CalendarDays,
        sections: ["termine", "buchen", "video"],
    },
    {
        title: "Projekte",
        slug: "projekte",
        icon: FolderOpen,
        sections: ["projekte", "aufgaben", "dateien", "freigaben"],
    },
    {
        title: "Pakete",
        slug: "pakete",
        icon: Layers,
        sections: ["pakete", "zeit"],
    },
    {
        title: "Dokumente",
        slug: "angebote",
        icon: FileText,
        sections: ["angebote", "rechnungen"],
    },
    {
        title: "Nachrichten",
        slug: "nachrichten",
        icon: MessageSquare,
        sections: ["nachrichten", "benachrichtigungen", "support"],
    },
    {
        title: "Konto",
        slug: "profil",
        icon: UserRound,
        sections: ["profil", "fragebogen", "datenschutz"],
    },
];
const icons: Record<string, typeof LayoutDashboard> = {
    "": LayoutDashboard,
    termine: CalendarDays,
    buchen: CalendarPlus,
    pakete: Layers,
    zeit: Clock3,
    projekte: FolderOpen,
    aufgaben: ListTodo,
    dateien: FileUp,
    freigaben: CircleCheck,
    nachrichten: MessageSquare,
    angebote: ScrollText,
    rechnungen: ReceiptEuro,
    benachrichtigungen: Bell,
    fragebogen: ClipboardList,
    profil: UserRound,
    datenschutz: ShieldCheck,
    support: LifeBuoy,
    kunden: Users,
    onboarding: ClipboardList,
    kalender: CalendarDays,
    beratungen: CalendarDays,
    zahlungen: Landmark,
    email: Mail,
    blog: Newspaper,
    inhalte: BookOpen,
    kontakt: Contact,
    widerrufe: FileText,
    einstellungen: Settings,
    system: Settings,
    sicherheit: LockKeyhole,
    backups: Database,
    status: Activity,
};
export async function PortalShell({
    user,
    section,
    admin,
    children,
}: {
    user: User;
    section: string;
    admin: boolean;
    children: React.ReactNode;
}) {
    const nav = admin ? adminNav : customerNav;
    const groups = admin ? adminGroups : customerGroups;
    const base = admin ? "/admin" : "/konto";
    const group = groups.find((item) => item.sections.includes(section));
    const selectedSection =
        section === "angebote/neu"
            ? "angebote"
            : section === "video"
              ? admin
                  ? "kalender"
                  : "termine"
              : section;
    const subitems = nav
        .filter(([slug]) => group?.sections.includes(slug))
        .map(([slug, label]) => ({
            slug,
            label,
            href: base + (slug ? "/" + slug : ""),
        }));
    if (!admin && group?.slug === "profil")
        subitems.push({
            slug: "widerruf",
            label: "Widerruf",
            href: "/widerruf",
        });
    return (
        <div
            className={
                "portal portal-compact " +
                (admin ? "portal-admin" : "portal-customer")
            }
        >
            <aside className="portal-sidebar">
                <Brand />
                <nav aria-label={admin ? "Adminnavigation" : "Kontonavigation"}>
                    {groups.map((item) => (
                        <Link
                            key={item.slug}
                            href={base + (item.slug ? "/" + item.slug : "")}
                            className={group === item ? "current" : ""}
                            aria-current={
                                section === item.slug ? "page" : undefined
                            }
                        >
                            <item.icon
                                size={18}
                                strokeWidth={1.6}
                                aria-hidden="true"
                            />
                            <span>{item.title}</span>
                        </Link>
                    ))}
                </nav>
                <div className="sidebar-footer">
                    <p>{admin ? "Administration" : "Dein Kundenkonto"}</p>
                    <ActionForm action="logout" submit="Abmelden" />
                </div>
            </aside>
            <div className="portal-main">
                <header className="portal-topbar">
                    <Link href="/">
                        Zur Website{" "}
                        <ArrowUpRight size={11} aria-hidden="true" />
                    </Link>
                    <div className="portal-user">
                        <span>
                            {admin ? "Administration, " : "Angemeldet als "}
                            {user.name.split(" ")[0]}
                        </span>
                        <div className="avatar" aria-hidden="true">
                            {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .slice(0, 2)
                                .join("")}
                        </div>
                        <Link
                            href={base + "/benachrichtigungen"}
                            aria-label="Benachrichtigungen"
                        >
                            <Bell size={17} aria-hidden="true" />
                        </Link>
                        <div className="portal-mobile-logout">
                            <ActionForm action="logout" submit="Abmelden" />
                        </div>
                    </div>
                    {subitems.length > 1 && (
                        <>
                            <nav
                                className="portal-section-nav"
                                aria-label={
                                    admin
                                        ? group!.title + " verwalten"
                                        : "Bereich " + group!.title
                                }
                            >
                                {subitems.map((item) => {
                                    const Icon = icons[item.slug] ?? FileText;
                                    return (
                                        <Link
                                            key={item.slug}
                                            href={item.href}
                                            className={
                                                selectedSection === item.slug
                                                    ? "current"
                                                    : ""
                                            }
                                            aria-current={
                                                selectedSection === item.slug
                                                    ? "page"
                                                    : undefined
                                            }
                                        >
                                            <Icon
                                                size={15}
                                                aria-hidden="true"
                                            />
                                            <span>{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </nav>
                            <PortalSectionSelect
                                section={selectedSection}
                                items={subitems}
                                label={
                                    admin ? "Verwaltungsseite" : "Unterseite"
                                }
                            />
                        </>
                    )}
                </header>
                <main id="main" className="portal-content">
                    {children}
                    {!admin && (
                        <div className="portal-withdrawal">
                            <Link
                                className="button withdrawal-link"
                                href="/widerruf"
                            >
                                Vertrag widerrufen
                            </Link>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
