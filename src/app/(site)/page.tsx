import type { Metadata } from "next";
import { pageJsonLd, pageMetadata, type SitePage } from "@/lib/page-meta";
import { jsonLdScript, SITE_URL } from "@/lib/seo";
import { getRoles } from "@/server/jobs";
import { latest } from "@/server/services/public";
import { faqs } from "@/views/home/content";
import { HomeView } from "@/views/home/home";

const page: SitePage = {
  path: "/",
  title: "MIYO Global | Enterprise Staffing & Digital Solutions",
  description: "MIYO Global builds enterprise teams: GCC build-outs, technology staffing, executive search, and managed digital delivery from India and the UAE.",
  image: "/images/og/index.webp",
  imageAlt: "MIYO Global: enterprise staffing and digital delivery from India and the UAE",
};

export const metadata: Metadata = pageMetadata(page);
/** The open-mandates card and the journal row refresh every ten minutes without a deploy. */
export const revalidate = 600;

export default async function HomePage() {
  const [roles, posts] = await Promise.all([getRoles(), latest(3).catch(() => [])]);
  const jsonLd = pageJsonLd(page, [
    { "@type": "FAQPage", "@id": `${SITE_URL}/#faq`, mainEntity: faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
  ]);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />
      <HomeView roles={roles} posts={posts} />
    </>
  );
}
