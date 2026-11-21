"use client";

import { animated, useSprings } from "@react-spring/web";
import { createElement, useEffect, useLayoutEffect, useRef, type ElementType } from "react";

import { useHandoff } from "@/ledger/hooks/use-handoff";
import { useDynamicInView } from "@/ledger/hooks/animation/use-dynamic-in-view";
import { COPY_CONFIG, COPY_IN, COPY_OUT, COPY_STAGGER } from "@/ledger/lib/springs/reveal";

import type { Rich } from "../content";
import { PASSAGE_ID } from "../passage-gate";

export interface WordRiseProps {
  tag?: ElementType;
  text: Rich | string;
  className?: string;
  id?: string;
  delay?: number;
  /** Per-word stagger in ms (Northwall: 22 for copy, 55 for display lines). */
  stagger?: number;
  /**
   * First-screen copy: served visible (it can be the LCP), and only drops to
   * its out-state before paint when the passage curtain is covering it, so the
   * rise plays as the curtain opens.
   */
  afterHandoff?: boolean;
}

interface Word {
  text: string;
  em: boolean;
}

const split = (text: Rich | string): Word[] =>
  (typeof text === "string" ? [text] : text).flatMap((segment) => {
    const em = typeof segment !== "string";
    const value = typeof segment === "string" ? segment : segment.em;
    return value
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => ({ text: word, em }));
  });

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Northwall's copy reveal (COPY_* presets): every word rises out of its own
 * clip, fading and scaling up as it arrives, once. Real spaces stay between the
 * words, so the paragraph wraps exactly as plain text would (no WORD_GAP
 * guesswork) and screen readers read it as one sentence. Reduced motion jumps
 * every spring to its end state through react-spring's global flag.
 */
export function WordRise({ tag = "p", text, className = "", id, delay = 0, stagger = COPY_STAGGER, afterHandoff = false }: WordRiseProps) {
  const words = split(text);
  const [setNode, inView] = useDynamicInView({ threshold: 0.2 });
  const handedOff = useHandoff();
  const played = useRef(false);
  const behindCurtain = useRef(false);

  const [springs, api] = useSprings(words.length, () => ({ from: afterHandoff ? COPY_IN : COPY_OUT, config: COPY_CONFIG }), []);

  useIsoLayoutEffect(() => {
    if (!afterHandoff) return;
    if (document.getElementById(PASSAGE_ID)?.dataset.play !== "1") return;
    behindCurtain.current = true;
    api.set(COPY_OUT);
  }, [afterHandoff, api]);

  useEffect(() => {
    if (played.current) return;
    const ready = afterHandoff ? behindCurtain.current && handedOff : inView;
    if (!ready) return;
    played.current = true;
    void api.start((i) => ({ to: COPY_IN, delay: delay + i * stagger }));
  }, [afterHandoff, handedOff, inView, api, delay, stagger]);

  return createElement(
    tag,
    { ref: setNode, id, className, "data-rise": "" },
    words.map((word, i) => (
      <span key={i}>
        <span className="inline-block [clip-path:inset(-0.3em_-0.25em_-0.25em_-0.25em)]">
          <animated.span className="inline-block will-change-transform" style={springs[i]}>
            {word.em ? <em className="font-normal italic">{word.text}</em> : word.text}
          </animated.span>
        </span>
        {i < words.length - 1 ? " " : null}
      </span>
    )),
  );
}
