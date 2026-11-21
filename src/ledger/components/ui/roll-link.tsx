"use client";

import Link from "next/link";
import { useRef, type RefObject } from "react";

import { RollLabel } from "@/ledger/components/ui/roll-label";

export interface RollLinkProps {
  label: string;
  href: string;
  className?: string;
  onNavigate?: () => void;
  ariaCurrent?: "page";
}

/** Pages served as static HTML (not App Router routes) need a full page load. */
const STATIC_PAGES = new Set(["/referrals"]);

/**
 * A link whose label rolls: the visible copy lifts out of the top while a
 * second copy rises into its place. The box clips both, so the swap reads as
 * one piece of type turning over rather than two labels crossfading.
 */
export const RollLink = ({ label, href, className = "", onNavigate, ariaCurrent }: RollLinkProps) => {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const Tag = STATIC_PAGES.has(href) || /^(https?:|mailto:)/.test(href) ? "a" : Link;

  return (
    <Tag ref={ref} href={href} onClick={onNavigate} className={className} aria-current={ariaCurrent}>
      <RollLabel label={label} trigger={ref as unknown as RefObject<HTMLElement>} />
    </Tag>
  );
};
