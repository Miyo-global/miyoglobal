import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { raw } from "./tokens";

const css = readFileSync(new URL("./tokens.css", import.meta.url), "utf8");
const kebab = (k: string) => k.replace(/([A-Z0-9])/g, (c) => `-${c.toLowerCase()}`).replace("navy-2", "navy-2");

describe("tokens.ts mirrors tokens.css", () => {
  it.each(Object.entries(raw))("%s", (key, hex) => {
    const name = key === "navy2" ? "navy-2" : kebab(key);
    expect(css).toContain(`--raw-${name}: ${hex};`);
  });
});
