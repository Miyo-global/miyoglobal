/** CV uploads shared by the apply and referral forms: PDF or DOCX, at most 3 MB. */
export const MAX_RESUME_BYTES = 3 * 1024 * 1024;
export const RESUME_TYPES = { pdf: "application/pdf", docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" } as const;
export const RESUME_ACCEPT = ".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

/** Client-side check before upload; the server repeats it against the file's magic bytes. */
export function resumeProblem(file: File | null | undefined): string | null {
  if (!file || !file.size) return "Attach a CV as a PDF or DOCX file.";
  const ext = file.name.toLowerCase().split(".").pop();
  if (ext !== "pdf" && ext !== "docx") return "The CV must be a PDF or DOCX file.";
  if (file.size > MAX_RESUME_BYTES) return "The CV must be 3 MB or smaller.";
  return null;
}

/** Server-side check: the bytes must really be a PDF (%PDF-) or a DOCX (a ZIP, PK). */
export function resumeBytesOk(bytes: Uint8Array, name: string): boolean {
  if (bytes.length === 0 || bytes.length > MAX_RESUME_BYTES) return false;
  const lower = name.toLowerCase();
  if (lower.endsWith(".pdf")) return String.fromCharCode(...bytes.subarray(0, 5)) === "%PDF-";
  if (lower.endsWith(".docx")) return bytes[0] === 0x50 && bytes[1] === 0x4b;
  return false;
}
