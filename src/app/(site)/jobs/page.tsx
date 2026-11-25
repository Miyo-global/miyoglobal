import type { Metadata } from "next";
import Link from "next/link";
import { JobsBoard } from "@/components/jobs/board";
import { Flap } from "@/components/jobs/flap";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { toCard } from "@/lib/jobs";
import { pageJsonLd, pageMetadata, type SitePage } from "@/lib/page-meta";
import { jsonLdScript, SITE_URL } from "@/lib/seo";
import { getRoles } from "@/server/jobs";

/** New roles in the sheet appear within ten minutes, without a deploy. */
export const revalidate = 600;

const page: SitePage = {
  path: "/jobs",
  title: "Open Jobs: Workday, Oracle & Tech Roles | MIYO Global",
  description: "Browse every open MIYO Global mandate: Workday, Oracle banking, data, engineering and business roles across Hyderabad, Bengaluru, Mumbai and remote.",
  image: "/images/og/jobs.webp",
  imageAlt: "MIYO Global recruiters reviewing open technology and enterprise roles",
  crumb: "Jobs",
};

export const metadata: Metadata = pageMetadata(page);

export default async function JobsPage() {
  const roles = await getRoles();
  const list = {
    "@type": "ItemList",
    "@id": `${SITE_URL}/jobs#roles`,
    name: "Open roles at MIYO Global",
    numberOfItems: roles.length,
    itemListElement: roles.map((r, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}/jobs/${r.slug}`, name: r.title })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(pageJsonLd(page, [list])) }} />
      <section className="border-b border-rule pb-16 pt-12 md:pt-16">
        <div className="frame">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Jobs" }]} />
          <div className="grid-12 mt-8 gap-y-12">
            <div className="col-span-4 md:col-span-7">
              <h1 className="text-h1 max-w-heading">Open roles, represented end to end</h1>
              <p className="lead mt-6">
                Every role on this board is a live mandate our talent desk is filling now. Apply directly, or refer someone you know and earn{" "}
                <Link href="/referrals" className="link text-ink">
                  <span className="num">₹15,000</span> when they join
                </Link>
                .
              </p>
            </div>
            <figure className="col-span-4 border-t border-rule-strong pt-6 md:col-span-4 md:col-start-9 md:self-end">
              <Flap value={roles.length} label={`${roles.length} open roles`} />
              <figcaption className="meta mt-4 text-muted">Roles open today, refreshed every ten minutes</figcaption>
            </figure>
          </div>
        </div>
      </section>
      <section className="py-section" aria-label="Jobs board">
        <div className="frame">
          {roles.length ? (
            <JobsBoard roles={roles.map(toCard)} />
          ) : (
            <div className="max-w-measure border-t border-rule-strong pt-8">
              <h2 className="text-h2">The jobs board is refreshing</h2>
              <p className="lead mt-4">
                Open roles could not be loaded just now. Reload in a minute, or send your CV to{" "}
                <a href="mailto:staffing@miyoglobal.com" className="link text-ink">
                  staffing@miyoglobal.com
                </a>{" "}
                and we will match you.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
