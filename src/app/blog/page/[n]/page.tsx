import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { BlogIndex } from "@/components/blog-index";
import { notFoundMetadata } from "@/components/not-found-view";
import { blogPages } from "@/server/services/public";
import { BLOG_NAME, SITE_NAME } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ n: string }> }): Promise<Metadata> {
  const { n } = await params;
  const page = Number(n);
  if (!Number.isInteger(page) || page < 1 || page > (await blogPages())) return notFoundMetadata;
  return { title: { absolute: `${BLOG_NAME}, page ${n} | ${SITE_NAME}` }, alternates: { canonical: `/blog/page/${n}` } };
}

export default async function BlogPageN({ params }: { params: Promise<{ n: string }> }) {
  const n = Number((await params).n);
  if (!Number.isInteger(n) || n < 1) notFound();
  if (n === 1) permanentRedirect("/blog");
  return <BlogIndex page={n} />;
}
