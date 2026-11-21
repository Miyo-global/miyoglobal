"use client";

import Image from "next/image";
import { animated, useSpring } from "@react-spring/web";
import { useCallback, useEffect, useRef, useState } from "react";

import { SpringTrigger } from "@/ledger/components/animation/springs/spring-trigger";
import { Spring } from "@/ledger/components/common/robot-spring";
import { CornerMarkers } from "@/ledger/components/ui/corner-markers";
import { useWindowWidth } from "@/ledger/hooks/use-window-size";

import type { Img } from "./content";

export interface Step {
  label: string;
  text: string;
  image: Img;
}

const TILT = { tension: 150, friction: 24 };
const STEP = { tension: 220, friction: 30 };
const SWAP = { tension: 320, friction: 34 };
const TURN = { tension: 170, friction: 22 };
const PARALLAX = { tension: 120, friction: 26 };
const LAST_TILT = 12;
const TILT_STEP = 4;
const MAX_TILT = 10;
const MAX_DEPTH = 14;
const DIM_OPACITY = 0.3;
const DIM_BLUR = 5;
const AUTO_STEP_MS = 3800;

/**
 * Northwall's process stage: the step list over a photograph that turns with
 * each step and leans toward the pointer. Inactive steps sit at 30% behind a
 * 5px blur; the lit one is white. Each step is a button, so keyboard users can
 * reach every step and its description. Below 1440 it advances on its own
 * (paused while hovered or focused); reduced motion keeps it still.
 */
export function ProcessStage({ steps }: { steps: readonly Step[] }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const [tilt, api] = useSpring(() => ({ rotateX: 0, rotateY: 0, depthX: 0, depthY: 0, config: TILT }));
  const reduced = useRef(false);
  const inView = useRef(false);
  const width = useWindowWidth();
  const timed = width > 0 && width < 1440;

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const node = stageRef.current;
    if (!node) return;
    const io = new IntersectionObserver(([e]) => (inView.current = e.isIntersecting), { threshold: 0.4 });
    io.observe(node);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!timed || held || reduced.current) return;
    const timer = window.setInterval(() => {
      if (inView.current) setActive((a) => (a + 1) % steps.length);
    }, AUTO_STEP_MS);
    return () => window.clearInterval(timer);
  }, [timed, held, steps.length]);

  const onPointer = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const stage = stageRef.current;
      if (!stage || reduced.current) return;
      const r = stage.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      api.start({ rotateX: -py * MAX_TILT * 2, rotateY: px * MAX_TILT * 2, depthX: px * MAX_DEPTH, depthY: py * MAX_DEPTH });
    },
    [api],
  );

  const turn = useSpring({ rotate: LAST_TILT - (steps.length - 1 - active) * TILT_STEP, config: TURN });

  return (
    <div
      ref={stageRef}
      onPointerMove={onPointer}
      onPointerLeave={() => {
        api.start({ rotateX: 0, rotateY: 0, depthX: 0, depthY: 0 });
        setHeld(false);
      }}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHeld(true)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
      className="relative col-span-12 grid min-h-[34rem] place-items-center md:min-h-[40rem]"
    >
      <SpringTrigger
        tag="div"
        mode="scrub"
        start="top bottom"
        end="bottom top"
        from={{ y: 50 }}
        to={{ y: -50 }}
        config={PARALLAX}
        frameInterval={32}
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2"
      >
        <div style={{ perspective: "900px" }}>
          <animated.div style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY, transformStyle: "preserve-3d" }}>
            <animated.div style={{ rotate: turn.rotate }}>
              <div className="relative border border-dashed border-rule-dark p-1.5">
                <div className="ld-duotone relative h-[16rem] w-[13rem] overflow-hidden md:h-[25rem] md:w-[20rem]">
                  <animated.div className="absolute inset-0" style={{ x: tilt.depthX, y: tilt.depthY, scale: 1.12 }}>
                    {steps.map((s, i) => (
                      <Spring key={s.image.src} tag="div" className="absolute inset-0" from={{ opacity: i === 0 ? 1 : 0, scale: i === 0 ? 1 : 1.06 }} to={{ opacity: i === active ? 1 : 0, scale: i === active ? 1 : 1.06 }} config={SWAP}>
                        <Image src={s.image.src} alt="" fill sizes="(max-width: 767px) 60vw, 24vw" quality={70} className="object-cover" />
                      </Spring>
                    ))}
                  </animated.div>
                </div>
                <CornerMarkers className="bg-on-dark" />
              </div>
            </animated.div>
          </animated.div>
        </div>
      </SpringTrigger>

      <ol className="relative z-10 flex flex-col items-center gap-2 text-center">
        {steps.map((s, i) => (
          <StepRow key={s.label} label={s.label} active={i === active} onActivate={() => setActive(i)} />
        ))}
      </ol>

      <p aria-live="polite" className="relative z-10 mt-10 max-w-[36ch] text-center font-sans text-lead font-light text-on-dark">
        {steps[active]?.text}
      </p>
    </div>
  );
}

function StepRow({ label, active, onActivate }: { label: string; active: boolean; onActivate: () => void }) {
  const style = useSpring({ opacity: active ? 1 : DIM_OPACITY, blur: active ? 0 : DIM_BLUR, config: STEP });
  return (
    <li className={active ? "relative z-20" : "z-0"}>
      <animated.button
        type="button"
        aria-pressed={active}
        onMouseEnter={onActivate}
        onFocus={onActivate}
        onClick={onActivate}
        style={{ opacity: style.opacity, filter: style.blur.to((v) => `blur(${v}px)`) }}
        className="min-h-11 font-display text-[2.25rem] leading-[1.05] font-semibold tracking-[-0.015em] md:text-h2"
      >
        {label}
      </animated.button>
    </li>
  );
}
