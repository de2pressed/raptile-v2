"use client";

import { AnimatePresence, LazyMotion, domAnimation } from "framer-motion";
import * as motion from "framer-motion/client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { BrandLogo } from "@/components/layout/BrandLogo";
import { useRaptileStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/collection", label: "Collection" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/cart", label: "Cart" },
];

export function Nav() {
  const pathname = usePathname();
  const cartCount = useRaptileStore((state) => state.cartLines.reduce((total, line) => total + line.quantity, 0));
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateHeaderState = () => {
      setScrolled(window.scrollY > 28);
    };

    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState, { passive: true });

    return () => window.removeEventListener("scroll", updateHeaderState);
  }, []);

  return (
    <LazyMotion features={domAnimation}>
      <nav
        className="site-header noise-surface sticky top-0 z-[100] border-b border-[color:var(--glass-border)] backdrop-blur-[16px]"
        data-scrolled={scrolled}
      >
        <div className="site-header-inner relative z-[1] mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-4 py-3 md:px-6">
          <BrandLogo size="sm" className="site-header-logo absolute left-4 shrink-0 md:left-6" />
          <div className="site-header-links ml-auto hidden items-center gap-5 md:flex">
            {navLinks.map((link) => {
              const label = link.href === "/cart" ? `Cart (${cartCount})` : link.label;
              const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "t-label transition-colors duration-200",
                    active ? "text-[color:var(--text)]" : "text-[color:var(--text-muted)] hover:text-[color:var(--text)]",
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </div>
          <button
            aria-expanded={menuOpen}
            aria-label="Toggle navigation menu"
            className="ghost-button ml-auto inline-flex min-h-11 min-w-[4.75rem] items-center justify-center rounded-full px-4 py-2 font-display text-[0.75rem] font-semibold tracking-[0.08em] text-[color:var(--text)] md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
          >
            <span className="relative z-[1]">Menu</span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            className="fixed inset-0 z-[130] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              aria-label="Close navigation menu"
              className="absolute inset-0 bg-[color:var(--bg)]/84"
              onClick={() => setMenuOpen(false)}
              type="button"
            />
            <motion.div
              className="noise-surface absolute inset-x-4 top-4 rounded-[28px] border border-[color:var(--glass-border)] bg-[color:var(--bg-soft)] p-6 shadow-[0_20px_52px_rgba(0,0,0,0.22)]"
              initial={{ y: -24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="relative z-[1] flex items-center justify-between">
                <div className="t-label text-[color:var(--text-muted)]">Raptile Navigation</div>
                <button
                  aria-label="Close navigation"
                  className="inline-flex items-center justify-center rounded-full border border-[color:var(--glass-border)] px-4 py-2 font-display text-[0.75rem] font-semibold tracking-[0.08em] text-[color:var(--text)]"
                  onClick={() => setMenuOpen(false)}
                  type="button"
                >
                  Close
                </button>
              </div>
              <div className="relative z-[1] mt-8 flex flex-col gap-5">
                {navLinks.map((link) => {
                  const label = link.href === "/cart" ? `Cart (${cartCount})` : link.label;
                  const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "font-display text-[2rem] font-bold tracking-[-0.04em]",
                        active ? "text-[color:var(--text)]" : "text-[color:var(--text-muted)]",
                      )}
                      onClick={() => setMenuOpen(false)}
                    >
                      {label}
                    </Link>
                  );
                })}
              </div>
              <p className="t-ui relative z-[1] mt-10 max-w-[22rem] leading-6 text-[color:var(--text-muted)]">
                Utility first. Quiet editorial framing. The product stays in front.
              </p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </LazyMotion>
  );
}
