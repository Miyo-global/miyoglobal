"use client";

import type { RefObject } from "react";

import { Hover } from "@/ledger/components/common/hover-when-able";
import { maskStyle } from "@/ledger/utils/mask";

export interface SwapArrowProps {
  /** Element whose hover drives the swap. */
  trigger: RefObject<HTMLElement>;
  iconSrc: string;
  className?: string;
}

const SWAP = { tension: 300, friction: 26 };
/** Enough travel to clear the 10px box in both directions. */
const TRAVEL = 16;

/**
 * The arrow leaves to the right and a second one arrives from the left, both
 * clipped to the glyph's own box. Reads as the mark being handed on rather than
 * merely nudged.
 */
export const SwapArrow = ({
  trigger,
  iconSrc,
  className = "",
}: SwapArrowProps) => (
  <span
    aria-hidden="true"
    className={`relative block size-2.5 overflow-hidden ${className}`}
  >
    <Hover
      tag="span"
      trigger={trigger}
      from={{ x: 0 }}
      to={{ x: TRAVEL }}
      config={SWAP}
      className="absolute inset-0 block"
    >
      <span
        className="block size-2.5 rotate-90 bg-current"
        style={maskStyle(iconSrc)}
      />
    </Hover>

    <Hover
      tag="span"
      trigger={trigger}
      from={{ x: -TRAVEL }}
      to={{ x: 0 }}
      config={SWAP}
      className="absolute inset-0 block"
    >
      <span
        className="block size-2.5 rotate-90 bg-current"
        style={maskStyle(iconSrc)}
      />
    </Hover>
  </span>
);
