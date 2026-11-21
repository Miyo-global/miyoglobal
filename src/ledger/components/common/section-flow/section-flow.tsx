"use client";

import { SpringTrigger } from "@/ledger/components/animation/springs/spring-trigger";

export interface SectionFlowProps {
  children: React.ReactNode;
}

/** Matches the ground's own clock, so the two halves of the change agree. */
const FLOW_CONFIG = { tension: 110, friction: 26 };

/**
 * Six of these run at once, and each frame costs a `getBoundingClientRect` —
 * a forced layout. The travel is 50px across a whole section, so sampling at
 * ~30fps is indistinguishable from 100 and costs a third as much.
 */
const FLOW_INTERVAL = 32;

/**
 * The leaving half of the transition: as a block scrolls out, its contents
 * drop away and fade while the next block's contents rise into place.
 *
 * This only moves content. The ground is a separate fixed layer, so shifting a
 * section here leaves the surface untouched — which is the whole point: the
 * colour changes on its own clock and the seam never appears.
 */
export const SectionFlow = ({ children }: SectionFlowProps) => (
  <SpringTrigger
    tag="div"
    mode="scrub"
    start="bottom bottom"
    end="bottom top"
    from={{ y: 0, opacity: 1 }}
    to={{ y: 50, opacity: 0.25 }}
    config={FLOW_CONFIG}
    frameInterval={FLOW_INTERVAL}
  >
    {children}
  </SpringTrigger>
);
