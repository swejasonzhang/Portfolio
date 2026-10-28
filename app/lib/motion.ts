import type { Variants } from "framer-motion";

/** One easing language for the whole site. */
export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const EASE_INOUT: [number, number, number, number] = [0.76, 0, 0.24, 1];

export const DUR = { fast: 0.5, base: 1.1, slow: 1.8 } as const;

/**
 * Shared whileInView config. Triggers once any part of the element clears the
 * bottom 12% of the viewport, so a block taller than the screen (a six-window
 * grid on a phone) still reveals; a 20% threshold could never be met there.
 */
export const VIEWPORT = { once: true, amount: "some", margin: "0px 0px -8% 0px" } as const;

/** Seconds after mount at which the header and notifications arrive. No loading screen: the page is usable at once. */
export const INTRO_DELAY = 0.6;

/** Fade and rise. */
export const reveal: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.base, ease: EASE_OUT },
  },
};

/** Rise out of shadow: lifts and resolves. Transform and opacity only, so it never repaints. */
export const rise: Variants = {
  hidden: { opacity: 0, y: "0.32em" },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.3, ease: EASE_OUT },
  },
};

/** System materialize: a fast flicker into place. */
export const materialize: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: [0, 1, 0.55, 1],
    y: 0,
    transition: { duration: 0.9, ease: "linear", times: [0, 0.35, 0.55, 1] },
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
