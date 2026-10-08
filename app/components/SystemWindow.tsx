"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { materialize } from "../lib/motion";

type Tone = "sys" | "shadow" | "danger";

const BORDER: Record<Tone, string> = {
  sys: "border-sys/40 shadow-glow",
  shadow: "border-shadow/50 shadow-glow-violet",
  danger: "border-danger/50",
};
const TICK: Record<Tone, string> = {
  sys: "border-sys-bright",
  shadow: "border-shadow-bright",
  danger: "border-danger",
};
const DOT: Record<Tone, string> = {
  sys: "bg-sys",
  shadow: "bg-shadow",
  danger: "bg-danger",
};
const TITLE: Record<Tone, string> = {
  sys: "text-sys",
  shadow: "text-shadow-bright",
  danger: "text-danger",
};

/**
 * A System window: translucent panel, luminous border, corner ticks, a header
 * row with a diamond and a bracketed title. Materializes with a quick flicker.
 */
export default function SystemWindow({
  title,
  right,
  tone = "sys",
  children,
  className = "",
  bodyClassName = "",
  animate = true,
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
}) {
  const Tag = animate ? motion.div : "div";
  const motionProps = animate ? { variants: materialize } : {};
  return (
    <Tag
      {...(motionProps as object)}
      className={`relative border bg-panel ${BORDER[tone]} ${className}`}
    >
      {/* corner ticks */}
      <span aria-hidden="true" className={`absolute -left-px -top-px h-3 w-3 border-l-2 border-t-2 ${TICK[tone]}`} />
      <span aria-hidden="true" className={`absolute -right-px -top-px h-3 w-3 border-r-2 border-t-2 ${TICK[tone]}`} />
      <span aria-hidden="true" className={`absolute -bottom-px -left-px h-3 w-3 border-b-2 border-l-2 ${TICK[tone]}`} />
      <span aria-hidden="true" className={`absolute -bottom-px -right-px h-3 w-3 border-b-2 border-r-2 ${TICK[tone]}`} />

      <div className={`flex items-center justify-between gap-4 border-b border-line px-4 py-2.5 hud ${TITLE[tone]}`}>
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className={`h-1.5 w-1.5 rotate-45 ${DOT[tone]}`} />
          [{title}]
        </span>
        {right && <span className="text-mute">{right}</span>}
      </div>
      <div className={`p-5 md:p-6 ${bodyClassName}`}>{children}</div>
    </Tag>
  );
}
