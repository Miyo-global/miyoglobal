import "server-only";
import { cache } from "react";
import { normalizeJobs, type RawJob, type Role } from "@/lib/jobs";

export type Job = { jobId?: string; hmEmail?: string; [k: string]: unknown };
export type JobsResult = { ok: true; data: { status?: string; count?: number; jobs?: Job[] } } | { ok: false; status: number; message: string };

/** Public, hiring-manager-free copy of the same sheet. Read only where the Apps Script secret is not configured (staging, beta, local). */
const PUBLIC_JOBS_URL = "https://www.miyoglobal.com/api/jobs";

// The Apps Script sheet takes 7-18s to answer, so keep a shared copy for 10 minutes.
export async function fetchJobs(): Promise<JobsResult> {
  const endpoint = process.env.REFERRAL_SCRIPT_URL;
  const secret = process.env.REFERRAL_SCRIPT_SECRET;
  const url = endpoint && secret ? `${endpoint}?action=getJobs&secret=${encodeURIComponent(secret)}` : process.env.VERCEL_ENV === "production" && !process.env.NEXT_PUBLIC_ENV ? null : PUBLIC_JOBS_URL;
  if (!url) return { ok: false, status: 503, message: "jobs are temporarily unavailable" };
  try {
    const upstream = await fetch(url, { signal: AbortSignal.timeout(20000), next: { revalidate: 600 } });
    if (!upstream.ok) return { ok: false, status: 502, message: `upstream returned status ${upstream.status}` };
    return { ok: true, data: await upstream.json() };
  } catch (e) {
    const message = e instanceof Error && e.name === "TimeoutError" ? "upstream did not respond in time" : "upstream fetch failed";
    return { ok: false, status: 502, message };
  }
}

/** Open roles for the jobs pages, deduplicated once per request. An unreachable sheet yields no roles rather than an error page. */
export const getRoles = cache(async (): Promise<Role[]> => {
  const res = await fetchJobs();
  return res.ok ? normalizeJobs((res.data.jobs ?? []) as RawJob[]) : [];
});

export const getRole = async (slug: string) => (await getRoles()).find((r) => r.slug === slug) ?? null;
