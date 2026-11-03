export type ImageType = "jpeg" | "png" | "webp" | "avif";

export function detectImage(b: Uint8Array): ImageType | null {
  if (b.length < 12) return null;
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "jpeg";
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "png";
  const tag = (o: number) => String.fromCharCode(b[o], b[o + 1], b[o + 2], b[o + 3]);
  if (tag(0) === "RIFF" && tag(8) === "WEBP") return "webp";
  if (tag(4) === "ftyp" && (tag(8) === "avif" || tag(8) === "avis")) return "avif";
  return null;
}

export function validateAlt(alt: string): string | null {
  const words = alt.trim().split(/\s+/).filter(Boolean).length;
  if (words < 8 || words > 20) return "Alt text must describe the image in 8-20 words";
  if (alt.length > 200) return "Alt text is too long";
  return null;
}

export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
export const MIN_UPLOAD_WIDTH = 1200;
