import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ApplyForm } from "@/components/jobs/apply-form";
import { destination, RoleRow } from "@/components/jobs/role-row";
import { Sections } from "@/components/jobs/sections";
import { ShareButton } from "@/components/jobs/share-button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { similarRoles, toCard, withoutPitch, type Role } from "@/lib/jobs";
import { OG_LOCALE } from "@/lib/page-meta";
import { jsonLdScript, ORG_ID, SITE_NAME, SITE_URL, siteGraph } from "@/lib/seo";
import { getRole, getRoles } from "@/server/jobs";

export const revalidate = 600;

export async function generateStaticParams() {
  return (await getRoles()).map((r) => ({ slug: r.slug }));
}

type Props = { params: Promise<{ slug: string }> };

const SUFFIX = " | MIYO Global";

/** "<Title>, <city> (<ref>) | MIYO Global", dropping the city, then trimming the title, to stay within 60 characters. The ref keeps repeated titles unique. */
function jobTitle(r: Role): string {
  const city = r.cities[0] ?? (r.workMode === "Remote" ? "Remote" : null);
  const withCity = city ? `${r.title}, ${city} (${r.ref})${SUFFIX}` : null;
  if (withCity && withCity.length <= 60) return withCity;
  const plain = `${r.title} (${r.ref})${SUFFIX}`;
  if (plain.length <= 60) return plain;
  const room = 60 - ` (${r.ref})${SUFFIX}`.length - 1;
  return `${r.title.slice(0, room).replace(/\s+\S*$/, "")}… (${r.ref})${SUFFIX}`;
}

/** Unique per role: it opens with the title and ref, then the role's own pitch, cut at a word within 158 characters. */
function jobDescription(r: Role): string {
  const where = r.cities.length ? ` in ${r.cities.slice(0, 2).join(" or ")}` : r.workMode === "Remote" ? ", remote" : "";
  const text = `${r.title} (${r.ref})${where}${r.experience ? `, ${r.experience}` : ""}. ${r.pitch}`;
  return text.length > 158 ? `${text.slice(0, 155).replace(/\s+\S*$/, "")}…` : text;
}

const descriptor = (r: Role) => `${r.level ? `${r.level} ` : ""}${r.fn.toLowerCase()} role with a confidential client of MIYO Global`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const role = await getRole((await params).slug);
  if (!role) return { title: { absolute: `Role not found${SUFFIX}` }, robots: { index: false, follow: true } };
  const title = jobTitle(role);
  const description = jobDescription(role);
  const path = `/jobs/${role.slug}`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: { title, description, type: "website", url: path, siteName: SITE_NAME, locale: OG_LOCALE },
    twitter: { card: "summary_large_image", title, description },
  };
}

/** "12 LPA - 25 LPA" → INR 1,200,000 to 2,500,000 a year. Anything else stays out of the structured data. */
function salary(ctc: string | null) {
  const m = ctc && /(\d+(?:\.\d+)?)\s*(?:lpa|l)?\s*(?:-|–|to)\s*(\d+(?:\.\d+)?)\s*(?:lpa|lakhs?)/i.exec(ctc);
  if (!m) return undefined;
  return { "@type": "MonetaryAmount", currency: "INR", value: { "@type": "QuantitativeValue", minValue: Number(m[1]) * 1e5, maxValue: Number(m[2]) * 1e5, unitText: "YEAR" } };
}

const EMPLOYMENT: Record<string, string> = { "Full-time": "FULL_TIME", Contract: "CONTRACTOR", "Contract-to-hire": "CONTRACTOR" };

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function descriptionHtml(r: Role): string {
  const block = (title: string, secs: Role["role"]) =>
    secs.length
      ? `<h2>${title}</h2>` +
        secs
          .map(
            (s) =>
              (s.heading ? `<h3>${escapeHtml(s.heading)}</h3>` : "") +
              s.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("") +
              (s.bullets.length ? `<ul>${s.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>` : ""),
          )
          .join("")
      : "";
  return `<p>${escapeHtml(r.pitch)}</p>${block("The role", [...r.role, ...r.other])}${block("What you will do", r.doing)}${block("What you will bring", r.bring)}`;
}

/** WebSite, Organization, JobPosting, WebPage, BreadcrumbList. Optional JobPosting fields appear only when the sheet states them; the sheet has no closing date, so there is no validThrough. */
function jsonLd(r: Role) {
  const url = `${SITE_URL}/jobs/${r.slug}`;
  const [site, org] = siteGraph();
  const remote = r.workMode === "Remote";
  const pay = salary(r.ctc);
  return {
    "@context": "https://schema.org",
    "@graph": [
      site,
      org,
      {
        "@type": "JobPosting",
        "@id": `${url}#job`,
        url,
        title: r.title,
        description: descriptionHtml(r),
        identifier: { "@type": "PropertyValue", name: SITE_NAME, value: r.ref },
        hiringOrganization: { "@type": "Organization", "@id": ORG_ID, name: SITE_NAME, sameAs: `${SITE_URL}/`, logo: `${SITE_URL}/images/logo-web.png` },
        ...(r.posted ? { datePosted: r.posted } : {}),
        ...(r.contract && EMPLOYMENT[r.contract] ? { employmentType: EMPLOYMENT[r.contract] } : {}),
        ...(r.cities.length ? { jobLocation: r.cities.map((c) => ({ "@type": "Place", address: { "@type": "PostalAddress", addressLocality: c, addressCountry: "IN" } })) } : {}),
        ...(remote ? { jobLocationType: "TELECOMMUTE", applicantLocationRequirements: { "@type": "Country", name: "India" } } : {}),
        ...(r.minYears !== null ? { experienceRequirements: { "@type": "OccupationalExperienceRequirements", monthsOfExperience: r.minYears * 12 } } : {}),
        ...(pay ? { baseSalary: pay } : {}),
        ...(r.openings ? { totalJobOpenings: r.openings } : {}),
        occupationalCategory: r.fn,
        directApply: true,
        mainEntityOfPage: { "@id": `${url}#webpage` },
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: jobTitle(r),
        description: jobDescription(r),
        isPartOf: { "@id": site["@id"] },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        inLanguage: "en",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Jobs", item: `${SITE_URL}/jobs` },
          { "@type": "ListItem", position: 3, name: r.title, item: url },
        ],
      },
    ],
  };
}

const posted = (d: string | null) => (d ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(d)) : null);

const STEPS: [title: string, text: string][] = [
  ["We review your CV", "A recruiter checks it against this brief, not a keyword filter."],
  ["A short call", "We confirm fit, package and notice, and answer your questions about the client."],
  ["Your go-ahead", "Only with your consent do we present you to the client."],
];

export default async function JobPage({ params }: Props) {
  const { slug } = await params;
  const [role, all] = await Promise.all([getRole(slug), getRoles()]);
  if (!role) notFound();
  const similar = similarRoles(all, role).map(toCard);
  const url = `${SITE_URL}/jobs/${role.slug}`;
  const sector = `/jobs?fn=${encodeURIComponent(role.fn)}`;
  const where = role.cities.length ? role.cities.join(", ") : destination(role).main;
  // [label, value from the sheet, honest fallback, is pay]
  const facts: [string, string | null, string, boolean?][] = [
    ["Package", role.ctc, "Shared on call", true],
    ["Location", role.cities.length || role.location ? where : null, "Shared on call"],
    ["Work mode", role.workMode, "Agreed at screening"],
    ["Contract", role.contract, "Agreed at screening"],
    ["Experience", role.experience ?? role.level, "Open to profiles"],
    ["Posted", posted(role.posted), "Live now"],
  ];
  const roleText = withoutPitch([...role.role, ...role.other], role.pitch);
  const doing = role.role.length || role.other.length ? role.doing : withoutPitch(role.doing, role.pitch);
  const pack: [string, string, boolean?][] = [
    ["Compensation", role.ctc ?? "Benchmarked to the market and shared on your first call", !!role.ctc],
    ["Engagement", role.contract ?? "Confirmed with you before any client interview"],
    ["Where you will work", role.workMode ? `${role.workMode}${role.cities.length ? `, ${where}` : ""}` : where],
    role.notice ? ["Notice period", role.notice, true] : ["Openings", role.openings ? `${role.openings} positions` : "1 or more", true],
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd(role)) }} />

      <section className="pb-12 pt-12 md:pt-16">
        <div className="frame">
          <Breadcrumbs
            items={[
              { label: "Jobs", href: "/jobs" },
              { label: role.fn, href: sector },
              { label: role.ref, mono: true },
            ]}
          />
          <div className="grid-12 mt-8">
            <div className="col-span-4 md:col-span-10">
              <p className="meta inline-flex min-h-6 items-center gap-2 rounded-control border border-ok px-2 text-ok">
                Open<span aria-hidden="true">·</span>
                <span className="num">{role.posted ? `Posted ${posted(role.posted)}` : `Ref ${role.ref}`}</span>
              </p>
              <h1 className="text-h1 mt-6">{role.title}</h1>
              <p className="lead mt-4">{descriptor(role)}</p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <ButtonLink href="#apply">Apply for this role</ButtonLink>
                <ShareButton title={`${role.title} (${role.ref}) at MIYO Global`} url={url} />
                <ButtonLink href={`/referrals?jobId=${encodeURIComponent(role.ref)}#refer`} variant="ghost">
                  Refer someone for <span className="num">₹15,000</span>
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="on-ink bg-ink text-on-ink" aria-label="Role facts">
        <dl className="frame grid grid-cols-2 gap-x-gutter md:grid-cols-3 xl:grid-cols-6">
          {facts.map(([label, value, fallback, pay]) => (
            <div key={label} className="border-t border-on-ink-rule py-6 xl:border-t-0 xl:border-l xl:pl-6 xl:first:border-l-0 xl:first:pl-0">
              <dt className="meta text-on-ink-muted">{label}</dt>
              <dd className={value ? (pay ? "num mt-2 text-accent" : "num mt-2 text-on-ink") : "mt-2 text-on-ink-muted"}>{value ?? fallback}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="frame grid-12 gap-y-16 py-section">
        <p className="col-span-4 font-display text-h3 md:col-span-9">{role.pitch}</p>

        <div className="col-span-4 grid gap-16 md:col-span-8">
          {roleText.length > 0 && (
            <section aria-labelledby="s-role">
              <h2 id="s-role" className="text-h2 mb-6">
                The role
              </h2>
              <Sections sections={roleText} hideFirstHeading />
            </section>
          )}
          {doing.length > 0 && (
            <section aria-labelledby="s-do">
              <h2 id="s-do" className="text-h2 mb-6">
                What you will do
              </h2>
              <Sections sections={doing} hideFirstHeading={doing.length === 1} />
            </section>
          )}
          {role.bring.length > 0 && (
            <section aria-labelledby="s-bring">
              <h2 id="s-bring" className="text-h2 mb-6">
                What you will bring
              </h2>
              <Sections sections={role.bring} hideFirstHeading={role.bring.length === 1} />
            </section>
          )}
          <section aria-labelledby="s-pack">
            <h2 id="s-pack" className="text-h2 mb-6">
              The package
            </h2>
            <dl className="grid gap-x-gutter sm:grid-cols-2">
              {pack.map(([label, value, mono]) => (
                <div key={label} className="border-t border-rule-strong py-4">
                  <dt className="meta text-muted">{label}</dt>
                  <dd className={mono ? "num mt-2 text-ink" : "mt-2 text-ink"}>{value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 max-w-measure text-small text-muted">MIYO Global never charges candidates a fee and never asks for original documents or payments at any stage.</p>
          </section>
        </div>

        <aside className="col-span-4 grid content-start gap-6 md:col-span-4" aria-label="Your recruiter">
          <Card>
            <h2 className="font-sans text-h3 font-medium">MIYO talent desk</h2>
            <p className="mt-1 text-small text-muted">Recruiters for this mandate, Hyderabad</p>
            <ul className="mt-6 grid gap-2 text-small">
              <li>
                <a className="link" href={`mailto:staffing@miyoglobal.com?subject=${encodeURIComponent(`${role.title} (${role.ref})`)}`}>
                  staffing@miyoglobal.com
                </a>
              </li>
              <li className="text-muted">
                Quote <span className="num text-accent-text">{role.ref}</span> when you write
              </li>
            </ul>
            <ButtonLink href={`mailto:staffing@miyoglobal.com?subject=${encodeURIComponent(`Book a call: ${role.title} (${role.ref})`)}`} variant="secondary" className="mt-6 w-full">
              Book a call
            </ButtonLink>
          </Card>
          <Card variant="plain">
            <h2 className="font-sans text-h3 font-medium">Confidential by default</h2>
            <p className="mt-2 text-small text-muted">We never share your details with a client without asking you first.</p>
          </Card>
        </aside>
      </div>

      <section id="apply" className="border-t border-rule bg-ground-cool py-section" aria-labelledby="apply-h">
        <div className="frame grid-12 gap-y-12">
          <div className="col-span-4 md:col-span-4">
            <h2 id="apply-h" className="text-h2">
              Apply for <span className="num">{role.ref}</span>
            </h2>
            <p className="mt-4 text-muted">One short form. A recruiter reads every application in full.</p>
            <ol className="mt-8 grid gap-6">
              {STEPS.map(([title, text], i) => (
                <li key={title} className="grid grid-cols-12 gap-x-4 border-t border-rule-strong pt-4">
                  <span className="num col-span-2 text-small text-accent-text">{String(i + 1).padStart(2, "0")}</span>
                  <div className="col-span-10">
                    <h3 className="text-body font-semibold">{title}</h3>
                    <p className="mt-1 text-small text-muted">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-8 border-l-2 border-accent bg-surface p-6">
              <p className="meta text-accent-text">Reply time</p>
              <p className="mt-2 text-ink">
                You hear back within <span className="num">2</span> working days, whatever the outcome.
              </p>
            </div>
          </div>
          <div className="col-span-4 md:col-span-7 md:col-start-6">
            <ApplyForm refCode={role.ref} title={role.title} />
          </div>
        </div>
      </section>

      {similar.length > 0 && (
        <section className="py-section" aria-labelledby="sim-h">
          <div className="frame">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-rule-strong pb-6">
              <h2 id="sim-h" className="text-h2">
                Similar roles
              </h2>
              <ButtonLink href={sector} variant="ghost">
                All {role.fn.toLowerCase()} roles
              </ButtonLink>
            </div>
            <ul>
              {similar.map((s) => (
                <RoleRow key={s.slug} role={s} />
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
