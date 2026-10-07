"use client";

import { motion } from "framer-motion";
import Gate from "./Gate";
import Seal from "./Seal";
import { reveal, stagger, VIEWPORT, wipe } from "../lib/motion";
import { siteConfig } from "../site";

const REGISTER = [
  { label: "GitHub", value: "github.com/swejasonzhang", href: siteConfig.socials.github },
  { label: "LinkedIn", value: "linkedin.com/in/swejasonzhang", href: siteConfig.socials.linkedin },
  { label: "Resume", value: "PDF", href: siteConfig.resume },
  { label: "Inkmity", value: "inkmity.com", href: siteConfig.inkmity },
];

/**
 * Gate VI: the last threshold. The email is the hero of the chapter; a ruled
 * register carries the other addresses; the seal signs the page off. The site
 * footer follows in the same component.
 */
export default function Closing() {
  return (
    <>
      <section
        id="contact"
        aria-labelledby="contact-title"
        className="relative isolate py-28 md:py-40"
      >
        <span
          aria-hidden="true"
          className="vertical absolute left-6 top-1/2 hidden -translate-y-1/2 font-mono text-2xs uppercase tracking-kicker text-ash lg:block"
        >
          VI — Contact
        </span>

        <div className="frame">
          <Gate id="contact-title" numeral="VI" title="Send word" kicker="Last gate" />

          <motion.div
            variants={stagger(0.12)}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            className="grid grid-cols-1 gap-y-14 md:grid-cols-12 md:gap-x-10 lg:gap-x-16"
          >
            {/* The address */}
            <div className="col-span-1 md:col-span-12 lg:col-span-8">
              <h3 className="sr-only">Email</h3>
              <motion.div variants={wipe}>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="link-rule inline-block max-w-full break-all py-2 font-serif text-display-lg text-washi"
                >
                  {siteConfig.email}
                </a>
              </motion.div>
              <motion.p
                variants={reveal}
                className="mt-6 font-mono text-2xs uppercase tracking-label text-ash"
              >
                {siteConfig.location} · open to software engineering internships and co-ops
              </motion.p>
            </div>

            {/* The register */}
            <div className="col-span-1 md:col-span-12 lg:col-span-4">
              <h3 className="sr-only">Elsewhere</h3>
              <motion.ul variants={reveal} className="font-mono text-sm">
                {REGISTER.map((row, i) => (
                  <li
                    key={row.label}
                    className={`flex items-baseline justify-between gap-6 border-t border-line py-3 ${
                      i === REGISTER.length - 1 ? "border-b" : ""
                    }`}
                  >
                    <span className="text-2xs uppercase tracking-label text-ash">{row.label}</span>
                    <a
                      href={row.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-rule min-h-[44px] break-all py-2 text-right text-washi"
                    >
                      {row.value}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </motion.ul>
            </div>

            {/* The signature */}
            <motion.div
              variants={reveal}
              className="col-span-1 flex items-end justify-end gap-5 md:col-span-12"
            >
              <span className="font-mono text-2xs uppercase tracking-label text-ash">
                Jason Zhang · MMXXVI
              </span>
              <Seal className="h-14 w-14 shrink-0" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <footer className="frame pb-10 pt-6">
        <div className="rule-double" aria-hidden="true" />
        <div className="mt-6 flex flex-wrap justify-between gap-4 font-mono text-2xs uppercase tracking-label text-ash">
          <span>© 2026 Jason Zhang</span>
          <span>Set in Instrument Serif, Geist and Geist Mono · Next.js</span>
          <span>Built with Claude Code, an AI coding agent.</span>
        </div>
      </footer>
    </>
  );
}
