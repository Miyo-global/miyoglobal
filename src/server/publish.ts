import "server-only";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { SITE_URL } from "@/lib/seo";

export function afterPublish(slug: string, previousSlug: string) {
  for (const path of ["/blog", "/sitemap.xml", "/posts-sitemap.xml", "/feed.xml", "/llms.txt"]) revalidatePath(path);
  revalidatePath(`/blog/${slug}`);
  if (previousSlug !== slug) revalidatePath(`/blog/${previousSlug}`);
  revalidatePath("/blog/category/[slug]", "page");
  revalidatePath("/blog/tag/[slug]", "page");
  revalidatePath("/blog/author/[slug]", "page");
  const key = process.env.INDEXNOW_KEY;
  if (!key) return;
  const host = new URL(SITE_URL).host;
  after(() =>
    fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host,
        key,
        keyLocation: `${SITE_URL}/indexnow-key.txt`,
        urlList: [`${SITE_URL}/blog/${slug}`, `${SITE_URL}/blog`],
      }),
      signal: AbortSignal.timeout(5000),
    }).catch(() => null),
  );
}
