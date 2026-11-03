"use client";

import Image from "next/image";
import { useState } from "react";

const links = [
  ["/", "Home"],
  ["/staffing-solutions", "Staffing Solutions"],
  ["/digital-solutions", "Digital Solutions"],
  ["/case-studies", "Case Studies"],
  ["/referrals", "Referrals"],
  ["/about", "About"],
  ["/blog", "Blog"],
] as const;

export function SiteHeader({ active }: { active?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <header>
      <div className="wrap nav">
        <a className="brand" href="/">
          <Image src="/images/logo-web.png" alt="MIYO Global" width={89} height={48} style={{ display: "block" }} priority />
        </a>
        <nav className={`nav-links${open ? " open" : ""}`} id="menu" onKeyDown={(e) => e.key === "Escape" && setOpen(false)}>
          {links.map(([href, label]) => (
            <a key={href} href={href} className={active === href ? "active" : undefined} aria-current={active === href ? "page" : undefined} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
          <a className="btn btn-gold" href="/contact">Let&apos;s Talk</a>
        </nav>
        <button className="menu-btn" aria-label="Menu" aria-expanded={open} aria-controls="menu" onClick={() => setOpen(!open)}>
          ☰
        </button>
      </div>
    </header>
  );
}
