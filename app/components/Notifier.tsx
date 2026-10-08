"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { EASE_OUT, INTRO_DELAY } from "../lib/motion";
import { getLevel, reachGate } from "../lib/level";
import { GATES } from "./Rail";

type Toast =
  | { id: string; kind: "gate"; gate: string; label: string; rank?: string; color: string }
  | { id: "level"; kind: "level"; level: number };

const GATE_TTL = 4400;
const LEVEL_TTL = 3800;
/** The LEVEL UP window follows the gate window by a beat. */
const LEVEL_LAG = 450;
/** Entries that land together (a jump down the rail) collapse into the deepest. */
const SETTLE = 180;

/**
 * System notifications. Entering a gate for the first time announces it
 * ("You have entered Gate 01") and, since level is depth, a LEVEL UP window
 * follows. Only one LEVEL UP window exists at a time and it always shows the
 * current level; nothing is announced until the entrance has cleared. Polite
 * for screen readers, dismissible, quiet under reduced motion.
 */
export default function Notifier() {
  const reduce = useReducedMotion();
  const [toasts, setToasts] = useState<Toast[]>([]);
  const seen = useRef(new Set<string>(["awakening"]));
  const started = useRef(false);
  const timers = useRef(new Map<string, number>());

  const dismiss = (id: string) => setToasts((all) => all.filter((x) => x.id !== id));

  // Never more than two windows; re-pushing an id restarts its clock.
  const push = (t: Toast, ttl: number) => {
    setToasts((all) => [...all.filter((x) => x.id !== t.id), t].slice(-2));
    const prev = timers.current.get(t.id);
    if (prev) window.clearTimeout(prev);
    timers.current.set(t.id, window.setTimeout(() => dismiss(t.id), ttl));
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      started.current = true;
    }, (INTRO_DELAY + 0.8) * 1000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const targets = GATES.filter((g) => g.id !== "awakening")
      .map((g) => document.getElementById(g.id))
      .filter((el): el is HTMLElement => el !== null);

    let pending: number[] = [];
    let settle = 0;
    let lag = 0;

    const announce = () => {
      settle = 0;
      if (!pending.length) return;
      const before = getLevel();
      const deepest = Math.max(...pending);
      pending = [];
      reachGate(deepest);
      if (!started.current) return;
      const g = GATES[deepest];
      push(
        { id: g.id, kind: "gate", gate: g.gate, label: g.label, rank: "rank" in g ? g.rank : undefined, color: g.color },
        GATE_TTL
      );
      const after = getLevel();
      if (after > before) {
        window.clearTimeout(lag);
        lag = window.setTimeout(() => push({ id: "level", kind: "level", level: after }, LEVEL_TTL), LEVEL_LAG);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const id = e.target.id;
          if (seen.current.has(id)) continue;
          seen.current.add(id);
          const index = GATES.findIndex((x) => x.id === id);
          if (index > 0) pending.push(index);
        }
        if (pending.length && !settle) settle = window.setTimeout(announce, SETTLE);
      },
      { rootMargin: "0px 0px -45% 0px", threshold: 0.05 }
    );
    targets.forEach((t) => observer.observe(t));

    const all = timers.current;
    return () => {
      observer.disconnect();
      window.clearTimeout(settle);
      window.clearTimeout(lag);
      all.forEach((t) => window.clearTimeout(t));
    };
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
