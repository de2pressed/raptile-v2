import Link from "next/link";

import { getFeaturedCollection } from "@/lib/collection";

export async function CollectionHeader() {
  const collection = await getFeaturedCollection();
  const productCount = collection?.products.length ?? 0;

  return (
    <section className="pb-10 pt-16 md:pt-24">
      <div className="grid gap-8 border-b border-[color:var(--glass-border)] pb-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] lg:items-end">
        <div className="space-y-4">
          <div
            className="font-display font-extrabold uppercase tracking-[-0.06em] text-[color:var(--text)]"
            style={{ fontSize: "clamp(3rem, 8vw, 6rem)", lineHeight: 0.92 }}
          >
            Raptile Studio
          </div>
          <div className="t-ui text-[color:var(--text-muted)]">{`Collection, ${productCount} pieces`}</div>
        </div>
        <div className="space-y-4 lg:justify-self-end">
          <p className="editorial-copy">
            Heavyweight tees, small runs, and a slower approach to graphics-led essentials built to hold shape over time.
          </p>
          <div className="flex flex-wrap gap-5">
            <Link
              className="t-label text-[color:var(--text)] transition-colors duration-200 hover:text-[color:var(--accent)]"
              href="/about"
            >
              About Us
            </Link>
            <Link
              className="t-label text-[color:var(--text-muted)] transition-colors duration-200 hover:text-[color:var(--text)]"
              href="/contact"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
