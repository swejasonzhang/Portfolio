/**
 * A giant rank letter as a watermark behind a chapter: outlined, faint,
 * violet. Decorative only.
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
      className={`pointer-events-none absolute select-none font-display text-[32vw] font-bold uppercase leading-none text-transparent [-webkit-text-stroke:1.5px_rgba(124,92,255,0.22)] md:text-[22vw] ${className}`}
    >
      {letter}
    </span>
  );
}
