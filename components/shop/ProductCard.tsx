"use client";

import Image from "next/image";
import Link from "next/link";

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
  const firstAvailableColor = getFirstAvailableColor(product);
  const thumbnail =
    product.images.find((image) => matchesColor(image, firstAvailableColor)) ?? product.images[0];
  const soldOut = !product.availableForSale;

  return (
    <Link className={cn("group block h-full", className)} href={`/products/${product.handle}`}>
      <article className="grid gap-4">
        <div className="relative aspect-square overflow-hidden rounded-[24px] border border-[color:var(--glass-border)] bg-[color:var(--bg-elevated)] md:rounded-[28px]">
          {thumbnail ? (
            <Image
              alt={thumbnail.altText ?? product.title}
              className={cn(
                "h-full w-full object-cover transition duration-500 ease-[var(--ease-out-expo)]",
                soldOut ? "grayscale-[0.18] brightness-[0.9]" : "group-hover:scale-[1.015]",
              )}
              fill
              sizes="(max-width: 767px) 50vw, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 25vw"
              src={shopifyImageUrl(thumbnail.url, { width: 720 })}
              quality={82}
            />
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
          <div className="t-product max-w-[18ch] text-[color:var(--text)]">{product.title}</div>
          <div className="flex items-center justify-between gap-3">
            <div className="t-price text-[color:var(--text-muted)]">{formatPrice(product.priceRange.minVariantPrice.amount)}</div>
            <div className="t-ui text-[color:var(--text-subtle)]">{soldOut ? "Unavailable" : "Ready"}</div>
          </div>
        </div>
      </article>
    </Link>
  );
}
