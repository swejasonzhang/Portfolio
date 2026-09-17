/**
 * Neo-traditional motifs, drawn as heavy monochrome linework.
 * Everything strokes with currentColor so they inherit ink color.
 */

type IconProps = { className?: string; strokeWidth?: number };

const base = (sw = 2.4) => ({
  fill: "none",
  stroke: "currentColor",
  strokeWidth: sw,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

/* A rose — stylized top-down bud with petals and leaves. */
export function Rose({ className = "", strokeWidth = 2.4 }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <g {...base(strokeWidth)}>
        <path d="M50 34 c-7 0 -12 5 -12 12 c0 8 6 13 12 13 c6 0 12 -5 12 -13 c0 -7 -5 -12 -12 -12 Z" />
        <path d="M50 41 c-4 0 -6 3 -6 6 c0 4 3 6 6 6 c3 0 6 -2 6 -6" />
        <path d="M38 46 c-8 -2 -14 3 -14 11 c0 9 8 16 26 16 c18 0 26 -7 26 -16 c0 -8 -6 -13 -14 -11" />
        <path d="M28 62 c-6 4 -9 11 -8 18 M72 62 c6 4 9 11 8 18" />
        <path d="M50 73 l0 20" />
        <path d="M50 82 c-6 -1 -11 -5 -12 -11 c6 0 11 3 12 8 Z" />
        <path d="M50 88 c6 -1 11 -5 12 -11 c-6 0 -11 3 -12 8 Z" />
      </g>
    </svg>
  );
}

/* A moth — symmetrical wings, body segments, feathered antennae. */
export function Moth({ className = "", strokeWidth = 2.4 }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <g {...base(strokeWidth)}>
        <path d="M50 40 c-14 -18 -34 -16 -38 -2 c-3 12 10 22 24 20" />
        <path d="M50 40 c14 -18 34 -16 38 -2 c3 12 -10 22 -24 20" />
        <path d="M50 52 c-12 4 -22 12 -22 22 c8 4 16 2 22 -6" />
        <path d="M50 52 c12 4 22 12 22 22 c-8 4 -16 2 -22 -6" />
        <path d="M50 34 l0 42" />
        <path d="M50 40 l0 30" strokeWidth={Math.max(1, strokeWidth + 2)} />
        <circle cx="30" cy="34" r="3" />
        <circle cx="70" cy="34" r="3" />
        <path d="M50 34 c-3 -8 -8 -12 -14 -12 M50 34 c3 -8 8 -12 14 -12" />
      </g>
    </svg>
  );
}
