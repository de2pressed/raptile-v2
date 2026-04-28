"use client";

import Image from "next/image";
import Link from "next/link";

import type { ShopifyProduct } from "@/lib/commerce";
import { formatPrice } from "@/lib/commerce";
import { getFirstAvailableColor, matchesColor } from "@/lib/product-options";
import { cn } from "@/lib/utils";

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
    <Link
      className={cn(
        "group relative block aspect-[4/5] overflow-hidden rounded-[30px] border border-transparent bg-[color:var(--bg-soft)] transition duration-300 hover:border-[color:var(--glass-border)]",
        className,
      )}
      href={`/products/${product.handle}`}
    >
      <div className="absolute inset-0">
        {thumbnail ? (
          <Image
            alt={thumbnail.altText ?? product.title}
            className={cn(
              "h-full w-full object-cover transition duration-500 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]",
              soldOut ? "grayscale-[0.35] brightness-[0.7]" : "",
            )}
            fill
            sizes="(max-width: 767px) 50vw, (max-width: 1024px) 50vw, 33vw"
            src={thumbnail.url}
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,141,64,0.2),_transparent_46%),linear-gradient(180deg,_rgba(33,25,22,0.9),_rgba(17,12,10,1))]">
            <div className="t-label absolute left-5 top-5 text-[color:var(--text-muted)]">IMAGE COMING SOON</div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        {soldOut ? (
          <div className="absolute inset-0 z-[2] flex items-center justify-center">
            <span className="t-label rounded-full border border-[color:var(--glass-border)] bg-black/30 px-4 py-2 backdrop-blur-md">
              Sold Out
            </span>
          </div>
        ) : null}
      </div>
      <div className="absolute inset-x-4 bottom-4 z-[3] overflow-hidden rounded-[24px] border border-[color:var(--glass-border)] bg-[color:var(--glass-fill)] backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--glass-tint-a)]/20 via-transparent to-[color:var(--glass-tint-b)]/10" />
        <div className="relative flex min-h-[35%] flex-col justify-end gap-2 px-4 py-4">
          <div className="t-product transition duration-300 group-hover:-translate-y-1">{product.title}</div>
          <div className="t-price text-[color:var(--text-muted)]">{formatPrice(product.priceRange.minVariantPrice.amount)}</div>
        </div>
      </div>
    </Link>
  );
}
