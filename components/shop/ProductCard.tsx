"use client";

import Image from "next/image";
import Link from "next/link";

import type { ShopifyProduct } from "@/lib/commerce";
import { formatPrice } from "@/lib/commerce";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: ShopifyProduct;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const primaryImage = product.images[0];
  const isVaulted = !product.availableForSale;

  return (
    <Link
      className={cn(
        "group relative block aspect-[4/5] overflow-hidden rounded-[30px] border border-transparent bg-[color:var(--bg-soft)] transition duration-300 hover:border-[color:var(--glass-border)]",
        className,
      )}
      href={`/products/${product.handle}`}
    >
      <div className="absolute inset-0">
        {primaryImage ? (
          <Image
            alt={primaryImage.altText ?? product.title}
            className={cn(
              "h-full w-full object-cover transition duration-500 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]",
              isVaulted ? "grayscale-[0.7] brightness-[0.6]" : "",
            )}
            fill
            sizes="(max-width: 767px) 50vw, (max-width: 1024px) 50vw, 33vw"
            src={primaryImage.url}
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,141,64,0.2),_transparent_46%),linear-gradient(180deg,_rgba(33,25,22,0.9),_rgba(17,12,10,1))]">
            <div className="t-label absolute left-5 top-5 text-[color:var(--text-muted)]">SIGNAL LOCK / PENDING MEDIA</div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        {isVaulted ? (
          <div className="t-vaulted absolute inset-0 z-[2] flex items-center justify-center text-sm tracking-[0.35em]">
            VAULTED
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
