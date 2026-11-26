"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MatchCelebration } from "@/components/states";
import { Icon } from "@/components/ui";

export function MatchActions({ company, matched, chat, decline }: { company: string; matched: boolean; chat: string; decline: boolean }) {
  const [consent, setConsent] = useState(matched);
  const [done, setDone] = useState<"accepted" | "declined" | null>(null);
  const celebrate = useRef<HTMLDialogElement>(null);
  const confirm = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (decline) confirm.current?.showModal();
  }, [decline]);
  if (done === "declined")
    return (
      <div className="banner" role="status">
        <Icon name="check" />
        <span>Declined. {company} won&apos;t see your name. <Link href="/c/matches">Back to matches</Link></span>
      </div>
    );
  return (
    <div className="card stack">
      <label className="check" style={{ justifyContent: "space-between" }}>
        <span>
          <strong style={{ display: "block" }}>Reveal my identity to {company}</strong>
          <span className="hint">Shares your full name, photo and contact details with this company only.</span>
        </span>
        <input type="checkbox" role="switch" className="switch" checked={consent} onChange={(e) => setConsent(e.target.checked)} disabled={matched} />
      </label>
      {matched ? (
        <Link href={chat} className="btn btn-primary btn-block"><Icon name="chat" /> Open chat</Link>
      ) : (
        <div className="row">
          <button
            className="btn btn-primary"
            style={{ flex: 1 }}
            disabled={!consent}
            aria-describedby={!consent ? "consent-hint" : undefined}
            onClick={() => {
              setDone("accepted");
              celebrate.current?.showModal();
            }}
          >
            <Icon name="check" /> Accept match
          </button>
          <button className="btn" style={{ flex: 1 }} onClick={() => confirm.current?.showModal()}><Icon name="x" /> Decline</button>
        </div>
      )}
      {!consent && !matched && <p id="consent-hint" className="hint">Turn on reveal consent to accept.</p>}
      <dialog ref={celebrate} aria-label="It's a match" className="dark">
        <div className="dialog-body">
          <MatchCelebration who={company} href={chat} />
        </div>
      </dialog>
      <dialog ref={confirm} aria-label="Decline this match">
        <div className="dialog-body">
          <h2 style={{ fontSize: 28 }}>Decline this match?</h2>
          <p className="muted">{company} will be told you passed. They won&apos;t see your name, and this can&apos;t be undone.</p>
          <form method="dialog" className="row" style={{ justifyContent: "flex-end" }}>
            <button className="btn">Keep it</button>
            <button className="btn btn-danger" onClick={() => setDone("declined")}>Decline match</button>
          </form>
        </div>
      </dialog>
    </div>
  );
}
