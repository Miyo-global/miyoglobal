import type { NextConfig } from "next";
import { REWRITTEN_PAGES } from "./src/lib/pages";

const pages = REWRITTEN_PAGES;
const adminHost = process.env.ADMIN_HOST ?? "adm.miyoglobal.com";
const adminHostName = adminHost.split(":")[0];

const csp = [
  "default-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src https://fonts.gstatic.com",
  "script-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://*.public.blob.vercel-storage.com",
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
  experimental: { serverActions: { bodySizeLimit: "12mb", allowedOrigins: [adminHost] } },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
  async headers() {
    const edge = "public, s-maxage=300, stale-while-revalidate=600";
    return [
      {
        source: "/:path*",
        missing: [{ type: "host", value: adminHostName }],
        headers: [
          ...baseHeaders,
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Content-Security-Policy", value: csp },
        ],
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: adminHostName }],
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
    ];
  },
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: `/:page(${pages.join("|")}).html`, destination: "/:page", permanent: true },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", destination: "/index.html" },
        { source: `/:page(${pages.join("|")})`, destination: "/:page.html" },
      ],
      afterFiles: [],
      fallback: [{ source: "/:path*", destination: "/not-found-html" }],
    };
  },
};

export default config;
