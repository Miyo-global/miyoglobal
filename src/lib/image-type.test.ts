import { describe, expect, it } from "vitest";
import { detectImage, isHeic, validateAlt } from "./image-type";

const bytes = (...n: number[]) => Uint8Array.from([...n, ...new Array(16).fill(0)]);

describe("detectImage", () => {
  it("detects by magic bytes", () => {
    expect(detectImage(bytes(0xff, 0xd8, 0xff, 0xe0))).toBe("jpeg");
    expect(detectImage(bytes(0x89, 0x50, 0x4e, 0x47))).toBe("png");
    const webp = new TextEncoder().encode("RIFF0000WEBPVP8 ");
    expect(detectImage(webp)).toBe("webp");
  });
  const ftyp = (...brands: string[]) => {
    const body = new TextEncoder().encode(`ftyp${brands[0]}\0\0\0\0${brands.slice(1).join("")}`);
    const out = new Uint8Array(body.length + 4 + 16);
    new DataView(out.buffer).setUint32(0, body.length + 4);
    out.set(body, 4);
    return out;
  };
  it("detects avif by major or compatible brand", () => {
    expect(detectImage(ftyp("avif", "mif1"))).toBe("avif");
    expect(detectImage(ftyp("mif1", "avif", "miaf"))).toBe("avif");
  });
  it("flags heic so it gets a specific message", () => {
    expect(detectImage(ftyp("heic", "mif1"))).toBeNull();
    expect(isHeic(ftyp("heic", "mif1"))).toBe(true);
    expect(isHeic(ftyp("mif1", "heic"))).toBe(true);
    expect(isHeic(ftyp("mif1", "avif"))).toBe(false);
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
