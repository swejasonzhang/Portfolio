"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import TiltCard from "./TiltCard";
import YinYang from "./YinYang";
import Backdrop from "./Backdrop";
import { revealFrom, stagger, VIEWPORT } from "../lib/motion";

const craft = [
  "React & Next.js architectures",
  "TypeScript, end to end",
  "Interactive, responsive interfaces",
  "Motion & micro-interactions",
  "Tailwind & design systems",
];

const logic = [
  "API & database design",
  "Node, Express & PostgreSQL / MongoDB",
  "Auth, real-time & AI integrations",
  "Cloud, Firebase & AWS",
  "CI/CD & deployment pipelines",
];

/**
 * One plate split down the middle, one half inverted: the page's thesis made
 * literal. Paper (yang) on the left, ink (yin) on the right; stacked on phones.
 */
export default function TwoSides() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="relative isolate py-24 md:py-32">
      <Backdrop variant="seam" />
      <div className="container-ink">
        <SectionHeading
          id="skills-title"
          no="01"
          kicker="What I do"
          title="Two Sides, One Developer"
        />

        <motion.div
          variants={stagger(0.15)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          <TiltCard max={3} className="flash-frame grid overflow-hidden after:hidden md:grid-cols-2">
            {/* Yang: the craft */}
            <motion.div
              variants={revealFrom("left")}
              className="paper relative flex flex-col bg-paper p-8 text-black md:p-10 lg:p-12"
            >
              <p className="font-mono text-2xs uppercase tracking-label tabular-nums text-black/60">
                Nº 01 &mdash; Yang · The Craft
              </p>
              <h3 className="mt-4 font-display text-display-lg text-black">
                The Craft
              </h3>
              <p className="mt-2 text-sm text-black/60">
                The half you can see and feel.
              </p>
              <span aria-hidden="true" className="my-5 block h-0.5 w-10 bg-black" />
              <ul className="space-y-3 text-[15px] text-black/80">
                {craft.map((skill) => (
                  <li key={skill} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-[0.55em] h-1 w-1 shrink-0 rotate-45 bg-current"
                    />
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Yin: the logic */}
            <motion.div
              variants={revealFrom("right")}
              className="relative flex flex-col bg-ink p-8 text-white md:p-10 lg:p-12"
            >
              <p className="font-mono text-2xs uppercase tracking-label tabular-nums text-gray-400">
                Nº 02 &mdash; Yin · The Logic
              </p>
              <h3 className="mt-4 font-display text-display-lg text-white">
                The Logic
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                The half that holds it all up.
              </p>
              <span aria-hidden="true" className="my-5 block h-0.5 w-10 bg-white" />
              <ul className="space-y-3 text-[15px] text-gray-300">
                {logic.map((skill) => (
                  <li key={skill} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-[0.55em] h-1 w-1 shrink-0 rotate-45 bg-white"
                    />
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* The mark straddling the seam: white half toward the paper side */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden h-12 w-12 -translate-x-1/2 -translate-y-1/2 md:block"
            >
              <YinYang className="h-full w-full" />
            </span>
          </TiltCard>
        </motion.div>
      </div>
    </section>
  );
}
