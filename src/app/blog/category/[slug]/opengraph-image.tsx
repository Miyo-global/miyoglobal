import { notFound } from "next/navigation";
import { getCategory } from "@/server/services/public";
import { listingCard, SHARE_SIZE } from "@/views/blog/share-card";

export const alt = "MIYO Journal category from MIYO Global";
export const size = SHARE_SIZE;
export const contentType = "image/png";
export const revalidate = 300;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const item = await getCategory((await params).slug);
  if (!item) notFound();
  return listingCard("Category", item.name, "Articles from MIYO Global");
}
