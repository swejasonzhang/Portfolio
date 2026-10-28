"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import CountUp from "./CountUp";
import Magnetic from "./Magnetic";
import SystemWindow from "./SystemWindow";
import TypeOut from "./TypeOut";
import { EASE_OUT, reveal, rise, stagger, VIEWPORT } from "../lib/motion";
import { useLevel } from "../lib/level";
import { siteConfig } from "../site";

/** The opening plays as the page arrives: a beat of stillness, then the name. */
const OPEN = 0.35;

const STATUS: { k: string; v: string; accent?: boolean }[] = [
  { k: "Name", v: "Jason Zhang" },
  { k: "Class", v: "Software Engineer · Founder" },
  { k: "Title", v: "Founder, Inkmity", accent: true },
  { k: "Location", v: "New York, NY" },
  { k: "Status", v: "Available now · internships & co-ops", accent: true },
  { k: "Quest", v: "B.S. Computer Science · Queens College (CUNY) · June 2028" },
];

const RECORDS: { n: number; suffix?: string; unit: string; where: string }[] = [
  { n: 530, suffix: "+", unit: "commits", where: "Inkmity's first version, written by hand" },
  { n: 50, suffix: "+", unit: "pull requests", where: "Software Engineer Intern at Series" },
  { n: 108, unit: "commits", where: "19 Python scripts at Move Tact, sole author" },
  { n: 44, unit: "merged PRs", where: "Arc, in 48 hours at Hackknight 2026" },
  { n: 167, unit: "commits", where: "Amazeon, my solo App Academy capstone" },
];

const NEW_TAB = <span className="sr-only"> (opens in a new tab)</span>;

/**
 * Gate 00. The awakening: the name and what I do, a System notification
 * surfacing beside the figure in the scene, and three ways in. Below the
 * fold, the player status types itself in and the record of real numbers.
 */
export default function Hero() {
  const level = useLevel();
  const reduce = useReducedMotion();
  const statusRef = useRef<HTMLDivElement>(null);
  const seen = useInView(statusRef, { once: true, amount: 0.4 });
  const [step, setStep] = useState(0);

  return (
    <section id="home" aria-labelledby="home-title" data-cursor="pulse" className="gate-blue relative isolate">
      {/* The opening; soft dark fields keep the words readable over the scene */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[100svh] bg-gradient-to-t from-void/85 via-void/20 to-transparent lg:bg-gradient-to-r lg:from-void/75 lg:via-void/25 lg:to-transparent" />
      <div className="frame relative flex min-h-[100svh] flex-col pb-8 pt-24 md:pt-28">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: OPEN, duration: 1.2 }}
          className="flex items-center justify-between hud text-mute"
        >
          <span className="flex items-center gap-2 text-[var(--gate)]">
            <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-[var(--gate)]" />
            Gate 00 · Awakening
          </span>
          <span>{siteConfig.location}</span>
        </motion.div>

        <div className="relative mt-auto grid gap-10 lg:grid-cols-12 lg:items-end">
          <motion.div variants={stagger(0.18, OPEN + 0.25)} initial="hidden" animate="visible" className="lg:col-span-7">
            <h1 id="home-title" className="display text-display-name">
              <motion.span variants={rise} className="metal block pb-[0.04em]">
                Jason
              </motion.span>
              <motion.span variants={rise} className="metal block pb-[0.04em]">
                Zhang
              </motion.span>
            </h1>

            <motion.p variants={reveal} className="mt-7 hud text-xs text-ice md:text-sm">
              Computer science student <span className="text-sys">/</span> Software engineer{" "}
              <span className="text-sys">/</span> Founder
            </motion.p>

            <motion.p variants={reveal} className="mt-5 max-w-[46ch] text-pretty text-lg leading-relaxed text-ice-2 md:text-xl">
              I build real products end to end. <strong className="font-semibold text-ice">Inkmity</strong>, my
              booking platform for New York tattoo artists, has been live with Stripe payments since July 2026.
            </motion.p>

            <motion.div variants={reveal} className="mt-9 flex flex-wrap items-center gap-3">
              <Magnetic>
                <a href="#projects" className="btn-sys">
                  Explore projects
                  <span aria-hidden="true">↓</span>
                </a>
              </Magnetic>
              <Magnetic>
                <a href={siteConfig.socials.github} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                  GitHub ↗{NEW_TAB}
                </a>
              </Magnetic>
              <Magnetic>
                <a href={siteConfig.resume} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                  Résumé ↗{NEW_TAB}
                </a>
              </Magnetic>
            </motion.div>
          </motion.div>

          {/* The System surfaces beside the figure */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={reduce ? { opacity: 1 } : { opacity: [0, 1, 0.5, 1], y: 0 }}
            transition={reduce ? { duration: 0 } : { delay: OPEN + 1.6, duration: 1.3, ease: EASE_OUT }}
            className="hidden self-end lg:col-span-4 lg:col-start-9 lg:mb-2 lg:block xl:col-span-3 xl:col-start-10"
          >
            <div role="status" className="chamfer cut-edge relative border border-sys/40 [--cut:rgba(108,188,255,0.4)] bg-void/85 px-5 py-4 shadow-glow">
              <p className="flex items-center gap-2 hud text-sys">
                <span aria-hidden="true" className="relative flex h-4 w-4 items-center justify-center">
                  <span className="absolute inset-0 rotate-45 border border-sys" />
                  <span className="relative text-[10px] font-bold leading-none">!</span>
                </span>
                System
              </p>
              <p className="mt-2 font-display text-xl font-semibold uppercase tracking-wide text-ice">Player detected.</p>
              <p className="mt-1 text-sm text-ice-2">Jason Zhang has entered the gate.</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: OPEN + 2.2, duration: 1.2 }}
          className="mt-12 flex items-end justify-between hud text-mute"
        >
          <a href="#identity" className="group flex items-center gap-4 transition-colors duration-500 hover:text-ice">
            <span aria-hidden="true" className="relative block h-12 w-px overflow-hidden bg-line">
              <span className="absolute inset-x-0 top-0 h-4 bg-sys motion-safe:animate-drift" />
            </span>
            Descend
          </a>
          <span className="hidden items-center gap-2 md:flex">
            <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-shadow" />
            Press anywhere here to wake the shadow
          </span>
        </motion.div>
      </div>

      {/* Identity */}
      <div id="identity" className="frame relative scroll-mt-24 pb-28 pt-16 md:pb-40 md:pt-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <motion.div variants={stagger(0.14)} initial="hidden" whileInView="visible" viewport={VIEWPORT} className="scrim -mx-6 px-6 py-4 lg:col-span-5">
            <motion.p variants={reveal} className="hud text-[var(--gate)]">
              Identity
            </motion.p>
            <h2 className="mt-5 display text-display-lg text-ice">
              <motion.span variants={rise} className="block">
                A student who ships.
              </motion.span>
            </h2>
            <motion.p variants={reveal} className="prose-sys mt-6 max-w-[44ch]">
              I study computer science at Queens College (CUNY) in the evenings, so I&rsquo;m free during working hours
              for an internship or co-op now, and for Summer 2027. Before school I built the first version of Inkmity
              alone, interned at Series and wrote data automation for a marketing team.
            </motion.p>
          </motion.div>

          <div ref={statusRef} className="lg:col-span-6 lg:col-start-7">
            <SystemWindow
              title="Player status"
              right={
                <span className="flex items-center gap-2">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-[var(--gate)] motion-safe:animate-pulse-soft" />
                  Live
                </span>
              }
            >
              <dl className="divide-y divide-line">
                {STATUS.map((row, i) => (
                  <div key={row.k} className="grid grid-cols-[6rem_1fr] gap-3 py-3 first:pt-0">
                    <dt className="hud pt-1 text-mute">{row.k}</dt>
                    <dd className={row.accent ? "text-sys" : "text-ice"}>
                      <TypeOut
                        text={row.v}
                        start={seen && step >= i}
                        speed={row.v.length > 40 ? 18 : 28}
                        onDone={() => setStep((s) => Math.max(s, i + 1))}
                      />
                    </dd>
                  </div>
                ))}
                <div className="grid grid-cols-[6rem_1fr] gap-3 pb-0 pt-3">
                  <dt className="hud pt-1 text-mute">Level</dt>
                  <dd className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span key={level} className="glow-text whitespace-nowrap font-display text-xl font-bold text-sys-bright motion-safe:animate-level-flash">
                      LV {level}
                    </span>
                    <span className="text-sm text-mute">rises with each gate you enter on this page</span>
                  </dd>
                </div>
              </dl>
            </SystemWindow>
          </div>
        </div>

        {/* Records: real numbers only */}
        <motion.div variants={stagger(0.1)} initial="hidden" whileInView="visible" viewport={VIEWPORT} className="mt-20 md:mt-28">
          <motion.div variants={reveal} className="flex items-center gap-4 hud text-mute">
            <span className="text-[var(--gate)]">Records</span>
            <span aria-hidden="true" className="h-px flex-1 bg-line" />
            <span>Counted from the repositories</span>
          </motion.div>
          <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-5">
            {RECORDS.map((r) => (
              <motion.li key={r.where} variants={reveal} className="border-l border-line pl-4">
                <p className="display text-display-lg leading-none text-ice">
                  <CountUp to={r.n} suffix={r.suffix} />
                </p>
                <p className="mt-2 hud text-sys">{r.unit}</p>
                <p className="mt-2 max-w-[24ch] text-sm leading-snug text-ice-2">{r.where}</p>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
