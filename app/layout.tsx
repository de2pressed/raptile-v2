import type { Metadata } from "next";

import { AppProviders } from "@/components/providers/AppProviders";
import { ShaderBackgroundMount } from "@/components/background/ShaderBackgroundMount";
import PageTransition from "@/components/ui/PageTransition";

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
        <AppProviders>
          <PageTransition>{children}</PageTransition>
        </AppProviders>
      {/* impeccable-live-start */}
<script src="http://localhost:8400/live.js"></script>
{/* impeccable-live-end */}
</body>
    </html>
  );
}
