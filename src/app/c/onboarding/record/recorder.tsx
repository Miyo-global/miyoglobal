"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui";
import { pitchPrompts } from "@/data/fixtures";

type Cam = "asking" | "live" | "mock" | "denied";

export function Recorder({ forceDenied }: { forceDenied: boolean }) {
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const [cam, setCam] = useState<Cam>(forceDenied ? "denied" : "asking");
  const [front, setFront] = useState(true);
  const [cc, setCc] = useState(true);
  const [sec, setSec] = useState(0);
  const [rec, setRec] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (forceDenied) return;
    let off = false;
    const md = typeof navigator !== "undefined" ? navigator.mediaDevices : undefined;
    if (!md?.getUserMedia) {
      queueMicrotask(() => setCam("denied"));
      return;
    }
    md.getUserMedia({ video: { facingMode: front ? "user" : "environment" }, audio: true })
      .then((s) => {
        if (off) return s.getTracks().forEach((t) => t.stop());
        stream.current = s;
        if (video.current) video.current.srcObject = s;
        setCam("live");
      })
      .catch(() => !off && setCam("denied"));
    return () => {
      off = true;
      stream.current?.getTracks().forEach((t) => t.stop());
    };
  }, [front, forceDenied]);

  useEffect(() => {
    if (!rec) return;
    if (sec >= 60) {
      router.push("/c/onboarding/preview");
      return;
    }
    const id = setTimeout(() => setSec(sec + 1), 1000);
    return () => clearTimeout(id);
  }, [rec, sec, router]);

  const prompt = Math.min(2, Math.floor(sec / 20));
  const inTransition = rec && sec > 0 && sec % 20 < 2 && sec < 60;
  const r = 34;
  const c = 2 * Math.PI * r;

  if (cam === "denied")
    return (
      <div className="stack" style={{ maxWidth: 480, margin: "0 auto", ["--gap" as string]: "24px" }} role="alert">
        <span className="ico"><Icon name="video" size={24} /></span>
        <h2 style={{ fontSize: 36 }}>Camera or microphone blocked</h2>
        <p className="muted">
          We can&apos;t reach your camera. Allow camera and microphone access in your browser&apos;s site settings, then reload this page. Your progress is saved.
        </p>
        <div className="row">
          <button className="btn btn-gold" onClick={() => setCam("mock")}>Use a sample preview</button>
          <Link href="/c/onboarding/preview?upload=1" className="btn btn-ghost" style={{ color: "inherit" }}><Icon name="upload" /> Upload instead</Link>
        </div>
      </div>
    );

  return (
    <div className="stack" style={{ ["--gap" as string]: "16px" }}>
      <div className="row between" style={{ maxWidth: 420, margin: "0 auto", width: "100%" }}>
        <Link href="/c/onboarding/video" className="btn btn-ghost btn-icon" aria-label="Back to prompts" style={{ color: "inherit" }}><Icon name="left" /></Link>
        <span className="mono" aria-live="off">
          {rec ? <span className="gold">● REC </span> : "READY "}
          00:{String(sec).padStart(2, "0")} / 01:00
        </span>
        <span className="chip">Prompt {prompt + 1} of 3</span>
      </div>
      <div className="viewfinder">
        {cam === "live" ? (
          <video ref={video} autoPlay playsInline muted className={front ? "mirror" : undefined} aria-label="Camera preview" />
        ) : (
          <img src="/media/ananya.webp" alt="Sample camera preview" />
        )}
        {cam === "asking" && (
          <p className="caption" style={{ position: "absolute", top: 16, left: 16, right: 16 }} role="status">Waiting for camera permission…</p>
        )}
        <div className="prompt-card caption" key={prompt} aria-live="polite">
          <p className="label" style={{ color: "var(--gold)" }}>{inTransition ? "Next prompt" : pitchPrompts[prompt][0]}</p>
          <p style={{ fontSize: 18 }}>{pitchPrompts[prompt][1]}</p>
        </div>
        {cc && rec && (
          <p className="caption" style={{ position: "absolute", left: 16, right: 16, bottom: 104 }}>
            Live captions are generated as you speak…
          </p>
        )}
        <div className="rec-ring">
          <button className={rec ? "rec-btn on" : "rec-btn"} aria-label={rec ? "Stop recording" : "Start recording"} onClick={() => (rec ? router.push("/c/onboarding/preview") : (setSec(0), setRec(true)))}>
            <svg width="72" height="72" viewBox="0 0 72 72" aria-hidden="true">
              <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,.24)" strokeWidth="3" />
              <circle cx="36" cy="36" r={r} fill="none" stroke="#c41230" strokeWidth="3" strokeDasharray={c} strokeDashoffset={c * (1 - sec / 60)} style={{ transition: "stroke-dashoffset 1s linear" }} />
            </svg>
            <i />
          </button>
        </div>
      </div>
      <div className="controls" style={{ marginTop: 8 }}>
        <button className="ctl ctl-sm" onClick={() => setFront(!front)} disabled={rec}><span><Icon name="flip" /></span><span>Flip</span></button>
        <button className="ctl ctl-sm" aria-pressed={cc} onClick={() => setCc(!cc)}><span style={cc ? { borderColor: "var(--gold)", color: "var(--gold)" } : undefined}><Icon name="cc" /></span><span>Captions</span></button>
        <button className="ctl ctl-sm" onClick={() => (setRec(false), setSec(0))} disabled={!rec && sec === 0}><span><Icon name="undo" /></span><span>Retake</span></button>
        <Link href="/c/onboarding/preview?upload=1" className="ctl ctl-sm" style={{ textDecoration: "none" }}><span><Icon name="upload" /></span><span>Upload</span></Link>
      </div>
    </div>
  );
}
