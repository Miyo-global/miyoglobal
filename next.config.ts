import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import type { NextConfig } from "next";
import { ADMIN_HOST, ADMIN_URL } from "./src/lib/hosts";
import { REWRITTEN_PAGES, STATIC_PAGES } from "./src/lib/pages";

const pages = REWRITTEN_PAGES;
const git = (...args: string[]) => {
  try {
    return execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return "";
  }
};
// Shallow clones (Vercel) graft history at a boundary commit that looks like it touched every file: treat those dates as unknown.
const shallowFile = git("rev-parse", "--git-path", "shallow");
const shallow = new Set(shallowFile && existsSync(shallowFile) ? readFileSync(shallowFile, "utf8").split("\n").filter(Boolean) : []);
// Last commit date per public/*.html; falls back to file mtime (checkout time on CI) when git history is missing.
const lastmod = (file: string) => {
  const [hash, date] = git("log", "-1", "--format=%H %cI", "--", file).split(" ");
  const when = hash && !shallow.has(hash) ? new Date(date) : statSync(file).mtime;
  return when.toISOString().slice(0, 10);
};
const lastmods = Object.fromEntries(STATIC_PAGES.map((p) => [p.path, lastmod(p.file)]));
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
        { source: `/:page(${pages.join("|")})`, destination: "/:page.html" },
      ],
      afterFiles: [],
      fallback: [{ source: "/:path*", destination: "/not-found-html" }],
    };
  },
};

export default config;
