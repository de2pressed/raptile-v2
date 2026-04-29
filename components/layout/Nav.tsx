"use client";

import { AnimatePresence, LazyMotion, domAnimation } from "framer-motion";
import * as motion from "framer-motion/client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { BrandLogo } from "@/components/layout/BrandLogo";
import { ArrowRightIcon, CartIcon, CloseIcon, MenuIcon, SearchIcon } from "@/components/ui/icons";
import type { CatalogSearchResult } from "@/lib/catalog";
import { useRaptileStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { shopifyImageUrl } from "@/lib/utils/shopifyImage";

const desktopLinks = [
  { href: "/", label: "Home" },
  { href: "/collection", label: "Collection" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const mobileLinks = [
  ...desktopLinks,
  { href: "/shipping", label: "Shipping" },
  { href: "/returns", label: "Returns" },
  { href: "/size-guide", label: "Size Guide" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms" },
];

const secondaryLinks = [
  { href: "/shipping", label: "Shipping" },
  { href: "/returns", label: "Returns" },
  { href: "/size-guide", label: "Size Guide" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

function isActiveLink(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function SearchResultsPanel({
  results,
  query,
  loading,
  onNavigate,
}: {
  results: CatalogSearchResult[];
  query: string;
  loading: boolean;
  onNavigate?: () => void;
}) {
  return (
    <div className="grid gap-2">
      {results.length > 0 ? (
        results.map((result) => (
          <Link
            key={result.handle}
            className="group grid grid-cols-[52px_minmax(0,1fr)] gap-3 rounded-[20px] border border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.025)] p-3 transition duration-200 hover:border-[color:var(--accent)] hover:bg-[color:rgba(255,255,255,0.045)]"
            href={`/products/${result.handle}`}
            onClick={onNavigate}
          >
            <div className="relative aspect-square overflow-hidden rounded-[16px] bg-[color:var(--bg-elevated)]">
              {result.imageUrl ? (
                <Image
                  alt={result.imageAlt ?? result.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                  fill
                  sizes="52px"
                  src={shopifyImageUrl(result.imageUrl, { width: 120 })}
                />
              ) : null}
            </div>
            <div className="min-w-0 space-y-1">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-display text-[1rem] font-semibold tracking-[-0.03em] text-[color:var(--text)]">
                    {result.title}
                  </div>
                  <div className="t-ui mt-1 text-[color:var(--text-subtle)]">{result.matchLabel}</div>
                </div>
                <div className="t-price shrink-0 text-[color:var(--text-muted)]">{result.price}</div>
              </div>
              <div className="t-ui max-w-[30ch] text-[color:var(--text-muted)]">{result.description}</div>
            </div>
          </Link>
        ))
      ) : loading ? (
        Array.from({ length: 4 }).map((_, index) => (
          <div
            key={`search-skel-${index}`}
            className="grid grid-cols-[52px_minmax(0,1fr)] gap-3 rounded-[20px] border border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.02)] p-3"
          >
            <div className="skeleton-shimmer aspect-square rounded-[16px]" />
            <div className="grid gap-2">
              <div className="skeleton-shimmer h-4 w-2/3 rounded-full" />
              <div className="skeleton-shimmer h-3 w-full rounded-full" />
              <div className="skeleton-shimmer h-3 w-3/5 rounded-full" />
            </div>
          </div>
        ))
      ) : (
        <div className="rounded-[22px] border border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.02)] px-4 py-5 text-[color:var(--text-muted)]">
          No predicted results for &quot;{query || "All products"}&quot;.
        </div>
      )}
    </div>
  );
}

export function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const cartCount = useRaptileStore((state) => state.cartLines.reduce((total, line) => total + line.quantity, 0));
  const isCollectionSearchVisible = useRaptileStore((state) => state.isCollectionSearchVisible);
  const [desktopSearchOpen, setDesktopSearchOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CatalogSearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const desktopInputRef = useRef<HTMLInputElement | null>(null);
  const mobileInputRef = useRef<HTMLInputElement | null>(null);

  const hideSearchTrigger = isCollectionSearchVisible && !desktopSearchOpen && !mobileSearchOpen;

  useEffect(() => {
    setDesktopSearchOpen(false);
    setMobileSearchOpen(false);
    setMenuOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  }, [pathname]);

  useEffect(() => {
    const active = desktopSearchOpen || mobileSearchOpen;
    if (!active) {
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        setSearchLoading(true);
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Search request failed with status ${response.status}`);
        }

        const payload = (await response.json()) as { results?: CatalogSearchResult[] };
        setSearchResults(payload.results ?? []);
      } catch (error) {
        if ((error as { name?: string } | null)?.name !== "AbortError") {
          setSearchResults([]);
        }
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [desktopSearchOpen, mobileSearchOpen, searchQuery]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      setDesktopSearchOpen(false);
      setMobileSearchOpen(false);
      setMenuOpen(false);
      setSearchQuery("");
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [desktopSearchOpen, mobileSearchOpen]);

  useEffect(() => {
    if (desktopSearchOpen) {
      desktopInputRef.current?.focus();
    }
  }, [desktopSearchOpen]);

  useEffect(() => {
    if (mobileSearchOpen) {
      mobileInputRef.current?.focus();
    }
  }, [mobileSearchOpen]);

  const openDesktopSearch = () => {
    setMenuOpen(false);
    setMobileSearchOpen(false);
    setDesktopSearchOpen(true);
  };

  const openMobileSearch = () => {
    setMenuOpen(false);
    setDesktopSearchOpen(false);
    setMobileSearchOpen(true);
  };

  const submitSearch = () => {
    const trimmed = searchQuery.trim();
    setDesktopSearchOpen(false);
    setMobileSearchOpen(false);
    setMenuOpen(false);
    router.push(trimmed ? `/collection?q=${encodeURIComponent(trimmed)}` : "/collection");
  };

  const desktopSearch = (
    <form
      className={cn(
        "hidden md:flex items-center overflow-hidden rounded-full border border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.03)]",
        desktopSearchOpen ? "pointer-events-auto" : "pointer-events-auto",
      )}
      onSubmit={(event) => {
        event.preventDefault();
        submitSearch();
      }}
    >
      <button
        aria-label={desktopSearchOpen ? "Close search" : "Open search"}
        className="flex h-10 w-10 items-center justify-center text-[color:var(--text-muted)] transition-colors duration-200 hover:text-[color:var(--text)]"
        onClick={() => {
          if (desktopSearchOpen) {
            setDesktopSearchOpen(false);
            setSearchQuery("");
            return;
          }
          openDesktopSearch();
        }}
        type="button"
      >
        <SearchIcon className="h-4 w-4" />
      </button>
      <motion.input
        ref={desktopInputRef}
        aria-label="Search products"
        className={cn(
          "h-10 border-0 bg-transparent px-0 text-[0.92rem] text-[color:var(--text)] outline-none placeholder:text-[color:var(--text-subtle)]",
          desktopSearchOpen ? "pr-4 opacity-100" : "w-0 pr-0 opacity-0",
        )}
        onChange={(event) => setSearchQuery(event.target.value)}
        placeholder="Search products"
        value={searchQuery}
        initial={false}
        animate={{ width: desktopSearchOpen ? 260 : 0, opacity: desktopSearchOpen ? 1 : 0 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      />
    </form>
  );

  return (
    <LazyMotion features={domAnimation}>
      <nav className="site-header noise-surface relative sticky top-0 z-[100] border-b border-[color:var(--glass-border)]">
        <div className="site-header-inner relative z-[1] mx-auto max-w-[1440px] px-4 py-3 md:px-6">
          <div className="hidden items-center gap-5 md:flex">
            <BrandLogo size="sm" className="site-header-logo shrink-0" />
            <div className="site-header-links ml-3 flex flex-1 items-center justify-center gap-6">
              {desktopLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "t-label transition-colors duration-200",
                    isActiveLink(pathname, link.href)
                      ? "text-[color:var(--text)]"
                      : "text-[color:var(--text-muted)] hover:text-[color:var(--text)]",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {hideSearchTrigger ? null : desktopSearch}
              <Link
                aria-label={`Cart, ${cartCount} items`}
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.03)] text-[color:var(--text-muted)] transition-colors duration-200 hover:border-[color:var(--accent)] hover:text-[color:var(--text)]"
                href="/cart"
              >
                <CartIcon className="h-4 w-4" />
                {cartCount > 0 ? (
                  <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full border border-[color:var(--bg)] bg-[color:var(--accent)] px-1.5 py-0.5 font-mono text-[0.6rem] font-semibold text-[color:var(--bg)]">
                    {cartCount}
                  </span>
                ) : null}
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 md:hidden">
            <button
              aria-label="Open search"
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.03)] text-[color:var(--text-muted)] transition duration-200 hover:border-[color:var(--accent)] hover:text-[color:var(--text)]",
                hideSearchTrigger && "opacity-0 pointer-events-none",
              )}
              onClick={openMobileSearch}
              type="button"
            >
              <SearchIcon className="h-4 w-4" />
            </button>

            <BrandLogo size="sm" className="site-header-logo justify-self-center" />

            <div className="flex items-center gap-2 justify-self-end">
              <Link
                aria-label={`Cart, ${cartCount} items`}
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.03)] text-[color:var(--text-muted)] transition-colors duration-200 hover:border-[color:var(--accent)] hover:text-[color:var(--text)]"
                href="/cart"
              >
                <CartIcon className="h-4 w-4" />
                {cartCount > 0 ? (
                  <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full border border-[color:var(--bg)] bg-[color:var(--accent)] px-1.5 py-0.5 font-mono text-[0.6rem] font-semibold text-[color:var(--bg)]">
                    {cartCount}
                  </span>
                ) : null}
              </Link>

              <button
                aria-expanded={menuOpen}
                aria-label="Open navigation menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.03)] text-[color:var(--text-muted)] transition duration-200 hover:border-[color:var(--accent)] hover:text-[color:var(--text)]"
                onClick={() => {
                  setDesktopSearchOpen(false);
                  setMobileSearchOpen(false);
                  setMenuOpen((current) => !current);
                }}
                type="button"
              >
                <MenuIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          <AnimatePresence>
              {desktopSearchOpen ? (
                <motion.div
                  className="pointer-events-none absolute left-0 right-0 top-full hidden px-4 md:block md:px-6"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                >
                  <div className="mx-auto mt-3 max-w-[1440px]">
                    <div className="pointer-events-auto noise-surface rounded-[28px] border border-[color:var(--glass-border)] bg-[color:rgba(8,12,24,0.92)] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.3)]">
                      <div className="mt-4 grid gap-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="t-label text-[color:var(--text-muted)]">Predicted results</div>
                        <div className="t-ui text-[color:var(--text-subtle)]">
                          {searchLoading ? "Updating" : `${searchResults.length} matches`}
                        </div>
                      </div>

                      <SearchResultsPanel
                        loading={searchLoading}
                        onNavigate={() => {
                          setDesktopSearchOpen(false);
                          setSearchQuery("");
                        }}
                        query={searchQuery.trim()}
                        results={searchResults}
                      />

                      <Link
                        className="group flex items-center justify-between rounded-[20px] border border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.025)] px-4 py-3 transition duration-200 hover:border-[color:var(--accent)] hover:bg-[color:rgba(255,255,255,0.045)]"
                        href={`/collection${searchQuery.trim() ? `?q=${encodeURIComponent(searchQuery.trim())}` : ""}`}
                        onClick={() => {
                          setDesktopSearchOpen(false);
                          setSearchQuery("");
                        }}
                      >
                        <span className="t-label text-[color:var(--text-muted)]">
                          Search all results for &quot;{searchQuery.trim() || "all products"}&quot;
                        </span>
                        <ArrowRightIcon className="h-4 w-4 text-[color:var(--text-subtle)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[color:var(--text)]" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <AnimatePresence>
            {mobileSearchOpen ? (
                <motion.div
                  className="absolute left-0 right-0 top-0 z-[110] px-4 pt-3 md:hidden"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                >
                  <form
                    className="noise-surface rounded-[24px] border border-[color:var(--glass-border)] bg-[color:rgba(8,12,24,0.92)] p-4 shadow-[0_20px_48px_rgba(0,0,0,0.26)]"
                    onSubmit={(event) => {
                      event.preventDefault();
                      submitSearch();
                  }}
                >
                  <div className="flex items-center gap-3 rounded-full border border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.03)] px-4 py-3">
                    <button
                      aria-label="Close search"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[color:var(--text-muted)] transition duration-200 hover:text-[color:var(--text)]"
                      onClick={() => {
                        setMobileSearchOpen(false);
                        setSearchQuery("");
                      }}
                      type="button"
                    >
                      <CloseIcon className="h-4 w-4" />
                    </button>
                    <input
                      aria-label="Search products"
                      className="h-8 w-full border-0 bg-transparent text-[0.95rem] text-[color:var(--text)] outline-none placeholder:text-[color:var(--text-subtle)]"
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Search products"
                      ref={mobileInputRef}
                      value={searchQuery}
                    />
                    <button
                      aria-label="Search"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[color:var(--text-muted)] transition duration-200 hover:text-[color:var(--text)]"
                      type="submit"
                    >
                      <ArrowRightIcon className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-4 grid gap-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="t-label text-[color:var(--text-muted)]">Predicted results</div>
                      <div className="t-ui text-[color:var(--text-subtle)]">
                        {searchLoading ? "Updating" : `${searchResults.length} matches`}
                      </div>
                    </div>

                    <SearchResultsPanel
                      loading={searchLoading}
                      onNavigate={() => {
                        setMobileSearchOpen(false);
                        setSearchQuery("");
                      }}
                      query={searchQuery.trim()}
                      results={searchResults}
                    />

                    <Link
                      className="group flex items-center justify-between rounded-[20px] border border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.025)] px-4 py-3 transition duration-200 hover:border-[color:var(--accent)] hover:bg-[color:rgba(255,255,255,0.045)]"
                      href={`/collection${searchQuery.trim() ? `?q=${encodeURIComponent(searchQuery.trim())}` : ""}`}
                      onClick={() => {
                        setMobileSearchOpen(false);
                        setSearchQuery("");
                      }}
                    >
                      <span className="t-label text-[color:var(--text-muted)]">
                        Search all results for &quot;{searchQuery.trim() || "all products"}&quot;
                      </span>
                      <ArrowRightIcon className="h-4 w-4 text-[color:var(--text-subtle)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[color:var(--text)]" />
                    </Link>
                  </div>
                </form>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <AnimatePresence>
            {menuOpen ? (
              <motion.div
                className="absolute left-0 right-0 top-full z-[125] px-4 md:hidden"
                initial={{ opacity: 0, y: "-100%" }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: "-100%" }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="noise-surface rounded-[28px] border border-[color:var(--glass-border)] bg-[color:rgba(8,12,24,0.94)] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.34)]">
                  <div className="flex items-center justify-between gap-4">
                    <div className="t-label text-[color:var(--text-muted)]">Raptile Studio</div>
                    <button
                      aria-label="Close navigation menu"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--glass-border)] text-[color:var(--text-muted)] transition duration-200 hover:border-[color:var(--accent)] hover:text-[color:var(--text)]"
                      onClick={() => setMenuOpen(false)}
                      type="button"
                    >
                      <CloseIcon className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-5 grid gap-4">
                    <div className="grid gap-3">
                      {mobileLinks.map((link) => {
                        const active = isActiveLink(pathname, link.href);

                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                              "flex items-center justify-between rounded-[20px] border px-4 py-4 transition duration-200",
                              active
                                ? "border-[color:var(--accent)] bg-[color:var(--accent-subtle)] text-[color:var(--text)]"
                                : "border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.02)] text-[color:var(--text-muted)] hover:border-[color:var(--accent)] hover:text-[color:var(--text)]",
                            )}
                            onClick={() => setMenuOpen(false)}
                          >
                            <span className="font-display text-[1.35rem] font-semibold tracking-[-0.04em]">
                              {link.label}
                            </span>
                            <ArrowRightIcon className="h-4 w-4" />
                          </Link>
                        );
                      })}
                    </div>

                    <div className="grid gap-4 border-t border-[color:var(--glass-border)] pt-4">
                      <div className="grid gap-2">
                        <div className="t-label text-[color:var(--text-muted)]">Secondary links</div>
                        <div className="flex flex-wrap gap-2">
                        {secondaryLinks.map((link) => (
                          <Link
                              key={link.href}
                              className="ghost-button rounded-full px-4 py-2"
                              href={link.href}
                              onClick={() => setMenuOpen(false)}
                            >
                              <span className="t-label">{link.label}</span>
                            </Link>
                          ))}
                        </div>
                      </div>

                      <p className="t-ui max-w-[24rem] text-[color:var(--text-muted)]">
                        Minimal essentials from India. Heavyweight fits, reduced graphics, slower drops.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </nav>
    </LazyMotion>
  );
}
