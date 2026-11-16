"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

function runCount(el: HTMLElement, reduce: boolean) {
  if (el.dataset.done) return;
  el.dataset.done = "1";
  const target = Number(el.dataset.count);
  const suffix = el.dataset.suffix ?? "";
  if (reduce) return;
  const duration = 1200;
  const t0 = performance.now();
  const tick = (t: number) => {
    const p = Math.min((t - t0) / duration, 1);
    el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  tick(t0);
}

/** Behaviour of the old inline page script: header shadow on scroll, scroll-reveal, counters and hero ring parallax. Renders nothing. */
export function SiteEffects() {
  const pathname = usePathname();
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const header = document.querySelector("header");
    const rings = reduce ? [] : [...document.querySelectorAll<HTMLElement>(".hero .gfx .ring")];
    const onScroll = () => {
      header?.classList.toggle("scrolled", window.scrollY > 12);
      const y = window.scrollY * 0.06;
      rings.forEach((ring, i) => (ring.style.translate = `0 ${y * (i ? 1.6 : 1)}px`));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("in");
          entry.target.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => runCount(el, reduce));
          io.unobserve(entry.target);
        }
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" },
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, [pathname]);
  return null;
}
