import { cx } from "./cx";

/** Hairline card: a 1px rule instead of a shadow. "plain" has only a top rule, for lists of cards on the grid. */
export function Card({ as: Tag = "div", variant = "box", className, children, ...rest }: { as?: "div" | "article" | "li" | "section"; variant?: "box" | "plain"; className?: string; children: React.ReactNode } & React.HTMLAttributes<HTMLElement>) {
  return (
    <Tag className={cx(variant === "box" ? "rounded-card border border-rule bg-surface p-6 md:p-8" : "border-t border-rule-strong pt-6", className)} {...rest}>
      {children}
    </Tag>
  );
}
