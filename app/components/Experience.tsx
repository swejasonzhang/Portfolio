"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import SectionHeading from "./SectionHeading";
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
    year: "Jul 2025 – Present",
    title: "Full-Stack Developer",
    kind: "Independent",
    company: "Personal Projects",
    description:
      "Shipping full-stack apps end to end, with a focus on system design and AI integrations.",
    details: [
      "Full-stack MERN projects built and deployed, this portfolio included",
      "Continuous learning through hands-on builds, Coursera courses and hackathons",
    ],
  },
  {
    year: "Jul 2025 – Aug 2025",
    title: "Software Engineer",
    kind: "Intern",
    company: "Leechy",
    description: "Wired Kotlin and iOS clients to backend endpoints with secure auth.",
    details: [
      "JWT authentication and role-based authorization for iOS clients",
      "Backend API integration for Kotlin mobile apps",
      "Reliable mobile-to-backend communication across platforms",
    ],
  },
  {
    year: "Mar 2025 – Jul 2025",
    title: "Software Engineer",
    kind: "Contract",
    company: "Move Tact Management",
    description: "Automated internal workflows and integrated third-party APIs.",
    details: [
      "Python scripts for data processing and reporting",
      "Slack, Twitch, Stripe and Chartmetric API integrations for ops automation",
      "Small projects deployed on Vercel and tested against existing systems",
    ],
  },
  {
    year: "Feb 2025 – Mar 2025",
    title: "Software Engineer",
    kind: "Trial Period",
    company: "Move Tact Management",
    description: "Built internal tools and automated repetitive workflows.",
    details: [
      "Scripts automating data exports and report generation",
      "Streamlined workflows, cutting manual effort and errors",
      "Integrated cleanly with the team's existing systems",
    ],
  },
  {
    year: "Nov 2024 – Feb 2025",
    title: "Software Engineer",
    kind: "Intern",
    company: "Series",
    description: "Built backend APIs and tightened CI/CD for faster, safer deploys.",
    details: [
      "Node.js + Firebase APIs for internal and client-facing services",
      "OpenAI and Twilio integrations for richer user interactions",
      "CI/CD optimizations that sped up deployment and cut downtime",
    ],
  },
  {
    year: "Jul 2024 – Oct 2024",
    title: "Software Engineer",
    kind: "Intern",
    company: "Headstarter AI",
    description: "Built AI-powered SaaS products, including mental-health support tools.",
    details: [
      "AI support agents with OpenAI + Pinecone semantic search",
      "Full-stack React/Node SaaS products",
      "Agile team delivery of production-ready features",
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
      className="relative block h-[320px] w-full text-left [perspective:1200px]"
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

  // Mouse drag-to-scroll state
  const dragRef = useRef<{ startX: number; scrollLeft: number; pointerId: number } | null>(null);
  const draggedRef = useRef(false);

  function onPointerDown(e: React.PointerEvent<HTMLUListElement>) {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = trackRef.current;
    if (!el) return;
    dragRef.current = { startX: e.clientX, scrollLeft: el.scrollLeft, pointerId: e.pointerId };
    draggedRef.current = false;
    el.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent<HTMLUListElement>) {
    const drag = dragRef.current;
    const el = trackRef.current;
    if (!drag || !el || e.pointerType !== "mouse") return;
    const dx = e.clientX - drag.startX;
    if (Math.abs(dx) > 6) draggedRef.current = true;
    el.scrollLeft = drag.scrollLeft - dx;
  }

  function endDrag(e: React.PointerEvent<HTMLUListElement>) {
    const drag = dragRef.current;
    const el = trackRef.current;
    if (!drag || !el) return;
    if (el.hasPointerCapture(drag.pointerId)) el.releasePointerCapture(drag.pointerId);
    dragRef.current = null;
    // Ignore the click that follows a drag; clear the flag on the next tick.
    if (draggedRef.current) setTimeout(() => (draggedRef.current = false), 0);
    void e;
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
    <section id="experience" aria-labelledby="experience-title" className="py-24 md:py-32">
      <div className="container-ink">
        <SectionHeading
          id="experience-title"
          no="02"
          kicker="Where I've worked"
          title="Experience"
          hint="Scroll or drag — open a card for highlights"
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
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="hide-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 pt-2 cursor-grab active:cursor-grabbing"
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
