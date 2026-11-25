import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ApplyForm } from "@/components/jobs/apply-form";
import { destination, RoleChips } from "@/components/jobs/role-row";
import { Sections } from "@/components/jobs/sections";
import { ShareButton } from "@/components/jobs/share-button";
import { similarRoles, toCard, withoutPitch, type Role } from "@/lib/jobs";
import { OG_LOCALE } from "@/lib/page-meta";
import { jsonLdScript, ORG_ID, SITE_NAME, SITE_URL, siteGraph } from "@/lib/seo";
import { getRole, getRoles } from "@/server/jobs";

export const revalidate = 300;

export async function generateStaticParams() {
  return (await getRoles()).map((r) => ({ slug: r.slug }));
}

type Props = { params: Promise<{ slug: string }> };

const SUFFIX = " | MIYO Global";

/** "<Title> (<ref>) | MIYO Global", with the city when it fits in 60 characters. The ref keeps repeated titles unique. */
function jobTitle(r: Role): string {
  const city = r.cities[0] ?? (r.workMode === "Remote" ? "Remote" : null);
  const withCity = city ? `${r.title}, ${city} (${r.ref})${SUFFIX}` : null;
  if (withCity && withCity.length <= 60) return withCity;
  const plain = `${r.title} (${r.ref})${SUFFIX}`;
  if (plain.length <= 60) return plain;
  const room = 60 - ` (${r.ref})${SUFFIX}`.length - 1;
  return `${r.title.slice(0, room).replace(/\s+\S*$/, "")}… (${r.ref})${SUFFIX}`;
}

function jobDescription(r: Role): string {
  const where = r.cities.length ? ` in ${r.cities.slice(0, 2).join(" or ")}` : r.workMode === "Remote" ? ", remote" : "";
  const lead = `${r.title} (${r.ref})${where}${r.experience ? `, ${r.experience}` : ""}. `;
  const text = lead + r.pitch;
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

function jsonLd(r: Role) {
  const url = `${SITE_URL}/jobs/${r.slug}`;
  const [site, org] = siteGraph();
  const remote = r.workMode === "Remote";
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
        hiringOrganization: { "@type": "Organization", "@id": ORG_ID, name: SITE_NAME, sameAs: "https://www.miyoglobal.com/", logo: "https://www.miyoglobal.com/images/logo-web.png" },
        ...(r.posted ? { datePosted: r.posted } : {}),
        ...(r.contract && EMPLOYMENT[r.contract] ? { employmentType: EMPLOYMENT[r.contract] } : {}),
        ...(r.cities.length
          ? { jobLocation: r.cities.map((c) => ({ "@type": "Place", address: { "@type": "PostalAddress", addressLocality: c, addressCountry: "IN" } })) }
          : {}),
        ...(remote ? { jobLocationType: "TELECOMMUTE", applicantLocationRequirements: { "@type": "Country", name: "India" } } : {}),
        ...(r.minYears !== null ? { experienceRequirements: { "@type": "OccupationalExperienceRequirements", monthsOfExperience: r.minYears * 12 } } : {}),
        ...(salary(r.ctc) ? { baseSalary: salary(r.ctc) } : {}),
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

const posted = (d: string | null) =>
  d ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(d)) : null;

export default async function JobPage({ params }: Props) {
  const { slug } = await params;
  const [role, all] = await Promise.all([getRole(slug), getRoles()]);
  if (!role) notFound();
  const similar = similarRoles(all, role);
  const url = `${SITE_URL}/jobs/${role.slug}`;
  const dest = destination(role);
  const where = role.cities.length ? role.cities.join(", ") : dest.main;
  const facts: [label: string, value: string | null, fallback: string, gold?: boolean][] = [
    ["Package", role.ctc, "Shared on call", true],
    ["Location", role.cities.length || role.location ? where : null, "Shared on call"],
    ["Work mode", role.workMode, "Agreed at screening"],
    ["Contract", role.contract, "Agreed at screening"],
    ["Experience", role.experience ?? role.level, "Open to profiles"],
    ["Posted", posted(role.posted), "Live now"],
  ];
  const roleText = withoutPitch([...role.role, ...role.other], role.pitch);
  const doing = role.role.length || role.other.length ? role.doing : withoutPitch(role.doing, role.pitch);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd(role)) }} />
      <div className="ed-wrap">
        <nav className="ed-crumb" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link href="/jobs">Jobs</Link>
            </li>
            <li>
              <Link href={`/jobs?fn=${encodeURIComponent(role.fn)}`}>{role.fn}</Link>
            </li>
            <li aria-current="page" className="num">{role.ref}</li>
          </ol>
        </nav>

        <div className="jp-head">
          <p className="pill">
            Open <span className="num">{role.posted ? `posted ${posted(role.posted)}` : `ref ${role.ref}`}</span>
          </p>
          <h1>{role.title}</h1>
          <p className="jp-desc">{descriptor(role)}</p>
          <div className="jp-actions">
            <a className="ed-btn primary" href="#apply">
              Apply for this role
            </a>
            <ShareButton title={`${role.title} (${role.ref}) at MIYO Global`} url={url} />
            <Link className="ed-btn quiet" href={`/referrals?job=${encodeURIComponent(role.ref)}#refer`}>
              Refer someone for ₹15,000
            </Link>
          </div>
        </div>

        <dl className="pass" aria-label="Role facts">
          {facts.map(([label, value, fallback, gold]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd className={value ? (gold ? "gold" : undefined) : "unset"}>{value ?? fallback}</dd>
            </div>
          ))}
        </dl>

        <p className="jp-pitch">{role.pitch}</p>

        <div className="jp-grid">
          <div className="jp-main">
            {roleText.length > 0 && (
              <section className="jp-sec" aria-labelledby="s-role">
                <h2 id="s-role">The role</h2>
                <Sections sections={roleText} hideFirstHeading />
              </section>
            )}
            {doing.length > 0 && (
              <section className="jp-sec" aria-labelledby="s-do">
                <h2 id="s-do">What you will do</h2>
                <Sections sections={doing} hideFirstHeading={doing.length === 1} />
              </section>
            )}
            {role.bring.length > 0 && (
              <section className="jp-sec" aria-labelledby="s-bring">
                <h2 id="s-bring">What you will bring</h2>
                <Sections sections={role.bring} hideFirstHeading={role.bring.length === 1} />
              </section>
            )}
            <section className="jp-sec" aria-labelledby="s-pack">
              <h2 id="s-pack">The package</h2>
              <dl className="jp-pack">
                <div>
                  <dt>Compensation</dt>
                  <dd className={role.ctc ? "num" : undefined}>{role.ctc ?? "Benchmarked to the market and shared on your first call"}</dd>
                </div>
                <div>
                  <dt>Engagement</dt>
                  <dd>{role.contract ?? "Confirmed with you before any client interview"}</dd>
                </div>
                <div>
                  <dt>Where you will work</dt>
                  <dd>{role.workMode ? `${role.workMode}${role.cities.length ? `, ${where}` : ""}` : where}</dd>
                </div>
                <div>
                  <dt>{role.notice ? "Notice period" : "Openings"}</dt>
                  <dd className="num">{role.notice ?? (role.openings ? `${role.openings} positions` : "1 or more")}</dd>
                </div>
              </dl>
              <p className="jp-note">MIYO Global never charges candidates a fee and never asks for original documents or payments at any stage.</p>
            </section>
          </div>

          <aside className="jp-aside" aria-label="Your recruiter">
            <div className="desk">
              <div className="desk-id">
                <span className="desk-mark" aria-hidden="true">
                  MG
                </span>
                <div>
                  <h2>MIYO talent desk</h2>
                  <p className="role">Recruiters for this mandate, Hyderabad</p>
                </div>
              </div>
              <ul>
                <li>
                  <a href={`mailto:staffing@miyoglobal.com?subject=${encodeURIComponent(`${role.title} (${role.ref})`)}`}>staffing@miyoglobal.com</a>
                </li>
                <li>
                  Quote <span className="num">{role.ref}</span> when you write
                </li>
              </ul>
              <a className="ed-btn dark" href={`mailto:staffing@miyoglobal.com?subject=${encodeURIComponent(`Book a call: ${role.title} (${role.ref})`)}`}>
                Book a call
              </a>
            </div>
            <div className="conf">
              <h2>Confidential by default</h2>
              <p>We never share your details with a client without asking you first.</p>
            </div>
          </aside>
        </div>
      </div>

      <section className="apply" id="apply" aria-labelledby="apply-h">
        <div className="ed-wrap apply-grid">
          <div className="apply-intro">
            <h2 id="apply-h">Apply for {role.ref}</h2>
            <p>One short form. A recruiter reads every application in full.</p>
            <ol className="next">
              <li>
                <div>
                  <b>We review your CV</b>
                  <span>A recruiter checks it against this brief, not a keyword filter.</span>
                </div>
              </li>
              <li>
                <div>
                  <b>A short call</b>
                  <span>We confirm fit, package and notice, and answer your questions about the client.</span>
                </div>
              </li>
              <li>
                <div>
                  <b>Your go-ahead</b>
                  <span>Only with your consent do we present you to the client.</span>
                </div>
              </li>
            </ol>
            <p className="promise">
              You hear back within <span className="num">2</span> working days, whatever the outcome.
            </p>
          </div>
          <ApplyForm refCode={role.ref} title={role.title} />
        </div>
      </section>

      {similar.length > 0 && (
        <section className="similar" aria-labelledby="sim-h">
          <div className="ed-wrap">
            <div className="similar-head">
              <h2 id="sim-h">Similar roles</h2>
              <Link href={`/jobs?fn=${encodeURIComponent(role.fn)}`}>All {role.fn.toLowerCase()} roles</Link>
            </div>
            <div className="similar-grid">
              {similar.map(toCard).map((s) => (
                <article key={s.slug} className="sim">
                  <div className="top">
                    <span className="num">{s.ref}</span>
                    <span>{s.level ?? s.fn}</span>
                  </div>
                  <h3>
                    <Link href={`/jobs/${s.slug}`}>{s.title}</Link>
                  </h3>
                  <p>{destination(s).main}</p>
                  <RoleChips role={s} level={false} />
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
