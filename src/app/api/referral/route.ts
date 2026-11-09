import { z } from "zod";
import { fetchJobs } from "@/server/jobs";
import { allow, clientIp, sameOrigin, tooLarge } from "@/server/request";

const MAX_RESUME_BYTES = 3 * 1024 * 1024;
const MIME = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

const text = (max: number) => z.string().trim().max(max);

const body = z.strictObject({
  referrerName: text(120).min(1),
  referrerContact: z.email().max(160),
  referrerPhone: text(20).min(7),
  candidateName: text(120).min(1),
  candidateEmail: z.email().max(160),
  candidatePhone: text(20).min(7),
  jobApplied: text(200),
  jobId: text(80).min(1),
  jobDescription: text(5000),
  // Old clients still send this; ignored, the server looks it up by jobId.
  hmEmail: text(160).optional(),
  resumeBase64: z.string().min(1).max(Math.ceil((MAX_RESUME_BYTES * 4) / 3) + 8),
  resumeMimeType: z.enum(MIME),
  resumeFileName: text(200).min(1),
  website: z.string().max(200).default(""),
});

const json = (data: object, status = 200) => Response.json(data, { status });

function resumeOk(base64: string, name: string): boolean {
  const bytes = Buffer.from(base64, "base64");
  if (bytes.length === 0 || bytes.length > MAX_RESUME_BYTES) return false;
  const lower = name.toLowerCase();
  if (lower.endsWith(".pdf")) return bytes.subarray(0, 5).toString("latin1") === "%PDF-";
  if (lower.endsWith(".docx")) return bytes[0] === 0x50 && bytes[1] === 0x4b;
  return false;
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ status: "error", message: "Forbidden" }, 403);

  if (tooLarge(req, 4_400_000)) return json({ status: "error", message: "Resume must be a PDF or DOCX under 3MB" }, 413);
  if (!(await allow(`referral:${clientIp(req)}`, 5, 10 * 60 * 1000))) {
    return json({ status: "error", message: "Too many submissions, please try again later" }, 429);
  }

  const raw = await req.json().catch(() => null);
  const parsed = body.safeParse(raw);
  if (!parsed.success) return json({ status: "error", message: "Please check the form and try again" }, 422);
  const { website, hmEmail: _ignored, ...fields } = parsed.data;
  if (website) return json({ status: "success" });
  if (!resumeOk(fields.resumeBase64, fields.resumeFileName)) {
    return json({ status: "error", message: "Resume must be a PDF or DOCX under 3MB" }, 422);
  }

  const endpoint = process.env.REFERRAL_SCRIPT_URL;
  const secret = process.env.REFERRAL_SCRIPT_SECRET;
  if (!endpoint || !secret) {
    console.error("referral: REFERRAL_SCRIPT_URL or REFERRAL_SCRIPT_SECRET is not set");
    return json({ status: "error", message: "Referrals are temporarily unavailable" }, 503);
  }

  const jobs = await fetchJobs();
  const hmEmail = jobs.ok ? String(jobs.data.jobs?.find((j) => String(j.jobId) === fields.jobId)?.hmEmail ?? "") : "";
  const payload = { ...fields, hmEmail };
  const upstream = await fetch(endpoint, {
    method: "POST",
    body: JSON.stringify({ ...payload, secret }),
    signal: AbortSignal.timeout(25000),
  }).catch(() => null);
  const data = upstream?.ok ? await upstream.json().catch(() => null) : null;
  if (data?.status !== "success") {
    console.error("referral: upstream rejected the submission", upstream?.status, data?.message);
    return json({ status: "error", message: "Could not submit right now" }, 502);
  }
  return json({ status: "success" });
}
