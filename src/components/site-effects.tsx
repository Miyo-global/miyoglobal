"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Header shadow on scroll and scroll-reveal (adds `.in` to `.reveal` elements as they enter the viewport). Renders nothing. */
export function SiteEffects() {
  const pathname = usePathname();
  useEffect(() => {
    const header = document.querySelector("header");
    const onScroll = () => header?.classList.toggle("scrolled", window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("in");
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
