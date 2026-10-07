"use client";

import { motion } from "framer-motion";
import { reveal, stagger, VIEWPORT, wipe } from "../lib/motion";

/**
 * Paired guardian marks (the Foo Dogs, abstracted): two mirrored claw sweeps
 * that flank a threshold. Strokes only, currentColor.
 */
export function Guardians({ className = "" }: { className?: string }) {
  const mark = (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M3 18 C7 10 11 7 14 2" />
      <path d="M10 19 C13 12 17 9 21 5" />
      <path d="M17 19 C20 14 24 11 29 9" />
      <path d="M22 4 C26 3 29 5 30 8" />
    </g>
  );
  return (
    <svg viewBox="0 0 80 22" aria-hidden="true" className={className}>
      {mark}
      <g transform="translate(80 0) scale(-1 1)">{mark}</g>
    </svg>
  );
}

/**
 * The gate: every chapter is entered through one. A lintel rule carrying the
 * chapter numeral on a vermilion block, two posts descending from it, paired
 * guardians, then the title revealed through a mask. Symmetric frame,
 * asymmetric content.
 */
export default function Gate({
  id,
  numeral,
  title,
  kicker,
  lead,
  tone = "ink",
  className = "",
}: {
  /** id for the h2; put aria-labelledby on the section. */
  id: string;
  /** Roman numeral, e.g. "II". */
  numeral: string;
  title: string;
  /** Mono label at the right end of the lintel. */
  kicker: string;
  lead?: string;
  tone?: "ink" | "paper";
  className?: string;
}) {
  const paper = tone === "paper";
  const ruleColor = paper ? "bg-inkline-rule" : "bg-line-rule";
  const quiet = paper ? "text-ash-2" : "text-ash";

  return (
    <motion.header
      variants={stagger(0.1)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      className={`relative mb-14 md:mb-20 ${className}`}
    >
      {/* Lintel */}
      <motion.div variants={reveal} className="flex items-center gap-4 md:gap-6">
        <span className="flex h-7 min-w-7 items-center justify-center bg-shu px-2 font-serif text-base italic leading-none text-washi">
          {numeral}
        </span>
        <span aria-hidden="true" className={`h-px flex-1 ${ruleColor}`} />
        <Guardians className={`h-5 w-16 shrink-0 ${quiet}`} />
        <span className={`font-mono text-2xs uppercase tracking-kicker ${quiet}`}>{kicker}</span>
      </motion.div>

      {/* Posts */}
      <span aria-hidden="true" className={`absolute left-0 top-7 h-14 w-px ${ruleColor}`} />
      <span aria-hidden="true" className={`absolute right-0 top-7 h-14 w-px ${ruleColor}`} />

      <h2 id={id} className={`mt-10 font-serif text-display-xl ${paper ? "text-sumi" : "text-washi"}`}>
        <motion.span variants={wipe} className="block text-balance">
          {title}
        </motion.span>
      </h2>

      {lead && (
        <motion.p
          variants={reveal}
          className={`mt-6 max-w-[46ch] text-pretty text-base leading-relaxed md:text-lg ${quiet}`}
        >
          {lead}
        </motion.p>
      )}
    </motion.header>
  );
}
