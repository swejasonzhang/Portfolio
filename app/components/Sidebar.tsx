"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "../site";
import { Diamond, FileIcon, GitHubIcon, LinkedInIcon, MailIcon, XIcon } from "./Icons";
import Logo from "./Logo";

const NAV = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

const SOCIAL = [
  { href: siteConfig.socials.github, label: "GitHub", Icon: GitHubIcon },
  { href: siteConfig.socials.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
  { href: siteConfig.socials.x, label: "X", Icon: XIcon },
  { href: `mailto:${siteConfig.email}`, label: "Email", Icon: MailIcon },
];

/**
 * The fixed left column on large screens (it scrolls normally on phones):
 * the logo and name, where to go, and how to reach me. The section in view
 * lights its diamond.
 */
export default function Sidebar() {
  const [active, setActive] = useState("about");

  useEffect(() => {
    const sections = NAV.map((n) => document.getElementById(n.id)).filter((el): el is HTMLElement => !!el);
    const pick = () => {
      // The last section whose top has passed a line 35% down the screen.
      const line = window.innerHeight * 0.35;
      let current = NAV[0].id;
      for (const s of sections) if (s.getBoundingClientRect().top <= line) current = s.id;
      // At the very bottom, the last section is the one being read.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = NAV[NAV.length - 1].id;
      setActive(current);
    };
    pick();
    window.addEventListener("scroll", pick, { passive: true });
    window.addEventListener("resize", pick);
    return () => {
      window.removeEventListener("scroll", pick);
      window.removeEventListener("resize", pick);
    };
  }, []);

  return (
    <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-[46%] lg:flex-col lg:justify-between lg:py-24">
      <div>
        <h1 className="font-serif text-[3.4rem] leading-[0.95] tracking-tight text-bright sm:text-7xl">
          <a href="#about" className="inline-flex items-center gap-4">
            <Logo className="h-9 w-9 shrink-0 text-bright sm:h-11 sm:w-11" />
            <span>
              Jason <em className="text-accent">Zhang</em>
            </span>
          </a>
        </h1>

        <nav aria-label="Sections" className="mt-16 hidden lg:block">
          <ul className="w-max space-y-1">
            {NAV.map((n) => {
              const on = active === n.id;
              return (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    aria-current={on ? "true" : undefined}
                    className="group flex items-center gap-3 py-2"
                  >
                    <span className={`transition-colors duration-300 ${on ? "text-accent" : "text-subtle group-hover:text-accent"}`}>
                      <Diamond className="h-2.5 w-2.5" filled={on} />
                    </span>
                    <span
                      className={`text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300 ${
                        on ? "translate-x-1 text-bright" : "text-subtle group-hover:translate-x-1 group-hover:text-bright"
                      }`}
                    >
                      {n.label}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-6 lg:mt-0">
        <a href={siteConfig.resume} target="_blank" rel="noopener noreferrer" className="btn-ghost h-9 px-4">
          <FileIcon />
          Résumé<span className="sr-only"> (PDF, opens in a new tab)</span>
        </a>
        <ul className="flex items-center gap-5" aria-label="Elsewhere">
          {SOCIAL.map(({ href, label, Icon }) => (
            <li key={label}>
              <a
                href={href}
                {...(href.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                className="block text-muted transition-colors hover:text-bright"
                title={label}
              >
                <span className="sr-only">
                  {label}
                  {href.startsWith("mailto:") ? "" : " (opens in a new tab)"}
                </span>
                <Icon />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
