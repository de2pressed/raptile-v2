"use client";

import { LazyMotion, domAnimation, useReducedMotion } from "framer-motion";
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
    }, reducedMotion ? 80 : 140);

    return () => window.clearTimeout(timer);
  }, [children, pathname, reducedMotion]);

  return (
    <LazyMotion features={domAnimation}>
      <>
        <motion.div
          key={displayPath}
          initial={{ opacity: 0, y: reducedMotion ? 0 : 4 }}
          animate={{ opacity: isTransitioning ? 0.82 : 1, y: 0 }}
          transition={
            reducedMotion
              ? { duration: 0.12, ease: [0.16, 1, 0.3, 1] }
              : { duration: 0.22, ease: [0.16, 1, 0.3, 1] }
          }
        >
          {displayChildren}
        </motion.div>
      </>
    </LazyMotion>
  );
}
