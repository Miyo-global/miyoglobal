import { cx } from "./cx";

/** Mono, uppercase, tracked label above a heading. It names the section; it never repeats the heading. */
export function Eyebrow({ children, className, onInk }: { children: React.ReactNode; className?: string; onInk?: boolean }) {
  return <p className={cx("meta", onInk ? "text-on-ink-muted" : "text-accent-text", className)}>{children}</p>;
}
