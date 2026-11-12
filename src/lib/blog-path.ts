/** Blog URLs whose existence depends on the database. Anything else returns null (Next routing decides). */
export type BlogTarget =
  | { kind: "post" | "author" | "category" | "tag"; slug: string }
  | { kind: "page"; n: number };

export function parseBlogPath(pathname: string): BlogTarget | null {
  const m = /^\/blog\/(?:(author|category|tag|page)\/)?([^/]+)$/.exec(pathname);
  if (!m) return null;
  const [, kind, seg] = m;
  if (!kind) return seg === "search" ? null : { kind: "post", slug: seg };
  if (kind === "page") return { kind: "page", n: /^\d+$/.test(seg) ? Number(seg) : NaN };
  return { kind: kind as "author" | "category" | "tag", slug: seg };
}
