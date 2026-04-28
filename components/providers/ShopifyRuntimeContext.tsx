"use client";

import { createContext, useContext } from "react";
import type { PropsWithChildren } from "react";

import { DEFAULT_SHOPIFY_RUNTIME_CONFIG, type ShopifyRuntimeConfig } from "@/lib/shopify-config";

const ShopifyRuntimeContext = createContext<ShopifyRuntimeConfig>(DEFAULT_SHOPIFY_RUNTIME_CONFIG);

export function ShopifyRuntimeProvider({
  children,
  value,
}: PropsWithChildren<{
  value: ShopifyRuntimeConfig;
}>) {
  return <ShopifyRuntimeContext.Provider value={value}>{children}</ShopifyRuntimeContext.Provider>;
}

export function useShopifyRuntime() {
  return useContext(ShopifyRuntimeContext);
}
