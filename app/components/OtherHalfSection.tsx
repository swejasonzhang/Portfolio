"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import TiltCard from "./TiltCard";
import YinYang from "./YinYang";
import { Rose, Moth } from "./ink/Motifs";

interface Passion {
  motif: ReactNode;
  title: string;
  body: string;
}

const passions: Passion[] = [
  {
    motif: <Rose className="h-10 w-10" strokeWidth={1.6} />,
    title: "Art & Ink",
    body: "I’m drawn to people who make things by hand. Tattoo artists turn a blank arm into a story — the yin-yang I keep coming back to is proof of how much a single clean design can mean. That respect for craft is exactly why I built Inkmity, and it’s the same instinct that makes me sweat the details of an interface.",
  },
  {
    motif: <Moth className="h-10 w-10" strokeWidth={1.6} />,
    title: "Games & Play",
    body: "I grew up taking games apart to see how they ticked, so at some point I built my own — a tank-duel engine with destructible terrain, written from scratch on a bare canvas. Play is how I learn best: give me a system and I’ll want to know every rule holding it together.",
  },
];

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function OtherHalfSection() {
  return (
    <div className="relative px-4 py-24">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-gray-400">
            Beyond the code
          </p>
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-white/30" />
            <YinYang className="h-8 w-8 animate-spin-slow" />
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-white/30" />
          </div>
          <h2 className="mt-4 font-display text-4xl text-white md:text-6xl">
            The Other Half
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-gray-400">
            The code is only one side of me. The other side is where the code
            gets its taste.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid gap-6 md:grid-cols-2"
        >
          {passions.map((p) => (
            <motion.div key={p.title} variants={item}>
              <TiltCard
                max={5}
                className="flash-frame flex h-full flex-col rounded-sm bg-[#050505] p-7 md:p-8"
              >
                <div className="mb-4 text-white/80" aria-hidden>
                  {p.motif}
                </div>
                <h3 className="mb-3 font-display text-2xl text-white md:text-3xl">
                  {p.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-400 md:text-base">
                  {p.body}
                </p>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
