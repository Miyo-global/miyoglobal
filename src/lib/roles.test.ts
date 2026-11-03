import { describe, expect, it } from "vitest";
import { can } from "./roles";

describe("can", () => {
  it("lets admins do everything", () => {
    expect(can("admin", "manageUsers")).toBe(true);
    expect(can("admin", "customJsonLd")).toBe(true);
  });

  it("limits editors", () => {
    expect(can("editor", "writePosts")).toBe(true);
    expect(can("editor", "manageUsers")).toBe(false);
    expect(can("editor", "customJsonLd")).toBe(false);
    expect(can("editor", "deletePosts")).toBe(false);
  });

  it("denies unknown or missing roles", () => {
    expect(can(undefined, "writePosts")).toBe(false);
    expect(can("viewer", "writePosts")).toBe(false);
  });
});
