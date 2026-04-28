"use client";

import { AnimatePresence, LazyMotion, domAnimation } from "framer-motion";
import * as motion from "framer-motion/client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { GlassPanel } from "@/components/ui/GlassPanel";
import { useRaptileStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "COLLECTION" },
  { href: "/contact", label: "CONTACT" },
];

export function Nav() {
  const pathname = usePathname();
  const setCartOpen = useRaptileStore((state) => state.setCartOpen);
  const cartCount = useRaptileStore((state) =>
    state.cartLines.reduce((total, line) => total + line.quantity, 0),
  );
  const [menuOpen, setMenuOpen] = useState(false);

  if (pathname.startsWith("/products/")) {
    return null;
  }

  return (
    <LazyMotion features={domAnimation}>
      <nav className="sticky top-0 z-[100] px-4 pb-4 pt-5 md:px-6">
        <GlassPanel className="mx-auto max-w-[1440px] rounded-[26px] px-4 py-4 md:px-6">
          <div className="flex items-center justify-between gap-6">
            <Link href="/" className="font-display text-xl font-bold tracking-[-0.04em] md:text-2xl">
              RAPTILE STUDIO
            </Link>
            <div className="hidden items-center gap-5 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="t-label transition-colors duration-200 hover:text-[color:var(--accent-strong)]"
                >
                  {link.label}
                </Link>
              ))}
              <button
                className="t-label transition-colors duration-200 hover:text-[color:var(--accent-strong)]"
                onClick={() => setCartOpen(true)}
                type="button"
              >
                CART({cartCount})
              </button>
            </div>
            <button
              className="t-label md:hidden"
              onClick={() => setMenuOpen((open) => !open)}
              type="button"
            >
              [MENU]
            </button>
          </div>
        </GlassPanel>
      </nav>
      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            className="fixed inset-0 z-[130] px-4 py-5 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <GlassPanel className="glass-panel-heavy flex h-full flex-col justify-between rounded-[34px] px-6 py-6">
              <div className="flex items-center justify-between">
                <div className="t-label text-[color:var(--text-muted)]">RAPTILE NAV</div>
                <button className="t-label" onClick={() => setMenuOpen(false)} type="button">
                  [CLOSE]
                </button>
              </div>
              <div className="flex flex-col gap-5">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn("font-display text-3xl font-bold tracking-[-0.04em]")}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <button
                  className="font-display text-left text-3xl font-bold tracking-[-0.04em]"
                  onClick={() => {
                    setCartOpen(true);
                    setMenuOpen(false);
                  }}
                  type="button"
                >
                  CART({cartCount})
                </button>
              </div>
              <p className="t-ui max-w-[20rem] text-[color:var(--text-muted)]">
                Spatial editorial commerce with material-led silhouettes, grounded palettes, and slow release
                cycles.
              </p>
            </GlassPanel>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </LazyMotion>
  );
}
