"use client";

import type { RefObject } from "react";

import { Hover } from "@/ledger/components/common/hover-when-able";

/**
 * The 4px squares the design pins to the corners of a dashed box, or to the
 * ends of a vertical rule (Figma nodes 2273:3559-3562, 2273:4245-4250).
 *
 * Decorative only — hidden from assistive technology. The colour comes from the
 * caller so the same marker works on the dark and the light surface. Passing a
 * `trigger` makes the four corners ease outwards when that element is hovered,
 * as if the box were being pulled open.
 */
export interface CornerMarkersProps {
  /** `"box"` marks all four corners; `"edge"` marks only the leading edge. */
  variant?: "box" | "edge";
  /** Background/border utilities for the surface the markers sit on. */
  className?: string;
  /** Element whose hover spreads the corners. Omit for a static set. */
  trigger?: RefObject<HTMLElement>;
}

interface Corner {
  position: string;
  x: number;
  y: number;
}

const BOX_CORNERS: Corner[] = [
  { position: "-left-0.5 -top-0.5", x: -1, y: -1 },
  { position: "-right-0.5 -top-0.5", x: 1, y: -1 },
  { position: "-bottom-0.5 -left-0.5", x: -1, y: 1 },
  { position: "-bottom-0.5 -right-0.5", x: 1, y: 1 },
];

const EDGE_CORNERS: Corner[] = [
  { position: "-left-0.5 -top-0.5", x: 0, y: -1 },
  { position: "-bottom-0.5 -left-0.5", x: 0, y: 1 },
];

const SPREAD = 3;
const CONFIG = { tension: 300, friction: 22 };

export const CornerMarkers = ({
  variant = "box",
  className = "bg-content-on-inverse",
  trigger,
}: CornerMarkersProps) => {
  const corners = variant === "box" ? BOX_CORNERS : EDGE_CORNERS;

  return (
    <>
      {corners.map((corner) =>
        trigger ? (
          <Hover
            key={corner.position}
            tag="span"
            trigger={trigger}
            from={{ x: 0, y: 0 }}
            to={{ x: corner.x * SPREAD, y: corner.y * SPREAD }}
            config={CONFIG}
            aria-hidden="true"
            className={`absolute size-1 ${className} ${corner.position}`}
          />
        ) : (
          <span
            key={corner.position}
            aria-hidden="true"
            className={`absolute size-1 ${className} ${corner.position}`}
          />
        ),
      )}
    </>
  );
};
