import type { Variants } from "framer-motion";

/** One easing language for the whole site. */
export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const EASE_INOUT: [number, number, number, number] = [0.76, 0, 0.24, 1];

export const DUR = { fast: 0.35, base: 0.7, slow: 1.1 } as const;

/** Shared whileInView config. */
export const VIEWPORT = { once: true, amount: 0.2 } as const;

/** Seconds after mount at which the entrance choreography begins (as the stamp lifts). */
export const INTRO_DELAY = 1.15;

/** Fade and rise: the default entrance for blocks. */
export const reveal: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.base, ease: EASE_OUT },
  },
};

/** Slide in from a side. */
export const revealFrom = (side: "left" | "right"): Variants => ({
  hidden: { opacity: 0, x: side === "left" ? -24 : 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: DUR.base, ease: EASE_OUT },
  },
});

/**
 * Line-mask rise: wrap in a `block overflow-hidden` span, apply to an inner
 * `block` span. Transform-only.
 */
export const lift: Variants = {
  hidden: { y: "110%" },
  visible: {
    y: 0,
    transition: { duration: 0.9, ease: EASE_OUT },
  },
};

/**
 * Masked wipe (the Hannya reveal): the element is uncovered left to right as
 * if a mask were drawn away. One-shot; use on headings and images.
 */
export const wipe: Variants = {
  hidden: { clipPath: "inset(0 100% 0 0)" },
  visible: {
    clipPath: "inset(0 0% 0 0)",
    transition: { duration: 1, ease: EASE_OUT },
  },
};

/** Stagger children. */
export const stagger = (step = 0.08, delay = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: step, delayChildren: delay } },
});
