"use client";

import { animate } from "animejs";
import { useId, useRef, useState } from "react";
import { cx } from "../ui/cx";
import { DUR, EASE, prefersReducedMotion } from "./motion";

export type TabItem = { id: string; label: string; content: React.ReactNode };

/**
 * Accessible tabs (WAI-ARIA tablist, arrow keys, Home/End). The panel fades and settles in 250ms when the tab changes.
 * Every panel is server-rendered (inactive ones `hidden`), so all copy is in the HTML for search engines.
 */
export function Tabs({ items, label, onInk, className }: { items: TabItem[]; label: string; onInk?: boolean; className?: string }) {
  const [active, setActive] = useState(0);
  const base = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const panels = useRef<(HTMLDivElement | null)[]>([]);

  const select = (i: number, focus = false) => {
    setActive(i);
    if (focus) tabs.current[i]?.focus();
    const panel = panels.current[i];
    if (panel && !prefersReducedMotion()) requestAnimationFrame(() => animate(panel, { opacity: [0.001, 1], translateY: [8, 0], duration: DUR.base, ease: EASE }));
  };
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const n = items.length;
    const next = e.key === "ArrowRight" ? (i + 1) % n : e.key === "ArrowLeft" ? (i - 1 + n) % n : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : null;
    if (next === null) return;
    e.preventDefault();
    select(next, true);
  };

  return (
    <div className={className}>
      <div role="tablist" aria-label={label} className={cx("flex flex-wrap gap-x-8 border-b", onInk ? "border-on-ink-rule" : "border-rule-strong")}>
        {items.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            role="tab"
            id={`${base}-tab-${t.id}`}
            aria-selected={i === active}
            aria-controls={`${base}-panel-${t.id}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => select(i)}
            onKeyDown={(e) => onKey(e, i)}
            className={cx(
              "-mb-px min-h-12 border-b-2 py-3 text-small font-semibold transition-colors duration-150 ease-brand",
              i === active ? "border-accent" : "border-transparent",
              i === active ? (onInk ? "text-on-ink" : "text-ink") : onInk ? "text-on-ink-muted hover:text-on-ink" : "text-muted hover:text-ink",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      {items.map((t, i) => (
        <div
          key={t.id}
          ref={(el) => {
            panels.current[i] = el;
          }}
          role="tabpanel"
          id={`${base}-panel-${t.id}`}
          aria-labelledby={`${base}-tab-${t.id}`}
          hidden={i !== active}
          tabIndex={0}
          className="pt-8 focus-visible:outline-offset-4"
        >
          {t.content}
        </div>
      ))}
    </div>
  );
}
