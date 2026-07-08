"use client";

/**
 * Static, GPU-cheap backdrop. No animated particles or blend-mode layers —
 * a fixed element that never repaints on scroll keeps the whole page smooth.
 */
export default function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[linear-gradient(155deg,#000000_0%,#0b0b0d_32%,#1a1c20_70%,#3a3e44_100%)]">
      <div className="absolute inset-x-0 top-0 h-[55vh] bg-[radial-gradient(55%_55%_at_50%_0%,rgba(255,255,255,0.08),transparent_70%)]" />

      <div className="absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_78%)]" />

      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05]" />

      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50" />
    </div>
  );
}
