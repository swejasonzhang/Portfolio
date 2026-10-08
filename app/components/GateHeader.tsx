"use client";

import { motion } from "framer-motion";
import { reveal, rise, stagger, sweep, VIEWPORT } from "../lib/motion";

/**
 * Chapter threshold in the gate's own color: a HUD line with the gate number
 * and optional rank, a luminous sweep, then the title rising out of shadow.
 * Reads --gate / --gate-rgb from the section.
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
  id: string;
  gate: string;
  rank?: string;
  status?: string;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <motion.header
      variants={stagger(0.18)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      className={`relative mb-12 md:mb-16 ${className}`}
    >
      <motion.div variants={reveal} className="flex flex-wrap items-center gap-3 hud md:gap-4">
        <span className="border border-[rgba(var(--gate-rgb),0.6)] bg-[rgba(var(--gate-rgb),0.12)] px-2.5 py-1 text-[var(--gate)]">
          Gate {gate}
        </span>
        {rank && (
          <span className="border border-[rgba(var(--gate-rgb),0.7)] bg-[rgba(var(--gate-rgb),0.18)] px-2.5 py-1 font-bold text-[var(--gate)] [text-shadow:0_0_14px_rgba(var(--gate-rgb),0.6)]">
            {rank}
          </span>
        )}
        <motion.span
          variants={sweep}
          aria-hidden="true"
          className="hidden h-px flex-1 origin-left bg-gradient-to-r from-[var(--gate)] via-[rgba(var(--gate-rgb),0.35)] to-line sm:block"
        />
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
          className="mt-6 max-w-[56ch] text-pretty text-lg leading-relaxed text-ice-2 md:text-xl"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.header>
  );
}
