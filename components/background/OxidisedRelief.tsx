"use client";

import { useEffect, useState } from "react";

const DESKTOP_LINE_COUNT = 16;
const MOBILE_LINE_COUNT = 10;
const DESKTOP_SEGMENTS = 60;
const MOBILE_SEGMENTS = 42;
const SEED = 1.4;
const RESIZE_DEBOUNCE_MS = 150;
const ANIMATION_NAMES = ["relief-drift-0", "relief-drift-1", "relief-drift-2"] as const;

type Viewport = {
  width: number;
  height: number;
  compact: boolean;
};

type ContourLine = {
  d: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
  animationName: "relief-drift-0" | "relief-drift-1" | "relief-drift-2";
  animationDuration: string;
  animationDelay: string;
};

function generateContourPath(
  lineIndex: number,
  lineCount: number,
  width: number,
  height: number,
  seed: number,
  compact: boolean,
) {
  const segments = compact ? MOBILE_SEGMENTS : DESKTOP_SEGMENTS;
  const points: Array<[number, number]> = [];
  const norm = lineCount <= 1 ? 0.5 : lineIndex / (lineCount - 1);
  const spreadStart = compact ? 0.16 : 0.1;
  const spreadEnd = compact ? 0.84 : 0.9;
  const centerY = height * (spreadStart + (spreadEnd - spreadStart) * norm);
  const contourBias = Math.sin((norm - 0.5) * Math.PI) * height * (compact ? 0.014 : 0.02);
  const primaryAmplitude = height * (compact ? 0.015 : 0.022) * (0.84 + norm * 0.6);
  const secondaryAmplitude = height * (compact ? 0.007 : 0.01);
  const fineAmplitude = height * (compact ? 0.003 : 0.0045);
  const liftAmplitude = height * (compact ? 0.005 : 0.007);
  const phase = seed + lineIndex * 0.72;

  for (let index = 0; index <= segments; index += 1) {
    const t = index / segments;
    const x = t * width;
    const primary = Math.sin(t * Math.PI * 2.2 + phase) * primaryAmplitude;
    const secondary = Math.sin(t * Math.PI * 5.1 + phase * 1.24) * secondaryAmplitude;
    const fine = Math.cos(t * Math.PI * 11 + phase * 1.7) * fineAmplitude;
    const lift = Math.sin((t - 0.5) * Math.PI) * liftAmplitude;
    const y = centerY + contourBias + primary + secondary + fine + lift;
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

function buildContours(viewport: Viewport) {
  const lineCount = viewport.compact ? MOBILE_LINE_COUNT : DESKTOP_LINE_COUNT;

  return Array.from({ length: lineCount }, (_, index): ContourLine => {
    const norm = lineCount <= 1 ? 0.5 : index / (lineCount - 1);

    return {
      d: generateContourPath(index, lineCount, viewport.width, viewport.height, SEED, viewport.compact),
      stroke: `rgba(${Math.floor(130 + norm * 56)}, ${Math.floor(72 + norm * 34)}, ${Math.floor(22 + norm * 12)}, ${(0.035 + norm * 0.085).toFixed(3)})`,
      strokeWidth: Number((viewport.compact ? 0.38 + norm * 0.32 : 0.42 + norm * 0.48).toFixed(2)),
      opacity: Number((viewport.compact ? 0.56 + norm * 0.16 : 0.64 + norm * 0.18).toFixed(3)),
      animationName: ANIMATION_NAMES[index % ANIMATION_NAMES.length],
      animationDuration: `${viewport.compact ? 18 + (index % 4) * 2.5 : 14 + (index % 5) * 3}s`,
      animationDelay: `${-(index * (viewport.compact ? 1.35 : 1.1)).toFixed(1)}s`,
    };
  });
}

export default function OxidisedRelief() {
  const [viewport, setViewport] = useState<Viewport>({ width: 0, height: 0, compact: false });
  const [contours, setContours] = useState<ContourLine[]>([]);

  useEffect(() => {
    let resizeTimer = 0;

    const updateContours = () => {
      const width = Math.max(1, window.innerWidth);
      const height = Math.max(1, window.innerHeight);
      const compact = width <= 767;
      const nextViewport = { width, height, compact };

      setViewport(nextViewport);
      setContours(buildContours(nextViewport));
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
      <div className="bg-oxidised-relief__plate" />
      <div className="bg-oxidised-relief__vignette" />
      <div className="bg-oxidised-relief__sheen" />
      <svg
        className="bg-oxidised-relief__svg"
        preserveAspectRatio="none"
        viewBox={`0 0 ${Math.max(1, viewport.width)} ${Math.max(1, viewport.height)}`}
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
              animation: `${line.animationName} ${line.animationDuration} cubic-bezier(0.16, 1, 0.3, 1) infinite alternate`,
              animationDelay: line.animationDelay,
              willChange: "transform, opacity",
            }}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
    </div>
  );
}
