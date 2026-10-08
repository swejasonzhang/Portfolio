/**
 * A gate's outline: concentric rings with four ticks and a slowly turning
 * dashed orbit. Decorative, placed behind a chapter at an edge. Parent must be
 * `relative overflow-hidden`.
 */
export default function GateRing({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute aspect-square ${className}`}>
      <svg viewBox="0 0 400 400" className="h-full w-full">
        <circle cx="200" cy="200" r="196" fill="none" stroke="rgba(88,166,255,0.18)" strokeWidth="1" />
        <circle
          cx="200"
          cy="200"
          r="170"
          fill="none"
          stroke="rgba(124,92,255,0.24)"
          strokeWidth="1"
          strokeDasharray="6 14"
          className="origin-center motion-safe:animate-ring-spin"
        />
        <circle cx="200" cy="200" r="120" fill="none" stroke="rgba(88,166,255,0.1)" strokeWidth="1" />
        {[0, 90, 180, 270].map((a) => (
          <line
            key={a}
            x1="200"
            y1="4"
            x2="200"
            y2="28"
            stroke="rgba(156,208,255,0.55)"
            strokeWidth="1.5"
            transform={`rotate(${a} 200 200)`}
          />
        ))}
      </svg>
    </div>
  );
}
