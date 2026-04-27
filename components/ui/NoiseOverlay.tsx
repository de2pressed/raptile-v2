"use client";

import { useEffect, useRef } from "react";

export function NoiseOverlay() {
  const turbulenceRef = useRef<SVGFETurbulenceElement | null>(null);

  useEffect(() => {
    const node = turbulenceRef.current;

    if (!node) {
      return;
    }

    const frequencies = ["0.65 0.68", "0.7 0.72", "0.72 0.75", "0.67 0.7"];
    let raf = 0;
    let frame = 0;

    const tick = () => {
      frame += 1;

      if (frame % 3 === 0) {
        node.setAttribute("baseFrequency", frequencies[Math.floor(frame / 3) % frequencies.length]);
      }

      raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(raf);
  }, []);

  return (
    <svg
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[50] h-full w-full opacity-[0.045] mix-blend-screen"
      preserveAspectRatio="none"
    >
      <filter id="noise">
        <feTurbulence
          ref={turbulenceRef}
          type="fractalNoise"
          baseFrequency="0.70 0.73"
          numOctaves={4}
          stitchTiles="stitch"
        />
        <feColorMatrix
          type="matrix"
          values="0.3 0.2 0.1 0 0.05
                  0.2 0.15 0.05 0 0.02
                  0.1 0.1 0.05 0 0
                  0 0 0 0 0.045"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
  );
}
