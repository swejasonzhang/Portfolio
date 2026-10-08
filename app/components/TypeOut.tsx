"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * Text that the System types in, character by character, once `start` is
 * true. Screen readers get the full text immediately; reduced motion renders
 * it complete.
 */
export default function TypeOut({
  text,
  start,
  speed = 26,
  onDone,
  className = "",
}: {
  text: string;
  start: boolean;
  /** Milliseconds per character. */
  speed?: number;
  onDone?: () => void;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);
  const [done, setDone] = useState(false);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    if (!start) return;
    if (reduce) {
      setN(text.length);
      setDone(true);
      doneRef.current?.();
      return;
    }
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setN(i);
      if (i >= text.length) {
        window.clearInterval(id);
        setDone(true);
        doneRef.current?.();
      }
    }, speed);
    return () => window.clearInterval(id);
  }, [start, reduce, text, speed]);

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden="true">{text.slice(0, n)}</span>
      {start && !done && !reduce && (
        <span
          aria-hidden="true"
          className="ml-0.5 inline-block h-[0.9em] w-[2px] translate-y-[0.12em] bg-sys animate-blink"
        />
      )}
    </span>
  );
}
