"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "../actions";
import { Icon, type IconName } from "../icons";

const NAV: { href: string; label: string; icon: IconName; admin?: boolean }[] = [
  { href: "/", label: "Dashboard", icon: "dashboard" },
  { href: "/posts", label: "Posts", icon: "posts" },
  { href: "/media", label: "Media", icon: "media" },
  { href: "/taxonomy", label: "Categories & Tags", icon: "tags" },
  { href: "/authors", label: "Authors", icon: "authors" },
  { href: "/users", label: "Users", icon: "users", admin: true },
  { href: "/settings", label: "Settings", icon: "settings" },
];

export function Shell({ user, canManageUsers, children }: { user: { name: string; email: string; role: string }; canManageUsers: boolean; children: React.ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const active = (href: string) => (href === "/" ? path === "/" : path === href || path.startsWith(`${href}/`));
  const initials = user.name.split(/\s+/).map((p) => p[0]).join("").slice(0, 2).toUpperCase() || "?";

  return (
    <div className={`shell${open ? " nav-open" : ""}`} onKeyDown={(e) => { if (open && e.key === "Escape") setOpen(false); }}>
      <a className="skip" href="#main">Skip to content</a>
      <aside className="sidebar" id="studio-nav">
        <Link href="/" className="sidebar-brand" onClick={() => setOpen(false)} aria-label="MIYO Studio home">
          <Image src="/images/logo-web.png" alt="" width={59} height={32} priority />
          <span>Studio</span>
        </Link>
        <nav aria-label="Studio">
          {NAV.filter((n) => !n.admin || canManageUsers).map((n) => (
            <Link key={n.href} href={n.href} className={active(n.href) ? "active" : undefined} aria-current={active(n.href) ? "page" : undefined} onClick={() => setOpen(false)}>
              <Icon name={n.icon} />
              {n.label}
            </Link>
          ))}
        </nav>
      </aside>
      {open && <button type="button" className="scrim" aria-label="Close menu" onClick={() => setOpen(false)} />}
      <div className="workspace">
        <header className="topbar">
          <button type="button" className="icon-btn menu-btn" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="studio-nav" onClick={() => setOpen((o) => !o)}>
            <Icon name={open ? "close" : "menu"} />
          </button>
          <div className="who">
            <span className="avatar" aria-hidden="true">{initials}</span>
            <span className="who-text">
              <b>{user.name}</b>
              <small>{user.email} · {user.role}</small>
            </span>
          </div>
          <form action={signOut}>
            <button className="btn secondary sm">
              <Icon name="logout" size={16} />
              Log out
            </button>
          </form>
        </header>
        <main id="main" className="content">{children}</main>
      </div>
    </div>
  );
}
