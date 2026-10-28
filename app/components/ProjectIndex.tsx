"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { reveal, stagger, VIEWPORT } from "../lib/motion";

const NEW_TAB = <span className="sr-only"> (opens in a new tab)</span>;

type Entry = {
  slug: string;
  title: string;
  kind: string;
  year: string;
  what: string;
  part: string;
  challenge: string;
  tech: string[];
  live?: string;
  source: string;
  image: string;
  aspect: string;
  alt: string;
};

const ENTRIES: Entry[] = [
  {
    slug: "amazeon",
    title: "Amazeon",
    kind: "Solo capstone, App Academy",
    year: "2023 – 24",
    what: "An online store with a product catalog, search, customer reviews, a cart and a checkout.",
    part: "I built the original alone across 167 commits, November 2023 to July 2024. In July 2026 I rebuilt its front end in TypeScript, Vite and Tailwind with an AI coding agent; those commits come after the original in the history.",
    challenge: "Keeping stock honest: the checkout reduces each product's stock as part of the purchase.",
    tech: ["Ruby on Rails", "PostgreSQL", "React", "Redux"],
    source: "https://github.com/swejasonzhang/FullStack",
    image: "/assets/Amazeon.jpg",
    aspect: "aspect-[2/1]",
    alt: "Amazeon's storefront",
  },
  {
    slug: "bonjour-world",
    title: "Bonjour World",
    kind: "Team of four, App Academy",
    year: "2023",
    what: "A platform for hosting and finding language exchange events.",
    part: "Across 15 pull requests I opened and merged: the first version of Google Places address autocomplete, profile image upload, search and the attendee list. Teammates wrote the translation and sign-in code.",
    challenge: "Turning free-typed addresses into real places with the Google Places API, inside a shared four-person codebase.",
    tech: ["MongoDB", "Express", "React", "Node.js", "Google Places"],
    live: "https://bonjourworld.onrender.com/",
    source: "https://github.com/yuris1234/Bonjour-World",
    image: "/assets/BonjourWorld.jpg",
    aspect: "aspect-[2/1]",
    alt: "Bonjour World's event listing",
  },
  {
    slug: "battlefield-tanks",
    title: "Battlefield: Tanks",
    kind: "Canvas game",
    year: "2023 · 2026",
    what: "A turn-based tank artillery game in vanilla JavaScript on the Canvas API.",
    part: "I built the first version alone in October 2023 as my App Academy JavaScript project. In July 2026 I rebuilt it with an AI coding agent, which replaced the original code.",
    challenge: "A whole game loop on the raw Canvas API, with no engine.",
    tech: ["JavaScript", "HTML5 Canvas"],
    live: "https://swejasonzhang.github.io/Battlefield-Tanks/",
    source: "https://github.com/swejasonzhang/Battlefield-Tanks",
    image: "/assets/BattlefieldTanks.jpg",
    aspect: "aspect-[4/3]",
    alt: "Battlefield: Tanks mid-game",
  },
  {
    slug: "second-brain",
    title: "Second Brain",
    kind: "Notes app",
    year: "2026",
    what: "A notes app with semantic search and chat over your own notes.",
    part: "I built it in one evening in July 2026 with an AI coding agent, as an exercise in directing the agent.",
    challenge: "Searching by meaning rather than keywords, with embeddings stored in Postgres through pgvector.",
    tech: ["Next.js", "TypeScript", "PostgreSQL", "pgvector", "Clerk", "Gemini"],
    live: "https://second-brain-ai-knowledge-base.vercel.app",
    source: "https://github.com/swejasonzhang/SecondBrain",
    image: "/assets/SecondBrain.jpg",
    aspect: "aspect-[4/3]",
    alt: "Second Brain's notes view",
  },
  {
    slug: "calmify",
    title: "Calmify",
    kind: "Team project, Headstarter",
    year: "2024",
    what: "A team app that offers emotional support through AI-generated flashcards.",
    part: "I added the first Stripe Checkout route, the Clerk setup and the first OpenAI flashcard prompt, then built the landing page and the flashcard flip and swipe UI. A teammate created the app and finished sign-in and payments.",
    challenge: "Wiring payments, sign-in and an AI prompt into a brand-new app on its first day.",
    tech: ["Next.js", "React", "Clerk", "Stripe", "OpenAI"],
    live: "https://calmify-ten.vercel.app/",
    source: "https://github.com/pc9350/Calmify",
    image: "/assets/Calmify.jpg",
    aspect: "aspect-[2/1]",
    alt: "Calmify's landing page",
  },
  {
    slug: "profscore",
    title: "ProfScore",
    kind: "Team of three, Headstarter",
    year: "2024",
    what: "A Rate My Professor app with AI recommendations.",
    part: "I built the professor search page and its API route. A teammate built the AI recommendation pipeline behind it.",
    challenge: "Search results came back duplicated and unordered; the route de-duplicates them and sorts by rating.",
    tech: ["Next.js", "React"],
    live: "https://profscore-beta.vercel.app/",
    source: "https://github.com/pc9350/Rate-my-professor",
    image: "/assets/ProfScore.jpg",
    aspect: "aspect-[2/1]",
    alt: "ProfScore's professor search",
  },
];

/**
 * Earlier gates: an editorial index, not a card grid. Each row keeps its
 * capture visible and says what it is, what I did, the problem in it, the
 * stack, and where to look.
 */
export default function ProjectIndex() {
  return (
    <div id="earlier" className="scroll-mt-24">
      <motion.div variants={stagger(0.1)} initial="hidden" whileInView="visible" viewport={VIEWPORT} className="flex items-end justify-between gap-6 border-b border-line pb-6">
        <motion.h3 variants={reveal} className="display text-display-lg text-ice">
          Earlier gates
        </motion.h3>
        <motion.p variants={reveal} className="hud hidden text-mute sm:block">
          Six builds · 2023 – 2026
        </motion.p>
      </motion.div>

      <ol>
        {ENTRIES.map((e, i) => {
          const flip = i % 2 === 1;
          return (
            <motion.li
              key={e.slug}
              variants={stagger(0.1)}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
              className="grid gap-8 border-b border-line py-12 md:grid-cols-12 md:gap-10 md:py-16"
            >
              <motion.figure variants={reveal} className={`md:col-span-5 ${flip ? "md:order-2 md:col-start-8" : ""}`}>
                <div className={`chamfer relative overflow-hidden ring-1 ring-inset ring-line-strong ${e.aspect}`}>
                  <Image src={e.image} alt={e.alt} fill sizes="(max-width: 768px) 100vw, 40vw" className="object-cover object-top" />
                </div>
              </motion.figure>

              <div className={`md:col-span-7 ${flip ? "md:order-1 md:col-start-1" : ""}`}>
                <motion.div variants={reveal} className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
                  <span className="display text-2xl leading-none text-[var(--gate)]">{String(i + 1).padStart(2, "0")}</span>
                  <h4 className="display text-display-md text-ice">{e.title}</h4>
                  <span className="hud text-mute">
                    {e.kind} · {e.year}
                  </span>
                </motion.div>
                <motion.p variants={reveal} className="mt-4 text-lg text-ice">
                  {e.what}
                </motion.p>
                <motion.dl variants={reveal} className="mt-5 space-y-4">
                  <div>
                    <dt className="hud text-silver">My part</dt>
                    <dd className="mt-1 leading-relaxed text-ice-2">{e.part}</dd>
                  </div>
                  <div>
                    <dt className="hud text-silver">The problem</dt>
                    <dd className="mt-1 leading-relaxed text-ice-2">{e.challenge}</dd>
                  </div>
                </motion.dl>
                <motion.div variants={reveal} className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                  <p className="hud text-silver-2">{e.tech.join(" · ")}</p>
                  <p className="flex gap-6 hud">
                    {e.live && (
                      <a href={e.live} target="_blank" rel="noopener noreferrer" className="link-sys inline-flex min-h-11 items-center text-[var(--gate)]">
                        Live ↗{NEW_TAB}
                      </a>
                    )}
                    <a href={e.source} target="_blank" rel="noopener noreferrer" className="link-sys inline-flex min-h-11 items-center text-[var(--gate)]">
                      Source ↗{NEW_TAB}
                    </a>
                  </p>
                </motion.div>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
