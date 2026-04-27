"use client";

import { CartProvider, ShopifyProvider, useCart } from "@shopify/hydrogen-react";
import Lenis from "@studio-freight/lenis";
import dynamic from "next/dynamic";
import type { PropsWithChildren } from "react";
import { useEffect, useRef } from "react";
import { useAnimationFrame } from "framer-motion";

import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { GhostUI } from "@/components/ui/GhostUI";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";
import { PageTransition } from "@/components/ui/PageTransition";
import { formatPrice } from "@/lib/commerce";
import {
  IS_SHOPIFY_PUBLIC_READY,
  PUBLIC_SHOPIFY_DOMAIN,
  PUBLIC_SHOPIFY_TOKEN,
  STOREFRONT_API_VERSION,
} from "@/lib/public-config";
import { useRaptileStore } from "@/lib/store";

const TunnelCanvas = dynamic(
  () => import("@/components/tunnel/TunnelCanvas").then((module) => module.TunnelCanvas),
  { ssr: false },
);

function RuntimeBridge() {
  const lenisRef = useRef<Lenis | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const setScrollVelocity = useRaptileStore((state) => state.setScrollVelocity);
  const setMousePosition = useRaptileStore((state) => state.setMousePosition);
  const setScrollY = useRaptileStore((state) => state.setScrollY);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
    });

    lenisRef.current = lenis;
    setScrollY(window.scrollY);

    const onLenisScroll = ({ velocity }: { velocity: number }) => {
      setScrollVelocity(velocity);
      setScrollY(window.scrollY);
    };
    const onPointerMove = (event: MouseEvent) => {
      pointerRef.current = { x: event.clientX, y: event.clientY };
    };

    lenis.on("scroll", onLenisScroll);
    window.addEventListener("mousemove", onPointerMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onPointerMove);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [setScrollVelocity, setScrollY]);

  useAnimationFrame((time) => {
    lenisRef.current?.raf(time);
    setMousePosition(pointerRef.current.x, pointerRef.current.y);
    setScrollY(window.scrollY);
  });

  return null;
}

function CartBridge() {
  const cart = useCart();
  const setCartData = useRaptileStore((state) => state.setCartData);

  useEffect(() => {
    const lines =
      cart.lines?.flatMap((line) => {
        if (!line?.id) {
          return [];
        }

        const variant = line.merchandise;
        const selectedOptions =
          variant?.selectedOptions
            ?.flatMap((option) => (option?.value ? [option.value] : []))
            .filter(Boolean)
            .join(" / ") ?? "DEFAULT";
        const title = variant?.product?.handle?.toUpperCase() ?? variant?.product?.title?.toUpperCase() ?? "RAPTILE";

        return [
          {
            id: line.id,
            quantity: line.quantity ?? 1,
            title,
            variantTitle: selectedOptions,
            merchandiseId: variant?.id ?? "",
            price: formatPrice(line.cost?.totalAmount?.amount ?? 0),
            imageUrl: variant?.image?.url,
            imageAlt: variant?.image?.altText,
          },
        ];
      }) ?? [];

    setCartData({
      cartId: cart.id ?? null,
      cartLines: lines,
      cartTotal: formatPrice(cart.cost?.totalAmount?.amount ?? 0),
    });
  }, [cart.cost?.totalAmount?.amount, cart.id, cart.lines, setCartData]);

  return null;
}

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ShopifyProvider
      countryIsoCode="IN"
      languageIsoCode="EN"
      storeDomain={PUBLIC_SHOPIFY_DOMAIN || "placeholder.myshopify.com"}
      storefrontApiVersion={STOREFRONT_API_VERSION}
      storefrontToken={PUBLIC_SHOPIFY_TOKEN || "placeholder"}
    >
      <CartProvider countryCode="IN" languageCode="EN">
        <RuntimeBridge />
        <CartBridge />
        <TunnelCanvas />
        <NoiseOverlay />
        <GhostUI />
        <div className="relative z-10 min-h-screen">
          <Nav />
          <PageTransition>
            <main className="min-h-[calc(100vh-5rem)] px-4 md:px-6">{children}</main>
          </PageTransition>
          <Footer />
        </div>
        <CartDrawer />
        {!IS_SHOPIFY_PUBLIC_READY ? (
          <div className="pointer-events-none fixed bottom-6 left-1/2 z-[120] -translate-x-1/2 px-4">
            <div className="glass-panel rounded-full px-4 py-2 before:rounded-full">
              <div className="t-ui relative z-[1] text-[color:var(--text-muted)]">
                Storefront offline. Add Shopify env vars to activate commerce.
              </div>
            </div>
          </div>
        ) : null}
      </CartProvider>
    </ShopifyProvider>
  );
}
