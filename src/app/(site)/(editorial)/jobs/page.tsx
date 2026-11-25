import type { Metadata } from "next";
import Link from "next/link";
import { JobsBoard } from "@/components/jobs/board";
import { Flap } from "@/components/jobs/flap";
import { toCard } from "@/lib/jobs";
import { pageJsonLd, pageMetadata, type SitePage } from "@/lib/page-meta";
import { jsonLdScript, SITE_URL } from "@/lib/seo";
import { getRoles } from "@/server/jobs";

/** New roles in the sheet appear within five minutes, without a deploy. */
export const revalidate = 300;

const page: SitePage = {
  path: "/jobs",
  title: "Open Jobs: Workday, Oracle & Tech Roles | MIYO Global",
  description: "Browse every open MIYO Global mandate: Workday, Oracle banking, data, engineering and business roles across Hyderabad, Bengaluru, Mumbai and remote.",
  image: "/images/og/staffing.webp",
  imageAlt: "MIYO Global recruiters reviewing open technology and enterprise roles",
  crumb: "Jobs",
};

export const metadata: Metadata = pageMetadata(page);

export default async function JobsPage() {
  const roles = await getRoles();
  const cards = roles.map(toCard);
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
      <section className="jb-hero">
        <div className="ed-wrap">
          <nav className="ed-crumb" aria-label="Breadcrumb">
            <ol>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li aria-current="page">Jobs</li>
            </ol>
          </nav>
          <div className="jb-hero-grid">
            <div>
              <h1>Open roles, represented end to end</h1>
              <p>
                Every role on this board is a live mandate our talent desk is filling now. Apply directly, or refer someone you know and earn{" "}
                <Link href="/referrals">₹15,000 when they join</Link>.
              </p>
            </div>
            <figure className="jb-count">
              <Flap value={roles.length} label={`${roles.length} open roles`} />
              <figcaption>Roles open today, updated every five minutes</figcaption>
            </figure>
          </div>
        </div>
      </section>
      <div className="ed-wrap">
        {roles.length ? (
          <JobsBoard roles={cards} />
        ) : (
          <div className="board-empty">
            <h2>The jobs board is refreshing</h2>
            <p>Open roles could not be loaded just now. Reload in a minute, or send your CV to staffing@miyoglobal.com and we will match you.</p>
          </div>
        )}
      </div>
    </>
  );
}
