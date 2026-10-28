import { education, experience, skills } from "../content";
import Reveal from "./Reveal";
import SectionTitle from "./SectionTitle";

export default function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="border-t border-border bg-surface/50">
      <div className="container-page py-20 md:py-28">
        <SectionTitle id="experience-title" eyebrow="Experience" title="Where I've worked" />
        <ol className="mt-12 space-y-10">
          {experience.map((j) => (
            <Reveal as="li" key={j.org} className="grid gap-2 md:grid-cols-[13rem_1fr] md:gap-10">
              <p className="text-sm text-subtle md:pt-1">{j.dates}</p>
              <div>
                <h3 className="text-lg font-semibold">
                  {j.title} <span className="font-normal text-muted">· {j.org}</span>
                </h3>
                <p className="text-sm text-subtle">{j.type}</p>
                <ul className="mt-3 space-y-2">
                  {j.bullets.map((b) => (
                    <li key={b} className="flex gap-3 leading-relaxed text-muted">
                      <span aria-hidden="true" className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </ol>

        <div className="mt-20 grid gap-12 lg:grid-cols-2">
          <Reveal>
            <h3 className="text-xl font-semibold tracking-tight">Education</h3>
            <ul className="mt-6 divide-y divide-border border-y border-border">
              {education.map((e) => (
                <li key={e.school} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4">
                  <div>
                    <p className="font-medium">{e.school}</p>
                    <p className="text-sm text-muted">{e.detail}</p>
                  </div>
                  <p className="text-sm text-subtle">{e.dates}</p>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal>
            <h3 className="text-xl font-semibold tracking-tight">Skills</h3>
            <dl className="mt-6 space-y-4">
              {skills.map((s) => (
                <div key={s.group} className="grid gap-2 sm:grid-cols-[7.5rem_1fr] sm:gap-4">
                  <dt className="pt-0.5 text-sm font-medium text-subtle">{s.group}</dt>
                  <dd className="flex flex-wrap gap-2">
                    {s.items.map((i) => (
                      <span key={i} className="tag">
                        {i}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
