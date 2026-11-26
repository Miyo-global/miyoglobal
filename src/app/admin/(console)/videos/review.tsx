"use client";

import { useEffect, useState } from "react";
import { VideoPlayer } from "@/components/client";
import { Empty, Icon } from "@/components/ui";
import { candidate, videoQueue } from "@/data/fixtures";

const checks = [["av", "Audio and video quality"], ["profanity", "Profanity and personal data"], ["face", "One face visible"], ["length", "60 seconds or less"]] as const;

export function VideoReview() {
  const [queue, setQueue] = useState(videoQueue);
  const [done, setDone] = useState<string | null>(null);
  const item = queue[0];
  const decide = (label: string) => {
    if (!item) return;
    setDone(`${item.id} · ${label}`);
    setQueue(queue.slice(1));
  };
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === "INPUT" || (e.target as HTMLElement).tagName === "TEXTAREA") return;
      if (e.key === "a") decide("Approved");
      if (e.key === "c") decide("Changes requested");
      if (e.key === "r") decide("Rejected");
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  });
  if (!item)
    return (
      <Empty icon="check" title="All clear" body="The moderation queue is empty. New videos land here for review.">
        <button className="btn" onClick={() => setQueue(videoQueue)}>Reload sample queue</button>
      </Empty>
    );
  const c = candidate(item.candidate)!;
  return (
    <div className="stack" style={{ ["--gap" as string]: "24px" }}>
      <div className="row between">
        <span className="mono"><span className="gold">{queue.length}</span> in queue · oldest {queue[0].submitted}</span>
        {done && <span className="chip chip-navy" role="status">{done}</span>}
      </div>
      <div className="cols-2" style={{ alignItems: "start" }}>
        <div className="dark card" style={{ padding: 16, maxWidth: 420 }}>
          <VideoPlayer key={item.id} img={c.img} alt={`Pitch ${item.id}`} transcript={c.transcript} watermark="MIYO MODERATION" />
        </div>
        <div className="stack" style={{ ["--gap" as string]: "16px" }}>
          <section className="card stack">
            <div className="row between"><h2 style={{ fontSize: 28 }}>{c.name}</h2><span className="mono">{item.id}</span></div>
            <p className="muted small">{c.title} · {c.city} · {item.length} · submitted {item.submitted}</p>
          </section>
          <section className="card stack" aria-labelledby="scan">
            <h3 id="scan" className="label">Auto-scan</h3>
            <ul className="list">
              {checks.map(([k, l]) => (
                <li key={k} className="item" style={{ padding: "8px 0", minHeight: 44 }}>
                  <span className={item.scan[k] ? "gold" : "err"}><Icon name={item.scan[k] ? "check" : "alert"} /></span>
                  <span className="item-body small">{l}</span>
                  <span className={item.scan[k] ? "chip" : "chip chip-err"}>{item.scan[k] ? "Pass" : "Check"}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="card stack" aria-labelledby="tx">
            <h3 id="tx" className="label">Transcript</h3>
            {c.transcript.map((l) => <p key={l.t} className="small"><span className="mono muted">{l.t}</span> {l.text}</p>)}
          </section>
          <div className="row">
            <button className="btn btn-primary" onClick={() => decide("Approved")}><Icon name="check" /> Approve</button>
            <button className="btn" onClick={() => decide("Changes requested")}><Icon name="edit" /> Request changes</button>
            <button className="btn btn-danger" onClick={() => decide("Rejected")}><Icon name="x" /> Reject</button>
          </div>
        </div>
      </div>
      <div className="card row small" style={{ padding: 12 }} aria-label="Keyboard shortcuts">
        <span className="label">Shortcuts</span>
        <span><span className="kbd">A</span> Approve</span>
        <span><span className="kbd">C</span> Request changes</span>
        <span><span className="kbd">R</span> Reject</span>
      </div>
    </div>
  );
}
