import Image from "next/image";
import { arc, inkmity, projects, type Link, type Project } from "../content";
import Reveal from "./Reveal";
import SectionTitle from "./SectionTitle";

const NEW_TAB = <span className="sr-only"> (opens in a new tab)</span>;

function Links({ links, primary = false }: { links: Link[]; primary?: boolean }) {
  return (
    <div className="flex flex-wrap gap-3">
      {links.map((l, i) => (
        <a
          key={l.href}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className={primary && i === 0 ? "btn-primary" : "btn-secondary"}
        >
          {l.label}
          <span aria-hidden="true">↗</span>
          {NEW_TAB}
        </a>
      ))}
    </div>
  );
}

function Tags({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Technologies">
      {items.map((t) => (
        <li key={t} className="tag">
          {t}
        </li>
      ))}
    </ul>
  );
}

function Shot({ src, alt, w, h, priority = false, sizes }: { src: string; alt: string; w: number; h: number; priority?: boolean; sizes: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
      <Image src={src} alt={alt} width={w} height={h} sizes={sizes} priority={priority} className="h-auto w-full" />
    </div>
  );
}

function InkmityFeature() {
  return (
    <article aria-labelledby="inkmity-title" className="rounded-2xl border border-border p-5 sm:p-8">
      <Reveal className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <h3 id="inkmity-title" className="text-2xl font-semibold tracking-tight md:text-3xl">
          {inkmity.name}
        </h3>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {inkmity.status}
        </span>
      </Reveal>
      <Reveal>
        <p className="mt-1 text-muted">
          {inkmity.tagline} · {inkmity.role}
        </p>
      </Reveal>

      <Reveal className="mt-6">
        <Shot {...inkmity.image} priority sizes="(max-width: 1088px) 100vw, 1024px" />
      </Reveal>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <Reveal>
          <p className="text-lg leading-relaxed">{inkmity.summary}</p>
          <h4 className="mt-8 text-sm font-semibold uppercase tracking-wide text-subtle">What I built</h4>
          <ul className="mt-3 space-y-3">
            {inkmity.built.map((b) => (
              <li key={b} className="flex gap-3 leading-relaxed text-muted">
                <span aria-hidden="true" className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal className="space-y-8">
          <dl className="grid grid-cols-3 gap-4 border-y border-border py-5">
            {inkmity.stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="block text-2xl font-semibold tracking-tight">{s.value}</span>
                  <span className="mt-1 block text-xs leading-snug text-muted">{s.label}</span>
                </dd>
              </div>
            ))}
          </dl>
          <Tags items={inkmity.stack} />
          <div>
            <Links links={inkmity.links} primary />
            <p className="mt-3 text-sm text-subtle">{inkmity.note}</p>
          </div>
        </Reveal>
      </div>

      <details className="group mt-10 rounded-xl border border-border bg-surface/60">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium [&::-webkit-details-marker]:hidden">
          How it works: payments, architecture and problems solved
          <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-muted transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 8l5 5 5-5" />
          </svg>
        </summary>
        <div className="space-y-10 border-t border-border px-5 py-6 sm:px-6">
          <div>
            <h4 className="font-semibold">The payment flow</h4>
            <p className="mt-1 text-sm text-muted">
              Inkmity is the merchant of record. A client pays a flat $10 per booking and the first one is free; artists
              pay nothing and tips go 100% to the artist.
            </p>
            <ol className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {inkmity.moneyPath.map((m, i) => (
                <li key={m.title} className="rounded-lg border border-border bg-bg p-4">
                  <span className="text-xs font-semibold text-accent">Step {i + 1}</span>
                  <p className="mt-1 font-medium">{m.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{m.text}</p>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h4 className="font-semibold">Architecture</h4>
            <ul className="mt-4 grid gap-4 sm:grid-cols-3">
              {inkmity.architecture.map((a) => (
                <li key={a.tier} className="rounded-lg border border-border bg-bg p-4">
                  <p className="flex items-baseline justify-between gap-2">
                    <span className="font-medium">{a.tier}</span>
                    <span className="text-xs text-subtle">{a.host}</span>
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{a.text}</p>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-muted">{inkmity.services}</p>
          </div>
          <div>
            <h4 className="font-semibold">Problems and how I solved them</h4>
            <dl className="mt-4 divide-y divide-border">
              {inkmity.problems.map((p) => (
                <div key={p.problem} className="grid gap-1 py-4 first:pt-0 last:pb-0 md:grid-cols-2 md:gap-8">
                  <dt className="font-medium">{p.problem}</dt>
                  <dd className="text-muted">{p.approach}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </details>
    </article>
  );
}

function ArcFeature() {
  return (
    <article aria-labelledby="arc-title" className="grid gap-8 rounded-2xl border border-border p-5 sm:p-8 lg:grid-cols-2 lg:items-start">
      <Reveal>
        <Shot {...arc.image} sizes="(max-width: 1024px) 100vw, 500px" />
      </Reveal>
      <Reveal>
        <p className="text-sm text-muted">{arc.status}</p>
        <h3 id="arc-title" className="mt-1 text-2xl font-semibold tracking-tight">
          {arc.name}
        </h3>
        <p className="mt-1 text-muted">{arc.tagline}</p>
        <p className="mt-4 leading-relaxed">{arc.summary}</p>
        <ul className="mt-4 space-y-2.5">
          {arc.built.map((b) => (
            <li key={b} className="flex gap-3 text-sm leading-relaxed text-muted">
              <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-subtle">{arc.credit}</p>
        <div className="mt-5">
          <Tags items={arc.stack} />
        </div>
        <div className="mt-6">
          <Links links={arc.links} />
        </div>
      </Reveal>
    </article>
  );
}

function Card({ p, i }: { p: Project; i: number }) {
  return (
    <Reveal as="article" delay={(i % 3) * 60} className="flex flex-col overflow-hidden rounded-xl border border-border transition-colors hover:border-fg/20">
      <div className="aspect-[16/10] overflow-hidden border-b border-border bg-surface">
        <Image src={p.image.src} alt={p.image.alt} width={800} height={500} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 340px" className="h-full w-full object-cover object-top" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-semibold">{p.name}</h3>
          <span className="shrink-0 text-xs text-subtle">{p.year}</span>
        </div>
        <p className="text-xs text-subtle">{p.kind}</p>
        <p className="mt-3 text-sm leading-relaxed">{p.summary}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">{p.part}</p>
        <div className="mt-4">
          <Tags items={p.stack} />
        </div>
        <div className="mt-auto flex gap-4 pt-5 text-sm font-medium">
          {p.links.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="link">
              {l.label} ↗{NEW_TAB}
            </a>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

export default function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-title" className="border-t border-border">
      <div className="container-page py-20 md:py-28">
        <SectionTitle
          id="projects-title"
          eyebrow="Projects"
          title="Selected work"
          lead="What each project does and what I built in it. Every number comes from the repository."
        />
        <div className="mt-12 space-y-8">
          <InkmityFeature />
          <ArcFeature />
        </div>
        <h3 className="mt-16 text-xl font-semibold tracking-tight">More projects</h3>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <Card key={p.name} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
