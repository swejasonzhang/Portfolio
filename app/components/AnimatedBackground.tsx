/**
 * The global canvas: pure neutral black with a vignette and static grain.
 * Each section lays its own backdrop on top of this (see Backdrop.tsx).
 * A fixed element that never repaints on scroll keeps the whole page smooth.
 */
export default function AnimatedBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink"
    >
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_45%,transparent_55%,rgba(0,0,0,0.6)_100%)]" />
      <div className="grain absolute inset-0 opacity-[0.05]" />
    </div>
  );
}
