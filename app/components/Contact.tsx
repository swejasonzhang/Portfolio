import { siteConfig } from "../site";
import CopyEmail from "./CopyEmail";
import Reveal from "./Reveal";

const NEW_TAB = <span className="sr-only"> (opens in a new tab)</span>;

export default function Contact() {
  const mailto = `mailto:${siteConfig.email}`;
  return (
    <>
      <section id="contact" aria-labelledby="contact-title" className="border-t border-border bg-surface/50">
        <div className="container-page py-20 md:py-28">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Contact</p>
            <h2 id="contact-title" className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
              Let&rsquo;s talk
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              Hiring a software engineering intern or co-op? I can start right away. The fastest way to reach me is email.
            </p>
            <a href={mailto} className="mt-8 inline-block break-all text-xl font-medium text-accent underline-offset-4 hover:underline sm:text-2xl">
              {siteConfig.email}
            </a>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a href={mailto} className="btn-primary">
                Email me
              </a>
              <CopyEmail email={siteConfig.email} />
              <a href={siteConfig.resume} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                Résumé{NEW_TAB}
              </a>
            </div>
            <p className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
              <a href={siteConfig.socials.github} target="_blank" rel="noopener noreferrer" className="link">
                GitHub{NEW_TAB}
              </a>
              <a href={siteConfig.socials.linkedin} target="_blank" rel="noopener noreferrer" className="link">
                LinkedIn{NEW_TAB}
              </a>
              <a href={siteConfig.socials.x} target="_blank" rel="noopener noreferrer" className="link">
                X{NEW_TAB}
              </a>
            </p>
          </Reveal>
        </div>
      </section>
      <footer className="border-t border-border">
        <div className="container-page flex flex-wrap justify-between gap-4 py-8 text-sm text-subtle">
          <p>© 2026 {siteConfig.name}</p>
          <p>Built with Next.js and Claude Code.</p>
        </div>
      </footer>
    </>
  );
}
