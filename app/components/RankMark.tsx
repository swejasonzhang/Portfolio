/**
 * A giant rank letter or gate number as a watermark behind a chapter,
 * outlined in the gate's own color (from the section's --gate-rgb variable).
 * Decorative only.
 */
export default function RankMark({
  letter,
  className = "",
}: {
  letter: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute select-none font-display text-[32vw] font-bold uppercase leading-none text-transparent [-webkit-text-stroke:1.5px_rgba(var(--gate-rgb),0.26)] md:text-[22vw] ${className}`}
    >
      {letter}
    </span>
  );
}
