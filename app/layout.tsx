import type { Metadata } from "next";

import { AppProviders } from "@/components/providers/AppProviders";
import { ShaderBackgroundMount } from "@/components/background/ShaderBackgroundMount";
import PageTransition from "@/components/ui/PageTransition";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Raptile Studio",
    template: "%s | Raptile Studio",
  },
  description: "Raptile Studio is a headless Shopify storefront for the Onyx collection and heavyweight essentials.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ShaderBackgroundMount />
        <AppProviders>
          <PageTransition>{children}</PageTransition>
        </AppProviders>
      </body>
    </html>
  );
}
