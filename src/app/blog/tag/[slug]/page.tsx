import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/post-card";
import { byTagId, getTag } from "@/server/services/public";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const t = await getTag((await params).slug);
  if (!t) return {};
  return { title: `${t.name} | MIYO Global blog`, description: `Articles tagged ${t.name} from MIYO Global.`, alternates: { canonical: `/blog/tag/${t.slug}` } };
}

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  const t = await getTag((await params).slug);
  if (!t) notFound();
  const posts = await byTagId(t.id);
  return (
    <div className="b-wrap">
      <section className="b-hero" style={{ padding: "48px 0 16px", background: "none" }}>
        <span className="eyebrow">Tag</span>
        <h1>{t.name}</h1>
      </section>
      <section className="b-sec">
        {posts.length ? <div className="b-grid">{posts.map((p) => <PostCard key={p.id} post={p} />)}</div> : <p className="b-empty">No articles yet.</p>}
      </section>
    </div>
  );
}
