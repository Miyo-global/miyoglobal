"use client";

import { useRef, type RefObject } from "react";

import { Hover } from "@/ledger/components/common/hover-when-able";
import { SwapArrow } from "@/ledger/components/ui/swap-arrow";

export interface ArrowLinkProps {
  label: string;
  href: string;
  /** Arrow glyph, drawn as a mask so it takes the link's colour. */
  iconSrc: string;
  className?: string;
  onNavigate?: () => void;
}

const CONFIG = { tension: 300, friction: 26 };

/**
 * A row that hands its arrow on when hovered — the glyph leaves to the right,
 * a second one arrives from the left, and the label drifts after it.
 */
export const ArrowLink = ({
  label,
  href,
  iconSrc,
  className = "",
  onNavigate,
}: ArrowLinkProps) => {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const trigger = ref as unknown as RefObject<HTMLElement>;

  return (
    <a ref={ref} href={href} onClick={onNavigate} className={className}>
      <Hover
        tag="span"
        trigger={trigger}
        from={{ x: 0 }}
        to={{ x: 4 }}
        config={CONFIG}
        className="block"
      >
        {label}
      </Hover>

      <SwapArrow trigger={trigger} iconSrc={iconSrc} />
    </a>
  );
};
