"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { VideoPlayer } from "@/components/client";
import { ErrorPanel } from "@/components/states";
import { Icon, Meter } from "@/components/ui";
import { me } from "@/data/fixtures";

type Phase = "pick" | "edit" | "uploading" | "processing" | "error" | "done";

export function Preview({ initial }: { initial: Phase }) {
  const [phase, setPhase] = useState<Phase>(initial);
  const [pct, setPct] = useState(initial === "error" ? 64 : 0);
  const [lines, setLines] = useState(me.transcript);
  const [cover, setCover] = useState(0);
  const [failNext, setFailNext] = useState(false);

  useEffect(() => {
    if (phase === "uploading") {
      if (failNext && pct >= 64) {
        queueMicrotask(() => setPhase("error"));
        return;
      }
      if (pct >= 100) {
        queueMicrotask(() => setPhase("processing"));
        return;
      }
      const id = setTimeout(() => setPct(pct + 8), 120);
      return () => clearTimeout(id);
    }
    if (phase === "processing") {
      const id = setTimeout(() => setPhase("done"), 1800);
      return () => clearTimeout(id);
    }
  }, [phase, pct, failNext]);

  if (phase === "pick")
    return (
      <label className="dropzone" style={{ cursor: "pointer", padding: 64 }}>
        <Icon name="upload" size={24} />
        <strong>Choose a video to upload</strong>
        <span className="hint">MP4 or MOV, vertical 9:16, up to 60 seconds and 200 MB.</span>
        <span className="btn btn-primary">Browse files</span>
        <input type="file" accept="video/mp4,video/quicktime,video/webm" className="sr" onChange={() => setPhase("edit")} />
      </label>
    );

  if (phase === "uploading" || phase === "processing")
    return (
      <div className="card stack" role="status" aria-live="polite">
        <div className="row between">
          <strong>{phase === "uploading" ? "Uploading your pitch" : "Processing"}</strong>
          <span className="mono">{phase === "uploading" ? `${Math.min(pct, 100)}%` : "CAPTIONS · CHECKS"}</span>
        </div>
        <Meter value={phase === "uploading" ? Math.min(pct, 100) : 100} gold={phase === "processing"} label="Upload progress" />
        <p className="muted small">
          {phase === "uploading" ? "Keep this page open. 18.4 MB of 24 MB." : "Generating captions and running quality checks: audio, lighting, length."}
        </p>
      </div>
    );

  if (phase === "error")
    return (
      <ErrorPanel icon="upload" title="Upload failed at 64%" body="Your connection dropped. Your recording is saved on this device, so you won't need to record it again.">
        <button className="btn btn-primary" onClick={() => (setFailNext(false), setPct(0), setPhase("uploading"))}>Retry upload</button>
        <Link href="/c/onboarding/record" className="btn">Record again</Link>
      </ErrorPanel>
    );

  if (phase === "done")
    return (
      <div className="card stack" style={{ display: "grid", justifyItems: "center", textAlign: "center", padding: 48 }} role="status">
        <span className="ico" style={{ borderColor: "var(--gold)" }}><Icon name="check" size={24} /></span>
        <h2>Pitch uploaded</h2>
        <p className="muted">Captions are ready and your video is in the review queue.</p>
        <Link href="/c/onboarding/review" className="btn btn-primary">See my profile status</Link>
      </div>
    );

  return (
    <div className="split" style={{ alignItems: "start" }}>
      <div style={{ maxWidth: 420, width: "100%", margin: "0 auto" }}>
        <VideoPlayer img={me.img} alt="Your recorded pitch" transcript={lines} />
      </div>
      <div className="stack" style={{ ["--gap" as string]: "24px" }}>
        <section className="stack" aria-labelledby="cov">
          <h2 id="cov" style={{ fontSize: 24 }}>Cover frame</h2>
          <div className="row" role="radiogroup" aria-label="Cover frame">
            {["0:04", "0:21", "0:43"].map((t, i) => (
              <button key={t} role="radio" aria-checked={cover === i} onClick={() => setCover(i)} className="btn" style={{ padding: 4, height: "auto", flexDirection: "column", borderColor: cover === i ? "var(--gold-deep)" : undefined }}>
                <img src={me.img} alt="" width={56} height={100} style={{ width: 56, height: 100, objectFit: "cover", objectPosition: `50% ${i * 30}%` }} />
                <span className="mono small">{t}</span>
              </button>
            ))}
          </div>
        </section>
        <section className="stack" aria-labelledby="cap">
          <h2 id="cap" style={{ fontSize: 24 }}>Edit captions</h2>
          <p className="hint">Fix any words the captions got wrong. Don&apos;t add your surname or employer.</p>
          {lines.slice(0, 4).map((l, i) => (
            <div key={l.t} className="field">
              <label htmlFor={`cap-${i}`} className="mono muted">{l.t}</label>
              <input id={`cap-${i}`} value={l.text} onChange={(e) => setLines(lines.map((x, n) => (n === i ? { ...x, text: e.target.value } : x)))} />
            </div>
          ))}
        </section>
        <label className="check small">
          <input type="checkbox" checked={failNext} onChange={(e) => setFailNext(e.target.checked)} /> Simulate a dropped connection (demo)
        </label>
        <div className="row">
          <Link href="/c/onboarding/record" className="btn"><Icon name="undo" /> Retake</Link>
          <button className="btn btn-primary" onClick={() => (setPct(0), setPhase("uploading"))}>Submit for review</button>
        </div>
      </div>
    </div>
  );
}
