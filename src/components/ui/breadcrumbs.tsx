import Link from "next/link";
import { cx } from "./cx";

export type Crumb = { label: string; href?: string; mono?: boolean };

/** Visible breadcrumb trail. The matching BreadcrumbList JSON-LD comes from the page's structured data. */
export function Breadcrumbs({ items, onInk, className }: { items: Crumb[]; onInk?: boolean; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cx("text-small", onInk ? "text-on-ink-muted" : "text-muted", className)}>
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden="true">/</span>}
              {last || !c.href ? (
                <span aria-current={last ? "page" : undefined} className={cx(c.mono && "num", last && (onInk ? "text-on-ink" : "text-ink"))}>
                  {c.label}
                </span>
              ) : (
                <Link href={c.href} className="hover:underline">
                  {c.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
