"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { AcquireButton } from "@/components/shop/AcquireButton";
import { SpecDrawer } from "@/components/shop/SpecDrawer";
import { StatusBar } from "@/components/shop/StatusBar";
import { GlassPanel } from "@/components/ui/GlassPanel";
import type { ProductImage, ProductVariant, ShopifyProduct } from "@/lib/commerce";
import { formatPrice } from "@/lib/commerce";
import { useRaptileStore } from "@/lib/store";

interface ProductDetailClientProps {
  product: ShopifyProduct;
}

function normalizeGallery(images: ProductImage[]) {
  if (images.length === 0) {
    return [null, null, null, null] as Array<ProductImage | null>;
  }

  const gallery: Array<ProductImage | null> = [...images];

  while (gallery.length < 4) {
    gallery.push(images[gallery.length % images.length] ?? null);
  }

  return gallery.slice(0, 4);
}

function optionLabel(variant: ProductVariant) {
  return variant.selectedOptions.map((option) => option.value).join(" / ") || "DEFAULT";
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const variants = product.variants.length
    ? product.variants
    : [
        {
          id: "",
          availableForSale: product.availableForSale,
          selectedOptions: [{ name: "Edition", value: "Default" }],
          price: product.priceRange.minVariantPrice,
        },
      ];
  const defaultVariant = variants.find((variant) => variant.availableForSale) ?? variants[0];
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(defaultVariant);
  const gallery = useMemo(() => normalizeGallery(product.images), [product.images]);
  const setSelectedVariantId = useRaptileStore((state) => state.setSelectedVariant);
  const setSpecDrawerOpen = useRaptileStore((state) => state.setSpecDrawerOpen);
  const available = product.availableForSale && selectedVariant.availableForSale;

  useEffect(() => {
    setSelectedVariantId(selectedVariant.id || null);
    setSpecDrawerOpen(false);

    return () => {
      setSelectedVariantId(null);
      setSpecDrawerOpen(false);
    };
  }, [selectedVariant.id, setSelectedVariantId, setSpecDrawerOpen]);

  return (
    <div className="pb-32 md:pb-36">
      <div className="mx-auto max-w-[1440px] space-y-8 pb-10 pt-4 md:space-y-10">
        {gallery.map((image, index) => {
          const layoutClasses =
            index === 0
              ? "aspect-[3/4] w-full"
              : index === 1
                ? "aspect-[4/5] w-full md:ml-auto md:max-w-[62%]"
                : index === 2
                  ? "aspect-[4/5] w-full md:max-w-[58%]"
                  : "aspect-[16/10] w-full";

          return (
            <div key={`${image?.url ?? "fallback"}-${index}`} className={layoutClasses}>
              <div className="relative h-full overflow-hidden rounded-[32px] bg-[color:var(--bg-soft)]">
                {image ? (
                  <Image
                    alt={image.altText ?? product.title}
                    className="h-full w-full object-cover"
                    fill
                    priority={index === 0}
                    sizes={index === 0 ? "100vw" : "(max-width: 767px) 100vw, 65vw"}
                    src={image.url}
                  />
                ) : (
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,136,54,0.22),_transparent_48%),linear-gradient(180deg,_rgba(24,17,14,0.95),_rgba(11,8,7,1))]">
                    <div className="t-label absolute left-5 top-5 text-[color:var(--text-muted)]">MEDIA STREAM UNAVAILABLE</div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="sticky bottom-4 z-[105] mx-auto -mt-24 max-w-[960px] px-1 md:-mt-28">
        <GlassPanel className="rounded-[34px] px-5 py-5 md:px-8 md:py-7">
          <div className="grid gap-6 md:grid-cols-[1.3fr_0.9fr]">
            <div>
              <div className="t-label text-[color:var(--accent-strong)]">MATERIAL INSPECTOR</div>
              <div className="t-display mt-3">{product.title}</div>
              <div className="mt-3 max-w-[38rem] text-sm leading-7 text-[color:var(--text-muted)] md:text-base">
                {product.description ||
                  "A terminal-grade garment study with layered material notes, calibrated proportions, and vaulted archival treatment."}
              </div>
            </div>
            <div className="space-y-5">
              <div className="t-price">{formatPrice(selectedVariant.price.amount)}</div>
              <div className="flex flex-wrap gap-2">
                {variants.map((variant) => {
                  const selected = variant.id === selectedVariant.id;

                  return (
                    <button
                      key={`${variant.id}-${optionLabel(variant)}`}
                      className={`t-ui rounded-full border px-3 py-2 transition duration-200 ${
                        selected
                          ? "border-[color:var(--accent-glow)] text-[color:var(--accent-strong)] shadow-[0_0_18px_rgba(255,134,57,0.18)]"
                          : "border-[color:var(--glass-border)] text-[color:var(--text-muted)]"
                      }`}
                      onClick={() => setSelectedVariant(variant)}
                      type="button"
                    >
                      [{optionLabel(variant)}]
                    </button>
                  );
                })}
              </div>
              <AcquireButton available={available} variantId={selectedVariant.id} />
              <button
                className="t-label text-left text-[color:var(--text-muted)] transition duration-200 hover:text-[color:var(--accent-strong)]"
                onClick={() => setSpecDrawerOpen(true)}
                type="button"
              >
                [VIEW SPECS →]
              </button>
            </div>
          </div>
        </GlassPanel>
      </div>

      <SpecDrawer product={product} />
      <StatusBar available={available} product={product} variantId={selectedVariant.id} />
    </div>
  );
}
