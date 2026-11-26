"use client";

import { useState } from "react";
import type { Msg } from "@/data/fixtures";
import { Icon } from "./ui";

export function ChatThread({ initial, hoursLeft, recruiter }: { initial: Msg[]; hoursLeft: number; recruiter?: boolean }) {
  const [msgs, setMsgs] = useState(initial);
  const [text, setText] = useState("");
  const [qs, setQs] = useState(["", ""]);
  const [mode, setMode] = useState<"text" | "questions">("text");
  const now = recruiter ? "Just now · GST" : "Just now · IST";
  const send = (m: Msg) => setMsgs((x) => [...x, m]);
  const quick = recruiter ? ["Thanks, we'll review today.", "Could you do a 30-minute call this week?", "Sharing the role brief now."] : [];
  return (
    <div className="stack" style={{ ["--gap" as string]: "16px" }}>
      <div className="banner" role="status">
        <Icon name="clock" />
        <span>
          <strong>Match expires in {hoursLeft}h</strong> unless someone replies. Replying on time keeps Reliability scores high.
        </span>
      </div>
      <ol className="list stack" style={{ ["--gap" as string]: "12px" }} aria-label="Messages" aria-live="polite">
        {msgs.map((m, i) => (
          <li key={i} style={{ border: 0 }}>
            <div className={m.from === "me" ? "bubble me" : "bubble"}>
              {m.kind === "video" ? (
                <div className="row" style={{ flexWrap: "nowrap" }}>
                  <span className="ico" style={{ width: 44, height: 44, borderColor: "currentColor" }}><Icon name="play" /></span>
                  <span>
                    <span className="label" style={{ color: "inherit", opacity: 0.7, display: "block" }}>{m.meta}</span>
                    {m.text}
                  </span>
                </div>
              ) : m.kind === "file" ? (
                <div className="row" style={{ flexWrap: "nowrap" }}>
                  <Icon name="file" />
                  <span>
                    <span style={{ display: "block" }}>{m.text}</span>
                    <span className="muted small">{m.meta}</span>
                  </span>
                </div>
              ) : (
                <p>{m.text}</p>
              )}
              <p className="muted small" style={{ marginTop: 4 }}>
                {m.at}
                {m.from === "me" && i === msgs.length - 1 && <span> · Read ✓✓</span>}
              </p>
            </div>
          </li>
        ))}
      </ol>
      {quick.length > 0 && (
        <div className="row" aria-label="Quick replies">
          {quick.map((q) => (
            <button key={q} className="btn" style={{ minHeight: 36 }} onClick={() => send({ from: "me", kind: "text", text: q, at: now })}>{q}</button>
          ))}
        </div>
      )}
      <div className="card stack" style={{ padding: 16 }}>
        {recruiter && (
          <div className="seg" role="group" aria-label="Composer mode" style={{ width: "fit-content" }}>
            <button aria-pressed={mode === "text"} onClick={() => setMode("text")}>Message</button>
            <button aria-pressed={mode === "questions"} onClick={() => setMode("questions")}>2 video questions</button>
          </div>
        )}
        {mode === "questions" ? (
          <form
            className="stack"
            onSubmit={(e) => {
              e.preventDefault();
              qs.filter(Boolean).forEach((q) => send({ from: "me", kind: "video", text: q, at: now, meta: "0:20 video question" }));
              setQs(["", ""]);
              setMode("text");
            }}
          >
            {qs.map((q, i) => (
              <div key={i} className="field">
                <label htmlFor={`q${i}`}>Question {i + 1}</label>
                <input id={`q${i}`} value={q} maxLength={140} onChange={(e) => setQs(qs.map((x, n) => (n === i ? e.target.value : x)))} placeholder={i === 0 ? "How would you approach…" : "Tell us about a time…"} />
              </div>
            ))}
            <p className="hint">The candidate answers each in a 20-second video. Limit: 2 questions per match.</p>
            <button className="btn btn-primary" disabled={!qs.some(Boolean)}><Icon name="send" /> Send questions</button>
          </form>
        ) : (
          <form
            className="row"
            style={{ flexWrap: "nowrap" }}
            onSubmit={(e) => {
              e.preventDefault();
              if (!text.trim()) return;
              send({ from: "me", kind: "text", text: text.trim(), at: now });
              setText("");
            }}
          >
            <label className="btn btn-ghost btn-icon" aria-label="Attach a file" style={{ cursor: "pointer" }}>
              <Icon name="clip" />
              <input type="file" className="sr" onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) send({ from: "me", kind: "file", text: f.name, at: now, meta: `${Math.max(1, Math.round(f.size / 1024))} KB` });
              }} />
            </label>
            {!recruiter && (
              <button type="button" className="btn btn-ghost btn-icon" aria-label="Record a video reply" onClick={() => send({ from: "me", kind: "video", text: "Video reply", at: now, meta: "0:20 video reply" })}>
                <Icon name="video" />
              </button>
            )}
            <div className="field" style={{ flex: 1 }}>
              <label htmlFor="msg" className="sr">Message</label>
              <input id="msg" value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a message" autoComplete="off" />
            </div>
            <button className="btn btn-primary btn-icon" aria-label="Send"><Icon name="send" /></button>
          </form>
        )}
      </div>
    </div>
  );
}
