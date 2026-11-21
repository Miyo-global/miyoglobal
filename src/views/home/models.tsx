import { HydrateWhenIdle } from "@/ledger/components/common/hydrate-when-idle";

import { models } from "./content";
import { ModelsRows } from "./models-rows";
import { SectionHead } from "./ui/section-head";

/** 7 · Engagement models, on paper. */
export function Models() {
  return (
    <section id="models" aria-labelledby="models-title" data-ground="light" data-header-theme="light" className="relative text-ink">
      <div className="grid grid-cols-12 gap-x-5 gap-y-16 px-5 py-24 md:px-10 lg:py-40">
        <SectionHead eyebrow={models.eyebrow} title={models.title} id="models-title" tone="light" />
        <HydrateWhenIdle>
          <ModelsRows rows={models.rows} />
        </HydrateWhenIdle>
      </div>
    </section>
  );
}
