"use client";

import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useState, type CSSProperties } from "react";
import { EASE_INOUT, EASE_OUT, INTRO_DELAY } from "../lib/motion";
import { useLevel } from "../lib/level";

export const GATES = [
  { id: "awakening", gate: "00", label: "Awakening", color: "#58a6ff", rgb: "88, 166, 255" },
  { id: "inkmity", gate: "01", label: "Inkmity", rank: "S-Rank", color: "#ff4d64", rgb: "255, 77, 100" },
  { id: "works", gate: "02", label: "Cleared gates", color: "#3ddc97", rgb: "61, 220, 151" },
  { id: "record", gate: "03", label: "Quest log", color: "#f5b942", rgb: "245, 185, 66" },
  { id: "self", gate: "04", label: "Titles", color: "#a06bff", rgb: "160, 107, 255" },
  { id: "contact", gate: "05", label: "Message", color: "#38d6f5", rgb: "56, 214, 245" },
] as const;

/** The tab icon, recolored to the gate you are in. Same mark as /icon.svg. */
const favicon = (color: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="#06070b"/><path d="M16 3 L29 16 L16 29 L3 16 Z" fill="none" stroke="${color}" stroke-width="1.5"/><path d="M16 9.5 L22.5 16 L16 22.5 L9.5 16 Z" fill="${color}"/></svg>`
  )}`;

function Mark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <path d="M16 2 L30 16 L16 30 L2 16 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 9 L23 16 L16 23 L9 16 Z" fill="currentColor" opacity="0.9" />
    </svg>
  );
}

/**
 * Navigation as leveling. Top bar: the mark, the name and the level, all in
 * the color of the gate you are currently in, plus XP fed by scroll progress.
 * Desktop: a right-side rail of gates with an XP bar that fills as you
 * descend. Below lg: a System button opening the gate list as a full-screen
 * window. Level itself comes from the shared store (depth reached).
 */
export default function Rail() {
  const [active, setActive] = useState<string>("awakening");
  const [open, setOpen] = useState(false);
  const level = useLevel();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const pct = useTransform(progress, (v) => `${Math.round(Math.min(1, Math.max(0, v)) * 100)}`);

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
  // The header and rail take the current gate's color through the same
  // --gate variables the sections use.
  const vars = { "--gate": current.color, "--gate-rgb": current.rgb } as CSSProperties;

  useEffect(() => {
    document
      .querySelectorAll<HTMLLinkElement>('link[rel="icon"], link[rel="shortcut icon"]')
      .forEach((l) => {
        l.href = favicon(current.color);
      });
  }, [current.color]);

  return (
    <>
      <motion.header
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: INTRO_DELAY, duration: 1.1, ease: EASE_OUT }}
        className="pointer-events-none fixed inset-x-0 top-0 z-50"
      >
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-void via-void/85 to-transparent" />
        <div data-gate={current.gate} style={vars} className="frame relative flex items-center justify-between py-4">
          <a
            href="#awakening"
            className="pointer-events-auto flex min-h-10 items-center gap-3 text-ice"
            aria-label="Jason Zhang, back to the awakening"
          >
            <Mark className="h-7 w-7 text-[var(--gate)] drop-shadow-[0_0_6px_rgba(var(--gate-rgb),0.55)] transition-colors duration-700" />
            <span className="hidden font-display text-lg uppercase tracking-wide min-[380px]:inline">Jason Zhang</span>
          </a>

          <div className="pointer-events-auto flex items-center gap-3">
            <span className="hud flex items-center gap-3 border border-[rgba(var(--gate-rgb),0.45)] bg-void/60 px-3 py-2 text-mute transition-colors duration-700">
              <span
                key={level}
                className="glow-gate text-[var(--gate)] transition-colors duration-700 motion-safe:animate-level-flash"
              >
                LV {level}
              </span>
              <span className="hidden items-center gap-3 sm:flex">
                <span aria-hidden="true" className="h-3 w-px bg-[rgba(var(--gate-rgb),0.45)] transition-colors duration-700" />
                <span>
                  XP <motion.span className="text-ice">{pct}</motion.span>%
                </span>
              </span>
            </span>
            <button
              type="button"
              aria-expanded={open}
              aria-controls="system-menu"
              onClick={() => setOpen(true)}
              className="flex min-h-10 items-center gap-3 border border-[rgba(var(--gate-rgb),0.55)] bg-[rgba(var(--gate-rgb),0.1)] px-3 hud text-[var(--gate)] transition-colors duration-500 hover:bg-[var(--gate)] hover:text-void lg:hidden"
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
        <div data-gate={current.gate} style={vars} className="relative">
          <span aria-hidden="true" className="absolute right-[5px] top-3 bottom-3 w-px bg-line" />
          <motion.span
            aria-hidden="true"
            style={{ scaleY: progress }}
            className="absolute right-[5px] top-3 bottom-3 w-px origin-top bg-[var(--gate)] shadow-[0_0_16px_var(--gate)] transition-colors duration-700"
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
            <div style={vars} className="frame relative flex h-full flex-col py-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-3">
                  <Mark className="h-7 w-7 text-[var(--gate)]" />
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
              <p className="hud mt-10 text-[var(--gate)]">[Gates]</p>
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
              <p className="hud text-mute">
                <span className="text-[var(--gate)]">LV {level}</span> · Software Engineer · Builder · Founder
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
