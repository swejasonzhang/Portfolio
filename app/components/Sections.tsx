import Image from "next/image";
import type { ReactNode } from "react";
import { about, arc, education, experience, inkmity, offClock, projects, skills, type Link } from "../content";
import { siteConfig } from "../site";
import CopyEmail from "./CopyEmail";
import { ArrowUpRight, Diamond } from "./Icons";
import Reveal from "./Reveal";

const NEW_TAB = <span className="sr-only"> (opens in a new tab)</span>;

/** Section shell. On phones the label sticks to the top while its section scrolls by. */
function Section({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <section id={id} aria-label={label} className="scroll-mt-16 lg:scroll-mt-24">
      <div className="sticky top-0 z-20 -mx-6 mb-6 bg-bg/80 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:static lg:mx-0 lg:mb-8 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
        <h2 className="label">
          <span className="text-accent">
            <Diamond className="h-2 w-2" />
          </span>
          {label}
        </h2>
      </div>
      {children}
    </section>
  );
}

function Tags({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 flex flex-wrap gap-2" aria-label="Technologies">
      {items.map((t) => (
        <li key={t} className="tag">
          {t}
        </li>
      ))}
    </ul>
  );
}

/** A card that lifts onto a soft surface on hover (desktop), the way a page turns toward you. */
const CARD =
  "group relative rounded-2xl transition-colors duration-300 lg:-mx-5 lg:p-5 lg:hover:bg-surface/70 lg:hover:shadow-[inset_0_1px_0_0_rgb(255_255_255/0.04),0_20px_50px_-30px_rgb(var(--accent)/0.35)]";

export function About() {
  return (
    <Section id="about" label="About">
      <Reveal className="space-y-4 leading-relaxed text-muted">
        {about.map((p, i) => (
          <p key={i}>
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

type Row = {
  key: string;
  name: string;
  meta: string;
  badge?: string;
  line: string;
  part: string;
  tags: string[];
  links: Link[];
  image: { src: string; alt: string };
  note?: string;
};

const ROWS: Row[] = [
  { key: "inkmity", ...inkmity },
  { key: "arc", ...arc },
  ...projects.slice(0, 2).map((p) => ({
    key: p.name,
    name: p.name,
    meta: `${p.kind} · ${p.year}`,
    line: p.summary,
    part: p.part,
    tags: p.stack,
    links: p.links,
    image: p.image,
  })),
];

function ProjectRow({ r }: { r: Row }) {
  return (
    <Reveal as="li" className={`${CARD} grid items-start gap-4 sm:grid-cols-[9rem_1fr] sm:gap-6`}>
      <div className={`order-2 self-start overflow-hidden rounded-lg border border-border sm:order-1 sm:mt-1 ${r.key === "inkmity" ? "" : "hidden sm:block"}`}>
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
      <div className="order-1 sm:order-2">
        <h3 className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <span className="font-serif text-2xl leading-none text-bright">{r.name}</span>
          {r.badge && (
            <span className="inline-flex items-center gap-1.5 self-center rounded-full border border-accent/40 px-2 py-px text-[11px] font-medium uppercase tracking-wider text-accent">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
              {r.badge}
            </span>
          )}
          <span className="text-xs text-subtle">{r.meta}</span>
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-fg">{r.line}</p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">{r.part}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
          <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
            {r.tags.slice(0, 5).map((t) => (
              <li key={t} className="tag py-0.5">
                {t}
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-4">
            {r.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group/l inline-flex items-center gap-1 text-sm font-medium text-bright hover:text-accent"
              >
                {l.label}
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/l:-translate-y-0.5 group-hover/l:translate-x-0.5" />
                {NEW_TAB}
              </a>
            ))}
            {r.note && <span className="text-xs text-subtle">{r.note}</span>}
          </div>
        </div>
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

      {/* Inkmity's engineering detail, one click away for anyone who wants it */}
      <Reveal>
        <details className="group/d mt-8 rounded-xl border border-border">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-sm font-medium text-bright [&::-webkit-details-marker]:hidden">
            Inkmity in depth: payments, architecture and problems solved
            <span aria-hidden="true" className="text-lg leading-none text-accent transition-transform duration-300 group-open/d:rotate-45">
              +
            </span>
          </summary>
          <div className="space-y-7 border-t border-border px-4 py-5 text-sm">
            <div>
              <h4 className="font-medium text-bright">The payment flow</h4>
              <p className="mt-1 text-muted">
                Inkmity is the merchant of record. Clients pay a flat $10 per booking, the first one free; artists pay
                nothing and tips go 100% to the artist.
              </p>
              <ol className="mt-3 space-y-2">
                {inkmity.moneyPath.map((m, i) => (
                  <li key={m.title} className="flex gap-3">
                    <span className="w-5 shrink-0 font-serif text-base text-accent">{i + 1}</span>
                    <span className="text-muted">
                      <span className="text-fg">{m.title}.</span> {m.text}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h4 className="font-medium text-bright">Architecture</h4>
              <ul className="mt-3 space-y-2">
                {inkmity.architecture.map((a) => (
                  <li key={a.tier} className="text-muted">
                    <span className="text-fg">{a.tier}</span> <span className="text-subtle">({a.host})</span>: {a.text}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-muted">{inkmity.services}</p>
            </div>
            <div>
              <h4 className="font-medium text-bright">Problems and how I solved them</h4>
              <dl className="mt-3 space-y-4">
                {inkmity.problems.map((pr) => (
                  <div key={pr.problem}>
                    <dt className="text-fg">{pr.problem}</dt>
                    <dd className="mt-1 text-muted">{pr.approach}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </details>
      </Reveal>

      {/* Smaller builds: one line each */}
      <Reveal className="mt-12">
        <h3 className="label text-subtle">Also built</h3>
        <ul className="mt-4 divide-y divide-border border-y border-border">
          {projects.slice(2).map((p) => (
            <li key={p.name} className="grid grid-cols-[1fr_auto] items-baseline gap-x-6 py-3">
              <p className="min-w-0 text-sm">
                <span className="font-medium text-bright">{p.name}</span>
                <span className="text-subtle"> · {p.year}</span>
                <span className="block text-muted sm:inline">
                  <span className="hidden sm:inline"> · </span>
                  {p.summary}
                </span>
              </p>
              <span className="flex shrink-0 gap-3">
                {p.links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-bright hover:text-accent"
                  >
                    {l.label}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    {NEW_TAB}
                  </a>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}

export function Experience() {
  return (
    <Section id="experience" label="Experience">
      <ol className="space-y-10">
        {experience.map((j) => (
          <Reveal as="li" key={j.org} className={`${CARD} grid gap-2 sm:grid-cols-[10rem_1fr] sm:gap-6`}>
            <p className="pt-1 text-xs font-semibold uppercase tracking-[0.12em] text-subtle">{j.dates}</p>
            <div>
              <h3 className="font-medium leading-snug text-bright">
                {j.href ? (
                  <a href={j.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-baseline gap-1 group-hover:text-accent">
                    {j.title} · {j.org}
                    <ArrowUpRight className="h-3.5 w-3.5 translate-y-0.5" />
                    {NEW_TAB}
                  </a>
                ) : (
                  <span className="group-hover:text-accent">
                    {j.title} · {j.org}
                  </span>
                )}
              </h3>
              <p className="text-xs text-subtle">{j.type}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{j.summary}</p>
              <Tags items={j.tags} />
            </div>
          </Reveal>
        ))}
      </ol>

      <a
        href={siteConfig.resume}
        target="_blank"
        rel="noopener noreferrer"
        className="group/r mt-12 inline-flex items-center gap-1.5 font-medium text-bright hover:text-accent"
      >
        View full résumé
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover/r:-translate-y-0.5 group-hover/r:translate-x-0.5" />
        <span className="sr-only"> (PDF, opens in a new tab)</span>
      </a>

      <div className="mt-16 grid gap-12">
        <Reveal>
          <h3 className="label text-subtle">Education</h3>
          <ul className="mt-5 space-y-4">
            {education.map((e) => (
              <li key={e.school} className="grid gap-1 sm:grid-cols-[10rem_1fr] sm:gap-6">
                <p className="pt-0.5 text-xs font-semibold uppercase tracking-[0.12em] text-subtle">{e.dates}</p>
                <p>
                  <span className="font-medium text-bright">{e.school}</span>
                  <span className="block text-sm text-muted">{e.detail}</span>
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal>
          <h3 className="label text-subtle">Toolbox</h3>
          <dl className="mt-5 space-y-3">
            {skills.map((s) => (
              <div key={s.group} className="grid gap-1 sm:grid-cols-[10rem_1fr] sm:gap-6">
                <dt className="pt-0.5 text-xs font-semibold uppercase tracking-[0.12em] text-subtle">{s.group}</dt>
                <dd className="text-sm leading-relaxed text-fg">{s.items.join(" · ")}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Section>
  );
}

export function Contact() {
  const mailto = `mailto:${siteConfig.email}`;
  return (
    <Section id="contact" label="Contact">
      <Reveal>
        <p className="font-serif text-4xl leading-tight text-bright sm:text-5xl">
          Let&rsquo;s build <em className="text-accent/90">something</em>.
        </p>
        <p className="mt-4 max-w-md leading-relaxed text-muted">
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
