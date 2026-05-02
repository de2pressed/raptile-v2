"use client";

import { LazyMotion, domAnimation, useReducedMotion } from "framer-motion";
import * as motion from "framer-motion/client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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
  const [isHovered, setIsHovered] = useState(false);
  const [isHoverCapable, setIsHoverCapable] = useState(false);

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
    setIsHovered(false);
  }, [galleryImages.length, product.id]);

  const showHoverPreview = isHoverCapable && isHovered && galleryImages.length > 1;
  const primaryImage = galleryImages[0] ?? null;

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
        }}
        onMouseLeave={() => {
          if (!isHoverCapable || galleryImages.length < 2) {
            return;
          }

          setIsHovered(false);
        }}
      >
        <article className="grid min-w-0 gap-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-[24px] border border-[color:var(--glass-border)] bg-[color:var(--bg-elevated)] transition duration-300 ease-[var(--ease-out-expo)] group-hover:border-[color:var(--accent)] md:rounded-[28px]">
            {galleryImages.length > 1 ? (
              <motion.div
                animate={{ x: showHoverPreview ? "-50%" : "0%" }}
                className="absolute inset-0 flex h-full w-[200%]"
                transition={{ duration: reducedMotion ? 0.01 : 0.38, ease: [0.16, 1, 0.3, 1] }}
              >
                {galleryImages.map((image, index) => (
                  <div key={`${image.url}-${index}`} className="relative h-full w-1/2 shrink-0 overflow-hidden bg-[color:var(--bg-elevated)]">
                    <Image
                      alt={image.altText ?? product.title}
                      className={cn(
                        "h-full w-full object-cover object-center transition duration-500 ease-[var(--ease-out-expo)]",
                        showHoverPreview && !reducedMotion ? "scale-[1.015]" : "scale-100",
                        soldOut ? "grayscale-[0.18] brightness-[0.9]" : "",
                      )}
                      fill
                      quality={82}
                      sizes="(max-width: 767px) 50vw, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 25vw"
                      src={shopifyImageUrl(image.url, { width: 720 })}
                    />
                  </div>
                ))}
              </motion.div>
            ) : primaryImage ? (
              <div className="absolute inset-0">
                <Image
                  alt={primaryImage.altText ?? product.title}
                  className={cn(
                    "h-full w-full object-cover object-center transition duration-500 ease-[var(--ease-out-expo)] group-hover:scale-[1.015]",
                    soldOut ? "grayscale-[0.18] brightness-[0.9]" : "",
                  )}
                  fill
                  quality={82}
                  sizes="(max-width: 767px) 50vw, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 25vw"
                  src={shopifyImageUrl(primaryImage.url, { width: 720 })}
                />
              </div>
            ) : (
              <div className="absolute inset-0 image-skeleton" />
            )}

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
