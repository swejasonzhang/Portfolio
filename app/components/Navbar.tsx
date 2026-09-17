"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useState } from "react";
import YinYang from "./YinYang";
import { EASE_OUT, INTRO_DELAY } from "../lib/motion";

const links = [
  { id: "home", label: "Home" },
  { id: "projects", label: "Projects" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const reduce = useReducedMotion();
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });
  const markRotation = useTransform(progress, [0, 1], [0, 360]);

  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  useEffect(() => {
    const sections = links
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: INTRO_DELAY, duration: 0.5, ease: EASE_OUT }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <nav
        aria-label="Primary"
        className={`relative mx-3 mt-3 flex max-w-3xl items-center justify-between rounded-sm border px-3 py-2 transition-[background-color,border-color,box-shadow] duration-300 sm:px-4 md:mx-auto ${
          scrolled
            ? "border-line bg-ink/95 shadow-lg shadow-black/40"
            : "border-transparent bg-transparent shadow-none"
        }`}
      >
        <a href="#home" className="flex min-h-10 items-center gap-2 text-white">
          <motion.span
            style={{ rotate: reduce ? 0 : markRotation }}
            className="inline-flex text-white"
          >
            <YinYang className="h-5 w-5" />
          </motion.span>
          <span className="ink-bleed whitespace-nowrap font-display text-lg sm:text-xl">Jason Zhang</span>
        </a>

        <ul className="flex items-center">
          {links.map((link, i) => {
            const isActive = active === link.id;
            return (
              <li
                key={link.id}
                className={link.id === "home" ? "hidden xs:block" : ""}
              >
                <a
                  href={`#${link.id}`}
                  aria-current={isActive ? "page" : undefined}
                  className="relative inline-flex min-h-10 items-center px-2 font-mono text-2xs uppercase tracking-label transition-colors sm:px-3"
                >
                  <span
                    aria-hidden="true"
                    className="mr-1.5 hidden tabular-nums text-gray-500 sm:inline"
                  >
                    0{i + 1}
                  </span>
                  <span
                    className={
                      isActive ? "text-white" : "text-gray-400 hover:text-white"
                    }
                  >
                    {link.label}
                  </span>
                  {isActive && (
                    <motion.span
                      layoutId="nav-ink"
                      className="absolute inset-x-2 bottom-1 h-px bg-white sm:inset-x-3"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        <motion.span
          aria-hidden="true"
          style={{ scaleX: progress }}
          className="absolute inset-x-3 bottom-0 h-px origin-left bg-white"
        />
      </nav>
    </motion.header>
  );
}
