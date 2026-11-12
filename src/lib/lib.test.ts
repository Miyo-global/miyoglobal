import { describe, expect, it } from "vitest";
import { parseBlogPath } from "./blog-path";
import { canonical, headingIds, isPublished, readingMinutes, renderHtml, safeUrl, sanitizeDoc, wordCount, type Doc } from "./content";
import { checkHealth } from "./health";
import { planRedirect } from "./redirects";
import { fromIstInput, toIstInput } from "./ist";
import { normalizeHost } from "./hosts";
import { BLOG_NAME, BLOG_TITLE, jsonLdScript, parseCustomJsonLd, titleFor } from "./seo";
import { isValidSlug, slugify } from "./slug";

const p = (text: string) => ({ type: "paragraph", content: [{ type: "text", text }] });
const h = (level: number, text: string) => ({ type: "heading", attrs: { level }, content: [{ type: "text", text }] });

describe("slug", () => {
  it("validates kebab case", () => {
    expect(isValidSlug("hello-world-2")).toBe(true);
    expect(isValidSlug("Hello")).toBe(false);
    expect(isValidSlug("a--b")).toBe(false);
    expect(isValidSlug("-a")).toBe(false);
    expect(isValidSlug("")).toBe(false);
    expect(isValidSlug("search")).toBe(false);
  });
  it("slugifies", () => {
    expect(slugify("  Café & Co: 10 Tips!  ")).toBe("cafe-co-10-tips");
  });
});

describe("content", () => {
  const doc: Doc = { type: "doc", content: [h(2, "What is GCC?"), p("Body"), h(2, "What is GCC?"), h(3, "Sub")] };
  it("dedupes heading ids", () => {
    expect(headingIds(doc).map((t) => t.id)).toEqual(["what-is-gcc", "what-is-gcc-2", "sub"]);
  });
  it("escapes html and blocks bad urls", () => {
    const evil: Doc = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "<script>x</script>", marks: [{ type: "link", attrs: { href: "javascript:alert(1)" } }] }],
        },
        { type: "image", attrs: { src: "data:text/html,x", alt: "a" } },
      ],
    };
    const html = renderHtml(evil);
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("javascript:");
    expect(html).not.toContain("<img");
    expect(safeUrl("//evil.com")).toBeNull();
    expect(safeUrl("/blog/x")).toBe("/blog/x");
  });
  it("computes reading time", () => {
    expect(readingMinutes({ type: "doc", content: [p("word ".repeat(441))] })).toBe(3);
    expect(readingMinutes({ type: "doc", content: [p("one")] })).toBe(1);
    expect(readingMinutes({ type: "doc", content: [{ type: "paragraph" }] })).toBe(0);
    const br: Doc = { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "one" }, { type: "hardBreak" }, { type: "text", text: "two" }, { type: "text", text: "three", marks: [{ type: "bold" }] }] }] };
    expect(wordCount(br)).toBe(2);
  });

  const cell = (type: string, text: string, attrs: Record<string, unknown> = { colspan: 1, rowspan: 1, colwidth: null }) => ({ type, attrs, content: [p(text)] });
  const table: Doc = {
    type: "table",
    content: [
      { type: "tableRow", content: [cell("tableHeader", "Role"), cell("tableHeader", "Rate")] },
      { type: "tableRow", content: [cell("tableCell", "Engineer"), cell("tableCell", "<b>high</b>", { colspan: 2, rowspan: 1, colwidth: null })] },
    ],
  };

  it("renders H4-H6 without TOC ids and keeps H2/H3 ids", () => {
    const d: Doc = { type: "doc", content: [h(2, "Intro"), h(4, "Four"), h(5, "Five"), h(6, "Six"), h(3, "Sub")] };
    const html = renderHtml(d);
    expect(html).toContain('<h2 id="intro">Intro</h2>');
    expect(html).toContain("<h4>Four</h4><h5>Five</h5><h6>Six</h6>");
    expect(html).toContain('<h3 id="sub">Sub</h3>');
    expect(headingIds(d).map((t) => t.text)).toEqual(["Intro", "Sub"]);
    expect(renderHtml({ type: "doc", content: [h(7, "x")] })).toBe("<p>x</p>");
  });

  it("renders tables in a scroll wrapper with escaped cells", () => {
    const html = renderHtml({ type: "doc", content: [table] });
    expect(html).toMatch(/^<div class="b-table"[^>]*><table><tbody><tr><th><p>Role<\/p><\/th>/);
    expect(html).toContain('<td colspan="2"><p>&lt;b&gt;high&lt;/b&gt;</p></td>');
    expect(wordCount({ type: "doc", content: [table] })).toBe(4);
  });

  it("sanitizes docs on save", () => {
    const dirty = {
      type: "doc",
      content: [
        { type: "heading", attrs: { level: 1, onclick: "x" }, content: [{ type: "text", text: "Title" }] },
        { type: "heading", attrs: { level: 4 }, content: [{ type: "text", text: "Four", marks: [{ type: "link", attrs: { href: "javascript:x", class: "y" } }, { type: "bold" }, { type: "evil" }] }] },
        { type: "iframe", attrs: { src: "https://evil" } },
        { type: "image", attrs: { src: "data:x", alt: "a" } },
        { type: "table", attrs: { style: "x" }, content: [{ type: "tableRow", content: [{ type: "tableCell", attrs: { colspan: 999, rowspan: "2", colwidth: ["a"], style: "x" }, content: [p("c")] }] }] },
        { type: "paragraph", content: [{ type: "text", text: "go", marks: [{ type: "link", attrs: { href: "/blog", target: "_blank" } }] }] },
      ],
    };
    expect(sanitizeDoc(dirty)).toEqual({
      type: "doc",
      content: [
        { type: "paragraph", content: [{ type: "text", text: "Title" }] },
        { type: "heading", attrs: { level: 4 }, content: [{ type: "text", text: "Four", marks: [{ type: "bold" }] }] },
        { type: "table", content: [{ type: "tableRow", content: [{ type: "tableCell", attrs: { colspan: 1, rowspan: 2, colwidth: null }, content: [p("c")] }] }] },
        { type: "paragraph", content: [{ type: "text", text: "go", marks: [{ type: "link", attrs: { href: "/blog" } }] }] },
      ],
    });
    expect(sanitizeDoc({ type: "script" })).toBeNull();
  });

  it("compares JSON independent of key order", () => {
    expect(canonical({ b: 1, a: { d: [1, { y: 1, x: 2 }], c: null } })).toBe(canonical({ a: { c: null, d: [1, { x: 2, y: 1 }] }, b: 1 }));
    expect(canonical({ a: [1, 2] })).not.toBe(canonical({ a: [2, 1] }));
  });
});

describe("health", () => {
  const base = {
    title: "GCC staffing guide",
    slug: "gcc-staffing-guide",
    metaTitle: "GCC staffing guide | MIYO",
    metaDescription: "x".repeat(150),
    focusKeyword: "gcc staffing",
    quickAnswer: "answer",
    doc: { type: "doc", content: [h(2, "Why gcc staffing"), p("gcc staffing intro")] } as Doc,
    coverAlt: "alt",
    hasCover: true,
  };
  it("flags missing alt as error", () => {
    const doc: Doc = { type: "doc", content: [{ type: "image", attrs: { src: "/a.webp", alt: "" } }] };
    expect(checkHealth({ ...base, doc }).some((i) => i.level === "error" && i.code === "alt")).toBe(true);
  });
  it("warns on thin content without blocking", () => {
    const issues = checkHealth(base);
    expect(issues.find((i) => i.code === "thin")?.level).toBe("warn");
    expect(issues.some((i) => i.level === "error")).toBe(false);
  });
});

describe("redirects", () => {
  it("collapses chains", () => {
    const r = planRedirect([{ fromPath: "/blog/a", toPath: "/blog/b" }], "/blog/b", "/blog/c");
    expect(r.upsert).toContainEqual({ fromPath: "/blog/a", toPath: "/blog/c" });
    expect(r.upsert).toContainEqual({ fromPath: "/blog/b", toPath: "/blog/c" });
  });
  it("prevents loops when reverting", () => {
    const r = planRedirect([{ fromPath: "/blog/a", toPath: "/blog/b" }], "/blog/b", "/blog/a");
    expect(r.remove).toEqual(["/blog/a"]);
    expect(r.upsert).toEqual([{ fromPath: "/blog/b", toPath: "/blog/a" }]);
  });
});

describe("redirect chains", () => {
  it("collapses a 3-hop chain to the final URL with no loop", () => {
    let rows = [{ fromPath: "/blog/a", toPath: "/blog/b" }];
    const apply = (from: string, to: string) => {
      const plan = planRedirect(rows, from, to);
      const kept = rows.filter((r) => !plan.remove.includes(r.fromPath) && !plan.upsert.some((u) => u.fromPath === r.fromPath));
      rows = [...kept, ...plan.upsert];
    };
    apply("/blog/b", "/blog/c");
    apply("/blog/c", "/blog/d");
    expect(rows.every((r) => r.toPath === "/blog/d")).toBe(true);
    expect(rows.map((r) => r.fromPath).sort()).toEqual(["/blog/a", "/blog/b", "/blog/c"]);
    apply("/blog/d", "/blog/a");
    expect(rows.some((r) => r.fromPath === "/blog/a")).toBe(false);
    expect(rows.every((r) => r.toPath === "/blog/a")).toBe(true);
  });
});

describe("ist", () => {
  it("round trips IST input", () => {
    expect(fromIstInput("2026-11-03T10:30")).toBe("2026-11-03T05:00:00.000Z");
    expect(toIstInput("2026-11-03T05:00:00.000Z")).toBe("2026-11-03T10:30");
    expect(fromIstInput("")).toBeNull();
  });
});

describe("hosts and titles", () => {
  it("ignores port, trailing dot and case", () => {
    expect(normalizeHost("ADM.miyoglobal.com.:443")).toBe("adm.miyoglobal.com");
  });
  it("keeps titles within 60 chars with brand", () => {
    expect(titleFor("", "x".repeat(90)).length).toBeLessThanOrEqual(60);
    expect(titleFor("Short", "")).toBe("Short | MIYO Global");
    expect(titleFor("Own | Brand", "")).toBe("Own | Brand");
  });
});

describe("json-ld", () => {
  it("escapes script breakouts", () => {
    expect(jsonLdScript({ a: "</script><b>" })).not.toContain("</script>");
  });
  it("rejects invalid, Product and non-object input", () => {
    expect(parseCustomJsonLd("{").ok).toBe(false);
    expect(parseCustomJsonLd('{"@type":"Product"}').ok).toBe(false);
    expect(parseCustomJsonLd("5").ok).toBe(false);
    expect(parseCustomJsonLd('{"@type":"Organization"}').ok).toBe(true);
  });
});

describe("editor marks and tables (MG-213, MG-4)", () => {
  const p = (...marks: string[]): Doc => ({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "x", marks: marks.map((type) => ({ type })) }] }] });

  it("keeps underline and inline code through sanitize and renders them", () => {
    const doc = sanitizeDoc(p("underline", "code", "strike")) as Doc;
    expect(doc.content?.[0].content?.[0].marks).toEqual([{ type: "underline" }, { type: "code" }]);
    expect(renderHtml(doc)).toBe("<p><code><u>x</u></code></p>");
  });

  const cell = (type: string, text: string, attrs: Record<string, unknown> = {}) => ({ type, attrs, content: [{ type: "paragraph", content: [{ type: "text", text }] }] });

  it("keeps a TipTap table through sanitize and renders colwidth as a colgroup", () => {
    const table: Doc = {
      type: "doc",
      content: [{
        type: "table",
        content: [
          { type: "tableRow", content: [cell("tableHeader", "A", { colspan: 1, rowspan: 1, colwidth: [120] }), cell("tableHeader", "B", { colspan: 2, rowspan: 1, colwidth: [80, null] })] },
          { type: "tableRow", content: [cell("tableCell", "1"), cell("tableCell", "2", { colspan: 2 })] },
        ],
      }],
    };
    const html = renderHtml(sanitizeDoc(table) as Doc);
    expect(html).toContain('<colgroup><col style="width:120px"><col><col></colgroup>');
    expect(html).toContain('<th><p>A</p></th><th colspan="2"><p>B</p></th>');
    expect(html).toContain('<td colspan="2"><p>2</p></td>');
  });

  it("emits no colgroup when no widths are set", () => {
    const html = renderHtml({ type: "doc", content: [{ type: "table", content: [{ type: "tableRow", content: [cell("tableCell", "1")] }] }] });
    expect(html).not.toContain("colgroup");
    expect(html).toContain('<div class="b-table"');
  });
});

describe("byline status (MG-8)", () => {
  const at = new Date("2026-01-01");
  it("only says Published for published posts, or archived ones with a publish date", () => {
    expect(isPublished({ status: "published", publishedAt: at })).toBe(true);
    expect(isPublished({ status: "archived", publishedAt: at })).toBe(true);
    expect(isPublished({ status: "scheduled", publishedAt: at })).toBe(false);
    expect(isPublished({ status: "draft", publishedAt: at })).toBe(false);
    expect(isPublished({ status: "published", publishedAt: null })).toBe(false);
  });
});

describe("blog paths checked before render (MG-212)", () => {
  it("maps DB-backed blog URLs and ignores the rest", () => {
    expect(parseBlogPath("/blog/gcc-guide")).toEqual({ kind: "post", slug: "gcc-guide" });
    expect(parseBlogPath("/blog/author/miyo-admin")).toEqual({ kind: "author", slug: "miyo-admin" });
    expect(parseBlogPath("/blog/category/staffing")).toEqual({ kind: "category", slug: "staffing" });
    expect(parseBlogPath("/blog/tag/ai")).toEqual({ kind: "tag", slug: "ai" });
    expect(parseBlogPath("/blog/page/2")).toEqual({ kind: "page", n: 2 });
    expect(parseBlogPath("/blog/page/x")).toEqual({ kind: "page", n: NaN });
    expect(parseBlogPath("/blog/search")).toBeNull();
    expect(parseBlogPath("/blog")).toBeNull();
    expect(parseBlogPath("/blog/gcc-guide/og")).toBeNull();
    expect(parseBlogPath("/about")).toBeNull();
  });
});

describe("blog name (MG-217)", () => {
  it("uses one name for the title and structured data", () => {
    expect(BLOG_NAME).toBe("MIYO Journal");
    expect(BLOG_TITLE).toBe("MIYO Journal | MIYO Global");
  });
});
