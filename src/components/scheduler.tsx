"use client";

import { useState } from "react";
import { Success } from "./states";
import { Icon } from "./ui";

const gst = ["10:00", "11:30", "14:00", "16:30"];
const shift = (t: string, mins: number) => {
  const [h, m] = t.split(":").map(Number);
  const v = h * 60 + m + mins;
  return `${String(Math.floor(v / 60)).padStart(2, "0")}:${String(v % 60).padStart(2, "0")}`;
};
const open = [1, 2, 3, 4, 7, 8, 9, 10, 11];
const proposed: Record<number, number> = { 3: 2 };

export function Scheduler({ recruiter, with: who }: { recruiter?: boolean; with: string }) {
  const [tz, setTz] = useState<"IST" | "GST">(recruiter ? "GST" : "IST");
  const [day, setDay] = useState(3);
  const [slot, setSlot] = useState<number | null>(proposed[3] ?? null);
  const [done, setDone] = useState<"confirmed" | "proposed" | null>(null);
  const [link, setLink] = useState("https://meet.miyoglobal.com/northbridge-0412");
  const [avail, setAvail] = useState<number[]>([1, 2, 3, 4]);
  const time = (t: string) => (tz === "GST" ? t : shift(t, 90));
  const label = (d: number, s: number) => `${["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][(d) % 7]} ${String(d).padStart(2, "0")} Dec 2026, ${time(gst[s])} ${tz}`;

  if (done) {
    const start = `202612${String(day).padStart(2, "0")}T${shift(gst[slot!], -240).replace(":", "")}00Z`;
    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:${start}\nDURATION:PT45M\nSUMMARY:MIYO interview with ${who}\nLOCATION:${link}\nEND:VEVENT\nEND:VCALENDAR`;
    return (
      <Success icon="calendar" title={done === "confirmed" ? "Interview booked" : "New time proposed"} body={`${label(day, slot!)} with ${who}. ${done === "confirmed" ? "A calendar invite is on its way." : "We'll let you know when they reply."}`}>
        <a className="btn btn-primary" download="miyo-interview.ics" href={`data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`}><Icon name="calendar" /> Add to calendar</a>
        <button className="btn" onClick={() => setDone(null)}>{recruiter ? "Reschedule" : "Change time"}</button>
      </Success>
    );
  }

  return (
    <div className="split" style={{ alignItems: "start" }}>
      <section className="card stack" aria-labelledby="cal-h">
        <div className="row between">
          <h2 id="cal-h" style={{ fontSize: 28 }}>December 2026</h2>
          <div className="seg" role="group" aria-label="Time zone">
            {(["IST", "GST"] as const).map((z) => (
              <button key={z} aria-pressed={tz === z} onClick={() => setTz(z)}>{z}</button>
            ))}
          </div>
        </div>
        <div className="cal" role="grid" aria-label="December 2026">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <span key={i} className="label" aria-hidden="true">{d}</span>)}
          <span />
          {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => {
            const ok = recruiter ? true : open.includes(d);
            const weekend = (d + 0) % 7 === 5 || (d + 0) % 7 === 6;
            return (
              <button
                key={d}
                disabled={!ok || weekend}
                className={(recruiter ? avail.includes(d) : ok) && !weekend ? "has" : ""}
                aria-pressed={day === d}
                aria-label={`${d} December 2026${ok && !weekend ? ", has open slots" : ", unavailable"}`}
                onClick={() => {
                  setDay(d);
                  setSlot(proposed[d] ?? null);
                  if (recruiter) setAvail(avail.includes(d) ? avail : [...avail, d]);
                }}
              >
                {d}
              </button>
            );
          })}
        </div>
        <p className="hint">Today is 26 Nov 2026. Dots mark days with open slots. All times shown in {tz === "IST" ? "India Standard Time" : "Gulf Standard Time"}.</p>
      </section>
      <section className="card stack" aria-labelledby="slots-h">
        <h2 id="slots-h" className="label">{label(day, slot ?? 0).split(",")[0]}</h2>
        <div className="slots" role="group" aria-label="Times">
          {gst.map((t, i) => (
            <button key={t} aria-pressed={slot === i} onClick={() => setSlot(i)}>{time(t)} {tz}</button>
          ))}
        </div>
        {proposed[day] !== undefined && (
          <p className="banner small"><Icon name="info" /> {who} proposed {time(gst[proposed[day]])} {tz}.</p>
        )}
        {recruiter && (
          <div className="field">
            <label htmlFor="link">Video call link</label>
            <input id="link" value={link} onChange={(e) => setLink(e.target.value)} />
            <p className="hint">Any video call link works. It&apos;s shared after both sides confirm.</p>
          </div>
        )}
        <p className="small muted">45 minutes · Video call</p>
        <button className="btn btn-primary" disabled={slot === null} onClick={() => setDone("confirmed")}>Confirm time</button>
        <button className="btn" disabled={slot === null} onClick={() => setDone("proposed")}>Propose this time instead</button>
      </section>
    </div>
  );
}
