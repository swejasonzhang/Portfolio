/**
 * Per-section backdrops. One ink vocabulary (white hairlines at 5–7%, fades,
 * rotated squares) applied differently per section so each has its own ground
 * while the page still reads as one sheet. All static CSS: nothing repaints on
 * scroll. Parent section needs `relative isolate`.
 */
export type BackdropVariant =
  | "lamp" // hero: light from above + dot field
  | "seam" // two sides: paper wash meeting ink at a center seam
  | "hatch" // experience: diagonal shading, like tattoo hatching
  | "graph" // education: graph paper
  | "rings" // projects: concentric rings, echoing the mark's orbits
  | "ruled" // the other half: ruled paper with a margin line
  | "floor"; // contact: light from below, bookending the hero

const DOTS =
  "[background-image:radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:28px_28px]";

const RINGS =
  "absolute h-[90vw] w-[90vw] rounded-full [background-image:repeating-radial-gradient(circle,rgba(255,255,255,0.06)_0,rgba(255,255,255,0.06)_1px,transparent_1px,transparent_72px)] [mask-image:radial-gradient(circle,black_25%,transparent_68%)]";

export default function Backdrop({ variant }: { variant: BackdropVariant }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {variant === "lamp" && (
        <>
          <div className="absolute inset-x-0 top-0 h-[75vh] bg-[radial-gradient(60%_55%_at_50%_0%,rgba(255,255,255,0.11),transparent_70%)]" />
          <div
            className={`absolute inset-0 ${DOTS} [mask-image:radial-gradient(60%_70%_at_50%_35%,black,transparent)]`}
          />
        </>
      )}

      {variant === "seam" && (
        <>
          <div className="absolute inset-y-0 left-0 w-1/2 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.045))] [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]" />
          <div className="absolute inset-y-0 left-1/2 w-px bg-white/15 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]" />
          <span className="absolute left-1/2 top-[16%] h-1.5 w-1.5 -translate-x-1/2 rotate-45 bg-white/50" />
          <span className="absolute bottom-[16%] left-1/2 h-1.5 w-1.5 -translate-x-1/2 rotate-45 bg-white/50" />
        </>
      )}

      {variant === "hatch" && (
        <div className="absolute inset-0 [background-image:repeating-linear-gradient(135deg,rgba(255,255,255,0.06)_0,rgba(255,255,255,0.06)_1px,transparent_1px,transparent_14px)] [mask-image:radial-gradient(75%_65%_at_50%_50%,black,transparent)]" />
      )}

      {variant === "graph" && (
        <>
          <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(70%_70%_at_50%_50%,black,transparent)]" />
          <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.09)_1px,transparent_1px)] [background-size:160px_160px] [mask-image:radial-gradient(70%_70%_at_50%_50%,black,transparent)]" />
        </>
      )}

      {variant === "rings" && (
        <>
          <div className={`${RINGS} -right-[25vw] -top-[10vw]`} />
          <div className={`${RINGS} -bottom-[10vw] -left-[25vw]`} />
        </>
      )}

      {variant === "ruled" && (
        <>
          <div className="grain-dark absolute inset-0 opacity-[0.07]" />
          <div className="absolute inset-0 [background-image:linear-gradient(rgba(5,5,5,0.07)_1px,transparent_1px)] [background-size:100%_32px] [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]" />
          <div className="absolute inset-y-0 left-[max(1.25rem,calc((100vw-72rem)/2))] w-px bg-black/15" />
        </>
      )}

      {variant === "floor" && (
        <>
          <div className="absolute inset-x-0 bottom-0 h-[75vh] bg-[radial-gradient(60%_55%_at_50%_100%,rgba(255,255,255,0.10),transparent_70%)]" />
          <div
            className={`absolute inset-0 ${DOTS} [mask-image:radial-gradient(60%_70%_at_50%_70%,black,transparent)]`}
          />
        </>
      )}
    </div>
  );
}
