import { SITE_NAME } from "../../lib/seo";

/**
 * <title> for a post. A Studio meta title is used as written. Otherwise the post title gets " | MIYO Global" when the
 * whole thing fits in 60 characters, and goes out bare when it does not: a title is never cut mid-word.
 */
export function postTitle(metaTitle: string, title: string): string {
  const base = (metaTitle || title).trim();
  if (base.includes("|")) return base;
  const branded = `${base} | ${SITE_NAME}`;
  return branded.length <= 60 ? branded : base;
}

/** The shared Studio admin account ("MIYO Admin", "Admin") writes as the company, not as a person. */
export const isOrgAuthor = (name: string) => /^(miyo(\s+global)?\s+)?(admin|administrator|team|editorial)$/i.test(name.trim());

/** Name to print for an author: the company for the admin account, the person otherwise. */
export const authorName = (name: string) => (isOrgAuthor(name) ? SITE_NAME : name);
