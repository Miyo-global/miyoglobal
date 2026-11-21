"use client";

import { useRef, type RefObject } from "react";

import { Hover } from "@/ledger/components/common/hover-when-able";
import { Inview } from "@/ledger/components/common/robot-inview";
import { RollLabel } from "@/ledger/components/ui/roll-label";
import { ENTRY_DELAY, ENTRY_STAGGER } from "@/ledger/lib/springs/reveal";

const FILL = { tension: 240, friction: 30 };
const REVEAL = { tension: 210, friction: 28 };

interface Row {
  index: string;
  name: string;
  text: string;
}

/**
 * Full-width dashed rows with Northwall roll labels; hovering fills a row from
 * the bottom in the raised surface. Rows are not links: no confirmed target
 * exists ({{PLACEHOLDER: confirm a /staffing-solutions#models anchor}}).
 */
export function ModelsRows({ rows }: { rows: readonly Row[] }) {
  return (
    <ul className="col-span-12 border-b border-dashed border-rule-light">
      {rows.map((row, i) => (
        <Inview key={row.index} tag="li" mode="once" delayIn={ENTRY_DELAY + i * ENTRY_STAGGER} from={{ opacity: 0, y: 16 }} to={{ opacity: 1, y: 0 }} config={REVEAL}>
          <ModelRow row={row} />
        </Inview>
      ))}
    </ul>
  );
}

function ModelRow({ row }: { row: Row }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const trigger = ref as unknown as RefObject<HTMLElement>;
  return (
    <div ref={ref} className="relative grid grid-cols-12 items-baseline gap-x-5 gap-y-2 border-t border-dashed border-rule-light py-8">
      <Hover tag="span" trigger={trigger} from={{ scaleY: 0 }} to={{ scaleY: 1 }} config={FILL} aria-hidden="true" className="absolute inset-0 origin-bottom bg-raised-light" />
      <span className="relative col-span-2 font-sans text-eyebrow font-medium uppercase text-ink-meta md:col-span-1">{row.index}</span>
      <h3 className="relative col-span-10 font-sans text-h3 font-medium md:col-span-4">
        <RollLabel label={row.name} trigger={trigger} />
      </h3>
      <p className="relative col-span-12 font-sans text-body text-ink-muted md:col-span-7 md:col-start-6">{row.text}</p>
    </div>
  );
}
