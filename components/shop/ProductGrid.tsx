"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import * as motion from "framer-motion/client";

import { ProductCard } from "@/components/shop/ProductCard";
import type { ShopifyProduct } from "@/lib/commerce";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  products: ShopifyProduct[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="glass-panel rounded-[30px] px-6 py-8 md:px-8 md:py-10">
        <div className="t-label text-[color:var(--text-muted)]">Collection Ready</div>
        <div className="mt-4 max-w-[32rem] font-display text-3xl font-bold tracking-[-0.04em] text-[color:var(--text)] md:text-4xl">
          Add products to the selected Shopify collection to populate the editorial grid.
        </div>
      </div>
    );
  }

  return (
    <LazyMotion features={domAnimation}>
      <div className={cn("mobile-product-grid grid grid-cols-2 gap-x-3 gap-y-7 md:grid-cols-3 md:gap-x-5 md:gap-y-10 lg:grid-cols-4")}>
        {products.map((product, index) => {
          return (
            <motion.div
              key={product.id}
              className="min-w-0"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProductCard product={product} />
            </motion.div>
          );
        })}
      </div>
    </LazyMotion>
  );
}
