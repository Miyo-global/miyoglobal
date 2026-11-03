export async function GET() {
  const endpoint = process.env.REFERRAL_ENDPOINT;
  const secret = process.env.REFERRAL_SECRET;
  if (!endpoint || !secret) {
    return Response.json({ status: "error", message: "jobs are temporarily unavailable" }, { status: 503 });
  }
  try {
    const upstream = await fetch(`${endpoint}?action=getJobs&secret=${encodeURIComponent(secret)}`, {
      signal: AbortSignal.timeout(20000),
    });
    if (!upstream.ok) {
      return Response.json({ status: "error", message: `upstream returned status ${upstream.status}` }, { status: 502 });
    }
    return Response.json(await upstream.json(), {
      headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=270" },
    });
  } catch (e) {
    const message = e instanceof Error && e.name === "TimeoutError" ? "upstream did not respond in time" : "upstream fetch failed";
    return Response.json({ status: "error", message }, { status: 502 });
  }
}
