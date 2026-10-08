import type { Variants } from "framer-motion";

/** One easing language for the whole site. */
export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const EASE_INOUT: [number, number, number, number] = [0.76, 0, 0.24, 1];

export const DUR = { fast: 0.5, base: 1.1, slow: 1.8 } as const;

/** Shared whileInView config. */
export const VIEWPORT = { once: true, amount: 0.2 } as const;

/** Seconds after mount at which the hero choreography begins (as the System screen clears). */
export const INTRO_DELAY = 2.7;

/** Fade and rise. */
export const reveal: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.base, ease: EASE_OUT },
  },
};

/** Rise out of shadow: uncovered from the bottom up. */
export const rise: Variants = {
  hidden: { clipPath: "inset(100% 0 0 0)", y: 24 },
  visible: {
    clipPath: "inset(0% 0 0 0)",
    y: 0,
    transition: { duration: 1.5, ease: EASE_OUT },
  },
};

/** System materialize: a fast flicker into place. */
export const materialize: Variants = {
  hidden: { opacity: 0, scale: 0.985 },
  visible: {
    opacity: [0, 1, 0.45, 1],
    scale: 1,
    transition: { duration: 0.95, ease: "linear", times: [0, 0.35, 0.55, 1] },
  },
};

/** Masked wipe left to right. */
export const wipe: Variants = {
  hidden: { clipPath: "inset(0 100% 0 0)" },
  visible: {
    clipPath: "inset(0 0% 0 0)",
    transition: { duration: 1.5, ease: EASE_OUT },
  },
};

/** A luminous line sweeping open from the left. */
export const sweep: Variants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 1.6, ease: EASE_OUT } },
};

/** Stagger children. */
export const stagger = (step = 0.16, delay = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: step, delayChildren: delay } },
});
