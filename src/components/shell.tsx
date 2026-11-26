import Link from "next/link";
import type { ReactNode } from "react";
import { signOut, switchRole } from "@/app/actions";
import { demoAccounts, type Role } from "@/data/fixtures";
import { MenuToggle, NavLink } from "./client";
import { Icon, Initials, Logo, type IconName } from "./ui";

export type NavItem = { href: string; label: string; icon: IconName; badge?: string; exact?: boolean };

const productName: Record<Role, string> = { candidate: "Candidate", recruiter: "Company", admin: "Admin console" };

export function RoleSwitch() {
  return (
    <form action={switchRole} className="stack" style={{ ["--gap" as string]: "8px" }}>
      <p className="label">Demo role</p>
      <div className="seg" style={{ width: "100%" }}>
        {(Object.keys(demoAccounts) as Role[]).map((r) => (
          <button key={r} name="role" value={r} style={{ flex: 1, minWidth: 0 }}>
            {r === "recruiter" ? "Company" : r === "candidate" ? "Cand." : "Admin"}
          </button>
        ))}
      </div>
    </form>
  );
}

export function AppShell({
  role,
  nav,
  tabs,
  title,
  topActions,
  sideExtra,
  children,
}: {
  role: Role;
  nav: NavItem[];
  tabs: NavItem[];
  title?: string;
  topActions?: ReactNode;
  sideExtra?: ReactNode;
  children: ReactNode;
}) {
  const user = demoAccounts[role];
  const links = (cls?: string) =>
    nav.map((n) => (
      <NavLink key={n.href} href={n.href} icon={n.icon} exact={n.exact} className={cls} badge={n.badge ? <span className="badge">{n.badge}</span> : undefined}>
        {n.label}
      </NavLink>
    ));
  const footer = (
    <div className="side-foot">
      {sideExtra}
      <div className="row" style={{ flexWrap: "nowrap" }}>
        <Initials name={user.name} />
        <div style={{ minWidth: 0 }}>
          <strong className="small truncate" style={{ display: "block" }}>
            {user.name}
          </strong>
          <span className="small muted truncate" style={{ display: "block" }}>
            {user.title}
          </span>
        </div>
      </div>
      <RoleSwitch />
      <form action={signOut}>
        <button className="btn btn-ghost btn-block">
          <Icon name="logout" /> Sign out
        </button>
      </form>
    </div>
  );
  return (
    <div className="shell">
      <aside className="side" aria-label={`${productName[role]} navigation`}>
        <div className="side-head">
          <Logo href={user.home} />
        </div>
        <p className="label" style={{ padding: "16px 24px 0" }}>
          {productName[role]}
        </p>
        <nav>{links("side-link")}</nav>
        {footer}
      </aside>
      <header className="top">
        <MenuToggle>
          {links("side-link")}
          {footer}
        </MenuToggle>
        <Logo href={user.home} />
        {title && <span className="top-title truncate hide-sm">{title}</span>}
        <div className="top-actions">{topActions}</div>
      </header>
      <main id="main" className="main">
        {children}
      </main>
      <nav className="tabbar" aria-label="Tabs">
        {tabs.map((t) => (
          <NavLink key={t.href} href={t.href} icon={t.icon} className="" exact={t.exact}>
            {t.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export function TopIcon({ href, icon, label, dot }: { href: string; icon: IconName; label: string; dot?: boolean }) {
  return (
    <Link href={href} className="btn btn-ghost btn-icon" aria-label={label} style={{ border: 0, position: "relative" }}>
      <Icon name={icon} />
      {dot && <span className="dot" style={{ position: "absolute", top: 10, right: 10 }} />}
    </Link>
  );
}
