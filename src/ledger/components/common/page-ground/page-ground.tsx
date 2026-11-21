"use client";

import { useEffect, useRef } from "react";
import { animated, useSpring } from "@react-spring/web";

import { useLoop } from "@/ledger/hooks/animation/use-render-loop";

export type Ground = "dark" | "light";

/** Sections name the ground they sit on; this layer paints it for all of them. */
const GROUND_ATTR = "data-ground";
const TOKENS: Record<Ground, string> = { dark: "--ground-dark", light: "--ground-light" };

/** 520ms is the boundary's own clock — slower than the scroll that triggers it. */
const GROUND_CONFIG = { tension: 90, friction: 26 };

/** Tokens are resolved at runtime so the spring blends real colours, not `var()` strings. */
const readToken = (ground: Ground) => getComputedStyle(document.documentElement).getPropertyValue(TOKENS[ground]).trim();

/**
 * One background for the whole page.
 *
 * The blocks paint no ground of their own, so the surface never cuts at a
 * section edge — it changes on its own clock while the contents of one block
 * leave and the next arrive. Whichever block covers the middle of the viewport
 * owns the colour; the spring does the blending. The served HTML paints the
 * dark ground from the token class until the spring takes over.
 */
export const PageGround = () => {
  const currentRef = useRef<Ground>("dark");
  const [style, api] = useSpring(() => ({ backgroundColor: "", config: GROUND_CONFIG }));

  useEffect(() => {
    api.set({ backgroundColor: readToken(currentRef.current) });
    // Sections stop painting their own fallback ground once this layer runs.
    const root = document.documentElement;
    root.setAttribute("data-ground-live", "");
    return () => root.removeAttribute("data-ground-live");
  }, [api]);

  useLoop(
    () => {
      const middle = window.innerHeight / 2;
      const sections = document.querySelectorAll<HTMLElement>(`[${GROUND_ATTR}]`);
      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top > middle || rect.bottom <= middle) continue;
        const next: Ground = section.dataset.ground === "light" ? "light" : "dark";
        if (next !== currentRef.current) {
          currentRef.current = next;
          void api.start({ backgroundColor: readToken(next) });
        }
        return;
      }
    },
    // The ground changes at a section boundary, which no scroll crosses in
    // under a tenth of a second — measuring every 80ms was pure overhead.
    { framerate: 150 },
  );

  // Behind every block, fixed so it never scrolls with them.
  return <animated.div aria-hidden="true" className="fixed inset-0 -z-10 bg-ground-dark" style={style} />;
};
