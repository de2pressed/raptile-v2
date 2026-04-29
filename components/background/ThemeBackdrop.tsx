"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { ComponentType, ReactNode } from "react";

import DarkroomSweep from "@/components/background/ShaderBackground";
import FoldEngine from "@/components/background/SignalFieldBackground";
import LoomRegister from "@/components/background/QuietPlaneBackground";
import PressPlateBloom from "@/components/background/OxidisedRelief";
import WeatherCell from "@/components/background/LiquidBackground";
import { useThemeLab } from "@/components/providers/ThemeLabProvider";
import type { ThemeBackgroundId, ThemePalette } from "@/lib/theme-lab";

function BackdropFrame({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.01 }}
      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.005 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

const BACKGROUNDS: Record<ThemeBackgroundId, ComponentType<{ palette: ThemePalette }>> = {
  "press-plate-bloom": PressPlateBloom,
  "loom-register": LoomRegister,
  "darkroom-sweep": DarkroomSweep,
  "fold-engine": FoldEngine,
  "weather-cell": WeatherCell,
} as const;

export function ThemeBackdrop() {
  const { background, palette } = useThemeLab();
  const Background = BACKGROUNDS[background.id];

  return (
    <AnimatePresence mode="wait" initial={false}>
      <BackdropFrame key={background.id}>
        <Background palette={palette} />
      </BackdropFrame>
    </AnimatePresence>
  );
}
