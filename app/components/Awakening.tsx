"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import ShadowRise from "./ShadowRise";
import SystemWindow from "./SystemWindow";
import CountUp from "./CountUp";
import TypeOut from "./TypeOut";
import { siteConfig } from "../site";
import { EASE_OUT, INTRO_DELAY, reveal, rise, stagger } from "../lib/motion";

const STATUS: { k: string; v: string; accent?: boolean }[] = [
  { k: "Name", v: "Jason Zhang" },
  { k: "Title", v: "Founder, Inkmity", accent: true },
  { k: "Class", v: "Software Engineer · Builder" },
  { k: "Location", v: "New York, NY" },
  { k: "Status", v: "Open to internships & co-ops · can start now", accent: true },
  { k: "Quest", v: "B.S. Computer Science · Queens College (CUNY) · exp. May 2029" },
];

const ROW = "grid grid-cols-[6.5rem_1fr] gap-3 py-2.5 text-base transition-colors duration-300 first:pt-0 last:pb-0 hover:bg-[rgba(var(--gate-rgb),0.06)]";

/**
 * Gate 00. The awakening: the name rises out of shadow while shadows rise
 * behind it, and the System fills the Player status window in line by line.
 * Every number in the log is real.
 */
export default function Awakening() {
  const [level, setLevel] = useState(1);
  const [begin, setBegin] = useState(false);
  const [step, setStep] = useState(0);
  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, "change", (v) => setLevel(1 + Math.min(5, Math.floor(v * 6))));

  // The window materializes, then the System starts filling it in.
  useEffect(() => {
    const t = window.setTimeout(() => setBegin(true), (INTRO_DELAY + 1.4) * 1000);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <section
      id="awakening"
      aria-labelledby="awakening-title"
      data-cursor="pulse"
      className="gate-blue relative isolate min-h-[100svh] overflow-hidden"
    >
      <ShadowRise />
      <div aria-hidden="true" className="scanlines pointer-events-none absolute inset-0 -z-10 opacity-70" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-void to-transparent" />

      <span aria-hidden="true" className="vertical hud absolute left-6 top-1/2 hidden -translate-y-1/2 text-mute lg:block">
        Gate 00 — Awakening · New York
      </span>

      <div className="frame flex min-h-[100svh] flex-col justify-between pb-10 pt-24 md:pt-28">
        <motion.div
          variants={stagger(0.2, INTRO_DELAY)}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-between hud text-mute"
        >
          <motion.span variants={reveal} className="flex items-center gap-2 text-[var(--gate)]">
            <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-[var(--gate)]" />
            Gate 00 · Awakening
          </motion.span>
          <motion.span variants={reveal} className="hidden sm:inline">
            {siteConfig.location}
          </motion.span>
        </motion.div>

        <div className="grid gap-10 py-10 lg:grid-cols-12 lg:items-end lg:gap-8 md:py-14">
          <motion.div
            variants={stagger(0.22, INTRO_DELAY + 0.15)}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7"
          >
            <h1 id="awakening-title" className="font-display text-display-name font-bold uppercase text-ice">
              <motion.span variants={rise} className="block">
                Jason
              </motion.span>
              <motion.span variants={rise} className="glow-text block text-sys-bright">
                Zhang
              </motion.span>
            </h1>

            <motion.p variants={reveal} className="mt-8 hud text-sm text-ice md:text-base">
              Software Engineer <span className="glow-text text-sys">/</span> Builder{" "}
              <span className="glow-text text-sys">/</span> Founder
            </motion.p>

            <motion.p
              variants={reveal}
              className="mt-5 max-w-[44ch] text-pretty text-lg leading-relaxed text-ice-2 md:text-xl"
            >
              Computer Science at Queens College (CUNY), expected May 2029. Founder of{" "}
              <a href="#inkmity" className="link-sys text-ice">
                Inkmity
              </a>
              , a live booking platform for tattoo artists with Stripe payments. I build the system
              and the surface, and I level up by shipping.
            </motion.p>

            <motion.div variants={reveal} className="mt-8 flex flex-wrap gap-3">
              <a href="#inkmity" className="btn-sys">
                Enter Gate 01
              </a>
              <a href="#contact" className="btn-ghost">
                Send a message
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            variants={stagger(0.25, INTRO_DELAY + 0.9)}
            initial="hidden"
            animate="visible"
            className="space-y-4 lg:col-span-5"
          >
            <SystemWindow
              title="Player status"
              right={
                <span className="flex items-center gap-2">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-[var(--gate)] motion-safe:animate-pulse-soft" />
                  Live
                </span>
              }
            >
              <dl className="divide-y divide-[rgba(var(--gate-rgb),0.18)]">
                <div className={ROW}>
                  <dt className="hud pt-1 text-mute">Level</dt>
                  <dd className="flex items-baseline gap-3">
                    <span
                      key={level}
                      aria-live="polite"
                      className="glow-text font-display text-xl font-bold text-sys-bright motion-safe:animate-level-flash"
                    >
                      LV {level}
                    </span>
                    <span className="hud text-mute">climbs as you descend</span>
                  </dd>
                </div>
                {STATUS.map((row, i) => (
                  <div key={row.k} className={ROW}>
                    <dt className="hud pt-1 text-mute">{row.k}</dt>
                    <dd className={row.accent ? "text-[var(--gate)]" : "text-ice"}>
                      <TypeOut
                        text={row.v}
                        start={begin && step >= i}
                        speed={row.v.length > 40 ? 16 : 26}
                        onDone={() => setStep((s) => Math.max(s, i + 1))}
                      />
                    </dd>
                  </div>
                ))}
              </dl>
            </SystemWindow>

            <SystemWindow title="Log" right="Real numbers" bodyClassName="p-4 md:p-5">
              <ul className="space-y-1.5 text-sm text-ice-2">
                <li className="flex items-baseline gap-3">
                  <span className="hud w-28 shrink-0 pt-0.5 text-mute">Inkmity v1</span>
                  <span>
                    <CountUp to={530} suffix="+" /> commits, built by hand
                  </span>
                </li>
                <li className="flex items-baseline gap-3">
                  <span className="hud w-28 shrink-0 pt-0.5 text-mute">Series</span>
                  <span>
                    <CountUp to={50} suffix="+" /> pull requests
                  </span>
                </li>
                <li className="flex items-baseline gap-3">
                  <span className="hud w-28 shrink-0 pt-0.5 text-mute">Move Tact</span>
                  <span>
                    <CountUp to={19} /> Python scripts · <CountUp to={108} /> commits
                  </span>
                </li>
                <li className="flex items-baseline gap-3">
                  <span className="hud w-28 shrink-0 pt-0.5 text-mute">Amazeon</span>
                  <span>
                    <CountUp to={167} /> commits, solo capstone
                  </span>
                </li>
                <li className="flex items-baseline gap-3">
                  <span className="hud w-28 shrink-0 pt-0.5 text-mute">Bonjour World</span>
                  <span>
                    <CountUp to={15} /> PRs merged
                  </span>
                </li>
              </ul>
            </SystemWindow>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: INTRO_DELAY + 2, duration: 1.2, ease: EASE_OUT }}
          className="flex items-end justify-between hud text-mute"
        >
          <a href="#inkmity" className="group flex items-center gap-4 transition-colors hover:text-ice">
            <span aria-hidden="true" className="relative block h-12 w-px overflow-hidden bg-line">
              <span className="absolute inset-x-0 top-0 h-4 bg-sys motion-safe:animate-drift" />
            </span>
            Descend
          </a>
          <span className="hidden items-center gap-2 lg:flex">
            <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-sys-dim" />
            Press anywhere to stir the shadows
          </span>
        </motion.div>
      </div>
    </section>
  );
}
