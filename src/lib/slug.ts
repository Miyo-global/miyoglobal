const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const RESERVED = new Set(["search", "category", "tag", "author", "page"]);

export function isValidSlug(slug: string): boolean {
  return slug.length > 0 && slug.length <= 96 && SLUG.test(slug) && !RESERVED.has(slug);
}

export function slugify(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96)
    .replace(/-+$/, "");
}
