import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostView } from "@/components/post-view";
import { requireStaff } from "@/server/guards";
import { getPostById } from "@/server/services/public";
import "@/app/blog/site.css";
import "@/app/blog/blog.css";

export const metadata: Metadata = { title: "Preview | MIYO Studio", robots: { index: false, follow: false } };

export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  await requireStaff("writePosts");
  const id = Number((await params).id);
  const data = Number.isInteger(id) ? await getPostById(id) : null;
  if (!data) notFound();
  return (
    <>
      <p role="status" style={{ background: "#0B192F", color: "#fff", padding: "10px 28px", textAlign: "center" }}>
        Preview of saved version. Status: {data.post.status}
      </p>
      <main id="main"><PostView data={data} preview /></main>
    </>
  );
}
