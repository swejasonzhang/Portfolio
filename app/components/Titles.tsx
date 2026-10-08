"use client";

import { motion } from "framer-motion";
import GateHeader from "./GateHeader";
import GateRing from "./GateRing";
import RankMark from "./RankMark";
import SystemWindow from "./SystemWindow";
import { reveal, rise, stagger, VIEWPORT } from "../lib/motion";

type Title = {
  name: string;
  source: string;
  body: string;
};

const TITLES: Title[] = [
  {
    name: "The Fan",
    source: "Solo Leveling",
    body:
      "Solo Leveling is one of my tattoos, so there is no hiding it: I am a fan. What stuck with me is not the power, it is the grind from the bottom, one run at a time, with nobody watching. That is what building alone has felt like, and I would rather earn the next rank than be handed it.",
  },
  {
    name: "The Current",
    source: "Koi",
    body:
      "The koi are about movement. I want interfaces that move like water: real-time chat in Inkmity that lands the moment it is sent, transitions instead of hard cuts, nothing that jolts you out of what you were doing. If a screen feels still, I have not finished it.",
  },
  {
    name: "The Mask",
    source: "Hannya",
    body:
      "The Hannya is intensity with a face on it. For me that means decisions written down: Inkmity runs on a product constitution with explicit anti-goals, and when I am unsure a feature belongs, I freeze it behind a flag instead of deleting it. Moderation fails closed. Caring that hard is the point.",
  },
  {
    name: "The Guardians",
    source: "Foo Dogs",
    body:
      "Twin Foo Dogs sit on my shoulders, one on each side, and that is how I treat the gates I refuse to ship without. Waivers are enforced on the client and the server. Webhook signatures are verified. After a red job once made it out, every deploy is gated on green CI.",
  },
];

const PROFILE: { label: string; value: string }[] = [
  {
    label: "Also",
    value: "Anime · games · visual storytelling · craftsmanship · experimentation",
  },
  {
    label: "Now",
    value: "Queens College (CUNY), evening classes, C++ · expected May 2029",
  },
  {
    label: "Open to",
    value: "Software engineering internship or co-op · can start right away",
  },
  {
    label: "Method",
    value:
      "First version of Inkmity by hand; since June 2026 with Claude Code, an AI coding agent: I specify, test, approve.",
  },
];

/**
 * Gate 04 — Titles. Who Jason is beyond the code: four earned titles drawn
 * from the ink he carries, a player profile register, and a closing line on
 * independent building.
 */
export default function Titles() {
  return (
    <section
      id="self"
      aria-labelledby="self-title"
      className="relative isolate overflow-hidden py-24 md:py-36"
    >
      <div aria-hidden="true" className="pool-shadow absolute inset-0 -z-10" />
      <RankMark letter="04" className="-left-[5vw] -bottom-8" />
      <GateRing className="w-[80vw] -left-[40vw] top-0 md:w-[46vw] md:-left-[16vw]" />
      <span
        aria-hidden="true"
        className="vertical hud absolute left-6 top-1/2 hidden -translate-y-1/2 text-mute lg:block"
      >
        Gate 04 — Titles
      </span>

      <div className="frame">
        <GateHeader
          id="self-title"
          gate="04"
          status="Beyond the code"
          title="Titles"
          subtitle="Earned, not assigned. What I carry and what it does to how I build."
        />

        <motion.div
          variants={stagger(0.14)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="grid grid-cols-1 gap-16 md:grid-cols-12 md:gap-y-20"
        >
          {/* Display statement */}
          <p className="col-span-full font-display text-display-lg uppercase text-ice text-balance md:col-span-10">
            <motion.span variants={rise} className="block">
              I level up the only way that counts: by shipping.
            </motion.span>
          </p>

          {/* Four earned titles */}
          <div className="col-span-full grid grid-cols-1 gap-5 md:grid-cols-2">
            {TITLES.map((t) => (
              <SystemWindow key={t.name} title="Title" right="Title acquired" tone="shadow">
                <div className="flex flex-col gap-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                    <h3 className="font-display text-display-md uppercase text-shadow-bright">
                      <span className="glow-text-violet motion-safe:animate-flicker inline-block">{t.name}</span>
                    </h3>
                    <span className="hud text-mute">Source · {t.source}</span>
                  </div>
                  <p className="text-pretty leading-relaxed text-ice-2">{t.body}</p>
                </div>
              </SystemWindow>
            ))}
            <motion.p variants={reveal} className="col-span-full flex items-center gap-4 hud text-mute">
              <span aria-hidden="true" className="h-px w-10 bg-line" />
              Titles are earned by clearing gates. Four so far.
            </motion.p>
          </div>

          {/* Player profile register */}
          <SystemWindow
            title="Player profile"
            right="Also"
            className="col-span-full md:col-span-10 md:col-start-2"
            bodyClassName="p-0 md:p-0"
          >
            <dl className="divide-y divide-line">
              {PROFILE.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-1 gap-2 px-5 py-4 sm:grid-cols-12 sm:gap-6 md:px-6"
                >
                  <dt className="hud text-mute sm:col-span-3 lg:col-span-2">{row.label}</dt>
                  <dd className="text-pretty leading-relaxed text-ice sm:col-span-9 lg:col-span-10">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </SystemWindow>

          {/* Closing line */}
          <motion.div
            variants={reveal}
            className="col-span-full md:col-span-8 md:col-start-2 lg:col-span-7"
          >
            <span aria-hidden="true" className="hud block text-sys">
              Independent build
            </span>
            <span aria-hidden="true" className="rule mt-3 block" />
            <p className="mt-6 max-w-[60ch] text-pretty leading-relaxed text-ice-2">
              I founded Inkmity because I wanted to see a thing of mine in the world,
              not in a repo. I pitched it to more than ten shops in person, sat down with
              a New York studio to hear how booking actually breaks for them, and set the
              pricing myself. I like making the thing and then taking it to the people it
              is for.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
