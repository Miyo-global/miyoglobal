"use client";

import { useState } from "react";

/** Native share sheet where the browser has one; otherwise copies the role link. */
export function ShareButton({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);
  async function share() {
    if (navigator.share) {
      await navigator.share({ title, url }).catch(() => undefined);
      return;
    }
    await navigator.clipboard?.writeText(url).catch(() => undefined);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2400);
  }
  return (
    <button type="button" className="ed-btn quiet" onClick={share} aria-live="polite">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v13" /></svg>
      {copied ? "Link copied" : "Share"}
    </button>
  );
}
