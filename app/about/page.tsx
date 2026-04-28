import Image from "next/image";
import Link from "next/link";

import { getFeaturedCollection } from "@/lib/collection";
import { shopifyImageUrl } from "@/lib/utils/shopifyImage";

export default async function AboutPage() {
  const collection = await getFeaturedCollection();
  const heroImage = collection?.products[0]?.images[1] ?? collection?.products[0]?.images[0] ?? null;

  return (
    <div className="mx-auto w-full max-w-[1280px] py-10 md:py-16">
      <section className="grid gap-8 border-b border-[color:var(--glass-border)] pb-10 md:pb-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,360px)] lg:items-end">
        <div className="space-y-4">
          <div className="t-label text-[color:var(--text-muted)]">About Raptile Studio</div>
          <h1 className="t-hero max-w-[10ch] text-[color:var(--text)]">
            Built to wear hard, designed to stay quiet.
          </h1>
        </div>
        <p className="editorial-copy">
          Raptile Studio is a small label from India focused on heavyweight everyday shapes, restrained graphics, and slower release cycles that keep the product ahead of the storefront.
        </p>
      </section>

      <section className="grid gap-8 py-10 md:py-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-3">
            <div className="t-label text-[color:var(--text-muted)]">What we make</div>
            <p className="editorial-copy max-w-none">
              Oversized essentials cut for repeat wear, denser fabric weights, and graphics that add presence without turning the garment into noise.
            </p>
          </div>
          <div className="space-y-3">
            <div className="t-label text-[color:var(--text-muted)]">How we release</div>
            <p className="editorial-copy max-w-none">
              We keep the catalog concise, refine fewer pieces at a time, and let each run feel considered instead of constantly replaced.
            </p>
          </div>
          <div className="space-y-3">
            <div className="t-label text-[color:var(--text-muted)]">Where we are based</div>
            <p className="editorial-copy max-w-none">
              The studio is based in India, with customer support, shipping policies, and storefront decisions kept direct and practical.
            </p>
          </div>
          <div className="space-y-3">
            <div className="t-label text-[color:var(--text-muted)]">What matters</div>
            <p className="editorial-copy max-w-none">
              Fit, weight, print restraint, and a browsing experience that frames the product cleanly instead of crowding it with effects.
            </p>
          </div>
        </div>

        {heroImage ? (
          <div className="overflow-hidden rounded-[32px] border border-[color:var(--glass-border)] bg-[color:var(--bg-elevated)]">
            <Image
              alt={heroImage.altText ?? "Raptile Studio product photograph"}
              className="h-full w-full object-cover"
              height={heroImage.height ?? 1200}
              sizes="(min-width: 1024px) 360px, 100vw"
              src={shopifyImageUrl(heroImage.url, { width: 960 })}
              width={heroImage.width ?? 1200}
            />
          </div>
        ) : null}
      </section>

      <section className="border-t border-[color:var(--glass-border)] pt-8">
        <div className="flex flex-wrap gap-5">
          <Link className="t-label text-[color:var(--text)] transition-colors duration-200 hover:text-[color:var(--accent)]" href="/">
            View collection
          </Link>
          <Link className="t-label text-[color:var(--text-muted)] transition-colors duration-200 hover:text-[color:var(--text)]" href="/contact">
            Contact the studio
          </Link>
        </div>
      </section>
    </div>
  );
}
