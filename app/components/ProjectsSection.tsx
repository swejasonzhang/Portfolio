"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import MagneticButton from "./MagneticButton";
import SectionHeading from "./SectionHeading";
import TiltCard from "./TiltCard";
import Backdrop from "./Backdrop";
import { reveal, revealFrom, stagger, VIEWPORT } from "../lib/motion";

interface Project {
  slug: string;
  title: string;
  kind: string;
  description: string;
  details: [string, string];
  tech: string[];
  live: string;
  github: string;
  image: string;
  featured: boolean;
}

const TOTAL = 7;

const projects: Project[] = [
  {
    slug: "second-brain",
    title: "Second Brain",
    kind: "AI knowledge base",
    description:
      "Capture notes, search them by meaning instead of keywords, and chat with your own knowledge — answers stream back grounded in your notes, sources cited.",
    details: [
      "Streaming RAG chat on Next.js 16 App Router, Server Components and Server Actions",
      "Semantic search on Postgres + pgvector (HNSW) with Gemini embeddings, per-user isolation via Clerk, Vitest suite",
    ],
    tech: ["Next.js", "TypeScript", "pgvector", "Drizzle", "Gemini", "Clerk"],
    live: "https://second-brain-ai-knowledge-base.vercel.app",
    github: "https://github.com/swejasonzhang/SecondBrain",
    image: "/assets/SecondBrain.jpg",
    featured: true,
  },
  {
    slug: "inkmity",
    title: "Inkmity",
    kind: "Community platform",
    description:
      "Connects tattoo clients with the right artist — browse designs, discover local talent, and join a community that celebrates the craft.",
    details: [
      "Waitlist sign-up, in-app notifications and a fully responsive interactive UI",
      "AI roadmap: chatbot guidance and tattoo-placement visualization",
    ],
    tech: ["MongoDB", "Express", "React", "Node.js", "Tailwind", "Framer Motion"],
    live: "https://inkmity.com/",
    github: "https://github.com/swejasonzhang/Inkmity",
    image: "/assets/Inkmity.jpg",
    featured: true,
  },
  {
    slug: "battlefield-tanks",
    title: "Battlefield: Tanks",
    kind: "Canvas game engine",
    description:
      "A turn-based artillery duel in the spirit of Pocket Tanks — vanilla JavaScript and the Canvas API, no framework, no build step. Mind your angle, power and gravity.",
    details: [
      "Custom pseudo-3D voxel renderer: every tank built from cuboids with orthographic projection and flat-face shading",
      "Procedural destructible terrain, splash damage, live trajectory arc, per-turn stamina and timers, localStorage leaderboard",
    ],
    tech: ["JavaScript", "HTML5 Canvas", "ES Modules", "Pixel Art"],
    live: "https://swejasonzhang.github.io/Battlefield-Tanks/",
    github: "https://github.com/swejasonzhang/Battlefield-Tanks",
    image: "/assets/BattlefieldTanks.jpg",
    featured: true,
  },
  {
    slug: "amazeon",
    title: "Amazeon",
    kind: "E-commerce",
    description:
      "An Amazon-style storefront — browse and buy across a wide catalog, with rotating product imagery and a backend tuned for speed.",
    details: [
      "Rails + PostgreSQL backend behind a React/Redux storefront on AWS",
      "Rotating product images, smooth UI transitions and optimized server performance",
    ],
    tech: ["Ruby on Rails", "React", "Redux", "AWS", "PostgreSQL"],
    live: "https://amazeon.onrender.com",
    github: "https://github.com/swejasonzhang/FullStack",
    image: "/assets/Amazeon.jpg",
    featured: false,
  },
  {
    slug: "bonjour-world",
    title: "Bonjour World",
    kind: "Language exchange",
    description:
      "A language-exchange platform that pairs learners with teachers around the world.",
    details: [
      "Google Maps integration to find exchange partners by location",
      "Google Translate API for real-time translation inside conversations",
    ],
    tech: ["React", "Redux", "Node.js", "MongoDB", "Google Maps API"],
    live: "https://bonjourworld.onrender.com/",
    github: "https://github.com/yuris1234/Bonjour-World",
    image: "/assets/BonjourWorld.jpg",
    featured: false,
  },
  {
    slug: "calmify",
    title: "Calmify",
    kind: "Wellness",
    description:
      "A meditation and mental-wellness platform with guided exercises, personalized routines and stress tracking.",
    details: [
      "Third-party audio APIs power the guided meditation sessions",
      "Real-time stress analytics via third-party APIs",
    ],
    tech: ["React", "Node.js", "Express", "MongoDB"],
    live: "https://calmify-ten.vercel.app/",
    github: "https://github.com/pc9350/Calmify",
    image: "/assets/Calmify.jpg",
    featured: false,
  },
  {
    slug: "profscore",
    title: "ProfScore",
    kind: "Reviews & rankings",
    description:
      "Aggregates student reviews and ratings so students can choose professors with confidence.",
    details: [
      "AI-powered analysis of review comments (OpenAI)",
      "Ranking algorithms and interactive dashboards for comparing professors",
    ],
    tech: ["Next.js", "React", "Node.js", "MongoDB", "OpenAI"],
    live: "https://profscore-beta.vercel.app/",
    github: "https://github.com/pc9350/Rate-my-professor",
    image: "/assets/ProfScore.jpg",
    featured: false,
  },
];

const featured = projects.filter((p) => p.featured);
const archive = projects.filter((p) => !p.featured);

const CHIP =
  "inline-flex items-center rounded-sm border border-line px-2.5 py-1 font-mono text-2xs uppercase tracking-label text-gray-300 transition-colors hover:border-line-strong hover:text-white";

const META =
  "flex items-center gap-3 font-mono text-2xs uppercase tracking-label tabular-nums text-gray-400";

const pad = (n: number) => String(n).padStart(2, "0");

const arrowIcon = (
  <svg
    aria-hidden="true"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="square"
    viewBox="0 0 24 24"
  >
    <path d="M7 17L17 7M9 7h8v8" />
  </svg>
);

const githubIcon = (
  <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

function MetaRow({ n, kind }: { n: number; kind: string }) {
  return (
    <div className={META}>
      <span className="whitespace-nowrap">
        Nº {pad(n)} <span className="text-gray-500">/ {pad(TOTAL)}</span>
      </span>
      <span aria-hidden="true" className="h-px flex-1 bg-line" />
      <span className="whitespace-nowrap">{kind}</span>
    </div>
  );
}

function FeaturedPlate({ proj, index }: { proj: Project; index: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-18, 18]);

  const n = index + 1;
  const reversed = index % 2 === 1;

  return (
    <motion.article
      ref={ref}
      id={`project-${proj.slug}`}
      variants={stagger(0.12)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      <TiltCard max={3} className="flash-frame overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Image panel: bleeds to the plate edge, like the dark half of the mark. */}
          <motion.div
            variants={revealFrom(reversed ? "left" : "right")}
            data-cursor="view"
            className={`relative aspect-[16/10] overflow-hidden border-line bg-black lg:aspect-auto lg:min-h-[440px] ${
              reversed ? "lg:order-1 lg:border-r" : "lg:order-2 lg:border-l"
            } border-b lg:border-b-0`}
          >
            <motion.div
              style={reduce ? undefined : { y }}
              className="absolute inset-0 scale-[1.06] will-change-transform"
            >
              <Image
                src={proj.image}
                alt={`${proj.title} screenshot`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={index === 0}
                className="object-cover object-top"
              />
            </motion.div>
          </motion.div>

          {/* Text column */}
          <motion.div
            variants={revealFrom(reversed ? "right" : "left")}
            className={`relative flex flex-col justify-between gap-6 p-6 md:p-8 lg:p-10 ${
              reversed ? "lg:order-2" : "lg:order-1"
            }`}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-1 right-4 select-none font-display text-[7rem] leading-none text-white/[0.05]"
            >
              {pad(n)}
            </span>

            <div className="relative space-y-5">
              <MetaRow n={n} kind={proj.kind} />

              <h3 className="text-balance font-display text-display-lg text-white">
                {proj.title}
              </h3>

              <p className="max-w-[60ch] text-pretty leading-relaxed text-gray-400">
                {proj.description}
              </p>

              <ul className="space-y-2 text-sm leading-relaxed text-gray-400">
                {proj.details.map((d) => (
                  <li key={d} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1 w-1 shrink-0 rotate-45 bg-white"
                    />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>

              <ul className="flex flex-wrap gap-2" aria-label="Stack">
                {proj.tech.map((t) => (
                  <li key={t} className={CHIP}>
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative flex flex-wrap gap-3 pt-1">
              <MagneticButton
                href={proj.live}
                target="_blank"
                variant="yang"
                size="sm"
                strength={0.2}
              >
                <span className="sr-only">{proj.title}: </span>
                Live site
                {arrowIcon}
              </MagneticButton>
              <MagneticButton
                href={proj.github}
                target="_blank"
                variant="yin"
                size="sm"
                strength={0.2}
              >
                {githubIcon}
                <span className="sr-only">{proj.title} on </span>
                Source
              </MagneticButton>
            </div>
          </motion.div>
        </div>
      </TiltCard>
    </motion.article>
  );
}

function ArchiveLink({
  href,
  label,
  title,
}: {
  href: string;
  label: string;
  title: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="ink-underline inline-flex min-h-6 items-center text-gray-300 transition-colors hover:text-white"
    >
      {label} ↗
      <span className="sr-only"> — {title} (opens in a new tab)</span>
    </a>
  );
}

function ArchiveCard({ proj, index }: { proj: Project; index: number }) {
  const n = featured.length + index + 1;

  return (
    <motion.article
      id={`project-${proj.slug}`}
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      className="h-full"
    >
      <TiltCard max={4} className="flash-frame flex h-full flex-col overflow-hidden">
        <div className="relative aspect-[16/10] border-b border-line bg-black">
          <Image
            src={proj.image}
            alt={`${proj.title} screenshot`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-top"
          />
        </div>

        <div className="flex flex-1 flex-col p-6">
          <MetaRow n={n} kind={proj.kind} />

          <h3 className="mt-3 font-display text-display-md text-white">
            {proj.title}
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-gray-400">
            {proj.description}
          </p>

          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Stack">
            {proj.tech.map((t) => (
              <li key={t} className={CHIP}>
                {t}
              </li>
            ))}
          </ul>

          <div className="mt-auto flex gap-6 pt-6 font-mono text-2xs uppercase tracking-label">
            <ArchiveLink href={proj.live} label="Live site" title={proj.title} />
            <ArchiveLink href={proj.github} label="Source" title={proj.title} />
          </div>
        </div>
      </TiltCard>
    </motion.article>
  );
}

export default function ProjectsSection() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="relative isolate py-24 md:py-32"
    >
      <Backdrop variant="rings" />
      <div className="container-ink">
        <SectionHeading
          id="projects-title"
          no="04"
          kicker="Seven builds"
          title="Selected Work"
        />

        <div className="space-y-10 md:space-y-14">
          {featured.map((proj, i) => (
            <FeaturedPlate key={proj.slug} proj={proj} index={i} />
          ))}
        </div>

        <div className="mb-8 mt-20 flex items-center gap-4">
          <span className="font-mono text-2xs uppercase tracking-kicker text-gray-400">
            More work · Nº 04 – 07
          </span>
          <span aria-hidden="true" className="h-px flex-1 bg-line" />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {archive.map((proj, i) => (
            <ArchiveCard key={proj.slug} proj={proj} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
