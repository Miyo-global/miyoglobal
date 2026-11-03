import type { Metadata } from "next";
import { CookieBar } from "@/components/cookie-bar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SITE_URL } from "@/lib/seo";
import "./site.css";
import "./blog.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "MIYO Global",
  icons: { icon: "/favicon.svg" },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <SiteHeader active="/blog" />
      <main id="main">{children}</main>
      <SiteFooter />
      <CookieBar />
    </>
  );
}
