"use client";

import { useEffect, useState } from "react";

const LINE_COUNT = 16;
const SEGMENTS = 60;
const SEED = 1.4;
const RESIZE_DEBOUNCE_MS = 150;
const ANIMATION_NAMES = ["relief-drift-0", "relief-drift-1", "relief-drift-2"] as const;

type ContourLine = {
  d: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
  animationName: "relief-drift-0" | "relief-drift-1" | "relief-drift-2";
  animationDuration: string;
  animationDelay: string;
};

function generateContourPath(lineIndex: number, width: number, height: number, seed: number) {
  const points: Array<[number, number]> = [];

  for (let index = 0; index <= SEGMENTS; index += 1) {
    const t = index / SEGMENTS;
    const x = t * width;
    const base = Math.sin(t * Math.PI * 2.2 + lineIndex * 0.8) * height * 0.26;
    const mid = Math.sin(t * Math.PI * 5.5 + lineIndex * 1.3 + seed) * height * 0.07;
    const fine = Math.cos(t * Math.PI * 11 + lineIndex + seed * 0.5) * height * 0.03;
    const y = height * 0.5 + base + mid + fine;
    points.push([x, y]);
  }

  let path = `M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;

  for (let index = 1; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    const midX = ((current[0] + next[0]) / 2).toFixed(1);
    const midY = ((current[1] + next[1]) / 2).toFixed(1);
    path += ` Q ${current[0].toFixed(1)} ${current[1].toFixed(1)} ${midX} ${midY}`;
  }

  return path;
}

function buildContours(width: number, height: number) {
  return Array.from({ length: LINE_COUNT }, (_, index): ContourLine => {
    const norm = index / LINE_COUNT;

    return {
      d: generateContourPath(index, width, height, SEED),
      stroke: `rgba(${Math.floor(130 + norm * 60)}, ${Math.floor(72 + norm * 38)}, ${Math.floor(22 + norm * 14)}, ${(0.03 + norm * 0.1).toFixed(3)})`,
      strokeWidth: Number((0.4 + norm * 0.5).toFixed(2)),
      opacity: Number((0.68 + norm * 0.2).toFixed(3)),
      animationName: ANIMATION_NAMES[index % ANIMATION_NAMES.length],
      animationDuration: `${14 + (index % 5) * 3}s`,
      animationDelay: `${-(index * 1.1).toFixed(1)}s`,
    };
  });
}

export default function OxidisedRelief() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [contours, setContours] = useState<ContourLine[]>([]);

  useEffect(() => {
    let resizeTimer = 0;

    const updateContours = () => {
      const width = Math.max(1, window.innerWidth);
      const height = Math.max(1, window.innerHeight);
      setDimensions({ width, height });
      setContours(buildContours(width, height));
    };

    const handleResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(updateContours, RESIZE_DEBOUNCE_MS);
    };

    updateContours();
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="bg-oxidised-relief" aria-hidden="true">
      <svg
        className="bg-oxidised-relief__svg"
        preserveAspectRatio="none"
        viewBox={`0 0 ${Math.max(1, dimensions.width)} ${Math.max(1, dimensions.height)}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {contours.map((line, index) => (
          <path
            key={`${index}-${line.animationDelay}`}
            d={line.d}
            fill="none"
            opacity={line.opacity}
            stroke={line.stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={line.strokeWidth}
            style={{
              animation: `${line.animationName} ${line.animationDuration} ease-in-out infinite alternate`,
              animationDelay: line.animationDelay,
              willChange: "transform",
            }}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
    </div>
  );
}
