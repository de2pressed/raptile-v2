"use client";

import { motion, useReducedMotion } from "framer-motion";

import AuroraWavesBackground from "@/components/background/AuroraWavesBackground";
import { EMBER_CURRENT } from "@/lib/theme-lab";

export function ThemeBackdrop() {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.01 }}
      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
    >
      <AuroraWavesBackground palette={EMBER_CURRENT} />
    </motion.div>
  );
}
