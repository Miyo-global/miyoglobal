"use client";

import Link from "next/link";
import { Meter } from "@/components/ui";
import { FREE_UNLOCKS } from "@/data/fixtures";
import { setUnlocks, useUnlocks } from "./unlocks";

export function UnlockMeter() {
  const { used, cap } = useUnlocks();
  return (
    <div className="stack" style={{ ["--gap" as string]: "8px" }}>
      <div className="row between">
        <span className="label">Free unlocks</span>
        <span className="mono small">{Math.min(used, FREE_UNLOCKS)} / {FREE_UNLOCKS}</span>
      </div>
      <Meter value={Math.min(used, cap)} max={cap} gold label="Unlocks used" />
      <div className="row between small">
        <span className="muted">{Math.max(0, cap - used)} left · resets 01 Dec 2026</span>
        <Link href="/r/billing/upgrade" className="gold">Upgrade</Link>
      </div>
      <button className="btn-link small" style={{ justifySelf: "start", padding: 0 }} onClick={() => setUnlocks(2, FREE_UNLOCKS)}>Reset demo unlocks</button>
    </div>
  );
}
