import { cx } from "./cx";
import { Eyebrow } from "./eyebrow";

/**
 * Asymmetric section header on the 12-column grid: eyebrow in columns 1 to 4, heading and lead in 5 to 12 ("split"),
 * or stacked in the first 8 columns ("stack"). `as` picks the heading level so pages keep a clean outline.
 */
export function SectionHeader({
  eyebrow,
  title,
  lead,
  layout = "split",
  as: H = "h2",
  onInk,
  id,
  className,
  action,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  layout?: "split" | "stack";
  as?: "h1" | "h2";
  onInk?: boolean;
  id?: string;
  className?: string;
  action?: React.ReactNode;
}) {
  const heading = (
    <>
      <H id={id} className={cx(H === "h1" ? "text-h1" : "text-h2", "max-w-heading")}>
        {title}
      </H>
      {lead && <p className={cx("lead mt-6", onInk && "text-on-ink-muted")}>{lead}</p>}
      {action && <div className="mt-8">{action}</div>}
    </>
  );
  if (layout === "stack")
    return (
      <header className={cx("grid-12", className)}>
        <div className="col-span-4 md:col-span-8">
          {eyebrow && <Eyebrow onInk={onInk} className="mb-6">{eyebrow}</Eyebrow>}
          {heading}
        </div>
      </header>
    );
  return (
    <header className={cx("grid-12 gap-y-6", className)}>
      <div className="col-span-4 md:col-span-4">{eyebrow && <Eyebrow onInk={onInk} className="md:pt-3">{eyebrow}</Eyebrow>}</div>
      <div className="col-span-4 md:col-span-8">{heading}</div>
    </header>
  );
}
