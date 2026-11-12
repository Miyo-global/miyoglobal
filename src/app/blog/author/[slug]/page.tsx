import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { notFoundMetadata } from "@/components/not-found-view";
import { PostCard } from "@/components/post-card";
import { absolute, jsonLdScript } from "@/lib/seo";
import { byAuthorId, getAuthor } from "@/server/services/public";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const a = await getAuthor((await params).slug);
  if (!a) return notFoundMetadata;
  return {
    title: `${a.name}, author | MIYO Global`,
    description: a.bio.slice(0, 160) || `Articles by ${a.name} on the MIYO Global blog.`,
    alternates: { canonical: `/blog/author/${a.slug}` },
    ...((await byAuthorId(a.id, 1)).length ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const a = await getAuthor((await params).slug);
  if (!a) notFound();
  const posts = await byAuthorId(a.id);
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: a.name,
    url: absolute(`/blog/author/${a.slug}`),
    description: a.bio || undefined,
    jobTitle: a.credentials || undefined,
    sameAs: a.sameAs.length ? a.sameAs : undefined,
    worksFor: { "@type": "Organization", name: "MIYO Global", url: absolute("/") },
  };
  return (
    <div className="b-wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(person) }} />
      <section className="b-hero" style={{ padding: "48px 0 16px", background: "none" }}>
        <span className="eyebrow">Author</span>
        <h1>{a.name}</h1>
        {a.credentials && <p><b>{a.credentials}</b></p>}
        {a.bio && <p style={{ marginTop: 10 }}>{a.bio}</p>}
        {a.sameAs.length > 0 && (
          <p className="b-tags" style={{ marginTop: 12 }}>
            {a.sameAs.map((u) => <a key={u} href={u} rel="me noopener noreferrer" target="_blank">{new URL(u).hostname.replace(/^www\./, "")}</a>)}
          </p>
        )}
      </section>
      <section className="b-sec">
        {posts.length ? <div className="b-grid">{posts.map((p) => <PostCard key={p.id} post={p} />)}</div> : <p className="b-empty">No articles yet.</p>}
      </section>
    </div>
  );
}
