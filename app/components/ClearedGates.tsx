"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import GateHeader from "./GateHeader";
import SystemWindow from "./SystemWindow";
import { VIEWPORT } from "../lib/motion";

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

const gateNumber = (index: number) => `G-${String(index + 1).padStart(2, "0")}`;

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function ClearedGates() {
  const featured = GATES.filter((g) => g.featured);
  const rest = GATES.filter((g) => !g.featured);

  return (
    <section
      id="works"
      aria-labelledby="works-title"
      className="gate-green relative isolate overflow-hidden py-24 md:py-36"
    >
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

        <div className="space-y-8">
          {/* Featured two: full-width rows, each materializing as it enters view */}
          {featured.map((gate) => (
            <motion.div key={gate.slug} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              <FeaturedGate gate={gate} index={GATES.indexOf(gate)} />
            </motion.div>
          ))}

          {/* Remaining four: two-up grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {rest.map((gate) => (
              <motion.div key={gate.slug} initial="hidden" whileInView="visible" viewport={VIEWPORT} className="flex">
                <GridGate gate={gate} index={GATES.indexOf(gate)} />
              </motion.div>
            ))}
          </div>
        </div>

        <p className="mt-12 flex items-center gap-4 hud text-mute md:mt-16">
          <span aria-hidden="true" className="h-px w-10 bg-[rgba(var(--gate-rgb),0.5)]" />
          <a href="#inkmity" className="link-sys text-[var(--gate)]">
            The S-Rank gate is Gate 01 →
          </a>
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Shared pieces                                                       */
/* ------------------------------------------------------------------ */

function Cleared() {
  return (
    <span className="inline-flex items-center gap-2">
      <span>· Cleared</span>
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 rotate-45 bg-[var(--gate)] shadow-[0_0_8px_rgba(var(--gate-rgb),0.7)]"
      />
    </span>
  );
}

function Capture({ gate, index, sizes }: { gate: Gate; index: number; sizes: string }) {
  return (
    <figure>
      <div className={`relative border border-[rgba(var(--gate-rgb),0.4)] ${ASPECT_CLASS[gate.aspect]}`}>
        <Image
          src={gate.image}
          alt={`Screenshot of ${gate.title}`}
          fill
          sizes={sizes}
          className="object-cover object-top"
        />
      </div>
      <figcaption className="flex items-center justify-between border-x border-b border-[rgba(var(--gate-rgb),0.4)] bg-[rgba(var(--gate-rgb),0.06)] px-3 py-2 hud text-mute">
        <span className="text-[var(--gate)]">Capture · {gate.slug}</span>
        <span>{gateNumber(index)}</span>
      </figcaption>
    </figure>
  );
}

function Links({ gate }: { gate: Gate }) {
  return (
    <div className="flex flex-wrap gap-x-6 hud">
      {gate.live && (
        <a
          href={gate.live}
          target="_blank"
          rel="noopener noreferrer"
          className="link-sys inline-flex min-h-11 items-center text-[var(--gate)]"
        >
          Live ↗<span className="sr-only"> (opens in a new tab)</span>
        </a>
      )}
      <a
        href={gate.github}
        target="_blank"
        rel="noopener noreferrer"
        className="link-sys inline-flex min-h-11 items-center text-[var(--gate)]"
      >
        Source ↗<span className="sr-only"> (opens in a new tab)</span>
      </a>
    </div>
  );
}

function Stack({ gate, className = "" }: { gate: Gate; className?: string }) {
  return (
    <p className={`flex items-start gap-4 hud ${className}`}>
      <span className="shrink-0 text-mute">Stack</span>
      <span className="text-ice">{gate.tech.join(" · ")}</span>
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Featured row                                                        */
/* ------------------------------------------------------------------ */

function FeaturedGate({ gate, index }: { gate: Gate; index: number }) {
  const [lead, rest] = splitLead(gate.description);

  return (
    <SystemWindow
      title={`${gateNumber(index)} · ${gate.kind}`}
      right={
        <>
          {gate.year} <Cleared />
        </>
      }
      animate
    >
      <div className="grid gap-8 md:grid-cols-12">
        <div className="md:col-span-6">
          <Capture gate={gate} index={index} sizes="(max-width: 768px) 100vw, 50vw" />
        </div>

        <div className="md:col-span-6">
          <h3 className="font-display text-display-md uppercase text-ice">{gate.title}</h3>

          <p className="mt-4 max-w-[60ch] text-pretty text-lg leading-relaxed text-ice">
            {lead}
            {rest && <span className="text-ice-2"> {rest}</span>}
          </p>

          {gate.details && (
            <ul className="mt-6 divide-y divide-[rgba(var(--gate-rgb),0.2)] border-y border-[rgba(var(--gate-rgb),0.2)] font-mono text-xs leading-relaxed text-ice-2">
              {gate.details.map((d) => (
                <li key={d} className="flex gap-3 py-3">
                  <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-[var(--gate)]" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          )}

          <Stack gate={gate} className="mt-6" />
          <div className="mt-2">
            <Links gate={gate} />
          </div>
        </div>
      </div>
    </SystemWindow>
  );
}

/* ------------------------------------------------------------------ */
/* Grid card                                                           */
/* ------------------------------------------------------------------ */

function GridGate({ gate, index }: { gate: Gate; index: number }) {
  const [lead, rest] = splitLead(gate.description);

  return (
    <SystemWindow
      title={`${gateNumber(index)} · ${gate.kind}`}
      right={
        <>
          {gate.year} <Cleared />
        </>
      }
      animate
      className="flex w-full flex-col"
      bodyClassName="flex flex-1 flex-col"
    >
      <Capture gate={gate} index={index} sizes="(max-width: 768px) 100vw, 50vw" />

      <h3 className="mt-6 font-display text-display-md uppercase text-ice">{gate.title}</h3>

      <p className="mt-2 hud text-mute">
        {gate.kind} · {gate.year}
      </p>

      <p className="mt-4 max-w-[60ch] text-pretty leading-relaxed text-ice">
        {lead}
        {rest && <span className="text-ice-2"> {rest}</span>}
      </p>

      <div className="mt-auto pt-6">
        <Stack gate={gate} />
        <div className="mt-2">
          <Links gate={gate} />
        </div>
      </div>
    </SystemWindow>
  );
}
