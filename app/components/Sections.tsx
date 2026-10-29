import Image from "next/image";
import type { ReactNode } from "react";
import { about, arc, education, experience, inkmity, offClock, projects, skills, type Link, type Project } from "../content";
import { siteConfig } from "../site";
import CopyEmail from "./CopyEmail";
import Expandable from "./Expandable";
import { ArrowUpRight, Diamond } from "./Icons";
import Reveal from "./Reveal";
import StickyLabel from "./StickyLabel";

const NEW_TAB = <span className="sr-only"> (opens in a new tab)</span>;

/** Section shell. On phones the label sticks to the top while its section scrolls by. */
function Section({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <section id={id} aria-label={label} className="scroll-mt-16 lg:scroll-mt-24">
      <StickyLabel>
        <h2 className="label">
          <span className="text-accent">
            <Diamond className="h-2 w-2" />
          </span>
          {label}
        </h2>
      </StickyLabel>
      {children}
    </section>
  );
}

function Tags({ items, className = "mt-3" }: { items: string[]; className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-1.5 ${className}`} aria-label="Technologies">
      {items.map((t) => (
        <li key={t} className="tag">
          {t}
        </li>
      ))}
    </ul>
  );
}

function ExtLinks({ links, note }: { links: Link[]; note?: string }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
      {links.map((l) => (
        <a
          key={l.href}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className="hit link-draw group/l inline-flex items-center gap-1 text-sm font-medium text-bright hover:text-accent-light"
        >
          {l.label}
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/l:-translate-y-0.5 group-hover/l:translate-x-0.5" />
          {NEW_TAB}
        </a>
      ))}
      {note && <span className="text-xs text-subtle">{note}</span>}
    </div>
  );
}

/** Detail block inside an expanded project. */
function More({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-bright">{title}</h4>
      <div className="mt-2 text-sm leading-relaxed">{children}</div>
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((b) => (
        <li key={b} className="flex gap-3">
          <span className="mt-[7px] text-accent">
            <Diamond className="h-1.5 w-1.5" />
          </span>
          <span className="lesser">{b}</span>
        </li>
      ))}
    </ul>
  );
}

function Problems({ items }: { items: { problem: string; approach: string }[] }) {
  return (
    <dl className="space-y-3">
      {items.map((p) => (
        <div key={p.problem}>
          <dt className="text-fg">{p.problem}</dt>
          <dd className="lesser mt-0.5">{p.approach}</dd>
        </div>
      ))}
    </dl>
  );
}

/** A card that lifts onto a soft surface on hover (desktop). */
const CARD =
  "group relative rounded-2xl transition-colors duration-300 lg:-mx-5 lg:p-5 lg:hover:bg-surface/70 lg:hover:shadow-[inset_0_1px_0_0_rgb(255_255_255/0.04),0_20px_50px_-30px_rgb(var(--accent)/0.35)]";

export function About() {
  return (
    <Section id="about" label="About">
      <Reveal className="space-y-4 leading-relaxed">
        {about.map((p, i) => (
          <p key={i} className="lesser">
            {i === 0 ? (
              <>
                {p.split("Inkmity")[0]}
                <a href="#projects" className="font-medium text-bright link-underline">
                  Inkmity
                </a>
                {p.split("Inkmity")[1]}
              </>
            ) : (
              p
            )}
          </p>
        ))}
        <p className="border-l-2 border-accent/50 pl-4 font-serif text-xl italic leading-snug text-fg">{offClock}</p>
      </Reveal>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Projects                                                           */
/* ------------------------------------------------------------------ */

type Row = {
  key: string;
  name: string;
  meta: string;
  badge?: string;
  line: string;
  part: string;
  tags: string[];
  links: Link[];
  note?: string;
  image: { src: string; alt: string };
  more: ReactNode;
};

const fromProject = (p: Project): Row => ({
  key: p.name,
  name: p.name,
  meta: `${p.kind} · ${p.year}`,
  line: p.summary,
  part: p.part,
  tags: p.stack,
  links: p.links,
  image: p.image,
  more: (
    <More title="The hard part">
      <p className="lesser">{p.challenge}</p>
    </More>
  ),
});

const ROWS: Row[] = [
  {
    key: "inkmity",
    ...inkmity,
    more: (
      <>
        <More title="What I built">
          <Bullets items={inkmity.built} />
        </More>
        <More title="The payment flow">
          <p className="lesser">
            Inkmity is the merchant of record. Clients pay a flat $10 per booking, the first one free; artists pay nothing
            and tips go 100% to the artist.
          </p>
          <ol className="mt-2 space-y-1.5">
            {inkmity.moneyPath.map((m, i) => (
              <li key={m.title} className="flex gap-3">
                <span className="w-4 shrink-0 font-serif text-base leading-5 text-accent-light">{i + 1}</span>
                <span className="lesser">
                  <span className="text-fg">{m.title}.</span> {m.text}
                </span>
              </li>
            ))}
          </ol>
        </More>
        <More title="Architecture">
          <ul className="space-y-1.5">
            {inkmity.architecture.map((a) => (
              <li key={a.tier} className="lesser">
                <span className="text-fg">{a.tier}</span> <span className="text-subtle">({a.host})</span>: {a.text}
              </li>
            ))}
          </ul>
          <p className="lesser mt-2">{inkmity.services}</p>
        </More>
        <More title="Problems and how I solved them">
          <Problems items={inkmity.problems} />
        </More>
      </>
    ),
  },
  {
    key: "arc",
    ...arc,
    more: (
      <>
        <More title="What I built">
          <Bullets items={arc.built} />
          <p className="mt-2 text-subtle">{arc.credit}</p>
        </More>
        <More title="Problems and how I solved them">
          <Problems items={arc.problems} />
        </More>
      </>
    ),
  },
  ...projects.slice(0, 2).map(fromProject),
];

function ProjectRow({ r }: { r: Row }) {
  return (
    <Reveal as="li" className={`${CARD} grid items-start gap-4 sm:grid-cols-[9rem_1fr] sm:gap-6`}>
      <div
        className={`order-2 self-start overflow-hidden rounded-lg border border-border sm:order-1 sm:mt-1 ${
          r.key === "inkmity" ? "" : "hidden sm:block"
        }`}
      >
        <Image
          src={r.image.src}
          alt={r.image.alt}
          width={480}
          height={300}
          sizes="(max-width: 640px) 100vw, 144px"
          priority={r.key === "inkmity"}
          className="aspect-[16/10] h-auto w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="order-1 min-w-0 sm:order-2">
        <h3 className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <span className="font-serif text-2xl leading-none text-bright">{r.name}</span>
          {r.badge && (
            <span className="inline-flex items-center gap-1.5 self-center rounded-full border border-accent/40 px-2 py-px text-[11px] font-medium uppercase tracking-wider text-accent-light">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
              {r.badge}
            </span>
          )}
          <span className="glint text-xs">{r.meta}</span>
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-fg">{r.line}</p>
        <p className="lesser mt-1.5 text-sm leading-relaxed">{r.part}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
          <Tags items={r.tags.slice(0, 5)} className="" />
          <ExtLinks links={r.links} note={r.note} />
        </div>
        <Expandable label={`More about ${r.name}`}>
          <div className="mt-4 space-y-5 border-l border-accent/30 pl-4">{r.more}</div>
        </Expandable>
      </div>
    </Reveal>
  );
}

export function Projects() {
  return (
    <Section id="projects" label="Projects">
      <ul className="space-y-10 lg:space-y-1">
        {ROWS.map((r) => (
          <ProjectRow key={r.key} r={r} />
        ))}
      </ul>

      {/* Smaller builds: one line each, expandable like the rest */}
      <Reveal className="mt-12">
        <h3 className="label text-subtle">Also built</h3>
        <ul className="mt-4 divide-y divide-border border-y border-border">
          {projects.slice(2).map((p) => (
            <li key={p.name} className="group py-3">
              <div className="grid grid-cols-[1fr_auto] items-baseline gap-x-6">
                <p className="min-w-0 text-sm">
                  <span className="font-medium text-bright transition-colors group-hover:text-accent-light">{p.name}</span>
                  <span className="glint"> · {p.year}</span>
                  <span className="lesser block sm:inline">
                    <span className="hidden sm:inline"> · </span>
                    {p.summary}
                  </span>
                </p>
                <ExtLinks links={p.links} />
              </div>
              <Expandable label="More">
                <div className="mt-3 space-y-3 border-l border-accent/30 pl-4 text-sm">
                  <p className="lesser">{p.part}</p>
                  <p className="lesser">
                    <span className="text-fg">The hard part:</span> {p.challenge}
                  </p>
                  <Tags items={p.stack} className="" />
                </div>
              </Expandable>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Timelines                                                          */
/* ------------------------------------------------------------------ */

type Stop = {
  key: string;
  dates: string;
  title: ReactNode;
  sub: string;
  body: string;
  tags?: string[];
  current?: boolean;
};

/** A vertical timeline: a line that fades downward, a diamond at each stop, the present one lit. */
function Timeline({ stops }: { stops: Stop[] }) {
  return (
    <ol className="relative">
      <span
        aria-hidden="true"
        className="absolute bottom-2 left-[7px] top-2 w-px bg-gradient-to-b from-accent/80 via-border to-transparent"
      />
      {stops.map((s) => (
        <Reveal as="li" key={s.key} className="group relative pb-10 pl-9 last:pb-0">
          <span aria-hidden="true" className="absolute left-0 top-1 flex h-[15px] w-[15px] items-center justify-center">
            {s.current && <span className="absolute h-2.5 w-2.5 rotate-45 bg-accent/60 motion-safe:animate-ping" />}
            <span
              className={`relative h-2.5 w-2.5 rotate-45 border border-accent transition-colors duration-300 ${
                s.current ? "bg-accent" : "bg-bg group-hover:bg-accent/50"
              }`}
            />
          </span>
          <p className="glint text-xs font-semibold uppercase tracking-[0.12em]">{s.dates}</p>
          <h3 className="mt-1.5 font-medium leading-snug text-bright">{s.title}</h3>
          <p className="text-xs text-subtle">{s.sub}</p>
          <p className="lesser mt-2 text-sm leading-relaxed">{s.body}</p>
          {s.tags && <Tags items={s.tags} />}
        </Reveal>
      ))}
    </ol>
  );
}

export function Experience() {
  const jobs: Stop[] = experience.map((j) => ({
    key: j.org,
    dates: j.dates,
    current: j.current,
    sub: j.type,
    body: j.summary,
    tags: j.tags,
    title: j.href ? (
      <a
        href={j.href}
        target="_blank"
        rel="noopener noreferrer"
        className="hit transition-colors group-hover:text-accent-light"
      >
        {j.title} · {j.org}
        <ArrowUpRight className="ml-1 inline h-3.5 w-3.5 -translate-y-px" />
        {NEW_TAB}
      </a>
    ) : (
      <span className="transition-colors group-hover:text-accent-light">
        {j.title} · {j.org}
      </span>
    ),
  }));
  const schools: Stop[] = education.map((e) => ({
    key: e.school,
    dates: e.dates,
    current: e.current,
    sub: e.degree,
    body: e.summary,
    title: <span className="transition-colors group-hover:text-accent-light">{e.school}</span>,
  }));

  return (
    <Section id="experience" label="Experience">
      <Timeline stops={jobs} />

      <a
        href={siteConfig.resume}
        target="_blank"
        rel="noopener noreferrer"
        className="hit link-draw group/r mt-12 inline-flex items-center gap-1.5 font-medium text-bright hover:text-accent-light"
      >
        View full résumé
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover/r:-translate-y-0.5 group-hover/r:translate-x-0.5" />
        <span className="sr-only"> (PDF, opens in a new tab)</span>
      </a>

      <div className="mt-16">
        <h3 className="label mb-6 text-subtle">Education</h3>
        <Timeline stops={schools} />
      </div>

      <Reveal className="mt-16">
        <h3 className="label text-subtle">Toolbox</h3>
        <dl className="mt-5 space-y-3">
          {skills.map((s) => (
            <div key={s.group} className="group grid gap-1 sm:grid-cols-[10rem_1fr] sm:gap-6">
              <dt className="pt-0.5 text-xs font-semibold uppercase tracking-[0.12em] text-subtle transition-colors group-hover:text-accent-light">
                {s.group}
              </dt>
              <dd className="lesser text-sm leading-relaxed">{s.items.join(" · ")}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </Section>
  );
}

export function Contact() {
  const mailto = `mailto:${siteConfig.email}`;
  return (
    <Section id="contact" label="Contact">
      <Reveal>
        <p className="font-serif text-4xl leading-tight text-bright sm:text-5xl">
          Let&rsquo;s build <em className="text-accent">something</em>.
        </p>
        <p className="lesser mt-4 max-w-md leading-relaxed">
          Hiring a software engineering intern or co-op? I can start right away, and I&rsquo;m applying for Summer 2027
          too. Email is the fastest way to reach me.
        </p>
        <a href={mailto} className="mt-6 inline-block break-all text-lg font-medium text-bright link-underline">
          {siteConfig.email}
        </a>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={mailto} className="btn-primary">
            Email me
          </a>
          <CopyEmail email={siteConfig.email} />
        </div>
      </Reveal>
      <footer className="mt-24 max-w-md pb-12 text-sm leading-relaxed text-subtle">
        Designed and built by Jason Zhang with Next.js, Tailwind CSS and Claude Code. Set in{" "}
        <span className="font-serif text-base italic text-muted">Instrument Serif</span> and Inter.
      </footer>
    </Section>
  );
}
