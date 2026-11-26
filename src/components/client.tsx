"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Icon, type IconName } from "./ui";

export function NavLink({ href, icon, children, badge, className = "side-link", exact }: { href: string; icon?: IconName; children: ReactNode; badge?: ReactNode; className?: string; exact?: boolean }) {
  const path = usePathname();
  const on = exact ? path === href : path === href || path.startsWith(href + "/");
  return (
    <Link href={href} className={className} aria-current={on ? "page" : undefined}>
      {icon && <Icon name={icon} />}
      <span>{children}</span>
      {badge}
    </Link>
  );
}

export function Modal({
  trigger,
  triggerClass = "btn",
  title,
  children,
  sheet,
  open: startOpen,
}: {
  trigger?: ReactNode;
  triggerClass?: string;
  title: string;
  children: ReactNode;
  sheet?: boolean;
  open?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (startOpen) ref.current?.showModal();
  }, [startOpen]);
  return (
    <>
      {trigger && (
        <button type="button" className={triggerClass} onClick={() => ref.current?.showModal()}>
          {trigger}
        </button>
      )}
      <dialog ref={ref} className={sheet ? "sheet" : undefined} aria-label={title} onClick={(e) => e.target === ref.current && ref.current?.close()}>
        <div className="dialog-body">
          <form method="dialog">
            <button className="btn btn-ghost btn-icon dialog-x" aria-label="Close">
              <Icon name="x" />
            </button>
          </form>
          <h2 style={{ fontSize: 28, paddingRight: 40 }}>{title}</h2>
          {children}
        </div>
      </dialog>
    </>
  );
}

export function Toast({ children, onClose, action }: { children: ReactNode; onClose: () => void; action?: { label: string; run: () => void } }) {
  useEffect(() => {
    const id = setTimeout(onClose, 5000);
    return () => clearTimeout(id);
  }, [onClose]);
  return (
    <div className="toast" role="status">
      <span className="small">{children}</span>
      {action && (
        <button className="btn" onClick={action.run}>
          {action.label}
        </button>
      )}
      <button className="btn btn-icon" aria-label="Dismiss" onClick={onClose}>
        <Icon name="x" />
      </button>
    </div>
  );
}

export function Tabs({ tabs, initial = 0 }: { tabs: { label: string; content: ReactNode }[]; initial?: number }) {
  const [i, setI] = useState(initial);
  return (
    <div>
      <div className="tabs" role="tablist">
        {tabs.map((t, n) => (
          <button key={t.label} role="tab" className="tab" aria-selected={n === i} onClick={() => setI(n)}>
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" style={{ paddingTop: 24 }}>
        {tabs[i].content}
      </div>
    </div>
  );
}

export function CopyButton({ text, label = "Copy link" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="btn"
      onClick={() => {
        navigator.clipboard?.writeText(text);
        setDone(true);
      }}
    >
      <Icon name={done ? "check" : "copy"} />
      {done ? "Copied" : label}
    </button>
  );
}

export function VideoPlayer({
  img,
  alt,
  transcript,
  watermark,
  wide,
  children,
}: {
  img: string;
  alt: string;
  transcript: { t: string; text: string }[];
  watermark?: string;
  wide?: boolean;
  children?: ReactNode;
}) {
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(0);
  const [cc, setCc] = useState(true);
  const [view, setView] = useState<"video" | "transcript">("video");
  const [failed, setFailed] = useState(false);
  const total = 60;
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setPos((p) => (p >= total ? (setPlaying(false), 0) : p + 1)), 1000);
    return () => clearInterval(id);
  }, [playing]);
  const line = transcript[Math.min(transcript.length - 1, Math.floor((pos / total) * transcript.length))];
  const mmss = (s: number) => `0${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  return (
    <div className="stack" style={{ ["--gap" as string]: "12px" }}>
      <div className="tabs" role="tablist" aria-label="Pitch view">
        <button role="tab" className="tab" aria-selected={view === "video"} onClick={() => setView("video")}>
          Video
        </button>
        <button role="tab" className="tab" aria-selected={view === "transcript"} onClick={() => setView("transcript")}>
          Transcript
        </button>
      </div>
      {view === "video" ? (
        <div className={wide ? "video video-wide" : "video"}>
          <img src={img} alt={alt} />
          {watermark && <span className="watermark">{watermark}</span>}
          <div className="video-top">
            <span className="chip">
              <Icon name="video" size={14} /> {mmss(pos)} / 01:00
            </span>
            {children}
          </div>
          {failed ? (
            <div className="play" style={{ width: "auto", height: "auto", padding: 24, borderRadius: 4, display: "grid", gap: 12, textAlign: "center" }} role="alert">
              <Icon name="alert" />
              <span className="small">Playback failed. Check your connection.</span>
              <button className="btn btn-gold" onClick={() => setFailed(false)}>
                Retry
              </button>
            </div>
          ) : (
            <button className="play" aria-label={playing ? "Pause pitch" : "Play pitch"} onClick={() => setPlaying(!playing)}>
              <Icon name={playing ? "pause" : "play"} size={24} />
            </button>
          )}
          <div className="video-bottom">
            {cc && <p className="caption">{line?.text}</p>}
            <div className="scrub" aria-hidden="true">
              <span style={{ width: `${(pos / total) * 100}%` }} />
            </div>
            <div className="row between">
              <button className="btn btn-ghost btn-icon" style={{ color: "#fff", borderColor: "rgba(255,255,255,.24)" }} aria-pressed={cc} aria-label="Captions" onClick={() => setCc(!cc)}>
                <Icon name="cc" />
              </button>
              <button className="btn-link small" style={{ color: "rgba(255,255,255,.64)" }} onClick={() => setFailed(true)}>
                Simulate playback error
              </button>
            </div>
          </div>
        </div>
      ) : (
        <ol className="list card" style={{ padding: "0 24px" }}>
          {transcript.map((l) => (
            <li key={l.t} className="item" style={{ alignItems: "flex-start" }}>
              <span className="mono muted">{l.t}</span>
              <span>{l.text}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setShow(!localStorage.getItem("miyo-beta-consent")), 0);
    return () => clearTimeout(id);
  }, []);
  if (!show) return null;
  const set = (v: string) => {
    localStorage.setItem("miyo-beta-consent", v);
    setShow(false);
  };
  return (
    <section className="cookie" aria-label="Cookie consent">
      <p>
        We use essential cookies to keep you signed in to this beta. With your consent we also measure page use to improve it. Read the{" "}
        <Link href="/legal/privacy">privacy notice</Link>.
      </p>
      <div className="row">
        <button className="btn" onClick={() => set("essential")}>
          Essential only
        </button>
        <button className="btn btn-primary" onClick={() => set("all")}>
          Accept all
        </button>
      </div>
    </section>
  );
}

export function MenuToggle({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const [seen, setSeen] = useState(path);
  if (seen !== path) {
    setSeen(path);
    setOpen(false);
  }
  return (
    <>
      <button className="btn btn-ghost btn-icon menu-btn" aria-expanded={open} aria-label="Menu" onClick={() => setOpen(!open)}>
        <Icon name={open ? "x" : "menu"} />
      </button>
      {open && <nav className="drawer" aria-label="Menu">{children}</nav>}
    </>
  );
}

export function Toggle({ label, hint, on = false }: { label: string; hint?: string; on?: boolean }) {
  return (
    <label className="check between" style={{ justifyContent: "space-between", borderBottom: "1px solid var(--line)" }}>
      <span>
        <span style={{ display: "block" }}>{label}</span>
        {hint && <span className="hint">{hint}</span>}
      </span>
      <input type="checkbox" role="switch" className="switch" defaultChecked={on} />
    </label>
  );
}

export function Flash({ children }: { children: ReactNode }) {
  const [shown, setShown] = useState(false);
  return (
    <>
      <span onClickCapture={() => setShown(true)} style={{ display: "contents" }}>
        {children}
      </span>
      {shown && <Toast onClose={() => setShown(false)}>Saved. Changes apply to this beta session only.</Toast>}
    </>
  );
}
