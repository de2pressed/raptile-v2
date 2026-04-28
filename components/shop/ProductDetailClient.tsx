"use client";

import { AnimatePresence, LazyMotion, domAnimation, useReducedMotion } from "framer-motion";
import * as motion from "framer-motion/client";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { SpecDrawer } from "@/components/shop/SpecDrawer";
import { StatusBar } from "@/components/shop/StatusBar";
import { GlassPanel } from "@/components/ui/GlassPanel";
import type { ProductImage, ProductVariant, ShopifyProduct } from "@/lib/commerce";
import { formatPrice } from "@/lib/commerce";
import { getColorHex } from "@/lib/colorMap";
import { getFirstAvailableColor, getOptionValue, getProductColors, getProductSizes, matchesColor } from "@/lib/product-options";
import { useRaptileStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const BLUR_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWPQy7P9HwAFnwJ+m8dK8QAAAABJRU5ErkJggg==";

const imageLayouts = [
  "aspect-[3/4] w-full",
  "aspect-[4/5] w-full md:ml-auto md:w-[70%]",
  "aspect-[4/5] w-full md:w-[70%]",
  "aspect-[3/4] w-full",
];

interface ProductDetailClientProps {
  product: ShopifyProduct;
}

function ImageFigure({
  image,
  title,
  index,
}: {
  image: ProductImage | null;
  title: string;
  index: number;
}) {
  const reducedMotion = useReducedMotion();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
  }, [image?.url]);

  return (
    <motion.div
      className={imageLayouts[index] ?? imageLayouts[imageLayouts.length - 1]}
      initial={{ opacity: 0, y: reducedMotion ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <div className={cn("relative h-full overflow-hidden rounded-[32px] bg-[color:var(--bg-soft)]", !loaded && "image-skeleton")}>
        {image ? (
          <Image
            alt={image.altText ?? title}
            blurDataURL={BLUR_DATA_URL}
            className={cn(
              "h-full w-full object-cover transition-opacity duration-300",
              loaded ? "opacity-100" : "opacity-0",
            )}
            fill
            loading={index === 0 ? undefined : "lazy"}
            onLoad={() => setLoaded(true)}
            placeholder="blur"
            priority={index === 0}
            sizes={index === 0 ? "100vw" : "(max-width: 767px) 100vw, 70vw"}
            src={image.url}
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,141,64,0.2),_transparent_46%),linear-gradient(180deg,_rgba(33,25,22,0.9),_rgba(17,12,10,1))]">
            <div className="t-label absolute left-5 top-5 text-[color:var(--text-muted)]">IMAGE COMING SOON</div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
      </div>
    </motion.div>
  );
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
  const hasColorOptions = colors.length > 0;
  const hasSizeOptions = sizes.length > 0;
  const [selectedColor, setSelectedColor] = useState<string | null>(() => getFirstAvailableColor(product));
  const [selectedSize, setSelectedSize] = useState<string | null>(() => getOptionValue(defaultVariant, "Size"));
  const setSelectedVariantId = useRaptileStore((state) => state.setSelectedVariant);
  const setSpecDrawerOpen = useRaptileStore((state) => state.setSpecDrawerOpen);

  useEffect(() => {
    if (!hasColorOptions || selectedColor) {
      return;
    }

    setSelectedColor(getFirstAvailableColor(product) ?? colors[0] ?? null);
  }, [colors, hasColorOptions, product, selectedColor]);

  const availableSizesForColor = useMemo(
    () =>
      sizes.filter((size) =>
        variants.some(
          (variant) =>
            variant.availableForSale &&
            (!hasColorOptions || getOptionValue(variant, "Color") === selectedColor) &&
            getOptionValue(variant, "Size") === size,
        ),
      ),
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

      return availableSizesForColor[0] ?? null;
    });
  }, [availableSizesForColor, hasSizeOptions]);

  const selectedVariant = useMemo(() => {
    const variant =
      variants.find((candidate) => {
        const color = getOptionValue(candidate, "Color");
        const size = getOptionValue(candidate, "Size");
        const colorMatch = !hasColorOptions || color === selectedColor;
        const sizeMatch = !hasSizeOptions || size === selectedSize;
        return colorMatch && sizeMatch;
      }) ?? null;

    if (variant) {
      return variant;
    }

    return !hasColorOptions && !hasSizeOptions ? defaultVariant : null;
  }, [defaultVariant, hasColorOptions, hasSizeOptions, selectedColor, selectedSize, variants]);

  const displayImages = useMemo(() => {
    if (!selectedColor) {
      return product.images.length ? product.images : [null];
    }

    const visibleImages = product.images.filter((image) => matchesColor(image, selectedColor));
    return visibleImages.length > 0 ? visibleImages : product.images.length ? product.images : [null];
  }, [product.images, selectedColor]);

  const soldOut = !product.availableForSale || (selectedVariant ? !selectedVariant.availableForSale : hasSizeOptions);
  const emptySelectionLabel = hasSizeOptions ? "Select a size" : "Add to Cart";

  useEffect(() => {
    setSelectedVariantId(selectedVariant?.id ?? null);
    setSpecDrawerOpen(false);

    return () => {
      setSelectedVariantId(null);
      setSpecDrawerOpen(false);
    };
  }, [selectedVariant?.id, setSelectedVariantId, setSpecDrawerOpen]);

  return (
    <LazyMotion features={domAnimation}>
      <div className="pb-32 md:pb-36">
        <div className="mx-auto max-w-[1440px] space-y-8 pb-10 pt-4 md:space-y-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedColor ?? "all"}
              className="space-y-8 md:space-y-10"
              initial={{ opacity: 0, y: reducedMotion ? 0 : -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reducedMotion ? 0 : -8 }}
              transition={{ duration: reducedMotion ? 0.18 : 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              {displayImages.slice(0, 4).map((image, index) => (
                <ImageFigure
                  key={`${selectedColor ?? "all"}-${image?.url ?? "fallback"}-${index}`}
                  image={image}
                  index={index}
                  title={product.title}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mx-auto max-w-[960px]">
          <GlassPanel className="rounded-[34px] p-8 md:p-10">
            <div className="grid gap-8">
              <div>
                <div className="t-display">{product.title}</div>
                <div className="t-price mt-4">{formatPrice(selectedVariant?.price.amount ?? product.priceRange.minVariantPrice.amount)}</div>
                <div className="mt-4 max-w-[42rem] text-sm leading-7 text-[color:var(--text-muted)] md:text-base">
                  {product.description ||
                    "A measured garment study with a refined silhouette, a restrained palette, and a focus on material clarity."}
                </div>
              </div>

              {hasColorOptions ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="t-label">Color</div>
                    <div className="t-ui text-[color:var(--text-muted)]">{selectedColor}</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => {
                      const selected = color === selectedColor;

                      return (
                        <div key={color} className="group relative">
                          <button
                            aria-label={color}
                            className={cn(
                              "h-7 w-7 rounded-full border-2 transition duration-200",
                              selected
                                ? "border-[color:var(--accent)] shadow-[0_0_0_1px_var(--accent)]"
                                : "border-transparent hover:border-[color:var(--glass-border)]",
                            )}
                            onClick={() => setSelectedColor(color)}
                            style={{ backgroundColor: getColorHex(color) }}
                            title={color}
                            type="button"
                          />
                          <span className="pointer-events-none absolute left-1/2 top-[calc(100%+4px)] -translate-x-1/2 whitespace-nowrap opacity-0 transition duration-150 group-hover:opacity-100">
                            <span className="t-label text-[color:var(--text-muted)]">{color}</span>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {hasSizeOptions ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="t-label">Size</div>
                    <div className="t-ui text-[color:var(--text-muted)]">{selectedSize ?? "Select a size"}</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => {
                      const selected = size === selectedSize;
                      const available = availableSizesForColor.includes(size);

                      return (
                        <button
                          key={size}
                          className={cn(
                            "glass-panel rounded-full border px-4 py-2 before:rounded-full",
                            selected
                              ? "border-[color:var(--accent)] text-[color:var(--accent)]"
                              : "border-[color:var(--glass-border)] text-[color:var(--text-muted)]",
                            !available && "cursor-not-allowed opacity-30 line-through hover:border-[color:var(--glass-border)]",
                          )}
                          disabled={!available}
                          onClick={() => setSelectedSize(size)}
                          type="button"
                        >
                          <span className="t-label relative z-[1]">{size}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              <div className="space-y-4">
                <AddToCartButton
                  emptySelectionLabel={emptySelectionLabel}
                  soldOut={soldOut}
                  variantId={selectedVariant?.id ?? null}
                />
                <button
                  className="t-label text-left text-[color:var(--text-muted)] transition duration-200 hover:text-[color:var(--accent-strong)]"
                  onClick={() => setSpecDrawerOpen(true)}
                  type="button"
                >
                  View Details -&gt;
                </button>
              </div>
            </div>
          </GlassPanel>
        </div>

        <SpecDrawer product={product} />
        <StatusBar
          emptySelectionLabel={emptySelectionLabel}
          product={product}
          soldOut={soldOut}
          variantId={selectedVariant?.id ?? null}
        />
      </div>
    </LazyMotion>
  );
}
