/**
 * A ragged brush edge. Place it where one ground meets another so the seam
 * reads as ink pulled across paper instead of a ruled line. Fills with
 * currentColor: set `text-washi` to tear paper into ink, `text-sumi` for the
 * reverse. `flip` turns the edge upside down.
 */
export default function BrushEdge({
  className = "",
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 1200 32"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`block h-6 w-full md:h-8 ${flip ? "rotate-180" : ""} ${className}`}
    >
      <path
        fill="currentColor"
        d="M0 32 L0 15 C30 9 62 19 104 13 C146 7 166 23 206 17 C246 11 288 3 330 11 C372 19 402 21 442 13 C482 5 520 15 562 11 C604 7 642 21 684 15 C726 9 764 3 806 11 C848 19 886 17 926 9 C966 1 1004 13 1046 11 C1088 9 1124 19 1162 13 C1180 10 1192 11 1200 13 L1200 32 Z"
      />
      {/* A few flecks thrown off the stroke */}
      <circle cx="310" cy="6" r="1.4" fill="currentColor" />
      <circle cx="712" cy="4" r="1.1" fill="currentColor" />
      <circle cx="958" cy="3" r="1.6" fill="currentColor" />
      <circle cx="1098" cy="6" r="1" fill="currentColor" />
    </svg>
  );
}
