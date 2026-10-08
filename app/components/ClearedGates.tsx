"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useEffect, useId, useState, type PointerEvent as ReactPointerEvent } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import GateHeader from "./GateHeader";
import RankMark from "./RankMark";
import SystemWindow from "./SystemWindow";
import { DUR, EASE_OUT, reveal, stagger, VIEWPORT } from "../lib/motion";

/* ------------------------------------------------------------------ */
/* Data: Jason's own write-ups, verbatim                               */
/* ------------------------------------------------------------------ */

type Aspect = "2/1" | "4/3";

type Gate = {
  slug: string;
  title: string;
  kind: string;
  year: string;
  description: string;
  details?: string[];
  tech: string[];
  live?: string;
  github: string;
  image: string;
  aspect: Aspect;
  featured?: boolean;
};

const GATES: Gate[] = [
  {
    slug: "amazeon",
    title: "Amazeon",
    kind: "Online store",
    year: "2023 – 24 · 2026",
    description:
      "My solo App Academy capstone: an online store with a product catalog, search, customer reviews, a cart and a checkout.",
    details: [
      "Built the original myself across 167 commits, Nov 2023 – Jul 2024; the checkout reduces each product's stock on purchase",
      "In July 2026 I modernised the public repo with an AI coding agent; those commits come after the original build in the history",
    ],
    tech: ["Ruby on Rails", "PostgreSQL", "React", "Redux"],
    github: "https://github.com/swejasonzhang/FullStack",
    image: "/assets/Amazeon.jpg",
    aspect: "2/1",
    featured: true,
  },
  {
    slug: "bonjour-world",
    title: "Bonjour World",
    kind: "Team project",
    year: "2023",
    description:
      "A platform for hosting and finding language exchange events, built by a four-person App Academy team.",
    details: [
      "My part, across 15 pull requests I opened and merged: Google Places address autocomplete, profile image upload, search and the attendee list",
      "Teammates wrote the translation and sign-in code",
    ],
    tech: ["MongoDB", "Express", "React", "Node.js", "Google Places"],
    live: "https://bonjourworld.onrender.com/",
    github: "https://github.com/yuris1234/Bonjour-World",
    image: "/assets/BonjourWorld.jpg",
    aspect: "2/1",
    featured: true,
  },
  {
    slug: "battlefield-tanks",
    title: "Battlefield: Tanks",
    kind: "Canvas game",
    year: "2023 · 2026",
    description:
      "A turn-based tank artillery game in vanilla JavaScript on the Canvas API. I first built it in October 2023 as my App Academy JavaScript project, then rebuilt it in July 2026 with an AI coding agent.",
    tech: ["JavaScript", "HTML5 Canvas"],
    live: "https://swejasonzhang.github.io/Battlefield-Tanks/",
    github: "https://github.com/swejasonzhang/Battlefield-Tanks",
    image: "/assets/BattlefieldTanks.jpg",
    aspect: "4/3",
  },
  {
    slug: "second-brain",
    title: "Second Brain",
    kind: "Notes app",
    year: "2026",
    description:
      "A notes app with AI search and chat over your own notes. I built it in one evening in July 2026 with an AI coding agent, as a portfolio project.",
    tech: ["Next.js", "TypeScript", "PostgreSQL", "Clerk"],
    live: "https://second-brain-ai-knowledge-base.vercel.app",
    github: "https://github.com/swejasonzhang/SecondBrain",
    image: "/assets/SecondBrain.jpg",
    aspect: "4/3",
  },
  {
    slug: "calmify",
    title: "Calmify",
    kind: "Team project",
    year: "2024",
    description:
      "A team app from the Headstarter fellowship that offers emotional support through AI-generated flashcards. I added the first Stripe Checkout route, the Clerk setup and the first OpenAI flashcard prompt, then built the landing page and the flashcard flip and swipe UI.",
    tech: ["Next.js", "React", "Clerk", "Stripe", "OpenAI"],
    live: "https://calmify-ten.vercel.app/",
    github: "https://github.com/pc9350/Calmify",
    image: "/assets/Calmify.jpg",
    aspect: "2/1",
  },
  {
    slug: "profscore",
    title: "ProfScore",
    kind: "Team project",
    year: "2024",
    description:
      "A Rate My Professor app built by a three-person team in the Headstarter fellowship. I built the professor search page and its API route, which de-duplicates results and sorts them by rating; a teammate built the AI recommendation pipeline behind it.",
    tech: ["Next.js", "React"],
    live: "https://profscore-beta.vercel.app/",
    github: "https://github.com/pc9350/Rate-my-professor",
    image: "/assets/ProfScore.jpg",
    aspect: "2/1",
  },
];

const ASPECT_CLASS: Record<Aspect, string> = {
  "2/1": "aspect-[2/1]",
  "4/3": "aspect-[4/3]",
};

/** Split a write-up into its first sentence and the rest. */
function splitLead(text: string): [string, string] {
  const i = text.indexOf(". ");
  if (i === -1) return [text, ""];
  return [text.slice(0, i + 1), text.slice(i + 2)];
}

const PREVIEW_W = 352; // 22rem
const PREVIEW_H = PREVIEW_W / 2;
const PREVIEW_OFFSET = 24;
const PREVIEW_MARGIN = 16;

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function ClearedGates() {
  const [open, setOpen] = useState<string | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [canHover, setCanHover] = useState(false);
  const reduced = useReducedMotion();
  const previewEnabled = canHover && !reduced;

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 320, damping: 32, mass: 0.6 });
  const y = useSpring(rawY, { stiffness: 320, damping: 32, mass: 0.6 });

  // First gate open by default on large screens only.
  useEffect(() => {
    if (window.matchMedia("(min-width: 1024px)").matches) {
      setOpen(GATES[0].slug);
    }
  }, []);

  // The hover preview only exists for a real pointer.
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setCanHover(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  /** Place the preview beside the pointer, flipping near the viewport edges. */
  const track = (e: ReactPointerEvent, jump = false) => {
    if (!previewEnabled) return;
    let nx = e.clientX + PREVIEW_OFFSET;
    let ny = e.clientY + PREVIEW_OFFSET;
    if (nx + PREVIEW_W > window.innerWidth - PREVIEW_MARGIN) {
      nx = e.clientX - PREVIEW_OFFSET - PREVIEW_W;
    }
    if (ny + PREVIEW_H > window.innerHeight - PREVIEW_MARGIN) {
      ny = e.clientY - PREVIEW_OFFSET - PREVIEW_H;
    }
    if (jump) {
      rawX.jump(nx);
      rawY.jump(ny);
      x.jump(nx);
      y.jump(ny);
    } else {
      rawX.set(nx);
      rawY.set(ny);
    }
  };

  const toggle = (slug: string) => setOpen((cur) => (cur === slug ? null : slug));

  return (
    <section
      id="works"
      aria-labelledby="works-title"
      className="relative isolate overflow-hidden py-24 md:py-36"
    >
      <RankMark letter="02" className="-left-[4vw] bottom-0" />
      <span
        aria-hidden="true"
        className="vertical hud absolute left-6 top-1/2 hidden -translate-y-1/2 text-mute lg:block"
      >
        Gate 02 — Cleared gates
      </span>

      <div className="frame">
        <GateHeader
          id="works-title"
          gate="02"
          status="Six builds · 2023 – 2026"
          title="Cleared gates"
          subtitle="Everything here is live or public, and each write-up says exactly what I built and when."
        />

        {/* Board column headings */}
        <div
          aria-hidden="true"
          className="hidden grid-cols-12 gap-6 pb-3 hud text-mute md:grid"
        >
          <span className="col-span-1">No.</span>
          <span className="col-span-5">Gate</span>
          <span className="col-span-2">Type</span>
          <span className="col-span-2">Year</span>
          <span className="col-span-2 text-right">Status</span>
        </div>

        <motion.ol
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="border-b border-line"
        >
          {GATES.map((gate, i) => (
            <GateRow
              key={gate.slug}
              gate={gate}
              index={i}
              open={open === gate.slug}
              onToggle={() => toggle(gate.slug)}
              onPointerEnter={(e) => {
                setHovered(i);
                track(e, true);
              }}
              onPointerMove={(e) => track(e)}
              onPointerLeave={() => setHovered(null)}
            />
          ))}
        </motion.ol>

        <p className="mt-12 flex items-center gap-4 hud text-mute md:mt-16">
          <span aria-hidden="true" className="h-px w-10 bg-line" />
          <a href="#inkmity" className="link-sys text-sys">
            The S-Rank gate is Gate 01 →
          </a>
        </p>
      </div>

      {/* Pointer-following capture preview, desktop only */}
      {previewEnabled &&
        createPortal(
          <AnimatePresence>
            {hovered !== null && (
              <motion.div
                aria-hidden="true"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: DUR.fast, ease: EASE_OUT }}
                style={{ x, y }}
                className="pointer-events-none fixed left-0 top-0 z-40 aspect-[2/1] w-[22rem] overflow-hidden border border-line bg-void-2 shadow-glow"
              >
                {GATES.map((gate, i) => (
                  <Image
                    key={gate.slug}
                    src={gate.image}
                    alt=""
                    fill
                    sizes="352px"
                    className={`object-cover transition-opacity duration-300 ${
                      hovered === i ? "opacity-100" : "opacity-0"
                    }`}
                  />
                ))}
                <span className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-line bg-void/80 px-3 py-1.5 hud text-sys backdrop-blur-sm">
                  <span>Capture</span>
                  <span className="text-mute">
                    G-{String((hovered ?? 0) + 1).padStart(2, "0")} · {GATES[hovered ?? 0].title}
                  </span>
                </span>
                <span aria-hidden="true" className="absolute -left-px -top-px h-3 w-3 border-l-2 border-t-2 border-sys-bright" />
                <span aria-hidden="true" className="absolute -right-px -top-px h-3 w-3 border-r-2 border-t-2 border-sys-bright" />
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Row                                                                 */
/* ------------------------------------------------------------------ */

function GateRow({
  gate,
  index,
  open,
  onToggle,
  onPointerEnter,
  onPointerMove,
  onPointerLeave,
}: {
  gate: Gate;
  index: number;
  open: boolean;
  onToggle: () => void;
  onPointerEnter: (e: ReactPointerEvent) => void;
  onPointerMove: (e: ReactPointerEvent) => void;
  onPointerLeave: () => void;
}) {
  const panelId = `works-${gate.slug}`;
  const buttonId = useId();
  const number = `G-${String(index + 1).padStart(2, "0")}`;
  const [lead, rest] = splitLead(gate.description);

  return (
    <motion.li variants={reveal} className="group relative border-t border-line">
      {/* Hover rule: lights up along the top of the row */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-sys transition-transform duration-500 ease-out group-hover:scale-x-100"
      />

      <h3 onPointerEnter={onPointerEnter} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="grid w-full grid-cols-2 items-center gap-x-6 gap-y-3 py-6 text-left md:grid-cols-12 md:gap-6"
        >
          <span className="order-1 hud text-sys md:col-span-1">{number}</span>

          <span
            className={`order-3 col-span-2 font-display text-display-md uppercase text-ice transition-[text-shadow] duration-300 group-hover:glow-text md:order-2 md:col-span-5 ${
              gate.featured ? "md:text-display-lg" : ""
            } ${open ? "glow-text" : ""}`}
          >
            {gate.title}
          </span>

          <span className="order-4 hud text-mute md:order-3 md:col-span-2">{gate.kind}</span>

          <span className="order-5 hud text-right text-mute md:order-4 md:col-span-2 md:text-left">
            {gate.year}
          </span>

          <span
            className={`order-2 flex items-center justify-end gap-3 hud md:order-5 md:col-span-2 ${
              open ? "text-sys" : "text-mute"
            }`}
          >
            <span>Cleared</span>
            <span
              aria-hidden="true"
              className={`h-2 w-2 rotate-45 bg-sys transition-shadow duration-300 ${
                open ? "shadow-glow-strong" : ""
              }`}
            />
          </span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="panel"
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: DUR.base, ease: EASE_OUT }}
            className="overflow-hidden"
          >
            <div className="grid gap-8 pb-10 md:grid-cols-12 md:gap-10">
              {/* Inline capture, below lg (the hover preview covers lg+) */}
              <figure className="md:col-span-12 lg:hidden">
                <div className={`relative border border-line ${ASPECT_CLASS[gate.aspect]}`}>
                  <Image
                    src={gate.image}
                    alt={`Screenshot of ${gate.title}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 0px"
                    className="object-cover"
                  />
                </div>
                <figcaption className="flex items-center justify-between border-x border-b border-line px-3 py-2 hud text-mute">
                  <span>Capture · {number}</span>
                  <span>{gate.year}</span>
                </figcaption>
              </figure>

              <div className="md:col-span-7">
                <p className="max-w-[60ch] text-pretty text-lg leading-relaxed text-ice">
                  {lead}
                  {rest && <span className="text-ice-2"> {rest}</span>}
                </p>
              </div>

              <SystemWindow
                title="Loot"
                right={number}
                animate={false}
                className="md:col-span-5"
                bodyClassName="p-0"
              >
                {gate.details && (
                  <ul className="space-y-3 border-b border-line p-5 font-mono text-xs leading-relaxed text-ice-2 md:p-6">
                    {gate.details.map((d) => (
                      <li key={d} className="flex gap-3">
                        <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-sys" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <dl className="divide-y divide-line">
                  <div className="flex items-start justify-between gap-6 px-5 py-3 md:px-6">
                    <dt className="hud shrink-0 pt-0.5 text-mute">Stack</dt>
                    <dd className="text-right font-mono text-xs text-ice">{gate.tech.join(" · ")}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-6 px-5 py-3 md:px-6">
                    <dt className="hud text-mute">Links</dt>
                    <dd className="flex gap-6 hud">
                      {gate.live && (
                        <a
                          href={gate.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-sys inline-flex min-h-11 items-center text-sys"
                        >
                          Live ↗<span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      )}
                      <a
                        href={gate.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-sys inline-flex min-h-11 items-center text-sys"
                      >
                        Source ↗<span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </dd>
                  </div>
                </dl>
              </SystemWindow>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}
