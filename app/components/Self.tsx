"use client";

import { motion } from "framer-motion";
import BrushEdge from "./BrushEdge";
import Gate from "./Gate";
import Seal from "./Seal";
import { reveal, stagger, VIEWPORT, wipe } from "../lib/motion";
import { siteConfig } from "../site";

/**
 * Gate V — Self. The one paper ground on the site: the ink is lifted and the
 * page reads as an essay. Four sources, four qualities, each translated into a
 * habit that is actually visible in the work. No imagery of the tattoos
 * themselves; the translation is the point.
 */

const ENTRIES: { source: string; quality: string; body: string }[] = [
  {
    source: "Koi",
    quality: "movement",
    body:
      "An interface should move the way water does: continuous, directional, never in a hurry. In Inkmity that meant real-time chat between artist and client, and transitions that carry you from one state into the next instead of cutting between them. If something jerks, it is not finished.",
  },
  {
    source: "Hannya",
    quality: "intensity",
    body:
      "Intensity is control, not noise. Inkmity has a written product constitution with anti-goals, so the product knows what it refuses to become. Moderation fails closed. Features I pull are frozen behind flags rather than deleted, so nothing is lost and nothing leaks.",
  },
  {
    source: "Foo Dogs",
    quality: "guardians",
    body:
      "Some things stand at the door and do not move. Waivers are enforced on the client and on the server. Webhook signatures are verified. After a red job once shipped, deploys are gated on green CI, and a smoke test exercises the money path against Stripe's test API before a release goes out.",
  },
  {
    source: "Solo Leveling",
    quality: "progression",
    body:
      "You level by doing the next hard thing, not by waiting to be ready. College of Staten Island coursework, App Academy, a Headstarter fellowship, an internship at Series, a contract at Move Tact, then founding Inkmity. Now I am back in school finishing the degree while I keep shipping.",
  },
];

const NOTES: { key: string; body: string; current?: boolean }[] = [
  {
    key: "Also",
    body: "anime · games · visual storytelling · craftsmanship · experimentation",
  },
  {
    key: "Now",
    body: "Queens College (CUNY), evening classes, C++ · expected May 2029",
    current: true,
  },
  {
    key: "Open to",
    body: "software engineering internship or co-op · can start right away",
  },
  {
    key: "Method",
    body: "first version by hand; since June 2026 with Claude Code, an AI coding agent: I specify, test, approve",
  },
];

export default function Self() {
  return (
    <section
      id="self"
      aria-labelledby="self-title"
      className="paper relative isolate py-28 md:py-40"
    >
      {/* Paper tearing into the ink above and below. */}
      <BrushEdge className="absolute left-0 right-0 -top-6 text-washi md:-top-8" />
      <BrushEdge flip className="absolute left-0 right-0 -bottom-6 text-washi md:-bottom-8" />
      <div aria-hidden="true" className="grain-dark pointer-events-none absolute inset-0 opacity-[0.06]" />

      <span
        aria-hidden="true"
        className="vertical absolute left-6 top-1/2 hidden -translate-y-1/2 font-mono text-2xs uppercase tracking-kicker text-ash-2 lg:block"
      >
        V — Self
      </span>

      <div className="frame relative">
        <Gate id="self-title" numeral="V" title="Self" kicker="Beyond the code" tone="paper" />

        {/* Pull line */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="md:grid md:grid-cols-12 md:gap-x-8"
        >
          <p className="font-serif text-display-lg italic text-sumi text-balance md:col-span-10 md:col-start-2">
            <motion.span variants={wipe} className="block">
              The ink I carry is a set of instructions I keep choosing to follow.
            </motion.span>
          </p>
        </motion.div>

        {/* Essay body: entries on the left, marginalia on the right (lg). */}
        <div className="mt-20 md:mt-28 lg:grid lg:grid-cols-12 lg:gap-x-8">
          <motion.ol
            variants={stagger(0.12)}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            className="list-none lg:col-span-9"
          >
            {ENTRIES.map((e, i) => (
              <motion.li
                key={e.source}
                variants={reveal}
                className="border-t border-inkline py-8 last:border-b md:grid md:grid-cols-9 md:gap-x-8 md:py-10"
              >
                <h3 className="font-mono text-2xs uppercase tracking-label text-ash-2 md:col-span-3">
                  <span className="mr-3 text-ash">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-sumi">{e.source}</span>
                  {" — "}
                  {e.quality}
                </h3>
                <p className="mt-4 text-pretty text-base leading-relaxed text-sumi/85 md:col-span-6 md:col-start-4 md:mt-0 md:text-lg">
                  {e.body}
                </p>
              </motion.li>
            ))}
          </motion.ol>

          {/* Marginalia: sticky notes on lg, a ruled block after the entries below that. */}
          <motion.aside
            aria-label="Notes in the margin"
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            className="mt-16 lg:col-span-3 lg:col-start-10 lg:mt-0"
          >
            <ul className="list-none font-mono text-2xs uppercase tracking-label text-ash-2 lg:sticky lg:top-32">
              {NOTES.map((n) => (
                <li key={n.key} className="border-t border-inkline py-4 leading-relaxed last:border-b">
                  <span className="flex items-baseline gap-2 text-sumi">
                    {n.current && (
                      <span
                        aria-hidden="true"
                        className="inline-block h-1.5 w-1.5 shrink-0 translate-y-px bg-shu"
                      />
                    )}
                    {n.key}
                    <span aria-hidden="true"> —</span>
                  </span>
                  <span className="mt-1 block text-pretty">{n.body}</span>
                </li>
              ))}
            </ul>
          </motion.aside>
        </div>

        {/* Close: independent building, signed. */}
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="mt-20 md:mt-28 md:grid md:grid-cols-12 md:gap-x-8"
        >
          <div className="md:col-span-7 md:col-start-5">
            <h3 className="font-mono text-2xs uppercase tracking-label text-ash-2">Independent</h3>
            <p className="mt-4 text-pretty text-base leading-relaxed text-sumi/85 md:text-lg">
              I like making the thing and then taking it to the people it is for. I founded{" "}
              <a
                href={siteConfig.inkmity}
                target="_blank"
                rel="noopener noreferrer"
                className="link-rule text-sumi"
              >
                Inkmity
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              , pitched it to more than ten shops in person, interviewed a New York studio, and set the
              pricing myself. The first version was built by hand. Since June 2026 I build with Claude
              Code, an AI coding agent; I still write the spec, test by hand in the live app, and approve
              every release.
              <Seal className="ml-3 inline-block h-10 w-10 align-middle" />
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
