"use client";
import { useRef } from "react";
import Link from "next/link";
import { publicNavigation } from "@/content/navigation";
export function MobileNavigation() {
    const menu = useRef<HTMLDetailsElement>(null);
    return (
        <details
            className="mobile-menu"
            ref={menu}
            onKeyDown={(event) => {
                if (event.key === "Escape" && menu.current?.open) {
                    menu.current.open = false;
                    menu.current.querySelector("summary")?.focus();
                }
            }}
        >
            <summary>Menü</summary>
            <nav
                aria-label="Mobile Navigation"
                onClick={(event) => {
                    if (
                        (event.target as HTMLElement).closest("a") &&
                        menu.current
                    )
                        menu.current.open = false;
                }}
            >
                {publicNavigation.map(([href, title]) => (
                    <Link key={href} href={href}>
                        {title}
                    </Link>
                ))}
                <Link href="/anmelden">Mein Konto</Link>
                <Link href="/kalender">Kostenloses Erstgespräch</Link>
            </nav>
        </details>
    );
}
