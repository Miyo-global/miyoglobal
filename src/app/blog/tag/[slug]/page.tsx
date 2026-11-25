import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { notFoundMetadata } from "@/components/not-found-view";
import { PostCard } from "@/components/post-card";
import { blogListingMetadata } from "@/lib/page-meta";
import { byTagId, getTag, TAG_MIN_POSTS } from "@/server/services/public";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const t = await getTag((await params).slug);
  if (!t) return notFoundMetadata;
  // A tag with a single article is a title and one card: followed for discovery, not indexed, and left out of the sitemap.
  const thin = (await byTagId(t.id, TAG_MIN_POSTS)).length < TAG_MIN_POSTS;
  return {
    ...blogListingMetadata(`/blog/tag/${t.slug}`, `${t.name} | MIYO Global blog`, `Articles tagged ${t.name} from MIYO Global.`),
    ...(thin ? { robots: { index: false, follow: true } } : {}),
  };
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
