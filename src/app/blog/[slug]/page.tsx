import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { notFoundMetadata } from "@/components/not-found-view";
import { PostView } from "@/components/post-view";
import { absolute, SITE_NAME, titleFor } from "@/lib/seo";
import { getPostBySlug } from "@/server/services/public";

export const revalidate = 300;

export function generateStaticParams() {
  return [];
}

const load = cache(getPostBySlug);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const data = await load((await params).slug);
  if (!data) return notFoundMetadata;
  const { post, cover } = data;
  const url = absolute(`/blog/${post.slug}`);
  const description = post.metaDescription || post.excerpt;
  const image = cover?.ogUrl ?? `/blog/${post.slug}/og`;
  const imageAlt = cover?.alt ?? post.title;
  return {
    title: { absolute: titleFor(post.metaTitle, post.title) },
    description,
    alternates: { canonical: url },
    robots: { index: !post.noindex, follow: !post.nofollow },
    authors: data.author ? [{ name: data.author.name, url: absolute(`/blog/author/${data.author.slug}`) }] : undefined,
    openGraph: {
      type: "article",
      url,
      siteName: SITE_NAME,
      title: post.ogTitle || post.title,
      description: post.ogDescription || description,
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      images: [{ url: image, width: 1200, height: 630, alt: imageAlt }],
    },
    twitter: { card: "summary_large_image", title: post.ogTitle || post.title, description: post.ogDescription || description, images: [{ url: image, alt: imageAlt }] },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await load(slug);
  if (!data) notFound();
  return <PostView data={data} />;
}
