/**
 * The seam between chapters: a full-width band cut by a diagonal luminous
 * line, with a HUD caption at the right. Static.
 */
export default function GateDivider({
  caption,
  className = "",
}: {
  caption?: string;
  className?: string;
}) {
  return (
    <div aria-hidden="true" className={`bleed relative h-16 overflow-hidden md:h-24 ${className}`}>
      <svg
        viewBox="0 0 1440 96"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="gate-seam" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#7c5cff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#58a6ff" stopOpacity="0.9" />
            <stop offset="1" stopColor="#7c5cff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="0" y1="92" x2="1440" y2="4" stroke="url(#gate-seam)" strokeWidth="1.5" />
        <line x1="0" y1="96" x2="1440" y2="8" stroke="rgba(88,166,255,0.12)" strokeWidth="1" />
      </svg>
      {caption && (
        <span className="hud absolute right-6 top-1/2 -translate-y-1/2 text-mute md:right-10 lg:right-24">
          {caption}
        </span>
      )}
    </div>
  );
}
