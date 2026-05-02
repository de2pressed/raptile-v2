"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { ArrowRightIcon, CloseIcon } from "@/components/ui/icons";
import { desktopLinks, isActiveLink, secondaryLinks } from "@/components/layout/Nav";
import { useRaptileStore } from "@/lib/store";
import { cn } from "@/lib/utils";

function sectionLinkClass(active: boolean) {
  return cn(
    "group flex items-center justify-between rounded-[22px] border px-4 py-4 transition duration-200",
    active
      ? "border-[color:var(--accent)] bg-[color:rgba(255,255,255,0.05)] text-[color:var(--text)]"
      : "border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.025)] text-[color:var(--text-muted)] hover:border-[color:var(--accent)] hover:text-[color:var(--text)]",
  );
}

export function MobileNavOverlay() {
  const pathname = usePathname();
  const isOpen = useRaptileStore((state) => state.isMobileNavOpen);
  const setMobileNavOpen = useRaptileStore((state) => state.setMobileNavOpen);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileNavOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [isOpen, setMobileNavOpen]);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname, setMobileNavOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      aria-label="Mobile navigation"
      aria-modal="true"
      className="fixed inset-0 z-[1000] md:hidden"
      role="dialog"
    >
      <button
        aria-label="Close navigation menu"
        className="absolute inset-0 bg-[color:rgba(0,0,0,0.72)]"
        onClick={() => setMobileNavOpen(false)}
        type="button"
      />

      <div className="absolute inset-0 flex flex-col bg-[color:var(--bg)]">
        <div className="flex items-start justify-between gap-4 border-b border-[color:var(--glass-border)] px-4 pt-[calc(1rem+env(safe-area-inset-top))] pb-4">
          <div className="space-y-1">
            <div className="t-label text-[color:var(--text-muted)]">Menu</div>
            <div className="font-display text-[1.45rem] font-semibold tracking-[-0.04em] text-[color:var(--text)]">
              Navigate the store
            </div>
          </div>

          <button
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.03)] text-[color:var(--text-muted)] transition duration-200 hover:border-[color:var(--accent)] hover:text-[color:var(--text)]"
            onClick={() => setMobileNavOpen(false)}
            type="button"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="grid gap-5">
            <div className="grid gap-3">
              <div className="t-label text-[color:var(--text-muted)]">Browse</div>
              <div className="grid gap-3">
                {desktopLinks.map((link) => {
                  const active = isActiveLink(pathname, link.href);

                  return (
                    <Link
                      key={link.href}
                      className={sectionLinkClass(active)}
                      href={link.href}
                      onClick={() => setMobileNavOpen(false)}
                    >
                      <span className="font-display text-[1.05rem] font-semibold tracking-[-0.04em]">{link.label}</span>
                      <ArrowRightIcon className="h-4 w-4 text-[color:var(--text-subtle)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[color:var(--text)]" />
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-3">
              <div className="t-label text-[color:var(--text-muted)]">Support</div>
              <div className="grid gap-3">
                {secondaryLinks.map((link) => {
                  const active = isActiveLink(pathname, link.href);

                  return (
                    <Link
                      key={link.href}
                      className={sectionLinkClass(active)}
                      href={link.href}
                      onClick={() => setMobileNavOpen(false)}
                    >
                      <span className="font-display text-[1rem] font-semibold tracking-[-0.04em]">{link.label}</span>
                      <ArrowRightIcon className="h-4 w-4 text-[color:var(--text-subtle)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[color:var(--text)]" />
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-3 border-t border-[color:var(--glass-border)] pt-4">
              <p className="t-ui max-w-[26rem] text-[color:var(--text-muted)]">
                Heavyweight fits, precise cuts, and direct support routes. No extra page wandering.
              </p>

              <div className="flex flex-wrap gap-2">
                <Link
                  className="ghost-button rounded-full px-4 py-2"
                  href="/collection"
                  onClick={() => setMobileNavOpen(false)}
                >
                  <span className="t-label">Shop now</span>
                </Link>
                <Link
                  className="ghost-button rounded-full px-4 py-2"
                  href="/size-guide"
                  onClick={() => setMobileNavOpen(false)}
                >
                  <span className="t-label">Size guide</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
