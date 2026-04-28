import { Suspense } from "react";
import Link from "next/link";

import { CollectionHeader } from "@/components/shop/CollectionHeader";
import { ProductGridServer } from "@/components/shop/ProductGridServer";
import { ProductGridSkeleton } from "@/components/shop/ProductGridSkeleton";

export default function HomePage() {
  return (
    <>
      <CollectionHeader />
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductGridServer />
      </Suspense>
      <section className="border-t border-[color:var(--glass-border)] py-12 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
          <div className="space-y-3">
            <div className="t-label text-[color:var(--text-muted)]">From the studio</div>
            <div className="t-display max-w-[12ch] text-[color:var(--text)]">
              Heavyweight essentials, released in short runs.
            </div>
          </div>
          <div className="space-y-4">
            <p className="editorial-copy max-w-none">
              Raptile Studio focuses on fewer shapes, denser fabric, and a graphic language that stays measured even when the print does the talking.
            </p>
            <div className="flex flex-wrap gap-5">
              <Link
                className="t-label text-[color:var(--text)] transition-colors duration-200 hover:text-[color:var(--accent)]"
                href="/about"
              >
                About the studio
              </Link>
              <Link
                className="t-label text-[color:var(--text-muted)] transition-colors duration-200 hover:text-[color:var(--text)]"
                href="/shipping"
              >
                Shipping and returns
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
