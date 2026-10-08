"use client";

import { useSyncExternalStore } from "react";

/**
 * The player's level: one source of truth for the header, the hero window
 * and the notifications. Level is depth, 1 + the deepest gate entered this
 * visit, so it climbs exactly when you enter a new gate and never falls
 * back, whatever the browser chrome does to the viewport while scrolling.
 */
export const MAX_LEVEL = 6;

let depth = 0;
const listeners = new Set<() => void>();

const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};
const snapshot = () => 1 + depth;
const serverSnapshot = () => 1;

/** Record that the gate at this index (0 = awakening) has been entered. */
export function reachGate(index: number) {
  const next = Math.max(0, Math.min(MAX_LEVEL - 1, Math.floor(index)));
  if (next <= depth) return;
  depth = next;
  listeners.forEach((fn) => fn());
}

export function getLevel() {
  return 1 + depth;
}

export function useLevel() {
  return useSyncExternalStore(subscribe, snapshot, serverSnapshot);
}
