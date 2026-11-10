import { statSync } from "node:fs";
import type { NextConfig } from "next";
import { ADMIN_HOST, ADMIN_URL } from "./src/lib/hosts";
import { REWRITTEN_PAGES, STATIC_PAGES } from "./src/lib/pages";

const pages = REWRITTEN_PAGES;
// ponytail: file mtime is the checkout time on CI/Vercel clones; switch to `git log -1 --format=%cs <file>` with a full-depth clone if dates must track edits.
const lastmods = Object.fromEntries(STATIC_PAGES.map((p) => [p.path, statSync(p.file).mtime.toISOString().slice(0, 10)]));
const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL ? new URL(process.env.NEXT_PUBLIC_MEDIA_URL) : null;

const csp = [
  "default-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src https://fonts.gstatic.com",
  "script-src 'self' 'unsafe-inline'",
  `img-src 'self' data:${mediaUrl ? ` ${mediaUrl.origin}` : ""}`,
  "connect-src 'self'",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'self'",
].join("; ");

const adminCsp = csp.replace("frame-ancestors 'self'", "frame-ancestors 'none'");

const baseHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const config: NextConfig = {
  trailingSlash: false,
  poweredByHeader: false,
  env: { STATIC_LASTMOD: JSON.stringify(lastmods) },
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
      { source: `/:page(${pages.join("|")}).html`, destination: "/:page", permanent: true },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", destination: "/index.html" },
        { source: "/favicon.ico", destination: "/favicon.svg" },
        { source: `/:page(${pages.join("|")})`, destination: "/:page.html" },
      ],
      afterFiles: [],
      fallback: [{ source: "/:path*", destination: "/not-found-html" }],
    };
  },
};

export default config;
