"use client";

import { useRef, useState, type KeyboardEvent } from "react";

import { Hover } from "@/ledger/components/common/hover-when-able";
import { Inview } from "@/ledger/components/common/robot-inview";
import { Spring } from "@/ledger/components/common/robot-spring";
import { CornerMarkers } from "@/ledger/components/ui/corner-markers";
import { DashedLink } from "@/ledger/components/ui/dashed-link";
import { ENTRY_DELAY, ENTRY_STAGGER } from "@/ledger/lib/springs/reveal";

import type { ServiceTab } from "./content";

const SWAP = { tension: 210, friction: 28 };
const LIFT = { tension: 300, friction: 26 };

/**
 * 4 · Service lines: Fathom's type-tabs + side panel, rebuilt in the Northwall
 * drafting skin. An ARIA tablist (arrow keys, Home/End); switching swaps the
 * panel with one opacity spring and never re-stages the entrance.
 */
export function ServicesTabs({ label, tabs }: { label: string; tabs: readonly ServiceTab[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const tab = tabs[active];

  const choose = (index: number) => {
    setActive(index);
    const node = refs.current[index];
    node?.focus();
    node?.scrollIntoView({ block: "nearest", inline: "center" });
  };

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const last = tabs.length - 1;
    const next = e.key === "ArrowRight" ? (active === last ? 0 : active + 1) : e.key === "ArrowLeft" ? (active === 0 ? last : active - 1) : e.key === "Home" ? 0 : e.key === "End" ? last : null;
    if (next === null) return;
    e.preventDefault();
    choose(next);
  };

  return (
    <div className="col-span-12">
      <div className="relative">
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 border-b border-dashed border-rule-light" />
        <div role="tablist" aria-label={label} className="ld-tabs -mx-5 flex gap-10 overflow-x-auto px-5 [scrollbar-width:none] md:mx-0 md:px-0">
          {tabs.map((t, i) => (
            <button
              key={t.name}
              ref={(node) => {
                refs.current[i] = node;
              }}
              type="button"
              role="tab"
              id={`service-tab-${i}`}
              aria-selected={i === active}
              aria-controls={`service-panel-${i}`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={onKey}
              className={`relative shrink-0 whitespace-nowrap pb-4 font-display text-[1.75rem] font-semibold transition-opacity duration-[var(--duration-normal)] md:text-[2rem] ${i === active ? "opacity-100" : "opacity-60 hover:opacity-90"}`}
            >
              {t.name}
              <span aria-hidden="true" className={`absolute inset-x-0 bottom-0 h-0.5 bg-accent transition-opacity duration-[var(--duration-normal)] ${i === active ? "opacity-100" : "opacity-0"}`} />
            </button>
          ))}
        </div>
      </div>

      <Spring key={tab.name} tag="div" from={{ opacity: 0 }} to={{ opacity: 1 }} config={SWAP} className="mt-16 grid grid-cols-12 gap-5">
        <ul className="col-span-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-3">
          {tab.cells.map((cell, i) => (
            <Inview key={cell.title} tag="li" mode="once" delayIn={ENTRY_DELAY + i * (ENTRY_STAGGER / 2)} from={{ opacity: 0, y: 16 }} to={{ opacity: 1, y: 0 }} config={SWAP}>
              <Cell title={cell.title} text={cell.text} />
            </Inview>
          ))}
        </ul>

        <div
          role="tabpanel"
          id={`service-panel-${active}`}
          aria-labelledby={`service-tab-${active}`}
          tabIndex={0}
          className="relative col-span-12 flex flex-col justify-between gap-10 border border-dashed border-rule-light bg-raised-light p-8 lg:col-span-4"
        >
          <CornerMarkers className="bg-ink" />
          <div>
            <h3 className="font-sans text-h3 font-medium">{tab.name}</h3>
            <p className="mt-4 font-sans text-body text-ink-muted">{tab.text}</p>
            <dl className="mt-8">
              {tab.facts.map((fact) => (
                <div key={fact.label} className="flex flex-col gap-1 border-t border-dashed border-rule-light py-3 last:border-b">
                  <dt className="font-sans text-eyebrow font-medium uppercase text-ink-meta">{fact.label}</dt>
                  <dd className="font-sans text-body">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <DashedLink href={tab.cta.href} label={tab.cta.label} tone="light" className="self-start" />
        </div>
      </Spring>
    </div>
  );
}

function Cell({ title, text }: { title: string; text: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const trigger = ref as unknown as React.RefObject<HTMLElement>;
  return (
    <div ref={ref} className="relative h-full border border-dashed border-rule-light p-8">
      <Hover tag="span" trigger={trigger} from={{ opacity: 0 }} to={{ opacity: 1 }} config={LIFT} aria-hidden="true" className="absolute inset-0 bg-raised-light" />
      <div className="relative">
        <h3 className="font-sans text-lead font-medium tracking-normal">{title}</h3>
        <p className="mt-3 font-sans text-body text-ink-muted">{text}</p>
      </div>
      <CornerMarkers className="bg-ink" trigger={trigger} />
    </div>
  );
}
