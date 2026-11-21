"use client";

import { animated, useSpring } from "@react-spring/web";
import { useEffect, useLayoutEffect, useState } from "react";

import { useHandoff } from "@/ledger/hooks/use-handoff";
import { useDynamicInView } from "@/ledger/hooks/animation/use-dynamic-in-view";

/** Northwall's one timing for every figure that ticks up. */
const COUNT_CONFIG = { tension: 90, friction: 34 };

/** "3,750" → { prefix: "", target: 3750, suffix: "", grouped: true }. */
export const parseFigure = (value: string) => {
  const match = value.match(/\d[\d,]*(?:\.\d+)?/);
  if (!match) return null;
  const raw = match[0];
  return {
    prefix: value.slice(0, match.index),
    suffix: value.slice((match.index ?? 0) + raw.length),
    target: Number(raw.replace(/,/g, "")),
    decimals: raw.includes(".") ? raw.split(".")[1].length : 0,
    grouped: raw.includes(","),
  };
};

const format = (n: number, decimals: number, grouped: boolean) =>
  grouped ? n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : n.toFixed(decimals);

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * A figure that ticks up from zero once, the first time it is seen. The served
 * HTML carries the final value (crawlers, no-JS, reduced motion); the visible
 * digits are hidden from assistive tech and a text copy carries the value.
 */
export function CountUp({ value, delay = 0, afterHandoff = false }: { value: string; delay?: number; afterHandoff?: boolean }) {
  const figure = parseFigure(value);
  const [setNode, inView] = useDynamicInView({ threshold: 0.3 });
  const [armed, setArmed] = useState(false);
  const [play, setPlay] = useState(false);
  const handedOff = useHandoff();

  // Drop to zero before first paint, unless motion is reduced.
  useIsoLayoutEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) setArmed(true);
  }, []);

  // Latch on first sight (state set during render, not in an effect).
  if (!play && inView && armed && (!afterHandoff || handedOff)) setPlay(true);

  const target = figure?.target ?? 0;
  const { n } = useSpring({
    n: !armed || play ? target : 0,
    immediate: !play,
    delay: play ? delay : 0,
    config: COUNT_CONFIG,
  });

  if (!figure) return <span>{value}</span>;

  return (
    <span ref={setNode} className="tabular-nums">
      <span className="sr-only">{value}</span>
      <span aria-hidden="true">
        {figure.prefix}
        <animated.span>{n.to((v) => format(play ? v : !armed ? target : 0, figure.decimals, figure.grouped))}</animated.span>
        {figure.suffix}
      </span>
    </span>
  );
}
