/**
 * The signature mark. Pure SVG (no client hooks) so it renders in the DOM,
 * in server components and inside the OG image route alike.
 */
export default function YinYang({
  className = "",
  outline = false,
  light = "#ffffff",
  dark = "#0a0a0a",
  size,
  style,
}: {
  className?: string;
  /** Linework-only variant for small marks and the paper band. */
  outline?: boolean;
  light?: string;
  dark?: string;
  /** Explicit pixel size (needed where CSS classes are unavailable, e.g. OG images). */
  size?: number;
  style?: React.CSSProperties;
}) {
  const dims = size ? { width: size, height: size } : {};

  if (outline) {
    return (
      <svg
        viewBox="0 0 100 100"
        className={className}
        aria-hidden="true"
        style={style}
        {...dims}
      >
        <g fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="50" cy="50" r="48" />
          <path d="M50,2 A24,24 0 0,1 50,50 A24,24 0 0,0 50,98" />
        </g>
        <circle cx="50" cy="26" r="6" fill="currentColor" />
        <circle cx="50" cy="74" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
      style={style}
      {...dims}
    >
      <circle cx="50" cy="50" r="49" fill={light} />
      <path d="M50,1 A49,49 0 0,1 50,99 Z" fill={dark} />
      <circle cx="50" cy="25.5" r="24.5" fill={dark} />
      <circle cx="50" cy="74.5" r="24.5" fill={light} />
      <circle cx="50" cy="25.5" r="8" fill={light} />
      <circle cx="50" cy="74.5" r="8" fill={dark} />
    </svg>
  );
}
