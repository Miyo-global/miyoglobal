import { Inview } from "@/ledger/components/common/robot-inview";
import { CornerMarkers } from "@/ledger/components/ui/corner-markers";
import { ENTRY_DELAY, ENTRY_STAGGER } from "@/ledger/lib/springs/reveal";

import { why } from "./content";
import { SectionHead } from "./ui/section-head";

const REVEAL = { tension: 210, friction: 28 };

/** 5 · Why MIYO: four dashed cells with corner markers, on navy. */
export function Why() {
  return (
    <section id="why" aria-labelledby="why-title" data-ground="dark" data-header-theme="dark" className="ld-dark relative text-on-dark">
      <div className="grid grid-cols-12 gap-x-5 gap-y-16 px-5 py-24 md:px-10 lg:py-40">
        <SectionHead eyebrow={why.eyebrow} title={why.title} lead={why.lead} id="why-title" tone="dark" />
        <ul className="col-span-12 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {why.cells.map((cell, i) => (
            <Inview
              key={cell.title}
              tag="li"
              mode="once"
              delayIn={ENTRY_DELAY + i * ENTRY_STAGGER}
              from={{ opacity: 0, y: 16 }}
              to={{ opacity: 1, y: 0 }}
              config={REVEAL}
              className="relative flex flex-col border border-dashed border-rule-dark p-8"
            >
              <CornerMarkers className="bg-on-dark" />
              <h3 className="font-sans text-h3 font-medium">{cell.title}</h3>
              <p className="mt-4 flex-1 font-sans text-body text-on-dark-muted">{cell.text}</p>
              <p className="mt-8 border-t border-dashed border-rule-dark pt-4 font-sans text-body text-on-dark-muted">
                <span className="block font-sans text-eyebrow font-medium uppercase text-on-dark-meta">What partners get · {cell.getLabel}</span>
                <span className="mt-2 block">{cell.get}</span>
              </p>
            </Inview>
          ))}
        </ul>
      </div>
    </section>
  );
}
