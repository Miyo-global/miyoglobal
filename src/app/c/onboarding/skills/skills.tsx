"use client";

import { useState } from "react";
import { Icon, Verified } from "@/components/ui";
import { me } from "@/data/fixtures";

export function SkillsEditor() {
  const [skills, setSkills] = useState(me.skills);
  const [draft, setDraft] = useState("");
  const [file, setFile] = useState<string | null>(null);
  return (
    <div className="stack" style={{ ["--gap" as string]: "32px" }}>
      <section className="stack" aria-labelledby="sk">
        <h2 id="sk" style={{ fontSize: 24 }}>Skills</h2>
        <form
          className="row"
          style={{ flexWrap: "nowrap" }}
          onSubmit={(e) => {
            e.preventDefault();
            if (draft.trim() && skills.length < 8) setSkills([...skills, { name: draft.trim(), verified: false }]);
            setDraft("");
          }}
        >
          <div className="field" style={{ flex: 1 }}>
            <label htmlFor="skill" className="sr">Add a skill</label>
            <input id="skill" placeholder="Add a skill, for example Redux" value={draft} onChange={(e) => setDraft(e.target.value)} />
          </div>
          <button className="btn"><Icon name="plus" /> Add</button>
        </form>
        <p className="hint">{skills.length} of 8 skills. Verified skills carry a badge on your card.</p>
        <ul className="list card" style={{ padding: "0 16px" }}>
          {skills.map((s) => (
            <li key={s.name} className="item">
              <span className="item-body">{s.name}</span>
              {s.verified ? <Verified>Verified</Verified> : <span className="chip">Pending check</span>}
              <button className="btn btn-ghost btn-icon" aria-label={`Remove ${s.name}`} onClick={() => setSkills(skills.filter((x) => x !== s))}>
                <Icon name="x" />
              </button>
            </li>
          ))}
        </ul>
      </section>
      <section className="stack" aria-labelledby="ce">
        <h2 id="ce" style={{ fontSize: 24 }}>Certificates</h2>
        <ul className="list card" style={{ padding: "0 16px" }}>
          {me.certs.map((c) => (
            <li key={c.name} className="item">
              <Icon name="file" />
              <span className="item-body">
                <strong className="small">{c.name}</strong>
                <span className="muted small" style={{ display: "block" }}>{c.issuer}</span>
              </span>
              <Verified>Verified</Verified>
            </li>
          ))}
          {file && (
            <li className="item">
              <Icon name="file" />
              <span className="item-body small truncate">{file}</span>
              <span className="chip chip-gold">In review</span>
            </li>
          )}
        </ul>
        <label className="dropzone" style={{ cursor: "pointer" }}>
          <Icon name="upload" />
          <strong>Upload a certificate</strong>
          <span className="hint">PDF or image, up to 5 MB. Our desk verifies it within 2 working days.</span>
          <input type="file" accept=".pdf,image/png,image/jpeg" className="sr" onChange={(e) => setFile(e.target.files?.[0]?.name ?? null)} />
        </label>
      </section>
    </div>
  );
}
