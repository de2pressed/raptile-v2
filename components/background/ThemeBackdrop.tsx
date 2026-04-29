"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

import { LiquidBackground } from "@/components/background/LiquidBackground";
import OxidisedRelief from "@/components/background/OxidisedRelief";
import { QuietPlaneBackground } from "@/components/background/QuietPlaneBackground";
import { SignalFieldBackground } from "@/components/background/SignalFieldBackground";
import { ShaderBackground } from "@/components/background/ShaderBackground";
import { useThemeLab } from "@/components/providers/ThemeLabProvider";

function BackdropFrame({ children }: { children: ReactNode }) {
  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      initial={{ opacity: 0, scale: 1.01 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.005 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function ThemeBackdrop() {
  const { background, palette } = useThemeLab();

  return (
    <AnimatePresence mode="wait" initial={false}>
      {background.id === "oxidised-relief" ? (
        <BackdropFrame key={background.id}>
          <OxidisedRelief palette={palette} />
        </BackdropFrame>
      ) : background.id === "liquid-drift" ? (
        <BackdropFrame key={background.id}>
          <LiquidBackground palette={palette} />
        </BackdropFrame>
      ) : background.id === "quiet-plane" ? (
        <BackdropFrame key={background.id}>
          <QuietPlaneBackground palette={palette} />
        </BackdropFrame>
      ) : background.id === "monsoon-veil" ? (
        <BackdropFrame key={background.id}>
          <ShaderBackground palette={palette} />
        </BackdropFrame>
      ) : (
        <BackdropFrame key={background.id}>
          <SignalFieldBackground palette={palette} />
        </BackdropFrame>
      )}
    </AnimatePresence>
  );
}
