import { describe, expect, it } from "vitest";
import { authorName, isOrgAuthor, postTitle } from "./meta";

describe("postTitle", () => {
  it("brands short titles and never truncates long ones", () => {
    expect(postTitle("", "What Is a GCC?")).toBe("What Is a GCC? | MIYO Global");
    const long = "What Is a GCC? Inside the Global Capability Centre Model for Indian Enterprises";
    expect(postTitle("", long)).toBe(long);
    expect(postTitle("Own | Brand", "ignored")).toBe("Own | Brand");
    expect(postTitle("Meta first", "Title")).toBe("Meta first | MIYO Global");
  });
});

describe("isOrgAuthor", () => {
  it("treats the admin account as the organisation", () => {
    expect(isOrgAuthor("MIYO Admin")).toBe(true);
    expect(isOrgAuthor("admin")).toBe(true);
    expect(isOrgAuthor("MIYO Global Team")).toBe(true);
    expect(isOrgAuthor("Sudheer Reddy")).toBe(false);
    expect(authorName("MIYO Admin")).toBe("MIYO Global");
    expect(authorName("Sudheer Reddy")).toBe("Sudheer Reddy");
  });
});
