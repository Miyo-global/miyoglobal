import { DashedLink } from "@/ledger/components/ui/dashed-link";
import { HydrateWhenIdle } from "@/ledger/components/common/hydrate-when-idle";
import { ENTRY_DELAY } from "@/ledger/lib/springs/reveal";

import { CapabilitiesShowcase } from "./capabilities-showcase";
import { capabilities } from "./content";
import { SectionHead } from "./ui/section-head";
import { WordRise } from "./ui/word-rise";

/** 3 · Capabilities (Northwall about showcase), on paper. */
export function Capabilities() {
  return (
    <section id="capabilities" aria-labelledby="capabilities-title" data-ground="light" data-header-theme="light" className="relative text-ink">
      <div className="grid grid-cols-12 gap-x-5 gap-y-16 px-5 py-24 md:px-10 lg:py-40">
        <SectionHead eyebrow={capabilities.eyebrow} title={capabilities.title} id="capabilities-title" tone="light" />
        <HydrateWhenIdle>
          <CapabilitiesShowcase gallery={capabilities.gallery} topics={capabilities.topics} />
        </HydrateWhenIdle>
        <div className="col-span-12 flex flex-col items-start gap-8 self-end md:col-span-4">
          <WordRise text={capabilities.mission} delay={ENTRY_DELAY + 280} className="font-sans text-lead font-light" />
          <DashedLink href={capabilities.action.href} label={capabilities.action.label} tone="light" />
        </div>
      </div>
    </section>
  );
}
