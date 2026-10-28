"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Magnetic from "./Magnetic";
import SectionHeader from "./SectionHeader";
import { reveal, rise, stagger, VIEWPORT } from "../lib/motion";
import { useLevel } from "../lib/level";
import { siteConfig } from "../site";

const NEW_TAB = <span className="sr-only"> (opens in a new tab)</span>;

const CHANNELS = [
  { label: "GitHub", value: "github.com/swejasonzhang", href: siteConfig.socials.github },
  { label: "LinkedIn", value: "linkedin.com/in/swejasonzhang", href: siteConfig.socials.linkedin },
  { label: "Inkmity", value: "inkmity.com", href: siteConfig.inkmity },
  { label: "X", value: siteConfig.twitterHandle, href: siteConfig.socials.x },
] as const;

/**
 * Gate 04 — the next gate. The scene turns the figure toward the open rift
 * while this section is on screen; the page ends on the one thing to do next.
 */
export default function Contact() {
  const level = useLevel();
  const [copied, setCopied] = useState(false);
  const mailto = `mailto:${siteConfig.email}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      window.location.href = mailto;
    }
  };

  return (
    <>
      <section id="contact" aria-labelledby="contact-title" className="gate-cyan relative isolate flex min-h-[100svh] flex-col justify-center py-28 md:py-40">
        <div className="frame">
          <SectionHeader index={4} id="contact-title" title="Contact" />

          <motion.div variants={stagger(0.14)} initial="hidden" whileInView="visible" viewport={VIEWPORT} className="mt-12 grid gap-12 lg:grid-cols-12">
            <div className="scrim -mx-6 px-6 py-4 lg:col-span-7">
              <motion.p variants={reveal} className="text-pretty text-2xl leading-snug text-ice md:text-3xl">
                Hiring a software engineering intern or co-op? I can start right away, and I&rsquo;m applying for Summer 2027 too.
              </motion.p>
              <h3 className="mt-10">
                <motion.a variants={rise} href={mailto} className="link-sys inline-block max-w-full break-all font-display text-[clamp(1.6rem,0.6rem+3vw,3.4rem)] font-bold leading-tight text-ice sm:break-normal">
                  {siteConfig.email}
                </motion.a>
              </h3>
              <motion.div variants={reveal} className="mt-10 flex flex-wrap items-center gap-3">
                <Magnetic>
                  <a href={mailto} className="btn-sys">
                    Send an email
                  </a>
                </Magnetic>
                <button type="button" onClick={copy} className="btn-ghost" aria-live="polite">
                  {copied ? "Copied ✓" : "Copy email"}
                </button>
                <a href={siteConfig.resume} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                  Résumé ↗{NEW_TAB}
                </a>
              </motion.div>
            </div>

            <motion.dl variants={reveal} className="self-end border-t border-line lg:col-span-4 lg:col-start-9">
              {CHANNELS.map((c) => (
                <div key={c.label} className="flex min-h-[52px] flex-wrap items-center justify-between gap-x-6 gap-y-1 border-b border-line py-3">
                  <dt className="hud text-mute">{c.label}</dt>
                  <dd className="min-w-0">
                    <a href={c.href} target="_blank" rel="noopener noreferrer" className="link-sys break-words text-ice">
                      {c.value}
                      {NEW_TAB}
                    </a>
                  </dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>

          <motion.div variants={stagger(0.2)} initial="hidden" whileInView="visible" viewport={VIEWPORT} className="mt-24 md:mt-32">
            <motion.div variants={reveal} className="chamfer inline-flex flex-col gap-1 border border-[rgba(var(--gate-rgb),0.45)] bg-panel/80 px-5 py-4 shadow-[0_0_30px_rgba(var(--gate-rgb),0.15)]">
              <span className="hud text-[var(--gate)]">[System]</span>
              <span className="display text-2xl tracking-wide text-ice">All gates cleared · LV {level}</span>
              <span className="text-sm text-ice-2">The next one opens with a message.</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <footer className="frame pb-10">
        <span aria-hidden="true" className="rule-glow block w-full" />
        <div className="hud mt-6 flex flex-wrap justify-between gap-x-8 gap-y-3 text-mute">
          <span>© 2026 {siteConfig.name}</span>
          <span>Scene: a hand-written WebGL shader · Barlow · Next.js</span>
          <span>Built with Claude Code, an AI coding agent.</span>
        </div>
      </footer>
    </>
  );
}
