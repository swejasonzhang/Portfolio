"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import YinYang from "./YinYang";

const links = [
  { id: "home", label: "Home" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });
  const markRotation = useTransform(progress, [0, 1], [0, 360]);

  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 inset-x-0 z-50"
    >
      <nav
        className={`mx-auto flex max-w-5xl items-center justify-between px-5 py-3 transition-all duration-300 md:px-6 ${
          scrolled
            ? "mt-3 rounded-full border border-white/10 bg-gray-950/70 shadow-lg shadow-black/40 backdrop-blur-md md:mx-auto md:max-w-3xl"
            : "mt-0 border border-transparent bg-transparent"
        }`}
      >
        <a
          href="#home"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight text-white"
        >
          <motion.span style={{ rotate: markRotation }} className="inline-flex">
            <YinYang className="h-5 w-5" />
          </motion.span>
          <span className="hidden xs:inline">Jason Zhang</span>
        </a>

        <ul className="flex items-center gap-1 sm:gap-2">
          {links.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                className="relative rounded-full px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm"
              >
                {active === link.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-white/10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span
                  className={`relative z-10 transition-colors ${
                    active === link.id
                      ? "text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {link.label}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <motion.div
        style={{ scaleX: progress }}
        className="h-px origin-left bg-gradient-to-r from-transparent via-white to-transparent"
      />
    </motion.header>
  );
}
