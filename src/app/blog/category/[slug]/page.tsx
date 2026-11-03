import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/post-card";
import { byCategoryId, getCategory } from "@/server/services/public";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = await getCategory((await params).slug);
  if (!c) return {};
  return {
    title: `${c.name} articles | MIYO Global`,
    description: c.description || `Articles about ${c.name.toLowerCase()} from MIYO Global.`,
    alternates: { canonical: `/blog/category/${c.slug}` },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const c = await getCategory((await params).slug);
  if (!c) notFound();
  const posts = await byCategoryId(c.id, 48);
  return (
    <div className="b-wrap">
      <section className="b-hero" style={{ padding: "48px 0 16px", background: "none" }}>
        <span className="eyebrow">Category</span>
        <h1>{c.name}</h1>
        {c.description && <p>{c.description}</p>}
      </section>
      <section className="b-sec">
        {posts.length ? <div className="b-grid">{posts.map((p) => <PostCard key={p.id} post={p} />)}</div> : <p className="b-empty">No articles yet.</p>}
      </section>
    </div>
  );
}
