"use client";

import Link from "next/link";

import { AcquireButton } from "@/components/shop/AcquireButton";
import { GlassPanel } from "@/components/ui/GlassPanel";
import type { ShopifyProduct } from "@/lib/commerce";
import { formatPrice } from "@/lib/commerce";

interface StatusBarProps {
  product: ShopifyProduct;
  variantId?: string | null;
  available: boolean;
}

export function StatusBar({ product, variantId, available }: StatusBarProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[110] px-3 pb-3 md:px-6 md:pb-6">
      <GlassPanel className="pointer-events-auto mx-auto rounded-[26px] px-4 py-3 md:max-w-[1440px] md:px-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-3 md:gap-6">
            <Link className="t-ui text-[color:var(--text-muted)]" href="/">
              [← COLLECTION]
            </Link>
            <span className="t-ui">{product.handle.toUpperCase()}</span>
            <span className="t-ui">{formatPrice(product.priceRange.minVariantPrice.amount)}</span>
          </div>
          <AcquireButton available={available} className="md:w-auto" compact variantId={variantId} />
        </div>
      </GlassPanel>
    </div>
  );
}
