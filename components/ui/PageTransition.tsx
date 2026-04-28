"use client";

import { AnimatePresence, LazyMotion, domAnimation, useReducedMotion } from "framer-motion";
import * as motion from "framer-motion/client";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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
    }, reducedMotion ? 80 : 260);

    return () => window.clearTimeout(timer);
  }, [children, pathname, reducedMotion]);

  return (
    <LazyMotion features={domAnimation}>
      <>
        <motion.div
          key={displayPath}
          initial={{ opacity: 0, y: reducedMotion ? 0 : 12, filter: reducedMotion ? "none" : "blur(8px)" }}
          animate={{ opacity: isTransitioning ? 0.72 : 1, y: 0, filter: "blur(0px)" }}
          transition={
            reducedMotion
              ? { duration: 0.12, ease: [0.16, 1, 0.3, 1] }
              : { duration: 0.42, ease: [0.16, 1, 0.3, 1] }
          }
        >
          {displayChildren}
        </motion.div>
        <AnimatePresence>
          {isTransitioning ? (
            <motion.div
              className="page-transition-overlay"
              initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
              animate={{ opacity: reducedMotion ? 0.32 : 1, clipPath: "inset(0 0 0% 0)" }}
              exit={{ opacity: 0, clipPath: "inset(100% 0 0 0)" }}
              transition={{ duration: reducedMotion ? 0.1 : 0.34, ease: [0.16, 1, 0.3, 1] }}
            />
          ) : null}
        </AnimatePresence>
      </>
    </LazyMotion>
  );
}
