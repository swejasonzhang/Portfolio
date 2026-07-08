"use client";

/**
 * Neo-traditional flash motifs, drawn as monochrome linework.
 * Everything strokes with currentColor so they inherit ink color.
 */

type IconProps = { className?: string; strokeWidth?: number };

const base = (sw = 2) => ({
  fill: "none",
  stroke: "currentColor",
  strokeWidth: sw,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

/* The classic tattoo "shine" — a four-point sparkle. */
export function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 1 C12.6 7 17 11.4 23 12 C17 12.6 12.6 17 12 23 C11.4 17 7 12.6 1 12 C7 11.4 11.4 7 12 1 Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* Ornamental divider: a hairline with a center diamond and flanking sparkles. */
export function Divider({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 24"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <g {...base(1.25)}>
        <line x1="10" y1="12" x2="150" y2="12" />
        <line x1="250" y1="12" x2="390" y2="12" />
        <path d="M175 12 L200 4 L225 12 L200 20 Z" />
        <path d="M200 8 L200 16 M196 12 L204 12" />
        <path d="M150 12 l-8 -4 M150 12 l-8 4" />
        <path d="M250 12 l8 -4 M250 12 l8 4" />
      </g>
    </svg>
  );
}

/* A rose — stylized top-down bud with petals and leaves. */
export function Rose({ className = "", strokeWidth = 2 }: IconProps) {
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

/* A serpent — S-curved body with a diamond head and forked tongue. */
export function Snake({ className = "", strokeWidth = 2 }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <g {...base(strokeWidth)}>
        <path d="M60 14 c-14 2 -20 12 -14 22 c6 10 22 10 24 22 c2 12 -12 20 -26 16" />
        <path d="M60 14 c10 1 16 8 14 15" />
        <path d="M62 12 l6 -5 M62 18 l6 3" />
        <path d="M67 8 l5 -3 M67 8 l1 -5" />
        <circle cx="58" cy="16" r="1.4" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}

/* A dagger — blade, crossguard, wrapped handle, pommel. */
export function Dagger({ className = "", strokeWidth = 2 }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <g {...base(strokeWidth)}>
        <path d="M50 8 L57 55 L50 62 L43 55 Z" />
        <path d="M50 14 L50 55" />
        <path d="M34 58 L66 58" />
        <path d="M38 58 c-6 2 -10 4 -12 8 M62 58 c6 2 10 4 12 8" />
        <path d="M46 62 L54 62 L53 86 L47 86 Z" />
        <path d="M47 68 L53 68 M47 74 L53 74 M47 80 L53 80" />
        <circle cx="50" cy="90" r="4" />
      </g>
    </svg>
  );
}

/* A moth — symmetrical wings, body segments, feathered antennae. */
export function Moth({ className = "", strokeWidth = 2 }: IconProps) {
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

/* All-seeing eye with radiating rays. */
export function Eye({ className = "", strokeWidth = 2 }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <g {...base(strokeWidth)}>
        <path d="M22 50 c10 -14 46 -14 56 0 c-10 14 -46 14 -56 0 Z" />
        <circle cx="50" cy="50" r="9" />
        <circle cx="50" cy="50" r="2.4" fill="currentColor" stroke="none" />
        <path d="M50 22 l0 -10 M50 88 l0 -6 M18 34 l-7 -5 M82 34 l7 -5 M18 66 l-7 5 M82 66 l7 5" />
      </g>
    </svg>
  );
}

/* Traditional swallow. */
export function Swallow({ className = "", strokeWidth = 2 }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <g {...base(strokeWidth)}>
        <path d="M18 40 c14 -10 30 -10 40 2 c8 -14 24 -18 30 -10 c-6 2 -10 8 -12 16" />
        <path d="M58 42 c-6 8 -18 14 -32 12 c8 6 8 18 2 26 c-2 -12 -12 -18 -22 -16 c10 -6 12 -18 10 -28" />
        <path d="M58 42 c6 6 8 16 6 26 c6 -8 6 -20 2 -28" />
        <circle cx="80" cy="30" r="1.4" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}

/* A ribbon banner that holds a short label. */
export function Banner({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={`relative inline-flex items-center ${className}`}>
      <svg
        viewBox="0 0 240 48"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full text-white/70"
        aria-hidden="true"
      >
        <g {...base(1.5)}>
          <path d="M18 8 H222 L212 24 L222 40 H18 L28 24 Z" />
          <path d="M4 16 L18 8 L18 40 L4 32 Z" />
          <path d="M236 16 L222 8 L222 40 L236 32 Z" />
        </g>
      </svg>
      <span className="relative z-10 px-10 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-white">
        {children}
      </span>
    </span>
  );
}
