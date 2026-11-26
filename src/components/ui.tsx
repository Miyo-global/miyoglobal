import Link from "next/link";
import type { ReactNode } from "react";
import type { Band } from "@/data/fixtures";

const paths = {
  home: "M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z",
  match: "M8 4h12v14H8z M4 8v12h12",
  chat: "M4 5h16v11H9l-5 4z",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6",
  bell: "M6 16v-5a6 6 0 0 1 12 0v5l2 2H4z M10 21h4",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z M20 20l-4-4",
  sliders: "M4 6h16 M7 12h10 M10 18h4",
  x: "M6 6l12 12 M18 6 6 18",
  check: "M5 12.5l4.5 4.5L19 7",
  star: "M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z",
  undo: "M4 4v5h5 M4.5 9A8 8 0 1 1 6 17",
  play: "M8 5v14l11-7z",
  pause: "M8 5v14 M16 5v14",
  video: "M3 7h12v10H3z M15 10l6-3v10l-6-3",
  flip: "M4 12a8 8 0 0 1 14-5l2 2 M20 4v5h-5 M20 12a8 8 0 0 1-14 5l-2-2 M4 20v-5h5",
  cc: "M3 5h18v14H3z M10 10.2a2 2 0 1 0 0 3.6 M17 10.2a2 2 0 1 0 0 3.6",
  upload: "M12 16V4 M7 9l5-5 5 5 M4 16v4h16v-4",
  download: "M12 4v12 M7 11l5 5 5-5 M4 20h16",
  lock: "M6 11h12v10H6z M8.5 11V8a3.5 3.5 0 0 1 7 0v3",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z M9 12l2 2 4-4",
  calendar: "M4 6h16v15H4z M4 10h16 M8 3v5 M16 3v5",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 7v5l3 2",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M12 2v3 M12 19v3 M2 12h3 M19 12h3 M4.9 4.9 7 7 M17 17l2.1 2.1 M4.9 19.1 7 17 M17 7l2.1-2.1",
  chart: "M5 20v-9 M12 20V5 M19 20v-6 M3 20h18",
  users: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M2.5 20c1-3.5 3.5-5 6.5-5s5.5 1.5 6.5 5 M16 4.5a3.5 3.5 0 0 1 0 6.5 M18 15c2 .7 3 2.3 3.5 5",
  card: "M3 6h18v12H3z M3 10h18 M7 15h4",
  briefcase: "M3 8h18v12H3z M9 8V5h6v3 M3 13h18",
  kanban: "M4 4h4v16H4z M10 4h4v10h-4z M16 4h4v13h-4z",
  flag: "M5 21V4 M5 4h12l-2 4 2 4H5",
  file: "M6 3h8l4 4v14H6z M14 3v4h4",
  logout: "M15 4h4v16h-4 M10 8l-4 4 4 4 M6 12h10",
  right: "M5 12h14 M13 6l6 6-6 6",
  left: "M19 12H5 M11 6l-6 6 6 6",
  up: "M12 19V5 M6 11l6-6 6 6",
  plus: "M12 5v14 M5 12h14",
  mail: "M3 6h18v12H3z M3 7l9 6 9-6",
  eye: "M2.5 12C3.5 10 7 6 12 6s8.5 4 9.5 6c-1 2-4.5 6-9.5 6s-8.5-4-9.5-6z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  eyeOff: "M3 3l18 18 M10.6 6.1A10 10 0 0 1 12 6c5 0 8.5 4 9.5 6-.4.9-1.3 2.2-2.6 3.4 M6.3 7.6C4.5 8.8 3.2 10.5 2.5 12c1 2 4.5 6 9.5 6 1.5 0 2.9-.4 4.1-1 M9.9 9.9a3 3 0 0 0 4.2 4.2",
  menu: "M4 7h16 M4 12h16 M4 17h16",
  trash: "M4 7h16 M9 7V4h6v3 M6 7l1 13h10l1-13",
  globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M3 12h18 M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9z",
  key: "M8 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M12 11h9 M18 11v3 M21 11v2",
  mic: "M9 4a3 3 0 0 1 6 0v7a3 3 0 0 1-6 0z M5 11a7 7 0 0 0 14 0 M12 18v3",
  clip: "M20 11l-8 8a5 5 0 0 1-7-7l8-8a3.5 3.5 0 0 1 5 5l-8 8a2 2 0 0 1-3-3l7-7",
  send: "M4 12l16-8-6 16-3-7z M11 13l9-9",
  link: "M10 14a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-1 1 M14 10a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l1-1",
  alert: "M12 3l10 18H2z M12 10v5 M12 18v.5",
  info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 11v6 M12 7.5v.5",
  grid: "M4 4h7v7H4z M13 4h7v7h-7z M4 13h7v7H4z M13 13h7v7h-7z",
  list: "M8 6h12 M8 12h12 M8 18h12 M4 6h.5 M4 12h.5 M4 18h.5",
  down: "M6 9l6 6 6-6",
  building: "M4 21V5l8-2v18 M12 8h8v13 M8 8h.5 M8 12h.5 M8 16h.5 M16 12h.5 M16 16h.5 M2 21h20",
  deck: "M7 3h10v18H7z M3 6v12 M21 6v12",
  wifiOff: "M3 3l18 18 M8.5 16.5a5 5 0 0 1 7 0 M5 13a10 10 0 0 1 5-2.7 M19 13a10 10 0 0 0-2.4-1.7 M2 9.5a15 15 0 0 1 4.5-2.9 M22 9.5A15 15 0 0 0 11 5.5 M12 20h.01",
  edit: "M4 20h4L19 9l-4-4L4 16z M14 6l4 4",
  copy: "M8 8h12v12H8z M4 16V4h12",
  more: "M5 12h.5 M12 12h.5 M19 12h.5",
  ban: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M5.6 5.6l12.8 12.8",
};

export type IconName = keyof typeof paths;

export function Icon({ name, size = 20, label }: { name: IconName; size?: number; label?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label}
    >
      <path d={paths[name]} />
    </svg>
  );
}

export function Logo({ href = "/", beta = true }: { href?: string; beta?: boolean }) {
  return (
    <Link href={href} className="logo">
      <img src="/images/logo-web.png" alt="MIYO Global" width={59} height={32} />
      {beta && <span className="beta">BETA</span>}
    </Link>
  );
}

export function PageHead({ eyebrow, title, lede, children }: { eyebrow?: string; title: string; lede?: string; children?: ReactNode }) {
  return (
    <header className="page-head">
      <div className="stack" style={{ maxWidth: 720 }}>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {lede && <p className="lede">{lede}</p>}
      </div>
      {children && <div className="row">{children}</div>}
    </header>
  );
}

export function BandChip({ band }: { band: Band }) {
  const cls = band === "In-Band" ? "chip chip-navy" : band === "Stretch" ? "chip chip-gold" : "chip chip-out";
  return <span className={cls}>{band}</span>;
}

export function Ring({ value, size = 72, label }: { value: number; size?: number; label?: string }) {
  const r = size / 2 - 4;
  const c = 2 * Math.PI * r;
  return (
    <svg className="ring" width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={label ?? `Fit score ${value} out of 100`}>
      <circle className="track" cx={size / 2} cy={size / 2} r={r} />
      <circle
        className="val"
        cx={size / 2}
        cy={size / 2}
        r={r}
        strokeDasharray={c}
        strokeDashoffset={c * (1 - value / 100)}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fontSize={size / 3.4}>
        {value}
      </text>
    </svg>
  );
}

export function Meter({ value, max = 100, gold, label }: { value: number; max?: number; gold?: boolean; label: string }) {
  return (
    <div className={gold ? "meter meter-gold" : "meter"} role="meter" aria-valuemin={0} aria-valuemax={max} aria-valuenow={value} aria-label={label}>
      <span style={{ width: `${(value / max) * 100}%` }} />
    </div>
  );
}

export function Verified({ children }: { children: ReactNode }) {
  return (
    <span className="verified small">
      <Icon name="shield" size={16} />
      {children}
    </span>
  );
}

export function Sample() {
  return <p className="sample">Sample data. Fictional people and companies.</p>;
}

export function Empty({ icon, title, body, children }: { icon: IconName; title: string; body: string; children?: ReactNode }) {
  return (
    <div className="empty">
      <span className="ico">
        <Icon name={icon} size={24} />
      </span>
      <h3>{title}</h3>
      <p className="muted measure">{body}</p>
      {children}
    </div>
  );
}

export function Initials({ name }: { name: string }) {
  const init = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);
  return (
    <span className="initials" aria-hidden="true">
      {init}
    </span>
  );
}

export function StatusChip({ status }: { status: string }) {
  const s = status.toLowerCase();
  const cls = ["failed", "rejected", "suspended", "high"].includes(s)
    ? "chip chip-err"
    : ["paid", "active", "verified", "open", "resolved", "approved"].includes(s)
      ? "chip chip-navy"
      : ["pending", "pending review", "reviewing", "paused", "medium", "refunded"].includes(s)
        ? "chip chip-gold"
        : "chip";
  return <span className={cls}>{status}</span>;
}
