import type { NextConfig } from "next";

const pages = [
  "about",
  "case-studies",
  "contact",
  "digital-solutions",
  "privacy-policy",
  "referrals",
  "staffing-solutions",
];

const csp = [
  "default-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src https://fonts.gstatic.com",
  "script-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "connect-src 'self' https://script.google.com https://script.googleusercontent.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'self'",
].join("; ");

const adminHost = process.env.ADMIN_HOST ?? "adm.miyoglobal.com";

const config: NextConfig = {
  trailingSlash: false,
  experimental: { serverActions: { bodySizeLimit: "12mb", allowedOrigins: [adminHost] } },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Content-Security-Policy", value: csp },
        ],
      },
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
