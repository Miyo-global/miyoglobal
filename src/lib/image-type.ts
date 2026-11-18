export type ImageType = "jpeg" | "png" | "webp" | "avif";

const tagAt = (b: Uint8Array, o: number) => String.fromCharCode(b[o], b[o + 1], b[o + 2], b[o + 3]);

function ftypBrands(b: Uint8Array): string[] {
  if (b.length < 12 || tagAt(b, 4) !== "ftyp") return [];
  const end = Math.min(((b[0] << 24) | (b[1] << 16) | (b[2] << 8) | b[3]) >>> 0, b.length);
  const brands = [tagAt(b, 8)];
  for (let o = 16; o + 4 <= end; o += 4) brands.push(tagAt(b, o));
  return brands;
}

const AVIF_BRANDS = ["avif", "avis"];
const HEIC_BRANDS = ["heic", "heix", "hevc", "hevx", "heim", "heis", "hevm", "hevs"];

export function detectImage(b: Uint8Array): ImageType | null {
  if (b.length < 12) return null;
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "jpeg";
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "png";
  if (tagAt(b, 0) === "RIFF" && tagAt(b, 8) === "WEBP") return "webp";
  if (ftypBrands(b).some((brand) => AVIF_BRANDS.includes(brand))) return "avif";
  return null;
}

export function isHeic(b: Uint8Array): boolean {
  const brands = ftypBrands(b);
  return brands.some((brand) => HEIC_BRANDS.includes(brand)) && !brands.some((brand) => AVIF_BRANDS.includes(brand));
}

export function validateAlt(alt: string): string | null {
  const words = alt.trim().split(/\s+/).filter(Boolean).length;
  if (words < 8 || words > 20) return "Alt text must describe the image in 8-20 words";
  if (alt.length > 200) return "Alt text is too long";
  return null;
}

export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
export const MIN_UPLOAD_WIDTH = 1200;
