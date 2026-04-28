import type { Metadata } from "next";

import { AppProviders } from "@/components/providers/AppProviders";
import { ShaderBackgroundMount } from "@/components/background/ShaderBackgroundMount";
import { RouteTransitionOverlay } from "@/components/ui/RouteTransition";

import "./globals.css";

export const metadata: Metadata = {
  title: "Raptile Studio",
  description: "High-fashion headless storefront with a living shader backdrop and material-led commerce.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ShaderBackgroundMount />
        <AppProviders>{children}</AppProviders>
        <RouteTransitionOverlay />
      </body>
    </html>
  );
}
