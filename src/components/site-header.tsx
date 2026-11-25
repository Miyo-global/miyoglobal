"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ButtonLink } from "./ui/button";
import { cx } from "./ui/cx";

const LINKS = [
  ["/staffing-solutions", "Staffing"],
  ["/digital-solutions", "Digital"],
  ["/jobs", "Jobs"],
  ["/case-studies", "Case studies"],
  ["/about", "About"],
] as const;

/** Sticky header: logo, five links, "Refer & earn" and the one primary CTA. Paper ground; frosted with a hairline once the page scrolls. */
export function SiteHeader({ active }: { active?: string }) {
  const pathname = usePathname();
  const current = active ?? pathname;
  const [scrolled, setScrolled] = useState(false);
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;
  const menuBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpenedOn(null);
      menuBtn.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const isOn = (href: string) => current === href || current.startsWith(`${href}/`);

  return (
    <header
      className={cx(
        "sticky top-0 z-50 border-b transition-colors duration-250 ease-brand",
        scrolled || open ? "border-rule bg-ground/85 backdrop-blur-md" : "border-transparent bg-ground",
      )}
    >
      <div className="frame flex h-header items-center justify-between gap-6">
        <Link href="/" className="shrink-0" aria-label="MIYO Global home">
          <Image src="/images/logo-web.png" alt="MIYO Global" width={89} height={48} priority className="block h-12 w-auto" />
        </Link>
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {LINKS.map(([href, label]) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={current === href ? "page" : undefined}
                  className={cx(
                    "inline-flex min-h-12 items-center border-b-2 text-small font-medium transition-colors duration-150 ease-brand",
                    isOn(href) ? "border-accent text-ink" : "border-transparent text-muted hover:text-ink",
                  )}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="hidden items-center gap-6 lg:flex">
          <Link href="/referrals" className={cx("text-small font-medium underline-offset-4 hover:underline", isOn("/referrals") ? "text-ink underline" : "text-muted")}>
            Refer &amp; earn <span className="num text-ink">₹15,000</span>
          </Link>
          <ButtonLink href="/contact">Hire talent</ButtonLink>
        </div>
        <button
          ref={menuBtn}
          type="button"
          className="inline-flex size-12 items-center justify-center rounded-control border border-rule-strong lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpenedOn(open ? null : pathname)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.5">
            {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 8h16M4 16h16" />}
          </svg>
        </button>
      </div>
      {open && (
        <div id="mobile-menu" className="fixed inset-x-0 bottom-0 top-header z-40 overflow-y-auto border-t border-rule bg-ground lg:hidden">
          <nav aria-label="Primary" className="frame py-8">
            <ul className="divide-y divide-rule border-y border-rule">
              {[...LINKS, ["/blog", "Insights"] as const, ["/contact", "Contact"] as const].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} onClick={() => setOpenedOn(null)} aria-current={current === href ? "page" : undefined} className="flex min-h-16 items-center justify-between font-display text-h3">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8 grid gap-4">
              <ButtonLink href="/contact" onClick={() => setOpenedOn(null)}>
                Hire talent
              </ButtonLink>
              <ButtonLink href="/referrals" variant="secondary" onClick={() => setOpenedOn(null)}>
                Refer &amp; earn ₹15,000
              </ButtonLink>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
