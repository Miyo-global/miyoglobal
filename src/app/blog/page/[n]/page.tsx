import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { BlogIndex } from "@/components/blog-index";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ n: string }> }): Promise<Metadata> {
  const { n } = await params;
  return { title: `Blog, page ${n} | MIYO Global`, alternates: { canonical: `/blog/page/${n}` } };
}

export default async function BlogPageN({ params }: { params: Promise<{ n: string }> }) {
  const n = Number((await params).n);
  if (!Number.isInteger(n) || n < 1) notFound();
  if (n === 1) permanentRedirect("/blog");
  return <BlogIndex page={n} />;
}
