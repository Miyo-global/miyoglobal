import { describe, expect, it } from "vitest";
import { detectImage, validateAlt } from "./image-type";

const bytes = (...n: number[]) => Uint8Array.from([...n, ...new Array(16).fill(0)]);

describe("detectImage", () => {
  it("detects by magic bytes", () => {
    expect(detectImage(bytes(0xff, 0xd8, 0xff, 0xe0))).toBe("jpeg");
    expect(detectImage(bytes(0x89, 0x50, 0x4e, 0x47))).toBe("png");
    const webp = new TextEncoder().encode("RIFF0000WEBPVP8 ");
    expect(detectImage(webp)).toBe("webp");
  });
  it("rejects svg and text", () => {
    expect(detectImage(new TextEncoder().encode("<svg xmlns='x'></svg>"))).toBeNull();
    expect(detectImage(new TextEncoder().encode("GIF89a......"))).toBeNull();
  });
});

describe("validateAlt", () => {
  it("requires 8-20 words", () => {
    expect(validateAlt("too short")).not.toBeNull();
    expect(validateAlt("a recruiter reviewing candidate resumes at a modern office desk")).toBeNull();
    expect(validateAlt(Array(21).fill("word").join(" "))).not.toBeNull();
  });
});
