"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import Image from "next/image";
import {
  useEffect,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import Gate from "./Gate";
import { DUR, EASE_OUT, reveal, stagger, VIEWPORT } from "../lib/motion";

type Work = {
  slug: string;
  title: string;
  kind: string;
  year: string;
  description: string;
  details?: string[];
  tech: string[];
  live?: string;
  github?: string;
  image: string;
  /** Screenshot proportions. */
  aspect: "2/1" | "4/3";
  featured?: boolean;
};

const WORKS: Work[] = [
  {
    slug: "amazeon",
    title: "Amazeon",
    kind: "Online store",
    year: "2023 / 2026",
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
    year: "2023 / 2026",
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

const PREVIEW_W = 352; // w-[22rem]
const PREVIEW_H = PREVIEW_W / 2;
const OFFSET = 24;

/** Split a write-up so its first sentence can be set in washi. */
function splitFirstSentence(text: string): [string, string] {
  const i = text.indexOf(". ");
  if (i === -1) return [text, ""];
  return [text.slice(0, i + 1), text.slice(i + 1)];
}

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="link-rule inline-block py-3 font-mono text-2xs uppercase tracking-label text-washi"
    >
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

/**
 * Gate III — Works. An index, not a grid: one ruled row per build, opened
 * like a drawer. The open numeral is stamped vermilion; on a fine pointer a
 * print of the build follows the hand across the row.
 */
export default function Works() {
  const [open, setOpen] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [hoverCapable, setHoverCapable] = useState(false);
  const reduced = useReducedMotion();

  // Pointer-following print (desktop, fine pointer only).
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 260, damping: 32, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 260, damping: 32, mass: 0.6 });

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)");
    if (wide.matches) setOpen(WORKS[0].slug);

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setHoverCapable(fine.matches);
    sync();
    fine.addEventListener("change", sync);
    return () => fine.removeEventListener("change", sync);
  }, []);

  const showPreview = hoverCapable && !reduced;

  const track = (e: ReactPointerEvent) => {
    if (!showPreview) return;
    // Keep the print inside the viewport: flip to the left of the hand near the right edge.
    const overflowsRight = e.clientX + OFFSET + PREVIEW_W > window.innerWidth;
    const overflowsBottom = e.clientY + OFFSET + PREVIEW_H > window.innerHeight;
    px.set(overflowsRight ? e.clientX - OFFSET - PREVIEW_W : e.clientX + OFFSET);
    py.set(overflowsBottom ? e.clientY - OFFSET - PREVIEW_H : e.clientY + OFFSET);
  };

  const hoveredWork = WORKS.find((w) => w.slug === hovered);

  return (
    <section id="works" aria-labelledby="works-title" className="relative isolate py-28 md:py-40">
      <span
        aria-hidden="true"
        className="vertical absolute left-6 top-1/2 hidden -translate-y-1/2 font-mono text-2xs uppercase tracking-kicker text-ash lg:block"
      >
        III — Works
      </span>

      <div className="frame">
        <Gate
          id="works-title"
          numeral="III"
          title="Works"
          kicker="Six builds · 2023 – 2026"
          lead="Everything here is live or public, and the write-ups say exactly what I built and when."
        />

        {/* Column heads */}
        <div
          aria-hidden="true"
          className="hidden grid-cols-12 gap-6 pb-3 font-mono text-2xs uppercase tracking-label text-ash-2 md:grid"
        >
          <span className="col-span-1">Nº</span>
          <span className="col-span-5">Build</span>
          <span className="col-span-3">Kind</span>
          <span className="col-span-2">Year</span>
          <span className="col-span-1 text-right">Open</span>
        </div>

        <motion.ol
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          onPointerMove={track}
          onPointerLeave={() => setHovered(null)}
          className="list-none"
        >
          {WORKS.map((work, i) => {
            const isOpen = open === work.slug;
            const panelId = `works-${work.slug}`;
            const [first, rest] = splitFirstSentence(work.description);
            const n = String(i + 1).padStart(2, "0");

            return (
              <motion.li
                key={work.slug}
                variants={reveal}
                className={`group relative border-t border-line ${
                  i === WORKS.length - 1 ? "border-b" : ""
                }`}
                onPointerEnter={() => setHovered(work.slug)}
              >
                {/* The rule thickens as the hand crosses the row. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 -top-px h-px origin-left scale-x-0 bg-line-strong transition-transform duration-500 ease-out group-hover:scale-x-100"
                />

                <h3 className="m-0">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : work.slug)}
                    className="grid w-full grid-cols-[auto_1fr_auto] items-baseline gap-x-4 gap-y-1 py-6 text-left md:grid-cols-12 md:gap-6 md:py-7"
                  >
                    <span
                      className={`col-start-1 row-start-1 font-mono text-2xs uppercase tracking-label transition-colors duration-500 md:col-span-1 ${
                        isOpen ? "text-shu" : "text-ash"
                      }`}
                    >
                      Nº {n}
                    </span>

                    <span
                      className={`col-start-2 row-start-1 font-serif text-display-md text-washi transition-[font-style] group-hover:italic ${
                        work.featured ? "md:text-display-lg" : ""
                      } md:col-span-5 ${isOpen ? "italic" : ""}`}
                    >
                      {work.title}
                    </span>

                    <span className="col-start-2 row-start-2 font-mono text-2xs uppercase tracking-label text-ash md:col-span-3 md:row-start-1 md:col-start-auto">
                      {work.kind}
                      <span className="md:hidden"> · {work.year}</span>
                    </span>

                    <span className="hidden font-mono text-2xs uppercase tracking-label text-ash md:col-span-2 md:block">
                      {work.year}
                    </span>

                    <span
                      aria-hidden="true"
                      className={`col-start-3 row-start-1 inline-block justify-self-end font-mono text-base leading-none text-ash transition-transform duration-500 ease-out group-hover:text-washi md:col-span-1 md:col-start-auto ${
                        isOpen ? "rotate-45 text-washi" : ""
                      }`}
                    >
                      +
                    </span>
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="panel"
                      id={panelId}
                      role="region"
                      aria-label={`${work.title} — details`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: DUR.base, ease: EASE_OUT }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-x-6 gap-y-8 pb-10 md:grid-cols-12 md:pb-12">
                        {/* Print, inline below lg (on lg it follows the pointer). */}
                        <div className="md:col-span-11 md:col-start-2 lg:hidden">
                          <div
                            className={`relative w-full max-w-[36rem] border border-line ${
                              work.aspect === "4/3" ? "aspect-[4/3]" : "aspect-[2/1]"
                            }`}
                          >
                            <Image
                              src={work.image}
                              alt={`${work.title} screenshot`}
                              fill
                              sizes="(min-width: 768px) 36rem, 100vw"
                              className="object-cover"
                            />
                          </div>
                        </div>

                        <p className="text-pretty text-base leading-relaxed text-ash md:col-span-6 md:col-start-2">
                          <span className="text-washi">{first}</span>
                          {rest}
                        </p>

                        {work.details && (
                          <ul className="space-y-3 md:col-span-4 md:col-start-9">
                            {work.details.map((d) => (
                              <li
                                key={d}
                                className="flex gap-3 font-mono text-2xs leading-relaxed text-ash"
                              >
                                <span
                                  aria-hidden="true"
                                  className="mt-[0.45em] inline-block h-1.5 w-1.5 shrink-0 rotate-45 border border-line-strong"
                                />
                                <span>{d}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-t border-line-hair pt-4 md:col-span-11 md:col-start-2">
                          <p className="font-mono text-2xs uppercase tracking-label text-ash">
                            {work.tech.join(" · ")}
                          </p>
                          <div className="flex gap-8">
                            {work.live && <ExternalLink href={work.live}>Live ↗</ExternalLink>}
                            {work.github && (
                              <ExternalLink href={work.github}>Source ↗</ExternalLink>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </motion.ol>

        <p className="mt-10 font-mono text-2xs uppercase tracking-label text-ash">
          <a href="#inkmity" className="link-rule inline-block py-3 hover:text-washi">
            Inkmity is Gate II.
          </a>
        </p>
      </div>

      {/* Pointer-following print: fine pointers on lg only, never under reduced motion. */}
      {showPreview && (
        <motion.div
          aria-hidden="true"
          style={{ x: sx, y: sy }}
          animate={{ opacity: hoveredWork ? 1 : 0 }}
          transition={{ duration: DUR.fast, ease: EASE_OUT }}
          className="pointer-events-none fixed left-0 top-0 z-40 hidden w-[22rem] lg:block"
        >
          <div className="relative aspect-[2/1] w-full border border-line bg-sumi-2">
            {WORKS.map((w) => (
              <Image
                key={w.slug}
                src={w.image}
                alt=""
                fill
                sizes="22rem"
                className={`object-cover transition-opacity duration-300 ${
                  hovered === w.slug ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>
        </motion.div>
      )}
    </section>
  );
}
