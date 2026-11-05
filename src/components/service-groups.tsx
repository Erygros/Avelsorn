import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { serviceGroups } from "@/content/service-groups";
import { services } from "@/content/pages";

export function ServiceGroups({ overview = false }: { overview?: boolean }) {
    const Heading = overview ? "h2" : "h3";
    return (
        <div className="service-category-grid">
            {serviceGroups.map((group) => (
                <section
                    className="service-category"
                    key={group.key}
                    id={group.key}
                >
                    <Heading>{group.title}</Heading>
                    <p>{group.description}</p>
                    <p className="service-subjects">{group.subjects}</p>
                    <ul>
                        {group.slugs.map((slug) => {
                            const service = services.find(
                                (item) => item.slug === slug,
                            )!;
                            return (
                                <li key={slug}>
                                    <Link href={"/leistungen/" + slug}>
                                        <span>
                                            {service.title}
                                            {overview && (
                                                <small>{service.short}</small>
                                            )}
                                        </span>
                                        <ArrowUpRight
                                            size={18}
                                            aria-hidden="true"
                                        />
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </section>
            ))}
        </div>
    );
}
