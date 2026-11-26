"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Toast } from "@/components/client";
import { DeckLoading, MatchCelebration } from "@/components/states";
import { BandChip, Empty, Icon, Meter, Ring } from "@/components/ui";
import { candidates, FREE_UNLOCKS, inr, roles, type Band, type Candidate } from "@/data/fixtures";
import { setUnlocks, useUnlocks } from "../unlocks";

type Dir = "left" | "right" | "up";
type Filters = { skills: string[]; band: Band[]; verified: boolean; notice: string; cities: string[]; minYears: number };
const none: Filters = { skills: [], band: [], verified: false, notice: "Any", cities: [], minYears: 0 };
const noticeDays = (n: string) => (n === "Immediate" ? 0 : parseInt(n, 10));

const deckFor = (roleId: string, f: Filters) => {
  const order = roleId === "MIYO-DXB-0388" ? [1, 5, 0, 6, 2, 3, 4, 7] : roleId === "MIYO-HYD-0405" ? [6, 2, 0, 5, 1, 7, 3, 4] : [0, 1, 5, 2, 6, 3, 4, 7];
  return order
    .map((i) => candidates[i])
    .filter((c) => (f.band.length ? f.band.includes(c.band) : true))
    .filter((c) => (f.verified ? c.skills.every((s) => s.verified) || c.skills.filter((s) => s.verified).length >= 3 : true))
    .filter((c) => (f.cities.length ? f.cities.includes(c.city) : true))
    .filter((c) => c.years >= f.minYears)
    .filter((c) => (f.notice === "Any" ? true : noticeDays(c.notice) <= parseInt(f.notice, 10)))
    .filter((c) => (f.skills.length ? f.skills.some((s) => c.skills.some((k) => k.name.toLowerCase().includes(s.toLowerCase()))) : true));
};

export function Deck({ tilt }: { tilt?: "like" | "pass" }) {
  const [roleId, setRoleId] = useState(roles[0].id);
  const [filters, setFilters] = useState<Filters>(none);
  const [queue, setQueue] = useState<Candidate[]>(() => deckFor(roles[0].id, none));
  const [i, setI] = useState(0);
  const [history, setHistory] = useState<{ i: number; dir: Dir; cost: number }[]>([]);
  const { used, cap } = useUnlocks();
  const [drag, setDrag] = useState({ x: tilt === "like" ? 90 : tilt === "pass" ? -90 : 0, y: 0, on: false });
  const [out, setOut] = useState<Dir | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ text: string; undo?: boolean } | null>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
  const superDlg = useRef<HTMLDialogElement>(null);
  const payDlg = useRef<HTMLDialogElement>(null);
  const matchDlg = useRef<HTMLDialogElement>(null);
  const filterDlg = useRef<HTMLDialogElement>(null);
  const [matched, setMatched] = useState<Candidate | null>(null);

  const c = queue[i];
  const next = queue[i + 1];
  const role = roles.find((r) => r.id === roleId)!;
  const activeFilters = filters.skills.length + filters.band.length + filters.cities.length + (filters.verified ? 1 : 0) + (filters.notice !== "Any" ? 1 : 0) + (filters.minYears ? 1 : 0);

  const decide = useCallback(
    (dir: Dir, confirmed = false) => {
      if (!c || out) return;
      const cost = dir === "left" ? 0 : 1;
      if (cost && used >= cap) {
        setDrag({ x: 0, y: 0, on: false });
        payDlg.current?.showModal();
        return;
      }
      if (dir === "up" && !confirmed) {
        superDlg.current?.showModal();
        return;
      }
      setOut(dir);
      if (cost) setUnlocks(used + cost, cap);
      setTimeout(() => {
        setHistory((h) => [...h, { i, dir, cost }]);
        setI(i + 1);
        setOut(null);
        setDrag({ x: 0, y: 0, on: false });
        if (dir !== "left" && c.mutual) {
          setMatched(c);
          matchDlg.current?.showModal();
        } else setToast({ text: dir === "left" ? `Passed on ${c.blind}` : dir === "up" ? `Super-liked ${c.blind} · 1 unlock used` : `Match requested with ${c.blind} · 1 unlock used`, undo: true });
      }, 450);
    },
    [c, out, used, cap, i],
  );

  const undo = useCallback(() => {
    const last = history[history.length - 1];
    if (!last) return;
    setHistory(history.slice(0, -1));
    setI(last.i);
    if (last.cost) setUnlocks(Math.max(0, used - last.cost), cap);
    setToast({ text: last.cost ? "Undone. Your unlock was returned." : "Undone." });
  }, [history, used, cap]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (document.querySelector("dialog[open]")) return;
      const t = e.target as HTMLElement;
      if (["INPUT", "SELECT", "TEXTAREA"].includes(t.tagName)) return;
      if (e.key === "ArrowLeft") decide("left");
      else if (e.key === "ArrowRight") decide("right");
      else if (e.key === "ArrowUp") (e.preventDefault(), decide("up"));
      else if (e.key.toLowerCase() === "z") undo();
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [decide, undo]);

  const reload = (rid: string, f: Filters) => {
    setLoading(true);
    setTimeout(() => {
      setQueue(deckFor(rid, f));
      setI(0);
      setHistory([]);
      setLoading(false);
    }, 600);
  };

  const rot = Math.max(-8, Math.min(8, drag.x / 18));
  const likeO = out === "right" ? 1 : Math.max(0, Math.min(1, drag.x / 100));
  const passO = out === "left" ? 1 : Math.max(0, Math.min(1, -drag.x / 100));
  const superO = out === "up" ? 1 : Math.max(0, Math.min(1, -drag.y / 100));

  return (
    <div className="stack" style={{ ["--gap" as string]: "24px" }}>
      <div className="row between deck-head">
        <div className="row" style={{ flex: "1 1 320px", flexWrap: "nowrap" }}>
          <div className="field" style={{ flex: 1, minWidth: 0 }}>
            <label htmlFor="role" className="sr">Role</label>
            <select
              id="role"
              value={roleId}
              onChange={(e) => {
                setRoleId(e.target.value);
                reload(e.target.value, filters);
              }}
            >
              {roles.filter((r) => r.status !== "Draft").map((r) => (
                <option key={r.id} value={r.id}>{r.title} · {r.city} ({r.id})</option>
              ))}
            </select>
          </div>
          <button className="btn" aria-label={`Filters${activeFilters ? `, ${activeFilters} active` : ""}`} onClick={() => filterDlg.current?.showModal()}>
            <Icon name="sliders" /> <span className="hide-sm">Filters</span>{activeFilters > 0 && <span className="badge">{activeFilters}</span>}
          </button>
        </div>
        <div className="stack" style={{ ["--gap" as string]: "8px", flex: "0 1 260px" }}>
          <p className="mono" aria-live="polite">
            <span className="gold">{Math.min(used, FREE_UNLOCKS)} of {FREE_UNLOCKS}</span> free unlocks used{cap > FREE_UNLOCKS ? ` · +${cap - FREE_UNLOCKS} add-on` : ""}
          </p>
          <Meter value={Math.min(used, cap)} max={cap} gold label="Unlocks used" />
        </div>
      </div>

      <div className="deck-grid">
        <aside className="rail deck-left" aria-label="Role context">
          <div>
            <p className="label">Role</p>
            <p><strong>{role.title}</strong></p>
            <p className="muted small">{role.city} · {role.mode}</p>
            <p className="mono small gold">{role.id}</p>
          </div>
          <div className="card stack small" style={{ padding: 16 }}>
            <p className="label">48h promise</p>
            <p className="muted">Reply to every match within 48 hours to keep your Reliability score.</p>
            <p className="mono gold">Reliability 97</p>
          </div>
          <div className="tooltip-keys" aria-label="Keyboard shortcuts">
            <p className="label">Shortcuts</p>
            <div><span>Pass</span><span className="kbd">←</span></div>
            <div><span>Like</span><span className="kbd">→</span></div>
            <div><span>Super-like</span><span className="kbd">↑</span></div>
            <div><span>Undo</span><span className="kbd">Z</span></div>
          </div>
        </aside>

        <section aria-label="Candidate deck" aria-roledescription="swipe deck">
          {loading ? (
            <DeckLoading />
          ) : !c ? (
            <Empty icon="deck" title="You've seen everyone" body="No more pitches match this role and your filters. Widen the filters or check back tomorrow — new pitches are reviewed daily.">
              <div className="row">
                <button className="btn" onClick={() => filterDlg.current?.showModal()}>Edit filters</button>
                <button className="btn btn-gold" onClick={() => reload(roleId, none)}>Reset deck</button>
              </div>
            </Empty>
          ) : (
            <>
              <div className="deck">
                <div className="fan fan-3" aria-hidden="true" />
                <div className="fan fan-2" aria-hidden="true" />
                {next && (
                  <div className="video fan-1" aria-hidden="true" style={{ position: "absolute", inset: 0, aspectRatio: "auto" }}>
                    <img src={next.img} alt="" />
                  </div>
                )}
                <article
                  key={c.id}
                  className={`video top-card${drag.on ? " dragging" : ""}${out ? ` out-${out}` : ""}`}
                  style={{ transform: `translate(${drag.x}px, ${drag.y}px) rotate(${rot}deg)` }}
                  aria-label={`${c.blind}, ${c.title}, fit ${c.fit}`}
                  onPointerDown={(e) => {
                    if ((e.target as HTMLElement).closest("button,a")) return;
                    start.current = { x: e.clientX - drag.x, y: e.clientY - drag.y };
                    e.currentTarget.setPointerCapture(e.pointerId);
                    setDrag({ ...drag, on: true });
                  }}
                  onPointerMove={(e) => start.current && setDrag({ x: e.clientX - start.current.x, y: e.clientY - start.current.y, on: true })}
                  onPointerUp={() => {
                    start.current = null;
                    if (drag.x > 120) decide("right");
                    else if (drag.x < -120) decide("left");
                    else if (drag.y < -140) decide("up");
                    else setDrag({ x: 0, y: 0, on: false });
                  }}
                  onPointerCancel={() => {
                    start.current = null;
                    setDrag({ x: 0, y: 0, on: false });
                  }}
                >
                  <img src={c.img} alt={`Pitch still of ${c.blind}`} draggable={false} />
                  <span className="watermark">NORTHBRIDGE SYSTEMS · KIRAN P.</span>
                  <span className="stamp stamp-like" style={{ opacity: likeO }} aria-hidden="true">LIKE</span>
                  <span className="stamp stamp-pass" style={{ opacity: passO }} aria-hidden="true">PASS</span>
                  <span className="stamp stamp-super" style={{ opacity: superO }} aria-hidden="true">SUPER</span>
                  <div className="video-top">
                    <span className="chip"><Icon name="video" size={14} /> 0:60 pitch</span>
                    <span className="chip chip-gold">{c.fit} / 100</span>
                  </div>
                  <div className="video-bottom">
                    <p className="caption">&ldquo;{c.quote}&rdquo;</p>
                    <div className="row between" style={{ alignItems: "flex-end" }}>
                      <div>
                        <h2 style={{ fontSize: 36 }}>{c.blind}</h2>
                        <p className="small" style={{ opacity: 0.8 }}>{c.title} · {c.city}</p>
                      </div>
                      <span className="mono small">{c.years} YRS</span>
                    </div>
                    <div className="row">
                      <BandChip band={c.band} />
                      {c.skills.slice(0, 3).map((s) => <span key={s.name} className="chip">{s.name}</span>)}
                    </div>
                  </div>
                </article>
              </div>
              <div className="controls" role="group" aria-label="Decide">
                <button className="ctl ctl-sm" onClick={undo} disabled={!history.length} aria-keyshortcuts="z"><span><Icon name="undo" /></span><span>Undo<span className="hide-sm">&nbsp;· Z</span></span></button>
                <button className="ctl" onClick={() => decide("left")} aria-keyshortcuts="ArrowLeft"><span><Icon name="x" /></span><span>Pass<span className="hide-sm">&nbsp;· ←</span></span></button>
                <button className="ctl ctl-super" onClick={() => decide("up")} aria-keyshortcuts="ArrowUp"><span><Icon name="star" /></span><span>Super<span className="hide-sm">&nbsp;· ↑</span></span></button>
                <button className="ctl ctl-like" onClick={() => decide("right")} aria-keyshortcuts="ArrowRight"><span><Icon name="check" /></span><span>Like<span className="hide-sm">&nbsp;· →</span></span></button>
              </div>
              <p className="mono muted" style={{ textAlign: "center", marginTop: 16, fontSize: 11 }}>
                {i + 1} of {queue.length} in deck · Drag the card or use the buttons
              </p>
            </>
          )}
        </section>

        {c && !loading && (
          <aside className="rail" aria-label="Candidate evidence">
            <section className="card stack">
              <div className="row between">
                <div>
                  <p className="label">Fit score</p>
                  <p className="small muted">3 verified criteria</p>
                </div>
                <Ring value={c.fit} size={64} />
              </div>
              {c.criteria.map((cr) => (
                <div key={cr.label} className="stack" style={{ ["--gap" as string]: "6px" }}>
                  <div className="row between small"><span>{cr.label}</span><span className="mono">{cr.score}%</span></div>
                  <Meter value={cr.score} label={cr.label} />
                </div>
              ))}
            </section>
            <section className="card stack">
              <p className="label">Skills</p>
              <div className="row">
                {c.skills.map((s) => (
                  <span key={s.name} className={s.verified ? "chip chip-gold" : "chip"}>{s.verified && <Icon name="shield" size={12} />}{s.name}</span>
                ))}
              </div>
              <div className="row between">
                <span className="label">Pay band</span>
                <BandChip band={c.band} />
              </div>
              <p className="banner small" style={{ background: "transparent" }}>
                <Icon name="lock" /> CV and contact unlock on match. Uses 1 unlock.
              </p>
              <Link href={`/r/candidates/${c.id}`} className="btn btn-block">View full profile</Link>
            </section>
          </aside>
        )}
      </div>

      <dialog ref={superDlg} aria-label="Confirm super-like">
        <div className="dialog-body">
          <p className="eyebrow">Super-like</p>
          <h2 style={{ fontSize: 28 }}>Super-like {c?.blind}?</h2>
          <p className="muted">Super-likes jump to the top of the candidate&apos;s requests with a gold badge. It uses 1 unlock, like a normal match request.</p>
          <form method="dialog" className="row" style={{ justifyContent: "flex-end" }}>
            <button className="btn">Cancel</button>
            <button className="btn btn-gold" onClick={() => decide("up", true)}><Icon name="star" /> Super-like</button>
          </form>
        </div>
      </dialog>

      <dialog ref={payDlg} aria-label="Unlock limit reached">
        <div className="dialog-body">
          <p className="eyebrow">Free limit reached</p>
          <h2 style={{ fontSize: 28 }}>You&apos;ve used your 5 free unlocks</h2>
          {c && (
            <div className="row" style={{ flexWrap: "nowrap" }}>
              <img src={c.img} alt="" className="thumb blur" width={56} height={56} />
              <p className="small muted">Your next candidate is waiting. Upgrade or add one unlock to request this match.</p>
            </div>
          )}
          <div className="cols-2" style={{ ["--gap" as string]: "12px" }}>
            <Link href="/r/billing/upgrade?plan=growth" className="card stack" style={{ textDecoration: "none", padding: 16, borderTop: "2px solid var(--gold)" }}>
              <strong>Growth</strong>
              <span className="small muted">50 unlocks · {inr(12500)} / mo</span>
            </Link>
            <Link href="/r/billing/upgrade?plan=team" className="card stack" style={{ textDecoration: "none", padding: 16 }}>
              <strong>Team</strong>
              <span className="small muted">250 unlocks · {inr(42000)} / mo</span>
            </Link>
          </div>
          <form method="dialog" className="row between">
            <button className="btn btn-ghost">Maybe later</button>
            <button
              className="btn btn-gold"
              onClick={() => {
                setUnlocks(used, cap + 1);
                setToast({ text: "Payment received · 1 extra unlock added (₹350)" });
              }}
            >
              Add 1 unlock · ₹350
            </button>
          </form>
        </div>
      </dialog>

      <dialog ref={matchDlg} aria-label="It's a match" className="dark">
        <div className="dialog-body">{matched && <MatchCelebration who={matched.blind} href="/r/chat/rt-1" />}</div>
      </dialog>

      <dialog ref={filterDlg} className="sheet" aria-label="Filters">
        <FiltersForm
          value={filters}
          onApply={(f) => {
            setFilters(f);
            filterDlg.current?.close();
            reload(roleId, f);
          }}
          onClose={() => filterDlg.current?.close()}
        />
      </dialog>

      {toast && <Toast onClose={() => setToast(null)} action={toast.undo ? { label: "Undo", run: () => (undo(), setToast(null)) } : undefined}>{toast.text}</Toast>}
    </div>
  );
}

function FiltersForm({ value, onApply, onClose }: { value: Filters; onApply: (f: Filters) => void; onClose: () => void }) {
  const [f, setF] = useState(value);
  const toggle = <K extends "skills" | "band" | "cities">(k: K, v: Filters[K][number]) =>
    setF({ ...f, [k]: (f[k] as string[]).includes(v as string) ? (f[k] as string[]).filter((x) => x !== v) : [...(f[k] as string[]), v] });
  return (
    <form
      className="dialog-body"
      style={{ minHeight: "100%", alignContent: "start" }}
      onSubmit={(e) => {
        e.preventDefault();
        onApply(f);
      }}
    >
      <div className="row between">
        <h2 style={{ fontSize: 28 }}>Filters</h2>
        <button type="button" className="btn btn-ghost btn-icon" aria-label="Close filters" onClick={onClose}><Icon name="x" /></button>
      </div>
      <fieldset className="stack" style={{ ["--gap" as string]: "0" }}>
        <legend>Skills</legend>
        {["React", "TypeScript", "Kubernetes", "SQL", "Cloud", "IFRS"].map((s) => (
          <label key={s} className="check"><input type="checkbox" checked={f.skills.includes(s)} onChange={() => toggle("skills", s)} /> {s}</label>
        ))}
      </fieldset>
      <div className="field">
        <label htmlFor="years">Minimum experience: {f.minYears} years</label>
        <input id="years" type="range" min={0} max={12} value={f.minYears} onChange={(e) => setF({ ...f, minYears: Number(e.target.value) })} style={{ accentColor: "var(--navy)" }} />
      </div>
      <div className="field">
        <label htmlFor="notice">Notice period</label>
        <select id="notice" value={f.notice} onChange={(e) => setF({ ...f, notice: e.target.value })}>
          <option value="Any">Any</option>
          <option value="0">Available immediately</option>
          <option value="15">15 days or less</option>
          <option value="30">30 days or less</option>
          <option value="60">60 days or less</option>
        </select>
      </div>
      <fieldset className="stack" style={{ ["--gap" as string]: "0" }}>
        <legend>Location</legend>
        {["Hyderabad", "Dubai", "Ras Al Khaimah"].map((s) => (
          <label key={s} className="check"><input type="checkbox" checked={f.cities.includes(s)} onChange={() => toggle("cities", s)} /> {s}</label>
        ))}
      </fieldset>
      <fieldset className="stack" style={{ ["--gap" as string]: "0" }}>
        <legend>Pay-band overlap</legend>
        {(["In-Band", "Stretch", "Out-of-Band"] as Band[]).map((s) => (
          <label key={s} className="check"><input type="checkbox" checked={f.band.includes(s)} onChange={() => toggle("band", s)} /> {s}</label>
        ))}
      </fieldset>
      <label className="check" style={{ justifyContent: "space-between" }}>
        <span>Verified skills only</span>
        <input type="checkbox" role="switch" className="switch" checked={f.verified} onChange={(e) => setF({ ...f, verified: e.target.checked })} />
      </label>
      <div className="row between" style={{ borderTop: "1px solid var(--line)", paddingTop: 16 }}>
        <button type="button" className="btn btn-ghost" onClick={() => setF(none)}>Clear all</button>
        <button className="btn btn-primary">Show results</button>
      </div>
    </form>
  );
}
