import { cx } from "./cx";

/** A figure and what it counts. Values are strings so "2 wks" and "95%+" stay exactly as published. */
export function Stat({ value, label, onInk, className, size = "h2" }: { value: React.ReactNode; label: string; onInk?: boolean; className?: string; size?: "h2" | "h3" }) {
  return (
    <div className={cx("border-t pt-4", onInk ? "border-on-ink-rule" : "border-rule-strong", className)}>
      <p className={cx("num", size === "h2" ? "text-h2" : "text-h3", onInk ? "text-accent" : "text-ink")}>{value}</p>
      <p className={cx("mt-2 text-small", onInk ? "text-on-ink-muted" : "text-muted")}>{label}</p>
    </div>
  );
}
