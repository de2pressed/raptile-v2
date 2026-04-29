"use client";

import { AnimatePresence, LazyMotion, domAnimation, useReducedMotion } from "framer-motion";
import * as motion from "framer-motion/client";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { NotifyMeForm } from "@/components/shop/NotifyMeForm";
import { SizeChartTable } from "@/components/shop/SizeChartTable";
import { SpecDrawer } from "@/components/shop/SpecDrawer";
import { ChevronDownIcon, ChevronUpIcon } from "@/components/ui/icons";
import type { ProductVariant, ShopifyProduct } from "@/lib/commerce";
import { formatPrice } from "@/lib/commerce";
import { getColorHex } from "@/lib/colorMap";
import { getFirstAvailableColor, getOptionValue, getProductColors, getProductSizes } from "@/lib/product-options";
import { useRaptileStore } from "@/lib/store";
import { filterImagesByColor, normalizeColorName } from "@/lib/utils/imageFilter";
import { cn } from "@/lib/utils";
import { shopifyImageUrl } from "@/lib/utils/shopifyImage";

const BLUR_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWPQy7P9HwAFnwJ+m8dK8QAAAABJRU5ErkJggg==";
const SIZE_PRIORITY = ["M", "S", "L", "XL", "XXL"];

interface ProductDetailClientProps {
  product: ShopifyProduct;
}

function getAvailableSizesForSelection(
  sizes: string[],
  variants: ProductVariant[],
  selectedColor: string | null,
  hasColorOptions: boolean,
) {
  return sizes.filter((size) =>
    variants.some((variant) => {
      const color = getOptionValue(variant, "Color");
      const variantSize = getOptionValue(variant, "Size");
      const colorMatch = !hasColorOptions || !selectedColor || normalizeColorName(color) === normalizeColorName(selectedColor);
      return colorMatch && variant.availableForSale && variantSize === size;
    }),
  );
}

function pickDefaultSize(availableSizes: string[]) {
  for (const preferred of SIZE_PRIORITY) {
    if (availableSizes.includes(preferred)) {
      return preferred;
    }
  }

  return availableSizes[0] ?? null;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const reducedMotion = useReducedMotion();
  const variants = useMemo(
    () =>
      product.variants.length
        ? product.variants
        : [
            {
              id: "",
              availableForSale: product.availableForSale,
              selectedOptions: [{ name: "Edition", value: "Default" }],
              price: product.priceRange.minVariantPrice,
            } satisfies ProductVariant,
          ],
    [product.availableForSale, product.priceRange.minVariantPrice, product.variants],
  );
  const defaultVariant = useMemo(
    () => variants.find((variant) => variant.availableForSale) ?? variants[0],
    [variants],
  );
  const colors = useMemo(() => getProductColors(product), [product]);
  const sizes = useMemo(() => getProductSizes(product), [product]);
  const initialSelectedColor = getFirstAvailableColor(product) ?? colors[0] ?? null;
  const hasColorOptions = colors.length > 0;
  const hasSizeOptions = sizes.length > 0;
  const [selectedColor, setSelectedColor] = useState<string | null>(initialSelectedColor);
  const initialAvailableSizes = useMemo(
    () => getAvailableSizesForSelection(sizes, variants, initialSelectedColor, hasColorOptions),
    [hasColorOptions, initialSelectedColor, sizes, variants],
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(() => pickDefaultSize(initialAvailableSizes));
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [pointerStartX, setPointerStartX] = useState<number | null>(null);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const setSelectedVariantId = useRaptileStore((state) => state.setSelectedVariant);
  const setSpecDrawerOpen = useRaptileStore((state) => state.setSpecDrawerOpen);

  useEffect(() => {
    if (!hasColorOptions || selectedColor) {
      return;
    }

    setSelectedColor(initialSelectedColor);
  }, [hasColorOptions, initialSelectedColor, selectedColor]);

  const displayImages = useMemo(() => {
    if (!product.images.length) {
      return [];
    }

    if (!selectedColor) {
      return product.images;
    }

    return filterImagesByColor(product.images, selectedColor);
  }, [product.images, selectedColor]);

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [selectedColor]);

  useEffect(() => {
    setSelectedImageIndex((current) => Math.min(current, Math.max(displayImages.length - 1, 0)));
  }, [displayImages.length]);

  const normalizedSelectedColor = selectedColor ? normalizeColorName(selectedColor) : "";

  const availableSizesForColor = useMemo(
    () => getAvailableSizesForSelection(sizes, variants, selectedColor, hasColorOptions),
    [hasColorOptions, selectedColor, sizes, variants],
  );

  useEffect(() => {
    if (!hasSizeOptions) {
      setSelectedSize(null);
      return;
    }

    setSelectedSize((current) => {
      if (current && availableSizesForColor.includes(current)) {
        return current;
      }

      return pickDefaultSize(availableSizesForColor);
    });
  }, [availableSizesForColor, hasSizeOptions]);

  const selectedVariant = useMemo(() => {
    if (hasSizeOptions && !selectedSize) {
      return null;
    }

    const variant =
      variants.find((candidate) => {
        const color = getOptionValue(candidate, "Color");
        const size = getOptionValue(candidate, "Size");
        const colorMatch = !hasColorOptions || !normalizedSelectedColor || normalizeColorName(color) === normalizedSelectedColor;
        const sizeMatch = !hasSizeOptions || size === selectedSize;
        return colorMatch && sizeMatch;
      }) ?? null;

    if (variant) {
      return variant;
    }

    return !hasColorOptions && !hasSizeOptions ? defaultVariant : null;
  }, [defaultVariant, hasColorOptions, hasSizeOptions, normalizedSelectedColor, selectedSize, variants]);

  const selectedImage = displayImages[selectedImageIndex] ?? displayImages[0] ?? null;
  const selectedImageWidth = selectedImage?.width ?? 1400;
  const selectedImageHeight = selectedImage?.height ?? 1600;
  const soldOut = !product.availableForSale || (selectedVariant ? !selectedVariant.availableForSale : false);
  const emptySelectionLabel = hasSizeOptions ? "Select a size" : "Add to Cart";

  useEffect(() => {
    setSelectedVariantId(selectedVariant?.id ?? null);
    setSpecDrawerOpen(false);

    return () => {
      setSelectedVariantId(null);
      setSpecDrawerOpen(false);
    };
  }, [selectedVariant?.id, setSelectedVariantId, setSpecDrawerOpen]);

  const changeImage = (direction: 1 | -1) => {
    if (displayImages.length < 2) return;

    setSelectedImageIndex((current) => {
      const next = current + direction;
      if (next < 0) return displayImages.length - 1;
      if (next >= displayImages.length) return 0;
      return next;
    });
  };

  const description = product.description.trim();

  return (
    <LazyMotion features={domAnimation}>
      <section className="py-6 md:py-8 lg:py-10">
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_380px] lg:min-h-[calc(100vh-120px)] lg:grid-cols-[88px_minmax(0,1fr)_400px] lg:items-start xl:grid-cols-[88px_minmax(0,1fr)_440px]">
          <div
            className={cn(
              "hide-scrollbar hidden lg:sticky lg:top-[82px] lg:flex lg:max-h-[calc(100vh-6rem)] lg:flex-col lg:gap-2 lg:overflow-y-auto",
              displayImages.length <= 1 && "lg:hidden",
            )}
          >
            {displayImages.map((image, index) => {
              const active = index === selectedImageIndex;

              return (
                <button
                  key={`${image.url}-${index}`}
                  className={cn(
                    "relative h-[68px] w-[68px] overflow-hidden rounded-[18px] border bg-[color:var(--bg)] transition duration-200",
                    active
                      ? "border-[color:var(--accent)] bg-[color:var(--glass-fill)]"
                      : "border-[color:var(--glass-border)] hover:border-[color:var(--accent)]",
                  )}
                  onClick={() => setSelectedImageIndex(index)}
                  type="button"
                >
                  <Image
                    alt={image.altText ?? product.title}
                    className="h-full w-full object-cover"
                    fill
                    sizes="68px"
                    src={shopifyImageUrl(image.url, { width: 136 })}
                  />
                </button>
              );
            })}
          </div>

          <div className="min-w-0">
            <div
              className="relative grid min-h-[min(74svh,42rem)] place-items-center overflow-hidden rounded-[28px] md:min-h-[34rem] md:rounded-[34px] md:border md:border-[color:var(--glass-border)] md:bg-[color:var(--bg-elevated)] md:p-6 lg:min-h-[calc(100vh-7rem)] lg:p-8"
              onPointerDown={(event) => {
                if (displayImages.length < 2) return;
                setPointerStartX(event.clientX);
              }}
              onPointerUp={(event) => {
                if (pointerStartX === null || displayImages.length < 2) {
                  setPointerStartX(null);
                  return;
                }

                const delta = event.clientX - pointerStartX;
                setPointerStartX(null);

                if (Math.abs(delta) < 40) return;
                changeImage(delta < 0 ? 1 : -1);
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage?.url ?? "fallback"}
                  className="flex h-full w-full items-center justify-center"
                  initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.98 }}
                  transition={{ duration: reducedMotion ? 0.01 : 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  {selectedImage ? (
                    <Image
                      alt={selectedImage.altText ?? product.title}
                      blurDataURL={BLUR_DATA_URL}
                      className="h-full w-full object-cover md:object-contain"
                      fetchPriority="high"
                      height={selectedImageHeight}
                      placeholder="blur"
                      priority
                      quality={84}
                      sizes="(min-width: 1536px) 56vw, (min-width: 1280px) 58vw, (min-width: 1024px) calc(100vw - 560px), 100vw"
                      src={shopifyImageUrl(selectedImage.url, { width: 1200 })}
                      width={selectedImageWidth}
                    />
                  ) : (
                    <div className="h-full w-full image-skeleton" />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {displayImages.length > 1 ? (
              <div className="mt-4 flex items-center justify-center gap-2 lg:hidden">
                {displayImages.map((image, index) => (
                  <button
                    key={`dot-${image.url}-${index}`}
                    aria-label={`View image ${index + 1}`}
                    className={cn(
                      "h-2.5 rounded-full transition-all duration-200",
                      index === selectedImageIndex ? "w-6 bg-[color:var(--accent)]" : "w-2.5 bg-[color:var(--glass-border)]",
                    )}
                    onClick={() => setSelectedImageIndex(index)}
                    type="button"
                  />
                ))}
              </div>
            ) : null}
          </div>

          <div className="glass-panel sticky-glass hide-scrollbar rounded-[28px] p-6 md:p-8 lg:top-[82px]">
            <div className="relative z-[1] grid gap-6">
              <div className="grid gap-3">
                <div className="t-label text-[color:var(--text-muted)]">{`Collection / ${product.title}`}</div>
                <div className="t-display text-[color:var(--text)]">{product.title}</div>
                <div className="flex items-center gap-3">
                  <div className="t-price text-[color:var(--text)]">
                    {formatPrice(selectedVariant?.price.amount ?? product.priceRange.minVariantPrice.amount)}
                  </div>
                  {soldOut ? <div className="t-label text-[color:var(--sold-out)]">Sold Out</div> : null}
                </div>
              </div>

              <div className="h-px w-full bg-[color:var(--glass-border)]" />

              {hasColorOptions ? (
                <div className="grid gap-3">
                  <div className="t-label text-[color:var(--text-muted)]">Color</div>
                  <div className="flex flex-wrap gap-3">
                    {colors.map((color) => {
                      const active = normalizeColorName(color) === normalizedSelectedColor;

                      return (
                        <button
                          key={color}
                          aria-label={color}
                          className={cn(
                            "relative h-7 w-7 rounded-full border transition duration-200",
                            active
                              ? "border-[color:var(--accent)] shadow-[0_0_0_3px_var(--accent-subtle)]"
                              : "border-[color:var(--glass-border)] hover:border-[color:var(--accent)]",
                          )}
                          onClick={() => setSelectedColor(color)}
                          style={{ backgroundColor: getColorHex(color) }}
                          type="button"
                        />
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {hasSizeOptions ? (
                <div className="grid gap-3">
                  <div className="t-label text-[color:var(--text-muted)]">Size</div>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => {
                      const active = size === selectedSize;
                      const available = availableSizesForColor.includes(size);

                      return (
                        <button
                          key={size}
                          className={cn(
                            "rounded-full border px-4 py-2 transition duration-200",
                            active
                              ? "border-[color:var(--accent)] text-[color:var(--text)]"
                              : "border-[color:var(--glass-border)] text-[color:var(--text-muted)] hover:border-[color:var(--accent)] hover:text-[color:var(--text)]",
                            !available && "cursor-not-allowed border-[color:var(--glass-border)] opacity-35 line-through",
                          )}
                          disabled={!available}
                          onClick={() => setSelectedSize(size)}
                          type="button"
                        >
                          <span className="t-label">{size}</span>
                        </button>
                      );
                    })}
                  </div>
                  {!selectedSize ? <div className="t-label italic text-[color:var(--text-muted)]">Select a size</div> : null}
                </div>
              ) : null}

              <div className="grid gap-3">
                <button
                  className="ghost-button rounded-full px-5 py-3 text-left"
                  onClick={() => setIsSizeChartOpen((current) => !current)}
                  type="button"
                >
                  <span className="t-label flex items-center justify-between">
                    <span>Size Chart</span>
                    {isSizeChartOpen ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isSizeChartOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: reducedMotion ? 0.01 : 0.24, ease: [0.16, 1, 0.3, 1] }}
                      style={{ overflow: "hidden" }}
                    >
                      <SizeChartTable />
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>

              <div className="h-px w-full bg-[color:var(--glass-border)]" />

              {soldOut ? (
                <NotifyMeForm productHandle={product.handle} variantId={selectedVariant?.id ?? null} />
              ) : (
                <AddToCartButton
                  emptySelectionLabel={emptySelectionLabel}
                  soldOut={soldOut}
                  variantId={selectedVariant?.id ?? null}
                />
              )}

              <button
                className="ghost-button rounded-full px-5 py-3 text-left"
                onClick={() => setSpecDrawerOpen(true)}
                type="button"
              >
                <span className="t-label flex items-center justify-between">
                  <span>Open details</span>
                  <span aria-hidden>Info</span>
                </span>
              </button>

              <div className="h-px w-full bg-[color:var(--glass-border)]" />

              {description ? <div className="max-w-[58ch] text-sm leading-8 text-[color:var(--text-muted)] md:text-base">{description}</div> : null}
            </div>
          </div>
        </div>
        <SpecDrawer product={product} />
      </section>
    </LazyMotion>
  );
}
