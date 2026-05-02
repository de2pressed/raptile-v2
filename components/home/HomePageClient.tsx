"use client";

import { useMemo } from "react";

import { useReducedMotion } from "framer-motion";
import * as motion from "framer-motion/client";
import Image from "next/image";
import Link from "next/link";

import { ProductGrid } from "@/components/shop/ProductGrid";
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
    label: "Weight",
    title: "240gsm cloth keeps the tee standing up on body.",
    body: "The fabric holds shape cleanly, so the product page reads closer to how the piece actually lands when worn.",
  },
  {
    label: "Finish",
    title: "Double bio wash softens the hand without flattening the structure.",
    body: "The first wear feels easier, but the surface still looks controlled instead of collapsing into another basic.",
  },
  {
    label: "Fit",
    title: "Sizing should be read before checkout, not guessed from the photo.",
    body: "The route stays short: open the guide, compare the measurements, and order with the intended volume in mind.",
  },
] as const;

const SUPPORT_LINKS = [
  {
    href: "/size-guide",
    label: "Size guide",
    body: "Measurements first, then checkout.",
  },
  {
    href: "/shipping",
    label: "Shipping",
    body: "Delivery expectations without filler.",
  },
  {
    href: "/returns",
    label: "Returns",
    body: "Read the policy before the order lands.",
  },
  {
    href: "/contact",
    label: "Contact",
    body: "Ask for a second read on fit or fabric.",
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

function MaterialNote({ label, title, body }: { label: string; title: string; body: string }) {
  return (
    <article className="border-t border-[color:var(--glass-border)] pt-4 first:border-t-0 first:pt-0">
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

function SupportShortcut({ href, label, body }: { href: string; label: string; body: string }) {
  return (
    <Link
      className="group grid gap-2 rounded-[22px] border border-[color:var(--glass-border)] bg-[color:color-mix(in_oklch,var(--bg-elevated)_90%,var(--bg))] px-4 py-4 transition duration-200 ease-[var(--ease-out-expo)] hover:border-[color:color-mix(in_oklch,var(--text)_28%,var(--glass-border))] hover:bg-[color:color-mix(in_oklch,var(--bg-elevated)_96%,var(--bg))]"
      href={href}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="t-label text-[color:var(--text)]">{label}</span>
        <ArrowRightIcon className="h-4 w-4 text-[color:var(--text-subtle)] transition-transform duration-200 group-hover:translate-x-0.5" />
      </div>
      <p className="t-ui max-w-[28ch] leading-6 text-[color:var(--text-muted)]">{body}</p>
    </Link>
  );
}

export function HomePageClient({ collectionTitle, collectionDescription, products }: HomePageClientProps) {
  const reducedMotion = useReducedMotion();

  const orderedProducts = useMemo(() => {
    return [...products].sort((left, right) => Number(right.availableForSale) - Number(left.availableForSale));
  }, [products]);

  const heroProduct = orderedProducts[0] ?? null;
  const heroImage = heroProduct?.images[0] ?? null;
  const heroHref = heroProduct ? `/products/${heroProduct.handle}` : "/collection";
  const heroSummary = heroProduct
    ? summarizeText(heroProduct.description || collectionDescription, 120)
    : "The collection preview sharpens up as soon as the first live piece lands.";
  const showcaseProducts = orderedProducts.slice(0, Math.min(orderedProducts.length, 4));
  const storyProduct = orderedProducts[1] ?? heroProduct;
  const storyImage = storyProduct?.images[0] ?? null;
  const storyHref = storyProduct ? `/products/${storyProduct.handle}` : "/collection";
  const storySummary = summarizeText(storyProduct?.description || collectionDescription, 120);
  const availableCount = products.filter((product) => product.availableForSale).length;
  const soldOutCount = Math.max(0, products.length - availableCount);
  const commerceFacts = [
    { label: "Price span", value: getCollectionPriceSummary(orderedProducts) },
    { label: "Sizing", value: getCollectionSizeSummary(orderedProducts) },
    { label: "Live now", value: `${availableCount} of ${products.length || 0} pieces` },
  ];

  return (
    <div className="mx-auto w-full max-w-[1440px] pb-14 pt-4 md:pb-20 md:pt-6">
      <section className="grid gap-7 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:gap-10">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="order-2 grid content-start gap-6 md:gap-7 lg:order-1 lg:pr-8"
          initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
          transition={{ duration: reducedMotion ? 0.01 : 0.42, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex flex-wrap items-center gap-3 t-label text-[color:var(--text-muted)]">
            <span>{collectionTitle}</span>
            <span aria-hidden>/</span>
            <span>{products.length} pieces</span>
            <span aria-hidden>/</span>
            <span>Built in India</span>
          </div>

          <div className="space-y-4">
            <h1 className="t-hero max-w-[8ch] text-[color:var(--text)]">Heavyweight essentials. Straight to the piece.</h1>
            <p className="editorial-copy max-w-[38ch]">
              {summarizeText(collectionDescription, 135)} Silhouette, price, and fit stay visible from the first screen.
            </p>
            <p className="t-ui hidden max-w-[42ch] leading-6 text-[color:var(--text-subtle)] md:block">
              The front page stays restrained so the garments, the route into product, and the mobile read stay clean.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link className="btn-primary rounded-full px-5 py-3.5 text-center" href="/collection">
              <span className="t-label text-[color:var(--bg)]">Shop collection</span>
            </Link>
            <Link className="ghost-button rounded-full px-5 py-3.5 text-center text-[color:var(--text)]" href={heroHref}>
              <span className="t-label">{heroProduct ? "Open featured piece" : "Browse preview"}</span>
            </Link>
          </div>

          <dl className="grid gap-4 border-y border-[color:var(--glass-border)] py-5 sm:grid-cols-3">
            {commerceFacts.map((fact) => (
              <div key={fact.label} className="space-y-2">
                <dt className="t-label text-[color:var(--text-muted)]">{fact.label}</dt>
                <dd className="font-display text-[1.05rem] font-semibold leading-[1.08] tracking-[-0.03em] text-[color:var(--text)]">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-wrap items-center gap-4 t-ui leading-6 text-[color:var(--text-subtle)]">
            <Link className="transition-colors duration-200 hover:text-[color:var(--text)]" href="/size-guide">
              Fit clarity lives in the size guide.
            </Link>
            <span>{soldOutCount > 0 ? `${soldOutCount} pieces have already moved.` : "The current drop is live now."}</span>
          </div>
        </motion.div>

        <motion.div
          className="order-1 lg:order-2"
          initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: reducedMotion ? 0.01 : 0.42, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            aria-label={heroProduct ? `Open ${heroProduct.title}` : "Browse the collection"}
            className="group block"
            href={heroHref}
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] border border-[color:var(--glass-border)] bg-[color:var(--bg-elevated)] md:aspect-[5/6] xl:aspect-[4/5]">
              {heroImage ? (
                <>
                  <Image
                    alt={heroImage.altText ?? heroProduct?.title ?? "Featured Raptile piece"}
                    className="absolute inset-0 h-full w-full object-cover object-center transition duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.015]"
                    fill
                    priority
                    quality={88}
                    sizes="(min-width: 1280px) 48vw, 100vw"
                    src={shopifyImageUrl(heroImage.url, { width: 1480 })}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_oklch,var(--bg)_4%,transparent)_0%,transparent_36%,color-mix(in_oklch,var(--bg)_82%,transparent)_100%)]" />
                </>
              ) : (
                <div className="absolute inset-0 image-skeleton" />
              )}

              <div className="absolute left-4 top-4 md:left-5 md:top-5">
                <span className="t-label rounded-full border border-[color:color-mix(in_oklch,var(--glass-border)_90%,transparent)] bg-[color:rgba(10,10,10,0.72)] px-3 py-2 text-[color:var(--text)] backdrop-blur-sm">
                  {heroProduct?.availableForSale ? "Featured piece" : heroProduct ? "Sold out piece" : "Collection preview"}
                </span>
              </div>

              <div className="absolute inset-x-0 bottom-0 grid gap-4 p-4 md:p-6">
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={cn(
                      "t-ui",
                      heroProduct?.availableForSale ? "text-[color:var(--text-subtle)]" : "text-[color:var(--sold-out)]",
                    )}
                  >
                    {heroProduct?.availableForSale ? "Ready now" : heroProduct ? "Sold out" : "Preview"}
                  </span>
                  <span className="t-price text-[color:var(--text)]">
                    {heroProduct ? formatPrice(heroProduct.priceRange.minVariantPrice.amount) : "Collection preview"}
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                  <div className="space-y-2">
                    <div className="font-display text-[clamp(1.6rem,3.2vw,2.65rem)] font-bold leading-[0.98] tracking-[-0.04em] text-[color:var(--text)]">
                      {heroProduct?.title ?? collectionTitle}
                    </div>
                    <p className="t-ui max-w-[34ch] leading-6 text-[color:var(--text-muted)]">{heroSummary}</p>
                  </div>

                  <div className="inline-flex items-center gap-2 t-label text-[color:var(--text-muted)] sm:justify-self-end">
                    <span>{heroProduct ? "Open piece" : "Browse collection"}</span>
                    <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </section>

      <section className="scroll-mt-24 pt-14 md:pt-20" id="shop-now">
        <div className="flex flex-col gap-4 border-b border-[color:var(--glass-border)] pb-5 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <div className="t-label text-[color:var(--text-muted)]">Shop the drop</div>
            <h2 className="t-display max-w-[10ch] text-[color:var(--text)]">A short edit on the homepage. The rest stays one click away.</h2>
          </div>

          <Link
            className="inline-flex items-center gap-2 t-label text-[color:var(--text-muted)] transition-colors duration-200 hover:text-[color:var(--text)]"
            href="/collection"
          >
            <span>Browse all pieces</span>
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>

        <div className="pt-6">
          <ProductGrid products={showcaseProducts} />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="t-ui text-[color:var(--text-subtle)]">
            {products.length > showcaseProducts.length
              ? `${products.length - showcaseProducts.length} more pieces continue on the collection page.`
              : "The current release is fully visible from the homepage."}
          </div>
          <Link
            className="inline-flex items-center gap-2 t-label text-[color:var(--text-muted)] transition-colors duration-200 hover:text-[color:var(--text)]"
            href="/size-guide"
          >
            <span>Check fit first</span>
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="pt-16 md:pt-24">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:items-start">
          <Link aria-label={storyProduct ? `Open ${storyProduct.title}` : "Browse the collection"} className="group block" href={storyHref}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[30px] border border-[color:var(--glass-border)] bg-[color:var(--bg-elevated)] md:aspect-[5/6]">
              {storyImage ? (
                <>
                  <Image
                    alt={storyImage.altText ?? storyProduct?.title ?? "Raptile Studio garment detail"}
                    className="absolute inset-0 h-full w-full object-cover object-center transition duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.015]"
                    fill
                    quality={86}
                    sizes="(min-width: 1024px) 48vw, 100vw"
                    src={shopifyImageUrl(storyImage.url, { width: 1400 })}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_22%,color-mix(in_oklch,var(--bg)_84%,transparent)_100%)]" />
                </>
              ) : (
                <div className="absolute inset-0 image-skeleton" />
              )}

              <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
                <div className="max-w-[22rem] rounded-[24px] border border-[color:color-mix(in_oklch,var(--glass-border)_88%,transparent)] bg-[color:rgba(10,10,10,0.7)] px-4 py-4 backdrop-blur-sm">
                  <div className="space-y-2">
                    <div className="t-label text-[color:var(--text-muted)]">Fabric read</div>
                    <div className="font-display text-[1.35rem] font-semibold leading-[1.05] tracking-[-0.03em] text-[color:var(--text)]">
                      {storyProduct?.title ?? collectionTitle}
                    </div>
                    <p className="t-ui leading-6 text-[color:var(--text-muted)]">{storySummary}</p>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          <motion.div
            className="grid gap-6"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: reducedMotion ? 0.01 : 0.42, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="space-y-3">
              <div className="t-label text-[color:var(--text-muted)]">Before checkout</div>
              <h2 className="t-display max-w-[10ch] text-[color:var(--text)]">Fit, finish, and support stay close.</h2>
              <p className="editorial-copy max-w-[38ch]">
                A short read on cloth and sizing, followed by the service routes people actually need before ordering.
              </p>
            </div>

            <div className="space-y-4">
              {MATERIAL_NOTES.map((note) => (
                <MaterialNote body={note.body} key={note.label} label={note.label} title={note.title} />
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {SUPPORT_LINKS.map((link) => (
                <SupportShortcut body={link.body} href={link.href} key={link.href} label={link.label} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
