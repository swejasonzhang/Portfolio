"use client";

const glints = [
  { top: "14%", left: "12%", size: 4, delay: 0, dur: 7 },
  { top: "22%", left: "82%", size: 3, delay: 1.5, dur: 9 },
  { top: "58%", left: "18%", size: 5, delay: 0.8, dur: 8 },
  { top: "70%", left: "72%", size: 3, delay: 2.2, dur: 10 },
  { top: "40%", left: "48%", size: 2, delay: 1, dur: 6 },
  { top: "84%", left: "38%", size: 4, delay: 0.4, dur: 11 },
  { top: "10%", left: "57%", size: 3, delay: 1.8, dur: 8 },
  { top: "48%", left: "90%", size: 4, delay: 0.6, dur: 9 },
];

const grain =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export default function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[linear-gradient(155deg,#000000_0%,#0b0b0d_30%,#23262d_68%,#5b6068_100%)]">
      <div className="absolute inset-x-0 top-0 h-[60vh] bg-[radial-gradient(55%_55%_at_50%_0%,rgba(255,255,255,0.10),transparent_70%)]" />

      <div className="absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:26px_26px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_78%)]" />

      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.06]" />

      {glints.map((g, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white animate-float"
          style={{
            top: g.top,
            left: g.left,
            width: g.size,
            height: g.size,
            opacity: 0.3,
            animationDelay: `${g.delay}s`,
            animationDuration: `${g.dur}s`,
          }}
        />
      ))}

      <div
        className="absolute inset-0 opacity-[0.10] mix-blend-overlay"
        style={{ backgroundImage: grain }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/40" />
    </div>
  );
}
