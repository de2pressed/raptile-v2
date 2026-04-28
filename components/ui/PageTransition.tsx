"use client";

import { AnimatePresence, LazyMotion, domAnimation, useReducedMotion } from "framer-motion";
import * as motion from "framer-motion/client";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const SHUTTER_COLOR = "oklch(0.08 0.01 40)";
const EASE = [0.76, 0, 0.24, 1] as const;

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const initialPathRef = useRef(pathname);
  const [displayChildren, setDisplayChildren] = useState(children);
  const [displayPath, setDisplayPath] = useState(pathname);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (initialPathRef.current === pathname) {
      initialPathRef.current = "";
      setDisplayChildren(children);
      setDisplayPath(pathname);
      return;
    }

    setIsTransitioning(true);

    const timer = window.setTimeout(() => {
      setDisplayChildren(children);
      setDisplayPath(pathname);
      setIsTransitioning(false);
    }, reducedMotion ? 200 : 280);

    return () => window.clearTimeout(timer);
  }, [children, pathname, reducedMotion]);

  return (
    <LazyMotion features={domAnimation}>
      <>
        <motion.div
          key={displayPath}
          initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            reducedMotion
              ? { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
              : { duration: 0.28, delay: 0.18, ease: [0.16, 1, 0.3, 1] }
          }
        >
          {displayChildren}
        </motion.div>

        <AnimatePresence>
          {isTransitioning ? (
            <motion.div
              key="page-shutter"
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 9999,
                background: SHUTTER_COLOR,
                pointerEvents: "all",
              }}
              initial={reducedMotion ? { opacity: 0 } : { clipPath: "circle(0% at 50% 50%)" }}
              animate={reducedMotion ? { opacity: 1 } : { clipPath: "circle(150% at 50% 50%)" }}
              exit={reducedMotion ? { opacity: 0 } : { clipPath: "circle(0% at 50% 50%)" }}
              transition={reducedMotion ? { duration: 0.2 } : { duration: 0.22, ease: EASE }}
            />
          ) : null}
        </AnimatePresence>
      </>
    </LazyMotion>
  );
}
