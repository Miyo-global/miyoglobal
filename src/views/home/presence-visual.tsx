"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/components/motion/motion";
import { RouteMap } from "./route-map";

/**
 * Static route map for everyone; on desktop (≥1024px) with WebGL and no reduced-motion preference, the Three.js globe is
 * fetched only when this block nears the viewport and fades in over the map in the same box, so nothing shifts and it is
 * never the LCP element.
 */
export function PresenceVisual() {
  const box = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el || !window.matchMedia("(min-width: 1024px)").matches || prefersReducedMotion()) return;
    const gl = document.createElement("canvas").getContext("webgl2");
    if (!gl) return;
    let cleanup: (() => void) | undefined;
    let cancelled = false;
    const io = new IntersectionObserver(
      async (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const { mountGlobe } = await import("./globe");
        if (cancelled) return;
        cleanup = mountGlobe(el, { animate: true });
        setReady(true);
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
      cleanup?.();
    };
  }, []);

  return (
    <div ref={box} className="relative aspect-4/3 w-full text-on-ink">
      <RouteMap className={`absolute inset-0 size-full transition-opacity duration-600 ease-brand ${ready ? "opacity-0" : "opacity-100"}`} />
    </div>
  );
}
