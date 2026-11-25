import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { SITE_NAME } from "@/lib/seo";

export const notFoundMetadata: Metadata = {
  title: { absolute: `Page not found | ${SITE_NAME}` },
  robots: { index: false, follow: false },
};

const LINKS = [
  ["/", "Home"],
  ["/jobs", "Open jobs"],
  ["/contact", "Contact"],
  ["/blog", "Insights"],
] as const;

/** 404 body, shared by the site and blog not-found pages (each supplies its own layout). */
export function NotFoundView() {
  return (
    <section className="py-section">
      <div className="frame">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Not found" }]} />
        <div className="grid-12 mt-12 gap-y-6">
          <p className="num col-span-4 text-h2 text-accent-text md:col-span-12">404</p>
          <h1 className="col-span-4 max-w-heading md:col-span-8">Page not found</h1>
          <p className="lead col-span-4 md:col-span-7">The page you were looking for does not exist or has moved.</p>
        </div>
        <nav aria-label="Where to next" className="grid-12 mt-16">
          <ul className="col-span-4 border-b border-rule md:col-span-6">
            {LINKS.map(([href, label]) => (
              <li key={href} className="border-t border-rule">
                <Link href={href} className="group flex min-h-12 items-center justify-between py-3 text-body text-ink hover:underline">
                  {label}
                  <span aria-hidden="true" className="text-muted transition-transform duration-150 ease-brand group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
