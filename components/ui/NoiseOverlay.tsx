"use client";

export function NoiseOverlay() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        pointerEvents: "none",
        // Canvas is unavailable in this workspace, so the generated noise file is served from /public.
        backgroundImage: 'url("/noise.png")',
        backgroundRepeat: "repeat",
        backgroundSize: "200px 200px",
        opacity: 0.12,
        mixBlendMode: "overlay",
      }}
    />
  );
}
