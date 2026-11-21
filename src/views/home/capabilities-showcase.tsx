"use client";

import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";

import { Spring } from "@/ledger/components/common/robot-spring";
import { CornerMarkers } from "@/ledger/components/ui/corner-markers";
import { useDynamicInView } from "@/ledger/hooks/animation/use-dynamic-in-view";

import type { Img } from "./content";

/** Six photos: 1600ms a beat (Northwall's 520ms is too frantic here). */
const STEP_INTERVAL = 1600;
const FADE = { tension: 420, friction: 38 };
const TOPIC = { tension: 260, friction: 30 };
/** Inactive topics: the brief's 55% measured 3.9:1 (navy on white); 64% clears 4.5:1. */
const DIM = 0.64;

const REDUCED = "(prefers-reduced-motion: reduce)";
const readReduced = () => window.matchMedia(REDUCED).matches;
const subscribeReduced = (notify: () => void) => {
  const query = window.matchMedia(REDUCED);
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
};

/**
 * Northwall's about showcase: one photo frame cycling while the topic list
 * advances in step, two topics lit per beat. Pauses on hover and focus, and
 * has a visible pause control because it runs longer than five seconds
 * (WCAG 2.2.2). Reduced motion holds the first frame.
 */
export function CapabilitiesShowcase({ gallery, topics }: { gallery: readonly Img[]; topics: readonly string[] }) {
  const [setNode, inView] = useDynamicInView({ threshold: 0.3 });
  const [step, setStep] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [paused, setPaused] = useState(false);
  const reduced = useSyncExternalStore(subscribeReduced, readReduced, () => false);

  useEffect(() => {
    if (!inView || hovered || paused || reduced) return;
    const timer = window.setInterval(() => setStep((s) => s + 1), STEP_INTERVAL);
    return () => window.clearInterval(timer);
  }, [inView, hovered, paused, reduced]);

  const photo = step % gallery.length;
  const lit = new Set([(step * 2) % topics.length, (step * 2 + 1) % topics.length]);

  return (
    <div
      ref={setNode}
      className="col-span-12 grid grid-cols-12 gap-5 md:contents"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <ul className="col-span-12 flex flex-col gap-1 self-end font-sans text-lead font-light md:col-span-4 md:col-start-1">
        {topics.map((topic, i) => (
          <Spring key={topic} tag="li" from={{ opacity: i < 2 ? 1 : DIM }} to={{ opacity: lit.has(i) ? 1 : DIM }} config={TOPIC}>
            {topic}
          </Spring>
        ))}
      </ul>

      <div className="col-span-12 md:col-span-4">
        <figure className="relative aspect-[4/5] border border-dashed border-rule-light p-1.5">
          <span className="ld-duotone relative block size-full overflow-hidden">
            {gallery.map((image, i) => (
              <Spring key={image.src} tag="span" className="absolute inset-0 block" from={{ opacity: i === 0 ? 1 : 0 }} to={{ opacity: i === photo ? 1 : 0 }} config={FADE}>
                <Image src={image.src} alt={i === photo ? image.alt : ""} fill sizes="(max-width: 767px) 92vw, 30vw" quality={70} className="object-cover" />
              </Spring>
            ))}
          </span>
          <CornerMarkers className="bg-ink" />
        </figure>
        {!reduced && (
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-pressed={paused}
            className="mt-3 min-h-11 font-sans text-label font-medium uppercase text-ink-meta underline-offset-4 hover:underline"
          >
            {paused ? "Play rotation" : "Pause rotation"}
          </button>
        )}
      </div>
    </div>
  );
}
