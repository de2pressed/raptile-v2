"use client";

import { motion, useReducedMotion } from "framer-motion";

import type { ThemePalette } from "@/lib/theme-lab";
import { mixColor, withAlpha } from "@/lib/theme-lab";

type RibbonSpec = {
  start: string;
  end: string;
  mid: string;
  color: keyof Pick<ThemePalette, "accent" | "accentStrong" | "shaderWarm" | "shaderMid">;
  opacity: number;
  duration: number;
  y: number;
};

const RIBBONS: RibbonSpec[] = [
  {
    start: "M -120 180 C 180 120, 420 250, 660 180 S 1080 250, 1320 190",
    end: "M -120 210 C 180 280, 420 90, 660 220 S 1080 120, 1320 210",
    mid: "M -120 195 C 180 200, 420 170, 660 200 S 1080 190, 1320 200",
    color: "accent",
    opacity: 0.1,
    duration: 36,
    y: 180,
  },
  {
    start: "M -120 360 C 150 300, 420 430, 690 360 S 1040 430, 1320 350",
    end: "M -120 390 C 150 470, 420 300, 690 400 S 1040 290, 1320 380",
    mid: "M -120 375 C 150 385, 420 365, 690 380 S 1040 360, 1320 365",
    color: "accentStrong",
    opacity: 0.08,
    duration: 42,
    y: 360,
  },
  {
    start: "M -120 540 C 180 470, 420 610, 660 540 S 1080 610, 1320 530",
    end: "M -120 565 C 180 650, 420 490, 660 575 S 1080 470, 1320 555",
    mid: "M -120 552 C 180 560, 420 540, 660 558 S 1080 540, 1320 544",
    color: "shaderWarm",
    opacity: 0.07,
    duration: 39,
    y: 540,
  },
  {
    start: "M -120 720 C 160 660, 420 800, 700 720 S 1080 790, 1320 710",
    end: "M -120 744 C 160 840, 420 660, 700 750 S 1080 640, 1320 730",
    mid: "M -120 732 C 160 750, 420 730, 700 736 S 1080 715, 1320 720",
    color: "shaderMid",
    opacity: 0.06,
    duration: 45,
    y: 720,
  },
];

export default function AuroraWavesBackground({ palette }: { palette: ThemePalette }) {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 900"
        preserveAspectRatio="none"
      >
        {RIBBONS.map((ribbon, index) => {
          const stroke = mixColor(palette[ribbon.color], palette.bg, 0.08 + index * 0.03);

          return (
            <motion.path
              key={ribbon.start}
              d={reduceMotion ? ribbon.mid : ribbon.start}
              fill="none"
              opacity={ribbon.opacity}
              stroke={withAlpha(stroke, 1)}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={62 - index * 4}
              vectorEffect="non-scaling-stroke"
              style={{
                filter: "blur(40px)",
              }}
              animate={reduceMotion ? { opacity: ribbon.opacity, d: ribbon.mid } : { d: [ribbon.start, ribbon.end, ribbon.start] }}
              transition={{
                duration: ribbon.duration,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </svg>

      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${withAlpha(palette.accent, 0.06)} 0%, ${withAlpha(
            palette.bg,
            0,
          )} 65%)`,
          opacity: 0.65,
        }}
      />
    </div>
  );
}
