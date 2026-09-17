import YinYang from "./YinYang";
import { siteConfig } from "../site";

const links = [
  { href: siteConfig.socials.github, label: "GitHub" },
  { href: siteConfig.socials.linkedin, label: "LinkedIn" },
  { href: siteConfig.socials.x, label: "X" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-10">
      <div className="container-ink">
        <div className="rule-double mb-8" />
        <div className="flex flex-col items-center gap-5 font-mono text-2xs uppercase tracking-label text-gray-400 md:flex-row md:justify-between">
          <span className="inline-flex items-center gap-2">
            <YinYang outline className="h-4 w-4 text-white/70" />
            &copy; {year} {siteConfig.name} &middot; New York
          </span>
          <span className="hidden text-center md:block">
            Set in Pirata One &amp; Geist &middot; Built with Next.js, Tailwind &amp;
            Framer Motion
          </span>
          <ul className="flex items-center gap-1">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center px-2 text-gray-300 transition-colors hover:text-white"
                >
                  {l.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-6 text-center font-sans text-xs normal-case tracking-normal text-gray-400">
          Designed and built by hand.
        </p>
      </div>
    </footer>
  );
}
