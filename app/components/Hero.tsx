"use client";

import { motion } from "framer-motion";
import MagneticButton from "./MagneticButton";
import TechMarquee from "./TechMarquee";
import InteractiveYinYang from "./InteractiveYinYang";
import YinYang from "./YinYang";
import { siteConfig } from "../site";
import { EASE_OUT, INTRO_DELAY, lift, reveal, stagger } from "../lib/motion";

/**
 * The hero: name in blackletter (solid yin line, hollow yang line), the
 * interactive mark beside it, and the tech band closing it off. The shell
 * wraps this in its <section>.
 */
export default function Hero() {
  return (
    <div className="container-ink pt-28 pb-14 md:pt-36 md:pb-20">
      <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:gap-10 lg:gap-16">
        {/* Text column */}
        <motion.div
          variants={stagger(0.09, INTRO_DELAY)}
          initial="hidden"
          animate="visible"
          className="order-2 text-center md:order-1 md:text-left"
        >
          <motion.p
            variants={reveal}
            className="inline-flex items-center gap-2 rounded-sm border border-line px-2.5 py-1 font-mono text-2xs uppercase tracking-label text-gray-300"
          >
            <YinYang outline className="h-3 w-3 animate-spin-slow" />
            Open to internships &amp; co-ops · New York
          </motion.p>

          <h1
            id="hero-title"
            data-cursor="hi"
            className="mt-6 font-display ink-bleed text-display-hero text-white"
          >
            <span className="-mb-[0.1em] block overflow-hidden pb-[0.1em]">
              <motion.span variants={lift} className="block">
                Jason
              </motion.span>
            </span>
            <span className="-mb-[0.1em] block overflow-hidden pb-[0.1em]">
              <motion.span variants={lift} className="ink-outline block">
                Zhang
              </motion.span>
            </span>
          </h1>

          <motion.div
            variants={reveal}
            className="mt-5 flex items-center justify-center gap-3 md:justify-start"
          >
            <span aria-hidden="true" className="h-0.5 w-8 bg-white" />
            <p className="font-mono text-xs uppercase tracking-kicker text-gray-200">
              {siteConfig.role}
            </p>
          </motion.div>

          <motion.p
            variants={reveal}
            className="mx-auto mt-6 max-w-lg text-pretty text-[15px] leading-relaxed text-gray-300 md:mx-0 md:text-lg"
          >
            I&rsquo;m a Computer Science student at Queens College (CUNY) and
            the founder of Inkmity, a live booking app for tattoo artists. I
            think in balance &mdash; as much care for the structure holding a
            system up as for the surface you actually touch.
          </motion.p>

          <motion.div
            variants={reveal}
            className="mt-8 flex flex-wrap items-center justify-center gap-4 md:justify-start"
          >
            <MagneticButton href="#projects" variant="yang">
              See the work
            </MagneticButton>
            <MagneticButton href="#contact" variant="yin">
              Say hello
            </MagneticButton>
          </motion.div>
        </motion.div>

        {/* Mark column */}
        <div className="order-1 flex justify-center md:order-2 md:justify-end">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: INTRO_DELAY, duration: 0.9, ease: EASE_OUT }}
            className="w-[clamp(11rem,46vw,15rem)] md:w-[clamp(15rem,32vw,22rem)] lg:w-[clamp(20rem,30vw,26rem)]"
          >
            <InteractiveYinYang />
          </motion.div>
        </div>
      </div>

      <div className="mt-14 md:mt-20">
        <TechMarquee />
      </div>
    </div>
  );
}
