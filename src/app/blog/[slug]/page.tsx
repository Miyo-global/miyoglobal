import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { notFoundMetadata } from "@/components/not-found-view";
import { PostView } from "@/components/post-view";
import { FEED_ALTERNATE, OG_LOCALE } from "@/lib/page-meta";
import { absolute, SITE_NAME } from "@/lib/seo";
import { getPostBySlug } from "@/server/services/public";
import { authorName, isOrgAuthor, postTitle } from "@/views/blog/meta";
import "@/styles/blog.css";

export const revalidate = 300;

export function generateStaticParams() {
  return [];
}

const load = cache(getPostBySlug);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const data = await load((await params).slug);
  if (!data) return notFoundMetadata;
  const { post, cover, author } = data;
  const url = absolute(`/blog/${post.slug}`);
  const description = post.metaDescription || post.excerpt;
  const title = post.ogTitle || post.title;
  // A share image set in Studio wins. Without one the `images` key must be absent (not undefined) so Next uses ./opengraph-image.
  const own = cover?.ogUrl ? { images: [{ url: cover.ogUrl, width: 1200, height: 630, alt: cover.alt || post.title }] } : {};
  return {
    title: { absolute: postTitle(post.metaTitle, post.title) },
    description,
    alternates: { canonical: url, types: FEED_ALTERNATE },
    robots: { index: !post.noindex, follow: !post.nofollow },
    authors: author ? [{ name: authorName(author.name), url: isOrgAuthor(author.name) ? absolute("/") : absolute(`/blog/author/${author.slug}`) }] : [{ name: SITE_NAME, url: absolute("/") }],
    openGraph: {
      type: "article",
      url,
      siteName: SITE_NAME,
      locale: OG_LOCALE,
      title,
      description: post.ogDescription || description,
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      ...own,
    },
    twitter: { card: "summary_large_image", title, description: post.ogDescription || description, ...own },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await load(slug);
  if (!data) notFound();
  return <PostView data={data} />;
}
