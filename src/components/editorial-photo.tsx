import Image from "next/image";
import type { EditorialAsset } from "@/content/editorial-images";

export function EditorialPhoto({
    asset,
    className,
    sizes,
    preload = false,
}: {
    asset: EditorialAsset;
    className: string;
    sizes: string;
    preload?: boolean;
}) {
    return (
        <figure className={`editorial-photo ${className}`}>
            <Image
                src={asset.src}
                alt={asset.alt}
                sizes={sizes}
                placeholder="blur"
                preload={preload}
                quality={85}
            />
            <figcaption>KI-generiertes Motiv</figcaption>
        </figure>
    );
}
