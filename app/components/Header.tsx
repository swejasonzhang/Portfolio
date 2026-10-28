"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "../site";

const NAV = [
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

/** A quiet sticky header: name, section links, and the résumé one click away. */
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-40 border-b bg-bg/95 transition-colors duration-200 ${
        scrolled ? "border-border" : "border-transparent"
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between gap-6">
        <a href="#top" className="text-[15px] font-semibold tracking-tight" onClick={() => setOpen(false)}>
          Jason Zhang
        </a>
        <nav aria-label="Sections" className="hidden items-center gap-7 md:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="text-sm text-muted transition-colors hover:text-fg">
              {n.label}
            </a>
          ))}
          <a href={siteConfig.resume} target="_blank" rel="noopener noreferrer" className="btn-secondary h-9">
            Résumé<span className="sr-only"> (PDF, opens in a new tab)</span>
          </a>
        </nav>
        <div className="flex items-center gap-2 md:hidden">
          <a href={siteConfig.resume} target="_blank" rel="noopener noreferrer" className="btn-secondary h-9 px-3">
            Résumé<span className="sr-only"> (PDF, opens in a new tab)</span>
          </a>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((o) => !o)}
            className="btn-secondary h-9 w-9 px-0"
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              {open ? <path d="M5 5l10 10M15 5L5 15" /> : <path d="M3 6h14M3 10h14M3 14h14" />}
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Sections" className="border-t border-border bg-bg md:hidden">
          <ul className="container-page py-2">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} onClick={() => setOpen(false)} className="block py-3 text-base text-fg">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
