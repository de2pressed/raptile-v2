"use client";

import type { PropsWithChildren } from "react";

import { AnimatePresence, LazyMotion, domAnimation, useReducedMotion } from "framer-motion";
import * as motion from "framer-motion/client";
import { usePathname } from "next/navigation";

export function PageTransition({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={pathname}
          className="relative"
          initial={reducedMotion ? false : { opacity: 0, y: 8 }}
          animate={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          exit={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -4 }}
          transition={{
            duration: reducedMotion ? 0 : 0.24,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {!reducedMotion ? (
            <motion.div
              aria-hidden
              className="pointer-events-none fixed inset-0 z-[180] bg-[color:var(--accent-glow)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.24, times: [0, 0.33, 1] }}
            />
          ) : null}
          {children}
        </motion.div>
      </AnimatePresence>
    </LazyMotion>
  );
}
