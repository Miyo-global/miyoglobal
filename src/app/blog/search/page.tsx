import type { Metadata } from "next";
import { search } from "@/server/services/public";
import { blogCrumbs, ListingPage, PostList, SearchForm } from "@/views/blog/parts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search the blog | MIYO Global",
  // No canonical: pointing a noindex page at /blog sends two opposite signals. robots.txt keeps crawlers out of the ?q= space.
  robots: { index: false, follow: true },
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = ((await searchParams).q ?? "").trim().slice(0, 80);
  const results = q ? await search(q) : [];
  return (
    <ListingPage
      crumbs={blogCrumbs({ label: "Search" })}
      eyebrow="Search"
      title="Search the journal"
      description="Find guides by title, summary or topic."
      action={<SearchForm q={q} />}
    >
      {q ? (
        <PostList posts={results} label={`${results.length} result${results.length === 1 ? "" : "s"} for “${q}”`} empty="Nothing matches that search. Try a broader word, or browse all articles." />
      ) : (
        <p className="border-t border-rule pt-8 text-muted">Type a word or phrase above to search every published article.</p>
      )}
    </ListingPage>
  );
}
