"use client";

import { useSyncExternalStore } from "react";
import { FREE_UNLOCKS } from "@/data/fixtures";

const KEY = "miyo-unlocks";
const initial = `2/${FREE_UNLOCKS}`;
const listeners = new Set<() => void>();

const read = () => (typeof localStorage === "undefined" ? initial : localStorage.getItem(KEY) ?? initial);

export function setUnlocks(used: number, cap: number) {
  localStorage.setItem(KEY, `${used}/${cap}`);
  listeners.forEach((l) => l());
}

export function useUnlocks() {
  const raw = useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    read,
    () => initial,
  );
  const [used, cap] = raw.split("/").map(Number);
  return { used, cap };
}
