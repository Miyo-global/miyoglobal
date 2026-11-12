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

/** Key-order-independent JSON, since Postgres jsonb reorders object keys. */
export function canonical(v: unknown): string {
  return JSON.stringify(v, (_, x) => (x && typeof x === "object" && !Array.isArray(x) ? Object.fromEntries(Object.entries(x).sort(([a], [b]) => (a < b ? -1 : 1))) : x));
}

const INLINE_PARENTS = new Set(["paragraph", "heading", "codeBlock"]);

export function nodeText(node: DocNode): string {
  if (node.text) return node.text;
  if (node.type === "hardBreak") return " ";
  return (node.content ?? []).map(nodeText).join(INLINE_PARENTS.has(node.type) ? "" : " ");
}

export function plainText(doc: Doc): string {
  return (doc.content ?? []).map(nodeText).join("\n");
}

export function wordCount(doc: Doc): number {
  const t = plainText(doc).trim();
  return t ? t.split(/\s+/).length : 0;
}

/** 0 for an empty body, otherwise at least 1. */
export function readingMinutes(doc: Doc): number {
  return Math.ceil(wordCount(doc) / 220);
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

const int = (v: unknown, min: number, max: number) => {
  const n = Number(v);
  return Number.isInteger(n) && n >= min && n <= max ? n : null;
};
const str = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : null);
const cellAttrs = (a: Record<string, unknown>) => ({
  colspan: int(a.colspan, 1, 50) ?? 1,
  rowspan: int(a.rowspan, 1, 50) ?? 1,
  colwidth: Array.isArray(a.colwidth) && a.colwidth.every((w) => int(w, 1, 4000) !== null) ? a.colwidth.map(Number) : null,
});

/** Allowed node types and the attrs each may keep; anything else is dropped on save. */
const NODE_ATTRS: Record<string, ((a: Record<string, unknown>) => Record<string, unknown> | null) | null> = {
  doc: null,
  paragraph: null,
  text: null,
  hardBreak: null,
  bulletList: null,
  orderedList: (a) => ({ start: int(a.start, 0, 100000) ?? 1 }),
  listItem: null,
  blockquote: null,
  codeBlock: (a) => ({ language: str(a.language, 30) }),
  horizontalRule: null,
  heading: (a) => {
    const level = int(a.level, 2, 6);
    return level ? { level } : null;
  },
  image: (a) => {
    const src = safeUrl(a.src);
    return src ? { src, alt: str(a.alt, 300) ?? "", title: str(a.title, 300), width: int(a.width, 1, 10000), height: int(a.height, 1, 10000) } : null;
  },
  table: null,
  tableRow: null,
  tableHeader: cellAttrs,
  tableCell: cellAttrs,
};

function cleanMark(m: Mark): Mark | null {
  if (m.type === "bold" || m.type === "italic" || m.type === "code") return { type: m.type };
  if (m.type === "link") {
    const href = safeUrl(m.attrs?.href);
    return href ? { type: "link", attrs: { href } } : null;
  }
  return null;
}

/** Whitelist a TipTap doc: unknown nodes, marks and attrs are removed; headings outside H2-H6 become paragraphs. */
export function sanitizeDoc(node: DocNode): DocNode | null {
  let type = node?.type;
  if (typeof type !== "string" || !(type in NODE_ATTRS)) return null;
  const pick = NODE_ATTRS[type];
  let attrs = pick ? pick(node.attrs ?? {}) : undefined;
  if (pick && !attrs) {
    if (type !== "heading") return null;
    type = "paragraph";
    attrs = undefined;
  }
  const out: DocNode = { type };
  if (attrs) out.attrs = attrs;
  if (type === "text") {
    if (typeof node.text !== "string" || !node.text) return null;
    out.text = node.text;
    const ms = (node.marks ?? []).map(cleanMark).filter((m): m is Mark => !!m);
    if (ms.length) out.marks = ms;
    return out;
  }
  if (Array.isArray(node.content)) out.content = node.content.map(sanitizeDoc).filter((n): n is DocNode => !!n);
  return out;
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
  const span = (n: DocNode, attr: "colspan" | "rowspan") => {
    const v = int(n.attrs?.[attr], 2, 50);
    return v ? ` ${attr}="${v}"` : "";
  };
  const block = (n: DocNode): string => {
    switch (n.type) {
      case "paragraph":
        return `<p>${inlines(n)}</p>`;
      case "heading": {
        const level = int(n.attrs?.level, 2, 6);
        if (!level) return `<p>${inlines(n)}</p>`;
        if (level > 3) return `<h${level}>${inlines(n)}</h${level}>`;
        const id = ids[h++]?.id ?? "section";
        return `<h${level} id="${esc(id)}">${inlines(n)}</h${level}>`;
      }
      case "table":
        return `<div class="b-table" role="region" aria-label="Table" tabindex="0"><table><tbody>${kids(n)}</tbody></table></div>`;
      case "tableRow":
        return `<tr>${kids(n)}</tr>`;
      case "tableHeader":
        return `<th${span(n, "colspan")}${span(n, "rowspan")}>${kids(n)}</th>`;
      case "tableCell":
        return `<td${span(n, "colspan")}${span(n, "rowspan")}>${kids(n)}</td>`;
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
