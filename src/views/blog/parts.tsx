import Link from "next/link";
import { PostCard } from "@/components/post-card";
import { Breadcrumbs, type Crumb } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { cx } from "@/components/ui/cx";
import { Field } from "@/components/ui/field";
import { SectionHeader } from "@/components/ui/section-header";
import type { CardPost } from "@/server/services/public";

/** Labelled GET search box for /blog/search. */
export function SearchForm({ q = "" }: { q?: string }) {
  return (
    <form action="/blog/search" role="search" className="flex max-w-reading items-end gap-3">
      <Field id="blog-q" name="q" type="search" label="Search the journal" defaultValue={q} maxLength={80} className="grow" />
      <Button variant="secondary" type="submit">
        Search
      </Button>
    </form>
  );
}

/** Category filter row: mono labels, 48px targets, a gold hairline under the current one. */
export function TopicNav({ topics, current }: { topics: { slug: string; name: string }[]; current?: string }) {
  if (!topics.length) return null;
  const items = [{ href: "/blog", name: "All articles" }, ...topics.map((t) => ({ href: `/blog/category/${t.slug}`, name: t.name }))];
  return (
    <nav aria-label="Topics" className="border-y border-rule">
      <ul className="flex flex-wrap gap-x-6">
        {items.map((t) => (
          <li key={t.href}>
            <Link
              href={t.href}
              aria-current={t.href === current ? "page" : undefined}
              className={cx("meta -mb-px inline-flex min-h-12 items-center border-b", t.href === current ? "border-accent text-ink" : "border-transparent text-muted hover:text-ink")}
            >
              {t.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Rows of articles under a counted h2, or an empty line. */
export function PostList({ posts, label, empty = "No articles yet.", base }: { posts: CardPost[]; label: string; empty?: string; base?: string }) {
  return (
    <section aria-labelledby="articles">
      <h2 id="articles" className="meta pb-4 text-muted">
        {label}
      </h2>
      {posts.length ? (
        <div className="border-b border-rule">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} base={base} />
          ))}
        </div>
      ) : (
        <p className="border-y border-rule py-8 text-muted">{empty}</p>
      )}
    </section>
  );
}

export const countLabel = (n: number) => `${n} article${n === 1 ? "" : "s"}`;

/** Category, tag, author and search pages: breadcrumbs, split header with a description line, then the list. */
export function ListingPage({ crumbs, eyebrow, title, description, action, nav, children }: { crumbs: Crumb[]; eyebrow: string; title: string; description: React.ReactNode; action?: React.ReactNode; nav?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="frame pb-section pt-12">
      <Breadcrumbs items={crumbs} />
      <SectionHeader as="h1" eyebrow={eyebrow} title={title} lead={description} action={action} className="mt-12 pb-12" />
      {nav}
      <div className="mt-12">{children}</div>
    </div>
  );
}

export const blogCrumbs = (...rest: Crumb[]): Crumb[] => [{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, ...rest];
