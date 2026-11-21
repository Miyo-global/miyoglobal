"use client";

import { useEffect, useState } from "react";
import { flushSync } from "react-dom";

import { onHandoff } from "@/ledger/lib/preloader-handoff";

/**
 * Hand-off listeners, released one per task.
 *
 * Every first-screen entrance waits for the same signal, and releasing them
 * together mounted the whole hero — headline, tagline, figures, intro, links —
 * in one ~100 ms task on a 4×-throttled phone, the single longest task of the
 * load. Here each one renders in a task of its own (`flushSync` inside its own
 * timer turn — never inside the effect that subscribed), in document order:
 * the headline first, the rest a frame or so behind it — well inside their own
 * entrance delays.
 */
const queue: (() => void)[] = [];
let pumping = false;

const pump = () => {
  const next = queue.shift();
  if (!next) {
    pumping = false;
    return;
  }
  next();
  window.setTimeout(pump, 0);
};

const inTurn = (release: () => void) => {
  queue.push(release);
  if (pumping) return;
  pumping = true;
  window.setTimeout(pump, 0);
};

/**
 * `true` once the opening panel has handed the screen over — immediately on a
 * page that has already had its handoff. Lets an entrance wait for the panel
 * instead of playing out of sight behind it.
 */
export const useHandoff = () => {
  const [ready, setReady] = useState(false);

  useEffect(
    () =>
      onHandoff(() => inTurn(() => flushSync(() => setReady(true)))),
    [],
  );

  return ready;
};
