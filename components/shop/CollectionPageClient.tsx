"use client";

import { AnimatePresence, LazyMotion, domAnimation } from "framer-motion";
import * as motion from "framer-motion/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { ProductGrid } from "@/components/shop/ProductGrid";
import { ChevronDownIcon, CloseIcon, FilterIcon, SearchIcon } from "@/components/ui/icons";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { createCatalogFilterState, filterCatalogProducts, sortCatalogProducts, type CollectionSort } from "@/lib/catalog";
import type { ShopifyProduct } from "@/lib/commerce";
import { useRaptileStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const SIZE_OPTIONS = ["S", "M", "L", "XL", "XXL"] as const;

interface CollectionPageClientProps {
  collectionTitle: string;
  collectionDescription: string;
  products: ShopifyProduct[];
}

function createQueryString(base: string, next: { query?: string; sort?: CollectionSort; size?: string | null }) {
  const params = new URLSearchParams(base);

  if (next.query !== undefined) {
    const trimmed = next.query.trim();
    if (trimmed) {
      params.set("q", trimmed);
    } else {
      params.delete("q");
    }
  }

  if (next.sort !== undefined) {
    if (next.sort === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", next.sort);
    }
  }

  if (next.size !== undefined) {
    const normalized = next.size?.trim().toUpperCase() ?? "";
    if (normalized) {
      params.set("size", normalized);
    } else {
      params.delete("size");
    }
  }

  const output = params.toString();
  return output ? `?${output}` : "";
}

export function CollectionPageClient({ collectionTitle, collectionDescription, products }: CollectionPageClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const searchBarRef = useRef<HTMLDivElement | null>(null);
  const setCollectionSearchVisible = useRaptileStore((state) => state.setCollectionSearchVisible);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<CollectionSort>("newest");
  const [size, setSize] = useState<string | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const initial = createCatalogFilterState(new URLSearchParams(searchParamsString));
    setQuery(initial.query);
    setSort(initial.sort);
    setSize(initial.size);
  }, [searchParamsString]);

  useEffect(() => {
    const node = searchBarRef.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setCollectionSearchVisible(Boolean(entry?.isIntersecting));
      },
      {
        threshold: [0.2, 0.5, 0.8],
        rootMargin: "0px 0px -35% 0px",
      },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      setCollectionSearchVisible(false);
    };
  }, [setCollectionSearchVisible]);

  useEffect(() => {
    setMobileFilterOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileFilterOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileFilterOpen]);

  const filteredProducts = useMemo(() => {
    return filterCatalogProducts(products, { query, sort, size });
  }, [products, query, sort, size]);

  const activeChips = useMemo(() => {
    const chips: Array<{ label: string; key: string; onRemove: () => void }> = [];

    if (query.trim()) {
      chips.push({
        key: "query",
        label: `Search: ${query.trim()}`,
        onRemove: () => {
          setQuery("");
          router.replace(`${pathname}${createQueryString(searchParamsString, { query: "" })}`, { scroll: false });
        },
      });
    }

    if (size) {
      chips.push({
        key: "size",
        label: `Size: ${size}`,
        onRemove: () => {
          setSize(null);
          router.replace(`${pathname}${createQueryString(searchParamsString, { size: null })}`, { scroll: false });
        },
      });
    }

    return chips;
  }, [pathname, query, router, searchParamsString, size]);

  const updateQueryParams = (next: { query?: string; sort?: CollectionSort; size?: string | null }) => {
    const search = createQueryString(searchParamsString, next);
    router.replace(`${pathname}${search}`, { scroll: false });
  };

  const hasFilters = Boolean(query.trim() || size);
  const resultSummary = hasFilters ? `${filteredProducts.length} of ${products.length} pieces` : `${products.length} pieces`;

  return (
    <LazyMotion features={domAnimation}>
      <div className="mx-auto w-full max-w-[1440px] py-6 md:py-10">
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.72fr)] lg:items-end">
          <div className="min-w-0 space-y-4">
            <div className="flex flex-wrap items-center gap-3 t-label text-[color:var(--text-muted)]">
              <span>{collectionTitle}</span>
              <span aria-hidden>/</span>
              <span>{products.length} pieces</span>
              <span aria-hidden>/</span>
              <span>Built in India</span>
            </div>
            <div
              className="max-w-full whitespace-normal break-words font-display font-extrabold uppercase tracking-[-0.06em] text-[color:var(--text)]"
              style={{ fontSize: "clamp(2.25rem, 11vw, 6rem)", lineHeight: 0.92 }}
            >
              {collectionTitle}
            </div>
            <p className="editorial-copy hidden max-w-[34ch] md:block">{collectionDescription}</p>
            <div className="t-ui hidden max-w-[34ch] leading-6 text-[color:var(--text-muted)] md:block">
              Weight, wash, and silhouette stay close to the garment. The interface stays exact and quiet.
            </div>
          </div>

          <GlassPanel className="rounded-[34px] px-5 py-5 md:px-6 md:py-6">
            <div ref={searchBarRef} className="grid gap-5">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="t-label text-[color:var(--text-muted)]">Search and sort</div>
                  <div className="t-ui hidden text-[color:var(--text-subtle)] md:block">
                    Narrow the release without losing the point of view.
                  </div>
                </div>
                <div className="t-ui text-[color:var(--text-subtle)]">{resultSummary}</div>
              </div>

              <label className="grid gap-2">
                <span className="t-label text-[color:var(--text-muted)]">Search collection</span>
                <div className="relative">
                  <input
                    className="contact-input h-12 rounded-full pl-11 pr-4"
                    onChange={(event) => {
                      const nextQuery = event.target.value;
                      setQuery(nextQuery);
                      updateQueryParams({ query: nextQuery });
                    }}
                    placeholder="Search products"
                    value={query}
                  />
                  <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--text-subtle)]">
                    <SearchIcon className="h-4 w-4" />
                  </div>
                </div>
              </label>

              <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
                <div className="relative">
                  <select
                    className="contact-input h-12 appearance-none rounded-full pr-10 text-[color:var(--text)]"
                    onChange={(event) => {
                      const nextSort = event.target.value as CollectionSort;
                      setSort(nextSort);
                      updateQueryParams({ sort: nextSort });
                    }}
                    value={sort}
                  >
                    <option value="newest">Newest</option>
                    <option value="price-asc">Price: Low - High</option>
                    <option value="price-desc">Price: High - Low</option>
                    <option value="bestselling">Bestselling</option>
                  </select>
                  <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--text-subtle)]" />
                </div>

                <button
                  className="ghost-button inline-flex h-12 items-center justify-center gap-2 rounded-full px-4 md:hidden"
                  onClick={() => setMobileFilterOpen(true)}
                  type="button"
                >
                  <FilterIcon className="h-4 w-4" />
                  <span className="t-label">Filter</span>
                </button>
              </div>

              <div className="hidden flex-wrap items-center gap-2 md:flex">
                {SIZE_OPTIONS.map((option) => {
                  const active = size === option;

                  return (
                    <button
                      key={option}
                      className={cn(
                        "rounded-full border px-4 py-2 transition duration-200",
                        active
                          ? "border-[color:var(--accent)] bg-[color:var(--accent-subtle)] text-[color:var(--text)]"
                          : "border-[color:var(--glass-border)] text-[color:var(--text-muted)] hover:border-[color:var(--accent)] hover:text-[color:var(--text)]",
                      )}
                      onClick={() => {
                        const nextSize = active ? null : option;
                        setSize(nextSize);
                        updateQueryParams({ size: nextSize });
                      }}
                      type="button"
                    >
                      <span className="t-label">{option}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </GlassPanel>
        </section>

        {activeChips.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {activeChips.map((chip) => (
              <button
                key={chip.key}
                className="inline-flex items-center gap-2 rounded-full border border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.03)] px-4 py-2 text-[color:var(--text-muted)] transition duration-200 hover:border-[color:var(--accent)] hover:text-[color:var(--text)]"
                onClick={chip.onRemove}
                type="button"
              >
                <span className="t-ui">{chip.label}</span>
                <CloseIcon className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
        ) : null}

        <div className="mt-8">
          {filteredProducts.length > 0 ? (
            <ProductGrid products={sortCatalogProducts(filteredProducts, sort, products)} />
          ) : (
            <div className="glass-panel rounded-[30px] px-6 py-8 md:px-8 md:py-10">
              <div className="t-label text-[color:var(--text-muted)]">No matches</div>
              <div className="mt-4 max-w-[34rem] font-display text-3xl font-bold tracking-[-0.04em] text-[color:var(--text)] md:text-4xl">
                No pieces match the current search or size filter.
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  className="btn-primary rounded-full px-5 py-3"
                  onClick={() => {
                    setQuery("");
                    setSize(null);
                    setSort("newest");
                    router.replace(pathname, { scroll: false });
                  }}
                  type="button"
                >
                  <span className="t-label text-[color:var(--bg)]">Reset Filters</span>
                </button>
                <button
                  className="ghost-button rounded-full px-5 py-3"
                  onClick={() => router.push("/collection", { scroll: false })}
                  type="button"
                >
                  <span className="t-label">View All</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <AnimatePresence>
          {mobileFilterOpen ? (
            <motion.div
              className="fixed inset-0 z-[145] flex items-center justify-center p-4 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <button
                aria-label="Close filters"
                className="absolute inset-0 bg-[color:rgba(5,8,18,0.78)]"
                onClick={() => setMobileFilterOpen(false)}
                type="button"
              />
              <motion.div
                className="noise-surface relative w-full max-w-[28rem] max-h-[calc(100svh-2rem)] overflow-y-auto rounded-[30px] border border-[color:var(--glass-border)] bg-[color:rgba(8,12,24,0.92)] px-5 py-5 shadow-[0_24px_70px_rgba(0,0,0,0.32)]"
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 24, scale: 0.98 }}
                transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="t-label text-[color:var(--text-muted)]">Filter collection</div>
                    <div className="mt-2 font-display text-2xl font-bold tracking-[-0.04em] text-[color:var(--text)]">
                      Refine the edit
                    </div>
                  </div>
                  <button
                    className="ghost-button inline-flex h-11 w-11 items-center justify-center rounded-full"
                    onClick={() => setMobileFilterOpen(false)}
                    type="button"
                  >
                    <CloseIcon className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-5 grid gap-4">
                  <div className="grid gap-2">
                    <div className="t-label text-[color:var(--text-muted)]">Sort</div>
                    <select
                      className="contact-input h-12 rounded-full"
                      onChange={(event) => {
                        const nextSort = event.target.value as CollectionSort;
                        setSort(nextSort);
                        updateQueryParams({ sort: nextSort });
                      }}
                      value={sort}
                    >
                      <option value="newest">Newest</option>
                      <option value="price-asc">Price: Low - High</option>
                      <option value="price-desc">Price: High - Low</option>
                      <option value="bestselling">Bestselling</option>
                    </select>
                  </div>

                  <div className="grid gap-2">
                    <div className="t-label text-[color:var(--text-muted)]">Size</div>
                    <div className="grid grid-cols-3 gap-2">
                      {SIZE_OPTIONS.map((option) => {
                        const active = size === option;

                        return (
                          <button
                            key={option}
                            className={cn(
                              "rounded-full border px-4 py-3 transition duration-200",
                              active
                                ? "border-[color:var(--accent)] bg-[color:var(--accent-subtle)] text-[color:var(--text)]"
                                : "border-[color:var(--glass-border)] text-[color:var(--text-muted)]",
                            )}
                            onClick={() => {
                              const nextSize = active ? null : option;
                              setSize(nextSize);
                              updateQueryParams({ size: nextSize });
                            }}
                            type="button"
                          >
                            <span className="t-label">{option}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </LazyMotion>
  );
}
