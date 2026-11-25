import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { notFoundMetadata } from "@/components/not-found-view";
import { listingJsonLd, listingMetadata } from "@/lib/page-meta";
import { jsonLdScript } from "@/lib/seo";
import { byTagId, getTag, TAG_MIN_POSTS } from "@/server/services/public";
import { blogCrumbs, countLabel, ListingPage, PostList } from "@/views/blog/parts";

export const revalidate = 300;

const describe = (name: string) => `Every MIYO Journal article tagged ${name}: practical notes on hiring, GCC build-outs and delivery in India and the UAE from MIYO Global.`;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const t = await getTag((await params).slug);
  if (!t) return notFoundMetadata;
  // A tag with a single article is a title and one card: followed for discovery, not indexed, and left out of the sitemap.
  const thin = (await byTagId(t.id, TAG_MIN_POSTS)).length < TAG_MIN_POSTS;
  return {
    ...listingMetadata(`/blog/tag/${t.slug}`, `${t.name} Articles | MIYO Journal`, describe(t.name)),
    ...(thin ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  const t = await getTag((await params).slug);
  if (!t) notFound();
  const posts = await byTagId(t.id);
  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(listingJsonLd(`/blog/tag/${t.slug}`, `${t.name} articles`, describe(t.name))) }} />
    <ListingPage crumbs={blogCrumbs({ label: t.name })} eyebrow="Tag" title={t.name} description={describe(t.name)}>
      <PostList posts={posts} label={countLabel(posts.length)} />
    </ListingPage>
    </>
  );
}
