import { notFound } from "next/navigation";
import { getTag } from "@/server/services/public";
import { listingCard, SHARE_SIZE } from "@/views/blog/share-card";

export const alt = "MIYO Journal tag from MIYO Global";
export const size = SHARE_SIZE;
export const contentType = "image/png";
export const revalidate = 300;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const item = await getTag((await params).slug);
  if (!item) notFound();
  return listingCard("Tag", item.name, "Articles from MIYO Global");
}
