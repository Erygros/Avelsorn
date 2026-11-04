"use client";
import { useRouter } from "next/navigation";
export function PortalSectionSelect({
    section,
    items,
    label,
}: {
    section: string;
    items: { slug: string; label: string; href: string }[];
    label: string;
}) {
    const router = useRouter();
    return (
        <div className="portal-section-select">
            <label htmlFor="portal-section">{label}</label>
            <select
                id="portal-section"
                value={section}
                onChange={(event) => {
                    const selected = items.find(
                        (item) => item.slug === event.target.value,
                    );
                    if (selected) router.push(selected.href);
                }}
            >
                {items.map((item) => (
                    <option key={item.slug} value={item.slug}>
                        {item.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
