import type { Metadata } from "next";
import { Preview } from "./preview";

export const metadata: Metadata = { title: "Preview and edit" };

export default async function PreviewPage({ searchParams }: { searchParams: Promise<{ upload?: string; state?: string }> }) {
  const sp = await searchParams;
  return (
    <div className="wrap section stack" style={{ ["--gap" as string]: "32px" }}>
      <header className="stack">
        <p className="eyebrow">Step 5 of 5</p>
        <h1>Preview and edit</h1>
        <p className="muted">Watch it back with captions on. You can retake as many times as you like.</p>
      </header>
      <Preview initial={sp.state === "error" ? "error" : sp.upload ? "pick" : "edit"} />
    </div>
  );
}
