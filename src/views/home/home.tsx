import Link from "next/link";
import { CountUp } from "@/components/motion/count-up";
import { Tabs } from "@/components/motion/tabs";
import { WordRise } from "@/components/motion/word-rise";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { LogoStrip } from "@/components/ui/logo-strip";
import { SectionHeader } from "@/components/ui/section-header";
import { Stat } from "@/components/ui/stat";
import type { Role } from "@/lib/jobs";
import { az, contact, credentials, faqs, hero, leaders, models, offices, process, proof, referral, services } from "./content";
import { PresenceVisual } from "./presence-visual";

type Post = { slug: string; title: string; publishedAt: Date | null };

const refNo = (ref: string) => Number(/\d+/.exec(ref)?.[0] ?? 0);
const day = (d: Date | null) => (d ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" }).format(d) : "");

function Mandates({ roles }: { roles: Role[] }) {
  const latest = [...roles].sort((a, b) => refNo(b.ref) - refNo(a.ref)).slice(0, 3);
  return (
    <aside aria-labelledby="mandates-h" className="on-ink rounded-card bg-ink p-6 text-on-ink md:p-8">
      <div className="flex items-baseline justify-between gap-4 border-b border-on-ink-rule pb-6">
        <h2 id="mandates-h" className="meta font-sans text-on-ink-muted">
          Open mandates
        </h2>
        <span className="meta flex items-center gap-2 text-on-ink-muted">
          <span aria-hidden="true" className="size-2 rounded-full bg-accent" />
          Live
        </span>
      </div>
      {roles.length ? (
        <>
          <p className="mt-6 flex items-baseline gap-4">
            <span className="num text-display text-accent">{roles.length}</span>
            <span className="text-small text-on-ink-muted">roles we are hiring for now</span>
          </p>
          <ul className="mt-6 divide-y divide-on-ink-rule border-y border-on-ink-rule">
            {latest.map((r) => (
              <li key={r.slug}>
                <Link href={`/jobs/${r.slug}`} className="group grid min-h-12 grid-cols-4 gap-4 py-4">
                  <span className="num col-span-1 text-small text-accent">{r.ref}</span>
                  <span className="col-span-3">
                    <span className="block text-small font-medium group-hover:underline">{r.title}</span>
                    <span className="block text-small text-on-ink-muted">{r.cities[0] ?? (r.workMode === "Remote" ? "Remote" : r.fn)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <ButtonLink href="/jobs" variant="ghost" className="mt-6 text-on-ink">
            See all {roles.length} open roles
          </ButtonLink>
        </>
      ) : (
        <>
          <p className="mt-6 text-small text-on-ink-muted">Our live roles are refreshing. Browse the board or send your CV to staffing@miyoglobal.com.</p>
          <ButtonLink href="/jobs" variant="ghost" className="mt-6 text-on-ink">
            Browse open roles
          </ButtonLink>
        </>
      )}
    </aside>
  );
}

function Hero({ roles }: { roles: Role[] }) {
  return (
    <section className="border-b border-rule">
      <div className="frame grid-12 gap-y-12 py-16 md:py-24">
        <div className="col-span-4 md:col-span-7">
          <Eyebrow>{hero.eyebrow}</Eyebrow>
          <h1 className="display mt-6 max-w-heading">{hero.title}</h1>
          <p className="lead mt-8">{hero.lead}</p>
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
            <ButtonLink href="/contact">Hire talent</ButtonLink>
            <ButtonLink href="/staffing-solutions" variant="ghost">
              Explore staffing solutions
            </ButtonLink>
          </div>
        </div>
        <div className="col-span-4 md:col-span-5 lg:col-span-4 lg:col-start-9">
          <Mandates roles={roles} />
        </div>
      </div>
      <dl className="frame grid-12 gap-y-6 pb-16">
        {hero.stats.map((s) => (
          <div key={s.label} className="col-span-4 flex flex-col border-t border-rule-strong pt-4 md:col-span-4">
            <dt className="text-small text-muted">{s.label}</dt>
            <dd className="num order-first text-h2">{s.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function Models() {
  return (
    <section aria-labelledby="models-h" className="frame py-section">
      <SectionHeader eyebrow="Engagement models" title={<WordRise as="span" text="Models that fit how you operate" />} id="models-h" lead="Four ways to work with us, from a single embedded specialist to a centre we build, run and hand over." />
      <ol className="mt-16 border-b border-rule-strong">
        {models.map((m, i) => (
          <li key={m.name} className="grid-12 gap-y-2 border-t border-rule-strong py-8">
            <span className="num col-span-1 text-h3 text-accent-text md:col-span-2">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="col-span-3 md:col-span-4">{m.name}</h3>
            <p className="col-span-4 text-muted md:col-span-6">{m.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Services() {
  return (
    <section aria-labelledby="services-h" className="border-t border-rule py-section">
      <div className="frame">
        <SectionHeader eyebrow="What we do" title={<WordRise as="span" text="Two service lines, one accountable partner" />} id="services-h" />
        <div className="grid-12 mt-16">
          <Tabs
            label="Service lines"
            className="col-span-4 md:col-span-12"
            items={services.map((s) => ({
              id: s.id,
              label: s.name,
              content: (
                <div className="grid-12 gap-y-12">
                  <div className="col-span-4 md:col-span-4">
                    <p className="lead">{s.text}</p>
                    <dl className="mt-8 grid gap-4">
                      {s.facts.map((f) => (
                        <div key={f.label} className="border-t border-rule pt-3">
                          <dt className="meta text-muted">{f.label}</dt>
                          <dd className="mt-1 text-small">{f.value}</dd>
                        </div>
                      ))}
                    </dl>
                    <ButtonLink href={s.cta.href} variant="ghost" className="mt-8">
                      {s.cta.label}
                    </ButtonLink>
                  </div>
                  <ul className="col-span-4 grid gap-x-8 sm:grid-cols-2 md:col-span-7 md:col-start-6">
                    {s.cells.map((c) => (
                      <li key={c.title} className="border-t border-rule-strong py-6">
                        <h3 className="text-h3">
                          <Link href={c.href} className="hover:underline">
                            {c.title}
                          </Link>
                        </h3>
                        <p className="mt-2 text-small text-muted">{c.text}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ),
            }))}
          />
        </div>
        <details className="mt-16 border-y border-rule">
          <summary className="flex min-h-12 cursor-pointer items-center justify-between py-4 text-small font-semibold">
            Every service, A to Z
            <span aria-hidden="true" className="num text-accent-text">
              {az.length}
            </span>
          </summary>
          <ul className="columns-1 gap-8 pb-8 sm:columns-2 lg:columns-3">
            {az.map(([label, href]) => (
              <li key={label} className="break-inside-avoid">
                <Link href={href} className="inline-flex min-h-12 items-center text-small hover:underline">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </details>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section aria-labelledby="process-h" className="border-t border-rule py-section">
      <div className="frame">
        <SectionHeader eyebrow="How we deliver" title={<WordRise as="span" text="Sourced, vetted, deployed, managed" />} id="process-h" lead="One named delivery lead owns every step, from the first shortlist to the weekly report." />
        <ol className="grid-12 mt-16 gap-y-12">
          {process.map((p, i) => (
            <li key={p.name} className="col-span-4 border-t border-ink pt-6 md:col-span-6 lg:col-span-3">
              <span className="num text-h1 text-accent-text">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-6">{p.name}</h3>
              <p className="mt-2 text-muted">{p.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Proof() {
  return (
    <section aria-labelledby="proof-h" className="border-t border-rule py-section">
      <div className="frame">
        <SectionHeader
          eyebrow="Proof"
          title={<WordRise as="span" text="Delivered, not promised" />}
          id="proof-h"
          action={
            <ButtonLink href="/case-studies" variant="ghost">
              Read the case studies
            </ButtonLink>
          }
        />
        <dl className="grid-12 mt-16 gap-y-8">
          {proof.counters.map((c) => (
            <div key={c.label} className="col-span-2 flex flex-col border-t border-ink pt-4 md:col-span-3">
              <dt className="text-small text-muted">{c.label}</dt>
              <dd className="num order-first text-h1">
                <CountUp value={c.value} />
              </dd>
            </div>
          ))}
        </dl>
        <div className="grid-12 mt-16 gap-y-12">
          {proof.dossiers.map((d) => (
            <Card key={d.sector} as="article" variant="plain" className="col-span-4 md:col-span-6">
              <Eyebrow>{d.sector}</Eyebrow>
              <p className="mt-4 max-w-measure text-lead">{d.text}</p>
              <div className="mt-8 grid grid-cols-3 gap-4">
                {d.figures.map((f) => (
                  <Stat key={f.label} value={f.value} label={f.label} size="h3" />
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Presence() {
  return (
    <section aria-labelledby="presence-h" className="on-ink bg-ink py-section text-on-ink">
      <div className="frame grid-12 gap-y-12">
        <div className="col-span-4 md:col-span-5">
          <Eyebrow onInk>Our presence</Eyebrow>
          <h2 id="presence-h" className="mt-6 max-w-heading">
            Two delivery hubs, one route
          </h2>
          <p className="lead mt-6">Operations run from Hyderabad, with delivery across Bangalore, Pune, Noida and Chennai, and a UAE office in Ras Al Khaimah.</p>
          <div className="mt-12 grid gap-8">
            {offices.map((o) => (
              <div key={o.city} className="border-t border-on-ink-rule pt-4">
                <p className="meta text-on-ink-muted">{o.region}</p>
                <h3 className="mt-2">{o.city}</h3>
                <address className="mt-2 text-small not-italic text-on-ink-muted">{o.address}</address>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-4 md:col-span-7">
          <PresenceVisual />
        </div>
      </div>
    </section>
  );
}

function Leadership() {
  return (
    <section aria-labelledby="leaders-h" className="py-section">
      <div className="frame">
        <SectionHeader
          eyebrow="Leadership"
          title={<WordRise as="span" text="The people accountable for delivery" />}
          id="leaders-h"
          action={
            <ButtonLink href="/about#leadership" variant="ghost">
              Meet the full team
            </ButtonLink>
          }
        />
        <ul className="grid-12 mt-16 gap-y-12">
          {leaders.map((l) => (
            <li key={l.name} className="col-span-4 md:col-span-4">
              <div aria-hidden="true" className="flex aspect-4/3 items-end bg-ink p-6">
                <span className="font-display text-h1 text-accent">{l.initials}</span>
              </div>
              <h3 className="mt-6">{l.name}</h3>
              <p className="meta mt-2 text-accent-text">{l.role}</p>
              <p className="mt-4 text-small text-muted">{l.bio}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Referral() {
  return (
    <section aria-labelledby="referral-h" className="border-t border-rule py-section">
      <div className="frame grid-12 gap-y-8">
        <p className="num col-span-4 text-display md:col-span-5">₹15,000</p>
        <div className="col-span-4 md:col-span-7">
          <h2 id="referral-h">{referral.title}</h2>
          <p className="lead mt-6">{referral.text}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <ButtonLink href="/referrals" variant="secondary">
              Refer a candidate
            </ButtonLink>
            <ButtonLink href="/jobs" variant="ghost">
              Browse open roles
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section aria-labelledby="faq-h" id="faq" className="border-t border-rule py-section">
      <div className="frame grid-12 gap-y-8">
        <div className="col-span-4 md:col-span-4">
          <Eyebrow>Questions</Eyebrow>
          <h2 id="faq-h" className="mt-6">
            What clients ask first
          </h2>
        </div>
        <div className="col-span-4 border-b border-rule-strong md:col-span-8">
          {faqs.map(([q, a]) => (
            <details key={q} className="group border-t border-rule-strong">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-4 font-medium">
                {q}
                <span aria-hidden="true" className="num text-h3 text-accent-text transition-transform duration-150 ease-brand group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="max-w-measure pb-6 text-muted">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Insights({ posts }: { posts: Post[] }) {
  if (!posts.length) return null;
  return (
    <section aria-labelledby="insights-h" className="border-t border-rule py-section">
      <div className="frame">
        <SectionHeader
          eyebrow="Insights"
          title="From the MIYO Journal"
          id="insights-h"
          action={
            <ButtonLink href="/blog" variant="ghost">
              All articles
            </ButtonLink>
          }
        />
        <ul className="mt-16 border-b border-rule-strong">
          {posts.map((p) => (
            <li key={p.slug} className="grid-12 gap-y-2 border-t border-rule-strong py-6">
              <time className="meta col-span-4 pt-2 text-muted md:col-span-3" dateTime={p.publishedAt?.toISOString()}>
                {day(p.publishedAt)}
              </time>
              <h3 className="col-span-4 md:col-span-9">
                <Link href={`/blog/${p.slug}`} className="hover:underline">
                  {p.title}
                </Link>
              </h3>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section aria-labelledby="contact-h" className="on-ink bg-ink text-on-ink">
      <div className="frame grid-12 gap-y-8 py-section">
        <div className="col-span-4 md:col-span-7">
          <h2 id="contact-h">{contact.title}</h2>
          <p className="lead mt-6">{contact.text}</p>
        </div>
        <div className="col-span-4 flex flex-col justify-end gap-4 md:col-span-4 md:col-start-9">
          <ButtonLink href="/contact" variant="accent">
            Hire talent
          </ButtonLink>
          <ButtonLink href="mailto:staffing@miyoglobal.com" variant="ghost" className="text-on-ink">
            staffing@miyoglobal.com
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

export function HomeView({ roles, posts }: { roles: Role[]; posts: Post[] }) {
  return (
    <>
      <Hero roles={roles} />
      <LogoStrip label="Compliant under" items={credentials} />
      <Models />
      <Services />
      <Process />
      <Proof />
      <Presence />
      <Leadership />
      <Referral />
      <Faq />
      <Insights posts={posts} />
      <Contact />
    </>
  );
}
