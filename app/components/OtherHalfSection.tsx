"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import TiltCard from "./TiltCard";
import SectionHeading from "./SectionHeading";
import Backdrop from "./Backdrop";
import { Rose, Moth } from "./ink/Motifs";
import { reveal, stagger, VIEWPORT } from "../lib/motion";

interface Half {
  key: string;
  word: string;
  no: string;
  title: string;
  mark: ReactNode;
  watermark: ReactNode;
  body: ReactNode;
  offset: string;
}

const linkClass = "ink-underline font-medium text-black";

const halves: Half[] = [
  {
    key: "ink",
    word: "Ink",
    no: "01",
    title: "Art & Ink",
    mark: (
      <Rose
        className="absolute right-6 top-6 h-14 w-14 text-black"
        strokeWidth={2.4}
      />
    ),
    watermark: (
      <Rose
        className="pointer-events-none absolute -bottom-12 -right-12 h-64 w-64 text-black/[0.06]"
        strokeWidth={1}
      />
    ),
    body: (
      <>
        I&rsquo;m drawn to people who make things by hand. A tattoo artist turns
        a blank arm into a story, and the yin-yang I keep coming back to shows
        how much one clean design can carry. That respect for craft is why I
        built{" "}
        <a href="#project-inkmity" className={linkClass}>
          Inkmity
        </a>{" "}
        &mdash; and why I sweat every pixel of an interface.
      </>
    ),
    offset: "md:mb-16",
  },
  {
    key: "play",
    word: "Play",
    no: "02",
    title: "Games & Play",
    mark: (
      <Moth
        className="absolute right-6 top-6 h-14 w-14 text-black"
        strokeWidth={2.4}
      />
    ),
    watermark: (
      <Moth
        className="pointer-events-none absolute -bottom-12 -right-12 h-64 w-64 text-black/[0.06]"
        strokeWidth={1}
      />
    ),
    body: (
      <>
        I grew up taking games apart to see how they ticked, so eventually I
        built my own:{" "}
        <a href="#project-battlefield-tanks" className={linkClass}>
          Battlefield: Tanks
        </a>
        , a tank duel with destructible terrain, written from scratch on a bare
        canvas. Play is how I learn &mdash; hand me a system and I&rsquo;ll want
        every rule holding it together.
      </>
    ),
    offset: "md:mt-16",
  },
];

export default function OtherHalfSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="paper relative isolate bg-paper py-24 text-black md:py-32"
    >
      <Backdrop variant="ruled" />
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 border-y border-black/70"
      />
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1 border-y border-black/70"
      />

      <div className="container-ink">
        <SectionHeading
          id="about-title"
          no="05"
          kicker="Beyond the code"
          title="The Other Half"
          lead="Code is one half of the picture. This is the other."
          tone="paper"
        />

        <motion.div
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="grid gap-6 md:grid-cols-2 md:gap-8"
        >
          {halves.map((h) => (
            <motion.div key={h.key} variants={reveal} className={h.offset}>
              <TiltCard
                max={4}
                spot="dark"
                className="flash-frame flash-frame-paper h-full overflow-hidden p-7 pt-14 md:p-8 md:pt-16"
              >
                {h.mark}
                {h.watermark}

                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-2 left-5 select-none font-display text-8xl leading-none text-transparent [-webkit-text-stroke:1px_rgba(5,5,5,0.14)]"
                >
                  {h.word}
                </span>

                <p className="relative font-mono text-2xs uppercase tracking-label tabular-nums text-black/60">
                  Nº {h.no} <span className="text-black/40">/ 02</span>
                </p>

                <h3 className="relative mt-3 font-display text-display-lg text-black">
                  {h.title}
                </h3>

                <span aria-hidden="true" className="my-4 block h-0.5 w-10 bg-black" />

                <p className="relative text-[15px] leading-relaxed text-black/75 md:text-base">
                  {h.body}
                </p>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
