"use client";

import { useMemo, useRef } from "react";

import { useReducedMotion, useScroll, useTransform } from "framer-motion";
import * as motion from "framer-motion/client";
import Image from "next/image";
import Link from "next/link";

import { ScrollNarrative } from "@/components/story/ScrollNarrative";
import { ProductCard } from "@/components/shop/ProductCard";
import type { ShopifyProduct } from "@/lib/commerce";
import { formatPrice } from "@/lib/commerce";
import { shopifyImageUrl } from "@/lib/utils/shopifyImage";

interface HomePageClientProps {
  collectionTitle: string;
  collectionDescription: string;
  products: ShopifyProduct[];
}

const fabricCallouts = [
  "240gsm body",
  "Double bio washed",
  "Heavy rib collar",
  "Short-run release",
];

export function HomePageClient({ collectionTitle, collectionDescription, products }: HomePageClientProps) {
  const reducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOffset = useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 0 : 56]);

  const featuredProducts = useMemo(() => products.slice(0, 3), [products]);
  const heroProduct = featuredProducts[0] ?? products[0] ?? null;
  const heroImage = heroProduct?.images[0] ?? null;
  const narrativeImages = useMemo(
    () => [
      products[0]?.images[0] ?? heroImage,
      products[1]?.images[0] ?? products[0]?.images[1] ?? heroImage,
      products[2]?.images[0] ?? products[1]?.images[0] ?? heroImage,
      products[3]?.images[0] ?? products[2]?.images[0] ?? heroImage,
    ],
    [heroImage, products],
  );

  const narrativeItems = [
    {
      eyebrow: "01 / Weight",
      title: "240gsm body, dense enough to hold the line.",
      body:
        "A heavier knit keeps the silhouette grounded, so the piece lands with presence and does not collapse after a few wears.",
      image: narrativeImages[0],
      stat: "Built to hang clean, not cling.",
    },
    {
      eyebrow: "02 / Finish",
      title: "Double bio washed for a softer hand.",
      body:
        "The cloth breaks in without losing structure. It feels calmer on skin while keeping the garment sharp in the room.",
      image: narrativeImages[1],
      stat: "Softness without surrender.",
    },
    {
      eyebrow: "03 / Shape",
      title: "A controlled cut with a heavier collar.",
      body:
        "Necklines, seams, and shoulder lines are set to keep the tee from drifting into generic basics territory.",
      image: narrativeImages[2],
      stat: "Shape that stays composed.",
    },
    {
      eyebrow: "04 / Run",
      title: "Short release windows keep the room intentional.",
      body:
        "Small batches protect the fit, the finish, and the point of view. When a piece lands, it feels like a decision, not inventory.",
      image: narrativeImages[3],
      stat: "Measured drops over noise.",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[1440px] py-8 md:py-12">
      <section ref={heroRef} className="grid gap-8 lg:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)] lg:items-end">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="t-label text-[color:var(--text-muted)]">Onyx Collection</div>
            <h1 className="t-hero max-w-[10ch] text-[color:var(--text)]">
              Black weight. Controlled shape. No wasted motion.
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

          <div className="flex flex-wrap gap-2">
            {fabricCallouts.map((item) => (
              <div
                key={item}
                className="noise-surface rounded-full border border-[color:var(--glass-border)] bg-[color:var(--bg-soft)] px-4 py-2"
              >
                <span className="t-label relative z-[1] text-[color:var(--text-muted)]">{item}</span>
              </div>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="noise-surface rounded-[24px] border border-[color:var(--glass-border)] bg-[color:var(--bg-soft)] p-4">
              <div className="t-label text-[color:var(--text-muted)]">Collection</div>
              <div className="mt-2 font-display text-2xl font-bold tracking-[-0.04em] text-[color:var(--text)]">
                {collectionTitle}
              </div>
            </div>
            <div className="noise-surface rounded-[24px] border border-[color:var(--glass-border)] bg-[color:var(--bg-soft)] p-4">
              <div className="t-label text-[color:var(--text-muted)]">Weight</div>
              <div className="mt-2 font-display text-2xl font-bold tracking-[-0.04em] text-[color:var(--text)]">240gsm</div>
            </div>
            <div className="noise-surface rounded-[24px] border border-[color:var(--glass-border)] bg-[color:var(--bg-soft)] p-4">
              <div className="t-label text-[color:var(--text-muted)]">Finish</div>
              <div className="mt-2 font-display text-2xl font-bold tracking-[-0.04em] text-[color:var(--text)]">
                Double bio wash
              </div>
            </div>
          </div>
        </div>

        <motion.div
          className="noise-surface relative isolate overflow-hidden rounded-[38px] border border-[color:var(--glass-border)] bg-[color:var(--bg-elevated)]"
          style={{ y: heroOffset }}
        >
          <div className="relative min-h-[34rem] md:min-h-[40rem]">
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
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_15%,color-mix(in_oklch,var(--bg)_22%,transparent)_100%)]" />
              </>
            ) : (
              <div className="absolute inset-0 image-skeleton" />
            )}

            <div className="relative z-[1] flex h-full min-h-[34rem] flex-col justify-between p-6 md:min-h-[40rem] md:p-8">
              <div className="flex items-center justify-between gap-4">
                <div className="t-label text-[color:var(--text-muted)]">Featured from the collection</div>
                <div className="t-label text-[color:var(--text-muted)]">
                  {heroProduct?.availableForSale ? "Ready now" : "Sold out"}
                </div>
              </div>

              <div className="space-y-5 self-end text-right">
                <div className="space-y-2">
                  <div className="t-label text-[color:var(--text-muted)]">Featured piece</div>
                  <div className="font-display text-3xl font-bold tracking-[-0.04em] text-[color:var(--text)] md:text-4xl">
                    {heroProduct?.title ?? "Onyx collection"}
                  </div>
                  {heroProduct ? (
                    <div className="t-ui text-[color:var(--text-muted)]">
                      {formatPrice(heroProduct.priceRange.minVariantPrice.amount)}
                    </div>
                  ) : null}
                </div>

                <div className="flex flex-wrap justify-end gap-2">
                  {["240gsm", "Double bio washed", "Heavy rib", "Short run"].map((item) => (
                    <div key={item} className="rounded-full border border-[color:var(--glass-border)] bg-[color:var(--bg)]/78 px-3 py-2">
                      <span className="t-label text-[color:var(--text-muted)]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="pt-16 md:pt-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="t-label text-[color:var(--text-muted)]">Featured products</div>
            <h2 className="t-display max-w-[11ch] text-[color:var(--text)]">The first pieces people will reach for.</h2>
          </div>
          <Link
            className="t-label text-[color:var(--text-muted)] transition-colors duration-200 hover:text-[color:var(--text)]"
            href="/collection"
          >
            Open collection
          </Link>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
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
          intro="Weight and wash do the talking. The interface just gives the material enough room to read."
          label="Fabric notes"
          title="The cloth story stays visible as you scroll."
          items={narrativeItems}
        />
      </section>
    </div>
  );
}
