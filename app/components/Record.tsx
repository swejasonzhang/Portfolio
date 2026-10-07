import Gate from "./Gate";
import { siteConfig } from "../site";

type Entry = {
  period: string;
  /** Second line under the period, e.g. "Expected May 2029". */
  periodNote?: string;
  where: string;
  title: string;
  org: string;
  summary: string;
  details: string[];
  current?: boolean;
};

const WORK: Entry[] = [
  {
    period: "Aug 2025 – Present",
    where: "Self-employed · New York",
    title: "Founder & Software Developer",
    org: "Inkmity",
    summary:
      "Founded and launched an early-stage booking app for tattoo artists, live since July 2026.",
    details: [
      "Built the first version myself, Aug 2025 – Jan 2026",
      "Since June 2026: built with Claude Code, an AI coding agent; I test and approve every release",
      "Deploy and run it on Render and Vercel",
    ],
    current: true,
  },
  {
    period: "Feb 2025 – Jul 2025",
    where: "Contract · Remote",
    title: "Software Engineer",
    org: "Move Tact Management",
    summary:
      "Wrote Python scripts that pull social media metrics into Google Sheets for a 10+ person marketing team.",
    details: [
      "Sole author of 19 Python scripts across 108 commits",
      "TikTok, Instagram and YouTube metrics from the Ensemble Data and Chartmetric APIs",
      "Slack notifications, plus a small Node.js, Express and React web app",
    ],
  },
  {
    period: "Nov 2024 – Feb 2025",
    where: "Internship · Remote",
    title: "Software Engineer Intern",
    org: "Series",
    summary:
      "Built backend endpoints and Twilio integrations on a 3-person engineering team with the CTO.",
    details: [
      "Opened 50+ pull requests, working through code review",
      "Node.js and Firebase backend endpoints",
      "Twilio integrations for Vera, the company's communications bot",
    ],
  },
  {
    period: "Jul 2024 – Oct 2024",
    where: "Fellowship · Remote",
    title: "Software Engineering Fellow",
    org: "Headstarter AI",
    summary: "Built team projects with Next.js, React, Clerk and Vercel.",
    details: [
      "ProfScore: the professor search page and its API route",
      "Calmify: the first Stripe Checkout route, Clerk setup and OpenAI flashcard prompt",
      "Calmify's landing page and flashcard flip and swipe UI",
    ],
  },
];

const STUDY: Entry[] = [
  {
    period: "Fall 2026 – Present",
    periodNote: "Expected May 2029",
    where: "Degree · CUNY",
    title: "B.S. in Computer Science",
    org: "Queens College (CUNY)",
    summary:
      "Evening classes; currently taking C++ programming. Open to a software engineering internship or co-op alongside the degree, and I can start right away.",
    details: ["Evening classes", "Currently taking C++ programming", "Open to an internship or co-op; can start right away"],
    current: true,
  },
  {
    period: "Aug 2023 – Dec 2023",
    where: "Certificate",
    title: "Full-Stack Software Engineering Certificate",
    org: "App Academy",
    summary:
      "Full-stack program in JavaScript, React, Redux, Ruby on Rails, PostgreSQL, MongoDB, Express and Node.js. Capstone: Amazeon, a solo online store.",
    details: [
      "JavaScript, React, Redux",
      "Ruby on Rails, PostgreSQL, MongoDB, Express and Node.js",
      "Capstone: Amazeon, a solo online store",
    ],
  },
  {
    period: "2020 – 2022",
    where: "Coursework · CUNY",
    title: "Computer Science Coursework",
    org: "College of Staten Island (CUNY)",
    summary: "Computer science coursework, transferred to Queens College.",
    details: ["Transferred to Queens College"],
  },
];

const HANDS: { group: string; items: string }[] = [
  { group: "Languages", items: "JavaScript, TypeScript, Python, HTML, CSS, Ruby, C++." },
  {
    group: "Web",
    items:
      "React, Redux, Tailwind CSS, Node.js, Express.js, REST APIs, Socket.IO, MongoDB, PostgreSQL, Ruby on Rails, Firebase.",
  },
  {
    group: "Integrations",
    items:
      "Stripe Checkout, Stripe webhooks, Clerk, Cloudinary, Twilio, Google Places, Google Sheets, Slack.",
  },
  {
    group: "Cloud and tools",
    items: "Claude Code, AI-assisted development, Git, GitHub, Render, Vercel, MongoDB Atlas.",
  },
];

function Row({ entry, index, total }: { entry: Entry; index: number; total: number }) {
  const last = index === total - 1;
  return (
    <li
      className={`grid grid-cols-1 gap-4 border-t border-line py-8 md:grid-cols-12 md:gap-6 ${
        last ? "border-b" : ""
      }`}
    >
      {/* Period */}
      <div className="md:col-span-3">
        <p className="flex flex-wrap items-baseline gap-x-3 font-mono text-2xs uppercase tracking-label text-ash md:block md:font-serif md:normal-case md:tracking-normal md:text-display-sm md:text-washi">
          <span className="whitespace-nowrap">{entry.period}</span>
          {entry.current && (
            <span className="font-mono text-2xs uppercase tracking-label text-shu md:ml-3">Current</span>
          )}
        </p>
        {entry.periodNote && (
          <p className="mt-1 font-mono text-2xs uppercase tracking-label text-ash">{entry.periodNote}</p>
        )}
        <p className="mt-1 font-mono text-2xs uppercase tracking-label text-ash">{entry.where}</p>
      </div>

      {/* Title block */}
      <div className="md:col-span-5">
        <h4 className="font-serif text-display-md text-washi">{entry.title}</h4>
        <p className="mt-1 text-base text-washi/90">{entry.org}</p>
        <p className="mt-3 max-w-[52ch] text-pretty text-ash leading-relaxed">{entry.summary}</p>
      </div>

      {/* Details */}
      <ul className="space-y-2 md:col-span-4 md:pt-2">
        {entry.details.map((d) => (
          <li key={d} className="flex gap-3 font-mono text-2xs uppercase tracking-label text-ash">
            <span
              aria-hidden="true"
              className={`mt-[5px] h-[7px] w-[7px] shrink-0 rotate-45 ${
                entry.current ? "bg-shu" : "bg-line-strong"
              }`}
            />
            <span className="leading-relaxed">{d}</span>
          </li>
        ))}
      </ul>
    </li>
  );
}

function Register({ head, entries }: { head: string; entries: Entry[] }) {
  return (
    <div className="relative mt-16 first:mt-0 md:grid md:grid-cols-12 md:gap-6">
      <h3 className="mb-6 font-serif text-display-sm italic text-ash md:col-span-1 md:mb-0 md:pt-8">
        {head}
      </h3>
      <ol className="md:col-span-11">
        {entries.map((e, i) => (
          <Row key={e.title + e.period} entry={e} index={i} total={entries.length} />
        ))}
      </ol>
    </div>
  );
}

export default function Record() {
  return (
    <section id="record" aria-labelledby="record-title" className="relative isolate py-28 md:py-40">
      <span
        aria-hidden="true"
        className="vertical absolute left-6 top-1/2 hidden -translate-y-1/2 font-mono text-2xs uppercase tracking-kicker text-ash lg:block"
      >
        IV — Record
      </span>

      <div className="frame">
        <Gate id="record-title" numeral="IV" title="Record" kicker="Work and study · 2020 – present" />

        <Register head="Work" entries={WORK} />
        <Register head="Study" entries={STUDY} />

        {/* Hands */}
        <div className="mt-16 md:grid md:grid-cols-12 md:gap-6">
          <h3 className="mb-6 font-serif text-display-sm italic text-ash md:col-span-1 md:mb-0 md:pt-8">
            Hands
          </h3>
          <div className="border-b border-t border-line py-8 md:col-span-11">
            <p className="max-w-[80ch] font-mono text-2xs uppercase leading-loose tracking-label text-ash">
              {HANDS.map((h, i) => (
                <span key={h.group}>
                  <span className="text-washi">{h.group}</span> — {h.items}
                  {i < HANDS.length - 1 ? " " : ""}
                </span>
              ))}
            </p>
          </div>
        </div>

        <div className="mt-10 flex justify-end">
          <a
            href={siteConfig.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            Resume — PDF
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </div>
    </section>
  );
}
