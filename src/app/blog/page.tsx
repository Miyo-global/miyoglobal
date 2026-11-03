import type { Metadata } from "next";
import { BlogIndex } from "@/components/blog-index";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog | MIYO Global",
  description: "Practical guides on GCC build-outs, technology staffing and digital delivery from the MIYO Global team.",
  alternates: { canonical: "/blog", types: { "application/rss+xml": "/feed.xml" } },
  openGraph: { title: "MIYO Journal", description: "Practical guides on GCC build-outs, technology staffing and digital delivery.", type: "website", url: "/blog", siteName: "MIYO Global", images: [{ url: "/images/og/blog.webp", width: 1200, height: 630, alt: "MIYO Global team collaborating on an enterprise staffing and delivery plan" }] },
  twitter: { card: "summary_large_image" },
};

export default function BlogPage() {
  return <BlogIndex page={1} />;
}
