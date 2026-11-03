const ENDPOINT =
  "https://script.google.com/macros/s/AKfycbwicD4imd-odXbCAF1Wtyw802_pSx9GHumZfslYjdu3js1OEghIBEBmkk3pvX79fSu1/exec";

export async function GET() {
  try {
    const upstream = await fetch(`${ENDPOINT}?action=getJobs`, {
      signal: AbortSignal.timeout(20000),
    });
    if (!upstream.ok) {
      return Response.json(
        { status: "error", message: `upstream returned status ${upstream.status}` },
        { status: 502 },
      );
    }
    return Response.json(await upstream.json(), {
      headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=270" },
    });
  } catch (e) {
    const message =
      e instanceof Error && e.name === "TimeoutError"
        ? "upstream did not respond in time"
        : "upstream fetch failed";
    return Response.json({ status: "error", message }, { status: 502 });
  }
}
