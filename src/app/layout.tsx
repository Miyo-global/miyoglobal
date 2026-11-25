import type { Metadata } from "next";
import { CONSENT_SCRIPT } from "@/lib/consent";
import { fontVariables } from "@/lib/fonts";
import { NOINDEX } from "@/lib/seo";

const bing = process.env.BING_SITE_VERIFICATION;

// Site-wide head tags. A layout or page below that sets `icons` or `verification` replaces the whole key, so declare them only here.
export const metadata: Metadata = {
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  // Google Search Console and Bing Webmaster ownership tags, production only; nothing is emitted for an unset variable.
  ...(NOINDEX ? {} : { verification: { google: process.env.GOOGLE_SITE_VERIFICATION, ...(bing ? { other: { "msvalidate.01": bing } } : {}) } }),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={fontVariables} suppressHydrationWarning>
      <head>
        {NOINDEX && <meta name="robots" content="noindex, nofollow" />}
        <script dangerouslySetInnerHTML={{ __html: CONSENT_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
