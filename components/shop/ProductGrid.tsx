"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import * as motion from "framer-motion/client";
import { useEffect, useMemo, useState } from "react";

import { ProductCard } from "@/components/shop/ProductCard";
import { GlassPanel } from "@/components/ui/GlassPanel";
import type { ShopifyProduct } from "@/lib/commerce";

interface ProductGridProps {
  products: ShopifyProduct[];
}

type GridCell =
  | { type: "product"; product: ShopifyProduct; index: number }
  | { type: "void"; id: string };

const spans = [
  "lg:col-span-7 md:col-span-3",
  "lg:col-span-5 md:col-span-3",
  "lg:col-span-4 md:col-span-3",
  "lg:col-span-8 md:col-span-3",
  "lg:col-span-5 md:col-span-3",
  "lg:col-span-7 md:col-span-3",
];

function TelemetryCell() {
  const [coordinates, setCoordinates] = useState(["023.441", "-08.209", "114.330"]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCoordinates([
        (Math.random() * 70 - 35).toFixed(3).padStart(7, "0"),
        (Math.random() * 20 - 10).toFixed(3).padStart(7, "0"),
        (Math.random() * 160).toFixed(3).padStart(7, "0"),
      ]);
    }, 2200);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <GlassPanel className="tech-card hidden aspect-[4/5] rounded-[30px] md:flex md:items-end md:p-5">
      <div className="space-y-2">
        <div className="t-label text-[color:var(--text-muted)]">VOID // TUNNEL NODE</div>
        <div className="t-ui text-[color:var(--text-muted)]">X: {coordinates[0]}</div>
        <div className="t-ui text-[color:var(--text-muted)]">Y: {coordinates[1]}</div>
        <div className="t-ui text-[color:var(--text-muted)]">Z: {coordinates[2]}</div>
      </div>
    </GlassPanel>
  );
}

export function ProductGrid({ products }: ProductGridProps) {
  const cells = useMemo(() => {
    const result: GridCell[] = [];
    let cellCount = 0;

    products.forEach((product, index) => {
      result.push({ type: "product", product, index });
      cellCount += 1;

      if (cellCount % 4 === 0) {
        result.push({ type: "void", id: `void-${index}` });
        cellCount += 1;
      }
    });

    return result;
  }, [products]);

  if (products.length === 0) {
    return (
      <GlassPanel className="mx-auto max-w-3xl rounded-[34px] px-6 py-8 md:px-8 md:py-10">
        <div className="t-label text-[color:var(--accent-strong)]">STOREFRONT SIGNAL INCOMPLETE</div>
        <div className="mt-4 font-display text-3xl font-bold tracking-[-0.04em] md:text-4xl">
          Add Shopify credentials and assign products to the collection handle to populate the editorial grid.
        </div>
      </GlassPanel>
    );
  }

  return (
    <LazyMotion features={domAnimation}>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-6 md:gap-5 lg:grid-cols-12 lg:gap-6">
        {cells.map((cell, order) => {
          if (cell.type === "void") {
            return (
            <motion.div
              key={cell.id}
              className="hidden md:col-span-3 md:block lg:col-span-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: order * 0.06, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              >
                <TelemetryCell />
              </motion.div>
            );
          }

          return (
            <motion.div
              key={cell.product.id}
              className={`col-span-1 md:col-span-3 ${spans[cell.index % spans.length]}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: order * 0.06, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProductCard product={cell.product} />
            </motion.div>
          );
        })}
      </div>
    </LazyMotion>
  );
}
