#!/usr/bin/env node
// Fails when a hex colour appears in public-site code outside the token files. Studio keeps its own palette and is not checked.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOTS = ["src/app/(site)", "src/app/blog", "src/components", "src/views", "src/styles", "src/app/not-found.tsx", "src/app/manifest.ts"];
const ALLOW = new Set(["src/styles/tokens.css", "src/styles/tokens.ts"]);
const SKIP = /(^|\/)(studio|node_modules)(\/|$)|\.test\.tsx?$/;
const HEX = /#[0-9a-fA-F]{3,8}\b(?![\w-])/g;

const files = [];
const walk = (p) => {
  let st;
  try {
    st = statSync(p);
  } catch {
    return;
  }
  if (st.isDirectory()) for (const f of readdirSync(p)) walk(join(p, f));
  else if (/\.(css|tsx?|mjs)$/.test(p)) files.push(p);
};
ROOTS.forEach(walk);

const bad = [];
for (const f of files) {
  const rel = relative(process.cwd(), f);
  if (ALLOW.has(rel) || SKIP.test(rel)) continue;
  readFileSync(f, "utf8")
    .split("\n")
    .forEach((line, i) => {
      // Skip URL fragments and anchors such as href="#apply" or "/page#models".
      const hits = [...line.matchAll(HEX)].filter((m) => !/["'`/]$/.test(line.slice(0, m.index)) && !/[\w-]$/.test(line.slice(0, m.index)));
      for (const m of hits) bad.push(`${rel}:${i + 1}  ${m[0]}`);
    });
}
// Arbitrary Tailwind values (w-[37px], text-[13px]) bypass the scale; only token utilities may be used.
for (const f of files) {
  const rel = relative(process.cwd(), f);
  if (!/\.tsx$/.test(rel) || SKIP.test(rel)) continue;
  readFileSync(f, "utf8")
    .split("\n")
    .forEach((line, i) => {
      for (const m of line.matchAll(/className=[^>]*?\b[a-z-]+-\[[^\]]+\]/g)) bad.push(`${rel}:${i + 1}  arbitrary value ${m[0].slice(-30)}`);
    });
}
if (bad.length) {
  console.error(`Hex colours outside src/styles/tokens.css:\n${bad.join("\n")}`);
  process.exit(1);
}
console.log(`tokens: ${files.length} files clean`);
