"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { EASE_OUT, INTRO_DELAY } from "../lib/motion";
import { GATES } from "../lib/gates";
import { getGate, useGate, useGateTracker } from "../lib/level";

type Toast = { id: string; gate: string; label: string; chapter: string; rank?: string; color: string; level?: number };

const TTL = 4600;
/** Announce once the scroll has been quiet this long, so a jump reports only where it landed. */
const SETTLE = 220;

/**
 * One System notification per gate, the first time you land in it: the gate,
 * its chapter, and LEVEL UP when it is deeper than you have been. Never more
 * than two on screen. Polite for screen readers, dismissible, quiet under
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
  const timers = useRef(new Map<string, number>());

  const dismiss = (id: string) => setToasts((all) => all.filter((x) => x.id !== id));

  const push = (t: Toast) => {
    setToasts((all) => [...all.filter((x) => x.id !== t.id), t].slice(-2));
    const prev = timers.current.get(t.id);
    if (prev) window.clearTimeout(prev);
    timers.current.set(t.id, window.setTimeout(() => dismiss(t.id), TTL));
  };

  const announce = () => {
    settle.current = 0;
    if (!pending.current) return;
    pending.current = false;
    const { current: idx, depth } = getGate();
    const fresh = !seen.current.has(idx);
    for (let i = 0; i <= idx; i++) seen.current.add(i);
    const deeper = depth > lastDepth.current;
    lastDepth.current = Math.max(lastDepth.current, depth);
    if (!started.current || !fresh || idx === 0) return;
    const g = GATES[idx];
    push({
      id: g.id,
      gate: g.gate,
      label: g.label,
      chapter: g.chapter,
      rank: "rank" in g ? g.rank : undefined,
      color: g.color,
      level: deeper ? depth + 1 : undefined,
    });
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
      all.forEach((t) => window.clearTimeout(t));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[70] flex flex-col items-stretch gap-2 sm:inset-x-auto sm:bottom-auto sm:right-6 sm:top-20 sm:w-80"
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.button
            key={t.id}
            type="button"
            onClick={() => dismiss(t.id)}
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: 24 }}
            animate={reduce ? { opacity: 1 } : { opacity: [0, 1, 0.5, 1], x: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.6 } }}
            transition={{ duration: 0.9, ease: EASE_OUT }}
            className="chamfer pointer-events-auto relative border bg-void/95 px-4 py-3 text-left"
            style={{ borderColor: `${t.color}88`, boxShadow: `0 0 26px ${t.color}26` }}
          >
            <span className="hud flex items-center justify-between gap-3" style={{ color: t.color }}>
              <span>[System]</span>
              {t.rank && <span className="font-bold">{t.rank}</span>}
            </span>
            <span className="mt-1 block display text-lg tracking-wide text-ice">
              Gate {t.gate} · {t.label}
            </span>
            <span className="block text-sm text-ice-2">{t.chapter}</span>
            {t.level && (
              <span className="mt-2 block border-t border-line pt-2 font-display text-sm font-bold uppercase tracking-label text-shadow-bright">
                Level up · LV {t.level}
              </span>
            )}
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}
