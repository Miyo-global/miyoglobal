import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { notFoundMetadata } from "@/components/not-found-view";
import { blogListingMetadata } from "@/lib/page-meta";
import { byTagId, getTag, TAG_MIN_POSTS } from "@/server/services/public";
import { blogCrumbs, countLabel, ListingPage, PostList } from "@/views/blog/parts";

export const revalidate = 300;

const describe = (name: string) => `Articles tagged ${name} from MIYO Global.`;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const t = await getTag((await params).slug);
  if (!t) return notFoundMetadata;
  // A tag with a single article is a title and one card: followed for discovery, not indexed, and left out of the sitemap.
  const thin = (await byTagId(t.id, TAG_MIN_POSTS)).length < TAG_MIN_POSTS;
  return {
    ...blogListingMetadata(`/blog/tag/${t.slug}`, `${t.name} | MIYO Global blog`, describe(t.name)),
    ...(thin ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  const t = await getTag((await params).slug);
  if (!t) notFound();
  const posts = await byTagId(t.id);
  return (
    <ListingPage crumbs={blogCrumbs({ label: t.name })} eyebrow="Tag" title={t.name} description={describe(t.name)}>
      <PostList posts={posts} label={countLabel(posts.length)} />
    </ListingPage>
  );
}
