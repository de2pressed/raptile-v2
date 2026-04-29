import type { Metadata } from "next";

import { LiquidBackgroundMount } from "@/components/background/ShaderBackgroundMount";
import { AppProviders } from "@/components/providers/AppProviders";
import PageTransition from "@/components/ui/PageTransition";
import { getShopifyRuntimeConfig } from "@/lib/shopify-config.server";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Raptile Studio",
    template: "%s | Raptile Studio",
  },
  description: "Raptile Studio is a headless Shopify storefront for the Onyx collection and heavyweight essentials.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const shopifyConfig = getShopifyRuntimeConfig();

  return (
    <html lang="en">
      <body>
        <LiquidBackgroundMount />
        <AppProviders shopifyConfig={shopifyConfig}>
          <PageTransition>{children}</PageTransition>
        </AppProviders>
      </body>
    </html>
  );
}
