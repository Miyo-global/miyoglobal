import { readLocal } from "@/server/storage";

export async function GET(_req: Request, ctx: { params: Promise<{ name: string }> }) {
  const { name } = await ctx.params;
  const file = await readLocal(name);
  if (!file) return new Response(null, { status: 404 });
  return new Response(new Uint8Array(file), {
    headers: {
      "Content-Type": name.endsWith(".avif") ? "image/avif" : "image/webp",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
