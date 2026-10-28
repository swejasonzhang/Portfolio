import { siteConfig } from "../site";

const NEW_TAB = <span className="sr-only"> (opens in a new tab)</span>;

export default function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="container-page pb-20 pt-14 md:pb-28 md:pt-24">
      <p className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-sm text-muted">
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-emerald-500" />
        Available now for internships and co-ops
      </p>
      <h1 id="hero-title" className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
        Jason Zhang
      </h1>
      <p className="mt-4 max-w-2xl text-xl leading-snug text-fg/80 md:text-2xl">
        Software engineer and computer science student in New York. I build full-stack products end to end.
      </p>
      <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
        I founded{" "}
        <a href="#projects" className="link font-medium">
          Inkmity
        </a>
        , a booking app for independent tattoo artists that has been live with Stripe payments since July 2026. I&rsquo;m
        studying for a B.S. in Computer Science at Queens College (CUNY), expected June 2028. My classes are in the
        evening, so I can start an internship or co-op now, and I&rsquo;m also applying for Summer 2027.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <a href="#projects" className="btn-primary">
          View projects
        </a>
        <a href={siteConfig.resume} target="_blank" rel="noopener noreferrer" className="btn-secondary">
          Résumé{NEW_TAB}
        </a>
        <a href={siteConfig.socials.github} target="_blank" rel="noopener noreferrer" className="btn-secondary">
          GitHub{NEW_TAB}
        </a>
        <a href={siteConfig.socials.linkedin} target="_blank" rel="noopener noreferrer" className="btn-secondary">
          LinkedIn{NEW_TAB}
        </a>
      </div>
    </section>
  );
}
