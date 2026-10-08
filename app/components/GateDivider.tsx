/**
 * The seam between gates: a full-width band cut by a diagonal luminous line
 * in the color of the gate being entered, with a HUD caption at the right.
 */
export default function GateDivider({
  caption,
  color = "#58a6ff",
  className = "",
}: {
  caption?: string;
  /** Hex color of the gate being entered. */
  color?: string;
  className?: string;
}) {
  const id = `seam-${color.replace("#", "")}`;
  return (
    <div aria-hidden="true" className={`bleed relative h-16 overflow-hidden md:h-24 ${className}`}>
      <svg viewBox="0 0 1440 96" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={color} stopOpacity="0" />
            <stop offset="0.5" stopColor={color} stopOpacity="0.95" />
            <stop offset="1" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="0" y1="92" x2="1440" y2="4" stroke={`url(#${id})`} strokeWidth="1.5" />
        <line x1="0" y1="96" x2="1440" y2="8" stroke={color} strokeOpacity="0.14" strokeWidth="1" />
      </svg>
      {caption && (
        <span
          className="hud absolute right-6 top-1/2 -translate-y-1/2 md:right-10 lg:right-24"
          style={{ color }}
        >
          {caption}
        </span>
      )}
    </div>
  );
}
