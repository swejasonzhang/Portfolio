"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import CountUp from "./CountUp";
import GateHeader from "./GateHeader";
import RankMark from "./RankMark";
import SystemWindow from "./SystemWindow";
import { reveal, stagger, VIEWPORT } from "../lib/motion";
import { siteConfig } from "../site";

type Quest = {
  org: string;
  period: string;
  role: string;
  kind: string;
  description: string;
  objectives: ReactNode[];
  active?: boolean;
};

const WORK: Quest[] = [
  {
    org: "Inkmity",
    period: "Aug 2025 – Present",
    role: "Founder & Software Developer",
    kind: "Self-employed · New York",
    description:
      "Founded and launched an early-stage booking app for tattoo artists, live since July 2026.",
    objectives: [
      "Built the first version myself, Aug 2025 – Jan 2026",
      "Since June 2026: built with Claude Code, an AI coding agent; I test and approve every release",
      "Deploy and run it on Render and Vercel",
    ],
    active: true,
  },
  {
    org: "Move Tact Management",
    period: "Feb 2025 – Jul 2025",
    role: "Software Engineer",
    kind: "Contract · Remote",
    description:
      "Wrote Python scripts that pull social media metrics into Google Sheets for a 10+ person marketing team.",
    objectives: [
      <>
        Sole author of <CountUp to={19} /> Python scripts across <CountUp to={108} /> commits
      </>,
      "TikTok, Instagram and YouTube metrics from the Ensemble Data and Chartmetric APIs",
      "Slack notifications, plus a small Node.js, Express and React web app",
    ],
  },
  {
    org: "Series",
    period: "Nov 2024 – Feb 2025",
    role: "Software Engineer Intern",
    kind: "Internship · Remote",
    description:
      "Built backend endpoints and Twilio integrations on a 3-person engineering team with the CTO.",
    objectives: [
      <>
        Opened <CountUp to={50} suffix="+" /> pull requests, working through code review
      </>,
      "Node.js and Firebase backend endpoints",
      "Twilio integrations for Vera, the company's communications bot",
    ],
  },
  {
    org: "Headstarter AI",
    period: "Jul 2024 – Oct 2024",
    role: "Software Engineering Fellow",
    kind: "Fellowship · Remote",
    description: "Built team projects with Next.js, React, Clerk and Vercel.",
    objectives: [
      "ProfScore: the professor search page and its API route",
      "Calmify: the first Stripe Checkout route, Clerk setup and OpenAI flashcard prompt",
      "Calmify's landing page and flashcard flip and swipe UI",
    ],
  },
];

const STUDY: Quest[] = [
  {
    org: "Queens College (CUNY)",
    period: "Expected May 2029",
    role: "B.S. in Computer Science",
    kind: "Fall 2026 – Present",
    description:
      "Evening classes; currently taking C++ programming. Open to a software engineering internship or co-op alongside the degree, and I can start right away.",
    objectives: [
      "Evening classes; currently taking C++ programming",
      "Open to a software engineering internship or co-op alongside the degree",
      "I can start right away",
    ],
    active: true,
  },
  {
    org: "App Academy",
    period: "Aug 2023 – Dec 2023",
    role: "Full-Stack Software Engineering Certificate",
    kind: "Certificate",
    description:
      "Full-stack program in JavaScript, React, Redux, Ruby on Rails, PostgreSQL, MongoDB, Express and Node.js. Capstone: Amazeon, a solo online store.",
    objectives: [
      "JavaScript, React, Redux, Ruby on Rails, PostgreSQL, MongoDB, Express and Node.js",
      "Capstone: Amazeon, a solo online store",
    ],
  },
  {
    org: "College of Staten Island (CUNY)",
    period: "2020 – 2022",
    role: "Computer Science Coursework",
    kind: "Coursework",
    description: "Computer science coursework, transferred to Queens College.",
    objectives: ["Transferred to Queens College"],
  },
];

const ACTIVE_QUESTS: { text: string; progress: string }[] = [
  {
    text: "Finish the B.S. in Computer Science at Queens College (CUNY)",
    progress: "In progress · expected May 2029",
  },
  {
    text: "Grow Inkmity to 20 NYC artists using it weekly on real client work",
    progress: "In progress · live since Jul 2026",
  },
  {
    text: "Land a software engineering internship or co-op",
    progress: "Open · can start right away",
  },
];

const SKILLS_ACTIVE: ReactNode[] = [
  "Languages — JavaScript, TypeScript, Python, HTML, CSS, Ruby, C++",
  "Web — React, Redux, Tailwind CSS, Node.js, Express.js, REST APIs, Socket.IO, MongoDB, PostgreSQL, Ruby on Rails, Firebase",
  "Integrations — Stripe Checkout, Stripe webhooks, Clerk, Cloudinary, Twilio, Google Places, Google Sheets, Slack",
  "Cloud and tools — Claude Code, AI-assisted development, Git, GitHub, Render, Vercel, MongoDB Atlas",
];

const SKILLS_PASSIVE: ReactNode[] = [
  <>
    Code review — <CountUp to={50} suffix="+" /> pull requests at Series, worked through review
  </>,
  "Testing by hand — every Inkmity release tested in the live app before approval",
  "Ops — production env vars, live Stripe webhook endpoint, DB scripts, deploy and server logs on Render and Vercel",
  "Product discipline — a written constitution with anti-goals; features frozen behind flags instead of deleted",
];

function QuestWindow({ quest }: { quest: Quest }) {
  const right: ReactNode = quest.active ? (
    <span className="text-[var(--gate)] glow-gate">Active · {quest.period}</span>
  ) : (
    quest.period
  );
  return (
    <SystemWindow title={quest.org} right={right} animate>
      <div className="grid gap-6 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          <h4 className="font-display text-display-md uppercase leading-none text-ice">
            {quest.role}
          </h4>
          <p className="hud mt-3 text-mute">{quest.kind}</p>
          <p className="mt-4 text-pretty leading-relaxed text-ice-2">{quest.description}</p>
        </div>
        <div className="md:col-span-7">
          <p className="hud text-mute">Objectives</p>
          <ul className="mt-3 divide-y divide-line border-t border-line font-mono text-sm text-ice">
            {quest.objectives.map((o, i) => (
              <li key={i} className="flex items-start gap-3 py-3 leading-relaxed">
                <span
                  aria-hidden="true"
                  className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-[var(--gate)]"
                />
                <span>{o}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SystemWindow>
  );
}

function Board({ heading, quests }: { heading: string; quests: Quest[] }) {
  return (
    <motion.div
      variants={stagger()}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      className="mt-16 md:mt-24"
    >
      <motion.h3 variants={reveal} className="hud mb-6 text-[var(--gate)]">
        [{heading}]
      </motion.h3>
      <div className="grid gap-4">
        {quests.map((q) => (
          <QuestWindow key={q.org} quest={q} />
        ))}
      </div>
    </motion.div>
  );
}

function SkillList({ heading, items }: { heading: string; items: ReactNode[] }) {
  return (
    <div>
      <h4 className="hud text-[var(--gate)]">[{heading}]</h4>
      <ul className="mt-3 divide-y divide-line border-t border-line font-mono text-sm text-ice">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 py-3 leading-relaxed">
            <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-[var(--gate)]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function QuestLog() {
  return (
    <section
      id="record"
      aria-labelledby="record-title"
      className="gate-gold relative isolate overflow-hidden py-24 md:py-36"
    >
      <RankMark letter="03" className="-right-[4vw] top-4" />
      <span
        aria-hidden="true"
        className="vertical hud absolute left-6 top-1/2 hidden -translate-y-1/2 text-mute lg:block"
      >
        Gate 03 — Quest log
      </span>

      <div className="frame">
        <GateHeader
          id="record-title"
          gate="03"
          status="2020 – present"
          title="Quest log"
          subtitle="Completed and active quests. Real dates, real scope."
        />

        <motion.div
          variants={stagger()}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="mt-16 md:mt-24"
        >
          <SystemWindow title="Active quests" right="3 in progress" alert animate>
            <ul className="divide-y divide-line border-t border-line">
              {ACTIVE_QUESTS.map((q) => (
                <li
                  key={q.text}
                  className="flex flex-col gap-2 py-4 md:flex-row md:items-start md:justify-between md:gap-8"
                >
                  <span className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-3 w-3 shrink-0 border border-[var(--gate)] bg-[rgba(var(--gate-rgb),0.15)]"
                    />
                    <span className="leading-relaxed text-ice">{q.text}</span>
                  </span>
                  <span className="hud shrink-0 text-mute md:pt-1 md:text-right">{q.progress}</span>
                </li>
              ))}
            </ul>
            <p className="hud mt-5 text-mute">Reward — unknown until cleared.</p>
          </SystemWindow>
        </motion.div>

        <Board heading="Main quests · Work" quests={WORK} />
        <Board heading="Side quests · Study" quests={STUDY} />

        <motion.div
          variants={stagger()}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="mt-16 md:mt-24"
        >
          <motion.h3 variants={reveal} className="hud mb-6 text-[var(--gate)]">
            [Skills]
          </motion.h3>
          <SystemWindow title="Skills" right="From the resume" animate>
            <div className="grid gap-8 md:grid-cols-2">
              <SkillList heading="Active" items={SKILLS_ACTIVE} />
              <SkillList heading="Passive" items={SKILLS_PASSIVE} />
            </div>
          </SystemWindow>

          <motion.div variants={reveal} className="mt-10 flex justify-end">
            <a
              href={siteConfig.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-sys"
            >
              Resume — PDF ↗<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
