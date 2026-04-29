import { getFeaturedCollection } from "@/lib/collection";

export async function CollectionHeader() {
  const collection = await getFeaturedCollection();
  const productCount = collection?.products.length ?? 0;
  const rawTitle = collection?.title?.trim();
  const collectionTitle = rawTitle && rawTitle.toLowerCase() !== "home page" ? rawTitle : "Onyx Collection";

  return (
    <section className="pb-10 pt-16 md:pt-24">
      <div className="grid min-w-0 gap-8 border-b border-[color:var(--glass-border)] pb-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] lg:items-end">
        <div className="min-w-0 space-y-4">
          <div
            className="max-w-full whitespace-normal break-words font-display font-extrabold uppercase tracking-[-0.06em] text-[color:var(--text)]"
            style={{ fontSize: "clamp(2.35rem, 12vw, 6rem)", lineHeight: 0.92 }}
          >
            {collectionTitle}
          </div>
          <div className="t-ui text-[color:var(--text-muted)]">{`Collection, ${productCount} pieces`}</div>
        </div>
        <div className="min-w-0 max-w-full space-y-4 lg:justify-self-end">
          <p className="editorial-copy">
            Heavyweight tees, small runs, and a sharper edit of graphics-led essentials built to hold shape over time.
          </p>
          <div className="t-ui max-w-[34ch] leading-6 text-[color:var(--text-muted)]">
            The point is to keep the edit sharp and the read immediate.
          </div>
        </div>
      </div>
    </section>
  );
}
