/**
 * The JZ monogram: a white J and an amethyst Z joined by one continuous top
 * stroke, a round hook against a sharp Z. Same drawing as app/icon.svg,
 * without the tile.
 */
export default function Logo({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="6 10 36 28" className={className} aria-hidden="true">
      <g fill="none" strokeWidth="4.6">
        <path d="M8.5 13H25" stroke="currentColor" strokeLinecap="square" />
        <path d="M19 13v16a6.5 6.5 0 0 1-6.5 6.5H9.5" stroke="currentColor" />
        <path d="M25 13h14.5L25 35.5h14.5" stroke="rgb(var(--accent))" strokeLinecap="square" strokeLinejoin="miter" />
      </g>
    </svg>
  );
}
