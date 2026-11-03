import type { Metadata } from "next";
import { PostCard } from "@/components/post-card";
import { search } from "@/server/services/public";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search the blog | MIYO Global",
  robots: { index: false, follow: true },
  alternates: { canonical: "/blog" },
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = ((await searchParams).q ?? "").trim().slice(0, 80);
  const results = q ? await search(q) : [];
  return (
    <div className="b-wrap">
      <section className="b-hero" style={{ padding: "48px 0 16px", background: "none" }}>
        <h1>Search</h1>
        <form className="b-search" action="/blog/search" role="search">
          <input name="q" type="search" defaultValue={q} aria-label="Search articles" maxLength={80} required />
          <button>Search</button>
        </form>
      </section>
      <section className="b-sec">
        {q && <p className="muted" style={{ marginBottom: 20 }}>{results.length} result{results.length === 1 ? "" : "s"} for “{q}”</p>}
        {results.length > 0 && <div className="b-grid">{results.map((p) => <PostCard key={p.id} post={p} />)}</div>}
      </section>
    </div>
  );
}
