/**
 * The hanko: a vermilion seal carrying the JZ monogram. It signs the page the
 * way a seal signs a print. Slight imperfections (a soft corner, a nick, a
 * tilt) are deliberate. Pure SVG, server-safe.
 */
export default function Seal({
  className = "",
  outline = false,
  size,
  tilt = true,
}: {
  className?: string;
  /** Linework only, for quiet placements. */
  outline?: boolean;
  /** Explicit pixel size (for places without CSS, e.g. the OG image). */
  size?: number;
  /** A hand-stamped lean. */
  tilt?: boolean;
}) {
  const dims = size ? { width: size, height: size } : {};
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      className={className}
      style={tilt ? { transform: "rotate(-3deg)" } : undefined}
      {...dims}
    >
      {/* Body: a square with carved, slightly uneven corners and a nick on the right edge. */}
      <path
        d="M9 6 H88 Q94 6 94 12 V46 L92 50 L94 54 V88 Q94 94 88 94 H12 Q6 94 6 88 V13 Q6 6 12 6 Z"
        fill={outline ? "none" : "#a8321f"}
        stroke={outline ? "#a8321f" : "none"}
        strokeWidth={outline ? 3 : 0}
      />
      {/* Inner carved frame */}
      <rect
        x="15"
        y="15"
        width="70"
        height="70"
        fill="none"
        stroke={outline ? "#a8321f" : "#efe8da"}
        strokeOpacity={outline ? 0.6 : 0.55}
        strokeWidth="1.5"
      />
      {/* Monogram, carved in reverse (paper shows through). */}
      <text
        x="50"
        y="69"
        textAnchor="middle"
        fontFamily="var(--font-serif), Georgia, serif"
        fontStyle="italic"
        fontSize="54"
        letterSpacing="-4"
        fill={outline ? "#a8321f" : "#efe8da"}
      >
        JZ
      </text>
    </svg>
  );
}
