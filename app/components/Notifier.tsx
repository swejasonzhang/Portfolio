"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { EASE_OUT } from "../lib/motion";
import { GATES } from "./Rail";

type Toast = { id: string; gate: string; label: string };

/**
 * System notifications: the first time a chapter enters view it is
 * "unlocked" and a small window announces it. Once per chapter per visit,
 * polite for screen readers, dismissible, and quiet under reduced motion.
 */
export default function Notifier() {
  const reduce = useReducedMotion();
  const [toasts, setToasts] = useState<Toast[]>([]);
  const seen = useRef(new Set<string>(["awakening"]));

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
          const toast = { id, gate: g.gate, label: g.label };
          setToasts((t) => [...t, toast]);
          window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
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
        {toasts.map((t) => (
          <motion.button
            key={t.id}
            type="button"
            onClick={() => setToasts((all) => all.filter((x) => x.id !== t.id))}
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: 24, scale: 0.98 }}
            animate={reduce ? { opacity: 1 } : { opacity: [0, 1, 0.5, 1], x: 0, scale: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
            className="pointer-events-auto relative border border-sys/50 bg-void/90 px-4 py-3 text-left shadow-glow"
          >
            <span aria-hidden="true" className="absolute -left-px -top-px h-2.5 w-2.5 border-l-2 border-t-2 border-sys-bright" />
            <span aria-hidden="true" className="absolute -bottom-px -right-px h-2.5 w-2.5 border-b-2 border-r-2 border-sys-bright" />
            <span className="hud block text-sys">[System]</span>
            <span className="mt-1 block font-display text-base uppercase tracking-wide text-ice">
              Gate {t.gate} unlocked
            </span>
            <span className="hud block text-mute">{t.label}</span>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}
