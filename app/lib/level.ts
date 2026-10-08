"use client";

import { useEffect, useSyncExternalStore } from "react";
import { GATES } from "./gates";

/**
 * One source of truth for where the player is. A single probe line, 40% down
 * the viewport, decides the current gate: the last section whose top has
 * crossed it. The header numeral, the level readout (gate + 1) and the
 * notifications all read this same number, so they can never disagree,
 * whatever the browser chrome does to the viewport on a phone. `depth` is the
 * deepest gate reached this visit, which is what LEVEL UP is measured against.
 */
const PROBE = 0.4;
export const MAX_LEVEL = GATES.length;

type State = { current: number; depth: number };
let state: State = { current: 0, depth: 0 };
const SERVER: State = { current: 0, depth: 0 };
const listeners = new Set<() => void>();

const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};
const snapshot = () => state;
const serverSnapshot = () => SERVER;

function measure() {
  const line = window.innerHeight * PROBE;
  let current = 0;
  GATES.forEach((g, i) => {
    const el = document.getElementById(g.id);
    if (el && el.getBoundingClientRect().top <= line) current = i;
  });
  if (current === state.current) return;
  state = { current, depth: Math.max(state.depth, current) };
  listeners.forEach((fn) => fn());
}

let trackers = 0;
let raf = 0;
let ro: ResizeObserver | null = null;
const schedule = () => {
  if (raf) return;
  raf = requestAnimationFrame(() => {
    raf = 0;
    measure();
  });
};

/** Mount in any consumer; the first starts tracking, the last stops. */
export function useGateTracker() {
  useEffect(() => {
    trackers += 1;
    if (trackers === 1) {
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule);
      // Layout can shift sections without a scroll (a floor opening, fonts landing).
      ro = new ResizeObserver(schedule);
      ro.observe(document.body);
      schedule();
    }
    return () => {
      trackers -= 1;
      if (trackers === 0) {
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", schedule);
        ro?.disconnect();
        ro = null;
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };
  }, []);
}

export function useGate() {
  return useSyncExternalStore(subscribe, snapshot, serverSnapshot);
}

/** Level is the gate you are in, plus one. */
export function useLevel() {
  return useGate().current + 1;
}

export function getGate() {
  return state;
}
