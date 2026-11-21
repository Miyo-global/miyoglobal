import { Inview } from "@/ledger/components/common/robot-inview";
import { ENTRY_DELAY } from "@/ledger/lib/springs/reveal";

import type { Rich } from "../content";
import { WordRise } from "./word-rise";

const REVEAL = { tension: 210, friction: 28 };

export type Tone = "dark" | "light";

export interface SectionHeadProps {
  /** `01 // LABEL`, Northwall style. */
  eyebrow: string;
  title: Rich;
  lead?: string;
  id: string;
  tone: Tone;
  className?: string;
}

/**
 * The one section head on the page (coherence rule 4): eyebrow, Fraunces H2,
 * Outfit lead, all on the same grid column with 24px steps.
 */
export function SectionHead({ eyebrow, title, lead, id, tone, className = "" }: SectionHeadProps) {
  const meta = tone === "dark" ? "text-on-dark-meta" : "text-ink-meta";
  const muted = tone === "dark" ? "text-on-dark-muted" : "text-ink-muted";
  return (
    <div className={`col-span-12 lg:col-span-8 ${className}`}>
      <Inview
        tag="p"
        mode="once"
        delayIn={ENTRY_DELAY}
        from={{ opacity: 0, y: 12 }}
        to={{ opacity: 1, y: 0 }}
        config={REVEAL}
        className={`font-sans text-eyebrow font-medium uppercase ${meta}`}
      >
        {eyebrow}
      </Inview>
      <WordRise
        tag="h2"
        id={id}
        text={title}
        stagger={55}
        delay={ENTRY_DELAY + 120}
        className="mt-6 max-w-[16ch] font-display text-[2.5rem] leading-none font-semibold tracking-[-0.015em] md:text-h2"
      />
      {lead ? <WordRise text={lead} delay={ENTRY_DELAY + 280} className={`mt-6 max-w-[56ch] font-sans text-lead font-light ${muted}`} /> : null}
    </div>
  );
}
