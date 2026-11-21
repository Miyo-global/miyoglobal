import Image from "next/image";

import { Inview } from "@/ledger/components/common/robot-inview";
import { CornerMarkers } from "@/ledger/components/ui/corner-markers";
import { DashedLink } from "@/ledger/components/ui/dashed-link";
import { ENTRY_DELAY } from "@/ledger/lib/springs/reveal";

import { proof } from "./content";
import { CountUp } from "./ui/count-up";
import { SectionHead } from "./ui/section-head";

/** Northwall's card entry: the card draws open top to bottom, 180ms apart, the photo settling from 1.18. */
const MASK = { tension: 70, friction: 24, clamp: true };
const SETTLE = { tension: 60, friction: 26 };
const STAGGER = 180;

/** 8 · Proof (Northwall projects: three cards, the middle one taller), on paper. */
export function Proof() {
  return (
    <section id="proof" aria-labelledby="proof-title" data-ground="light" data-header-theme="light" className="relative text-ink">
      <div className="grid grid-cols-12 gap-x-5 gap-y-16 px-5 py-24 md:px-10 lg:py-40">
        <SectionHead eyebrow={proof.eyebrow} title={proof.title} id="proof-title" tone="light" />
        <div className="col-span-12 self-end lg:col-span-4 lg:justify-self-end">
          <DashedLink href={proof.action.href} label={proof.action.label} tone="light" />
        </div>

        <ul className="col-span-12 grid grid-cols-1 items-start gap-5 md:grid-cols-3">
          {proof.cards.map((card, i) => (
            <li key={card.label} className="relative border border-dashed border-rule-light bg-raised-light">
              <CornerMarkers className="bg-ink" />
              <Inview
                tag="div"
                mode="once"
                delayIn={ENTRY_DELAY + i * STAGGER}
                from={{ clipPath: "inset(0% 0% 100% 0%)" }}
                to={{ clipPath: "inset(0% 0% 0% 0%)" }}
                config={MASK}
                className="p-1.5"
              >
                <div className={`ld-duotone relative overflow-hidden ${card.tall ? "aspect-[4/5]" : "aspect-[4/3]"}`}>
                  <Inview tag="div" mode="once" delayIn={ENTRY_DELAY + i * STAGGER} from={{ scale: 1.18 }} to={{ scale: 1 }} config={SETTLE} className="absolute inset-0">
                    <Image src={card.image.src} alt={card.image.alt} fill sizes="(max-width: 767px) 92vw, 31vw" quality={70} className="object-cover" style={{ objectPosition: card.position }} />
                  </Inview>
                </div>
                <div className="p-6">
                  <h3 className="font-sans text-eyebrow font-medium uppercase text-ink-meta">{card.label}</h3>
                  <p className="mt-4 font-sans text-body">{card.text}</p>
                  <dl className="mt-8 grid grid-cols-3 gap-3 border-t border-dashed border-rule-light pt-5">
                    {card.figures.map((figure, j) => (
                      <div key={figure.label} className="flex flex-col-reverse gap-2">
                        <dt className="font-sans text-eyebrow text-ink-meta">{figure.label}</dt>
                        <dd className="font-sans text-[1.75rem] leading-[0.95] font-light tracking-[-0.03em] xl:text-[2.25rem]">
                          <CountUp value={figure.value} delay={j * 110} />
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Inview>
            </li>
          ))}
        </ul>
        <p className="col-span-12 font-sans text-eyebrow text-ink-meta">{proof.footnote}</p>
      </div>
    </section>
  );
}
