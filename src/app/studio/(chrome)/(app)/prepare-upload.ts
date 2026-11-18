import { MAX_UPLOAD_BYTES } from "@/lib/image-type";

const SERVER_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_WIDTH = 2560;
const ATTEMPTS = [
  { width: 2560, quality: 0.9 },
  { width: 2560, quality: 0.8 },
  { width: 2048, quality: 0.8 },
  { width: 1600, quality: 0.75 },
];

export class PrepareError extends Error {}

const isHeicFile = (file: File) => /image\/hei[cf]/i.test(file.type) || /\.hei[cf]$/i.test(file.name);

function toBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
}

function supportsWebp() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  return canvas.toDataURL("image/webp").startsWith("data:image/webp");
}

async function decode(file: File) {
  try {
    return await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    return null;
  }
}

export async function prepareUpload(file: File): Promise<File> {
  if (SERVER_TYPES.includes(file.type) && file.size <= MAX_UPLOAD_BYTES) return file;
  const bitmap = await decode(file);
  if (!bitmap) {
    if (isHeicFile(file)) throw new PrepareError("This browser cannot read HEIC photos. Export the photo as JPEG or PNG, or upload it from Safari.");
    if (file.size > MAX_UPLOAD_BYTES) throw new PrepareError(`This image is larger than ${MAX_UPLOAD_BYTES / 1024 / 1024}MB and could not be compressed in the browser. Export it as a smaller JPEG.`);
    return file;
  }
  const webp = supportsWebp();
  const type = webp ? "image/webp" : "image/jpeg";
  const name = `${file.name.replace(/\.[^.]+$/, "") || "image"}.${webp ? "webp" : "jpg"}`;
  try {
    for (const attempt of ATTEMPTS) {
      const scale = Math.min(1, Math.min(attempt.width, MAX_WIDTH) / bitmap.width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(bitmap.width * scale);
      canvas.height = Math.round(bitmap.height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) break;
      if (!webp) {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      const blob = await toBlob(canvas, type, attempt.quality);
      if (blob && blob.size <= MAX_UPLOAD_BYTES) return new File([blob], name, { type: blob.type });
    }
  } finally {
    bitmap.close();
  }
  throw new PrepareError(`This image is still larger than ${MAX_UPLOAD_BYTES / 1024 / 1024}MB after compression. Export a smaller version and try again.`);
}
