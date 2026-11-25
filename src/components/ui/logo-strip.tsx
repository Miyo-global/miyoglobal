import { cx } from "./cx";

/**
 * A row of credentials between hairlines. Pass real client logos as `logos` once they are cleared for use; until then the
 * strip shows the compliance credentials MIYO Global works under, which are real and checkable.
 */
export function LogoStrip({ label, items, className }: { label: string; items: string[]; className?: string }) {
  return (
    <section aria-label={label} className={cx("border-y border-rule", className)}>
      <div className="frame grid-12 items-center gap-y-4 py-6">
        <p className="meta col-span-4 text-muted md:col-span-3">{label}</p>
        <ul className="col-span-4 flex flex-wrap gap-x-8 gap-y-3 md:col-span-9">
          {items.map((i) => (
            <li key={i} className="text-small font-medium text-ink">
              {i}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
