"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { CornerMarkers } from "@/ledger/components/ui/corner-markers";
import { DashedLink } from "@/ledger/components/ui/dashed-link";
import { RollLink } from "@/ledger/components/ui/roll-link";
import { Spring } from "@/ledger/components/common/robot-spring";
import { useLoop } from "@/ledger/hooks/animation/use-render-loop";
import { maskStyle } from "@/ledger/utils/mask";

const NAV = [
  ["/staffing-solutions", "Staffing Solutions"],
  ["/digital-solutions", "Digital Solutions"],
  ["/case-studies", "Case Studies"],
  ["/referrals", "Referrals"],
  ["/about", "About"],
  ["/blog", "Blog"],
] as const;

const ARROW = "/images/ledger/arrow.svg";

type Theme = "dark" | "light" | "hidden";

const THEMES: Record<Theme, { text: string; rule: string; marker: string; tone: "dark" | "light" }> = {
  dark: { text: "text-on-dark", rule: "border-rule-dark", marker: "bg-on-dark", tone: "dark" },
  light: { text: "text-ink", rule: "border-rule-light", marker: "bg-ink", tone: "light" },
  hidden: { text: "text-on-dark", rule: "border-rule-dark", marker: "bg-on-dark", tone: "dark" },
};

const BURGER = { tension: 320, friction: 26 };

/** /referrals is a static HTML file, so it needs a full page load rather than client navigation. */
const isStatic = (href: string) => href === "/referrals";

/**
 * Northwall's recolouring header, site-wide. On the home page it floats over the
 * fixed ground and takes its colour from whichever `[data-header-theme]` section
 * covers the viewport mid-line (sampled every 80ms, backwards, footer `hidden`
 * rule kept). Inner pages have no themed sections, so it sits on paper with an
 * in-flow spacer and their layout is unchanged.
 *
 * `active` pins the highlighted link (the blog passes "/blog" for every blog URL).
 */
export function SiteHeader({ active }: { active?: string }) {
  const pathname = usePathname();
  const home = pathname === "/";
  const current = active ?? pathname;
  const [theme, setTheme] = useState<Theme>(home ? "dark" : "light");
  const themeRef = useRef<Theme>(theme);
  // The menu remembers the path it was opened on, so any navigation closes it.
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;
  const setOpen = (next: boolean) => setOpenedOn(next ? pathname : null);
  const menuBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpenedOn(null);
      menuBtn.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useLoop(
    () => {
      const sections = document.querySelectorAll<HTMLElement>("[data-header-theme]");
      const set = (next: Theme) => {
        if (next === themeRef.current) return;
        themeRef.current = next;
        setTheme(next);
      };
      // Only the home page recolours; inner pages stay on paper.
      if (!home || !sections.length) return set("light");
      const midline = window.innerHeight / 2;
      for (const section of sections) {
        if (section.dataset.headerTheme !== "hidden") continue;
        if (section.getBoundingClientRect().top > window.innerHeight * 0.5) continue;
        return set("hidden");
      }
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const rect = sections[i].getBoundingClientRect();
        if (rect.top > midline || rect.bottom <= midline) continue;
        const declared = sections[i].dataset.headerTheme;
        return set(declared === "light" || declared === "hidden" ? declared : "dark");
      }
    },
    { framerate: 80 },
  );

  const styles = THEMES[theme];
  const surface = home ? "" : "bg-raised-light";

  return (
    <>
      <header
        className={`ld fixed inset-x-0 top-0 z-50 h-header font-sans transition-[color,opacity] duration-[var(--duration-normal)] ease-entrance ${
          theme === "hidden" && !open ? "pointer-events-none opacity-0" : "opacity-100"
        } ${surface} ${styles.text}`}
      >
        <div className={`flex h-full items-stretch border-b border-dashed transition-colors duration-[var(--duration-normal)] ${styles.rule}`}>
          <div className={`flex shrink-0 items-center border-r border-dashed px-4 transition-colors duration-[var(--duration-normal)] md:px-6 xl:px-10 ${styles.rule}`}>
            <Link href="/" className="block py-2" aria-label="MIYO Global home">
              <Image src="/images/logo-web.png" alt="MIYO Global" width={74} height={40} priority className="h-10 w-auto" />
            </Link>
          </div>

          <nav aria-label="Primary" className="relative hidden flex-1 items-center justify-center lg:flex">
            <CornerMarkers variant="edge" className={styles.marker} />
            <ul className="flex items-center gap-6 xl:gap-9">
              {NAV.map(([href, label]) => {
                const on = current === href;
                return (
                  <li key={href}>
                    <RollLink
                      href={href}
                      label={label}
                      className={`block py-3 text-label font-medium uppercase ${on ? "underline decoration-1 underline-offset-[0.45em]" : ""}`}
                      ariaCurrent={on ? "page" : undefined}
                    />
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="relative ml-auto hidden items-center px-4 lg:flex xl:px-10">
            <DashedLink href="/contact" label="Let's Talk" tone={styles.tone} />
          </div>

          <button
            ref={menuBtn}
            type="button"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen(!open)}
            className={`ml-auto flex w-[4.5rem] items-center justify-center border-l border-dashed lg:hidden ${styles.rule}`}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span aria-hidden="true" className="relative block h-4 w-6">
              <Spring tag="span" to={{ y: open ? 8 : 5, rotate: open ? 45 : 0 }} config={BURGER} className="absolute inset-x-0 top-0 block h-px bg-current" />
              <Spring tag="span" to={{ y: open ? 8 : 11, rotate: open ? -45 : 0 }} config={BURGER} className="absolute inset-x-0 top-0 block h-px bg-current" />
            </span>
          </button>
        </div>

        {/* Below lg the links move into a full navy sheet in the footer rail's language. */}
        <div
          id="site-menu"
          hidden={!open}
          className="ld-dark fixed inset-0 top-header z-40 flex flex-col justify-between overflow-y-auto bg-ground-dark px-5 pb-10 pt-8 text-on-dark lg:hidden"
        >
          <ul>
            {NAV.map(([href, label]) => {
              const Tag = isStatic(href) ? "a" : Link;
              return (
                <li key={href} className="border-t border-dashed border-rule-dark last:border-b">
                  <Tag
                    href={href}
                    onClick={() => setOpen(false)}
                    aria-current={current === href ? "page" : undefined}
                    className="flex min-h-12 items-center justify-between py-4 text-label font-medium uppercase"
                  >
                    {label}
                    <span aria-hidden="true" className="block size-2.5 rotate-90 bg-current" style={maskStyle(ARROW)} />
                  </Tag>
                </li>
              );
            })}
          </ul>
          <DashedLink href="/contact" label="Let's Talk" tone="dark" primary className="mt-8 w-full" onNavigate={() => setOpen(false)} />
        </div>
      </header>
      {!home && <div aria-hidden="true" className="h-header" />}
    </>
  );
}
