import type { Variants } from "framer-motion";

/** One easing language for the whole site. */
export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const EASE_INOUT: [number, number, number, number] = [0.76, 0, 0.24, 1];

export const DUR = { fast: 0.35, base: 0.6, slow: 0.9 } as const;

/** Shared whileInView config. */
export const VIEWPORT = { once: true, amount: 0.2 } as const;

/**
 * Seconds after mount at which the hero choreography should begin, so it plays
 * as the preloader curtain parts instead of behind it.
 */
export const INTRO_DELAY = 1.05;

/** Fade + rise. The default entrance for blocks. */
export const reveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.base, ease: EASE_OUT },
  },
};

/** Slide in from a side: the two halves of a plate arriving together. */
export const revealFrom = (side: "left" | "right"): Variants => ({
  hidden: { opacity: 0, x: side === "left" ? -28 : 28 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: EASE_OUT },
  },
});

/**
 * Line-mask type reveal: wrap in a `block overflow-hidden` span and apply this
 * to an inner `block` span. Transform-only.
 */
export const lift: Variants = {
  hidden: { y: "110%", skewY: 3 },
  visible: {
    y: 0,
    skewY: 0,
    transition: { duration: 0.8, ease: EASE_OUT },
  },
};

/** Stagger children. */
export const stagger = (s = 0.08, delay = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: s, delayChildren: delay } },
});
