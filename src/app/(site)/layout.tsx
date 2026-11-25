import type { Metadata, Viewport } from "next";
import { CookieBar } from "@/components/cookie-bar";
import { GoogleTag } from "@/components/google-tag";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import { raw } from "@/styles/tokens";
import "@/styles/site.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
};

export const viewport: Viewport = { themeColor: raw.paper };

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
      <CookieBar />
      <GoogleTag />
    </>
  );
}
