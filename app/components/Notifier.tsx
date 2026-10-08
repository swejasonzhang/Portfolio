"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { EASE_OUT, INTRO_DELAY } from "../lib/motion";
import { GATES } from "../lib/gates";
import { getGate, useGate, useGateTracker } from "../lib/level";

type Toast =
  | { id: string; kind: "gate"; gate: string; label: string; rank?: string; color: string }
  | { id: "level"; kind: "level"; level: number };

const GATE_TTL = 4400;
const LEVEL_TTL = 3800;
/** The LEVEL UP window follows the gate window by a beat. */
const LEVEL_LAG = 450;
/** Announce once the scroll has been quiet this long, so a jump down the rail reports only where it landed. */
const SETTLE = 180;

/**
 * System notifications, driven by the same gate store as the header. The
 * first time you land in a gate it is announced ("You have entered Gate 01")
 * and, if it is deeper than you have been, a LEVEL UP window follows. Only
 * one LEVEL UP window exists at a time; nothing is announced until the
 * entrance has cleared. Polite for screen readers, dismissible, quiet under
 * reduced motion.
 */
export default function Notifier() {
  const reduce = useReducedMotion();
  const [toasts, setToasts] = useState<Toast[]>([]);
  useGateTracker();
  const { current } = useGate();
  const seen = useRef(new Set<number>([0]));
  const started = useRef(false);
  const pending = useRef(false);
  const lastDepth = useRef(0);
  const settle = useRef(0);
  const lag = useRef(0);
  const timers = useRef(new Map<string, number>());

  const dismiss = (id: string) => setToasts((all) => all.filter((x) => x.id !== id));

  // Never more than two windows; re-pushing an id restarts its clock.
  const push = (t: Toast, ttl: number) => {
    setToasts((all) => [...all.filter((x) => x.id !== t.id), t].slice(-2));
    const prev = timers.current.get(t.id);
    if (prev) window.clearTimeout(prev);
    timers.current.set(t.id, window.setTimeout(() => dismiss(t.id), ttl));
  };

  const announce = () => {
    settle.current = 0;
    if (!pending.current) return;
    pending.current = false;
    const { current: idx, depth } = getGate();
    const fresh = !seen.current.has(idx);
    // Gates passed through on the way count as seen; they are not announced late.
    for (let i = 0; i <= idx; i++) seen.current.add(i);
    if (!started.current) {
      lastDepth.current = depth;
      return;
    }
    if (fresh && idx > 0) {
      const g = GATES[idx];
      push(
        { id: g.id, kind: "gate", gate: g.gate, label: g.label, rank: "rank" in g ? g.rank : undefined, color: g.color },
        GATE_TTL
      );
    }
    if (depth > lastDepth.current) {
      lastDepth.current = depth;
      window.clearTimeout(lag.current);
      lag.current = window.setTimeout(() => push({ id: "level", kind: "level", level: depth + 1 }, LEVEL_TTL), LEVEL_LAG);
    }
  };

  const arm = () => {
    window.clearTimeout(settle.current);
    settle.current = window.setTimeout(announce, SETTLE);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      started.current = true;
    }, (INTRO_DELAY + 0.8) * 1000);
    return () => window.clearTimeout(timer);
  }, []);

  // A change of gate is pending until the scroll goes quiet.
  useEffect(() => {
    if (seen.current.has(current)) return;
    pending.current = true;
    arm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  useEffect(() => {
    const onScroll = () => {
      if (pending.current) arm();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const all = timers.current;
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(settle.current);
      window.clearTimeout(lag.current);
      all.forEach((t) => window.clearTimeout(t));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[70] flex flex-col items-stretch gap-2 sm:inset-x-auto sm:right-6 sm:top-20 sm:bottom-auto sm:w-80"
    >
      <AnimatePresence>
        {toasts.map((t) => {
          const level = t.kind === "level";
          return (
            <motion.button
              key={t.id}
              type="button"
              onClick={() => dismiss(t.id)}
              initial={reduce ? { opacity: 0 } : { opacity: 0, x: 24, scale: 0.97 }}
              animate={reduce ? { opacity: 1 } : { opacity: [0, 1, 0.5, 1], x: 0, scale: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.6 } }}
              transition={{ duration: 0.9, ease: EASE_OUT }}
              className={`pointer-events-auto relative border bg-void/90 px-4 py-3 text-left ${
                level ? "border-shadow/70 shadow-glow-violet" : ""
              }`}
              style={
                t.kind === "gate"
                  ? { borderColor: `${t.color}99`, boxShadow: `0 0 24px ${t.color}33` }
                  : undefined
              }
            >
              <span aria-hidden="true" className={`absolute -left-px -top-px h-2.5 w-2.5 border-l-2 border-t-2 ${level ? "border-shadow-bright" : ""}`} style={t.kind === "gate" ? { borderColor: t.color } : undefined} />
              <span aria-hidden="true" className={`absolute -bottom-px -right-px h-2.5 w-2.5 border-b-2 border-r-2 ${level ? "border-shadow-bright" : ""}`} style={t.kind === "gate" ? { borderColor: t.color } : undefined} />
              <span className={`hud block ${level ? "text-shadow-bright" : ""}`} style={t.kind === "gate" ? { color: t.color } : undefined}>[System]</span>
              {t.kind === "level" ? (
                <>
                  <span className="glow-text-violet mt-1 block font-display text-2xl font-bold uppercase tracking-wide text-ice">
                    Level up!
                  </span>
                  <span className="hud block text-mute">You are now LV {t.level}</span>
                </>
              ) : (
                <>
                  <span className="mt-1 block font-display text-base uppercase tracking-wide text-ice">
                    You have entered Gate {t.gate}
                  </span>
                  <span className="hud block text-mute">
                    {t.rank ? `${t.rank} · ` : ""}
                    {t.label}
                  </span>
                </>
              )}
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
