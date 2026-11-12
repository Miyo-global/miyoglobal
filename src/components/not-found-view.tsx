import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/seo";

export const notFoundMetadata: Metadata = {
  title: { absolute: `Page not found | ${SITE_NAME}` },
  robots: { index: false, follow: false },
};

export function NotFoundView() {
  return (
    <>
      <section className="b-hero">
        <div className="b-wrap">
          <nav className="b-crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link> / Not found</nav>
          <span className="eyebrow" style={{ marginTop: 10 }}>404</span>
          <h1>Page not <span className="g">found</span></h1>
          <p>The page you were looking for does not exist or has moved.</p>
        </div>
      </section>
      <section className="b-sec">
        <div className="b-wrap" style={{ textAlign: "center" }}>
          <Link className="btn btn-gold" href="/">Back to home</Link> <Link className="btn btn-ghost" href="/blog">Browse the blog</Link>
        </div>
      </section>
    </>
  );
}
