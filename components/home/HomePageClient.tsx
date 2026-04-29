"use client";

import { useMemo, useRef } from "react";

import { useReducedMotion, useScroll, useTransform } from "framer-motion";
import * as motion from "framer-motion/client";
import Image from "next/image";
import Link from "next/link";

import { ScrollNarrative } from "@/components/story/ScrollNarrative";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ArrowRightIcon } from "@/components/ui/icons";
import type { ShopifyProduct } from "@/lib/commerce";
import { formatPrice } from "@/lib/commerce";
import { fabricSignals, storyBeats } from "@/lib/story-content";
import { cn } from "@/lib/utils";
import { shopifyImageUrl } from "@/lib/utils/shopifyImage";

interface HomePageClientProps {
  collectionTitle: string;
  collectionDescription: string;
  products: ShopifyProduct[];
}

function summarizeText(value: string, maxLength: number) {
  const normalized = value.replace(/\s+/g, " ").trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, Math.max(0, maxLength - 3)).trimEnd()}...`;
}

interface ReleaseRowProps {
  product: ShopifyProduct;
  index: number;
  reducedMotion: boolean;
}

function ReleaseRow({ product, index, reducedMotion }: ReleaseRowProps) {
  const image = product.images[0] ?? null;
  const summary = summarizeText(product.description || product.title, 112);
  const price = formatPrice(product.priceRange.minVariantPrice.amount);
  const status = product.availableForSale ? "Ready now" : "Sold out";

  return (
    <motion.div
      initial={{ opacity: 0, y: reducedMotion ? 0 : 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration: reducedMotion ? 0.01 : 0.45, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        className="group grid gap-4 rounded-[28px] border border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.02)] p-3 transition duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 hover:border-[color:var(--accent)] hover:bg-[color:rgba(255,255,255,0.04)] sm:grid-cols-[92px_minmax(0,1fr)_auto] sm:items-center"
        href={`/products/${product.handle}`}
        aria-label={`Open ${product.title}`}
      >
        <div className="relative aspect-square w-full overflow-hidden rounded-[22px] bg-[color:var(--bg-elevated)]">
          {image ? (
            <>
              <Image
                alt={image.altText ?? product.title}
                className="h-full w-full object-cover transition duration-500 ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
                fill
                sizes="(max-width: 767px) 84px, 92px"
                src={shopifyImageUrl(image.url, { width: 220 })}
                quality={80}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_48%,color-mix(in_oklch,var(--bg)_18%,transparent)_100%)]" />
            </>
          ) : (
            <div className="absolute inset-0 image-skeleton" />
          )}
        </div>

        <div className="min-w-0 space-y-2">
          <div className="flex items-center gap-3">
            <div className="t-label text-[color:var(--text-subtle)]">{String(index + 1).padStart(2, "0")}</div>
            <div
              className={cn(
                "t-ui",
                product.availableForSale ? "text-[color:var(--text-muted)]" : "text-[color:var(--sold-out)]",
              )}
            >
              {status}
            </div>
          </div>
          <div className="font-display text-[clamp(1.2rem,2vw,1.75rem)] font-bold tracking-[-0.04em] text-[color:var(--text)]">
            {product.title}
          </div>
          <p className="t-ui max-w-[46ch] text-[color:var(--text-muted)]">{summary}</p>
        </div>

        <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-center">
          <div className="t-price text-[color:var(--text)]">{price}</div>
          <div className="flex items-center gap-2 t-label text-[color:var(--text-muted)]">
            <span>Open piece</span>
            <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function HomePageClient({ collectionTitle, collectionDescription, products }: HomePageClientProps) {
  const reducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOffset = useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 0 : 44]);

  const featuredProducts = useMemo(() => products.slice(0, 4), [products]);
  const heroProduct = featuredProducts[0] ?? products[0] ?? null;
  const heroImage = heroProduct?.images[0] ?? null;
  const heroHref = heroProduct ? `/products/${heroProduct.handle}` : "/collection";
  const collectionSize = products.length;
  const heroSummary =
    collectionDescription ||
    "A short edit of heavyweight tees and essentials, tuned for Indian weather and repeated wear.";
  const heroOverlaySummary = heroProduct
    ? summarizeText(heroProduct.description || heroSummary, 120)
    : "The cover piece appears here once products are published.";
  const heroPrice = heroProduct ? formatPrice(heroProduct.priceRange.minVariantPrice.amount) : null;
  const heroStatus = heroProduct?.availableForSale ? "Ready now" : heroProduct ? "Sold out" : "Collection preview";
  const releaseFacts = [
    { label: "Edition", value: collectionTitle },
    { label: "Pieces", value: `${collectionSize} pieces` },
    { label: "Weight", value: "240gsm body" },
    { label: "Finish", value: "Double bio washed" },
  ] as const;

  return (
    <div className="mx-auto w-full max-w-[1440px] py-4 md:py-8">
      <section
        ref={heroRef}
        className="grid gap-6 lg:min-h-[calc(100svh-var(--header-height))] lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-center"
      >
        <Link
          className="group order-1 block overflow-hidden rounded-[34px] md:rounded-[40px] lg:order-2"
          href={heroHref}
          aria-label={heroProduct ? `Open ${heroProduct.title}` : "Browse the collection"}
        >
          <motion.div
            className="noise-surface relative isolate min-h-[24rem] overflow-hidden rounded-[34px] border border-[color:var(--glass-border)] bg-[color:var(--bg-elevated)] md:min-h-[34rem] md:rounded-[40px] lg:min-h-[46rem]"
            style={{ y: heroOffset }}
          >
            {heroImage ? (
              <>
                <Image
                  alt={heroImage.altText ?? heroProduct?.title ?? "Featured Raptile Studio piece"}
                  className="absolute inset-0 z-[1] h-full w-full object-cover transition duration-500 ease-[var(--ease-out-expo)] group-hover:scale-[1.02]"
                  fill
                  priority
                  quality={88}
                  sizes="(min-width: 1280px) 48vw, 100vw"
                  src={shopifyImageUrl(heroImage.url, { width: 1400 })}
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_18%,color-mix(in_oklch,var(--bg)_22%,transparent)_100%)] transition duration-300 group-hover:opacity-90" />
              </>
            ) : (
              <div className="absolute inset-0 image-skeleton" />
            )}

            <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
              <GlassPanel className="rounded-[28px] px-4 py-4 md:max-w-[28rem] md:px-5 md:py-5">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="t-label text-[color:var(--text-muted)]">Featured piece</div>
                    <div className="t-ui text-[color:var(--text-subtle)]">{heroStatus}</div>
                  </div>

                  <div className="space-y-2">
                    <div className="font-display text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-[-0.04em] text-[color:var(--text)]">
                      {heroProduct?.title ?? collectionTitle}
                    </div>
                    <p className="t-ui max-w-[28ch] text-[color:var(--text-muted)]">{heroOverlaySummary}</p>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="t-price text-[color:var(--text)]">{heroPrice ?? "Collection preview"}</div>
                    <div className="flex items-center gap-2 t-label text-[color:var(--text-muted)]">
                      <span>Open piece</span>
                      <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </div>
              </GlassPanel>
            </div>
          </motion.div>
        </Link>

        <motion.div
          className="order-2 space-y-6 lg:order-1 lg:self-center"
          initial={{ opacity: 0, y: reducedMotion ? 0 : 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0.01 : 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 t-label text-[color:var(--text-muted)]">
              <span>{collectionTitle}</span>
              <span aria-hidden>/</span>
              <span>{collectionSize} pieces</span>
              <span aria-hidden>/</span>
              <span>Built in India</span>
            </div>
            <h1 className="t-hero max-w-[11ch] text-[color:var(--text)]">
              Heavyweight essentials, tuned for heat and repeat wear.
            </h1>
            <p className="editorial-copy max-w-[36ch]">{heroSummary}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link className="btn-primary rounded-full px-5 py-3.5" href="/collection">
              <span className="t-label text-[color:var(--bg)]">Shop Collection</span>
            </Link>
            <Link className="ghost-button rounded-full px-5 py-3.5 text-[color:var(--text)]" href="/about">
              <span className="t-label">Read the Story</span>
            </Link>
          </div>

          <GlassPanel className="rounded-[32px] px-5 py-5 md:px-6 md:py-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {releaseFacts.map((fact) => (
                <div key={fact.label} className="space-y-2">
                  <div className="t-label text-[color:var(--text-subtle)]">{fact.label}</div>
                  <div className="font-display text-[1.35rem] font-bold tracking-[-0.04em] text-[color:var(--text)]">
                    {fact.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {fabricSignals.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center rounded-full border border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.02)] px-4 py-2 t-ui text-[color:var(--text-muted)]"
                >
                  {item}
                </span>
              ))}
            </div>
          </GlassPanel>
        </motion.div>
      </section>

      <section className="pt-16 md:pt-20">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-start">
          <motion.div
            className="space-y-5 lg:sticky lg:top-24 lg:self-start"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: reducedMotion ? 0.01 : 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="space-y-2">
              <div className="t-label text-[color:var(--text-muted)]">Featured pieces</div>
              <h2 className="t-display max-w-[11ch] text-[color:var(--text)]">
                A short index, not a wall of product tiles.
              </h2>
              <p className="editorial-copy max-w-[34ch]">
                One cover piece leads, the rest are listed by price and status so the page stays fast to read on mobile and
                still feels composed on desktop.
              </p>
            </div>

            <GlassPanel className="rounded-[32px] px-5 py-5 md:px-6 md:py-6">
              <div className="space-y-3">
                <div className="t-label text-[color:var(--text-muted)]">Studio note</div>
                <p className="t-ui leading-7 text-[color:var(--text-muted)]">
                  This homepage keeps the cloth in front. A cover image, then a release index, then the fabric story as you
                  scroll. The page feels calmer when the structure is this direct.
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {fabricSignals.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center rounded-full border border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.02)] px-4 py-2 t-ui text-[color:var(--text-muted)]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </GlassPanel>

            <Link
              className="t-label inline-flex items-center gap-2 text-[color:var(--text-muted)] transition-colors duration-200 hover:text-[color:var(--text)]"
              href="/collection"
            >
              <span>Browse the collection</span>
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </motion.div>

          <div className="grid gap-4">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product, index) => (
                <ReleaseRow key={product.id} index={index} product={product} reducedMotion={Boolean(reducedMotion)} />
              ))
            ) : (
              <GlassPanel className="rounded-[32px] px-5 py-5 md:px-6 md:py-6">
                <div className="space-y-3">
                  <div className="t-label text-[color:var(--text-muted)]">Featured pieces</div>
                  <div className="font-display text-3xl font-bold tracking-[-0.04em] text-[color:var(--text)] md:text-4xl">
                    Add products to the selected Shopify collection to populate the homepage index.
                  </div>
                </div>
              </GlassPanel>
            )}
          </div>
        </div>
      </section>

      <section className="pt-20 md:pt-24">
        <ScrollNarrative
          cta={{ href: "/collection", label: "Browse the collection" }}
          intro="Weight, wash, shape, and release keep the line in focus as you move through the page."
          label="Fabric notes"
          title="The cloth story stays visible as you scroll."
          items={storyBeats}
        />
      </section>
    </div>
  );
}
