"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import CountUp from "./CountUp";
import { reveal, rise, stagger, VIEWPORT } from "../lib/motion";

const NEW_TAB = <span className="sr-only"> (opens in a new tab)</span>;

const PROBLEMS: { problem: string; approach: string }[] = [
  {
    problem: "Webcam landmarks shake, so joint angles jumped from frame to frame.",
    approach: "Smooth every landmark with its own One Euro filter, bridge frames the model is unsure of, and read angles in 3D from MediaPipe's world landmarks.",
  },
  {
    problem: "The demo depended on a Python camera app and one laptop's setup.",
    approach: "On day two, move pose tracking into the browser too. Nothing to install, and the video never leaves the device.",
  },
  {
    problem: "The API went down overnight when a temporary database IP rule expired.",
    approach: "Let the API start without its database, report the connection on /api/health, and reconnect by itself.",
  },
  {
    problem: "The 3D body froze for 117 to 250 ms whenever the exercise changed.",
    approach: "Profile on the real GPU: it was being rebuilt each time. Mounting it once with shared materials removed the freezes.",
  },
];

/**
 * The hackathon. A different composition from Inkmity on purpose: a race
 * against the clock, so the clock leads.
 */
export default function ArcCase() {
  return (
    <article id="arc" aria-labelledby="arc-title" className="gate-red relative scroll-mt-24">
      <motion.div variants={stagger(0.14)} initial="hidden" whileInView="visible" viewport={VIEWPORT} className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <motion.p variants={reveal} className="hud flex items-center gap-3 text-[var(--gate)]">
            <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-[var(--gate)]" />
            Hackathon · Hackknight 2026 · Oct 9 – 11
          </motion.p>
          <p className="mt-6 flex items-end gap-4" aria-hidden="true">
            <motion.span variants={rise} className="display block text-[clamp(7rem,4rem+12vw,15rem)] leading-[0.78] text-ice">
              48
            </motion.span>
            <motion.span variants={reveal} className="display mb-3 block text-display-md leading-none text-silver-2">
              Hours
            </motion.span>
          </p>
          <h3 id="arc-title" className="mt-6 display text-display-lg text-ice">
            <motion.span variants={rise} className="block">
              Arc
            </motion.span>
          </h3>
          <motion.p variants={reveal} className="prose-sys mt-5">
            A webcam range-of-motion coach my team of three built in 48 hours. It tracks your body in the browser, measures
            each joint&rsquo;s angle in degrees and counts only the reps done with good form.
          </motion.p>
          <motion.p variants={reveal} className="prose-sys mt-4">
            <strong>My part:</strong> the web app and API, with browser pose tracking, the rep and form engine, the 3D body,
            the data model, CI and deployment. I built it with Claude Code, specified and tested each feature by hand, and
            merged all 44 pull requests. Kelvin built the Python camera app; Jerome built the Gemini and ElevenLabs voice coach.
          </motion.p>
          <motion.div variants={reveal} className="mt-8 flex flex-wrap gap-3">
            <a href="https://getarc.health/" target="_blank" rel="noopener noreferrer" className="btn-sys">
              getarc.health ↗{NEW_TAB}
            </a>
            <a href="https://github.com/swejasonzhang/Hackknight2026" target="_blank" rel="noopener noreferrer" className="btn-ghost">
              Source ↗{NEW_TAB}
            </a>
          </motion.div>
        </div>

        <motion.figure variants={reveal} className="lg:col-span-7 lg:mt-24">
          <div className="relative">
            <span aria-hidden="true" className="chamfer-lg absolute -left-4 -top-4 bottom-8 right-10 bg-[rgba(var(--gate-rgb),0.08)] ring-1 ring-inset ring-[rgba(var(--gate-rgb),0.3)]" />
            <div className="chamfer-lg relative aspect-[16/10] overflow-hidden ring-1 ring-inset ring-line-strong">
              <Image src="/assets/Arc.jpg" alt="Arc's landing page: a 3D body curling a dumbbell toward a 140° goal, the live angle reading 135°" fill sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover object-top" />
            </div>
          </div>
          <figcaption className="mt-4 hud text-mute">Capture · getarc.health</figcaption>
        </motion.figure>
      </motion.div>

      <motion.dl variants={stagger(0.08)} initial="hidden" whileInView="visible" viewport={VIEWPORT} className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-4">
        {[
          { n: 44, k: "pull requests merged, each through CI" },
          { n: 600, k: "automated tests on the final code" },
          { n: 15, k: "movements tracked" },
          { n: 34, k: "architecture decision records" },
        ].map((s) => (
          <motion.div key={s.k} variants={reveal} className="border-l border-line pl-4">
            <dt className="sr-only">{s.k}</dt>
            <dd>
              <span className="display block text-display-lg leading-none text-ice">
                <CountUp to={s.n} />
              </span>
              <span className="mt-2 block text-sm text-ice-2">{s.k}</span>
            </dd>
          </motion.div>
        ))}
      </motion.dl>

      <motion.ol variants={stagger(0.08)} initial="hidden" whileInView="visible" viewport={VIEWPORT} className="mt-16 grid gap-x-12 md:grid-cols-2">
        {PROBLEMS.map((p, i) => (
          <motion.li key={p.problem} variants={reveal} className="border-t border-line py-7">
            <span className="hud text-[var(--gate)]">Problem {String(i + 1).padStart(2, "0")}</span>
            <p className="mt-3 text-lg leading-snug text-ice">{p.problem}</p>
            <p className="mt-3 text-ice-2">{p.approach}</p>
          </motion.li>
        ))}
      </motion.ol>
    </article>
  );
}
