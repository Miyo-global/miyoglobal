"use client";

import Image from "next/image";
import { animated, useSpringValue } from "@react-spring/web";
import { useLayoutEffect, useRef, useState } from "react";

import { markHandoff } from "@/ledger/lib/preloader-handoff";

import { ports } from "./content";
import { PASSAGE_ID } from "./passage-gate";
import { RouteChart, TO, VIEW } from "./route-chart";

/** The route takes at least this long to plot, so it can be seen. */
const MIN_MS = 1200;
/** However slow the network, the curtain leaves by then. */
const MAX_MS = 2200;
const OPEN = { tension: 120, friction: 26, clamp: true };

const fixed = (n: number) => n.toFixed(2);

/**
 * 0 · Passage intro (Fathom's passage, re-skinned): on the first visit of a
 * session a navy curtain plots HYD → RAK in gold while the coordinates tick,
 * then opens out of the RAK port onto the hero and hands over (Northwall's
 * `markHandoff`), so the hero's words play in view. The hero is server-rendered
 * underneath, so its photo is already painted. Skippable by any click or key.
 * Hidden from assistive tech and never holds keyboard focus.
 */
export function Passage() {
  const ref = useRef<HTMLDivElement>(null);
  const p = useSpringValue(0);
  const open = useSpringValue(0);
  const [gone, setGone] = useState(false);
  const [hole, setHole] = useState({ x: 0, y: 0, r: 0 });

  // Layout effect: decide before paint, so a client-side visit never flashes the curtain.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || el.dataset.play !== "1") {
      markHandoff();
      setGone(true);
      return;
    }
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    let alive = true;
    let skip = false;
    let loaded = document.readyState === "complete";
    const onLoad = () => (loaded = true);
    window.addEventListener("load", onLoad, { once: true });
    const onSkip = () => (skip = true);
    window.addEventListener("pointerdown", onSkip);
    window.addEventListener("keydown", onSkip);

    const begin = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      if (!alive) return;
      const elapsed = now - begin;
      const real = skip || elapsed > MAX_MS || loaded ? 1 : 0.85;
      const shown = Math.min(real, skip ? 1 : elapsed / MIN_MS);
      p.set(p.get() + (shown - p.get()) * (skip ? 0.4 : 0.16));
      if (p.get() > 0.995) {
        p.set(1);
        arrive();
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    const arrive = () => {
      const svg = el.querySelector("svg");
      const box = svg?.getBoundingClientRect();
      const scale = box ? Math.min(box.width / VIEW.w, box.height / VIEW.h) : 1;
      const x = box ? box.left + (box.width - VIEW.w * scale) / 2 + TO.x * scale : window.innerWidth / 3;
      const y = box ? box.top + (box.height - VIEW.h * scale) / 2 + TO.y * scale : window.innerHeight / 3;
      setHole({ x, y, r: Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y)) });
      document.documentElement.style.overflow = previous;
      markHandoff();
      void open.start(1, { config: OPEN }).then(() => alive && setGone(true));
    };

    frame = requestAnimationFrame(tick);
    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      document.documentElement.style.overflow = previous;
      window.removeEventListener("load", onLoad);
      window.removeEventListener("pointerdown", onSkip);
      window.removeEventListener("keydown", onSkip);
    };
  }, [open, p]);

  if (gone) return null;

  const mask = open.to((t) => `radial-gradient(circle at ${hole.x}px ${hole.y}px, transparent ${t * hole.r}px, black ${t * hole.r + 1}px)`);

  return (
    <>
      <noscript>
        <style>{`#${PASSAGE_ID}{display:none}`}</style>
      </noscript>
      <animated.div
        ref={ref}
        id={PASSAGE_ID}
        aria-hidden="true"
        suppressHydrationWarning
        className="ld fixed inset-0 z-[70] h-lvh bg-ground-dark text-on-dark"
        style={{ maskImage: mask, WebkitMaskImage: mask }}
      >
        <animated.div className="absolute inset-0" style={{ opacity: open.to((t) => 1 - Math.min(1, t * 1.6)) }}>
          <div className="absolute left-5 top-5 md:left-10 md:top-8">
            <Image src="/images/logo-web.png" alt="" width={74} height={40} priority />
          </div>
          <RouteChart progress={p} className="absolute inset-x-0 top-1/2 h-[70vh] w-full -translate-y-1/2" />
          <p className="absolute bottom-6 left-5 flex flex-col gap-1 font-sans text-label font-medium uppercase tabular-nums md:bottom-10 md:left-10 md:flex-row md:gap-8">
            <animated.span>
              {p.to((v) => `${fixed(ports.from.lat + (ports.to.lat - ports.from.lat) * v)}° N  ${fixed(ports.from.lon + (ports.to.lon - ports.from.lon) * v)}° E`)}
            </animated.span>
            <span className="text-on-dark-muted">{ports.label}</span>
          </p>
        </animated.div>
      </animated.div>
    </>
  );
}
