import "server-only";

export type Job = { jobId?: string; hmEmail?: string; [k: string]: unknown };
export type JobsResult = { ok: true; data: { status?: string; count?: number; jobs?: Job[] } } | { ok: false; status: number; message: string };

// The Apps Script sheet takes 7-18s to answer, so keep a shared copy for 5 minutes.
export async function fetchJobs(): Promise<JobsResult> {
  const endpoint = process.env.REFERRAL_SCRIPT_URL;
  const secret = process.env.REFERRAL_SCRIPT_SECRET;
  if (!endpoint || !secret) return { ok: false, status: 503, message: "jobs are temporarily unavailable" };
  try {
    const upstream = await fetch(`${endpoint}?action=getJobs&secret=${encodeURIComponent(secret)}`, {
      signal: AbortSignal.timeout(20000),
      next: { revalidate: 300 },
    });
    if (!upstream.ok) return { ok: false, status: 502, message: `upstream returned status ${upstream.status}` };
    return { ok: true, data: await upstream.json() };
  } catch (e) {
    const message = e instanceof Error && e.name === "TimeoutError" ? "upstream did not respond in time" : "upstream fetch failed";
    return { ok: false, status: 502, message };
  }
}
