"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState, type ReactNode } from "react";
import PortalCanvas from "./PortalCanvas";
import SystemWindow from "./SystemWindow";
import CountUp from "./CountUp";
import { siteConfig } from "../site";
import { EASE_OUT, INTRO_DELAY, reveal, rise, stagger } from "../lib/motion";

const STATUS: { k: string; v: string; tone?: "sys" | "shadow" }[] = [
  { k: "Name", v: "Jason Zhang" },
  { k: "Title", v: "Founder, Inkmity", tone: "shadow" },
  { k: "Class", v: "Software Engineer · Builder" },
  { k: "Location", v: "New York, NY" },
  { k: "Status", v: "Open to internships & co-ops · can start now", tone: "sys" },
  { k: "Quest", v: "B.S. Computer Science · Queens College (CUNY) · exp. May 2029" },
];

/** Real counts only. Numbers count up when the window scrolls into view. */
const LOG: { k: string; v: ReactNode }[] = [
  {
    k: "Inkmity v1",
    v: (
      <>
        <CountUp to={530} suffix="+" className="text-ice" /> commits, built by hand
      </>
    ),
  },
  {
    k: "Series",
    v: (
      <>
        <CountUp to={50} suffix="+" className="text-ice" /> pull requests
      </>
    ),
  },
  {
    k: "Move Tact",
    v: (
      <>
        <CountUp to={19} className="text-ice" /> Python scripts ·{" "}
        <CountUp to={108} className="text-ice" /> commits
      </>
    ),
  },
  {
    k: "Amazeon",
    v: (
      <>
        <CountUp to={167} className="text-ice" /> commits, solo capstone
      </>
    ),
  },
  {
    k: "Bonjour World",
    v: (
      <>
        <CountUp to={15} className="text-ice" /> PRs merged
      </>
    ),
  },
];

const ROW_CLASS =
  "grid grid-cols-[6rem_1fr] gap-3 py-2 text-sm first:pt-0 last:pb-0 transition-colors duration-300 hover:bg-sys/5";

/**
 * Gate 00. The awakening: the name rises out of shadow in front of the
 * portal, the identity line, one true paragraph, and the Player status
 * window with real numbers for stats. The Level row is fed by scroll and
 * uses the same formula as the rail (1 + floor(progress * 6), capped at 6).
 */
export default function Awakening() {
  const { scrollYProgress } = useScroll();
  const [level, setLevel] = useState(1);
  useMotionValueEvent(scrollYProgress, "change", (v) =>
    setLevel(1 + Math.min(5, Math.floor(v * 6)))
  );

  return (
    <section
      id="awakening"
      aria-labelledby="awakening-title"
      className="relative isolate min-h-[100svh] overflow-hidden"
    >
      <PortalCanvas />
      <div aria-hidden="true" className="scanlines pointer-events-none absolute inset-0 -z-10 opacity-70" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-void to-transparent" />

      <span
        aria-hidden="true"
        className="vertical hud absolute left-6 top-1/2 hidden -translate-y-1/2 text-mute lg:block"
      >
        Gate 00 — Awakening · New York
      </span>

      <div className="frame flex min-h-[100svh] flex-col justify-between pb-10 pt-24 md:pt-28">
        <motion.div
          variants={stagger(0.2, INTRO_DELAY)}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-between hud text-mute"
        >
          <motion.span variants={reveal} className="flex items-center gap-2 text-sys">
            <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-sys" />
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

            <motion.p variants={reveal} className="mt-8 hud text-xs text-ice md:text-sm">
              Software Engineer <span className="glow-text text-sys">/</span> Builder{" "}
              <span className="glow-text text-sys">/</span> Founder
            </motion.p>

            <motion.p
              variants={reveal}
              className="mt-5 max-w-[42ch] text-pretty text-base leading-relaxed text-ice-2 md:text-lg"
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
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rotate-45 bg-sys motion-safe:animate-pulse-soft"
                  />
                  Live
                </span>
              }
            >
              <dl className="divide-y divide-line">
                <div className={ROW_CLASS}>
                  <dt className="hud pt-0.5 text-mute">Level</dt>
                  <dd className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span
                      key={level}
                      aria-live="polite"
                      className="glow-text font-display text-base font-bold uppercase text-sys-bright motion-safe:animate-level-flash"
                    >
                      LV {level}
                    </span>
                    <span className="hud text-mute">climbs as you descend</span>
                  </dd>
                </div>
                {STATUS.map((row) => (
                  <div key={row.k} className={ROW_CLASS}>
                    <dt className="hud pt-0.5 text-mute">{row.k}</dt>
                    <dd
                      className={
                        row.tone === "shadow"
                          ? "text-shadow-bright"
                          : row.tone === "sys"
                          ? "text-sys-bright"
                          : "text-ice"
                      }
                    >
                      {row.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </SystemWindow>

            <SystemWindow title="Log" right="Real numbers" bodyClassName="p-4 md:p-5">
              <ul className="space-y-1.5 font-mono text-xs text-ice-2">
                {LOG.map((l) => (
                  <li key={l.k} className="flex items-baseline gap-3">
                    <span className="w-28 shrink-0 text-mute">{l.k}</span>
                    <span>{l.v}</span>
                  </li>
                ))}
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
          <div className="flex items-center gap-8">
            <a href="#inkmity" className="group flex items-center gap-4 transition-colors duration-300 hover:text-ice">
              <span aria-hidden="true" className="relative block h-12 w-px overflow-hidden bg-line">
                <span className="absolute inset-x-0 top-0 h-4 bg-sys motion-safe:animate-drift" />
              </span>
              Descend
            </a>
            <span className="hidden items-center gap-2 lg:flex">
              <span aria-hidden="true" className="h-1 w-1 rotate-45 bg-sys-dim" />
              Press anywhere on the gate to send a pulse
            </span>
          </div>
          <span className="hidden sm:inline">Gates 00 → 05</span>
        </motion.div>
      </div>
    </section>
  );
}
