import type { Metadata } from "next";
import { pageJsonLd, pageMetadata, type SitePage } from "@/lib/page-meta";
import { jsonLdScript } from "@/lib/seo";
import { HomeView } from "@/views/home";

const page: SitePage = {
  path: "/",
  title: "MIYO Global — Enterprise Staffing & Digital Solutions",
  description: "MIYO Global builds enterprise teams: GCC build-outs, technology staffing, executive search, and managed digital delivery from India and the UAE.",
  image: "/images/og/index.webp",
  imageAlt: "MIYO Global team collaborating on an enterprise staffing and delivery plan",
};

export const metadata: Metadata = pageMetadata(page);

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(pageJsonLd(page)) }} />
      <HomeView />
    </>
  );
}
