import { HydrateWhenIdle } from "@/ledger/components/common/hydrate-when-idle";

import { leadership } from "./content";
import { LeadershipRoster } from "./leadership-roster";
import { SectionHead } from "./ui/section-head";

/** 10 · Leadership (Northwall team roster), on paper. */
export function Leadership() {
  return (
    <section id="leadership" aria-labelledby="leadership-title" data-ground="light" data-header-theme="light" className="relative text-ink">
      <div className="grid grid-cols-12 gap-x-5 gap-y-16 px-5 py-24 md:px-10 lg:py-40">
        <SectionHead eyebrow={leadership.eyebrow} title={leadership.title} id="leadership-title" tone="light" />
        <div className="col-span-12">
          <HydrateWhenIdle>
            <LeadershipRoster leaders={leadership.leaders} />
          </HydrateWhenIdle>
        </div>
        <div className="col-span-12">
          <h3 className="mb-6 font-sans text-eyebrow font-medium uppercase text-ink-meta">Domain advisors</h3>
          <HydrateWhenIdle>
            <LeadershipRoster leaders={leadership.advisors} compact />
          </HydrateWhenIdle>
        </div>
      </div>
    </section>
  );
}
