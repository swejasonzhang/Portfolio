"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { materialize } from "../lib/motion";

/**
 * "gate" (default) takes the color of the surrounding gate from the section's
 * --gate / --gate-rgb variables, so every gate's windows glow in its own
 * rank color. "sys", "shadow" and "danger" are explicit overrides.
 */
type Tone = "gate" | "sys" | "shadow" | "danger";

const BORDER: Record<Tone, string> = {
  gate: "border-[rgba(var(--gate-rgb),0.45)] shadow-[0_0_26px_rgba(var(--gate-rgb),0.16),inset_0_0_0_1px_rgba(var(--gate-rgb),0.06)] hover:border-[rgba(var(--gate-rgb),0.8)]",
  sys: "border-sys/40 shadow-glow hover:border-sys/75",
  shadow: "border-shadow/50 shadow-glow-violet hover:border-shadow/80",
  danger: "border-danger/50 hover:border-danger/80",
};
const TICK: Record<Tone, string> = {
  gate: "border-[var(--gate)]",
  sys: "border-sys-bright",
  shadow: "border-shadow-bright",
  danger: "border-danger",
};
const DOT: Record<Tone, string> = {
  gate: "bg-[var(--gate)]",
  sys: "bg-sys",
  shadow: "bg-shadow",
  danger: "bg-danger",
};
const TITLE: Record<Tone, string> = {
  gate: "text-[var(--gate)]",
  sys: "text-sys",
  shadow: "text-shadow-bright",
  danger: "text-danger",
};
const RULE: Record<Tone, string> = {
  gate: "border-[rgba(var(--gate-rgb),0.25)]",
  sys: "border-line",
  shadow: "border-shadow/30",
  danger: "border-danger/30",
};

/**
 * A System window: translucent panel, luminous border, corner ticks, a header
 * row with a diamond and a bracketed title. Materializes with a slow flicker.
 */
export default function SystemWindow({
  title,
  right,
  tone = "gate",
  children,
  className = "",
  bodyClassName = "",
  animate = true,
  alert = false,
}: {
  /** Header text, e.g. "Player status". Rendered as [Player status]. */
  title: string;
  /** Optional right-aligned header text. */
  right?: ReactNode;
  tone?: Tone;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  /** Set false to render without the materialize variant (e.g. inside your own stagger). */
  animate?: boolean;
  /** Notification style: an exclamation mark inside the header diamond. */
  alert?: boolean;
}) {
  const Tag = animate ? motion.div : "div";
  const motionProps = animate ? { variants: materialize } : {};
  return (
    <Tag
      {...(motionProps as object)}
      className={`relative border bg-panel transition-[border-color,box-shadow] duration-300 ${BORDER[tone]} ${className}`}
    >
      <span aria-hidden="true" className={`absolute -left-px -top-px h-3 w-3 border-l-2 border-t-2 ${TICK[tone]}`} />
      <span aria-hidden="true" className={`absolute -right-px -top-px h-3 w-3 border-r-2 border-t-2 ${TICK[tone]}`} />
      <span aria-hidden="true" className={`absolute -bottom-px -left-px h-3 w-3 border-b-2 border-l-2 ${TICK[tone]}`} />
      <span aria-hidden="true" className={`absolute -bottom-px -right-px h-3 w-3 border-b-2 border-r-2 ${TICK[tone]}`} />

      <div className={`flex items-center justify-between gap-4 border-b px-4 py-2.5 hud ${RULE[tone]} ${TITLE[tone]}`}>
        <span className="flex items-center gap-2">
          {alert ? (
            <span aria-hidden="true" className="relative flex h-4 w-4 items-center justify-center">
              <span className={`absolute inset-0 rotate-45 border ${TICK[tone]}`} />
              <span className={`relative text-[10px] font-bold leading-none ${TITLE[tone]}`}>!</span>
            </span>
          ) : (
            <span aria-hidden="true" className={`h-1.5 w-1.5 rotate-45 ${DOT[tone]}`} />
          )}
          [{title}]
        </span>
        {right && <span className="text-mute">{right}</span>}
      </div>
      <div className={`p-5 md:p-6 ${bodyClassName}`}>{children}</div>
    </Tag>
  );
}
