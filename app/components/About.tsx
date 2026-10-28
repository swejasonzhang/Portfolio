import Reveal from "./Reveal";
import SectionTitle from "./SectionTitle";

const FACTS = [
  { k: "Studying", v: "B.S. Computer Science, Queens College (CUNY), expected June 2028" },
  { k: "Building", v: "Inkmity, live since July 2026" },
  { k: "Looking for", v: "A software engineering internship or co-op, now or Summer 2027" },
  { k: "Based in", v: "New York City; open to Philadelphia or anywhere in the US" },
];

export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="border-t border-border">
      <div className="container-page py-20 md:py-28">
        <SectionTitle id="about-title" eyebrow="About" title="A bit about me" />
        <div className="mt-10 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <Reveal className="space-y-5 text-lg leading-relaxed text-muted">
            <p>
              I like making the thing and then taking it to the people it&rsquo;s for. I built Inkmity&rsquo;s first version
              by hand, then pitched it to more than ten tattoo shops in person and sat down with a New York studio to hear
              how booking actually breaks for them. That shaped the product more than any feature list.
            </p>
            <p>
              Before Inkmity I interned at Series, where I opened 50+ pull requests on a small team with the CTO, and wrote
              data automation for a marketing team at Move Tact. Since June 2026 I&rsquo;ve built with Claude Code, and
              I&rsquo;m open about which work I wrote by hand and which I directed.
            </p>
            <p>
              Outside of code: anime, games and tattoo art. Solo Leveling is one of my tattoos; the idea of getting
              stronger one honest level at a time is how I think about engineering, too.
            </p>
          </Reveal>
          <Reveal>
            <dl className="divide-y divide-border rounded-xl border border-border">
              {FACTS.map((f) => (
                <div key={f.k} className="px-5 py-4">
                  <dt className="text-sm font-medium text-subtle">{f.k}</dt>
                  <dd className="mt-1">{f.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
