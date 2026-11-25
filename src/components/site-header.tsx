"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const links = [
  ["/", "Home"],
  ["/staffing-solutions", "Staffing Solutions"],
  ["/digital-solutions", "Digital Solutions"],
  ["/case-studies", "Case Studies"],
  ["/jobs", "Jobs"],
  ["/referrals", "Referrals"],
  ["/about", "About"],
  ["/blog", "Blog"],
] as const;

/** `active` pins the highlighted link (the blog passes "/blog" for every blog URL); otherwise it follows the current path. */
export function SiteHeader({ active }: { active?: string }) {
  const pathname = usePathname();
  const current = active ?? pathname;
  // The menu remembers the path it was opened on, so any navigation (logo, back button) closes it.
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;
  const setOpen = (next: boolean) => setOpenedOn(next ? pathname : null);
  const menuBtn = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpenedOn(null);
      menuBtn.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  return (
    <header>
      <div className="wrap nav">
        <Link className="brand" href="/">
          <Image src="/images/logo-web.png" alt="MIYO Global" width={89} height={48} style={{ display: "block" }} priority />
        </Link>
        <nav className={`nav-links${open ? " open" : ""}`} id="menu" aria-label="Primary">
          {links.map(([href, label]) => {
            // A job page keeps "Jobs" highlighted.
            const on = current === href || (href !== "/" && current.startsWith(`${href}/`));
            return (
              <Link key={href} href={href} className={on ? "active" : undefined} aria-current={current === href ? "page" : undefined} onClick={() => setOpen(false)}>
                {label}
              </Link>
            );
          })}
          <Link className="btn btn-gold" href="/contact" onClick={() => setOpen(false)}>Let&apos;s Talk</Link>
        </nav>
        <button ref={menuBtn} className="menu-btn" aria-label="Menu" aria-expanded={open} aria-controls="menu" onClick={() => setOpen(!open)}>
          ☰
        </button>
      </div>
    </header>
  );
}
