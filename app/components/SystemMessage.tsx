"use client";

import { motion } from "framer-motion";
import { reveal, rise, stagger, VIEWPORT } from "../lib/motion";
import { siteConfig } from "../site";
import GateHeader from "./GateHeader";
import RankMark from "./RankMark";
import SystemWindow from "./SystemWindow";

const CHANNELS = [
  { label: "GitHub", value: "github.com/swejasonzhang", href: siteConfig.socials.github },
  { label: "LinkedIn", value: "linkedin.com/in/swejasonzhang", href: siteConfig.socials.linkedin },
  { label: "Inkmity", value: "inkmity.com", href: siteConfig.inkmity },
  { label: "X", value: siteConfig.twitterHandle, href: siteConfig.socials.x },
] as const;

const NEW_TAB = (
  <span className="sr-only"> (opens in a new tab)</span>
);

/**
 * Gate 05 — Message. The last gate: a System notification carrying the email,
 * a channel register, and the closing line. The site footer follows.
 */
export default function SystemMessage() {
  const mailto = `mailto:${siteConfig.email}`;

  return (
    <>
      <section
        id="contact"
        aria-labelledby="contact-title"
        className="relative isolate overflow-hidden py-24 md:py-36"
      >
        <RankMark letter="05" className="-right-[4vw] -top-4" />
        <div aria-hidden="true" className="pool-sys pointer-events-none absolute inset-0 -z-10" />
        <span
          aria-hidden="true"
          className="vertical hud absolute left-6 top-1/2 hidden -translate-y-1/2 text-mute lg:block"
        >
          Gate 05 — Message
        </span>

        <div className="frame">
          <GateHeader id="contact-title" gate="05" status="Last gate" title="Send a message" />

          <motion.div
            variants={stagger(0.12)}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8"
          >
            <SystemWindow title="Notification" right="Open" className="col-span-1 md:col-span-12 lg:col-span-7">
              <p className="hud text-mute">
                To: {siteConfig.name} · {siteConfig.location}
              </p>
              <h3 className="mt-6">
                <a
                  href={mailto}
                  className="link-sys inline-block break-words font-display text-display-md sm:text-display-lg uppercase text-ice"
                >
                  {siteConfig.email}
                </a>
              </h3>
              <p className="mt-6 max-w-[48ch] text-pretty text-ice-2">
                Open to software engineering internships and co-ops. Can start right away.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={mailto} className="btn-sys">
                  Send email
                </a>
                <a
                  href={siteConfig.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost"
                >
                  Resume — PDF ↗{NEW_TAB}
                </a>
              </div>
            </SystemWindow>

            <SystemWindow
              title="Channels"
              className="col-span-1 md:col-span-12 lg:col-span-5"
              bodyClassName="p-0 md:p-0"
            >
              <dl className="divide-y divide-line">
                {CHANNELS.map((c) => (
                  <div
                    key={c.label}
                    className="flex min-h-[44px] flex-wrap items-center justify-between gap-x-6 gap-y-1 px-5 py-3.5 md:px-6"
                  >
                    <dt className="hud text-mute">{c.label}</dt>
                    <dd className="min-w-0 text-right">
                      <a
                        href={c.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-sys break-words text-ice"
                      >
                        {c.value}
                        {NEW_TAB}
                      </a>
                    </dd>
                  </div>
                ))}
              </dl>
            </SystemWindow>
          </motion.div>

          <motion.div
            variants={stagger(0.15)}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            className="mt-20 md:mt-28"
          >
            <p className="font-display text-display-lg uppercase text-ice">
              <motion.span variants={rise} className="block">
                Gate 05 cleared.
              </motion.span>
            </p>
            <motion.p variants={reveal} className="hud mt-4 text-mute">
              Thanks for reading all the way down.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <footer className="frame pb-10 pt-6">
        <span aria-hidden="true" className="rule-glow block w-full" />
        <div className="hud mt-6 flex flex-wrap justify-between gap-x-8 gap-y-3 text-mute">
          <span>© 2026 {siteConfig.name}</span>
          <span>Set in Barlow Condensed, Geist and Geist Mono · Next.js</span>
          <span>Built with Claude Code, an AI coding agent.</span>
        </div>
      </footer>
    </>
  );
}
