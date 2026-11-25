/**
 * Visual and structural QA of the public site: full-page screenshots at 375, 768 and 1440 px for every main route, plus a
 * report of title, description, canonical, og:image, h1 count, heading-level skips, JSON-LD types and horizontal overflow.
 * Usage: BASE=http://localhost:3002 OUT=qa-artifacts/after pnpm exec tsx scripts/qa-screens.mts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { chromium } from "@playwright/test";

const BASE = process.env.BASE ?? "http://localhost:3002";
const OUT = process.env.OUT ?? "qa-artifacts/after";
const WIDTHS = [375, 768, 1440];

const browser = await chromium.launch();
const probe = await browser.newPage();

// Discover one job, one post and one category from the live pages so the run never depends on fixed slugs.
async function firstHref(path: string, prefix: string, exclude: RegExp) {
  await probe.goto(BASE + path, { waitUntil: "domcontentloaded" });
  const hrefs = (await probe.evaluate(`Array.from(document.querySelectorAll("a[href]")).map(function (a) { return a.getAttribute("href") || ""; })`)) as string[];
  return hrefs.find((h) => h.startsWith(prefix) && h !== prefix && !exclude.test(h)) ?? null;
}
const job = await firstHref("/jobs", "/jobs/", /\?/);
const post = await firstHref("/blog", "/blog/", /\/(page|category|tag|author|search)(\/|$)/);
const category = await firstHref("/blog", "/blog/category/", /$^/);

const routes: [string, string | null][] = [
  ["home", "/"],
  ["staffing", "/staffing-solutions"],
  ["digital", "/digital-solutions"],
  ["case-studies", "/case-studies"],
  ["about", "/about"],
  ["contact", "/contact"],
  ["jobs", "/jobs"],
  ["job", job],
  ["referrals", "/referrals"],
  ["blog", "/blog"],
  ["post", post],
  ["category", category],
  ["privacy", "/privacy-policy"],
  ["404", "/this-page-does-not-exist"],
];

mkdirSync(OUT, { recursive: true });
const report: Record<string, unknown>[] = [];

for (const width of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
  await ctx.addInitScript({ content: 'localStorage.setItem("miyo-consent", "1")' });
  const page = await ctx.newPage();
  for (const [name, path] of routes) {
    if (!path) {
      report.push({ name, width, error: "no URL found" });
      continue;
    }
    const res = await page.goto(BASE + path, { waitUntil: "networkidle" });
    await page.evaluate("document.fonts.ready");
    // A string, not a function: tsx/esbuild would inject a __name helper that does not exist in the browser.
    const info = (await page.evaluate(`(() => {
      var meta = function (sel) { var el = document.querySelector(sel); return el ? el.getAttribute("content") || el.getAttribute("href") : null; };
      var levels = Array.from(document.querySelectorAll("main h1, main h2, main h3, main h4")).map(function (h) { return Number(h.tagName[1]); });
      var skips = levels.filter(function (l, i) { return i > 0 && l - levels[i - 1] > 1; }).length;
      var types = Array.from(document.querySelectorAll('script[type="application/ld+json"]')).flatMap(function (s) {
        try { var d = JSON.parse(s.textContent || "{}"); return (d["@graph"] || [d]).map(function (n) { return n["@type"]; }); } catch (e) { return ["INVALID"]; }
      });
      return {
        title: document.title,
        description: meta('meta[name="description"]'),
        canonical: meta('link[rel="canonical"]'),
        ogImage: meta('meta[property="og:image"]'),
        robots: meta('meta[name="robots"]'),
        h1: document.querySelectorAll("h1").length,
        headingSkips: skips,
        jsonLd: types,
        imgsNoAlt: Array.from(document.querySelectorAll("img")).filter(function (i) { return !i.hasAttribute("alt"); }).length,
        overflow: document.documentElement.scrollWidth > window.innerWidth,
      };
    })()`)) as Record<string, unknown>;
    await page.screenshot({ path: `${OUT}/${name}-${width}.png`, fullPage: true });
    report.push({ name, width, path, status: res?.status(), ...info });
  }
  await ctx.close();
}

await browser.close();
writeFileSync(`${OUT}/report.json`, JSON.stringify(report, null, 2));
for (const r of report.filter((r) => r.width === 1440)) console.log(JSON.stringify(r));
const problems = report.filter((r) => r.error || r.overflow || (r.name !== "404" && r.h1 !== 1) || (r.headingSkips as number) > 0 || (r.imgsNoAlt as number) > 0);
console.log(problems.length ? `PROBLEMS:\n${problems.map((p) => JSON.stringify({ n: p.name, w: p.width, h1: p.h1, skips: p.headingSkips, overflow: p.overflow, noAlt: p.imgsNoAlt, err: p.error })).join("\n")}` : "No structural problems.");
