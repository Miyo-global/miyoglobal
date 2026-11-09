import { fetchJobs } from "@/server/jobs";

export async function GET() {
  const res = await fetchJobs();
  if (!res.ok) return Response.json({ status: "error", message: res.message }, { status: res.status });
  // Hiring-manager emails and sheet debug info stay server-side.
  const jobs = (res.data.jobs ?? []).map(({ hmEmail: _hm, ...job }) => job);
  return Response.json(
    { status: res.data.status, count: res.data.count ?? jobs.length, jobs },
    { headers: { "Cache-Control": "public, max-age=30, s-maxage=300, stale-while-revalidate=600" } },
  );
}
