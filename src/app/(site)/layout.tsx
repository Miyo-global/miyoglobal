import type { Metadata, Viewport } from "next";
import { CookieBar } from "@/components/cookie-bar";
import { SiteEffects } from "@/components/site-effects";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import "./site-pages.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = { themeColor: "#FFFFFF" };

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Scroll-reveal starts hidden and is shown by SiteEffects; without JS, show everything. */}
      <noscript>
        <style>{".reveal{opacity:1;transform:none}"}</style>
      </noscript>
      <a className="skip" href="#main">Skip to content</a>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
      <CookieBar />
      <SiteEffects />
    </>
  );
}
