"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";
import { useEffect, useState } from "react";
import Seal from "./Seal";
import { EASE_INOUT, EASE_OUT, INTRO_DELAY } from "../lib/motion";

export const GATES = [
  { id: "entrance", numeral: "I", label: "Entrance" },
  { id: "inkmity", numeral: "II", label: "Inkmity" },
  { id: "works", numeral: "III", label: "Works" },
  { id: "record", numeral: "IV", label: "Record" },
  { id: "self", numeral: "V", label: "Self" },
  { id: "contact", numeral: "VI", label: "Contact" },
] as const;

/**
 * Navigation as progression. Desktop: a vertical rail of chapter numerals on
 * the right with a vermilion fill that climbs as you descend. Everywhere: the
 * seal and name top-left. Below lg: a "Gates" button opening a full-screen
 * ink overlay listing the chapters.
 */
export default function Rail() {
  const [active, setActive] = useState<string>("entrance");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Is the paper chapter under the fixed header / the rail right now?
  const [paperTop, setPaperTop] = useState(false);
  const [paperMid, setPaperMid] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));

  // Track the chapter in view.
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

  // Watch the paper band so fixed chrome can swap inks over it.
  useEffect(() => {
    const paper = document.getElementById("self");
    if (!paper) return;
    const top = new IntersectionObserver(([e]) => setPaperTop(e.isIntersecting), {
      rootMargin: "0px 0px -92% 0px",
      threshold: 0,
    });
    const mid = new IntersectionObserver(([e]) => setPaperMid(e.isIntersecting), {
      rootMargin: "-38% 0px -38% 0px",
      threshold: 0,
    });
    top.observe(paper);
    mid.observe(paper);
    return () => {
      top.disconnect();
      mid.disconnect();
    };
  }, []);

  // Overlay: lock scroll, close on Escape.
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
      {/* Top bar: seal + name, and the Gates button below lg */}
      <motion.header
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: INTRO_DELAY, duration: 0.6, ease: EASE_OUT }}
        className="pointer-events-none fixed inset-x-0 top-0 z-50"
      >
        <div className="frame flex items-center justify-between py-5">
          <a
            href="#entrance"
            className={`pointer-events-auto flex min-h-10 items-center gap-3 transition-colors duration-300 ${paperTop ? "text-sumi" : "text-washi"}`}
            aria-label="Jason Zhang, back to the entrance"
          >
            <Seal className="h-8 w-8" />
            <span
              className={`font-serif text-lg italic transition-opacity duration-500 ${
                scrolled ? "opacity-0 lg:opacity-100" : "opacity-100"
              }`}
            >
              Jason Zhang
            </span>
          </a>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="gates-menu"
            onClick={() => setOpen(true)}
            className={`pointer-events-auto flex min-h-10 items-center gap-3 border px-3 font-mono text-2xs uppercase tracking-label transition-colors lg:hidden ${
              paperTop
                ? "border-inkline text-ash-2 hover:border-inkline-strong hover:text-sumi"
                : "border-line text-ash hover:border-line-strong hover:text-washi"
            }`}
          >
            <span className={`font-serif text-base normal-case italic tracking-normal ${paperTop ? "text-sumi" : "text-washi"}`}>
              {current.numeral}
            </span>
            Gates
          </button>
        </div>
      </motion.header>

      {/* Desktop rail */}
      <motion.nav
        aria-label="Chapters"
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: INTRO_DELAY + 0.2, duration: 0.6, ease: EASE_OUT }}
        className="fixed right-7 top-1/2 z-50 hidden -translate-y-1/2 lg:block"
      >
        <div className="relative">
          <span aria-hidden="true" className={`absolute right-[3px] top-2 bottom-2 w-px ${paperMid ? "bg-inkline" : "bg-line"}`} />
          <motion.span
            aria-hidden="true"
            style={{ scaleY: progress }}
            className="absolute right-[3px] top-2 bottom-2 w-px origin-top bg-shu"
          />
          <ul className="flex flex-col gap-2">
            {GATES.map((g) => {
              const isActive = g.id === active;
              return (
                <li key={g.id}>
                  <a
                    href={`#${g.id}`}
                    aria-current={isActive ? "location" : undefined}
                    className="group relative flex min-h-9 items-center justify-end gap-3 pr-6"
                  >
                    <span
                      className={`font-mono text-2xs uppercase tracking-label opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 ${
                        isActive ? (paperMid ? "text-sumi" : "text-washi") : paperMid ? "text-ash-2" : "text-ash"
                      }`}
                    >
                      {g.label}
                    </span>
                    <span
                      className={`font-serif text-base italic transition-colors ${
                        isActive
                          ? paperMid ? "text-sumi" : "text-washi"
                          : paperMid ? "text-ash-2 group-hover:text-sumi" : "text-ash group-hover:text-washi"
                      }`}
                    >
                      {g.numeral}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`absolute right-0 h-[7px] w-[7px] rotate-45 bg-shu transition-transform duration-300 ${
                        isActive ? "scale-100" : "scale-0"
                      }`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </motion.nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="gates-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Chapters"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)", transition: { duration: 0.55, ease: EASE_INOUT } }}
            exit={{ clipPath: "inset(100% 0 0 0)", transition: { duration: 0.45, ease: EASE_INOUT } }}
            className="fixed inset-0 z-[60] bg-sumi text-washi"
          >
            <div aria-hidden="true" className="grain pointer-events-none absolute inset-0 opacity-[0.06]" />
            <div className="frame relative flex h-full flex-col py-5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-3">
                  <Seal className="h-8 w-8" />
                  <span className="font-serif text-lg italic">Jason Zhang</span>
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex min-h-10 items-center border border-line px-3 font-mono text-2xs uppercase tracking-label text-ash transition-colors hover:border-line-strong hover:text-washi"
                >
                  Close
                </button>
              </div>
              <ul className="mt-14 flex flex-1 flex-col justify-center gap-1">
                {GATES.map((g, i) => (
                  <motion.li
                    key={g.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0, transition: { delay: 0.25 + i * 0.05, duration: 0.5, ease: EASE_OUT } }}
                  >
                    <a
                      href={`#${g.id}`}
                      onClick={() => setOpen(false)}
                      className="flex items-baseline gap-5 border-b border-line py-4"
                    >
                      <span className="w-10 font-serif text-xl italic text-ash">{g.numeral}</span>
                      <span className={`font-serif text-display-md ${g.id === active ? "text-washi" : "text-washi/80"}`}>
                        {g.label}
                      </span>
                      {g.id === active && (
                        <span aria-hidden="true" className="ml-auto h-[7px] w-[7px] rotate-45 bg-shu" />
                      )}
                    </a>
                  </motion.li>
                ))}
              </ul>
              <p className="font-mono text-2xs uppercase tracking-label text-ash">
                Software Engineer · Builder · Founder — New York
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
