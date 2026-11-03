import { slugify } from "./slug";

export type Mark = { type: string; attrs?: Record<string, unknown> };
export type DocNode = {
  type: string;
  attrs?: Record<string, unknown>;
  content?: DocNode[];
  text?: string;
  marks?: Mark[];
};
export type Doc = DocNode;
export type TocItem = { id: string; text: string; level: 2 | 3 };

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

export function safeUrl(url: unknown): string | null {
  if (typeof url !== "string") return null;
  const u = url.trim();
  if (/^(https?:\/\/|mailto:|\/(?!\/)|#)/i.test(u)) return u;
  return null;
}

export function nodeText(node: DocNode): string {
  if (node.text) return node.text;
  return (node.content ?? []).map(nodeText).join(node.type === "doc" || node.type === "listItem" ? " " : "");
}

export function plainText(doc: Doc): string {
  return (doc.content ?? []).map(nodeText).join("\n");
}

export function wordCount(doc: Doc): number {
  const t = plainText(doc).trim();
  return t ? t.split(/\s+/).length : 0;
}

export function readingMinutes(doc: Doc): number {
  return Math.max(1, Math.ceil(wordCount(doc) / 220));
}

export function collect(doc: Doc, type: string): DocNode[] {
  const out: DocNode[] = [];
  const walk = (n: DocNode) => {
    if (n.type === type) out.push(n);
    n.content?.forEach(walk);
  };
  walk(doc);
  return out;
}

export function headingIds(doc: Doc): TocItem[] {
  const seen = new Map<string, number>();
  return collect(doc, "heading")
    .filter((h) => h.attrs?.level === 2 || h.attrs?.level === 3)
    .map((h) => {
      const text = nodeText(h).trim();
      const base = slugify(text) || "section";
      const n = seen.get(base) ?? 0;
      seen.set(base, n + 1);
      return { id: n ? `${base}-${n + 1}` : base, text, level: h.attrs?.level as 2 | 3 };
    });
}

function marks(text: string, ms: Mark[] = []): string {
  return ms.reduce((html, m) => {
    if (m.type === "bold") return `<strong>${html}</strong>`;
    if (m.type === "italic") return `<em>${html}</em>`;
    if (m.type === "code") return `<code>${html}</code>`;
    if (m.type === "link") {
      const href = safeUrl(m.attrs?.href);
      if (!href) return html;
      const external = /^https?:\/\//i.test(href);
      return `<a href="${esc(href)}"${external ? ' rel="noopener noreferrer" target="_blank"' : ""}>${html}</a>`;
    }
    return html;
  }, esc(text));
}

export function renderHtml(doc: Doc): string {
  const ids = headingIds(doc);
  let h = 0;
  const kids = (n: DocNode) => (n.content ?? []).map(block).join("");
  const inline = (n: DocNode): string => {
    if (n.type === "text") return marks(n.text ?? "", n.marks);
    if (n.type === "hardBreak") return "<br>";
    return "";
  };
  const inlines = (n: DocNode) => (n.content ?? []).map(inline).join("");
  const block = (n: DocNode): string => {
    switch (n.type) {
      case "paragraph":
        return `<p>${inlines(n)}</p>`;
      case "heading": {
        const level = n.attrs?.level;
        if (level !== 2 && level !== 3) return `<p>${inlines(n)}</p>`;
        const id = ids[h++]?.id ?? "section";
        return `<h${level} id="${esc(id)}">${inlines(n)}</h${level}>`;
      }
      case "bulletList":
        return `<ul>${kids(n)}</ul>`;
      case "orderedList":
        return `<ol>${kids(n)}</ol>`;
      case "listItem":
        return `<li>${kids(n)}</li>`;
      case "blockquote":
        return `<blockquote>${kids(n)}</blockquote>`;
      case "codeBlock":
        return `<pre><code>${esc(nodeText(n))}</code></pre>`;
      case "horizontalRule":
        return "<hr>";
      case "image": {
        const src = safeUrl(n.attrs?.src);
        if (!src) return "";
        const w = Number(n.attrs?.width) || 0;
        const hh = Number(n.attrs?.height) || 0;
        const dims = w && hh ? ` width="${w}" height="${hh}"` : "";
        return `<figure><img src="${esc(src)}" alt="${esc(String(n.attrs?.alt ?? ""))}"${dims} loading="lazy" decoding="async"></figure>`;
      }
      default:
        return "";
    }
  };
  return kids(doc);
}
