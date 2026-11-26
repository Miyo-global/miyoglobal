"use client";

import Link from "next/link";
import { useState } from "react";
import { Modal } from "@/components/client";
import { Icon } from "@/components/ui";
import { setUnlocks, useUnlocks } from "../../unlocks";

export function RequestMatch({ name }: { name: string }) {
  const { used, cap } = useUnlocks();
  const [sent, setSent] = useState<"match" | "questions" | null>(null);
  if (sent)
    return (
      <div className="banner" role="status">
        <Icon name="check" />
        <span>{sent === "match" ? `Match requested. ${name} has 48 hours to reply.` : `2 video questions sent to ${name}.`} <Link href="/r/pipeline">See pipeline</Link></span>
      </div>
    );
  return (
    <div className="stack" style={{ ["--gap" as string]: "12px" }}>
      {used >= cap ? (
        <Link href="/r/billing/upgrade" className="btn btn-gold btn-block"><Icon name="lock" /> Upgrade to request match</Link>
      ) : (
        <button className="btn btn-primary btn-block" onClick={() => (setUnlocks(used + 1, cap), setSent("match"))}>
          <Icon name="key" /> Request match · uses 1 unlock
        </button>
      )}
      <Modal trigger={<><Icon name="video" /> Ask 2 follow-up questions</>} triggerClass="btn btn-block" title={`Ask ${name} 2 questions`}>
        <form method="dialog" className="stack" onSubmit={() => setSent("questions")}>
          <div className="field"><label htmlFor="fq1">Question 1</label><input id="fq1" required defaultValue="How did you measure the checkout improvement?" /></div>
          <div className="field"><label htmlFor="fq2">Question 2</label><input id="fq2" defaultValue="What would your first 30 days with us look like?" /></div>
          <p className="hint">Answered in 20-second videos. Asking questions doesn&apos;t use an unlock.</p>
          <button className="btn btn-primary">Send questions</button>
        </form>
      </Modal>
      <p className="mono small muted">{Math.max(0, cap - used)} unlocks left this month</p>
    </div>
  );
}
