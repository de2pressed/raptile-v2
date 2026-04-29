"use client";

import { AnimatePresence, LazyMotion, domAnimation, useReducedMotion } from "framer-motion";
import * as motion from "framer-motion/client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import type { ShopifyProduct } from "@/lib/commerce";
import { formatPrice } from "@/lib/commerce";
import { getFirstAvailableColor, matchesColor } from "@/lib/product-options";
import { cn } from "@/lib/utils";
import { shopifyImageUrl } from "@/lib/utils/shopifyImage";

interface ProductCardProps {
  product: ShopifyProduct;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const reducedMotion = useReducedMotion();
  const firstAvailableColor = getFirstAvailableColor(product);
  const galleryImages = useMemo(() => {
    if (!product.images.length) {
      return [];
    }

    const filteredImages = firstAvailableColor
      ? product.images.filter((image) => matchesColor(image, firstAvailableColor))
      : product.images;

    return (filteredImages.length > 0 ? filteredImages : product.images).slice(0, 2);
  }, [firstAvailableColor, product.images]);
  const soldOut = !product.availableForSale;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isHoverCapable, setIsHoverCapable] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const updateHoverCapable = () => setIsHoverCapable(media.matches);

    updateHoverCapable();
    media.addEventListener("change", updateHoverCapable);

    return () => {
      media.removeEventListener("change", updateHoverCapable);
    };
  }, []);

  useEffect(() => {
    setActiveIndex(0);
    setIsHovered(false);
  }, [galleryImages.length, product.id]);

  useEffect(() => {
    if (reducedMotion || isHoverCapable || galleryImages.length < 2) {
      return;
    }

    const scheduleNextFlip = () => {
      const delay = 2500 + Math.random() * 2000;
      timerRef.current = window.setTimeout(() => {
        setActiveIndex((current) => (current === 0 ? 1 : 0));
        scheduleNextFlip();
      }, delay);
    };

    scheduleNextFlip();

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [galleryImages.length, isHoverCapable, reducedMotion]);

  const visibleIndex = isHoverCapable && isHovered && galleryImages.length > 1 ? 1 : activeIndex;
  const visibleImage = galleryImages[visibleIndex] ?? galleryImages[0] ?? null;

  return (
    <LazyMotion features={domAnimation}>
      <Link
        className={cn(
          "group block h-full min-w-0 transition-transform duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-1",
          className,
        )}
        href={`/products/${product.handle}`}
        onMouseEnter={() => {
          if (!isHoverCapable || galleryImages.length < 2) {
            return;
          }

          setIsHovered(true);
          setActiveIndex(1);
        }}
        onMouseLeave={() => {
          if (!isHoverCapable || galleryImages.length < 2) {
            return;
          }

          setIsHovered(false);
          setActiveIndex(0);
        }}
      >
        <article className="grid min-w-0 gap-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-[24px] border border-[color:var(--glass-border)] bg-[color:var(--bg-elevated)] transition duration-300 ease-[var(--ease-out-expo)] group-hover:border-[color:var(--accent)] group-hover:shadow-[0_20px_48px_rgba(0,0,0,0.18)] md:rounded-[28px]">
            <AnimatePresence mode="wait" initial={false}>
              {visibleImage ? (
                <motion.div
                  key={`${visibleImage.url}-${visibleIndex}`}
                  className="absolute inset-0"
                  initial={{ opacity: 0, x: reducedMotion ? 0 : 12 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, x: reducedMotion ? 0 : -12 }}
                  transition={{ duration: reducedMotion ? 0.01 : 0.2, ease: [0.4, 0, 0.2, 1] }}
                >
                  <Image
                    alt={visibleImage.altText ?? product.title}
                    className={cn(
                      "h-full w-full object-cover transition duration-500 ease-[var(--ease-out-expo)]",
                      soldOut ? "grayscale-[0.18] brightness-[0.9]" : "",
                    )}
                    fill
                    sizes="(max-width: 767px) 50vw, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 25vw"
                    src={shopifyImageUrl(visibleImage.url, { width: 720 })}
                    quality={82}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="product-skeleton"
                  className="absolute inset-0 image-skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </AnimatePresence>

            {soldOut ? (
              <div className="absolute left-4 top-4 z-[2]">
                <span className="t-label rounded-full border border-[color:var(--glass-border)] bg-[color:var(--bg)]/88 px-3 py-2 text-[color:var(--text)]">
                  Sold Out
                </span>
              </div>
            ) : null}
          </div>

          <div className="grid gap-2">
            <div className="t-product max-w-full break-words text-[color:var(--text)]">{product.title}</div>
            <div className="flex items-center justify-between gap-3">
              <div className="t-price text-[color:var(--text-muted)]">{formatPrice(product.priceRange.minVariantPrice.amount)}</div>
              <div className="t-ui text-[color:var(--text-subtle)]">{soldOut ? "Unavailable" : "Ready"}</div>
            </div>
          </div>
        </article>
      </Link>
    </LazyMotion>
  );
}
