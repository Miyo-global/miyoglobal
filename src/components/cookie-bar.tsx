"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { Button } from "./ui/button";

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

/** Bottom-left notice, shown until acknowledged. Fonts are self-hosted, so the only third party it names is Google Analytics. */
export function CookieBar() {
  const consented = useSyncExternalStore(subscribe, read, () => true);
  const [dismissed, setDismissed] = useState(false);
  if (consented || dismissed) return null;
  return (
    <div role="dialog" aria-label="Cookie notice" className="fixed inset-x-4 bottom-4 z-50 rounded-card border border-rule bg-surface p-6 shadow-overlay md:left-8 md:right-auto md:max-w-measure">
      <p className="text-small text-muted">
        We use Google Analytics cookies to understand how visitors use this site, and no advertising cookies. Fonts are served from our own domain; we make no third-party font requests. See our{" "}
        <Link href="/privacy-policy" className="link text-ink">
          Privacy &amp; Cookie Policy
        </Link>
        .
      </p>
      <Button
        className="mt-4"
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
      </Button>
    </div>
  );
}
