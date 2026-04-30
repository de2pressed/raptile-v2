"use client";

import { motion, useReducedMotion } from "framer-motion";

import type { ThemePalette } from "@/lib/theme-lab";
import { parseColor, withAlpha } from "@/lib/theme-lab";

type OrbSpec = {
  color: keyof Pick<ThemePalette, "accent" | "accentStrong" | "shaderWarm" | "shaderMid">;
  opacity: number;
  left: string;
  top: string;
  duration: number;
  x: [number, number, number];
  y: [number, number, number];
};

const ORBS: OrbSpec[] = [
  { color: "accent", opacity: 0.08, left: "-4%", top: "8%", duration: 34, x: [-6, 10, -6], y: [-8, 12, -8] },
  { color: "accentStrong", opacity: 0.06, left: "48%", top: "-2%", duration: 41, x: [8, -12, 8], y: [-10, 14, -10] },
  { color: "shaderWarm", opacity: 0.1, left: "54%", top: "42%", duration: 38, x: [-10, 8, -10], y: [12, -8, 12] },
  { color: "shaderMid", opacity: 0.08, left: "14%", top: "58%", duration: 45, x: [12, -9, 12], y: [-12, 10, -12] },
];

function isLightPalette(palette: ThemePalette) {
  return parseColor(palette.bg).r > 128;
}

export default function LiquidChromaticBackground({ palette }: { palette: ThemePalette }) {
  const reduceMotion = useReducedMotion() ?? false;
  const blendMode = isLightPalette(palette) ? "multiply" : "screen";

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      {ORBS.map((orb) => {
        const base = palette[orb.color];
        const tint = withAlpha(base, orb.opacity);
        const shade = withAlpha(base, orb.opacity * 0.72);

        return (
          <motion.div
            key={`${orb.color}-${orb.left}-${orb.top}`}
            aria-hidden="true"
            className="absolute rounded-[50%]"
            style={{
              left: orb.left,
              top: orb.top,
              width: "40vmax",
              height: "40vmax",
              background: `radial-gradient(circle at 35% 35%, ${tint} 0%, ${shade} 42%, ${withAlpha(
                palette.bg,
                0,
              )} 72%)`,
              filter: "blur(100px)",
              mixBlendMode: blendMode,
              willChange: "transform, opacity",
            }}
            animate={
              reduceMotion
                ? { x: 0, y: 0, opacity: orb.opacity }
                : { x: orb.x, y: orb.y, opacity: [orb.opacity, orb.opacity * 1.14, orb.opacity] }
            }
            transition={{
              duration: orb.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      })}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${withAlpha(palette.bg, 0)} 0%, ${withAlpha(
            palette.bgSoft,
            0.16,
          )} 100%)`,
        }}
      />
    </div>
  );
}
