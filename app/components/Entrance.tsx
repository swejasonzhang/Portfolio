"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import InkCurrent from "./InkCurrent";
import Seal from "./Seal";
import { siteConfig } from "../site";
import { EASE_OUT, INTRO_DELAY, lift, reveal, stagger } from "../lib/motion";

/** One letter of the name that leans toward the pointer. */
function Letter({
  char,
  pointer,
  active,
}: {
  char: string;
  pointer: React.MutableRefObject<{ x: number; y: number } | null>;
  active: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 120, damping: 18, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 120, damping: 18, mass: 0.6 });

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const tick = () => {
      const el = ref.current;
      const p = pointer.current;
      if (el && p) {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = p.x - cx;
        const dy = p.y - cy;
        const d = Math.hypot(dx, dy);
        const R = 320;
        if (d < R) {
          const f = 1 - d / R;
          x.set((dx / (d || 1)) * f * 18);
          y.set((dy / (d || 1)) * f * 12);
        } else {
          x.set(0);
          y.set(0);
        }
      } else {
        x.set(0);
        y.set(0);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, pointer, x, y]);

  return (
    <motion.span
      ref={ref}
      className="inline-block"
      style={active ? { x: sx, y: sy } : undefined}
    >
      {char}
    </motion.span>
  );
}

function Word({
  word,
  pointer,
  active,
  className = "",
}: {
  word: string;
  pointer: React.MutableRefObject<{ x: number; y: number } | null>;
  active: boolean;
  className?: string;
}) {
  return (
    <span className={`block overflow-hidden pb-[0.08em] -mb-[0.08em] ${className}`}>
      <motion.span variants={lift} className="block">
        {word.split("").map((c, i) => (
          <Letter key={i} char={c} pointer={pointer} active={active} />
        ))}
      </motion.span>
    </span>
  );
}

/**
 * Gate I. Entering a world: the name set as editorial type over a live ink
 * current, the identity line, one true paragraph, and a scroll cue. The
 * letters lean toward the pointer; the current parts around it.
 */
export default function Entrance() {
  const reduce = useReducedMotion();
  const [fine, setFine] = useState(false);
  const pointer = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const on = () => setFine(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const active = fine && !reduce;

  return (
    <section
      id="entrance"
      aria-labelledby="entrance-title"
      className="relative isolate min-h-[100svh] overflow-hidden"
      onPointerMove={(e) => {
        if (!active || e.pointerType !== "mouse") return;
        pointer.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerLeave={() => {
        pointer.current = null;
      }}
    >
      <InkCurrent />
      <div aria-hidden="true" className="grain pointer-events-none absolute inset-0 -z-10 opacity-[0.05]" />

      {/* Woodblock margin label */}
      <span
        aria-hidden="true"
        className="vertical absolute left-6 top-1/2 hidden -translate-y-1/2 font-mono text-2xs uppercase tracking-kicker text-ash lg:block"
      >
        I — Entrance · New York
      </span>

      <div className="frame flex min-h-[100svh] flex-col justify-between pb-10 pt-28 md:pt-32">
        <motion.div
          variants={stagger(0.1, INTRO_DELAY)}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-between font-mono text-2xs uppercase tracking-label text-ash"
        >
          <motion.span variants={reveal} className="hidden sm:inline">
            Chapter I
          </motion.span>
          <motion.span variants={reveal} className="ml-auto flex items-center gap-2">
            <span aria-hidden="true" className="h-[7px] w-[7px] rotate-45 bg-shu" />
            Open to internships &amp; co-ops
          </motion.span>
        </motion.div>

        <motion.div
          variants={stagger(0.12, INTRO_DELAY + 0.15)}
          initial="hidden"
          animate="visible"
          className="py-10 md:py-14"
        >
          <h1
            id="entrance-title"
            className="font-serif text-display-name uppercase text-washi"
          >
            <Word word="Jason" pointer={pointer} active={active} />
            <Word word="Zhang" pointer={pointer} active={active} className="italic md:pl-[0.18em]" />
          </h1>

          <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-12 md:gap-10">
            <motion.p
              variants={reveal}
              className="font-mono text-2xs uppercase tracking-kicker text-washi md:col-span-5 md:text-xs"
            >
              Software Engineer <span className="text-shu">/</span> Builder{" "}
              <span className="text-shu">/</span> Founder
            </motion.p>
            <motion.p
              variants={reveal}
              className="max-w-[40ch] text-pretty text-base leading-relaxed text-ash md:col-span-6 md:col-start-7 md:text-lg"
            >
              Computer Science at Queens College (CUNY), expected May 2029. Founder of{" "}
              <a
                href="#inkmity"
                className="link-rule text-washi"
              >
                Inkmity
              </a>
              , a live booking platform for tattoo artists with Stripe payments. I build the
              structure and the surface, and I care about both.
            </motion.p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: INTRO_DELAY + 1, duration: 0.8, ease: EASE_OUT }}
          className="flex items-end justify-between"
        >
          <a
            href="#inkmity"
            className="group flex items-center gap-4 font-mono text-2xs uppercase tracking-label text-ash transition-colors hover:text-washi"
          >
            <span aria-hidden="true" className="relative block h-12 w-px overflow-hidden bg-line">
              <span className="absolute inset-x-0 top-0 h-4 bg-washi motion-safe:animate-drift" />
            </span>
            Enter
          </a>
          <div className="flex items-center gap-4 font-mono text-2xs uppercase tracking-label text-ash">
            <span className="hidden sm:inline">{siteConfig.location}</span>
            <Seal className="h-9 w-9" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
