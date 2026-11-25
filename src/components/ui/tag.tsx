import { cx } from "./cx";

/** Hairline chip for facts on role rows and cards. "accent" marks pay. */
export function Tag({ children, tone = "plain", className }: { children: React.ReactNode; tone?: "plain" | "accent"; className?: string }) {
  return (
    <span className={cx("inline-flex min-h-6 items-center rounded-control border px-2 text-meta", tone === "accent" ? "num border-accent text-ink" : "border-rule-strong text-ink", className)}>
      {children}
    </span>
  );
}
