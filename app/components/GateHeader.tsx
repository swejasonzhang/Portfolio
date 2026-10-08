"use client";

import { motion } from "framer-motion";
import { reveal, rise, stagger, VIEWPORT } from "../lib/motion";

/**
 * Chapter threshold: a HUD line with the gate number and optional rank, a
 * luminous rule, then the title rising out of shadow.
 */
export default function GateHeader({
  id,
  gate,
  rank,
  status,
  title,
  subtitle,
  className = "",
}: {
  /** id for the h2; put aria-labelledby on the section. */
  id: string;
  /** Two-digit gate number, e.g. "02". */
  gate: string;
  /** Optional rank chip, e.g. "S-Rank". */
  rank?: string;
  /** Right-aligned HUD status, e.g. "Cleared · 2023 – 2026". */
  status?: string;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <motion.header
      variants={stagger(0.1)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      className={`relative mb-12 md:mb-16 ${className}`}
    >
      <motion.div variants={reveal} className="flex flex-wrap items-center gap-3 hud md:gap-4">
        <span className="border border-sys/50 bg-sys/10 px-2.5 py-1 text-sys">Gate {gate}</span>
        {rank && (
          <span className="glow-text-violet border border-shadow/60 bg-shadow/10 px-2.5 py-1 text-shadow-bright">
            {rank}
          </span>
        )}
        <span aria-hidden="true" className="hidden h-px flex-1 bg-line sm:block" />
        {status && <span className="text-mute">{status}</span>}
      </motion.div>

      <h2 id={id} className="mt-8 font-display text-display-xl uppercase text-ice">
        <motion.span variants={rise} className="block text-balance">
          {title}
        </motion.span>
      </h2>

      {subtitle && (
        <motion.p
          variants={reveal}
          className="mt-6 max-w-[52ch] text-pretty text-base leading-relaxed text-ice-2 md:text-lg"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.header>
  );
}
