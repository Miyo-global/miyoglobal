import type { Metadata } from "next";
import Link from "next/link";
import SiteLayout, { metadata as siteMetadata } from "./(site)/layout";

export const metadata: Metadata = {
  ...siteMetadata,
  title: { absolute: "Page not found — MIYO Global" },
  description: "Page not found.",
  robots: { index: false, follow: false },
};

/** Any URL no route matches (and unknown blog URLs, rewritten here by src/proxy.ts) gets this page with a 404 status. */
export default function NotFound() {
  return (
    <SiteLayout>
      <section className="phero">
        <span className="rbg"></span>
        <span className="rbg two"></span>
        <div className="wrap">
          <div className="crumb"><Link href="/">Home</Link> / Not found</div>
          <span className="eyebrow" style={{ marginTop: "10px" }}># 404</span>
          <h1>Page not <span className="g">found</span></h1>
          <p>The page you were looking for does not exist or has moved.</p>
        </div>
      </section>
      <section className="sec">
        <div className="wrap center"><Link className="btn btn-gold" href="/">Back to home</Link></div>
      </section>
    </SiteLayout>
  );
}
