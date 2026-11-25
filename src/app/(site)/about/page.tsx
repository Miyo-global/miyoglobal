import type { Metadata } from "next";
import { pageJsonLd, pageMetadata, type SitePage } from "@/lib/page-meta";
import { jsonLdScript, ORG_ID } from "@/lib/seo";
import { AboutView } from "@/views/about/about-view";
import { ADVISORS, LEADERS, type Person } from "@/views/about/content";

const page: SitePage = {
  path: "/about",
  title: "About Us: Enterprise Staffing in India & UAE | MIYO Global",
  description: "MIYO Global is an enterprise staffing and digital delivery company founded by veteran operators. Delivery hubs in Hyderabad, India and Ras Al Khaimah, UAE.",
  image: "/images/og/about.webp",
  imageAlt: "MIYO Global leadership and delivery team at work in a modern office",
  crumb: "About",
};

export const metadata: Metadata = pageMetadata(page);

// Names and roles as printed in the Leadership section. Advisors are consultants, so they are affiliated rather than employed.
const people = (rows: Person[], tie: "worksFor" | "affiliation") =>
  rows.map(({ name, role }) => {
    const [plain, suffix] = name.split(", ");
    return { "@type": "Person", name: plain, ...(suffix ? { honorificSuffix: suffix } : {}), jobTitle: role, [tie]: { "@id": ORG_ID } };
  });
const jsonLd = pageJsonLd(page, [...people(LEADERS, "worksFor"), ...people(ADVISORS, "affiliation")]);

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />
      <AboutView />
    </>
  );
}
