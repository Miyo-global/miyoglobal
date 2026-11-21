"use client";

import Link from "next/link";
import { useRef, type RefObject } from "react";

import { Hover } from "@/ledger/components/common/hover-when-able";
import { CornerMarkers } from "@/ledger/components/ui/corner-markers";

export type DashedTone = "dark" | "light";

export interface DashedLinkProps {
  href: string;
  label: string;
  /** The ground the box sits on. */
  tone: DashedTone;
  /** A filled call to action: gold on navy/photo, deep gold on paper. */
  primary?: boolean;
  /** Static HTML pages (e.g. /referrals) need a full page load. */
  external?: boolean;
  className?: string;
  onNavigate?: () => void;
}

const FILL = { tension: 240, friction: 30 };
const ROLL = { tension: 260, friction: 26 };

/**
 * Northwall's dashed call to action: on hover the box fills from the bottom,
 * the label rolls over to a copy in the ground colour, and the corner markers
 * pull outwards. The primary variant starts filled, so the roll alone carries it.
 */
const TONES = {
  dark: {
    box: "border-rule-dark text-on-dark",
    fill: "bg-on-dark",
    rolled: "text-ground-dark",
    marker: "bg-on-dark",
    primary: "border-accent bg-accent text-ground-dark",
    primaryFill: "bg-on-dark",
    primaryRolled: "text-ground-dark",
  },
  light: {
    box: "border-rule-light text-ink",
    fill: "bg-ink",
    rolled: "text-on-dark",
    marker: "bg-ink",
    primary: "border-accent-deep bg-accent-deep text-on-dark",
    primaryFill: "bg-ink",
    primaryRolled: "text-on-dark",
  },
} as const;

export const DashedLink = ({
  href,
  label,
  tone,
  primary = false,
  external = false,
  className = "",
  onNavigate,
}: DashedLinkProps) => {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const trigger = ref as unknown as RefObject<HTMLElement>;
  const t = TONES[tone];
  const Tag = external ? "a" : Link;

  return (
    <Tag
      ref={ref}
      href={href}
      onClick={onNavigate}
      className={`relative inline-flex min-h-11 items-center justify-center whitespace-nowrap border border-dashed px-6 py-3.5 font-sans text-label font-medium uppercase transition-colors duration-[var(--duration-normal)] ${primary ? t.primary : t.box} ${className}`}
    >
      <Hover
        tag="span"
        trigger={trigger}
        from={{ scaleY: 0 }}
        to={{ scaleY: 1 }}
        config={FILL}
        aria-hidden="true"
        className={`absolute inset-0 origin-bottom ${primary ? t.primaryFill : t.fill}`}
      />
      <span className="relative block overflow-hidden">
        <Hover tag="span" trigger={trigger} from={{ y: "0%" }} to={{ y: "-100%" }} config={ROLL} className="block">
          {label}
        </Hover>
        <Hover
          tag="span"
          trigger={trigger}
          from={{ y: "100%" }}
          to={{ y: "0%" }}
          config={ROLL}
          aria-hidden="true"
          className={`absolute inset-0 block ${primary ? t.primaryRolled : t.rolled}`}
        >
          {label}
        </Hover>
      </span>
      <CornerMarkers className={t.marker} trigger={trigger} />
    </Tag>
  );
};
