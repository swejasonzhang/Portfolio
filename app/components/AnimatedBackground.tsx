/**
 * Static, GPU-cheap backdrop: pure neutral black with a top lamp, a faint dot
 * grid, a vignette and static grain. A fixed element that never repaints on
 * scroll keeps the whole page smooth.
 */
export default function AnimatedBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink"
    >
      <div className="absolute inset-x-0 top-0 h-[60vh] bg-[radial-gradient(60%_50%_at_50%_0%,rgba(255,255,255,0.09),transparent_70%)]" />
      <div className="absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_78%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_45%,transparent_55%,rgba(0,0,0,0.6)_100%)]" />
      <div className="grain absolute inset-0 opacity-[0.05]" />
    </div>
  );
}
