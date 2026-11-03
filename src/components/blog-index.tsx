import Link from "next/link";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/post-card";
import { Pager } from "@/components/pager";
import { PER_PAGE, categoriesWithPosts, byCategoryId, countLive, latest } from "@/server/services/public";

export async function BlogIndex({ page }: { page: number }) {
  const [total, cats] = await Promise.all([countLive(), categoriesWithPosts()]);
  const pages = Math.max(1, Math.ceil(Math.max(total - 1, 0) / PER_PAGE));
  if (page > pages) notFound();
  const posts = await latest(PER_PAGE + (page === 1 ? 1 : 0), page === 1 ? 0 : PER_PAGE * (page - 1) + 1);
  const featured = page === 1 ? posts[0] : null;
  const grid = featured ? posts.slice(1) : posts;
  const rails = page === 1 ? await Promise.all(cats.map(async (c) => ({ c, posts: await byCategoryId(c.id, 3) }))) : [];
  return (
    <>
      <section className="b-hero">
        <div className="b-wrap">
          <span className="eyebrow">The MIYO Journal</span>
          <h1>Straight answers on building global teams</h1>
          <p>Practical guides on GCC build-outs, technology staffing and digital delivery, written by the people who do the work.</p>
          <form className="b-search" action="/blog/search" role="search">
            <input name="q" type="search" placeholder="Search articles" aria-label="Search articles" maxLength={80} required />
            <button>Search</button>
          </form>
          {cats.length > 0 && (
            <div className="b-cats">
              {cats.map((c) => <Link key={c.id} className="b-chip" href={`/blog/category/${c.slug}`}>{c.name}</Link>)}
            </div>
          )}
        </div>
      </section>
      <div className="b-wrap">
        {featured && (
          <section className="b-sec" aria-label="Featured article">
            <PostCard post={featured} large />
          </section>
        )}
        <section className="b-sec" aria-labelledby="latest">
          <h2 id="latest">{page === 1 ? "Latest articles" : `Articles, page ${page}`}</h2>
          {grid.length === 0 && !featured ? <p className="b-empty">New articles are on the way.</p> : <div className="b-grid">{grid.map((p) => <PostCard key={p.id} post={p} />)}</div>}
          <Pager page={page} pages={pages} base="/blog" />
        </section>
        {rails.filter((r) => r.posts.length).map(({ c, posts: ps }) => (
          <section className="b-sec" key={c.id} aria-label={c.name}>
            <div className="b-sec-head">
              <h2>{c.name}</h2>
              <Link href={`/blog/category/${c.slug}`} className="btn btn-ghost">All {c.name}</Link>
            </div>
            <div className="b-grid">{ps.map((p) => <PostCard key={p.id} post={p} />)}</div>
          </section>
        ))}
      </div>
    </>
  );
}
