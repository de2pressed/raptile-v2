"use client";

import { useCart } from "@shopify/hydrogen-react";
import Image from "next/image";
import Link from "next/link";

import { useShopifyRuntime } from "@/components/providers/ShopifyRuntimeContext";
import { formatPrice } from "@/lib/commerce";
import { useRaptileStore } from "@/lib/store";
import { shopifyImageUrl } from "@/lib/utils/shopifyImage";

const FREE_SHIPPING_THRESHOLD = 2999;

export function CartPageClient() {
  const { isConfigured } = useShopifyRuntime();

  if (!isConfigured) {
    return (
      <section className="flex min-h-[calc(100svh-var(--header-height))] items-center justify-center py-8">
        <div className="text-center">
          <div className="font-display text-3xl font-medium tracking-[-0.04em] text-[color:var(--text)] md:text-4xl">
            Storefront offline.
          </div>
          <div className="mt-4 max-w-[32rem] text-sm leading-7 text-[color:var(--text-muted)] md:text-base">
            Add the Shopify env vars to restore cart and checkout behavior.
          </div>
          <Link
            className="t-label mt-6 inline-flex items-center gap-2 text-[color:var(--text-muted)] transition-colors duration-200 hover:text-[color:var(--accent)]"
            href="/collection"
          >
            <span>Browse Collection</span>
            <span aria-hidden>{"->"}</span>
          </Link>
        </div>
      </section>
    );
  }

  return <CartPageClientConnected />;
}

function CartPageClientConnected() {
  const cart = useCart();
  const cartLines = useRaptileStore((state) => state.cartLines);
  const itemCount = cartLines.reduce((total, line) => total + line.quantity, 0);
  const subtotalAmount = Number(cart.cost?.subtotalAmount?.amount ?? 0);
  const totalAmount = Number(cart.cost?.totalAmount?.amount ?? 0);
  const qualifiesForFreeShipping = subtotalAmount >= FREE_SHIPPING_THRESHOLD;

  if (cartLines.length === 0) {
    return (
      <section className="flex min-h-[calc(100svh-var(--header-height))] items-center justify-center py-8">
        <div className="text-center">
          <div className="font-display text-3xl font-medium tracking-[-0.04em] text-[color:var(--text)] md:text-4xl">
            Your cart is empty.
          </div>
          <Link
            className="t-label mt-6 inline-flex items-center gap-2 text-[color:var(--text-muted)] transition-colors duration-200 hover:text-[color:var(--accent)]"
            href="/collection"
          >
            <span>Browse Collection</span>
            <span aria-hidden>{"->"}</span>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto flex min-h-[calc(100svh-var(--header-height))] w-full max-w-[1440px] items-start py-6 md:py-8">
      <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-display text-4xl font-bold tracking-[-0.04em] text-[color:var(--text)]">Cart</div>
            <div className="t-ui text-[color:var(--text-muted)]">{`${itemCount} items`}</div>
          </div>

          <div className="h-px w-full bg-[color:var(--glass-border)]" />

          <div className="grid gap-4">
            {cartLines.map((line) => (
              <article key={line.id} className="glass-panel cart-noise-panel rounded-[28px] p-4 md:p-6">
                <div className="relative z-[1] grid gap-4 md:grid-cols-[112px_minmax(0,1fr)] md:gap-6">
                  <div className="relative aspect-square w-[84px] overflow-hidden rounded-[18px] bg-[color:var(--bg-elevated)] md:w-[112px]">
                    {line.imageUrl ? (
                      <Image
                        alt={line.imageAlt ?? line.title}
                        className="h-full w-full object-cover"
                        fill
                        sizes="(max-width: 767px) 84px, 112px"
                        src={shopifyImageUrl(line.imageUrl, { width: 120, height: 150, crop: "center" })}
                      />
                    ) : null}
                  </div>

                  <div className="grid min-w-0 gap-3 pt-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <Link
                        className="t-product min-w-0 text-[color:var(--text)] transition-colors duration-200 hover:text-[color:var(--accent)]"
                        href={line.handle ? `/products/${line.handle}` : "/"}
                      >
                        {line.title}
                      </Link>
                      <div className="t-label text-[color:var(--text-muted)]">{line.variantTitle}</div>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div className="t-price text-[color:var(--text)]">{line.price}</div>
                      <div className="flex items-center gap-2">
                        <button
                          className="ghost-button flex h-9 w-9 items-center justify-center rounded-full"
                          onClick={() => {
                            if (line.quantity <= 1) {
                              cart.linesRemove([line.id]);
                              return;
                            }

                            cart.linesUpdate([{ id: line.id, quantity: line.quantity - 1 }]);
                          }}
                          type="button"
                        >
                          -
                        </button>
                        <div className="t-ui min-w-[2.5rem] text-center text-[color:var(--text)]">{line.quantity}</div>
                        <button
                          className="ghost-button flex h-9 w-9 items-center justify-center rounded-full"
                          onClick={() => cart.linesUpdate([{ id: line.id, quantity: line.quantity + 1 }])}
                          type="button"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      className="t-label justify-self-start text-[color:var(--text-muted)] transition-colors duration-200 hover:text-[color:var(--accent)]"
                      onClick={() => cart.linesRemove([line.id])}
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <Link
            className="t-label mt-2 inline-flex items-center gap-2 text-[color:var(--text-muted)] transition-colors duration-200 hover:text-[color:var(--accent)]"
            href="/collection"
          >
            <span>Continue Shopping</span>
            <span aria-hidden>{"->"}</span>
          </Link>
        </div>

        <aside className="glass-panel sticky-glass cart-noise-panel h-fit rounded-[28px] p-6 md:top-[80px] md:p-8">
          <div className="relative z-[1] grid gap-5">
            <div className="font-display text-2xl font-bold tracking-[-0.04em] text-[color:var(--text)]">Order Summary</div>
            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <div className="t-ui text-[color:var(--text-muted)]">Subtotal</div>
                <div className="t-price text-[color:var(--text)]">{formatPrice(subtotalAmount)}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="t-ui text-[color:var(--text-muted)]">Shipping</div>
                <div className="t-price text-[color:var(--text)]">{qualifiesForFreeShipping ? "Free" : "TBD"}</div>
              </div>
            </div>

            <div className="h-px w-full bg-[color:var(--glass-border)]" />

            <div className="flex items-center justify-between">
              <div className="t-ui text-[color:var(--text-muted)]">Total</div>
              <div className="t-price text-[color:var(--text)]">{formatPrice(totalAmount)}</div>
            </div>

            {qualifiesForFreeShipping ? (
              <div className="t-ui text-[color:var(--text-muted)]">{`Free shipping unlocked above ${formatPrice(FREE_SHIPPING_THRESHOLD)}.`}</div>
            ) : (
              <div className="t-ui text-[color:var(--text-muted)]">{`Free shipping on orders above ${formatPrice(FREE_SHIPPING_THRESHOLD)}.`}</div>
            )}

            <button
              className="btn-primary rounded-full px-5 py-4"
              disabled={!cart.checkoutUrl}
              onClick={() => {
                if (cart.checkoutUrl) {
                  window.location.href = cart.checkoutUrl;
                }
              }}
              type="button"
            >
              <span className="t-label text-[color:var(--bg)]">{"Checkout ->"}</span>
            </button>

            <div className="t-label text-[color:var(--text-muted)]">Secure checkout via Shopify</div>
          </div>
        </aside>
      </div>
    </section>
  );
}
