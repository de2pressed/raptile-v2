import { getFeaturedCollection } from "@/lib/collection";

export async function CollectionHeader() {
  const collection = await getFeaturedCollection();
  const productCount = collection?.products.length ?? 0;

  return (
    <section className="pb-8 pt-16 md:pt-24">
      <div className="border-b border-[color:var(--glass-border)] pb-8">
        <div
          className="font-display font-extrabold uppercase tracking-[-0.06em] text-[color:var(--text)]"
          style={{ fontSize: "clamp(3rem, 8vw, 6rem)", lineHeight: 0.92 }}
        >
          Raptile Studio
        </div>
        <div className="t-ui mt-4 text-[color:var(--text-muted)]">{`Collection, ${productCount} pieces`}</div>
      </div>
    </section>
  );
}
