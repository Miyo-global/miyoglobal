import Link from "next/link";
import { cx } from "./cx";

/**
 * primary: navy fill, the main action of a view (use once per view).
 * accent: gold fill on navy grounds only (footer slab, navy bands).
 * secondary: hairline outline, for a second action beside a primary.
 * ghost: text with an arrow, for tertiary links ("See all case studies").
 */
export type ButtonVariant = "primary" | "accent" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 min-h-12 font-sans text-small font-semibold tracking-normal no-underline transition-colors duration-150 ease-brand focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-progress disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  primary: "rounded-control bg-ink px-6 text-on-ink hover:bg-ink-2",
  accent: "rounded-control bg-accent px-6 text-ink hover:bg-surface",
  secondary: "rounded-control border border-ink px-6 text-ink hover:bg-ink hover:text-on-ink",
  ghost: "group px-0 text-ink underline-offset-4 hover:underline",
};

function Arrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 transition-transform duration-150 ease-brand group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 8h11M9 4l4 4-4 4" />
    </svg>
  );
}

type Common = { variant?: ButtonVariant; className?: string; children: React.ReactNode };

export function ButtonLink({ href, variant = "primary", className, children, external, ...rest }: Common & { href: string; external?: boolean } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const cls = cx(base, variants[variant], className);
  const body = (
    <>
      {children}
      {variant === "ghost" && <Arrow />}
    </>
  );
  if (external || /^(https?:|mailto:|tel:|#)/.test(href) || href.endsWith(".pdf"))
    return (
      <a href={href} className={cls} {...(external ? { target: "_blank", rel: "noopener" } : {})} {...rest}>
        {body}
      </a>
    );
  return (
    <Link href={href} className={cls} {...rest}>
      {body}
    </Link>
  );
}

export function Button({ variant = "primary", className, children, ...rest }: Common & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cx(base, variants[variant], className)} {...rest}>
      {children}
      {variant === "ghost" && <Arrow />}
    </button>
  );
}
