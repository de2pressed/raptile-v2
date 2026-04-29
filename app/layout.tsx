import type { Metadata } from "next";

import BackgroundStage from "@/components/BackgroundStage";
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
        <BackgroundStage />
        <AppProviders shopifyConfig={shopifyConfig}>
          <PageTransition>{children}</PageTransition>
        </AppProviders>
      </body>
    </html>
  );
}
