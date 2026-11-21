import { Inview } from "@/ledger/components/common/robot-inview";
import { CornerMarkers } from "@/ledger/components/ui/corner-markers";
import { DashedLink } from "@/ledger/components/ui/dashed-link";
import { ENTRY_DELAY, ENTRY_STAGGER } from "@/ledger/lib/springs/reveal";

import { compliance, referrals } from "./content";

const REVEAL = { tension: 210, friction: 28 };
const BOX = "relative flex flex-col border border-dashed border-rule-light bg-raised-light p-8 md:p-10";

/** 11 · Compliance + Referrals band: two dashed boxes side by side, on paper. */
export function ComplianceReferrals() {
  return (
    <section aria-label="Compliance and referrals" data-ground="light" data-header-theme="light" className="relative text-ink">
      <div className="grid grid-cols-12 gap-5 px-5 pb-24 md:px-10 lg:pb-40">
        <Inview tag="div" mode="once" delayIn={ENTRY_DELAY} from={{ opacity: 0, y: 16 }} to={{ opacity: 1, y: 0 }} config={REVEAL} className={`col-span-12 md:col-span-6 ${BOX}`}>
          <CornerMarkers className="bg-ink" />
          <h2 className="font-display text-[2rem] leading-none font-semibold tracking-[-0.015em] md:text-[2.5rem]">{compliance.title}</h2>
          <p className="mt-6 font-sans text-body text-ink-muted">{compliance.text}</p>
        </Inview>
        <Inview tag="div" mode="once" delayIn={ENTRY_DELAY + ENTRY_STAGGER} from={{ opacity: 0, y: 16 }} to={{ opacity: 1, y: 0 }} config={REVEAL} className={`col-span-12 md:col-span-6 ${BOX}`}>
          <CornerMarkers className="bg-ink" />
          <p className="font-sans text-eyebrow font-medium uppercase text-ink-meta">{referrals.eyebrow}</p>
          <h2 className="mt-6 font-display text-[2rem] leading-none font-semibold tracking-[-0.015em] md:text-[2.5rem]">{referrals.title}</h2>
          <p className="mt-6 font-sans text-body text-ink-muted">{referrals.text}</p>
          <p className="mt-4 font-sans text-eyebrow text-ink-meta">{referrals.meta}</p>
          <div className="mt-8 flex-1 content-end">
            <DashedLink href={referrals.action.href} label={referrals.action.label} tone="light" primary external />
          </div>
        </Inview>
      </div>
    </section>
  );
}
