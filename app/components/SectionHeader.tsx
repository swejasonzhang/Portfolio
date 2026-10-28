"use client";

import { motion } from "framer-motion";
import { GATES } from "../lib/gates";
import { reveal, rise, stagger, sweep, VIEWPORT } from "../lib/motion";

/**
 * A gate's threshold: the rank chip and chapter in the gate's color, a sweep
 * of light, then the plain title rising out of shadow. Plain titles, so a
 * recruiter never has to decode the theme to find the work.
 */
export default function SectionHeader({
  index,
  id,
  title,
  lead,
  className = "",
}: {
  index: number;
  id: string;
  title: string;
  lead?: string;
  className?: string;
}) {
  const g = GATES[index];
  return (
    <motion.header variants={stagger(0.16)} initial="hidden" whileInView="visible" viewport={VIEWPORT} className={`relative ${className}`}>
      <motion.div variants={reveal} className="flex flex-wrap items-center gap-3 hud md:gap-4">
        <span className="chamfer cut-edge bg-[rgba(var(--gate-rgb),0.14)] [--cut:rgba(var(--gate-rgb),0.55)] px-3 py-1.5 text-[var(--gate)] ring-1 ring-inset ring-[rgba(var(--gate-rgb),0.55)]">
          Gate {g.gate}
        </span>
        {"rank" in g && (
          <span className="chamfer cut-edge bg-[rgba(var(--gate-rgb),0.22)] [--cut:rgba(var(--gate-rgb),0.7)] px-3 py-1.5 font-bold text-[var(--gate)] ring-1 ring-inset ring-[rgba(var(--gate-rgb),0.7)]">
            {g.rank}
          </span>
        )}
        <span className="text-silver-2">{g.chapter}</span>
        <motion.span
          variants={sweep}
          aria-hidden="true"
          className="hidden h-px flex-1 origin-left bg-gradient-to-r from-[var(--gate)] via-[rgba(var(--gate-rgb),0.3)] to-transparent sm:block"
        />
      </motion.div>
      <h2 id={id} className="mt-7 display text-display-xl text-ice">
        <motion.span variants={rise} className="block text-balance">
          {title}
        </motion.span>
      </h2>
      {lead && (
        <motion.p variants={reveal} className="mt-6 max-w-[54ch] text-pretty text-lg leading-relaxed text-ice-2 md:text-xl">
          {lead}
        </motion.p>
      )}
    </motion.header>
  );
}
