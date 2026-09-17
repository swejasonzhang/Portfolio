"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

export type ButtonVariant = "yang" | "yin" | "paper";
export type ButtonSize = "sm" | "md" | "lg";

/*
 * The one button recipe. yang = white (primary), yin = outlined (secondary),
 * paper = black-on-white for the inverted band. Hover is a literal inversion:
 * the opposite fill rises from the bottom like ink filling a plate.
 */
const base =
  "group/btn relative isolate inline-flex items-center justify-center gap-2 overflow-hidden rounded-sm whitespace-nowrap font-mono uppercase tracking-btn transition-colors duration-300 " +
  "focus-visible:outline-none focus-visible:[box-shadow:0_0_0_2px_#050505,0_0_0_4px_#f5f5f5] " +
  "[&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 " +
  "before:absolute before:inset-0 before:-z-10 before:origin-bottom before:scale-y-0 before:transition-transform before:duration-300 before:ease-[cubic-bezier(.22,1,.36,1)] hover:before:scale-y-100 motion-reduce:before:transition-none";

const variants: Record<ButtonVariant, string> = {
  yang: "border border-white bg-white font-semibold text-black before:bg-black hover:text-white",
  yin: "border border-white/25 bg-transparent font-medium text-gray-200 before:bg-white hover:border-white hover:text-black",
  paper:
    "border border-black bg-black font-semibold text-white before:bg-white hover:text-black focus-visible:[box-shadow:0_0_0_2px_#f5f5f5,0_0_0_4px_#050505]",
};

const sizes: Record<ButtonSize, string> = {
  sm: "min-h-10 px-4 text-2xs",
  md: "min-h-11 px-6 text-xs",
  lg: "min-h-12 px-8 text-xs",
};

export function buttonClass(
  variant: ButtonVariant = "yang",
  size: ButtonSize = "md",
  extra = ""
) {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`.trim();
}

export default function MagneticButton({
  href,
  children,
  className = "",
  target,
  rel,
  variant = "yang",
  size = "md",
  strength = 0.3,
  ariaLabel,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  strength?: number;
  ariaLabel?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();
  const [fine, setFine] = useState(false);

  // Magnetism only for real hover devices; on touch the button stays put.
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const on = () => setFine(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const active = fine && !reduce;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 20, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 150, damping: 20, mass: 0.4 });

  function handleMove(e: React.PointerEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el || !active || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  const external = target === "_blank";

  return (
    <motion.a
      ref={ref}
      href={href}
      target={target}
      rel={rel ?? (external ? "noopener noreferrer" : undefined)}
      aria-label={ariaLabel}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
      whileTap={active ? { scale: 0.97 } : undefined}
      style={active ? { x: sx, y: sy } : undefined}
      className={buttonClass(variant, size, className)}
    >
      {children}
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </motion.a>
  );
}
