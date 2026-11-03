import { readObject } from "@/server/storage";

export async function GET(_req: Request, ctx: { params: Promise<{ key: string }> }) {
  const { key } = await ctx.params;
  const object = await readObject(key).catch(() => null);
  if (!object) return new Response(null, { status: 404 });
  return new Response(object.body, {
    headers: {
      "Content-Type": key.endsWith(".avif") ? "image/avif" : "image/webp",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
