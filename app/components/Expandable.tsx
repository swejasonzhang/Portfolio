"use client";

import { useId, useState, type ReactNode } from "react";

/**
 * "More about this project": a small toggle that slides the details open.
 * The panel animates its height with a grid-rows transition, and while closed
 * it is inert, so its links stay out of the keyboard's way.
 */
export default function Expandable({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="mt-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-subtle transition-colors duration-300 hover:text-accent aria-expanded:text-accent"
      >
        <span aria-hidden="true" className="relative h-2.5 w-2.5">
          <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
          <span
            className={`absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current transition-transform duration-300 ${
              open ? "scale-y-0" : ""
            }`}
          />
        </span>
        {open ? "Show less" : label}
      </button>
      <div
        id={id}
        inert={!open}
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
