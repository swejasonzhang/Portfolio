"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import SectionHeader from "./SectionHeader";
import { materialize, reveal, stagger, VIEWPORT } from "../lib/motion";

type Quest = "inkmity" | "arc" | "movetact" | "series" | "amazeon" | "bonjour" | "headstarter" | "secondbrain" | "tanks";

const QUESTS: { id: Quest; label: string }[] = [
  { id: "inkmity", label: "Inkmity" },
  { id: "arc", label: "Arc" },
  { id: "movetact", label: "Move Tact" },
  { id: "series", label: "Series" },
  { id: "headstarter", label: "Headstarter" },
  { id: "amazeon", label: "Amazeon" },
  { id: "bonjour", label: "Bonjour World" },
  { id: "secondbrain", label: "Second Brain" },
  { id: "tanks", label: "Battlefield: Tanks" },
];

const NAME: Record<Quest, string> = Object.fromEntries(QUESTS.map((q) => [q.id, q.label])) as Record<Quest, string>;

type Skill = { name: string; used: Quest[] };
type Group = { n: string; title: string; span: string; skills: Skill[] };

const GROUPS: Group[] = [
  {
    n: "I",
    title: "Frontend",
    span: "lg:col-span-4",
    skills: [
      { name: "React", used: ["inkmity", "arc", "amazeon", "bonjour", "headstarter", "movetact"] },
      { name: "TypeScript", used: ["inkmity", "arc", "secondbrain"] },
      { name: "JavaScript", used: ["bonjour", "tanks", "movetact"] },
      { name: "Redux", used: ["amazeon"] },
      { name: "Tailwind CSS", used: ["inkmity", "arc"] },
      { name: "HTML & CSS", used: ["tanks", "amazeon", "bonjour"] },
    ],
  },
  {
    n: "II",
    title: "Backend & APIs",
    span: "lg:col-span-4",
    skills: [
      { name: "Node.js", used: ["inkmity", "arc", "series", "bonjour", "movetact"] },
      { name: "Express", used: ["inkmity", "arc", "bonjour", "movetact"] },
      { name: "REST APIs", used: ["inkmity", "series", "movetact"] },
      { name: "Socket.IO", used: ["inkmity"] },
      { name: "Ruby on Rails", used: ["amazeon"] },
      { name: "Python", used: ["movetact"] },
      { name: "Firebase", used: ["series"] },
    ],
  },
  {
    n: "III",
    title: "Databases",
    span: "lg:col-span-4",
    skills: [
      { name: "MongoDB", used: ["inkmity", "arc", "bonjour", "movetact"] },
      { name: "MongoDB Atlas", used: ["inkmity", "arc"] },
      { name: "PostgreSQL", used: ["amazeon", "secondbrain"] },
    ],
  },
  {
    n: "IV",
    title: "Payments & integrations",
    span: "lg:col-span-7",
    skills: [
      { name: "Stripe Checkout & webhooks", used: ["inkmity", "movetact", "headstarter"] },
      { name: "Clerk", used: ["inkmity", "headstarter", "secondbrain"] },
      { name: "Cloudinary", used: ["inkmity"] },
      { name: "Twilio", used: ["series"] },
      { name: "Google Places", used: ["bonjour"] },
      { name: "Google Sheets & Drive", used: ["movetact"] },
      { name: "Slack API", used: ["movetact"] },
      { name: "Ensemble Data & Chartmetric", used: ["movetact"] },
    ],
  },
  {
    n: "V",
    title: "Infrastructure & deployment",
    span: "lg:col-span-5",
    skills: [
      { name: "Git & GitHub", used: ["inkmity", "arc", "series", "movetact", "amazeon", "bonjour", "headstarter"] },
      { name: "Render", used: ["inkmity", "arc"] },
      { name: "Vercel", used: ["inkmity", "headstarter", "secondbrain"] },
      { name: "Claude Code", used: ["inkmity", "arc", "secondbrain"] },
    ],
  },
];

const LANGUAGES = ["JavaScript", "TypeScript", "Python", "Ruby", "HTML", "CSS", "C++ (learning now)"];

const PRACTICES: { k: string; v: string }[] = [
  { k: "Code review", v: "50+ pull requests at Series, worked through review with the CTO" },
  { k: "Testing by hand", v: "Every Inkmity release tested in the live app before I approve it" },
  { k: "Running production", v: "Environment variables, the live Stripe webhook, database scripts, deploy and server logs" },
  { k: "Product", v: "Interviewed a New York studio, pitched 10+ shops in person, set Inkmity's pricing" },
];

/**
 * Gate 02 — Abilities. Skills grouped the way the work uses them, each with
 * where it was used. Choosing a quest lights the abilities it needed. No
 * percentages: a skill is listed because a real project used it.
 */
export default function Skills() {
  const [quest, setQuest] = useState<Quest | null>(null);

  return (
    <section id="skills" aria-labelledby="skills-title" className="gate-violet relative isolate py-28 md:py-40">
      <div className="frame">
        <SectionHeader
          index={2}
          id="skills-title"
          title="Skills"
          lead="Every ability here was used on a real project. Pick a quest to see what it took."
        />

        <motion.div variants={stagger(0.05)} initial="hidden" whileInView="visible" viewport={VIEWPORT} className="mt-14" role="group" aria-label="Show the skills used on a project">
          <motion.p variants={reveal} className="hud text-mute">
            Quests
          </motion.p>
          <div className="mt-4 flex flex-wrap gap-2">
            <motion.button
              variants={reveal}
              type="button"
              aria-pressed={quest === null}
              onClick={() => setQuest(null)}
              className={`chamfer cut-edge min-h-10 px-4 font-mono text-xs font-semibold uppercase tracking-label ring-1 ring-inset transition-colors duration-500 ${
                quest === null ? "bg-[rgba(var(--gate-rgb),0.2)] text-ice ring-[rgba(var(--gate-rgb),0.7)]" : "bg-void-2/70 text-silver-2 ring-line hover:text-ice"
              }`}
            >
              All
            </motion.button>
            {QUESTS.map((q) => (
              <motion.button
                key={q.id}
                variants={reveal}
                type="button"
                aria-pressed={quest === q.id}
                onClick={() => setQuest((cur) => (cur === q.id ? null : q.id))}
                className={`chamfer cut-edge min-h-10 px-4 font-mono text-xs font-semibold uppercase tracking-label ring-1 ring-inset transition-colors duration-500 ${
                  quest === q.id ? "bg-[rgba(var(--gate-rgb),0.2)] text-ice ring-[rgba(var(--gate-rgb),0.7)]" : "bg-void-2/70 text-silver-2 ring-line hover:text-ice"
                }`}
              >
                {q.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <div className="mt-14 grid gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-12">
          {GROUPS.map((g) => (
            <motion.div key={g.title} variants={stagger(0.06)} initial="hidden" whileInView="visible" viewport={VIEWPORT} className={`${g.span} relative`}>
              <motion.div variants={reveal} className="flex items-baseline gap-4 border-b border-[rgba(var(--gate-rgb),0.4)] pb-3">
                <span className="display text-lg text-[var(--gate)]">{g.n}</span>
                <h3 className="display text-display-md text-ice">{g.title}</h3>
              </motion.div>
              <ul className={`mt-2 ${g.skills.length > 5 && g.span.includes("7") ? "lg:columns-2 lg:gap-x-10" : ""}`}>
                {g.skills.map((s) => {
                  const on = quest === null || s.used.includes(quest);
                  const lit = quest !== null && s.used.includes(quest);
                  return (
                    <motion.li key={s.name} variants={materialize} className="break-inside-avoid border-b border-line-hair">
                      <div className={`group flex items-start gap-3 py-3 transition-opacity duration-500 ${on ? "opacity-100" : "opacity-25"}`}>
                      <span
                        aria-hidden="true"
                        className={`mt-2 h-2 w-2 shrink-0 rotate-45 border transition-all duration-500 ${
                          lit ? "border-[var(--gate)] bg-[var(--gate)] shadow-[0_0_12px_var(--gate)]" : "border-silver-2 group-hover:border-[var(--gate)]"
                        }`}
                      />
                      <span>
                        <span className="block text-lg leading-tight text-ice">{s.name}</span>
                        <span className="mt-1 block text-sm text-mute">{s.used.map((u) => NAME[u]).join(" · ")}</span>
                      </span>
                      </div>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div variants={stagger(0.06)} initial="hidden" whileInView="visible" viewport={VIEWPORT} className="mt-20 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <motion.p variants={reveal} className="hud text-[var(--gate)]">
              Languages
            </motion.p>
            <motion.p variants={reveal} className="mt-4 display text-2xl leading-snug text-silver md:text-3xl">
              {LANGUAGES.join(" · ")}
            </motion.p>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <motion.p variants={reveal} className="hud text-[var(--gate)]">
              Passive skills
            </motion.p>
            <dl className="mt-4">
              {PRACTICES.map((p) => (
                <motion.div key={p.k} variants={reveal} className="grid gap-1 border-b border-line py-3.5 sm:grid-cols-[11rem_1fr] sm:gap-6">
                  <dt className="hud pt-1 text-silver">{p.k}</dt>
                  <dd className="text-ice-2">{p.v}</dd>
                </motion.div>
              ))}
            </dl>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
