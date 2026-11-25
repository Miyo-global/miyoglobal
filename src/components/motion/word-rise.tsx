"use client";

import { animate, stagger, utils } from "animejs";
import { useEffect, useRef } from "react";
import { DUR, EASE, onFirstView } from "./motion";

/**
 * Word Rise: a heading's words rise and settle once as it scrolls into view. Server HTML is the final state, so headings
 * on screen at load (the hero) never move and never start hidden.
 */
export function WordRise({ text, as: Tag = "h2", className, id }: { text: string; as?: "h1" | "h2" | "p"; className?: string; id?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = el.querySelectorAll<HTMLElement>("[data-w]");
    return onFirstView(
      el,
      () => utils.set(words, { translateY: "0.5em", opacity: 0.001 }),
      () => animate(words, { translateY: 0, opacity: 1, duration: DUR.slow, ease: EASE, delay: stagger(40) }),
    );
  }, []);
  const words = text.split(" ");
  return (
    <Tag ref={ref} id={id} className={className}>
      {words.map((w, i) => (
        <span key={i}>
          <span data-w="" className="inline-block will-change-transform">
            {w}
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}
