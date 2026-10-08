"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useState } from "react";
import { EASE_INOUT, EASE_OUT, INTRO_DELAY } from "../lib/motion";

export const GATES = [
  { id: "awakening", gate: "00", label: "Awakening", color: "#58a6ff" },
  { id: "inkmity", gate: "01", label: "Inkmity", rank: "S-Rank", color: "#ff4d64" },
  { id: "works", gate: "02", label: "Cleared gates", color: "#3ddc97" },
  { id: "record", gate: "03", label: "Quest log", color: "#f5b942" },
  { id: "self", gate: "04", label: "Titles", color: "#a06bff" },
  { id: "contact", gate: "05", label: "Message", color: "#38d6f5" },
] as const;

function Mark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <path d="M16 2 L30 16 L16 30 L2 16 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 9 L23 16 L16 23 L9 16 Z" fill="currentColor" opacity="0.9" />
    </svg>
  );
}

/**
 * Navigation as leveling. Top bar: the mark, the name and a live level
 * readout fed by scroll progress. Desktop: a right-side rail of gates with an
 * XP bar that fills as you descend. Below lg: a System button opening the
 * gate list as a full-screen window.
 */
export default function Rail() {
  const [active, setActive] = useState<string>("awakening");
  const [open, setOpen] = useState(false);
  const [level, setLevel] = useState(1);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const pct = useTransform(progress, (v) => `${Math.round(v * 100)}`);

  useMotionValueEvent(scrollYProgress, "change", (v) => setLevel(1 + Math.min(5, Math.floor(v * 6))));

  useEffect(() => {
    const sections = GATES.map((g) => document.getElementById(g.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.2, 0.5, 1] }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const current = GATES.find((g) => g.id === active) ?? GATES[0];

  return (
    <>
      <motion.header
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: INTRO_DELAY, duration: 1.1, ease: EASE_OUT }}
        className="pointer-events-none fixed inset-x-0 top-0 z-50"
      >
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-void via-void/85 to-transparent" />
        <div className="frame relative flex items-center justify-between py-4">
          <a
            href="#awakening"
            className="pointer-events-auto flex min-h-10 items-center gap-3 text-ice"
            aria-label="Jason Zhang, back to the awakening"
          >
            <Mark className="h-7 w-7 text-sys" />
            <span className="font-display text-lg uppercase tracking-wide">Jason Zhang</span>
          </a>

          <div className="pointer-events-auto flex items-center gap-3">
            <span className="hud hidden items-center gap-3 border border-line bg-void/60 px-3 py-2 text-mute sm:flex">
              <span key={level} className="text-sys motion-safe:animate-level-flash">
                LV {level}
              </span>
              <span aria-hidden="true" className="h-3 w-px bg-line" />
              <span>
                XP <motion.span className="text-ice">{pct}</motion.span>%
              </span>
            </span>
            <button
              type="button"
              aria-expanded={open}
              aria-controls="system-menu"
              onClick={() => setOpen(true)}
              className="flex min-h-10 items-center gap-3 border border-sys/50 bg-sys/10 px-3 hud text-sys transition-colors hover:bg-sys hover:text-void lg:hidden"
            >
              <span className="font-display text-base normal-case tracking-normal">{current.gate}</span>
              System
            </button>
          </div>
        </div>
      </motion.header>

      {/* Desktop rail */}
      <motion.nav
        aria-label="Gates"
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: INTRO_DELAY + 0.3, duration: 1.1, ease: EASE_OUT }}
        className="fixed right-7 top-1/2 z-50 hidden -translate-y-1/2 lg:block"
      >
        <div className="relative">
          <span aria-hidden="true" className="absolute right-[5px] top-3 bottom-3 w-px bg-line" />
          <motion.span
            aria-hidden="true"
            style={{ scaleY: progress }}
            className="absolute right-[5px] top-3 bottom-3 w-px origin-top bg-sys shadow-glow-strong"
          />
          <ul className="flex flex-col gap-2">
            {GATES.map((g) => {
              const isActive = g.id === active;
              return (
                <li key={g.id}>
                  <a
                    href={`#${g.id}`}
                    aria-current={isActive ? "location" : undefined}
                    className="group relative flex min-h-9 items-center justify-end gap-3 pr-7"
                  >
                    <span
                      className={`hud opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 ${
                        isActive ? "text-ice" : "text-mute"
                      }`}
                    >
                      {g.label}
                    </span>
                    <span
                      className={`font-display text-base tracking-wide transition-colors ${
                        isActive ? "" : "text-mute group-hover:text-ice"
                      }`}
                      style={isActive ? { color: g.color, textShadow: `0 0 14px ${g.color}` } : undefined}
                    >
                      {g.gate}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`absolute right-0 h-[11px] w-[11px] rotate-45 border transition-all duration-300 ${
                        isActive ? "" : "border-line bg-void"
                      }`}
                      style={isActive ? { borderColor: g.color, background: g.color, boxShadow: `0 0 16px ${g.color}` } : undefined}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </motion.nav>

      {/* System menu (below lg) */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="system-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Gates"
            initial={{ clipPath: "inset(50% 0 50% 0)" }}
            animate={{ clipPath: "inset(0% 0 0% 0)", transition: { duration: 0.75, ease: EASE_INOUT } }}
            exit={{ clipPath: "inset(50% 0 50% 0)", transition: { duration: 0.55, ease: EASE_INOUT } }}
            className="fixed inset-0 z-[60] bg-void text-ice"
          >
            <div aria-hidden="true" className="scanlines pointer-events-none absolute inset-0" />
            <div className="frame relative flex h-full flex-col py-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-3">
                  <Mark className="h-7 w-7 text-sys" />
                  <span className="font-display text-lg uppercase tracking-wide">Jason Zhang</span>
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex min-h-10 items-center border border-line px-3 hud text-mute transition-colors hover:border-line-strong hover:text-ice"
                >
                  Close
                </button>
              </div>
              <p className="hud mt-10 text-sys">[Gates]</p>
              <ul className="mt-4 flex flex-1 flex-col justify-start gap-1">
                {GATES.map((g, i) => (
                  <motion.li
                    key={g.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0, transition: { delay: 0.35 + i * 0.09, duration: 0.8, ease: EASE_OUT } }}
                  >
                    <a
                      href={`#${g.id}`}
                      onClick={() => setOpen(false)}
                      className="flex items-baseline gap-5 border-b border-line py-4"
                    >
                      <span className="w-10 font-display text-xl" style={{ color: g.color }}>{g.gate}</span>
                      <span className={`font-display text-display-md uppercase ${g.id === active ? "text-ice" : "text-ice-2"}`}>
                        {g.label}
                      </span>
                      <span className="hud ml-auto text-mute">{g.id === active ? "Here" : "Open"}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
              <p className="hud text-mute">LV {level} · Software Engineer · Builder · Founder</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
