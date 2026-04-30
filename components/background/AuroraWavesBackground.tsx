"use client";

import { motion, useReducedMotion } from "framer-motion";

import type { ThemePalette } from "@/lib/theme-lab";
import { withAlpha } from "@/lib/theme-lab";

type RibbonConfig = {
  color: keyof Pick<ThemePalette, "accent" | "accentStrong" | "shaderWarm" | "shaderMid" | "accentGlow">;
  opacity: number;
  top: string;
  height: string;
  width: string;
  left: string;
  rotate: number;
  x: [string, string, string];
  y: [string, string, string];
  duration: number;
};

const RIBBONS: RibbonConfig[] = [
  {
    color: "accent",
    opacity: 0.2,
    top: "-8%",
    height: "28vh",
    width: "130%",
    left: "-15%",
    rotate: -2.5,
    x: ["-2%", "3%", "-2%"],
    y: ["-1%", "4%", "-1%"],
    duration: 28,
  },
  {
    color: "accentStrong",
    opacity: 0.14,
    top: "12%",
    height: "32vh",
    width: "140%",
    left: "-20%",
    rotate: 1.8,
    x: ["3%", "-4%", "3%"],
    y: ["2%", "-3%", "2%"],
    duration: 35,
  },
  {
    color: "shaderWarm",
    opacity: 0.24,
    top: "32%",
    height: "30vh",
    width: "135%",
    left: "-18%",
    rotate: -1.2,
    x: ["-3%", "2%", "-3%"],
    y: ["-2%", "5%", "-2%"],
    duration: 30,
  },
  {
    color: "shaderMid",
    opacity: 0.16,
    top: "52%",
    height: "26vh",
    width: "125%",
    left: "-12%",
    rotate: 2.2,
    x: ["2%", "-3%", "2%"],
    y: ["3%", "-2%", "3%"],
    duration: 38,
  },
  {
    color: "accentGlow",
    opacity: 0.18,
    top: "70%",
    height: "30vh",
    width: "130%",
    left: "-15%",
    rotate: -1.8,
    x: ["-2%", "4%", "-2%"],
    y: ["-3%", "2%", "-3%"],
    duration: 32,
  },
];

const MASK =
  "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.6) 15%, white 30%, white 70%, rgba(255,255,255,0.6) 85%, transparent 100%)";

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

      {/* Ribbon layers */}
      {RIBBONS.map((ribbon) => {
        const base = palette[ribbon.color];

        return (
          <motion.div
            key={`${ribbon.color}-${ribbon.top}`}
            className="absolute"
            style={{
              top: ribbon.top,
              left: ribbon.left,
              width: ribbon.width,
              height: ribbon.height,
              background: `linear-gradient(90deg, transparent 0%, ${withAlpha(base, ribbon.opacity)} 18%, ${withAlpha(
                base,
                ribbon.opacity * 1.3,
              )} 50%, ${withAlpha(base, ribbon.opacity)} 82%, transparent 100%)`,
              maskImage: MASK,
              WebkitMaskImage: MASK,
              mixBlendMode: "screen",
              transform: `rotate(${ribbon.rotate}deg)`,
              transformOrigin: "center center",
              willChange: "transform",
            }}
            animate={
              reduceMotion
                ? { x: "0%", y: "0%", opacity: 1 }
                : {
                    x: ribbon.x,
                    y: ribbon.y,
                    opacity: [1, 1.15, 1],
                  }
            }
            transition={{
              duration: ribbon.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      })}

      {/* Central accent glow */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 70% 50% at 50% 42%, ${withAlpha(palette.accent, 0.08)} 0%, transparent 65%)`,
        }}
      />

      {/* Top warm bleed */}
      <motion.div
        className="absolute inset-x-0 top-0 h-[25vh]"
        style={{
          background: `linear-gradient(180deg, ${withAlpha(palette.accentStrong, 0.06)} 0%, transparent 100%)`,
        }}
        animate={
          reduceMotion
            ? { opacity: 0.5 }
            : { opacity: [0.25, 0.6, 0.25] }
        }
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Noise texture */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/noise.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "220px 220px",
          opacity: 0.04,
          mixBlendMode: "soft-light",
        }}
      />
    </div>
  );
}
