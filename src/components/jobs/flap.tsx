"use client";

import { animate } from "animejs";
import { useEffect, useRef } from "react";
import { DUR, EASE, prefersReducedMotion } from "../motion/motion";

/**
 * Departure Board split-flap counter. The server renders the final digits. When the counter first comes into view (including
 * at load, since it sits in the page head) each tile flips through its digits once and settles on the real figure; a tile always
 * shows a digit, never a blank. Reduced motion and browsers without IntersectionObserver keep the static figure.
 */
export function Flap({ value, label }: { value: number; label: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const digits = String(value).padStart(2, "0").split("");

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !("IntersectionObserver" in window)) return;
    const tiles = [...el.querySelectorAll<HTMLElement>("[data-d]")];
    const play = () =>
      tiles.forEach((tile, i) => {
        const target = Number(tile.dataset.d);
        const state = { n: 0 };
        tile.textContent = "0";
        animate(state, {
          n: target,
          duration: DUR.slow + i * DUR.base,
          ease: EASE,
          onUpdate: () => (tile.textContent = String(Math.round(state.n))),
          onComplete: () => (tile.textContent = String(target)),
        });
        animate(tile, { rotateX: [-90, 0], duration: DUR.base, ease: EASE, delay: i * DUR.fast });
      });
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      play();
    });
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <span ref={ref} role="img" aria-label={label} className="inline-flex gap-1">
      {digits.map((d, i) => (
        <span key={i} aria-hidden="true" className="relative inline-flex min-w-12 justify-center overflow-hidden rounded-control bg-ink px-3 py-2">
          <span data-d={d} className="num text-display text-accent">
            {d}
          </span>
          <span className="absolute inset-x-0 top-1/2 h-px bg-on-ink-rule" />
        </span>
      ))}
    </span>
  );
}
