"use client";

import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import { reveal, rise, stagger, VIEWPORT } from "../lib/motion";

type Step = { when: string; where: string; role: string; lines: string[]; now?: boolean; quiet?: boolean };

/** The climb, oldest first. Roles, dates and numbers match the résumé. */
const CLIMB: Step[] = [
  {
    when: "2020 – 2022",
    where: "College of Staten Island (CUNY)",
    role: "Computer science coursework",
    lines: ["Where it started. I later transferred to Queens College."],
  },
  {
    when: "Aug – Dec 2023",
    where: "App Academy",
    role: "Full-Stack Software Engineering Certificate",
    lines: ["Built Amazeon alone across 167 commits, and Bonjour World with a team of four, where I opened and merged 15 pull requests."],
  },
  {
    when: "Jul – Oct 2024",
    where: "Headstarter AI",
    role: "Software Engineering Fellow",
    lines: ["Team projects in Next.js: ProfScore's search page and API route, and Calmify's first Stripe, Clerk and OpenAI wiring, landing page and flashcard UI."],
  },
  {
    when: "Nov 2024 – Feb 2025",
    where: "Series",
    role: "Software Engineer Intern",
    lines: [
      "A three-person engineering team with the CTO. I opened 50+ pull requests and worked through code review.",
      "Node.js and Firebase backend endpoints, and Twilio integrations for Vera, the company's communications bot.",
    ],
  },
  {
    when: "Feb – Jul 2025",
    where: "Move Tact Management",
    role: "Software Engineer, contract",
    lines: [
      "Sole author of 19 Python scripts (108 commits) pulling TikTok, Instagram, YouTube and X metrics into Google Sheets for a 10+ person marketing team, plus a Slack-to-Google Drive script that filed every campaign's videos.",
      "A MERN dashboard app (101 commits) and a creator-voting site with Stripe Checkout and an embedded Twitch stream.",
    ],
  },
  {
    when: "Aug 2025 – Jan 2026",
    where: "Inkmity",
    role: "Founder, first version by hand",
    lines: ["Wrote the first version alone, 530+ commits, from sign-in to the Stripe deposit and its webhook."],
  },
  {
    when: "Jan – May 2026",
    where: "A break",
    role: "Travel",
    lines: ["Time away after finishing the first version."],
    quiet: true,
  },
  {
    when: "Jun – Jul 2026",
    where: "Inkmity",
    role: "Back, with Claude Code; then launch",
    lines: [
      "I specify each feature and fix, test it by hand in the live app and approve every release.",
      "Refocused from a marketplace to a booking tool artists link from Instagram, interviewed a New York studio, pitched 10+ shops in person and set the pricing. Live since July 2026.",
    ],
  },
  {
    when: "Fall 2026",
    where: "Queens College (CUNY)",
    role: "B.S. in Computer Science, expected June 2028",
    lines: ["Evening classes, C++ this term, so my days are free for an internship or co-op."],
  },
  {
    when: "Oct 2026",
    where: "Hackknight 2026",
    role: "Arc, in 48 hours",
    lines: ["A webcam range-of-motion coach with a team of three. I built the web app and API."],
  },
  {
    when: "Now",
    where: "The next gate",
    role: "Looking for a software engineering internship or co-op",
    lines: ["Available now, and for Summer 2027. New York City or Philadelphia preferred; anywhere in the US works."],
    now: true,
  },
];

const MARKS: { name: string; source: string; body: string }[] = [
  {
    name: "The Fan",
    source: "Solo Leveling",
    body: "Solo Leveling is one of my tattoos, so there is no hiding it: I am a fan. What stuck with me is not the power, it is the grind from the bottom, one run at a time, with nobody watching. That is what building alone has felt like, and I would rather earn the next rank than be handed it.",
  },
  {
    name: "The Current",
    source: "Koi",
    body: "The koi are about movement. I want interfaces that move like water: real-time chat in Inkmity that lands the moment it is sent, transitions instead of hard cuts, nothing that jolts you out of what you were doing. If a screen feels still, I have not finished it.",
  },
  {
    name: "The Mask",
    source: "Hannya",
    body: "The Hannya is intensity with a face on it. For me that means caring about the parts nobody sees: when I am unsure a feature belongs, I freeze it behind a flag instead of deleting it. Image and review moderation fails closed. Every release is tested by hand in the live app before it ships. Caring that hard is the point.",
  },
  {
    name: "The Guardians",
    source: "Foo Dogs",
    body: "Twin Foo Dogs sit on my shoulders, one on each side, and that is how I treat the gates I refuse to ship without. Waivers are enforced on the client and the server. Webhook signatures are verified. After a red job once made it out, every deploy is gated on green CI.",
  },
];

/**
 * Gate 03 — the climb. Who I am, the path so far as one continuous ascent
 * (experience and education, in order), the four marks I carry, and the line
 * I build by.
 */
export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="gate-silver relative isolate py-28 md:py-40">
      <div className="frame">
        <SectionHeader index={3} id="about-title" title="About" />

        <motion.div variants={stagger(0.14)} initial="hidden" whileInView="visible" viewport={VIEWPORT} className="mt-12 grid gap-10 lg:grid-cols-12">
          <motion.p variants={reveal} className="scrim -mx-6 px-6 py-3 text-pretty text-2xl leading-snug text-ice md:text-[2rem] md:leading-[1.25] lg:col-span-9">
            I&rsquo;m Jason, a computer science student in New York who builds products. I like making the thing and then
            taking it to the people it&rsquo;s for: I pitched Inkmity to more than ten shops in person and sat down with a
            studio to hear how booking actually breaks for them.
          </motion.p>
        </motion.div>

        {/* The climb */}
        <div className="mt-24 md:mt-32">
          <motion.div variants={stagger(0.1)} initial="hidden" whileInView="visible" viewport={VIEWPORT} className="flex items-center gap-4 hud">
            <motion.span variants={reveal} className="text-[var(--gate)]">
              The climb
            </motion.span>
            <motion.span variants={reveal} className="text-mute">
              Experience and education, oldest first
            </motion.span>
            <span aria-hidden="true" className="h-px flex-1 bg-line" />
          </motion.div>

          <ol className="relative mt-10">
            {/* the path: a hairline that brightens toward the present */}
            <span aria-hidden="true" className="absolute bottom-0 left-[7px] top-0 w-px bg-gradient-to-b from-line via-[rgba(var(--gate-rgb),0.45)] to-sys md:left-[calc(25%+7px)]" />
            {CLIMB.map((s) => (
              <motion.li
                key={`${s.when}-${s.where}`}
                variants={stagger(0.08)}
                initial="hidden"
                whileInView="visible"
                viewport={VIEWPORT}
                className={`relative grid gap-2 pb-12 pl-10 md:grid-cols-4 md:gap-10 md:pl-0 ${s.quiet ? "opacity-70" : ""}`}
              >
                <motion.p variants={reveal} className={`hud pt-1.5 md:pr-10 md:text-right ${s.now ? "text-sys" : "text-silver-2"}`}>
                  {s.when}
                </motion.p>
                <span
                  aria-hidden="true"
                  className={`absolute left-[2px] top-1.5 h-3 w-3 rotate-45 border md:left-[calc(25%+2px)] ${
                    s.now ? "border-sys bg-sys shadow-[0_0_18px_var(--sys)]" : "border-silver-2 bg-void"
                  }`}
                />
                <div className="md:col-span-3 md:pl-12">
                  <motion.h3 variants={reveal} className={`display text-display-sm tracking-wide ${s.now ? "glow-text text-sys-bright" : "text-ice"}`}>
                    {s.where}
                  </motion.h3>
                  <motion.p variants={reveal} className="mt-1 text-silver">
                    {s.role}
                  </motion.p>
                  {s.lines.map((l) => (
                    <motion.p key={l} variants={reveal} className="mt-3 max-w-[68ch] leading-relaxed text-ice-2">
                      {l}
                    </motion.p>
                  ))}
                </div>
              </motion.li>
            ))}
          </ol>
        </div>

        {/* The marks */}
        <div className="mt-20 md:mt-28">
          <motion.div variants={stagger(0.1)} initial="hidden" whileInView="visible" viewport={VIEWPORT} className="flex items-center gap-4 hud">
            <motion.span variants={reveal} className="text-[var(--gate)]">
              The marks I carry
            </motion.span>
            <motion.span variants={reveal} className="text-mute">
              Four tattoos, and what they do to how I build
            </motion.span>
            <span aria-hidden="true" className="h-px flex-1 bg-line" />
          </motion.div>
          <div className="mt-6 grid md:grid-cols-2">
            {MARKS.map((m, i) => (
              <motion.article
                key={m.name}
                variants={stagger(0.1)}
                initial="hidden"
                whileInView="visible"
                viewport={VIEWPORT}
                className={`relative overflow-hidden border-line py-10 md:px-10 ${i % 2 === 0 ? "md:border-r md:pl-0" : "md:pr-0"} ${i < 2 ? "border-b" : "border-b md:border-b-0"}`}
              >
                <motion.p variants={reveal} aria-hidden="true" className="hollow display pointer-events-none select-none text-[clamp(3.5rem,2rem+5vw,6.5rem)] leading-[0.85]">
                  {m.source}
                </motion.p>
                <motion.h3 variants={reveal} className="mt-5 display text-display-sm tracking-wide text-ice">
                  {m.name} <span className="text-mute">· {m.source}</span>
                </motion.h3>
                <motion.p variants={reveal} className="mt-3 max-w-[56ch] leading-relaxed text-ice-2">
                  {m.body}
                </motion.p>
              </motion.article>
            ))}
          </div>
        </div>

        <motion.p variants={stagger(0.1)} initial="hidden" whileInView="visible" viewport={VIEWPORT} className="mt-24 display text-display-lg text-balance text-ice md:mt-32">
          <motion.span variants={rise} className="block">
            I level up the only way that counts: <span className="text-sys glow-text">by shipping.</span>
          </motion.span>
        </motion.p>
      </div>
    </section>
  );
}
