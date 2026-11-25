import { WordRise } from "@/components/motion/word-rise";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import type { Faq } from "./content";

/** Section heading on the 12-column grid: eyebrow in columns 1 to 4, heading and lead in 5 to 12. Below the fold, so the heading rises. */
export function SectionHead({ eyebrow, title, lead, id }: { eyebrow: string; title: string; lead?: string; id: string }) {
  return (
    <header className="grid-12 gap-y-6">
      <div className="col-span-4">
        <Eyebrow className="md:pt-3">{eyebrow}</Eyebrow>
      </div>
      <div className="col-span-4 md:col-span-8">
        <WordRise text={title} id={id} className="max-w-heading text-h2" />
        {lead && <p className="lead mt-6">{lead}</p>}
      </div>
    </header>
  );
}

const cell = "border-b border-rule py-4 pr-6 text-left align-top";

/** Real table with a caption and scoped headers; scrolls inside its own region on narrow screens, never the page. */
export function DataTable({ caption, columns, rows }: { caption: string; columns: string[]; rows: string[][] }) {
  return (
    <div role="region" aria-label={caption} tabIndex={0} className="overflow-x-auto">
      <table className="w-full min-w-reading border-collapse text-small">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c} scope="col" className={`${cell} meta border-rule-strong pb-3 font-normal text-muted`}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([first, ...rest]) => (
            <tr key={first}>
              <th scope="row" className={`${cell} font-semibold text-ink`}>
                {first}
              </th>
              {rest.map((v, i) => (
                <td key={i} className={`${cell} text-muted`}>
                  {v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Hairline FAQ list on native <details>; the same questions feed the page's FAQPage JSON-LD. */
export function FaqList({ items }: { items: Faq[] }) {
  return (
    <div className="border-b border-rule">
      {items.map((f) => (
        <details key={f.q} className="group border-t border-rule">
          <summary className="flex min-h-12 cursor-pointer items-start justify-between gap-6 py-6">
            <h3 className="text-lead font-medium">{f.q}</h3>
            <span aria-hidden="true" className="num text-h3 leading-none text-accent-text transition-transform duration-150 ease-brand group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="max-w-measure pb-8 text-muted">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export const faqJsonLd = (url: string, items: Faq[]) => ({
  "@type": "FAQPage",
  "@id": `${url}#faq`,
  mainEntityOfPage: { "@id": `${url}#webpage` },
  mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});

/** The page's one closing action: a quiet hairline row. The footer's navy slab follows, so no second navy band here. */
export function NextStep({ text, link, variant = "ghost" }: { text: string; link: { label: string; href: string }; variant?: "ghost" | "primary" }) {
  return (
    <section aria-labelledby="next-step" className="border-t border-rule">
      <div className="frame grid-12 gap-y-6 py-16">
        <h2 id="next-step" className="meta col-span-4 text-accent-text md:pt-1">
          Next step
        </h2>
        <p className="col-span-4 text-lead md:col-span-5">{text}</p>
        <div className="col-span-4 md:col-span-3 md:justify-self-end">
          <ButtonLink href={link.href} variant={variant}>
            {link.label}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
