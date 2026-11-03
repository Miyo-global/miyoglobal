import { readFile } from "node:fs/promises";
import { join } from "node:path";

export async function GET() {
  const html = await readFile(join(process.cwd(), "public", "404.html"), "utf8");
  return new Response(html, {
    status: 404,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
