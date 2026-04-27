import { ProductGrid } from "@/components/shop/ProductGrid";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { getCollection, isShopifyConfigured } from "@/lib/shopify";
import { SHOPIFY_COLLECTION_HANDLE } from "@/lib/storefront-config";

export default async function HomePage() {
  const collection = await getCollection(SHOPIFY_COLLECTION_HANDLE);
  const configured = isShopifyConfigured();

  return (
    <div className="mx-auto max-w-[1440px] pb-16 pt-3 md:pb-20 md:pt-4">
      <section className="grid gap-4 md:grid-cols-[1.15fr_0.85fr] md:items-end">
        <GlassPanel className="rounded-[36px] px-6 py-7 md:px-8 md:py-9">
          <div className="t-label text-[color:var(--accent-strong)]">HEADLESS COLLECTION PROTOCOL</div>
          <h1 className="t-hero mt-4 max-w-[10ch]">Raptile Studio</h1>
          <p className="mt-5 max-w-[40rem] text-sm leading-7 text-[color:var(--text-muted)] md:text-base">
            Spatial retail architecture with vaulted archives, terminal feedback, and a glassmorphic control
            layer calibrated for material-driven drops.
          </p>
        </GlassPanel>
        <GlassPanel className="rounded-[36px] px-6 py-6 md:px-8">
          <div className="t-label text-[color:var(--text-muted)]">ACTIVE COLLECTION</div>
          <div className="mt-3 font-display text-3xl font-bold tracking-[-0.04em] md:text-4xl">
            {collection?.title ?? "Awaiting Shopify Sync"}
          </div>
          <div className="t-ui mt-4 leading-7 text-[color:var(--text-muted)]">
            {collection?.description ||
              (configured
                ? `Set SHOPIFY_COLLECTION_HANDLE to a real collection handle. Current handle: ${SHOPIFY_COLLECTION_HANDLE}.`
                : "Configure the Shopify domain and storefront token to stream live garments into the grid.")}
          </div>
        </GlassPanel>
      </section>

      <section className="mt-8 md:mt-10">
        <ProductGrid products={collection?.products ?? []} />
      </section>
    </div>
  );
}
