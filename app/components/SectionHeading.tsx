"use client";

import { motion } from "framer-motion";
import { lift, reveal, stagger, VIEWPORT } from "../lib/motion";

/**
 * The one section header: mono number + kicker above, blackletter title with a
 * line-mask reveal, a heavy rule with a rotated square below, optional lead.
 */
export default function SectionHeading({
  id,
  no,
  kicker,
  title,
  lead,
  hint,
  align = "center",
  tone = "ink",
  className = "",
}: {
  /** id for the h2 (use with aria-labelledby on the section). */
  id?: string;
  /** Section number, e.g. "01". */
  no?: string;
  kicker: string;
  title: string;
  lead?: string;
  /** Small mono helper line under the lead (e.g. interaction hint). */
  hint?: string;
  align?: "center" | "left";
  /** "paper" for the inverted white band. */
  tone?: "ink" | "paper";
  className?: string;
}) {
  const paper = tone === "paper";
  const center = align === "center";

  const kickerColor = paper ? "text-black/60" : "text-gray-400";
  const ruleColor = paper ? "bg-black/60" : "bg-white/60";
  const dotColor = paper ? "bg-black" : "bg-white";

  return (
    <motion.header
      variants={stagger(0.1)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      className={`mb-12 md:mb-16 ${center ? "text-center" : "text-left"} ${className}`}
    >
      <motion.p
        variants={reveal}
        className={`flex items-center gap-3 font-mono text-2xs uppercase tracking-kicker ${
          center ? "justify-center" : ""
        } ${kickerColor}`}
      >
        {no && (
          <>
            <span className="tabular-nums">Nº {no}</span>
            <span aria-hidden="true" className={`h-1 w-1 rotate-45 ${ruleColor}`} />
          </>
        )}
        <span>{kicker}</span>
      </motion.p>

      <h2
        id={id}
        className={`mt-4 font-display text-display-xl ${paper ? "text-black" : "text-white"}`}
      >
        <span className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
          <motion.span variants={lift} className="block text-balance">
            {title}
          </motion.span>
        </span>
      </h2>

      <motion.div
        variants={reveal}
        aria-hidden="true"
        className={`mt-5 flex items-center gap-2 ${center ? "justify-center" : ""}`}
      >
        <span className={`h-0.5 w-10 ${ruleColor}`} />
        <span className={`h-1.5 w-1.5 rotate-45 ${dotColor}`} />
        <span className={`h-0.5 w-10 ${ruleColor}`} />
      </motion.div>

      {lead && (
        <motion.p
          variants={reveal}
          className={`mt-5 max-w-[52ch] text-pretty text-base leading-relaxed md:text-lg ${
            center ? "mx-auto" : ""
          } ${paper ? "text-black/70" : "text-gray-400"}`}
        >
          {lead}
        </motion.p>
      )}

      {hint && (
        <motion.p
          variants={reveal}
          className={`mt-3 font-mono text-2xs uppercase tracking-label ${
            paper ? "text-black/50" : "text-gray-400"
          }`}
        >
          {hint}
        </motion.p>
      )}
    </motion.header>
  );
}
