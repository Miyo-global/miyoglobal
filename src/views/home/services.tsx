import { HydrateWhenIdle } from "@/ledger/components/common/hydrate-when-idle";
import { Inview } from "@/ledger/components/common/robot-inview";
import { ENTRY_DELAY } from "@/ledger/lib/springs/reveal";

import { services } from "./content";
import { ServicesTabs } from "./services-tabs";

/** 4 · Service lines, on paper. The tab names act as the section's heading. */
export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" data-ground="light" data-header-theme="light" className="relative text-ink">
      <div className="grid grid-cols-12 gap-x-5 px-5 py-24 md:px-10 lg:py-40">
        <div className="col-span-12 mb-6">
          <Inview tag="p" mode="once" delayIn={ENTRY_DELAY} from={{ opacity: 0, y: 12 }} to={{ opacity: 1, y: 0 }} config={{ tension: 210, friction: 28 }} className="font-sans text-eyebrow font-medium uppercase text-ink-meta">
            {services.eyebrow}
          </Inview>
          <h2 id="services-title" className="sr-only">
            What we do: Staffing Solutions and Digital Solutions
          </h2>
        </div>
        <HydrateWhenIdle>
          <ServicesTabs label="Service lines" tabs={services.tabs} />
        </HydrateWhenIdle>
      </div>
    </section>
  );
}
