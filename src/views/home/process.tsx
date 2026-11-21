import { HydrateWhenIdle } from "@/ledger/components/common/hydrate-when-idle";

import { process } from "./content";
import { ProcessStage } from "./process-stage";
import { SectionHead } from "./ui/section-head";

/** 6 · How we deliver (Northwall process), on navy. */
export function Process() {
  return (
    <section id="process" aria-labelledby="process-title" data-ground="dark" data-header-theme="dark" className="ld-dark relative overflow-hidden text-on-dark">
      <div className="grid grid-cols-12 gap-x-5 gap-y-16 px-5 py-24 md:px-10 lg:py-40">
        <SectionHead eyebrow={process.eyebrow} title={process.title} id="process-title" tone="dark" />
        <HydrateWhenIdle>
          <ProcessStage steps={process.steps} />
        </HydrateWhenIdle>
        <p className="col-span-12 flex items-center justify-center gap-3 font-sans text-eyebrow font-medium uppercase text-on-dark-meta">
          <span aria-hidden="true" className="block size-1 bg-accent" />
          {process.caption}
        </p>
      </div>
    </section>
  );
}
