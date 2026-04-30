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
  strokeWidth: number;
  blur: number;
  duration: number;
};

const RIBBONS: RibbonSpec[] = [
  {
    start: "M -120 180 C 180 80, 420 300, 660 160 S 1080 300, 1320 170",
    end:   "M -120 240 C 180 340, 420 60, 660 260 S 1080 80, 1320 250",
    mid:   "M -120 210 C 180 210, 420 180, 660 210 S 1080 190, 1320 210",
    color: "accent",
    opacity: 0.4,
    strokeWidth: 120,
    blur: 50,
    duration: 34,
  },
  {
    start: "M -120 360 C 150 260, 420 480, 690 340 S 1040 480, 1320 330",
    end:   "M -120 420 C 150 520, 420 260, 690 440 S 1040 240, 1320 410",
    mid:   "M -120 390 C 150 390, 420 370, 690 390 S 1040 360, 1320 370",
    color: "accentStrong",
    opacity: 0.32,
    strokeWidth: 100,
    blur: 60,
    duration: 40,
  },
  {
    start: "M -120 540 C 180 420, 420 660, 660 520 S 1080 660, 1320 510",
    end:   "M -120 600 C 180 700, 420 450, 660 610 S 1080 420, 1320 590",
    mid:   "M -120 570 C 180 560, 420 555, 660 565 S 1080 540, 1320 550",
    color: "shaderWarm",
    opacity: 0.28,
    strokeWidth: 90,
    blur: 55,
    duration: 38,
  },
  {
    start: "M -120 720 C 160 610, 420 840, 700 700 S 1080 840, 1320 690",
    end:   "M -120 780 C 160 880, 420 620, 700 790 S 1080 600, 1320 770",
    mid:   "M -120 750 C 160 745, 420 730, 700 745 S 1080 720, 1320 730",
    color: "shaderMid",
    opacity: 0.22,
    strokeWidth: 80,
    blur: 45,
    duration: 44,
  },
];

export default function AuroraWavesBackground({ palette }: { palette: ThemePalette }) {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      {/* Base fill */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${palette.bg} 0%, ${palette.bgSoft} 50%, ${palette.bgElevated} 100%)`,
        }}
      />

      {/* SVG ribbon layer */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 900"
        preserveAspectRatio="none"
      >
        {RIBBONS.map((ribbon) => {
          const color = palette[ribbon.color];

          return (
            <motion.path
              key={ribbon.start}
              d={reduceMotion ? ribbon.mid : ribbon.start}
              fill="none"
              opacity={ribbon.opacity}
              stroke={withAlpha(color, 0.9)}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={ribbon.strokeWidth}
              style={{
                filter: `blur(${ribbon.blur}px)`,
              }}
              animate={
                reduceMotion
                  ? { opacity: ribbon.opacity, d: ribbon.mid }
                  : { d: [ribbon.start, ribbon.end, ribbon.start] }
              }
              transition={{
                duration: ribbon.duration,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </svg>

      {/* Central accent glow */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 70% 50% at 50% 45%, ${withAlpha(palette.accent, 0.1)} 0%, transparent 60%)`,
        }}
      />

      {/* Top-edge warm bleed */}
      <motion.div
        className="absolute inset-x-0 top-0 h-[30vh]"
        style={{
          background: `linear-gradient(180deg, ${withAlpha(palette.accentStrong, 0.08)} 0%, transparent 100%)`,
          filter: "blur(30px)",
        }}
        animate={
          reduceMotion
            ? { opacity: 0.6 }
            : { opacity: [0.3, 0.7, 0.3] }
        }
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
