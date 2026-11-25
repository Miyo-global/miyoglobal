import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { notFoundMetadata } from "@/components/not-found-view";
import { listingJsonLd, listingMetadata } from "@/lib/page-meta";
import { jsonLdScript } from "@/lib/seo";
import { byCategoryId, categoriesWithPosts, countByCategory, getCategory } from "@/server/services/public";
import { blogCrumbs, countLabel, ListingPage, PostList, TopicNav } from "@/views/blog/parts";

export const revalidate = 300;

// The category's own Studio description when it has one, else a line built from its name.
const describe = (c: { name: string; description: string }) =>
  c.description || `Guides and analysis on ${c.name.toLowerCase()} from the MIYO Journal: hiring, GCC build-outs and delivery in India and the UAE, by the MIYO Global team.`;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = await getCategory((await params).slug);
  if (!c) return notFoundMetadata;
  return {
    ...listingMetadata(`/blog/category/${c.slug}`, `${c.name} Articles & Guides | MIYO Journal`, describe(c)),
    ...((await countByCategory(c.id)) ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const c = await getCategory((await params).slug);
  if (!c) notFound();
  const [posts, cats] = await Promise.all([byCategoryId(c.id, 48), categoriesWithPosts()]);
  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(listingJsonLd(`/blog/category/${c.slug}`, `${c.name} articles`, describe(c))) }} />
    <ListingPage
      crumbs={blogCrumbs({ label: c.name })}
      eyebrow="Category"
      title={c.name}
      description={describe(c)}
      nav={<TopicNav topics={cats} current={`/blog/category/${c.slug}`} />}
    >
      <PostList posts={posts} label={countLabel(posts.length)} />
    </ListingPage>
    </>
  );
}
