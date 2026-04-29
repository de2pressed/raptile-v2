"use client";

import { useMemo, useRef } from "react";

import { useReducedMotion, useScroll, useTransform } from "framer-motion";
import * as motion from "framer-motion/client";
import Image from "next/image";
import Link from "next/link";

import { ScrollNarrative } from "@/components/story/ScrollNarrative";
import { ProductCard } from "@/components/shop/ProductCard";
import type { ShopifyProduct } from "@/lib/commerce";
import { fabricSignals, storyBeats } from "@/lib/story-content";
import { shopifyImageUrl } from "@/lib/utils/shopifyImage";

interface HomePageClientProps {
  collectionTitle: string;
  collectionDescription: string;
  products: ShopifyProduct[];
}

export function HomePageClient({ collectionTitle, collectionDescription, products }: HomePageClientProps) {
  const reducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOffset = useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 0 : 56]);

  const featuredProducts = useMemo(() => products.slice(0, 2), [products]);
  const heroProduct = featuredProducts[0] ?? products[0] ?? null;
  const heroImage = heroProduct?.images[0] ?? null;

  return (
    <div className="mx-auto w-full max-w-[1440px] py-6 md:py-12">
      <section
        ref={heroRef}
        className="grid min-h-[calc(100svh-var(--header-height))] gap-6 lg:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)] lg:items-end"
      >
        <div className="order-2 space-y-6 lg:order-1">
          <div className="space-y-4">
            <div className="t-label text-[color:var(--text-muted)]">Onyx Collection</div>
            <h1 className="t-hero max-w-[10ch] text-[color:var(--text)]">
              Heavyweight essentials, composed for low light.
            </h1>
            <p className="editorial-copy max-w-[34ch]">
              {collectionDescription ||
                "Heavyweight essentials for the quiet part of the wardrobe, framed with the same discipline as the garments themselves."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link className="btn-primary rounded-full px-5 py-3.5" href="/collection">
              <span className="t-label text-[color:var(--bg)]">Shop Collection</span>
            </Link>
            <Link
              className="ghost-button rounded-full px-5 py-3.5 text-[color:var(--text)]"
              href="/about"
            >
              <span className="t-label">Read the Story</span>
            </Link>
          </div>

          <div className="space-y-4 border-t border-[color:var(--glass-border)] pt-5">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[color:var(--text-muted)]">
              {fabricSignals.map((item, index) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="t-ui">{item}</span>
                  {index < fabricSignals.length - 1 ? (
                    <span aria-hidden className="text-[color:var(--text-subtle)]">
                      /
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 border-t border-[color:var(--glass-border)] pt-5 sm:grid-cols-3">
            <div className="space-y-1">
              <div className="t-label text-[color:var(--text-muted)]">Collection</div>
              <div className="font-display text-2xl font-bold tracking-[-0.04em] text-[color:var(--text)]">{collectionTitle}</div>
            </div>
            <div className="space-y-1">
              <div className="t-label text-[color:var(--text-muted)]">Weight</div>
              <div className="font-display text-2xl font-bold tracking-[-0.04em] text-[color:var(--text)]">240gsm</div>
            </div>
            <div className="space-y-1">
              <div className="t-label text-[color:var(--text-muted)]">Finish</div>
              <div className="font-display text-2xl font-bold tracking-[-0.04em] text-[color:var(--text)]">Double bio wash</div>
            </div>
          </div>
        </div>

        <Link
          className="group order-1 block cursor-pointer overflow-hidden rounded-[28px] md:rounded-[38px] lg:order-2"
          href={heroProduct ? `/products/${heroProduct.handle}` : "/collection"}
          aria-label={heroProduct ? `Open ${heroProduct.title}` : "Browse the collection"}
        >
          <motion.div
            className="noise-surface relative isolate aspect-[4/5] min-h-[26rem] overflow-hidden rounded-[28px] border border-[color:var(--glass-border)] bg-[color:var(--bg-elevated)] md:aspect-auto md:min-h-[40rem] md:rounded-[38px]"
            style={{ y: heroOffset }}
          >
            {heroImage ? (
              <>
                <Image
                  alt={heroImage.altText ?? heroProduct?.title ?? "Featured Raptile Studio piece"}
                  className="absolute inset-0 z-[1] h-full w-full object-cover"
                  fill
                  priority
                  quality={88}
                  sizes="(min-width: 1280px) 42vw, 100vw"
                  src={shopifyImageUrl(heroImage.url, { width: 1400 })}
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_15%,color-mix(in_oklch,var(--bg)_22%,transparent)_100%)] transition duration-200 group-active:opacity-[0.85]" />
              </>
            ) : (
              <div className="absolute inset-0 image-skeleton" />
            )}

            <div className="relative z-[1] flex h-full min-h-[26rem] flex-col justify-between p-5 md:min-h-[40rem] md:p-8">
              <div className="flex items-center justify-between gap-4">
                <div className="t-label text-[color:var(--text-muted)]">Featured from the collection</div>
                <div className="t-label text-[color:var(--text-muted)]">
                  {heroProduct?.availableForSale ? "Ready now" : "Sold out"}
                </div>
              </div>

              <div className="hidden" aria-hidden />
            </div>
          </motion.div>
        </Link>
      </section>

      <section className="pt-16 md:pt-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="t-label text-[color:var(--text-muted)]">Featured products</div>
            <h2 className="t-display max-w-[11ch] text-[color:var(--text)]">The first pieces people will reach for.</h2>
          </div>
          <div className="t-ui max-w-[20rem] text-[color:var(--text-muted)]">
            A smaller edit here keeps the homepage from turning into a grid wall.
          </div>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: reducedMotion ? 0 : 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: reducedMotion ? 0.01 : 0.45, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass-panel rounded-[30px] px-6 py-8 md:px-8 md:py-10">
            <div className="t-label text-[color:var(--text-muted)]">Featured products</div>
            <div className="mt-4 max-w-[32rem] font-display text-3xl font-bold tracking-[-0.04em] text-[color:var(--text)] md:text-4xl">
              Add products to the selected Shopify collection to populate the homepage.
            </div>
          </div>
        )}
      </section>

      <section className="pt-20 md:pt-24">
        <ScrollNarrative
          cta={{ href: "/collection", label: "Browse the collection" }}
          intro="Weight, wash, shape, and release are the four notes that keep the line in focus."
          label="Fabric notes"
          title="The cloth story stays visible as you scroll."
          items={storyBeats}
        />
      </section>
    </div>
  );
}
