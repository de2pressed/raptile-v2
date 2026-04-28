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
  aspectRatioClass?: string;
}

export function ProductCard({ product, className, aspectRatioClass = "aspect-[4/5]" }: ProductCardProps) {
  const firstAvailableColor = getFirstAvailableColor(product);
  const thumbnail =
    product.images.find((image) => matchesColor(image, firstAvailableColor)) ?? product.images[0];
  const soldOut = !product.availableForSale;

  return (
    <Link className={cn("group block h-full", className)} href={`/products/${product.handle}`}>
      <div
        className={cn(
          "relative w-full overflow-hidden bg-[color:var(--bg)] lg:max-h-[72vh]",
          aspectRatioClass,
        )}
      >
        {thumbnail ? (
          <Image
            alt={thumbnail.altText ?? product.title}
            className={cn(
              "h-full w-full object-cover transition duration-500 ease-[var(--ease-out-expo)]",
              soldOut ? "grayscale-[0.18] brightness-[0.88]" : "group-hover:scale-[1.02]",
            )}
            fill
            sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 50vw"
            src={shopifyImageUrl(thumbnail.url, { width: 600, crop: "center" })}
          />
        ) : (
          <div className="absolute inset-0 image-skeleton" />
        )}

        <div className={cn("absolute inset-0 transition duration-300", soldOut ? "group-hover:bg-black/40" : "bg-black/10 group-hover:bg-black/24")} />

        {soldOut ? (
          <div className="absolute inset-0 z-[2] flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
            <span className="t-label rounded-full border border-[color:var(--glass-border)] bg-black/55 px-4 py-2 text-[color:var(--text)]">
              Sold Out
            </span>
          </div>
        ) : null}

        <div className="absolute inset-x-4 bottom-4 z-[3]">
          <div className="rounded-[22px] border border-[color:var(--glass-border)] bg-black/28 px-4 py-4 backdrop-blur-md">
            <div className="t-product text-[color:var(--text)]">{product.title}</div>
            <div className="t-price mt-2 text-[color:var(--text-muted)]">
              {formatPrice(product.priceRange.minVariantPrice.amount)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
