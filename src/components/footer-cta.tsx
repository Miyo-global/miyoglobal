"use client";

import { usePathname } from "next/navigation";

/** Pages that already close with their own call to action (home, contact) don't repeat the footer's slab. */
const OWN_CLOSING_CTA = new Set(["/", "/contact"]);

export function FooterCta({ children }: { children: React.ReactNode }) {
  return OWN_CLOSING_CTA.has(usePathname()) ? null : <>{children}</>;
}
