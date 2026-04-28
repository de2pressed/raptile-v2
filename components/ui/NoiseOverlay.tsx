"use client";

export function NoiseOverlay() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
        backgroundImage: 'url("/noise.png")',
        backgroundRepeat: "repeat",
        backgroundSize: "200px 200px",
        opacity: 0.08,
        mixBlendMode: "soft-light",
      }}
    />
  );
}
