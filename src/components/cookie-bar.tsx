"use client";

import { useState, useSyncExternalStore } from "react";

const KEY = "miyo-consent";

function read() {
  try {
    return !!localStorage.getItem(KEY);
  } catch {
    return true;
  }
}

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}

export function CookieBar() {
  const consented = useSyncExternalStore(subscribe, read, () => true);
  const [dismissed, setDismissed] = useState(false);
  return (
    <div className={`cookiebar${!consented && !dismissed ? " show" : ""}`} role="dialog" aria-label="Cookie notice">
      <p>We use essential functionality only, no tracking or advertising cookies. Fonts load from Google Fonts. See our <a href="/privacy-policy">Privacy &amp; Cookie Policy</a>.</p>
      <button
        className="btn btn-gold"
        type="button"
        onClick={() => {
          setDismissed(true);
          try {
            localStorage.setItem(KEY, "1");
          } catch {
            return;
          }
        }}
      >
        Got it
      </button>
    </div>
  );
}
