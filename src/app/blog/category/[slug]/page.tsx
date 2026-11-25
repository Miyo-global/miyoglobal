import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { notFoundMetadata } from "@/components/not-found-view";
import { blogListingMetadata } from "@/lib/page-meta";
import { byCategoryId, categoriesWithPosts, countByCategory, getCategory } from "@/server/services/public";
import { blogCrumbs, countLabel, ListingPage, PostList, TopicNav } from "@/views/blog/parts";

export const revalidate = 300;

// The category's own Studio description when it has one, else a line built from its name.
const describe = (c: { name: string; description: string }) => c.description || `Articles about ${c.name.toLowerCase()} from MIYO Global.`;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = await getCategory((await params).slug);
  if (!c) return notFoundMetadata;
  return {
    ...blogListingMetadata(`/blog/category/${c.slug}`, `${c.name} articles | MIYO Global`, describe(c)),
    ...((await countByCategory(c.id)) ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const c = await getCategory((await params).slug);
  if (!c) notFound();
  const [posts, cats] = await Promise.all([byCategoryId(c.id, 48), categoriesWithPosts()]);
  return (
    <ListingPage
      crumbs={blogCrumbs({ label: c.name })}
      eyebrow="Category"
      title={c.name}
      description={describe(c)}
      nav={<TopicNav topics={cats} current={`/blog/category/${c.slug}`} />}
    >
      <PostList posts={posts} label={countLabel(posts.length)} />
    </ListingPage>
  );
}
