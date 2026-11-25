import type { NextConfig } from "next";
import { ADMIN_HOST, ADMIN_URL } from "./src/lib/hosts";
import { HTML_PAGE_NAMES, REWRITTEN_PAGES } from "./src/lib/pages";

const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL ? new URL(process.env.NEXT_PUBLIC_MEDIA_URL) : null;

const policy = (google: boolean) => {
  const gtm = google ? " https://*.googletagmanager.com" : "";
  const ga = google ? " https://*.google-analytics.com https://*.analytics.google.com" : "";
  return [
    "default-src 'self'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    `script-src 'self' 'unsafe-inline'${gtm}`,
    `img-src 'self' data:${mediaUrl ? ` ${mediaUrl.origin}` : ""}${gtm}${google ? " https://*.google-analytics.com" : ""}`,
    `connect-src 'self'${gtm}${ga}`,
    `frame-ancestors ${google ? "'self'" : "'none'"}`,
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'self'",
  ].join("; ");
};

const csp = policy(true);
const adminCsp = policy(false);

const baseHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const config: NextConfig = {
  trailingSlash: false,
  poweredByHeader: false,
  experimental: { serverActions: { bodySizeLimit: "5mb", allowedOrigins: [new URL(ADMIN_URL).host] } },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: mediaUrl ? [{ protocol: "https", hostname: mediaUrl.hostname }] : [],
  },
  async headers() {
    const edge = "public, s-maxage=300, stale-while-revalidate=600";
    const feed = "public, s-maxage=60, must-revalidate";
    return [
      {
        source: "/:path*",
        missing: [{ type: "host", value: ADMIN_HOST }],
        headers: [
          ...baseHeaders,
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Content-Security-Policy", value: csp },
        ],
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: ADMIN_HOST }],
        headers: [
          ...baseHeaders,
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: adminCsp },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Referrer-Policy", value: "no-referrer" },
        ],
      },
      { source: "/blog", headers: [{ key: "Cache-Control", value: edge }] },
      { source: "/blog/page/:n", headers: [{ key: "Cache-Control", value: edge }] },
      { source: "/blog/:kind(category|tag|author)/:slug", headers: [{ key: "Cache-Control", value: edge }] },
      { source: "/blog/:slug((?!category$|tag$|author$|page$|search$)[a-z0-9-]+)", headers: [{ key: "Cache-Control", value: edge }] },
      { source: "/:file(sitemap.xml|pages-sitemap.xml|posts-sitemap.xml|feed.xml|llms.txt)", headers: [{ key: "Cache-Control", value: feed }] },
    ];
  },
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/blogs", destination: "/blog", permanent: true },
      { source: "/blogs/:path*", destination: "/blog/:path*", permanent: true },
      { source: `/:page(${HTML_PAGE_NAMES.join("|")}).html`, destination: "/:page", permanent: true },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [{ source: `/:page(${REWRITTEN_PAGES.join("|")})`, destination: "/:page.html" }],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default config;
