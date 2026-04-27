"use client";

import { AnimatePresence, LazyMotion, domAnimation } from "framer-motion";
import * as motion from "framer-motion/client";

import type { ShopifyProduct } from "@/lib/commerce";
import { useRaptileStore } from "@/lib/store";
import { toTechnicalLabel } from "@/lib/utils";

interface SpecDrawerProps {
  product: ShopifyProduct;
}

export function SpecDrawer({ product }: SpecDrawerProps) {
  const isOpen = useRaptileStore((state) => state.isSpecDrawerOpen);
  const setSpecDrawerOpen = useRaptileStore((state) => state.setSpecDrawerOpen);
  const metafields = new Map(product.metafields.map((field) => [field.key, field.value]));
  const specs = [
    ["weight", metafields.get("weight")],
    ["cut", metafields.get("cut")],
    ["material", metafields.get("material")],
    ["fit", metafields.get("fit")],
    ["print", null],
    ["care", null],
  ] as const;
  const status = product.availableForSale
    ? `AVAILABLE / ${product.totalInventory ?? "LIMITED"} UNITS REMAINING`
    : "VAULTED / OUT OF INVENTORY";

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {isOpen ? (
          <>
            <motion.button
              aria-label="Close specifications"
              className="fixed inset-0 z-[145] bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSpecDrawerOpen(false)}
            />
            <motion.section
              className="fixed inset-x-0 bottom-0 z-[150] px-3 pb-3 md:px-6 md:pb-6"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 240 }}
            >
              <div className="glass-panel glass-panel-heavy mx-auto h-[75vh] w-full max-w-[1440px] rounded-[34px] px-5 py-5 md:h-[60vh] md:px-8 md:py-8">
                <div className="relative z-[1] flex h-full flex-col">
                  <div className="flex items-center justify-between gap-4">
                    <div className="t-label">{`MATERIAL INSPECTOR — ${product.handle.toUpperCase()}`}</div>
                    <button className="t-label" onClick={() => setSpecDrawerOpen(false)} type="button">
                      [CLOSE]
                    </button>
                  </div>
                  <div className="terminal-rule mt-3">────────────────────────────────</div>
                  <div className="mt-6 flex-1 space-y-3 overflow-y-auto pr-1">
                    {specs.map(([key, value]) => (
                      <div key={key} className="t-ui">
                        {`> ${toTechnicalLabel(key).padEnd(14, ".")}${(value ?? "DATA UNAVAILABLE").toUpperCase()}`}
                      </div>
                    ))}
                  </div>
                  <div className="terminal-rule mt-4">────────────────────────────────</div>
                  <div className="t-ui mt-4">{`STATUS: ${status}`}</div>
                </div>
              </div>
            </motion.section>
          </>
        ) : null}
      </AnimatePresence>
    </LazyMotion>
  );
}
