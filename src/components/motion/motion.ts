import { cubicBezier } from "animejs";

/** The one easing and the three durations every animation uses. */
export const EASE = cubicBezier(0.2, 0.8, 0.2, 1);
export const DUR = { fast: 150, base: 250, slow: 600 } as const;

export const prefersReducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** True when the element is already on screen; those are left in their final state so nothing visible ever jumps. */
export const isOnScreen = (el: Element) => {
  const r = el.getBoundingClientRect();
  return r.top < window.innerHeight && r.bottom > 0;
};

/**
 * Runs `play` once when `el` first scrolls into view. Elements on screen at mount, under reduced motion, or without
 * IntersectionObserver are skipped and keep the server-rendered final state.
 */
export function onFirstView(el: Element, prepare: () => void, play: () => void): () => void {
  if (prefersReducedMotion() || isOnScreen(el) || !("IntersectionObserver" in window)) return () => {};
  prepare();
  const io = new IntersectionObserver(
    (entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      play();
    },
    { rootMargin: "0px 0px -12% 0px" },
  );
  io.observe(el);
  return () => io.disconnect();
}
