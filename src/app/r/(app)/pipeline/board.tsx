"use client";

import Link from "next/link";
import { useState } from "react";
import { CopyButton, Modal } from "@/components/client";
import { BandChip, Icon } from "@/components/ui";
import { candidate, pipeline, stages, type Stage } from "@/data/fixtures";

export function Board() {
  const [cards, setCards] = useState(pipeline);
  const [view, setView] = useState<"board" | "list">("board");
  const [expiry, setExpiry] = useState("7");
  const move = (id: string, stage: Stage) => setCards(cards.map((c) => (c.id === id ? { ...c, stage } : c)));
  const card = (p: (typeof pipeline)[number]) => {
    const c = candidate(p.candidate)!;
    const revealed = ["Matched", "Interview", "Offer"].includes(p.stage);
    return (
      <article key={p.id} className="card stack" style={{ padding: 16, ["--gap" as string]: "12px" }}>
        <div className="row" style={{ flexWrap: "nowrap" }}>
          <img src={c.img} alt="" className={revealed ? "avatar" : "avatar blur"} width={40} height={40} />
          <div style={{ minWidth: 0 }}>
            <Link href={`/r/candidates/${c.id}`}><strong>{revealed ? c.name : c.blind}</strong></Link>
            <p className="muted small truncate">{c.title}</p>
          </div>
        </div>
        <div className="row"><span className="chip">{c.fit} fit</span><BandChip band={c.band} /></div>
        <p className="mono small muted">{p.role} · {p.note}</p>
        <div className="field">
          <label htmlFor={`mv-${p.id}`} className="sr">Move {c.blind} to stage</label>
          <select id={`mv-${p.id}`} value={p.stage} onChange={(e) => move(p.id, e.target.value as Stage)} style={{ minHeight: 40, padding: "8px 12px" }}>
            {stages.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </article>
    );
  };
  return (
    <div className="stack" style={{ ["--gap" as string]: "24px" }}>
      <div className="row between">
        <div className="seg" role="group" aria-label="View">
          <button aria-pressed={view === "board"} onClick={() => setView("board")}><Icon name="kanban" size={16} /></button>
          <button aria-pressed={view === "list"} onClick={() => setView("list")}><Icon name="list" size={16} /></button>
        </div>
        <Modal trigger={<><Icon name="link" /> Share shortlist</>} triggerClass="btn btn-primary" title="Share shortlist">
          <p className="muted">Create a read-only link for a hiring manager. It shows blind pitches, the criteria matrix and pay bands — never names or contact details.</p>
          <div className="field">
            <label htmlFor="exp">Link expires after</label>
            <select id="exp" value={expiry} onChange={(e) => setExpiry(e.target.value)}>
              <option value="1">24 hours</option>
              <option value="3">3 days</option>
              <option value="7">7 days</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="lnk">Link</label>
            <input id="lnk" readOnly value={`https://beta.miyoglobal.com/share/shr-0412-${expiry}d`} />
          </div>
          <p className="hint">Expires {expiry === "1" ? "27 Nov 2026" : expiry === "3" ? "29 Nov 2026" : "03 Dec 2026"}, 23:59 IST. Every view is logged.</p>
          <div className="row">
            <CopyButton text={`https://beta.miyoglobal.com/share/shr-0412-${expiry}d`} />
            <Link href={`/share/shr-0412-${expiry}d`} className="btn" target="_blank">Preview card</Link>
          </div>
        </Modal>
      </div>
      {view === "board" ? (
        <div className="kanban" role="list" aria-label="Pipeline stages">
          {stages.map((s) => {
            const list = cards.filter((c) => c.stage === s);
            return (
              <section key={s} className="col" role="listitem" aria-labelledby={`col-${s}`}>
                <div className="row between"><h2 id={`col-${s}`} className="label">{s}</h2><span className="mono small">{list.length}</span></div>
                {list.length ? list.map(card) : <p className="muted small" style={{ padding: 12, border: "1px dashed var(--line)", borderRadius: 4 }}>Nothing here yet</p>}
              </section>
            );
          })}
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Candidate</th><th>Role</th><th>Fit</th><th>Band</th><th>Stage</th><th>Note</th></tr></thead>
            <tbody>
              {cards.map((p) => {
                const c = candidate(p.candidate)!;
                return (
                  <tr key={p.id}>
                    <td><Link href={`/r/candidates/${c.id}`}>{["Matched", "Interview", "Offer"].includes(p.stage) ? c.name : c.blind}</Link></td>
                    <td className="mono">{p.role}</td>
                    <td className="mono">{c.fit}</td>
                    <td><BandChip band={c.band} /></td>
                    <td>
                      <label className="sr" htmlFor={`l-${p.id}`}>Stage</label>
                      <select id={`l-${p.id}`} className="input" style={{ minHeight: 36, padding: "4px 8px" }} value={p.stage} onChange={(e) => move(p.id, e.target.value as Stage)}>
                        {stages.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="muted">{p.note}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
