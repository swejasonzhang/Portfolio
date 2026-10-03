"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import SectionHeading from "./SectionHeading";
import Backdrop from "./Backdrop";
import { reveal, stagger, VIEWPORT } from "../lib/motion";

type Role = {
  year: string;
  title: string;
  kind: string;
  company: string;
  description: string;
  details: string[];
};

const ROLES: Role[] = [
  {
    year: "Aug 2025 – Present",
    title: "Founder & Software Developer",
    kind: "Self-employed",
    company: "Inkmity",
    description:
      "Founded and launched an early-stage booking app for tattoo artists, live since July 2026.",
    details: [
      "Built the first version myself, Aug 2025 – Jan 2026",
      "Since June 2026: built with Claude Code, an AI coding agent; I test and approve every release",
      "Deploy and run it on Render and Vercel",
    ],
  },
  {
    year: "Feb 2025 – Jul 2025",
    title: "Software Engineer",
    kind: "Contract",
    company: "Move Tact Management",
    description:
      "Wrote Python scripts that pull social media metrics into Google Sheets for a 10+ person marketing team.",
    details: [
      "Sole author of 19 Python scripts across 108 commits",
      "TikTok, Instagram and YouTube metrics from the Ensemble Data and Chartmetric APIs",
      "Slack notifications, plus a small Node.js, Express and React web app",
    ],
  },
  {
    year: "Nov 2024 – Feb 2025",
    title: "Software Engineer Intern",
    kind: "Internship",
    company: "Series",
    description:
      "Built backend endpoints and Twilio integrations on a 3-person engineering team with the CTO.",
    details: [
      "Opened 50+ pull requests, working through code review",
      "Node.js and Firebase backend endpoints",
      "Twilio integrations for Vera, the company's communications bot",
    ],
  },
  {
    year: "Jul 2024 – Oct 2024",
    title: "Software Engineering Fellow",
    kind: "Fellowship",
    company: "Headstarter AI",
    description: "Built team projects with Next.js, React, Clerk and Vercel.",
    details: [
      "ProfScore: the professor search page and its API route",
      "Calmify: the first Stripe Checkout route, Clerk setup and OpenAI flashcard prompt",
      "Calmify's landing page and flashcard flip and swipe UI",
    ],
  },
];

const TOTAL = String(ROLES.length).padStart(2, "0");
const COLUMN_PAD = "max(1.25rem, calc((100vw - 72rem) / 2 + 2rem))";

function Square({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`h-1 w-1 shrink-0 rotate-45 bg-current ${className}`} />;
}

function RoleCard({
  role,
  index,
  flipped,
  onFlip,
}: {
  role: Role;
  index: number;
  flipped: boolean;
  onFlip: () => void;
}) {
  const id = `experience-highlights-${index + 1}`;
  const no = `0${index + 1}`;

  return (
    <button
      type="button"
      aria-expanded={flipped}
      aria-controls={id}
      onClick={onFlip}
      data-cursor="flip"
      className="relative block h-[320px] w-full cursor-pointer text-left [perspective:1200px]"
    >
      <div
        className={`preserve-3d relative h-full w-full transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Front */}
        <div
          aria-hidden={flipped}
          className="flash-frame backface-hidden absolute inset-0 flex flex-col p-6"
        >
          <div className="flex flex-wrap justify-between gap-x-3 gap-y-1 font-mono text-2xs uppercase tracking-label tabular-nums text-gray-400">
            <span className="whitespace-nowrap">
              Nº {no} <span className="text-gray-500">/ {TOTAL}</span>
            </span>
            <span className="whitespace-nowrap">{role.year}</span>
          </div>
          <h3 className="mt-4 font-display text-display-md text-white">{role.title}</h3>
          <span className="mt-2 inline-block w-fit rounded-sm border border-line px-1.5 py-0.5 font-mono text-2xs uppercase tracking-label text-gray-400">
            {role.kind}
          </span>
          <p className="mt-2 text-sm font-medium text-gray-200">{role.company}</p>
          <p className="mt-3 text-[15px] leading-relaxed text-gray-400">{role.description}</p>
          <div className="mt-auto flex items-center gap-2 pt-3 font-mono text-2xs uppercase tracking-label text-gray-300">
            <Square />
            <span>Flip for highlights</span>
          </div>
        </div>

        {/* Back */}
        <div
          id={id}
          aria-hidden={!flipped}
          className="flash-frame backface-hidden absolute inset-0 flex flex-col p-6 [transform:rotateY(180deg)] [--plate:#0a0a0a]"
        >
          <p className="font-mono text-2xs uppercase tracking-label tabular-nums text-gray-400">
            {role.company} · {role.year}
          </p>
          <p className="mt-2 font-display text-display-sm text-white">Highlights</p>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-gray-400">
            {role.details.map((d) => (
              <li key={d} className="flex items-start gap-2.5">
                <Square className="mt-2 bg-white" />
                <span>{d}</span>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex items-center gap-2 pt-3 font-mono text-2xs uppercase tracking-label text-gray-300">
            <Square />
            <span>Flip back</span>
          </div>
        </div>
      </div>
    </button>
  );
}

export default function Experience() {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLUListElement>(null);
  const [flipped, setFlipped] = useState<number | null>(null);

  // Mouse drag-to-scroll. No pointer capture: capturing on the list would
  // redirect the click to the list and the card buttons would never flip.
  const draggedRef = useRef(false);

  function onPointerDown(e: React.PointerEvent<HTMLUListElement>) {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = trackRef.current;
    if (!el) return;
    const startX = e.clientX;
    const startLeft = el.scrollLeft;
    draggedRef.current = false;

    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      if (Math.abs(dx) > 6) draggedRef.current = true;
      el.scrollLeft = startLeft - dx;
    };
    const end = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
      // The click fires right after pointerup; clear the flag on the next tick.
      if (draggedRef.current) setTimeout(() => (draggedRef.current = false), 0);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
  }

  function handleFlip(i: number) {
    if (draggedRef.current) return;
    setFlipped((cur) => (cur === i ? null : i));
  }

  function scrollByCard(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    const first = el.querySelector("li");
    const step = (first?.getBoundingClientRect().width ?? 300) + 24;
    el.scrollBy({ left: dir * step, behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <section id="experience" aria-labelledby="experience-title" className="relative isolate py-24 md:py-32">
      <Backdrop variant="hatch" />
      <div className="container-ink">
        <SectionHeading
          id="experience-title"
          no="02"
          kicker="Where I've worked"
          title="Experience"
          hint="Scroll or drag — click a card to flip it"
        />
      </div>

      <div className="bleed mask-fade-x">
        <motion.ul
          ref={trackRef}
          role="list"
          aria-label="Experience timeline"
          tabIndex={0}
          data-cursor="drag"
          variants={stagger(0.06)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          onPointerDown={onPointerDown}
          className="hide-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 pt-2 select-none cursor-grab active:cursor-grabbing"
          style={{
            paddingLeft: COLUMN_PAD,
            paddingRight: "2rem",
            scrollPaddingLeft: COLUMN_PAD,
          }}
        >
          {ROLES.map((role, i) => (
            <motion.li
              key={`${role.company}-${role.year}`}
              variants={reveal}
              className="w-[min(300px,calc(100vw-2.5rem))] shrink-0 snap-start"
            >
              <RoleCard role={role} index={i} flipped={flipped === i} onFlip={() => handleFlip(i)} />
            </motion.li>
          ))}
        </motion.ul>
      </div>

      <div className="container-ink">
        <div className="mt-6 flex items-center justify-between">
          <p className="font-mono text-2xs uppercase tracking-label tabular-nums text-gray-400">
            {TOTAL} roles · 2024 – present
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous"
              onClick={() => scrollByCard(-1)}
              className="flash-frame relative flex h-11 w-11 items-center justify-center text-white transition-colors hover:bg-white hover:text-black"
            >
              <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M10 2 4 8l6 6" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => scrollByCard(1)}
              className="flash-frame relative flex h-11 w-11 items-center justify-center text-white transition-colors hover:bg-white hover:text-black"
            >
              <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="m6 2 6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
