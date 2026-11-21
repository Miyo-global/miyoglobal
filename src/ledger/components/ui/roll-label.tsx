"use client";

import type { RefObject } from "react";

import { Hover } from "@/ledger/components/common/hover-when-able";

export interface RollLabelProps {
  label: string;
  /** Element whose hover drives the roll. */
  trigger: RefObject<HTMLElement>;
  className?: string;
}

/** One timing for every rolling label on the site. */
export const ROLL_CONFIG = { tension: 260, friction: 26 };

/**
 * A label that lifts out of the top while a second copy rises into its place,
 * both clipped to the line box. Shared by every button so they all turn over at
 * the same speed.
 */
export const RollLabel = ({
  label,
  trigger,
  className = "",
}: RollLabelProps) => (
  <span className={`relative block overflow-hidden ${className}`}>
    <Hover
      tag="span"
      trigger={trigger}
      from={{ y: "0%" }}
      to={{ y: "-100%" }}
      config={ROLL_CONFIG}
      className="block"
    >
      {label}
    </Hover>
    <Hover
      tag="span"
      trigger={trigger}
      from={{ y: "100%" }}
      to={{ y: "0%" }}
      config={ROLL_CONFIG}
      aria-hidden="true"
      className="absolute inset-0 block"
    >
      {label}
    </Hover>
  </span>
);
