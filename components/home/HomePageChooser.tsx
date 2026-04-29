"use client";

import { AnimatePresence, LazyMotion, domAnimation, useReducedMotion } from "framer-motion";
import * as motion from "framer-motion/client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { GlassPanel } from "@/components/ui/GlassPanel";
import { ArrowRightIcon, CloseIcon, StarIcon } from "@/components/ui/icons";
import type { ShopifyProduct } from "@/lib/commerce";
import { formatPrice } from "@/lib/commerce";
import { fabricSignals, storyBeats } from "@/lib/story-content";
import { cn } from "@/lib/utils";
import { shopifyImageUrl } from "@/lib/utils/shopifyImage";

interface HomePageChooserProps {
  collectionTitle: string;
  collectionDescription: string;
  products: ShopifyProduct[];
}

type VariantId = "editorial" | "commerce" | "archive";
type ViewMode = "compare" | "focus";

interface VariantMeta {
  id: VariantId;
  label: string;
  summary: string;
  bestFor: string;
  heroOffset: number;
}

const VARIANTS: VariantMeta[] = [
  {
    id: "editorial",
    label: "Editorial runway",
    summary: "Big image first, slower copy, release rows underneath.",
    bestFor: "image-led decisions",
    heroOffset: 0,
  },
  {
    id: "commerce",
    label: "Commerce floor",
    summary: "Tighter grid, faster product read, clearer shopping path.",
    bestFor: "quick buying",
    heroOffset: 1,
  },
  {
    id: "archive",
    label: "Archive desk",
    summary: "Magazine pace, layered notes, and a more measured read.",
    bestFor: "slower review",
    heroOffset: 2,
  },
];

function summarizeText(value: string, maxLength: number) {
  const normalized = value.replace(/\s+/g, " ").trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, Math.max(0, maxLength - 3)).trimEnd()}...`;
}

function formatCount(value: number) {
  return value === 1 ? "1 piece" : `${value} pieces`;
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tagName = target.tagName;
  return tagName === "INPUT" || tagName === "TEXTAREA" || target.isContentEditable;
}

function resolveProduct(products: ShopifyProduct[], index: number) {
  return products[index] ?? products[0] ?? null;
}

function resolvePrice(product: ShopifyProduct | null) {
  if (!product) {
    return null;
  }

  return formatPrice(product.priceRange.minVariantPrice.amount);
}

function resolveAvailability(product: ShopifyProduct | null) {
  if (!product) {
    return "Preview only";
  }

  return product.availableForSale ? "Ready now" : "Sold out";
}

function ProductRailRow({
  index,
  product,
  dense = false,
}: {
  index: number;
  product: ShopifyProduct | null;
  dense?: boolean;
}) {
  if (!product) {
    return (
      <div className="rounded-[24px] border border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.02)] p-4 text-[color:var(--text-muted)]">
        <div className="t-label text-[color:var(--text-subtle)]">No product yet</div>
        <p className="t-ui mt-2 max-w-[28ch]">Add products to the selected Shopify collection to fill this lane.</p>
      </div>
    );
  }

  const image = product.images[0] ?? null;
  const price = resolvePrice(product);
  const status = resolveAvailability(product);

  return (
    <Link
      className={cn(
        "group grid items-center gap-3 rounded-[24px] border border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.025)] p-3 transition duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 hover:border-[color:var(--accent)] hover:bg-[color:rgba(255,255,255,0.045)]",
        dense ? "sm:grid-cols-[72px_minmax(0,1fr)_auto]" : "sm:grid-cols-[84px_minmax(0,1fr)_auto]",
      )}
      href={`/products/${product.handle}`}
      aria-label={`Open ${product.title}`}
    >
      <div className="relative aspect-square overflow-hidden rounded-[18px] bg-[color:var(--bg-elevated)]">
        {image ? (
          <Image
            alt={image.altText ?? product.title}
            className="h-full w-full object-cover transition duration-500 ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
            fill
            quality={82}
            sizes="(max-width: 767px) 72px, 84px"
            src={shopifyImageUrl(image.url, { width: 220 })}
          />
        ) : (
          <div className="image-skeleton absolute inset-0" />
        )}
      </div>

      <div className="min-w-0 space-y-2">
        <div className="flex items-center gap-2">
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
        <div className="font-display text-[1.02rem] font-semibold tracking-[-0.03em] text-[color:var(--text)] md:text-[1.1rem]">
          {product.title}
        </div>
        <p className="t-ui max-w-[40ch] text-[color:var(--text-muted)]">
          {summarizeText(product.description || product.title, dense ? 72 : 92)}
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-center">
        <div className="t-price text-[color:var(--text)]">{price}</div>
        <div className="flex items-center gap-2 t-label text-[color:var(--text-muted)]">
          <span>View piece</span>
          <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}

function ProductTile({
  index,
  product,
}: {
  index: number;
  product: ShopifyProduct | null;
}) {
  if (!product) {
    return (
      <div className="rounded-[26px] border border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.02)] p-4 text-[color:var(--text-muted)]">
        <div className="t-label text-[color:var(--text-subtle)]">No product yet</div>
        <p className="t-ui mt-2 max-w-[24ch]">Once the collection is published, this lane becomes a tight product grid.</p>
      </div>
    );
  }

  const image = product.images[0] ?? null;
  const price = resolvePrice(product);
  const status = resolveAvailability(product);

  return (
    <Link
      className="group flex h-full flex-col overflow-hidden rounded-[26px] border border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.025)] transition duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 hover:border-[color:var(--accent)] hover:bg-[color:rgba(255,255,255,0.045)]"
      href={`/products/${product.handle}`}
      aria-label={`Open ${product.title}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[color:var(--bg-elevated)]">
        {image ? (
          <Image
            alt={image.altText ?? product.title}
            className="h-full w-full object-cover transition duration-500 ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
            fill
            quality={82}
            sizes="(max-width: 767px) 50vw, (max-width: 1279px) 25vw, 16vw"
            src={shopifyImageUrl(image.url, { width: 720 })}
          />
        ) : (
          <div className="image-skeleton absolute inset-0" />
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between gap-4 p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="t-label text-[color:var(--text-subtle)]">{String(index + 1).padStart(2, "0")}</div>
              <div className="font-display text-[1.05rem] font-semibold tracking-[-0.03em] text-[color:var(--text)]">
                {product.title}
              </div>
            </div>
            <div className="t-price text-[color:var(--text)]">{price}</div>
          </div>
          <p className="t-ui max-w-[28ch] text-[color:var(--text-muted)]">
            {summarizeText(product.description || product.title, 72)}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div
            className={cn(
              "t-ui",
              product.availableForSale ? "text-[color:var(--text-muted)]" : "text-[color:var(--sold-out)]",
            )}
          >
            {status}
          </div>
          <div className="flex items-center gap-2 t-label text-[color:var(--text-muted)]">
            <span>View piece</span>
            <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function StoryCard({
  beat,
  index,
}: {
  beat: (typeof storyBeats)[number];
  index: number;
}) {
  return (
    <div className="rounded-[24px] border border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.025)] p-4 md:p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="t-label text-[color:var(--text-muted)]">{beat.eyebrow}</div>
        <div className="t-ui text-[color:var(--text-subtle)]">{String(index + 1).padStart(2, "0")}</div>
      </div>
      <div className="mt-3 font-display text-[1.1rem] font-semibold tracking-[-0.03em] text-[color:var(--text)]">
        {beat.title}
      </div>
      <p className="t-ui mt-2 max-w-[32ch] text-[color:var(--text-muted)]">{summarizeText(beat.body, 128)}</p>
      <div className="t-ui mt-3 text-[color:var(--text-subtle)]">{beat.stat}</div>
    </div>
  );
}

function VariantChip({
  variant,
  active,
  chosen,
  onClick,
}: {
  variant: VariantMeta;
  active: boolean;
  chosen: boolean;
  onClick: () => void;
}) {
  return (
    <button
      aria-pressed={active}
      className={cn(
        "group flex min-w-[11rem] flex-1 items-start justify-between gap-3 rounded-[24px] border px-4 py-3 text-left transition duration-300 ease-[var(--ease-out-expo)]",
        active || chosen
          ? "border-[color:var(--accent)] bg-[color:var(--accent-subtle)] text-[color:var(--text)]"
          : "border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.025)] text-[color:var(--text-muted)] hover:border-[color:var(--accent)] hover:text-[color:var(--text)]",
      )}
      onClick={onClick}
      type="button"
    >
      <div className="space-y-1">
        <div className="t-label">{variant.label}</div>
        <div className="t-ui max-w-[18ch] text-[color:var(--text-subtle)]">{variant.bestFor}</div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {chosen ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.03)] px-2.5 py-1 t-label text-[color:var(--text)]">
            <StarIcon className="h-3.5 w-3.5" />
            Chosen
          </span>
        ) : null}
        <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      </div>
    </button>
  );
}

function VariantWindow({
  variant,
  fullScreen = false,
  chosen = false,
  onChoose,
  onOpen,
  children,
}: {
  variant: VariantMeta;
  fullScreen?: boolean;
  chosen?: boolean;
  onChoose: () => void;
  onOpen: () => void;
  children: React.ReactNode;
}) {
  return (
    <GlassPanel
      className={cn(
        "h-[min(82svh,60rem)] min-h-0 overflow-hidden rounded-[34px] border border-[color:var(--glass-border)] bg-[color:var(--bg-soft)]",
        fullScreen ? "h-full rounded-[38px] md:rounded-[40px]" : "",
      )}
      innerClassName="flex h-full min-h-0 flex-col"
    >
      <div className="flex items-start justify-between gap-4 border-b border-[color:var(--glass-border)] px-4 py-4 md:px-5">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="t-label text-[color:var(--text-muted)]">{variant.label}</div>
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-1 t-label",
                chosen
                  ? "border-[color:var(--accent)] bg-[color:var(--accent-subtle)] text-[color:var(--text)]"
                  : "border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.03)] text-[color:var(--text-muted)]",
              )}
            >
              {chosen ? "Chosen" : variant.bestFor}
            </span>
          </div>
          <p className="t-ui max-w-[30ch] text-[color:var(--text-subtle)]">{variant.summary}</p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
          <button
            className="ghost-button rounded-full px-4 py-2.5"
            onClick={onOpen}
            type="button"
          >
            <span className="t-label">{fullScreen ? "Exit full screen" : "Full screen"}</span>
          </button>
          <button className="btn-primary rounded-full px-4 py-2.5" onClick={onChoose} type="button">
            <span className="t-label">{chosen ? "Chosen" : "Choose this"}</span>
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto scrollbar-thin">{children}</div>
    </GlassPanel>
  );
}

function EmptyStateBlock({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-[28px] border border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.02)] px-5 py-5 md:px-6 md:py-6">
      <div className="t-label text-[color:var(--text-muted)]">{title}</div>
      <div className="mt-3 max-w-[28rem] font-display text-[1.4rem] font-semibold tracking-[-0.03em] text-[color:var(--text)] md:text-[1.8rem]">
        {body}
      </div>
    </div>
  );
}

function EditorialVariantContent({
  collectionTitle,
  collectionDescription,
  products,
  featuredProducts,
  heroProduct,
  collectionSizeLabel,
}: {
  collectionTitle: string;
  collectionDescription: string;
  products: ShopifyProduct[];
  featuredProducts: ShopifyProduct[];
  heroProduct: ShopifyProduct | null;
  collectionSizeLabel: string;
}) {
  const heroImage = heroProduct?.images[0] ?? null;
  const heroPrice = resolvePrice(heroProduct);
  const heroStatus = resolveAvailability(heroProduct);
  const storyRows = featuredProducts.slice(0, 3);

  return (
    <div className="space-y-4 p-4 md:p-5">
      <div className="grid gap-4 xl:grid-cols-[1.12fr_0.88fr]">
        <div className="relative min-h-[28rem] overflow-hidden rounded-[32px] border border-[color:var(--glass-border)] bg-[color:var(--bg-elevated)]">
          {heroImage ? (
            <Image
              alt={heroImage.altText ?? heroProduct?.title ?? "Featured Raptile Studio piece"}
              className="h-full w-full object-cover"
              fill
              priority={false}
              quality={88}
              sizes="(min-width: 1280px) 54vw, 100vw"
              src={shopifyImageUrl(heroImage.url, { width: 1400 })}
            />
          ) : (
            <div className="image-skeleton absolute inset-0" />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_18%,color-mix(in_oklch,var(--bg)_26%,transparent)_100%)]" />

          <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
            <div className="max-w-[30rem] rounded-[24px] border border-[color:var(--glass-border)] bg-[color:rgba(8,12,24,0.68)] p-4 backdrop-blur-md md:p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="t-label text-[color:var(--text-muted)]">Featured piece</div>
                <div className="t-ui text-[color:var(--text-subtle)]">{heroStatus}</div>
              </div>
              <div className="mt-3 font-display text-[clamp(1.9rem,4vw,3rem)] font-bold tracking-[-0.04em] text-[color:var(--text)]">
                {heroProduct?.title ?? collectionTitle}
              </div>
              <p className="editorial-copy mt-2 max-w-[30ch]">{summarizeText(heroProduct?.description || collectionDescription, 118)}</p>
              <div className="mt-4 flex items-center justify-between gap-4">
                <div className="t-price text-[color:var(--text)]">{heroPrice ?? "Collection preview"}</div>
                <Link
                  className="ghost-button rounded-full px-4 py-2.5"
                  href={heroProduct ? `/products/${heroProduct.handle}` : "/collection"}
                >
                  <span className="t-label">Open piece</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <GlassPanel className="rounded-[32px]" innerClassName="space-y-4 p-5 md:p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="t-label text-[color:var(--text-muted)]">Collection lead</div>
              <div className="t-ui text-[color:var(--text-subtle)]">{collectionSizeLabel}</div>
            </div>
            <div className="font-display text-[clamp(1.5rem,3vw,2.4rem)] font-bold tracking-[-0.03em] text-[color:var(--text)]">
              {collectionTitle}
            </div>
            <p className="editorial-copy max-w-[32ch]">{collectionDescription}</p>
          </GlassPanel>

          <GlassPanel className="rounded-[32px]" innerClassName="space-y-4 p-5 md:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: "Edition", value: collectionTitle },
                { label: "Pieces", value: collectionSizeLabel },
                { label: "Weight", value: "240gsm body" },
                { label: "Finish", value: "Double bio washed" },
              ].map((fact) => (
                <div key={fact.label} className="space-y-2">
                  <div className="t-label text-[color:var(--text-muted)]">{fact.label}</div>
                  <div className="font-display text-[1.2rem] font-semibold tracking-[-0.03em] text-[color:var(--text)]">
                    {fact.value}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {fabricSignals.map((signal) => (
                <span
                  key={signal}
                  className="inline-flex items-center rounded-full border border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.025)] px-4 py-2 t-ui text-[color:var(--text-muted)]"
                >
                  {signal}
                </span>
              ))}
            </div>
          </GlassPanel>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {storyRows.length > 0 ? (
          storyRows.map((product, index) => <ProductRailRow key={product.id} dense index={index} product={product} />)
        ) : (
          <EmptyStateBlock
            body="Add products to the selected Shopify collection to populate the editorial lane."
            title="Editorial lane"
          />
        )}
      </div>
    </div>
  );
}

function CommerceVariantContent({
  collectionTitle,
  collectionDescription,
  products,
  featuredProducts,
  heroProduct,
  collectionSizeLabel,
  availableCount,
}: {
  collectionTitle: string;
  collectionDescription: string;
  products: ShopifyProduct[];
  featuredProducts: ShopifyProduct[];
  heroProduct: ShopifyProduct | null;
  collectionSizeLabel: string;
  availableCount: number;
}) {
  const readyLabel = availableCount > 0 ? `${availableCount} ready now` : "Preview only";
  const priceFrom = resolvePrice(heroProduct) ?? "Shop price";
  const gridProducts = featuredProducts.slice(0, 4);

  return (
    <div className="space-y-4 p-4 md:p-5">
      <GlassPanel className="rounded-[32px]" innerClassName="space-y-4 p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="t-label text-[color:var(--text-muted)]">Commerce floor</div>
          <div className="t-ui text-[color:var(--text-subtle)]">{readyLabel}</div>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            "New in",
            "Heavyweight",
            "Fit guide",
            "Ready now",
            collectionSizeLabel,
          ].map((chip) => (
            <span
              key={chip}
              className="inline-flex items-center rounded-full border border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.025)] px-4 py-2 t-ui text-[color:var(--text-muted)]"
            >
              {chip}
            </span>
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-[0.88fr_1.12fr]">
          <div className="space-y-4">
            <div className="font-display text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-[-0.04em] text-[color:var(--text)]">
              {collectionTitle}
            </div>
            <p className="editorial-copy max-w-[30ch]">{collectionDescription}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { label: "From", value: priceFrom },
                { label: "Ready", value: readyLabel },
                { label: "Pieces", value: collectionSizeLabel },
                { label: "Ship", value: "From India" },
              ].map((fact) => (
                <div key={fact.label} className="rounded-[22px] border border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.02)] p-4">
                  <div className="t-label text-[color:var(--text-muted)]">{fact.label}</div>
                  <div className="mt-2 font-display text-[1.15rem] font-semibold tracking-[-0.03em] text-[color:var(--text)]">
                    {fact.value}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <Link className="btn-primary rounded-full px-4 py-2.5" href="/collection">
                <span className="t-label">Browse collection</span>
              </Link>
              <Link className="ghost-button rounded-full px-4 py-2.5" href="/size-guide">
                <span className="t-label">Size guide</span>
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {gridProducts.length > 0 ? (
              gridProducts.map((product, index) => <ProductTile key={product.id} index={index} product={product} />)
            ) : (
              <EmptyStateBlock
                body="Add products to populate the shopping grid and make this lane feel like a live storefront."
                title="Commerce lane"
              />
            )}
          </div>
        </div>
      </GlassPanel>

      <div className="grid gap-4 lg:grid-cols-[0.78fr_1.22fr]">
        <GlassPanel className="rounded-[30px]" innerClassName="space-y-4 p-5 md:p-6">
          <div className="t-label text-[color:var(--text-muted)]">Quick routes</div>
          <div className="grid gap-2">
            {[
              { href: "/about", label: "Brand story" },
              { href: "/shipping", label: "Shipping" },
              { href: "/returns", label: "Returns" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <Link
                key={link.href}
                className="group flex items-center justify-between rounded-[20px] border border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.025)] px-4 py-3 transition duration-200 hover:border-[color:var(--accent)] hover:bg-[color:rgba(255,255,255,0.045)]"
                href={link.href}
              >
                <span className="t-label text-[color:var(--text-muted)]">{link.label}</span>
                <ArrowRightIcon className="h-4 w-4 text-[color:var(--text-subtle)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[color:var(--text)]" />
              </Link>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="rounded-[30px]" innerClassName="space-y-4 p-5 md:p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="t-label text-[color:var(--text-muted)]">Why it works</div>
            <div className="t-ui text-[color:var(--text-subtle)]">{products.length} products</div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {fabricSignals.map((signal) => (
              <div
                key={signal}
                className="rounded-[22px] border border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.02)] p-4"
              >
                <div className="t-label text-[color:var(--text-muted)]">Detail</div>
                <div className="mt-2 font-display text-[1.05rem] font-semibold tracking-[-0.03em] text-[color:var(--text)]">
                  {signal}
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}

function ArchiveVariantContent({
  collectionTitle,
  collectionDescription,
  products,
  featuredProducts,
  heroProduct,
  collectionSizeLabel,
}: {
  collectionTitle: string;
  collectionDescription: string;
  products: ShopifyProduct[];
  featuredProducts: ShopifyProduct[];
  heroProduct: ShopifyProduct | null;
  collectionSizeLabel: string;
}) {
  const heroImage = heroProduct?.images[0] ?? null;
  const heroPrice = resolvePrice(heroProduct);
  const heroStatus = resolveAvailability(heroProduct);
  const leftBeats = storyBeats.slice(0, 4);
  const supportRows = featuredProducts.slice(0, 2);

  return (
    <div className="space-y-4 p-4 md:p-5">
      <GlassPanel className="rounded-[32px]" innerClassName="space-y-4 p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="t-label text-[color:var(--text-muted)]">Archive desk</div>
          <div className="t-ui text-[color:var(--text-subtle)]">{collectionSizeLabel}</div>
        </div>
        <div className="max-w-[18ch] font-display text-[clamp(2rem,4vw,3.4rem)] font-bold tracking-[-0.04em] text-[color:var(--text)]">
          The drop reads like a record.
        </div>
        <p className="editorial-copy max-w-[46ch]">
          {summarizeText(
            collectionDescription,
            162,
          )}
        </p>
        <div className="flex flex-wrap gap-2">
          <Link className="btn-primary rounded-full px-4 py-2.5" href="/collection">
            <span className="t-label">Shop the drop</span>
          </Link>
          <Link className="ghost-button rounded-full px-4 py-2.5" href="/about">
            <span className="t-label">Read the story</span>
          </Link>
        </div>
      </GlassPanel>

      <div className="grid gap-4 xl:grid-cols-[0.82fr_1.18fr]">
        <div className="space-y-4">
          {leftBeats.map((beat, index) => (
            <StoryCard key={beat.title} beat={beat} index={index} />
          ))}
          <GlassPanel className="rounded-[28px]" innerClassName="space-y-4 p-5 md:p-6">
            <div className="t-label text-[color:var(--text-muted)]">Fabric signals</div>
            <div className="flex flex-wrap gap-2">
              {fabricSignals.map((signal) => (
                <span
                  key={signal}
                  className="inline-flex items-center rounded-full border border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.025)] px-4 py-2 t-ui text-[color:var(--text-muted)]"
                >
                  {signal}
                </span>
              ))}
            </div>
          </GlassPanel>
        </div>

        <div className="space-y-4">
          <div className="relative min-h-[28rem] overflow-hidden rounded-[32px] border border-[color:var(--glass-border)] bg-[color:var(--bg-elevated)]">
            {heroImage ? (
              <Image
                alt={heroImage.altText ?? heroProduct?.title ?? "Featured Raptile Studio piece"}
                className="h-full w-full object-cover"
                fill
                quality={88}
                sizes="(min-width: 1280px) 46vw, 100vw"
                src={shopifyImageUrl(heroImage.url, { width: 1400 })}
              />
            ) : (
              <div className="image-skeleton absolute inset-0" />
            )}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_18%,color-mix(in_oklch,var(--bg)_28%,transparent)_100%)]" />

            <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
              <div className="max-w-[28rem] rounded-[24px] border border-[color:var(--glass-border)] bg-[color:rgba(8,12,24,0.68)] p-4 backdrop-blur-md">
                <div className="flex items-center justify-between gap-3">
                  <div className="t-label text-[color:var(--text-muted)]">Archive cover</div>
                  <div className="t-ui text-[color:var(--text-subtle)]">{heroStatus}</div>
                </div>
                <div className="mt-3 font-display text-[clamp(1.7rem,3.6vw,2.6rem)] font-bold tracking-[-0.04em] text-[color:var(--text)]">
                  {heroProduct?.title ?? collectionTitle}
                </div>
                <p className="editorial-copy mt-2 max-w-[30ch]">{summarizeText(heroProduct?.description || collectionDescription, 104)}</p>
                <div className="mt-4 flex items-center justify-between gap-4">
                  <div className="t-price text-[color:var(--text)]">{heroPrice ?? "Collection preview"}</div>
                  <Link
                    className="ghost-button rounded-full px-4 py-2.5"
                    href={heroProduct ? `/products/${heroProduct.handle}` : "/collection"}
                  >
                    <span className="t-label">Open piece</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            {supportRows.length > 0 ? (
              supportRows.map((product, index) => (
                <ProductRailRow key={product.id} index={index} product={product} dense />
              ))
            ) : (
              <EmptyStateBlock
                body="Add products to the selected Shopify collection to finish the archive lane."
                title="Archive lane"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ChooserBar({
  mode,
  selectedVariantId,
  focusedVariantId,
  onChooseVariant,
  onOpenFocusedVariant,
  onBackToCompare,
  onExitFocus,
  onFocusVariant,
  onChooseFocusedVariant,
  collectionSizeLabel,
  availableCount,
  fullScreen = false,
}: {
  mode: ViewMode;
  selectedVariantId: VariantId | null;
  focusedVariantId: VariantId | null;
  onChooseVariant: (variantId: VariantId) => void;
  onOpenFocusedVariant: (variantId: VariantId) => void;
  onBackToCompare: () => void;
  onExitFocus: () => void;
  onFocusVariant: (variantId: VariantId) => void;
  onChooseFocusedVariant: () => void;
  collectionSizeLabel: string;
  availableCount: number;
  fullScreen?: boolean;
}) {
  const selectedLabel = selectedVariantId ? VARIANTS.find((variant) => variant.id === selectedVariantId)?.label ?? "None" : "None selected";
  const focusLabel = focusedVariantId ? VARIANTS.find((variant) => variant.id === focusedVariantId)?.label ?? "None" : "None";

  return (
    <GlassPanel
      className={cn(
        "rounded-[34px]",
        mode === "compare" ? "sticky top-[calc(var(--header-height)+0.5rem)] z-30" : "",
        fullScreen ? "rounded-[30px] md:rounded-[34px]" : "",
      )}
      innerClassName="space-y-4 p-4 md:p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="t-label text-[color:var(--text-muted)]">Homepage chooser</div>
            <span className="inline-flex items-center rounded-full border border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.025)] px-3 py-1 t-label text-[color:var(--text-muted)]">
              {collectionSizeLabel}
            </span>
            <span className="inline-flex items-center rounded-full border border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.025)] px-3 py-1 t-label text-[color:var(--text-muted)]">
              {availableCount} ready
            </span>
          </div>

          <h1 className="t-hero max-w-[12ch] text-[color:var(--text)]">
            Three homepage directions. One collection.
          </h1>

          <p className="editorial-copy max-w-[48ch]">
            Compare the same Raptile drop in three clothing-first layouts, open one full screen, and choose the lane that should carry the storefront.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          {mode === "compare" ? (
            <>
              <button
                className="ghost-button rounded-full px-4 py-2.5 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={!selectedVariantId}
                onClick={() => {
                  if (selectedVariantId) {
                    onOpenFocusedVariant(selectedVariantId);
                  }
                }}
                type="button"
              >
                <span className="t-label">{selectedVariantId ? "Open chosen" : "Pick a lane"}</span>
              </button>
              <div className="inline-flex items-center rounded-full border border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.025)] px-4 py-2.5 t-label text-[color:var(--text-muted)]">
                Compare view
              </div>
            </>
          ) : (
            <>
              <button className="ghost-button rounded-full px-4 py-2.5" onClick={onBackToCompare} type="button">
                <span className="t-label">Back to compare</span>
              </button>
              <button className="btn-primary rounded-full px-4 py-2.5" onClick={onChooseFocusedVariant} type="button">
                <span className="t-label">Choose this</span>
              </button>
              <button className="ghost-button rounded-full px-3 py-2.5" onClick={onExitFocus} type="button" aria-label="Close full screen">
                <CloseIcon className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {VARIANTS.map((variant) => (
          <VariantChip
            key={variant.id}
            active={mode === "focus" ? focusedVariantId === variant.id : selectedVariantId === variant.id}
            chosen={selectedVariantId === variant.id}
            onClick={() => {
              if (mode === "focus") {
                onFocusVariant(variant.id);
                return;
              }

              onChooseVariant(variant.id);
            }}
            variant={variant}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[color:var(--glass-border)] pt-3">
        <div className="t-ui text-[color:var(--text-muted)]">
          Selected: {selectedLabel}
          {mode === "focus" ? ` / Focus: ${focusLabel}` : ""}
        </div>
        <div className="t-ui text-[color:var(--text-subtle)]">Press 1, 2, or 3 to choose. Escape exits full screen.</div>
      </div>
    </GlassPanel>
  );
}

function CompareGrid({
  variants,
  mode,
  selectedVariantId,
  focusedVariantId,
  onChooseVariant,
  onOpenFocusedVariant,
  onFocusVariant,
  onChooseFocusedVariant,
  collectionTitle,
  collectionDescription,
  products,
  featuredProducts,
  heroProducts,
  collectionSizeLabel,
  availableCount,
  reducedMotion,
}: {
  variants: VariantMeta[];
  mode: ViewMode;
  selectedVariantId: VariantId | null;
  focusedVariantId: VariantId | null;
  onChooseVariant: (variantId: VariantId) => void;
  onOpenFocusedVariant: (variantId: VariantId) => void;
  onFocusVariant: (variantId: VariantId) => void;
  onChooseFocusedVariant: () => void;
  collectionTitle: string;
  collectionDescription: string;
  products: ShopifyProduct[];
  featuredProducts: ShopifyProduct[];
  heroProducts: Record<VariantId, ShopifyProduct | null>;
  collectionSizeLabel: string;
  availableCount: number;
  reducedMotion: boolean;
}) {
  return (
    <div className="space-y-4">
      <ChooserBar
        mode={mode}
        selectedVariantId={selectedVariantId}
        focusedVariantId={focusedVariantId}
        onChooseVariant={onChooseVariant}
        onOpenFocusedVariant={onOpenFocusedVariant}
        onBackToCompare={() => undefined}
        onExitFocus={() => undefined}
        onFocusVariant={onFocusVariant}
        onChooseFocusedVariant={onChooseFocusedVariant}
        collectionSizeLabel={collectionSizeLabel}
        availableCount={availableCount}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {variants.map((variant, index) => {
          const heroProduct = heroProducts[variant.id];
          const isChosen = selectedVariantId === variant.id;

          return (
            <motion.div
              key={variant.id}
              initial={{ opacity: 0, y: reducedMotion ? 0 : 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reducedMotion ? 0.01 : 0.45, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              <VariantWindow
                chosen={isChosen}
                fullScreen={false}
                onChoose={() => onChooseVariant(variant.id)}
                onOpen={() => onOpenFocusedVariant(variant.id)}
                variant={variant}
              >
                {variant.id === "editorial" ? (
                  <EditorialVariantContent
                    collectionDescription={collectionDescription}
                    collectionSizeLabel={collectionSizeLabel}
                    collectionTitle={collectionTitle}
                    featuredProducts={featuredProducts}
                    heroProduct={heroProduct}
                    products={products}
                  />
                ) : null}
                {variant.id === "commerce" ? (
                  <CommerceVariantContent
                    availableCount={availableCount}
                    collectionDescription={collectionDescription}
                    collectionSizeLabel={collectionSizeLabel}
                    collectionTitle={collectionTitle}
                    featuredProducts={featuredProducts}
                    heroProduct={heroProduct}
                    products={products}
                  />
                ) : null}
                {variant.id === "archive" ? (
                  <ArchiveVariantContent
                    collectionDescription={collectionDescription}
                    collectionSizeLabel={collectionSizeLabel}
                    collectionTitle={collectionTitle}
                    featuredProducts={featuredProducts}
                    heroProduct={heroProduct}
                    products={products}
                  />
                ) : null}
              </VariantWindow>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function FocusModeOverlay({
  focusedVariantId,
  selectedVariantId,
  variants,
  onChooseVariant,
  onFocusVariant,
  onBackToCompare,
  onExitFocus,
  onChooseFocusedVariant,
  collectionTitle,
  collectionDescription,
  products,
  featuredProducts,
  heroProducts,
  collectionSizeLabel,
  availableCount,
  reducedMotion,
}: {
  focusedVariantId: VariantId;
  selectedVariantId: VariantId | null;
  variants: VariantMeta[];
  onChooseVariant: (variantId: VariantId) => void;
  onFocusVariant: (variantId: VariantId) => void;
  onBackToCompare: () => void;
  onExitFocus: () => void;
  onChooseFocusedVariant: () => void;
  collectionTitle: string;
  collectionDescription: string;
  products: ShopifyProduct[];
  featuredProducts: ShopifyProduct[];
  heroProducts: Record<VariantId, ShopifyProduct | null>;
  collectionSizeLabel: string;
  availableCount: number;
  reducedMotion: boolean;
}) {
  const variant = variants.find((item) => item.id === focusedVariantId) ?? variants[0];
  const heroProduct = heroProducts[variant.id];

  return (
    <motion.div
      aria-modal="true"
      className="fixed inset-0 z-[140] bg-[color:color-mix(in_oklch,var(--bg)_82%,transparent)] px-4 py-4 backdrop-blur-[24px] md:px-6 md:py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reducedMotion ? 0.01 : 0.22, ease: [0.16, 1, 0.3, 1] }}
      role="dialog"
    >
      <div className="flex h-full min-h-0 flex-col gap-4">
      <ChooserBar
        fullScreen
        mode="focus"
        selectedVariantId={selectedVariantId}
        focusedVariantId={focusedVariantId}
        onChooseVariant={onChooseVariant}
          onOpenFocusedVariant={() => undefined}
          onBackToCompare={onBackToCompare}
          onExitFocus={onExitFocus}
          onFocusVariant={onFocusVariant}
          onChooseFocusedVariant={onChooseFocusedVariant}
          collectionSizeLabel={collectionSizeLabel}
          availableCount={availableCount}
        />

        <div className="min-h-0 flex-1">
          <VariantWindow
            chosen={selectedVariantId === variant.id}
            fullScreen
            onChoose={onChooseFocusedVariant}
            onOpen={onExitFocus}
            variant={variant}
          >
            {variant.id === "editorial" ? (
              <EditorialVariantContent
                collectionDescription={collectionDescription}
                collectionSizeLabel={collectionSizeLabel}
                collectionTitle={collectionTitle}
                featuredProducts={featuredProducts}
                heroProduct={heroProduct}
                products={products}
              />
            ) : null}
            {variant.id === "commerce" ? (
              <CommerceVariantContent
                availableCount={availableCount}
                collectionDescription={collectionDescription}
                collectionSizeLabel={collectionSizeLabel}
                collectionTitle={collectionTitle}
                featuredProducts={featuredProducts}
                heroProduct={heroProduct}
                products={products}
              />
            ) : null}
            {variant.id === "archive" ? (
              <ArchiveVariantContent
                collectionDescription={collectionDescription}
                collectionSizeLabel={collectionSizeLabel}
                collectionTitle={collectionTitle}
                featuredProducts={featuredProducts}
                heroProduct={heroProduct}
                products={products}
              />
            ) : null}
          </VariantWindow>
        </div>
      </div>
    </motion.div>
  );
}

export function HomePageChooser({ collectionTitle, collectionDescription, products }: HomePageChooserProps) {
  const reducedMotion = useReducedMotion();
  const [mode, setMode] = useState<ViewMode>("compare");
  const [selectedVariantId, setSelectedVariantId] = useState<VariantId | null>(null);
  const [focusedVariantId, setFocusedVariantId] = useState<VariantId>("editorial");

  const featuredProducts = useMemo(() => products.slice(0, 4), [products]);
  const collectionSizeLabel = useMemo(() => formatCount(products.length), [products.length]);
  const availableCount = useMemo(() => products.filter((product) => product.availableForSale).length, [products]);
  const fallbackSummary = "A sharp edit of heavyweight tees and essentials, built for heat, motion, and repeat wear.";
  const heroProducts = useMemo(
    () => ({
      editorial: resolveProduct(featuredProducts, 0),
      commerce: resolveProduct(featuredProducts, 1),
      archive: resolveProduct(featuredProducts, 2),
    }),
    [featuredProducts],
  );

  useEffect(() => {
    if (mode !== "focus") {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [mode]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) {
        return;
      }

      if (event.key === "Escape" && mode === "focus") {
        event.preventDefault();
        setMode("compare");
        return;
      }

      const digit = Number(event.key);
      if (Number.isInteger(digit) && digit >= 1 && digit <= VARIANTS.length) {
        const variant = VARIANTS[digit - 1];

        if (!variant) {
          return;
        }

        setSelectedVariantId(variant.id);

        if (mode === "focus") {
          setFocusedVariantId(variant.id);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mode]);

  const openFocusedVariant = (variantId: VariantId) => {
    setSelectedVariantId(variantId);
    setFocusedVariantId(variantId);
    setMode("focus");
  };

  const chooseVariant = (variantId: VariantId) => {
    setSelectedVariantId(variantId);
  };

  const activeSummary = selectedVariantId
    ? VARIANTS.find((variant) => variant.id === selectedVariantId)?.label ?? "None selected"
    : "None selected";

  return (
    <LazyMotion features={domAnimation}>
      <div className="mx-auto w-full max-w-[1600px] py-4 md:py-6">
        {mode === "compare" ? (
          <CompareGrid
            availableCount={availableCount}
            collectionDescription={collectionDescription || fallbackSummary}
            collectionSizeLabel={collectionSizeLabel}
            collectionTitle={collectionTitle}
            featuredProducts={featuredProducts}
            heroProducts={heroProducts}
            mode={mode}
            onChooseVariant={chooseVariant}
            onChooseFocusedVariant={() => {
              if (selectedVariantId) {
                openFocusedVariant(selectedVariantId);
              }
            }}
            onFocusVariant={(variantId) => {
              setFocusedVariantId(variantId);
              setSelectedVariantId(variantId);
            }}
            onOpenFocusedVariant={openFocusedVariant}
            products={products}
            reducedMotion={Boolean(reducedMotion)}
            selectedVariantId={selectedVariantId}
            variants={VARIANTS}
            focusedVariantId={focusedVariantId}
          />
        ) : null}

        <AnimatePresence initial={false} mode="wait">
          {mode === "focus" ? (
            <FocusModeOverlay
              availableCount={availableCount}
              collectionDescription={collectionDescription || fallbackSummary}
              collectionSizeLabel={collectionSizeLabel}
              collectionTitle={collectionTitle}
              featuredProducts={featuredProducts}
              focusedVariantId={focusedVariantId}
              heroProducts={heroProducts}
              onBackToCompare={() => setMode("compare")}
              onChooseFocusedVariant={() => setSelectedVariantId(focusedVariantId)}
              onChooseVariant={chooseVariant}
              onExitFocus={() => setMode("compare")}
              onFocusVariant={(variantId) => setFocusedVariantId(variantId)}
              products={products}
              reducedMotion={Boolean(reducedMotion)}
              selectedVariantId={selectedVariantId}
              variants={VARIANTS}
            />
          ) : null}
        </AnimatePresence>

        {mode === "compare" ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-1">
            <div className="t-ui text-[color:var(--text-muted)]">
              Selected: {activeSummary}
            </div>
            <div className="t-ui text-[color:var(--text-subtle)]">Press 1, 2, or 3 to choose. Escape only matters in full screen.</div>
          </div>
        ) : null}
      </div>
    </LazyMotion>
  );
}
