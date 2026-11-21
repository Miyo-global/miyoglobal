import { HydrateWhenIdle } from "@/ledger/components/common/hydrate-when-idle";
import { Inview } from "@/ledger/components/common/robot-inview";
import { CornerMarkers } from "@/ledger/components/ui/corner-markers";
import { ENTRY_DELAY, ENTRY_STAGGER } from "@/ledger/lib/springs/reveal";

import { presence } from "./content";
import { PresenceChart } from "./presence-chart";
import { SectionHead } from "./ui/section-head";

const REVEAL = { tension: 210, friction: 28 };

/** 9 · Presence: the passage chart plus two address cards on the rail, on navy. */
export function Presence() {
  return (
    <section id="presence" aria-labelledby="presence-title" data-ground="dark" data-header-theme="dark" className="ld-dark relative text-on-dark">
      <div className="grid grid-cols-12 gap-x-5 gap-y-16 px-5 py-24 md:px-10 lg:py-40">
        <SectionHead eyebrow={presence.eyebrow} title={presence.title} id="presence-title" tone="dark" />
        <div className="col-span-12 lg:col-span-8">
          <HydrateWhenIdle>
            <PresenceChart />
          </HydrateWhenIdle>
        </div>
        <ul className="col-span-12 flex flex-col gap-5 lg:col-span-4">
          {presence.offices.map((office, i) => (
            <Inview
              key={office.region}
              tag="li"
              mode="once"
              delayIn={ENTRY_DELAY + i * ENTRY_STAGGER}
              from={{ opacity: 0, y: 16 }}
              to={{ opacity: 1, y: 0 }}
              config={REVEAL}
              className="relative border border-dashed border-rule-dark bg-raised-dark p-8"
            >
              <CornerMarkers className="bg-on-dark" />
              <h3 className="font-sans text-eyebrow font-medium uppercase text-on-dark-meta">{office.region}</h3>
              <address className="mt-4 font-sans text-body not-italic text-on-dark">{office.address}</address>
            </Inview>
          ))}
        </ul>
      </div>
    </section>
  );
}
