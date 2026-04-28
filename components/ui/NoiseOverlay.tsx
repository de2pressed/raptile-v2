"use client";

import { useEffect, useRef } from "react";

export function NoiseOverlay() {
  const turbulenceRef = useRef<SVGFETurbulenceElement | null>(null);

  useEffect(() => {
    const node = turbulenceRef.current;

    if (!node) {
      return;
    }

    const frequencies = ["0.60 0.64", "0.67 0.71", "0.74 0.78", "0.80 0.76"];
    let raf = 0;
    let frame = 0;

    const tick = () => {
      frame += 1;

      if (frame % 2 === 0) {
        node.setAttribute("baseFrequency", frequencies[Math.floor(frame / 2) % frequencies.length]);
      }

      raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(raf);
  }, []);

  return (
    <svg
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[50] h-full w-full opacity-[0.08] mix-blend-screen"
      preserveAspectRatio="none"
    >
      <filter id="noise">
        <feTurbulence
          ref={turbulenceRef}
          type="fractalNoise"
          baseFrequency="0.70 0.73"
          numOctaves={6}
          stitchTiles="stitch"
        />
        <feColorMatrix
          type="matrix"
          values="0.4 0.25 0.12 0 0.07
                  0.25 0.18 0.07 0 0.03
                  0.12 0.12 0.07 0 0.01
                  0 0 0 0 0.08"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
  );
}
