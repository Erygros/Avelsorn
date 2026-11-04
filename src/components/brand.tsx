import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/content/brand";

export function Brand() {
    return (
        <Link
            className="brand"
            href="/"
            aria-label={`${BRAND.name} – Zur Startseite`}
        >
            <Image
                src={BRAND.logo}
                width={BRAND.logoWidth}
                height={BRAND.logoHeight}
                sizes="174px"
                alt={BRAND.name}
            />
        </Link>
    );
}
