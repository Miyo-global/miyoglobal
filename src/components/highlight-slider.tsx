"use client";

import { useEffect, useState } from "react";

const slides = [
  ["Specialist teams deployed in about two weeks, not months.", "Speed on demand"],
  ["Human-in-the-loop QA on every engagement, with daily checks.", "Managed quality"],
  ["We work under your brand. Your client sees your team.", "White-label delivery"],
  ["Compliance-backed delivery from India and the UAE.", "Trust & governance"],
] as const;

/** Home page highlights: rotates every 4.5s, pauses on hover, stays still with reduced motion. All slides are in the server HTML. */
export function HighlightSlider() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setActive((i) => (i + 1) % slides.length), 4500);
    return () => clearInterval(timer);
  }, [paused, active]);
  return (
    <div className="slider" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="slides" id="slides">
        {slides.map(([quote, label], i) => (
          <div key={label} className={`slide${i === active ? " active" : ""}`}>
            <div className="q">{quote}</div>
            <div className="a">{label}</div>
          </div>
        ))}
      </div>
      <div className="dots" id="dots" role="tablist" aria-label="Highlights">
        {slides.map(([, label], i) => (
          <button key={label} type="button" className={i === active ? "on" : undefined} role="tab" aria-selected={i === active} aria-label={`Highlight ${i + 1}`} onClick={() => setActive(i)} />
        ))}
      </div>
    </div>
  );
}
