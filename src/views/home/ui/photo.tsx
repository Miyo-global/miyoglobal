import Image from "next/image";

import { CornerMarkers } from "@/ledger/components/ui/corner-markers";

export interface PhotoProps {
  src: string;
  alt: string;
  sizes: string;
  /** CSS object-position focal point. */
  position?: string;
  priority?: boolean;
  className?: string;
  marker?: string;
}

/**
 * Square-cornered photograph in a dashed frame with corner markers, graded with
 * the one duotone every image on the page shares.
 */
export function Photo({ src, alt, sizes, position = "50% 50%", priority = false, className = "", marker = "bg-ink" }: PhotoProps) {
  return (
    <figure className={`relative border border-dashed border-current p-1.5 ${className}`}>
      <span className="ld-duotone relative block size-full overflow-hidden">
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} quality={70} className="object-cover" style={{ objectPosition: position }} />
      </span>
      <CornerMarkers className={marker} />
    </figure>
  );
}
