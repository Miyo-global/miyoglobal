import { Tabs } from "@/components/motion/tabs";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SERVICES } from "@/lib/pages";
import { COMPLIANCE, type ServiceDetail, type Solution } from "./content";
import { DataTable, FaqList, NextStep, SectionHead } from "./parts";

function External({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener" className="link font-medium text-ink">
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

function LineLink({ link }: { link: { label: string; href: string } }) {
  return /^https?:/.test(link.href) ? <External href={link.href}>{link.label}</External> : <ButtonLink href={link.href} variant="ghost">{link.label}</ButtonLink>;
}

function Panel({ d }: { d: ServiceDetail }) {
  return (
    <div className="grid-12 gap-y-8">
      <div className="col-span-4 md:col-span-5">
        <h3>{d.title}</h3>
        <p className="mt-4 text-muted">{d.what}</p>
        {d.link && (
          <p className="mt-6">
            <LineLink link={d.link} />
          </p>
        )}
      </div>
      <div className="col-span-4 md:col-span-6 md:col-start-7">
        <dl className="grid gap-6">
          <div className="border-t border-rule-strong pt-4">
            <dt className="meta text-muted">Who it is for</dt>
            <dd className="mt-2">{d.who}</dd>
          </div>
          <div className="border-t border-rule-strong pt-4">
            <dt className="meta text-muted">How it is delivered</dt>
            <dd className="mt-2">{d.how}</dd>
          </div>
          {d.points && (
            <div className="border-t border-rule-strong pt-4">
              <dt className="meta text-muted">What it covers</dt>
              <dd className="mt-2">
                <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
                  {d.points.map((p) => (
                    <li key={p} className="border-l border-accent pl-3 text-small">
                      {p}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}

/** Template for /staffing-solutions and /digital-solutions: head, service explorer, delivery table, compliance, FAQ, next step. */
export function SolutionPage({ s }: { s: Solution }) {
  const lines = SERVICES.filter(([page]) => page === s.path).map(([, id, name, line]) => ({ id, name, line, d: s.services[id] }));
  return (
    <>
      <section className="frame grid-12 gap-y-12 pb-section pt-12 md:pt-16">
        <div className="col-span-4 md:col-span-8">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: s.crumb }]} />
          <Eyebrow className="mt-12">{s.eyebrow}</Eyebrow>
          <h1 className="mt-6 max-w-heading text-h1">{s.title}</h1>
          <p className="lead mt-8">{s.lead}</p>
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
            <ButtonLink href={s.primary.href}>{s.primary.label}</ButtonLink>
            <ButtonLink href={s.secondary.href} variant="ghost">
              {s.secondary.label}
            </ButtonLink>
          </div>
        </div>
        <dl className="col-span-4 self-end md:col-span-3 md:col-start-10">
          {s.facts.map((f) => (
            <div key={f.label} className="border-t border-rule-strong py-4">
              <dt className="meta text-muted">{f.label}</dt>
              <dd className="mt-1 text-small text-ink">{f.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="services-title" className="border-t border-rule bg-surface py-section">
        <div className="frame">
          <SectionHead eyebrow="Service lines" title={s.servicesTitle} lead={s.servicesLead} id="services-title" />
          {/* Always-visible index: it carries the anchor ids (#gcc, #ai-data ...) the footer and home page link to. */}
          <ol className="mt-16">
            {lines.map((l, i) => (
              <li key={l.id} id={l.id} className="grid-12 gap-y-1 border-t border-rule py-4">
                <span className="num col-span-1 text-small text-accent-text">{String(i + 1).padStart(2, "0")}</span>
                <span className="col-span-3 font-medium md:col-span-3">{l.name}</span>
                <span className="col-span-4 text-small text-muted md:col-span-8">
                  {l.line}
                  {l.d.link && /^https?:/.test(l.d.link.href) && (
                    <>
                      {" "}
                      <External href={l.d.link.href}>{l.d.link.label}</External>
                    </>
                  )}
                </span>
              </li>
            ))}
          </ol>
          <Tabs className="mt-16" label={`${s.crumb} service lines`} items={lines.map((l) => ({ id: l.id, label: l.name, content: <Panel d={l.d} /> }))} />
        </div>
      </section>

      <section id={s.table.id} aria-labelledby={`${s.table.id}-title`} className="border-t border-rule py-section">
        <div className="frame">
          <SectionHead eyebrow={s.table.eyebrow} title={s.table.title} lead={s.table.lead} id={`${s.table.id}-title`} />
          <div className="mt-16">
            <DataTable caption={s.table.caption} columns={s.table.columns} rows={s.table.rows} />
          </div>
          {s.table.note && (
            <p className="mt-8 max-w-measure text-small text-muted">
              {s.table.note.text} See <External href={s.table.note.link.href}>{s.table.note.link.label}</External>.
            </p>
          )}
        </div>
      </section>

      <section aria-labelledby="compliance-title" className="border-t border-rule bg-ground-cool py-section">
        <div className="frame">
          <SectionHead eyebrow={COMPLIANCE.eyebrow} title={COMPLIANCE.title} lead={COMPLIANCE.lead} id="compliance-title" />
          <div className="mt-16">
            <DataTable caption={COMPLIANCE.caption} columns={COMPLIANCE.columns} rows={COMPLIANCE.rows} />
          </div>
        </div>
      </section>

      <section id="faq" aria-labelledby="faq-title" className="border-t border-rule py-section">
        <div className="frame grid-12 gap-y-12">
          <div className="col-span-4">
            <Eyebrow>Questions</Eyebrow>
            <h2 id="faq-title" className="mt-6 text-h2">
              Frequently asked
            </h2>
          </div>
          <div className="col-span-4 md:col-span-8">
            <FaqList items={s.faq} />
          </div>
        </div>
      </section>

      <NextStep text={s.next.text} link={s.next.link} />
    </>
  );
}
