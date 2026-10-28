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

/**
 * Continuous position through the gates for the scene: gate index plus how
 * far the probe line has travelled through that gate. Most of the camera move
 * happens in the last stretch of a gate, so each crossing reads as a scene
 * change rather than a slow pan.
 */
let progress = 0;
export function getProgress() {
  return progress;
}

function measure() {
  const line = window.innerHeight * PROBE;
  let current = 0;
  const tops: number[] = [];
  GATES.forEach((g, i) => {
    const el = document.getElementById(g.id);
    const top = el ? el.getBoundingClientRect().top : Infinity;
    tops.push(top);
    if (top <= line) current = i;
  });
  const start = tops[current];
  const next = current + 1 < tops.length ? tops[current + 1] : start + window.innerHeight;
  const span = Math.max(1, next - start);
  const frac = Math.min(1, Math.max(0, (line - start) / span));
  // The scene changes over the second half of each gate, eased at both ends.
  const e = frac < 0.45 ? 0 : (frac - 0.45) / 0.55;
  progress = current + e * e * e * (e * (e * 6 - 15) + 10);
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
