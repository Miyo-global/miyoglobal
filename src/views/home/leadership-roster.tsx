"use client";

import { animated, useSpring } from "@react-spring/web";
import { useEffect, useRef, useState } from "react";

import { Inview } from "@/ledger/components/common/robot-inview";
import { Spring } from "@/ledger/components/common/robot-spring";
import { CornerMarkers } from "@/ledger/components/ui/corner-markers";
import { ENTRY_DELAY } from "@/ledger/lib/springs/reveal";

import type { Leader } from "./content";
import { CountUp } from "./ui/count-up";

const SLIDE = { tension: 480, friction: 42 };
const ROW_REVEAL = { tension: 55, friction: 22 };
const ROW_STAGGER = 220;
const ROW_HIDDEN = { opacity: 0, y: -28, filter: "blur(14px)" };
const ROW_SHOWN = { opacity: 1, y: 0, filter: "blur(0px)" };

/**
 * Navy square, Fraunces initials, corner markers: no stock or AI faces. Gold
 * initials only on the single travelling tile, so one gold element shows at a time.
 */
function Monogram({ initials, gold = false, className = "" }: { initials: string; gold?: boolean; className?: string }) {
  return (
    <span aria-hidden="true" className={`relative grid place-items-center bg-ground-dark ${className}`}>
      <span className={`font-display text-[2.5rem] leading-none font-semibold ${gold ? "text-accent" : "text-on-dark"}`}>{initials}</span>
      <CornerMarkers className="bg-on-dark" />
    </span>
  );
}

/**
 * Northwall's team roster: rows drift down out of a blur, 220ms apart, and on
 * wide screens one monogram tile travels to whichever row is hovered or
 * focused. Narrower frames draw a tile in every row.
 */
export function LeadershipRoster({ leaders, compact = false }: { leaders: readonly Leader[]; compact?: boolean }) {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement | null>(null);
  const [pitch, setPitch] = useState(0);

  useEffect(() => {
    const measure = () => {
      const rows = listRef.current?.children;
      if (!rows || rows.length < 2) return;
      setPitch(rows[1].getBoundingClientRect().top - rows[0].getBoundingClientRect().top);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const slide = useSpring({ y: active * pitch, config: SLIDE });
  const tile = compact ? "size-20" : "size-28";

  return (
    <div className="relative">
      <ul ref={listRef} className="flex flex-col gap-3">
        {leaders.map((leader, i) => (
          <Inview
            key={leader.name}
            tag="li"
            mode="once"
            delayIn={ENTRY_DELAY + i * ROW_STAGGER}
            from={ROW_HIDDEN}
            to={ROW_SHOWN}
            config={ROW_REVEAL}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            tabIndex={0}
            className={`relative grid grid-cols-12 gap-x-5 gap-y-4 border border-dashed border-rule-light bg-raised-light ${compact ? "p-6" : "p-6 md:p-8"}`}
          >
            <div className={`col-span-12 flex items-start gap-5 md:col-span-5 ${compact ? "" : "xl:pl-36"}`}>
              <Monogram initials={leader.initials} className={`${tile} shrink-0 ${compact ? "" : "xl:hidden"}`} />
              <div>
                <p className="font-sans text-eyebrow font-medium uppercase text-ink-meta">{leader.eyebrow}</p>
                <h3 className="mt-3 font-sans text-h3 font-medium">{leader.name}</h3>
              </div>
            </div>
            <p className="col-span-12 font-sans text-body text-ink-muted md:col-span-5">{leader.bio}</p>
            <div className="col-span-12 flex flex-col gap-2 font-sans text-body md:col-span-2 md:items-end md:text-right">
              <span className="flex items-center gap-2">
                <span aria-hidden="true" className="size-1.5 shrink-0 bg-ink" />
                {leader.role}
              </span>
              {leader.experience ? (
                <span>
                  <CountUp value={leader.experience} /> <span className="text-ink-meta">experience</span>
                </span>
              ) : null}
            </div>
          </Inview>
        ))}
      </ul>

      {!compact && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden xl:block">
          <animated.div style={{ y: slide.y.to((v) => `${v}px`) }} className="absolute left-8 top-8 size-28">
            {leaders.map((leader, i) => (
              <Spring key={leader.name} tag="div" className="absolute inset-0" from={{ opacity: i === 0 ? 1 : 0 }} to={{ opacity: i === active ? 1 : 0 }} config={SLIDE}>
                <Monogram initials={leader.initials} gold className="size-28" />
              </Spring>
            ))}
          </animated.div>
        </div>
      )}
    </div>
  );
}
