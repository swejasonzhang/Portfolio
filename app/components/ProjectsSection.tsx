"use client";

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import TiltCard from "./TiltCard";
import MagneticButton from "./MagneticButton";

interface Project {
  title: string;
  description: string;
  details: string[];
  tech: string[];
  live: string;
  github: string;
  image: string;
}

const projects: Project[] = [
  {
    title: "Second Brain",
    description:
      "Second Brain is an AI-powered knowledge base that lets you capture notes, search them by meaning instead of keywords, and chat with your own knowledge — answers are streamed and grounded in your notes with cited sources.",
    details: [
      "Full-stack Next.js 16 (App Router, React Server Components, Server Actions) with a streaming Retrieval-Augmented Generation (RAG) chat endpoint",
      "Semantic search over Postgres + pgvector (HNSW index) with Gemini embeddings, Clerk auth for per-user data isolation, and a Vitest test suite",
    ],
    tech: ["Next.js", "TypeScript", "pgvector", "Drizzle", "Gemini", "Clerk"],
    live: "https://second-brain-ai-knowledge-base.vercel.app",
    github: "https://github.com/swejasonzhang/SecondBrain",
    image: "/assets/SecondBrain.jpg",
  },
  {
    title: "Inkmity",
    description:
      "Inkmity is a modern web application connecting tattoo clients and artists, designed to simplify the process of finding the right artist based on your preferences. It provides a space for clients to explore designs, discover local talent, and engage with a community that appreciates and celebrates tattoo art.",
    details: [
      "Built with MongoDB, Express.js, React, Node.js (MERN stack) and modern frontend tools like Tailwind CSS, Framer Motion, and React Toastify",
      "Features waitlist sign-up, responsive interactive UI, notifications, and planned AI enhancements like chatbot guidance and tattoo placement visualization",
    ],
    tech: ["MongoDB", "Express", "React", "Node.js", "Tailwind", "Framer Motion"],
    live: "https://inkmity.com/",
    github: "https://github.com/swejasonzhang/Inkmity",
    image: "/assets/Inkmity.jpg",
  },
  {
    title: "Battlefield: Tanks",
    description:
      "Battlefield: Tanks is a turn-based artillery duel inspired by Pocket Tanks, built entirely from scratch with vanilla JavaScript and the HTML5 Canvas API — no framework and no build step. Two players lob shells across scrolling, destructible terrain, minding angle, power, and gravity.",
    details: [
      "Custom pseudo-3D voxel renderer draws every tank from cuboids with orthographic projection and flat-face shading — no 3D library",
      "Procedurally generated destructible terrain with splash damage, a live trajectory aiming arc, per-turn stamina and timers, and a localStorage leaderboard",
    ],
    tech: ["JavaScript", "HTML5 Canvas", "ES Modules", "Pixel Art"],
    live: "https://swejasonzhang.github.io/Battlefield-Tanks/",
    github: "https://github.com/swejasonzhang/Battlefield-Tanks",
    image: "/assets/BattlefieldTanks.jpg",
  },
  {
    title: "Amazeon",
    description:
      "Amazeon is an e-commerce platform that replicates the Amazon shopping experience, offering users the convenience to purchase a wide range of products.",
    details: [
      "Built with Ruby on Rails (backend), React/Redux (frontend), and AWS for cloud infrastructure",
      "Features rotating product images, smooth UI, and optimized server performance",
    ],
    tech: ["Ruby on Rails", "React", "Redux", "AWS", "PostgreSQL"],
    live: "https://amazeon.onrender.com",
    github: "https://github.com/swejasonzhang/FullStack",
    image: "/assets/Amazeon.jpg",
  },
  {
    title: "Bonjour World",
    description:
      "Bonjour World is a dynamic web platform for language exchange, connecting learners and teachers worldwide.",
    details: [
      "Built on MERN stack with React/Redux frontend and Node.js backend",
      "Integrated Google Maps and Translate APIs for location and real-time translations",
    ],
    tech: ["React", "Redux", "Node.js", "MongoDB", "Google Maps API"],
    live: "https://bonjourworld.onrender.com/",
    github: "https://github.com/yuris1234/Bonjour-World",
    image: "/assets/BonjourWorld.jpg",
  },
  {
    title: "Calmify",
    description:
      "Calmify is a meditation and mental wellness platform providing guided exercises, personalized routines, and stress tracking features.",
    details: [
      "Developed with React frontend, Node.js/Express backend, MongoDB database",
      "Integrates third-party APIs for guided meditation audio and real-time stress analytics",
    ],
    tech: ["React", "Node.js", "Express", "MongoDB"],
    live: "https://calmify-ten.vercel.app/",
    github: "https://github.com/pc9350/Calmify",
    image: "/assets/Calmify.jpg",
  },
  {
    title: "ProfScore",
    description:
      "ProfScore aggregates student reviews and ratings for professors to help students make informed decisions.",
    details: [
      "Built with React/Next.js frontend, Node.js backend, MongoDB database",
      "Features AI-powered comment analysis, ranking algorithms, and interactive dashboards for visualization",
    ],
    tech: ["Next.js", "React", "Node.js", "MongoDB", "OpenAI"],
    live: "https://profscore-beta.vercel.app/",
    github: "https://github.com/pc9350/Rate-my-professor",
    image: "/assets/ProfScore.jpg",
  },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const arrowIcon = (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M14 5l7 7m0 0l-7 7m7-7H3"
    />
  </svg>
);

const githubIcon = (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

function ProjectCard({ proj, index }: { proj: Project; index: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [36, -36]);
  const reversed = index % 2 === 1;

  return (
    <motion.article
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
    >
      <TiltCard
        max={4}
        className="glow-border overflow-hidden rounded-2xl border border-white/10 bg-gray-900/60 transition-colors hover:bg-gray-900/75"
      >
        <div className="grid grid-cols-1 gap-8 p-6 md:p-8 lg:grid-cols-2">
          <div
            className={`flex flex-col justify-center space-y-5 ${
              reversed ? "lg:order-2" : "lg:order-1"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-gray-600">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-2xl font-bold text-white">{proj.title}</h3>
            </div>
            <p className="text-gray-400">{proj.description}</p>
            <ul className="list-inside list-disc space-y-1 text-sm text-gray-400">
              {proj.details.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2">
              {proj.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-gray-300"
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 pt-1">
              <MagneticButton
                href={proj.live}
                target="_blank"
                rel="noopener noreferrer"
                strength={0.2}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-gray-200"
              >
                Live Demo
                {arrowIcon}
              </MagneticButton>
              <MagneticButton
                href={proj.github}
                target="_blank"
                rel="noopener noreferrer"
                strength={0.2}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-200 transition-colors hover:bg-white/10"
              >
                {githubIcon}
                GitHub
              </MagneticButton>
            </div>
          </div>

          <div
            className={`flex items-center justify-center overflow-hidden rounded-xl bg-black/30 p-4 ${
              reversed ? "lg:order-1" : "lg:order-2"
            }`}
          >
            <motion.div
              style={reduce ? undefined : { y }}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 250, damping: 20 }}
              className="w-full overflow-hidden rounded-lg will-change-transform"
            >
              <Image
                src={proj.image}
                alt={`${proj.title} screenshot`}
                className="h-auto w-full rounded-lg"
                width={800}
                height={600}
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={index === 0}
                loading={index === 0 ? "eager" : "lazy"}
              />
            </motion.div>
          </div>
        </div>
      </TiltCard>
    </motion.article>
  );
}

export default function ProjectsSection() {
  return (
    <div className="relative px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-gray-400">
            Selected work
          </p>
          <motion.h2
            initial={{ filter: "blur(12px)", opacity: 0 }}
            whileInView={{ filter: "blur(0px)", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-3xl font-bold md:text-4xl"
          >
            Featured Projects
          </motion.h2>
        </motion.div>

        <div className="space-y-12 md:space-y-16">
          {projects.map((proj, idx) => (
            <ProjectCard key={proj.title} proj={proj} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}
