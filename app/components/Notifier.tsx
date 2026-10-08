"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { EASE_OUT, INTRO_DELAY } from "../lib/motion";
import { GATES } from "./Rail";

type Toast =
  | { id: string; kind: "gate"; gate: string; label: string; rank?: string; color: string }
  | { id: string; kind: "level"; level: number };

/**
 * System notifications. The first time a gate enters view it is announced
 * ("You have entered Gate 01"), and each time the level readout climbs a
 * LEVEL UP window flashes in. Once per event per visit, polite for screen
 * readers, dismissible, quiet under reduced motion.
 */
export default function Notifier() {
  const reduce = useReducedMotion();
  const [toasts, setToasts] = useState<Toast[]>([]);
  const seen = useRef(new Set<string>(["awakening"]));
  const levelRef = useRef(1);
  const started = useRef(false);
  const { scrollYProgress } = useScroll();

  // Never stack more than two windows; the oldest yields.
  const push = (t: Toast, ttl: number) => {
    setToasts((all) => [...all.filter((x) => x.id !== t.id), t].slice(-2));
    window.setTimeout(() => setToasts((all) => all.filter((x) => x.id !== t.id)), ttl);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      started.current = true;
    }, (INTRO_DELAY + 0.8) * 1000);
    return () => window.clearTimeout(timer);
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const lv = 1 + Math.min(5, Math.floor(v * 6));
    if (lv > levelRef.current) {
      levelRef.current = lv;
      if (started.current) push({ id: `lv-${lv}`, kind: "level", level: lv }, 3800);
    }
  });

  useEffect(() => {
    const targets = GATES.filter((g) => g.id !== "awakening")
      .map((g) => document.getElementById(g.id))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const id = e.target.id;
          if (seen.current.has(id)) continue;
          seen.current.add(id);
          const g = GATES.find((x) => x.id === id);
          if (!g) continue;
          push(
            { id, kind: "gate", gate: g.gate, label: g.label, rank: "rank" in g ? g.rank : undefined, color: g.color },
            4400
          );
        }
      },
      { rootMargin: "0px 0px -45% 0px", threshold: 0.05 }
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-[70] flex flex-col items-stretch gap-2 sm:inset-x-auto sm:right-6 sm:top-20 sm:bottom-auto sm:w-80"
    >
      <AnimatePresence>
        {toasts.map((t) => {
          const level = t.kind === "level";
          return (
            <motion.button
              key={t.id}
              type="button"
              onClick={() => setToasts((all) => all.filter((x) => x.id !== t.id))}
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
