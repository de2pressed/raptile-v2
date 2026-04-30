"use client";

import { motion, useReducedMotion } from "framer-motion";

import type { ThemePalette } from "@/lib/theme-lab";
import { parseColor, withAlpha } from "@/lib/theme-lab";

type OrbSpec = {
  color: keyof Pick<ThemePalette, "accent" | "accentStrong" | "shaderWarm" | "shaderMid">;
  coreOpacity: number;
  edgeOpacity: number;
  size: string;
  left: string;
  top: string;
  duration: number;
  x: [string, string, string];
  y: [string, string, string];
};

const ORBS: OrbSpec[] = [
  {
    color: "accent",
    coreOpacity: 0.38,
    edgeOpacity: 0.14,
    size: "45vmax",
    left: "-8%",
    top: "5%",
    duration: 34,
    x: ["-5%", "12%", "-5%"],
    y: ["-4%", "10%", "-4%"],
  },
  {
    color: "accentStrong",
    coreOpacity: 0.3,
    edgeOpacity: 0.1,
    size: "40vmax",
    left: "45%",
    top: "-8%",
    duration: 41,
    x: ["8%", "-14%", "8%"],
    y: ["-6%", "16%", "-6%"],
  },
  {
    color: "shaderWarm",
    coreOpacity: 0.42,
    edgeOpacity: 0.16,
    size: "50vmax",
    left: "50%",
    top: "38%",
    duration: 38,
    x: ["-12%", "10%", "-12%"],
    y: ["8%", "-12%", "8%"],
  },
  {
    color: "shaderMid",
    coreOpacity: 0.32,
    edgeOpacity: 0.12,
    size: "38vmax",
    left: "10%",
    top: "55%",
    duration: 45,
    x: ["10%", "-8%", "10%"],
    y: ["-10%", "14%", "-10%"],
  },
];

function isLightPalette(palette: ThemePalette) {
  return parseColor(palette.bg).r > 128;
}

export default function LiquidChromaticBackground({ palette }: { palette: ThemePalette }) {
  const reduceMotion = useReducedMotion() ?? false;
  const blendMode = isLightPalette(palette) ? "multiply" : "screen";

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      {/* Base fill */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${palette.bg} 0%, ${palette.bgSoft} 50%, ${palette.bgElevated} 100%)`,
        }}
      />

      {/* Color orbs */}
      {ORBS.map((orb) => {
        const base = palette[orb.color];

        return (
          <motion.div
            key={`${orb.color}-${orb.left}-${orb.top}`}
            aria-hidden="true"
            className="absolute rounded-[50%]"
            style={{
              left: orb.left,
              top: orb.top,
              width: orb.size,
              height: orb.size,
              background: `radial-gradient(circle at 40% 40%, ${withAlpha(base, orb.coreOpacity)} 0%, ${withAlpha(
                base,
                orb.edgeOpacity,
              )} 45%, ${withAlpha(palette.bg, 0)} 75%)`,
              filter: "blur(80px)",
              mixBlendMode: blendMode,
              willChange: "transform, opacity",
            }}
            animate={
              reduceMotion
                ? { x: "0%", y: "0%", opacity: 1 }
                : {
                    x: orb.x,
                    y: orb.y,
                    opacity: [1, 1.08, 1],
                    scale: [1, 1.06, 1],
                  }
            }
            transition={{
              duration: orb.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      })}

      {/* Atmospheric vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, ${withAlpha(palette.bg, 0.4)} 100%)`,
        }}
      />
    </div>
  );
}
