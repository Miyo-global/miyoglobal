import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHeader } from "@/components/ui/section-header";
import { OfficeCard } from "@/views/contact/office-card";
import { OFFICES } from "@/views/contact/offices";
import { ADVISORS, APPROACH, LEADERS, type Person, VALUES } from "./content";

const INDEX = [
  ["#story", "Our approach"],
  ["#values", "What we hold to"],
  ["#leadership", "Leadership"],
  ["#presence", "Presence"],
] as const;

/** Typographic person card: a navy monogram stands in for the portrait until real photographs are supplied. */
function PersonCard({ p, className }: { p: Person; className?: string }) {
  return (
    <li className={className}>
      <article className="border-t border-rule-strong pt-6">
        <div aria-hidden="true" className="flex size-16 items-center justify-center bg-ink font-display text-h3 text-on-ink">
          {p.initials}
        </div>
        <h3 className="mt-6">{p.name}</h3>
        <p className="meta mt-2 text-accent-text">{p.role}</p>
        <p className="mt-4 max-w-measure text-muted">{p.bio}</p>
      </article>
    </li>
  );
}

export function AboutView() {
  return (
    <>
      {/* Headline Gallery masthead: the statement carries the page; no stock photography. */}
      <section className="py-section">
        <div className="frame">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
          <div className="grid-12 mt-12 gap-y-8">
            <Eyebrow className="col-span-4 md:col-span-12">Who we are</Eyebrow>
            <h1 className="display col-span-4 md:col-span-10">Operators who have lived it at scale</h1>
            <p className="lead col-span-4 md:col-span-6 md:col-start-7">
              MIYO Global is an enterprise staffing and digital delivery company founded by veteran operators. We know the process because we have run it in leading organisations.
            </p>
          </div>
          <nav aria-label="On this page" className="mt-16 border-t border-rule">
            <ol className="grid-12">
              {INDEX.map(([href, label], i) => (
                <li key={href} className="col-span-2 md:col-span-3">
                  <Link href={href} className="flex min-h-12 items-baseline gap-3 pt-4 text-small text-ink hover:underline">
                    <span className="num text-accent-text">{String(i + 1).padStart(2, "0")}</span>
                    {label}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </section>

      <section id="story" aria-labelledby="story-title" className="border-t border-rule py-section">
        <div className="frame">
          <SectionHeader
            id="story-title"
            eyebrow="Our approach"
            title="We carry the delivery"
            lead="Enterprises and staffing partners hand us their hardest roles and their digital operations. We find the right people, prove them out, and put them to work inside your process. You keep the client and the brand."
          />
          <ul className="grid-12 mt-12">
            {APPROACH.map((a) => (
              <li key={a} className="col-span-4 border-t border-rule py-4 text-ink md:col-span-4">
                {a}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="values" aria-labelledby="values-title" className="bg-ground-cool py-section">
        <div className="frame">
          <SectionHeader id="values-title" eyebrow="Principles" title="What we hold to" />
          <ol className="mt-12 border-b border-rule">
            {VALUES.map((v, i) => (
              <li key={v.title} className="grid-12 gap-y-2 border-t border-rule py-6">
                <span className="num col-span-4 text-accent-text md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="col-span-4 md:col-span-4 md:col-start-5">{v.title}</h3>
                <p className="col-span-4 text-muted md:col-span-4">{v.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="leadership" aria-labelledby="leadership-title" className="py-section">
        <div className="frame">
          <SectionHeader id="leadership-title" eyebrow="Leadership" title="The people accountable for delivery" />
          <p className="meta mt-16 text-muted">Leadership team</p>
          <ul aria-label="Leadership team" className="grid-12 mt-6 gap-y-12">
            {LEADERS.map((p) => (
              <PersonCard key={p.name} p={p} className="col-span-4 md:col-span-6 lg:col-span-4" />
            ))}
          </ul>
          <p className="meta mt-16 text-muted">Domain advisors</p>
          <ul aria-label="Domain advisors" className="grid-12 mt-6 gap-y-12">
            {ADVISORS.map((p) => (
              <PersonCard key={p.name} p={p} className="col-span-4 md:col-span-6 lg:col-span-4" />
            ))}
          </ul>
        </div>
      </section>

      <section id="presence" aria-labelledby="presence-title" className="border-t border-rule py-section">
        <div className="frame">
          <SectionHeader id="presence-title" eyebrow="Our presence" title="Two delivery hubs, global reach" />
          <div className="grid-12 mt-12 gap-y-12">
            {OFFICES.map((o, i) => (
              <OfficeCard key={o.id} office={o} className={i === 0 ? "col-span-4 md:col-span-4 md:col-start-5" : "col-span-4 md:col-span-4"} />
            ))}
          </div>
          <div className="grid-12 mt-16">
            <div className="col-span-4 border-l-2 border-accent pl-6 md:col-span-8 md:col-start-5">
              <h3>Full compliance shield.</h3>
              <p className="mt-3 max-w-measure text-muted">
                Contract Labour (R&amp;A) Act, EPF / ESI, Shop &amp; Establishment. India: Miyo Global Private Limited. UAE: Prime Assets Education &amp; Training Ltd., operating as Prime Learning.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
