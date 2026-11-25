import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { notFoundMetadata } from "@/components/not-found-view";
import { blogListingMetadata } from "@/lib/page-meta";
import { absolute, jsonLdScript, SITE_NAME, siteGraph } from "@/lib/seo";
import { byAuthorId, getAuthor } from "@/server/services/public";
import { isOrgAuthor } from "@/views/blog/meta";
import { blogCrumbs, countLabel, ListingPage, PostList } from "@/views/blog/parts";

export const revalidate = 300;

type Author = NonNullable<Awaited<ReturnType<typeof getAuthor>>>;

// The shared admin account is shown and marked up as the company; named authors stay people.
const view = (a: Author) =>
  isOrgAuthor(a.name)
    ? { org: true, name: SITE_NAME, title: `Articles by ${SITE_NAME} | MIYO Journal`, description: a.bio || `Articles written and edited by the ${SITE_NAME} team.` }
    : { org: false, name: a.name, title: `${a.name}, author | MIYO Global`, description: a.bio || `Articles by ${a.name} on the MIYO Global blog.` };

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const a = await getAuthor((await params).slug);
  if (!a) return notFoundMetadata;
  const v = view(a);
  return {
    ...blogListingMetadata(`/blog/author/${a.slug}`, v.title, v.description.slice(0, 160)),
    ...((await byAuthorId(a.id, 1)).length ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const a = await getAuthor((await params).slug);
  if (!a) notFound();
  const posts = await byAuthorId(a.id);
  const v = view(a);
  const url = absolute(`/blog/author/${a.slug}`);
  const [site, org] = siteGraph();
  // A Person carries an @id so a BlogPosting can reference its author; the admin account resolves to the shared Organization node.
  const profile = {
    "@context": "https://schema.org",
    "@graph": [
      site,
      org,
      {
        "@type": "ProfilePage",
        url,
        isPartOf: { "@id": site["@id"] },
        inLanguage: "en",
        mainEntity: v.org
          ? { "@id": org["@id"] }
          : {
              "@type": "Person",
              "@id": `${url}#person`,
              name: a.name,
              url,
              description: a.bio || undefined,
              jobTitle: a.credentials || undefined,
              sameAs: a.sameAs.length ? a.sameAs : undefined,
              worksFor: { "@id": org["@id"] },
            },
      },
    ],
  };
  const links = !v.org && a.sameAs.length > 0 && (
    <ul className="flex flex-wrap gap-x-6">
      {a.sameAs.map((u) => (
        <li key={u}>
          <a href={u} rel="me noopener noreferrer" target="_blank" className="link inline-flex min-h-12 items-center text-small">
            {new URL(u).hostname.replace(/^www\./, "")}
          </a>
        </li>
      ))}
    </ul>
  );
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(profile) }} />
      <ListingPage
        crumbs={blogCrumbs({ label: v.name })}
        eyebrow={v.org ? "Editorial team" : "Author"}
        title={v.name}
        description={
          <>
            {!v.org && a.credentials && <span className="meta block pb-3 text-ink">{a.credentials}</span>}
            {v.description}
          </>
        }
        action={links || undefined}
      >
        <PostList posts={posts} label={countLabel(posts.length)} />
      </ListingPage>
    </>
  );
}
