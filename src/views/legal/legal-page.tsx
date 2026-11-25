import Link from "next/link";
import { Fragment } from "react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Eyebrow } from "@/components/ui/eyebrow";

export type LegalSection = { id: string; title: string; body: React.ReactNode };

/** Quiet long-form template for the legal pages: crumb, h1, last-updated meta, a contents list (4 columns) beside the prose (8 columns). */
export function LegalPage({ crumb, title, lead, updated, sections }: { crumb: string; title: string; lead: string; updated: string; sections: LegalSection[] }) {
  return (
    <section className="py-section">
      <div className="frame">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: crumb }]} />
        <header className="grid-12 mt-12 gap-y-6">
          <Eyebrow className="col-span-4 md:col-span-12">Legal</Eyebrow>
          <h1 className="col-span-4 max-w-heading md:col-span-8">{title}</h1>
          <p className="lead col-span-4 md:col-span-8">{lead}</p>
          <p className="meta col-span-4 text-muted md:col-span-8">Last updated: {updated}</p>
        </header>

        <div className="grid-12 mt-4 gap-y-12">
          <nav aria-labelledby="legal-contents" className="col-span-4 md:col-span-4">
            <div className="pt-12 md:sticky md:top-header">
              <h2 id="legal-contents" className="meta text-muted">
                Contents
              </h2>
              <ol className="mt-4 border-b border-rule">
                {sections.map((s) => (
                  <li key={s.id} className="border-t border-rule">
                    <Link href={`#${s.id}`} className="flex min-h-12 items-center py-2 text-small text-ink hover:underline">
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </nav>
          <div className="prose col-span-4 md:col-span-8">
            {sections.map((s) => (
              <Fragment key={s.id}>
                <h2 id={s.id}>{s.title}</h2>
                {s.body}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
