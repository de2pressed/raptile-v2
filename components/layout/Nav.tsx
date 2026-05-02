"use client";

import { AnimatePresence, LazyMotion, domAnimation } from "framer-motion";
import * as motion from "framer-motion/client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createPortal } from "react-dom";
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

const secondaryLinks = [
  { href: "/shipping", label: "Shipping" },
  { href: "/returns", label: "Returns" },
  { href: "/size-guide", label: "Size Guide" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

const mobileMenuSections = [
  {
    label: "Browse",
    links: desktopLinks,
  },
  {
    label: "Support",
    links: secondaryLinks,
  },
] as const;

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
        results.map((result) => {
          const isProduct = result.kind === "product" || result.kind === "collection";

          return (
            <Link
              key={`${result.kind}-${result.handle}`}
              className="group grid grid-cols-[56px_minmax(0,1fr)] gap-3 rounded-[20px] border border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.025)] p-3 transition duration-200 hover:-translate-y-0.5 hover:border-[color:var(--accent)] hover:bg-[color:rgba(255,255,255,0.045)]"
              href={result.href}
              onClick={onNavigate}
            >
              <div className="relative aspect-square overflow-hidden rounded-[16px] bg-[color:var(--bg-elevated)]">
                {isProduct && result.imageUrl ? (
                  <Image
                    alt={result.imageAlt ?? result.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    fill
                    sizes="56px"
                    src={shopifyImageUrl(result.imageUrl, { width: 120 })}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(180deg,color-mix(in_oklch,var(--glass-tint-a)_60%,transparent),transparent)]">
                    <div className="t-label text-[color:var(--text-subtle)]">{result.kind}</div>
                  </div>
                )}
              </div>

              <div className="min-w-0 space-y-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-display text-[1rem] font-semibold tracking-[-0.03em] text-[color:var(--text)]">
                      {result.title}
                    </div>
                    <div className="t-ui mt-1 text-[color:var(--text-subtle)]">{result.matchLabel}</div>
                  </div>
                  {result.price ? <div className="t-price shrink-0 text-[color:var(--text-muted)]">{result.price}</div> : null}
                </div>
                <div className="t-ui max-w-[30ch] text-[color:var(--text-muted)]">{result.description}</div>
              </div>
            </Link>
          );
        })
      ) : loading ? (
        Array.from({ length: 4 }).map((_, index) => (
          <div
            key={`search-skel-${index}`}
            className="grid grid-cols-[56px_minmax(0,1fr)] gap-3 rounded-[20px] border border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.02)] p-3"
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
          No predicted results for &quot;{query || "all products"}&quot;.
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
  const [mobileMode, setMobileMode] = useState<"idle" | "search" | "menu">("idle");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CatalogSearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const desktopInputRef = useRef<HTMLInputElement | null>(null);
  const mobileInputRef = useRef<HTMLInputElement | null>(null);

  const hideSearchTrigger = isCollectionSearchVisible && !desktopSearchOpen && mobileMode !== "search";

  useEffect(() => {
    setDesktopSearchOpen(false);
    setMobileMode("idle");
    setSearchQuery("");
    setSearchResults([]);
  }, [pathname]);

  useEffect(() => {
    const active = desktopSearchOpen || mobileMode === "search";
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
    }, 200);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [desktopSearchOpen, mobileMode, searchQuery]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      setDesktopSearchOpen(false);
      setMobileMode("idle");
      setSearchQuery("");
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (desktopSearchOpen) {
      desktopInputRef.current?.focus();
    }
  }, [desktopSearchOpen]);

  useEffect(() => {
    if (mobileMode === "search") {
      mobileInputRef.current?.focus();
    }
  }, [mobileMode]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (mobileMode !== "menu") {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [mobileMode]);

  const openDesktopSearch = () => {
    setMobileMode("idle");
    setDesktopSearchOpen(true);
  };

  const openMobileSearch = () => {
    setDesktopSearchOpen(false);
    setMobileMode("search");
  };

  const openMobileMenu = () => {
    setDesktopSearchOpen(false);
    setMobileMode((current) => (current === "menu" ? "idle" : "menu"));
  };

  const submitSearch = () => {
    const trimmed = searchQuery.trim();
    setDesktopSearchOpen(false);
    setMobileMode("idle");
    router.push(trimmed ? `/collection?q=${encodeURIComponent(trimmed)}` : "/collection");
  };

  const desktopSearch = (
    <form
      className="hidden items-center overflow-hidden rounded-full border border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.03)] md:flex"
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
        className="h-10 border-0 bg-transparent px-0 text-[0.92rem] text-[color:var(--text)] outline-none placeholder:text-[color:var(--text-subtle)]"
        onChange={(event) => setSearchQuery(event.target.value)}
        placeholder="Search products"
        value={searchQuery}
        initial={false}
        animate={{ width: desktopSearchOpen ? 260 : 0, opacity: desktopSearchOpen ? 1 : 0 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      />
    </form>
  );

  const mobileMenuPortal =
    isMounted && mobileMode === "menu"
      ? createPortal(
          <motion.div
            key="mobile-menu"
            className="fixed inset-0 z-[220] md:hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              aria-label="Close navigation menu"
              className="absolute inset-0 z-0 bg-[color:rgba(0,0,0,0.6)]"
              onClick={() => setMobileMode("idle")}
              type="button"
            />

            <div className="absolute inset-x-0 top-[var(--header-height)] bottom-0 z-[1] border-t border-[color:var(--glass-border)] bg-[color:color-mix(in_oklch,var(--bg-elevated)_94%,var(--bg))] shadow-[0_24px_70px_rgba(0,0,0,0.34)]">
              <div className="h-full overflow-y-auto px-4 py-4">
                <div className="grid gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="t-label text-[color:var(--text-muted)]">Menu</div>
                      <div className="font-display text-[1.6rem] font-bold tracking-[-0.04em] text-[color:var(--text)]">
                        Navigate the store
                      </div>
                    </div>
                    <button
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.03)] text-[color:var(--text-muted)] transition duration-200 hover:border-[color:var(--accent)] hover:text-[color:var(--text)]"
                      onClick={() => setMobileMode("idle")}
                      type="button"
                    >
                      <CloseIcon className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid gap-4">
                    {mobileMenuSections.map((section) => (
                      <div key={section.label} className="grid gap-3">
                        <div className="t-label text-[color:var(--text-muted)]">{section.label}</div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {section.links.map((link) => {
                            const active = isActiveLink(pathname, link.href);

                            return (
                              <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                  "flex items-center justify-between rounded-[22px] border px-4 py-4 transition duration-200",
                                  active
                                    ? "border-[color:var(--accent)] bg-[color:var(--accent-subtle)] text-[color:var(--text)]"
                                    : "border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.02)] text-[color:var(--text-muted)] hover:border-[color:var(--accent)] hover:text-[color:var(--text)]",
                                )}
                                onClick={() => setMobileMode("idle")}
                              >
                                <span className="font-display text-[1.05rem] font-semibold tracking-[-0.03em]">
                                  {link.label}
                                </span>
                                <ArrowRightIcon className="h-4 w-4 shrink-0" />
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-3 border-t border-[color:var(--glass-border)] pt-4">
                    <p className="t-ui max-w-[26rem] text-[color:var(--text-muted)]">
                      Heavyweight fits, precise cuts, and direct support routes. No extra page wandering.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        className="ghost-button rounded-full px-4 py-2"
                        href="/collection"
                        onClick={() => setMobileMode("idle")}
                      >
                        <span className="t-label">Shop now</span>
                      </Link>
                      <Link
                        className="ghost-button rounded-full px-4 py-2"
                        href="/size-guide"
                        onClick={() => setMobileMode("idle")}
                      >
                        <span className="t-label">Size guide</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>,
          document.body,
        )
      : null;

  const searchOverlay = (
    <motion.div
      className="pointer-events-none absolute left-0 right-0 top-full hidden px-4 md:block md:px-6"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="mx-auto mt-3 max-w-[1440px]">
        <div className="pointer-events-auto noise-surface rounded-[28px] border border-[color:var(--glass-border)] bg-[color:rgba(8,12,24,0.92)] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.3)]">
          <div className="mt-4 grid gap-3">
            <div className="flex items-center justify-between gap-3">
              <div className="t-label text-[color:var(--text-muted)]">Predicted results</div>
              <div className="t-ui text-[color:var(--text-subtle)]">{searchLoading ? "Updating" : `${searchResults.length} matches`}</div>
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
  );

  return (
    <LazyMotion features={domAnimation}>
      <nav className="site-header noise-surface sticky top-0 z-[100] relative border-b border-[color:var(--glass-border)]">
        <div className="site-header-inner relative z-[1] mx-auto max-w-[1440px] px-4 py-2.5 md:px-6 md:py-3">
          <div className="hidden md:grid grid-cols-[auto_1fr_auto] items-center gap-5">
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

          <div className="md:hidden">
            <AnimatePresence mode="wait" initial={false}>
              {mobileMode === "search" ? (
                <motion.div
                  key="mobile-search"
                  className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 overflow-hidden"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                >
                  <button
                    aria-label="Close search"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.03)] text-[color:var(--text-muted)] transition duration-200 hover:border-[color:var(--accent)] hover:text-[color:var(--text)]"
                    onClick={() => {
                      setMobileMode("idle");
                      setSearchQuery("");
                    }}
                    type="button"
                  >
                    <CloseIcon className="h-4 w-4" />
                  </button>

                  <form
                    className="flex items-center overflow-hidden rounded-full border border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.03)] px-4"
                    onSubmit={(event) => {
                      event.preventDefault();
                      submitSearch();
                    }}
                  >
                    <input
                      aria-label="Search products"
                      className="h-10 w-full border-0 bg-transparent text-[0.95rem] text-[color:var(--text)] outline-none placeholder:text-[color:var(--text-subtle)]"
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Search products"
                      ref={mobileInputRef}
                      value={searchQuery}
                    />
                  </form>

                  <button
                    aria-label="Search"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.03)] text-[color:var(--text-muted)] transition duration-200 hover:border-[color:var(--accent)] hover:text-[color:var(--text)]"
                    type="button"
                    onClick={submitSearch}
                  >
                    <ArrowRightIcon className="h-4 w-4" />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="mobile-default"
                  className="grid grid-cols-[1fr_auto_1fr] items-center gap-3"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                >
                  <div aria-hidden className="h-10 w-10" />

                  <BrandLogo size="sm" className="site-header-logo justify-self-center" />

                  <div className="flex items-center gap-2 justify-self-end">
                    <button
                      aria-label="Open search"
                      aria-hidden={hideSearchTrigger}
                      className={cn(
                        "inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.03)] text-[color:var(--text-muted)] transition duration-200 hover:border-[color:var(--accent)] hover:text-[color:var(--text)]",
                        hideSearchTrigger && "pointer-events-none opacity-0",
                      )}
                      onClick={openMobileSearch}
                      tabIndex={hideSearchTrigger ? -1 : 0}
                      type="button"
                    >
                      <SearchIcon className="h-4 w-4" />
                    </button>

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
                      aria-expanded={mobileMode === "menu"}
                      aria-label={mobileMode === "menu" ? "Close navigation menu" : "Open navigation menu"}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.03)] text-[color:var(--text-muted)] transition duration-200 hover:border-[color:var(--accent)] hover:text-[color:var(--text)]"
                      onClick={openMobileMenu}
                      type="button"
                    >
                      {mobileMode === "menu" ? <CloseIcon className="h-4 w-4" /> : <MenuIcon className="h-4 w-4" />}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence initial={false}>
              {mobileMode === "search" ? (
                <motion.div
                  key="mobile-search-results"
                  className="mt-4 grid gap-3 border-t border-[color:var(--glass-border)] pt-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="t-label text-[color:var(--text-muted)]">Predicted results</div>
                    <div className="t-ui text-[color:var(--text-subtle)]">{searchLoading ? "Updating" : `${searchResults.length} matches`}</div>
                  </div>

                  <SearchResultsPanel
                    loading={searchLoading}
                    onNavigate={() => {
                      setMobileMode("idle");
                      setSearchQuery("");
                    }}
                    query={searchQuery.trim()}
                    results={searchResults}
                  />

                  <Link
                    className="group flex items-center justify-between rounded-[20px] border border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.025)] px-4 py-3 transition duration-200 hover:border-[color:var(--accent)] hover:bg-[color:rgba(255,255,255,0.045)]"
                    href={`/collection${searchQuery.trim() ? `?q=${encodeURIComponent(searchQuery.trim())}` : ""}`}
                    onClick={() => {
                      setMobileMode("idle");
                      setSearchQuery("");
                    }}
                  >
                    <span className="t-label text-[color:var(--text-muted)]">
                      Search all results for &quot;{searchQuery.trim() || "all products"}&quot;
                    </span>
                    <ArrowRightIcon className="h-4 w-4 text-[color:var(--text-subtle)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[color:var(--text)]" />
                  </Link>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <AnimatePresence initial={false}>
            {mobileMenuPortal}
          </AnimatePresence>

          <AnimatePresence>{desktopSearchOpen ? searchOverlay : null}</AnimatePresence>
        </div>
      </nav>
    </LazyMotion>
  );
}
