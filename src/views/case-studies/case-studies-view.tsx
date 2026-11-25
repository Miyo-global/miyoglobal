import { CountUp } from "@/components/motion/count-up";
import { WordRise } from "@/components/motion/word-rise";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Stat } from "@/components/ui/stat";
import { NextStep } from "../solutions/parts";
import { dossiers, intro } from "./content";

const no = (i: number) => String(i + 1).padStart(2, "0");

/** /case-studies: a contents list, then one long-form dossier per case (challenge, approach, outcome, figures). */
export function CaseStudiesView() {
  return (
    <>
      <section className="frame grid-12 gap-y-12 pb-section pt-12 md:pt-16">
        <div className="col-span-4 md:col-span-8">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Case studies" }]} />
          <Eyebrow className="mt-12">{intro.eyebrow}</Eyebrow>
          <h1 className="mt-6 max-w-heading text-h1">{intro.title}</h1>
          <p className="lead mt-8">{intro.lead}</p>
        </div>
        <nav aria-label="Dossiers" className="col-span-4 self-end md:col-span-3 md:col-start-10">
          <ol>
            {dossiers.map((d, i) => (
              <li key={d.id} className="border-t border-rule-strong">
                <a href={`#${d.id}`} className="flex min-h-12 items-baseline gap-4 py-3 text-small hover:underline">
                  <span className="num text-accent-text">{no(i)}</span>
                  <span>{d.sector}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </section>

      {dossiers.map((d, i) => (
        <article key={d.id} id={d.id} aria-labelledby={`${d.id}-title`} className={`border-t border-rule-strong py-section ${i % 2 ? "bg-ground" : "bg-surface"}`}>
          <div className="frame grid-12 gap-y-12">
            <aside className="col-span-4 md:sticky md:top-header md:self-start md:pt-6">
              <p className="meta text-muted">
                Dossier <span className="num text-accent-text">{no(i)}</span>
              </p>
              <p className="mt-2 text-small font-medium">{d.sector}</p>
              <div className="mt-8 grid gap-6">
                {d.figures.map((f) => (
                  <Stat key={f.label} size="h3" value={<CountUp value={f.value} />} label={f.label} />
                ))}
              </div>
            </aside>
            <div className="col-span-4 md:col-span-7 md:col-start-6">
              <WordRise text={d.title} id={`${d.id}-title`} className="max-w-heading text-h2" />
              <dl className="mt-12">
                {(
                  [
                    ["Challenge", d.challenge],
                    ["Approach", d.approach],
                    ["Outcome", d.outcome],
                  ] as const
                ).map(([k, v]) => (
                  <div key={k} className="grid gap-2 border-t border-rule py-6 md:grid-cols-4 md:gap-6">
                    <dt className="meta pt-1 text-muted">{k}</dt>
                    <dd className="max-w-measure text-lead md:col-span-3">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </article>
      ))}

      <div className="frame border-t border-rule py-8">
        <p className="text-small text-muted">{intro.footnote}</p>
      </div>

      <NextStep text="Start with a pilot role, a managed pod, or a GCC conversation. We come back with a plan and ramp-up timelines, fast." link={{ label: "Hire talent", href: "/contact" }} variant="primary" />
    </>
  );
}
