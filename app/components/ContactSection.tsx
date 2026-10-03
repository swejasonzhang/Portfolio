"use client";

import { motion } from "framer-motion";
import MagneticButton from "./MagneticButton";
import SectionHeading from "./SectionHeading";
import TiltCard from "./TiltCard";
import Backdrop from "./Backdrop";
import { reveal, stagger, VIEWPORT } from "../lib/motion";
import { siteConfig } from "../site";

const meta: { label: string; value: string; href?: string; external?: boolean }[] = [
  { label: "Location", value: siteConfig.location },
  { label: "Resume", value: "PDF", href: siteConfig.resume, external: true },
  { label: "GitHub", value: "@swejasonzhang", href: siteConfig.socials.github, external: true },
  { label: "LinkedIn", value: "/in/swejasonzhang", href: siteConfig.socials.linkedin, external: true },
  { label: "X", value: "@swejasonzhang", href: siteConfig.socials.x, external: true },
];

const linkClass = "ink-underline text-gray-300 transition-colors hover:text-white";

export default function ContactSection() {
  const mailto = `mailto:${siteConfig.email}`;

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative isolate py-24 md:py-32">
      <Backdrop variant="floor" />
      <div className="container-ink">
        <TiltCard max={2} className="flash-frame p-7 sm:p-10 md:p-14 lg:p-16">
          <motion.div
            variants={stagger(0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            className="lg:grid lg:grid-cols-[1.4fr_1fr] lg:gap-16"
          >
            <div>
              <SectionHeading
                id="contact-title"
                no="06"
                kicker="Contact · New York"
                title="Let's build something worth building"
                align="left"
                className="mb-8"
              />
              <motion.p
                variants={reveal}
                className="max-w-[44ch] text-pretty text-base leading-relaxed text-gray-400 md:text-lg"
              >
                Hiring an intern or co-op? I can start right away. My inbox is
                open &mdash; tell me what you&apos;re working on.
              </motion.p>
              <motion.div variants={reveal}>
                <a
                  href={mailto}
                  className="ink-underline mt-8 inline-block break-all font-display text-display-md text-white md:text-display-lg"
                >
                  {siteConfig.email}
                </a>
              </motion.div>
            </div>

            <div className="mt-10 flex flex-col justify-between gap-10 lg:mt-0">
              <motion.ul
                variants={reveal}
                className="space-y-4 font-mono text-2xs uppercase tracking-label text-gray-400"
              >
                {meta.map((m) => (
                  <li key={m.label} className="flex items-baseline gap-3">
                    <span className="whitespace-nowrap">{m.label}</span>
                    <span aria-hidden="true" className="h-px flex-1 translate-y-[-3px] bg-line" />
                    {m.href ? (
                      <a
                        href={m.href}
                        className={`${linkClass} whitespace-nowrap`}
                        {...(m.external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        {m.value}
                        {m.external && (
                          <span className="sr-only"> (opens in a new tab)</span>
                        )}
                      </a>
                    ) : (
                      <span className="whitespace-nowrap text-gray-300">{m.value}</span>
                    )}
                  </li>
                ))}
              </motion.ul>

              <motion.div
                variants={reveal}
                className="flex flex-col gap-3 sm:flex-row lg:flex-col"
              >
                <MagneticButton href={mailto} variant="yang" size="lg">
                  Email me
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="5" width="18" height="14" />
                    <path d="M3 7l9 6 9-6" />
                  </svg>
                </MagneticButton>
                <MagneticButton
                  href={siteConfig.resume}
                  target="_blank"
                  variant="yin"
                  size="lg"
                >
                  Resume &mdash; PDF
                </MagneticButton>
              </motion.div>
            </div>
          </motion.div>
        </TiltCard>
      </div>
    </section>
  );
}
