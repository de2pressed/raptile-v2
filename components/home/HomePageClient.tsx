"use client";

import { useMemo } from "react";

import { useReducedMotion } from "framer-motion";
import * as motion from "framer-motion/client";
import Image from "next/image";
import Link from "next/link";

import { ProductGrid } from "@/components/shop/ProductGrid";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ArrowRightIcon } from "@/components/ui/icons";
import type { ShopifyProduct } from "@/lib/commerce";
import { formatPrice } from "@/lib/commerce";
import { cn } from "@/lib/utils";
import { shopifyImageUrl } from "@/lib/utils/shopifyImage";

interface HomePageClientProps {
  collectionTitle: string;
  collectionDescription: string;
  products: ShopifyProduct[];
}

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "3XL"] as const;

const MATERIAL_NOTES = [
  {
    label: "01 / Weight",
    title: "240gsm body, enough weight to keep the silhouette upright.",
    body: "The cloth holds its line on body, so the product image is still believable once the piece is worn in.",
  },
  {
    label: "02 / Finish",
    title: "Double bio washed, softer on first wear without losing edge.",
    body: "The hand-feel lands easier, but the structure stays sharp. That balance matters more than loud styling.",
  },
  {
    label: "03 / Collar",
    title: "Heavy rib at the neck keeps the piece looking cleaner for longer.",
    body: "The collar does more than frame the tee, it keeps repeat wear from turning the shape into another basic.",
  },
  {
    label: "04 / Release",
    title: "Short-run drops keep the page tighter and the collection more intentional.",
    body: "A small edit reads better, shops faster, and avoids the usual wall of product noise.",
  },
] as const;

function summarizeText(value: string, maxLength: number) {
  const normalized = value.replace(/\s+/g, " ").trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, Math.max(0, maxLength - 3)).trimEnd()}...`;
}

function getProductSizes(product: ShopifyProduct) {
  const sizes = new Set<string>();

  for (const variant of product.variants) {
    for (const option of variant.selectedOptions) {
      if (option.name.trim().toLowerCase() === "size" && option.value.trim()) {
        sizes.add(option.value.trim().toUpperCase());
      }
    }
  }

  return Array.from(sizes);
}

function sortSizeValues(values: string[]) {
  const order = new Map<string, number>(SIZE_ORDER.map((value, index) => [value, index]));

  return [...values].sort((left, right) => {
    const leftOrder = order.get(left);
    const rightOrder = order.get(right);

    if (leftOrder !== undefined || rightOrder !== undefined) {
      return (leftOrder ?? Number.MAX_SAFE_INTEGER) - (rightOrder ?? Number.MAX_SAFE_INTEGER);
    }

    return left.localeCompare(right);
  });
}

function getCollectionPriceSummary(products: ShopifyProduct[]) {
  if (!products.length) {
    return "Collection preview";
  }

  const values = products
    .map((product) => Number(product.priceRange.minVariantPrice.amount))
    .filter((value) => Number.isFinite(value));

  if (!values.length) {
    return "Collection preview";
  }

  const min = Math.min(...values);
  const max = Math.max(...values);

  if (min === max) {
    return formatPrice(min);
  }

  return `${formatPrice(min)} - ${formatPrice(max)}`;
}

function getCollectionSizeSummary(products: ShopifyProduct[]) {
  const values = sortSizeValues(
    Array.from(new Set(products.flatMap((product) => getProductSizes(product).map((value) => value.toUpperCase())))),
  );

  if (!values.length) {
    return "Guide available";
  }

  if (values.length === 1) {
    return values[0];
  }

  return `${values[0]} to ${values[values.length - 1]}`;
}

function ProductPreviewCard({ product, label }: { product: ShopifyProduct; label: string }) {
  const image = product.images[0] ?? null;
  const price = formatPrice(product.priceRange.minVariantPrice.amount);
  const status = product.availableForSale ? "Ready now" : "Sold out";

  return (
    <Link
      aria-label={`Open ${product.title}`}
      className="group grid grid-cols-[92px_minmax(0,1fr)] gap-3 rounded-[28px] border border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.02)] p-3 transition duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 hover:border-[color:var(--accent)] hover:bg-[color:rgba(255,255,255,0.04)]"
      href={`/products/${product.handle}`}
    >
      <div className="relative aspect-square overflow-hidden rounded-[20px] bg-[color:var(--bg-elevated)]">
        {image ? (
          <Image
            alt={image.altText ?? product.title}
            className="h-full w-full object-cover transition duration-500 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
            fill
            sizes="92px"
            src={shopifyImageUrl(image.url, { width: 220 })}
            quality={80}
          />
        ) : (
          <div className="absolute inset-0 image-skeleton" />
        )}
      </div>

      <div className="min-w-0 space-y-2">
        <div className="flex items-center justify-between gap-3">
          <span className="t-label text-[color:var(--text-muted)]">{label}</span>
          <span
            className={cn(
              "t-ui",
              product.availableForSale ? "text-[color:var(--text-subtle)]" : "text-[color:var(--sold-out)]",
            )}
          >
            {status}
          </span>
        </div>

        <div className="font-display text-[1.1rem] font-bold leading-[1.02] tracking-[-0.04em] text-[color:var(--text)]">
          {product.title}
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="t-price text-[color:var(--text-muted)]">{price}</span>
          <span className="flex items-center gap-2 t-ui text-[color:var(--text-subtle)]">
            <span>Open</span>
            <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function MaterialNote({ label, title, body }: { label: string; title: string; body: string }) {
  return (
    <article className="border-t border-[color:color-mix(in_oklch,var(--glass-border)_88%,transparent)] pt-4 first:border-t-0 first:pt-0">
      <div className="space-y-2">
        <div className="t-label text-[color:var(--text-muted)]">{label}</div>
        <div className="font-display text-[1.2rem] font-bold leading-[1.08] tracking-[-0.04em] text-[color:var(--text)]">
          {title}
        </div>
        <p className="t-ui max-w-[44ch] leading-6 text-[color:var(--text-muted)]">{body}</p>
      </div>
    </article>
  );
}

export function HomePageClient({ collectionTitle, collectionDescription, products }: HomePageClientProps) {
  const reducedMotion = useReducedMotion();

  const orderedProducts = useMemo(() => {
    return [...products].sort((left, right) => Number(right.availableForSale) - Number(left.availableForSale));
  }, [products]);

  const heroProduct = orderedProducts[0] ?? null;
  const supportingProducts = orderedProducts.slice(1, 3);
  const showcaseProducts = orderedProducts.slice(0, Math.min(orderedProducts.length, 6));
  const storyProduct = orderedProducts[2] ?? orderedProducts[1] ?? heroProduct;
  const heroImage = heroProduct?.images[0] ?? null;
  const storyImage = storyProduct?.images[0] ?? null;
  const heroHref = heroProduct ? `/products/${heroProduct.handle}` : "/collection";
  const heroSummary = heroProduct
    ? summarizeText(heroProduct.description || collectionDescription, 140)
    : "The collection preview sharpens up as soon as the first live piece lands.";
  const availableCount = products.filter((product) => product.availableForSale).length;
  const soldOutCount = Math.max(0, products.length - availableCount);
  const commerceFacts = [
    { label: "Price span", value: getCollectionPriceSummary(orderedProducts) },
    { label: "Sizing", value: getCollectionSizeSummary(orderedProducts) },
    { label: "Live now", value: `${availableCount} of ${products.length || 0} pieces` },
  ];

  return (
    <div className="mx-auto w-full max-w-[1440px] py-4 md:py-8">
      <section className="grid gap-8 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:items-center">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 lg:pr-4"
          initial={{ opacity: 0, y: reducedMotion ? 0 : 18 }}
          transition={{ duration: reducedMotion ? 0.01 : 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex flex-wrap items-center gap-3 t-label text-[color:var(--text-muted)]">
            <span>{collectionTitle}</span>
            <span aria-hidden>/</span>
            <span>{products.length} pieces</span>
            <span aria-hidden>/</span>
            <span>Built in India</span>
          </div>

          <div className="space-y-4">
            <h1 className="t-hero max-w-[10ch] text-[color:var(--text)]">
              Shop heavyweight essentials that stay sharp after the first wear.
            </h1>
            <p className="editorial-copy max-w-[37ch]">
              {summarizeText(collectionDescription, 165)} Start with the featured piece, then move through the rest of
              the drop without losing the shopping flow.
            </p>
            <p className="t-ui max-w-[40ch] leading-6 text-[color:var(--text-subtle)]">
              Well executed cloth, a tighter edit, and a homepage that moves you toward product instead of asking for
              patience.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link className="btn-primary rounded-full px-5 py-3.5" href="/collection">
              <span className="t-label text-[color:var(--bg)]">Shop Collection</span>
            </Link>
            <Link className="ghost-button rounded-full px-5 py-3.5 text-[color:var(--text)]" href={heroHref}>
              <span className="t-label">{heroProduct ? "Open Featured Piece" : "Browse Preview"}</span>
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {commerceFacts.map((fact) => (
              <div
                key={fact.label}
                className="rounded-[24px] border border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.02)] px-4 py-4"
              >
                <div className="t-label text-[color:var(--text-muted)]">{fact.label}</div>
                <div className="mt-3 font-display text-[1.18rem] font-bold leading-[1.06] tracking-[-0.04em] text-[color:var(--text)]">
                  {fact.value}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4 t-ui text-[color:var(--text-subtle)]">
            <Link className="transition-colors duration-200 hover:text-[color:var(--text)]" href="/size-guide">
              Need fit clarity? Check the size guide.
            </Link>
            {soldOutCount > 0 ? <span>{soldOutCount} pieces are already gone.</span> : <span>The full drop is live now.</span>}
          </div>
        </motion.div>

        <motion.div
          className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(260px,0.42fr)]"
          initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: reducedMotion ? 0.01 : 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            aria-label={heroProduct ? `Open ${heroProduct.title}` : "Browse the collection"}
            className="group block overflow-hidden rounded-[34px] md:rounded-[40px]"
            href={heroHref}
          >
            <div className="relative min-h-[28rem] overflow-hidden rounded-[34px] border border-[color:var(--glass-border)] bg-[color:var(--bg-elevated)] md:min-h-[36rem] md:rounded-[40px] xl:min-h-[44rem]">
              {heroImage ? (
                <>
                  <Image
                    alt={heroImage.altText ?? heroProduct?.title ?? "Featured Raptile piece"}
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
                    fill
                    priority
                    quality={88}
                    sizes="(min-width: 1280px) 46vw, 100vw"
                    src={shopifyImageUrl(heroImage.url, { width: 1480 })}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_oklch,var(--bg)_6%,transparent)_0%,transparent_40%,color-mix(in_oklch,var(--bg)_76%,transparent)_100%)]" />
                </>
              ) : (
                <div className="absolute inset-0 image-skeleton" />
              )}

              <div className="absolute left-4 top-4 md:left-6 md:top-6">
                <span className="t-label rounded-full border border-[color:var(--glass-border)] bg-[color:rgba(14,14,14,0.5)] px-3 py-2 text-[color:var(--text)] backdrop-blur-md">
                  {heroProduct ? "Featured piece" : "Collection preview"}
                </span>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
                <GlassPanel className="rounded-[28px] px-4 py-4 md:max-w-[30rem] md:px-5 md:py-5">
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="t-label text-[color:var(--text-muted)]">Open now</div>
                      <div
                        className={cn(
                          "t-ui",
                          heroProduct?.availableForSale ? "text-[color:var(--text-subtle)]" : "text-[color:var(--sold-out)]",
                        )}
                      >
                        {heroProduct?.availableForSale ? "Ready now" : heroProduct ? "Sold out" : "Preview"}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="font-display text-[clamp(1.85rem,3.8vw,3rem)] font-bold tracking-[-0.04em] text-[color:var(--text)]">
                        {heroProduct?.title ?? collectionTitle}
                      </div>
                      <p className="t-ui max-w-[32ch] leading-6 text-[color:var(--text-muted)]">{heroSummary}</p>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div className="t-price text-[color:var(--text)]">
                        {heroProduct ? formatPrice(heroProduct.priceRange.minVariantPrice.amount) : "Collection preview"}
                      </div>
                      <div className="flex items-center gap-2 t-label text-[color:var(--text-muted)]">
                        <span>{heroProduct ? "Open piece" : "Browse collection"}</span>
                        <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </div>
                </GlassPanel>
              </div>
            </div>
          </Link>

          <div className="grid content-start gap-4">
            {supportingProducts.map((product, index) => (
              <ProductPreviewCard key={product.id} label={`Edit ${String(index + 1).padStart(2, "0")}`} product={product} />
            ))}

            <GlassPanel className="rounded-[28px] px-4 py-4 md:px-5 md:py-5">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="t-label text-[color:var(--text-muted)]">Fast decisions</div>
                  <div className="font-display text-[1.45rem] font-bold leading-[1.06] tracking-[-0.04em] text-[color:var(--text)]">
                    Compare the drop, check the fit, then move straight to the right piece.
                  </div>
                </div>

                <div className="grid gap-3">
                  <Link
                    className="flex items-center justify-between gap-3 rounded-[20px] border border-[color:var(--glass-border)] px-4 py-3 transition duration-200 hover:border-[color:var(--accent)]"
                    href="/collection#collection-search"
                  >
                    <span className="t-ui text-[color:var(--text-muted)]">Open the full collection view</span>
                    <ArrowRightIcon className="h-4 w-4 text-[color:var(--text-subtle)]" />
                  </Link>
                  <Link
                    className="flex items-center justify-between gap-3 rounded-[20px] border border-[color:var(--glass-border)] px-4 py-3 transition duration-200 hover:border-[color:var(--accent)]"
                    href="/size-guide"
                  >
                    <span className="t-ui text-[color:var(--text-muted)]">Check the size guide before checkout</span>
                    <ArrowRightIcon className="h-4 w-4 text-[color:var(--text-subtle)]" />
                  </Link>
                </div>
              </div>
            </GlassPanel>
          </div>
        </motion.div>
      </section>

      <section className="scroll-mt-24 pt-20 md:pt-24" id="shop-now">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.32fr)_minmax(0,0.68fr)] lg:items-start">
          <motion.div
            className="space-y-4 lg:sticky lg:top-24"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: reducedMotion ? 0.01 : 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="space-y-3">
              <div className="t-label text-[color:var(--text-muted)]">Shop the release</div>
              <h2 className="t-display max-w-[11ch] text-[color:var(--text)]">The homepage should already feel like the shop.</h2>
              <p className="editorial-copy max-w-[34ch]">
                Open a piece here first. Move to the collection page when you want the full filter and search pass,
                not before.
              </p>
            </div>

            <div className="space-y-3 t-ui leading-6 text-[color:var(--text-muted)]">
              <p>Product imagery leads, titles stay readable, and pricing stays visible at a glance.</p>
              <p>The grid below brings the drop forward without turning the homepage into another generic catalog wall.</p>
            </div>
          </motion.div>

          <div className="space-y-5">
            <ProductGrid products={showcaseProducts} />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="t-ui text-[color:var(--text-subtle)]">
                {products.length > showcaseProducts.length
                  ? `${products.length - showcaseProducts.length} more pieces continue on the collection page.`
                  : "The current release is fully visible from the homepage."}
              </div>
              <Link
                className="inline-flex items-center gap-2 t-label text-[color:var(--text-muted)] transition-colors duration-200 hover:text-[color:var(--text)]"
                href="/collection"
              >
                <span>Browse all pieces</span>
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-20 md:pt-28">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.88fr)] lg:items-center">
          <motion.div
            className="relative min-h-[24rem] overflow-hidden rounded-[34px] border border-[color:var(--glass-border)] bg-[color:var(--bg-elevated)] md:min-h-[34rem]"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: reducedMotion ? 0.01 : 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {storyImage ? (
              <>
                <Image
                  alt={storyImage.altText ?? storyProduct?.title ?? "Raptile Studio garment detail"}
                  className="absolute inset-0 h-full w-full object-cover"
                  fill
                  quality={86}
                  sizes="(min-width: 1024px) 48vw, 100vw"
                  src={shopifyImageUrl(storyImage.url, { width: 1400 })}
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_18%,color-mix(in_oklch,var(--bg)_78%,transparent)_100%)]" />
              </>
            ) : (
              <div className="absolute inset-0 image-skeleton" />
            )}

            <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
              <GlassPanel className="rounded-[28px] px-4 py-4 md:max-w-[24rem] md:px-5 md:py-5">
                <div className="space-y-2">
                  <div className="t-label text-[color:var(--text-muted)]">Material notes</div>
                  <div className="font-display text-[1.5rem] font-bold leading-[1.06] tracking-[-0.04em] text-[color:var(--text)]">
                    The cloth still does the convincing.
                  </div>
                  <p className="t-ui leading-6 text-[color:var(--text-muted)]">
                    The homepage is cleaner now, but the fabric story stays close because that is what makes the product
                    image credible.
                  </p>
                </div>
              </GlassPanel>
            </div>
          </motion.div>

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: reducedMotion ? 0.01 : 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="space-y-3">
              <div className="t-label text-[color:var(--text-muted)]">Why this drop lands</div>
              <h2 className="t-display max-w-[12ch] text-[color:var(--text)]">Built to read well on body, not just on the page.</h2>
              <p className="editorial-copy max-w-[36ch]">
                Weight, wash, collar, and release rhythm are what keep the storefront from drifting into surface-only
                design. The page should sell that clearly.
              </p>
            </div>

            <div className="space-y-4">
              {MATERIAL_NOTES.map((note) => (
                <MaterialNote body={note.body} key={note.label} label={note.label} title={note.title} />
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link className="ghost-button rounded-full px-5 py-3.5 text-[color:var(--text)]" href="/about">
                <span className="t-label">Read the Story</span>
              </Link>
              <Link className="ghost-button rounded-full px-5 py-3.5 text-[color:var(--text)]" href="/size-guide">
                <span className="t-label">Check Size Guide</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="pt-20 md:pt-24">
        <GlassPanel className="rounded-[34px] px-5 py-6 md:px-8 md:py-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="space-y-3">
              <div className="t-label text-[color:var(--text-muted)]">Final pass</div>
              <div className="font-display text-[clamp(1.8rem,4vw,3.2rem)] font-bold leading-[0.98] tracking-[-0.04em] text-[color:var(--text)]">
                Ready to move through the full {collectionTitle.toLowerCase()}?
              </div>
              <p className="t-ui max-w-[48ch] leading-6 text-[color:var(--text-muted)]">
                Open the collection for the full rail, or go straight to sizing before you pick a piece. The cleaner
                path should start here and finish there.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link className="btn-primary rounded-full px-5 py-3.5" href="/collection">
                <span className="t-label text-[color:var(--bg)]">Shop All Pieces</span>
              </Link>
              <Link className="ghost-button rounded-full px-5 py-3.5 text-[color:var(--text)]" href="/size-guide">
                <span className="t-label">Sizing First</span>
              </Link>
            </div>
          </div>
        </GlassPanel>
      </section>
    </div>
  );
}
