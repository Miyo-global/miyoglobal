"use client";

import { animate } from "animejs";
import { useEffect, useRef } from "react";
import { DUR, EASE, onFirstView } from "./motion";

/**
 * Counts the leading number of a published figure up from zero once, keeping its prefix and suffix ("3,750", "95%+",
 * "2 wks"). The server renders the real figure, which is what crawlers, screen readers and reduced-motion users get.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    const m = /^(\D*)([\d,]+(?:\.\d+)?)(.*)$/.exec(value);
    if (!el || !m) return;
    const [, pre, num, post] = m;
    const target = Number(num.replace(/,/g, ""));
    const decimals = num.includes(".") ? num.split(".")[1].length : 0;
    const grouped = num.includes(",");
    const fmt = (n: number) => pre + (grouped ? Math.round(n).toLocaleString("en-IN") : n.toFixed(decimals)) + post;
    const state = { n: 0 };
    return onFirstView(
      el,
      () => (el.textContent = fmt(0)),
      () =>
        animate(state, {
          n: target,
          duration: DUR.slow * 2,
          ease: EASE,
          onUpdate: () => (el.textContent = fmt(state.n)),
          onComplete: () => (el.textContent = value),
        }),
    );
  }, [value]);
  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
