import type { Metadata } from "next";
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
  // Google Search Console and Bing Webmaster ownership tags; nothing is emitted for an unset variable.
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION, ...(bing ? { other: { "msvalidate.01": bing } } : {}) },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        {NOINDEX && <meta name="robots" content="noindex, nofollow" />}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
