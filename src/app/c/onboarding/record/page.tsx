import type { Metadata } from "next";
import { Recorder } from "./recorder";

export const metadata: Metadata = { title: "Record your pitch" };

export default async function Record({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const denied = (await searchParams).denied === "1";
  return (
    <div className="dark" style={{ minHeight: "calc(100dvh - 120px)", padding: "24px 20px 48px" }}>
      <h1 className="sr">Record your pitch</h1>
      <Recorder forceDenied={denied} />
    </div>
  );
}
