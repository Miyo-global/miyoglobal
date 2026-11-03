import { describe, expect, it } from "vitest";
import { headingIds, readingMinutes, renderHtml, safeUrl, type Doc } from "./content";
import { checkHealth } from "./health";
import { planRedirect } from "./redirects";
import { fromIstInput, toIstInput } from "./ist";
import { normalizeHost } from "./hosts";
import { jsonLdScript, parseCustomJsonLd, titleFor } from "./seo";
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
