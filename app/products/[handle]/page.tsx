import { notFound } from "next/navigation";

import { ProductDetailClient } from "@/components/shop/ProductDetailClient";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { getCollection, getProduct, isShopifyConfigured } from "@/lib/shopify";

interface ProductPageProps {
  params: Promise<{ handle: string }>;
}

export async function generateStaticParams() {
  const collection = await getCollection("all");

  return (collection?.products ?? []).map((product) => ({ handle: product.handle }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;
  const product = await getProduct(handle);
  const configured = isShopifyConfigured();

  if (!configured) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-[920px] items-center py-12">
        <GlassPanel className="rounded-[36px] px-6 py-8 md:px-8 md:py-10">
          <div className="t-label text-[color:var(--accent-strong)]">STOREFRONT OFFLINE</div>
          <div className="mt-4 font-display text-4xl font-bold tracking-[-0.04em]">
            Shopify credentials are required to render the material inspector.
          </div>
        </GlassPanel>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
