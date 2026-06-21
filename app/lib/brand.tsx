import type { CSSProperties } from "react";

export function YinYangMark({ size }: { size: number }) {
  const lobe = size / 2;
  const dot = size * 0.16;
  const circle: CSSProperties = { borderRadius: "50%", display: "flex" };

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        display: "flex",
        background: `linear-gradient(90deg, #ffffff 50%, #0a0a0a 50%)`,
        ...circle,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: size / 4,
          width: lobe,
          height: lobe,
          background: "#0a0a0a",
          ...circle,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: lobe,
          left: size / 4,
          width: lobe,
          height: lobe,
          background: "#ffffff",
          ...circle,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: lobe / 2 - dot / 2,
          left: size / 2 - dot / 2,
          width: dot,
          height: dot,
          background: "#ffffff",
          ...circle,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: lobe + lobe / 2 - dot / 2,
          left: size / 2 - dot / 2,
          width: dot,
          height: dot,
          background: "#0a0a0a",
          ...circle,
        }}
      />
    </div>
  );
}
