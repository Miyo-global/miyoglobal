"use client";

import { useSpringValue } from "@react-spring/web";
import { useEffect } from "react";

import { useDynamicInView } from "@/ledger/hooks/animation/use-dynamic-in-view";

import { RouteChart } from "./route-chart";

const DRAW = { tension: 40, friction: 26, clamp: true };

/** The passage chart in-page: the route draws once on view, then rests. */
export function PresenceChart() {
  const [setNode, inView] = useDynamicInView({ threshold: 0.35 });
  const p = useSpringValue(0, { config: DRAW });

  useEffect(() => {
    if (inView) void p.start(1);
  }, [inView, p]);

  return (
    <div ref={setNode} className="relative aspect-[5/3] w-full border border-dashed border-rule-dark">
      <RouteChart progress={p} cities className="absolute inset-0 size-full" />
    </div>
  );
}
