import { notFound } from "next/navigation";
import { PostCard } from "@/components/post-card";
import { Pager } from "@/components/pager";
import { BLOG_NAME } from "@/lib/seo";
import { PER_PAGE, blogPages, categoriesWithPosts, latest } from "@/server/services/public";
import { blogCrumbs, ListingPage, PostList, SearchForm, TopicNav } from "@/views/blog/parts";

/** /blog and /blog/page/N: page 1 opens with a lead story, every page lists PER_PAGE rows and the pager. */
export async function BlogIndex({ page }: { page: number }) {
  const [pages, cats] = await Promise.all([blogPages(), categoriesWithPosts()]);
  if (page > pages) notFound();
  const posts = await latest(PER_PAGE + (page === 1 ? 1 : 0), page === 1 ? 0 : PER_PAGE * (page - 1) + 1);
  const featured = page === 1 ? posts[0] : null;
  const rows = featured ? posts.slice(1) : posts;
  return (
    <ListingPage
      crumbs={page === 1 ? blogCrumbs() : blogCrumbs({ label: `Page ${page}` })}
      eyebrow={BLOG_NAME}
      title={page === 1 ? "Straight answers on building global teams" : `${BLOG_NAME}, page ${page}`}
      description="Practical guides on GCC build-outs, technology staffing and digital delivery, written by the people who do the work."
      action={<SearchForm />}
      nav={<TopicNav topics={cats} current={page === 1 ? "/blog" : undefined} />}
    >
      {featured && (
        <section aria-label="Lead story" className="mb-16">
          <PostCard post={featured} variant="lead" />
        </section>
      )}
      {(rows.length > 0 || !featured) && <PostList posts={rows} label={page === 1 ? "Latest articles" : `Articles, page ${page}`} empty="New articles are on the way." />}
      <Pager page={page} pages={pages} base="/blog" />
    </ListingPage>
  );
}
