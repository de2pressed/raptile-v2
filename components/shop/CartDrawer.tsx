"use client";

import { useCart } from "@shopify/hydrogen-react";
import { AnimatePresence, LazyMotion, domAnimation } from "framer-motion";
import * as motion from "framer-motion/client";

import { GlassPanel } from "@/components/ui/GlassPanel";
import { useRaptileStore } from "@/lib/store";

export function CartDrawer() {
  const cart = useCart();
  const cartLines = useRaptileStore((state) => state.cartLines);
  const cartTotal = useRaptileStore((state) => state.cartTotal);
  const isCartOpen = useRaptileStore((state) => state.isCartOpen);
  const setCartOpen = useRaptileStore((state) => state.setCartOpen);

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {isCartOpen ? (
          <>
            <motion.button
              aria-label="Close cart"
              className="fixed inset-0 z-[135] bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 right-0 z-[140] w-full max-w-[420px] p-3 md:p-4"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <GlassPanel className="glass-panel-heavy flex h-full flex-col rounded-[30px] px-5 py-5 md:px-6">
                <div className="flex items-center justify-between">
                  <div className="t-label">CART TERMINAL_</div>
                  <button className="t-label" onClick={() => setCartOpen(false)} type="button">
                    [× CLOSE]
                  </button>
                </div>
                <div className="terminal-rule mt-3">────────────────────────────────</div>
                <div className="scrollbar-thin mt-5 flex-1 overflow-y-auto pr-1">
                  {cartLines.length === 0 ? (
                    <div className="t-ui py-8 text-[color:var(--text-muted)]">
                      <div>&gt; NO ITEMS ACQUIRED_</div>
                      <div className="animate-blink">_</div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {cartLines.map((line) => (
                        <div
                          key={line.id}
                          className="glass-panel rounded-[22px] px-4 py-4 before:rounded-[22px]"
                        >
                          <div className="relative z-[1]">
                            <div className="t-ui flex items-start justify-between gap-4">
                              <div className="min-w-0">
                                <div>{`QTY:${String(line.quantity).padStart(2, "0")}  ${line.title}`}</div>
                                <div className="mt-1 text-[color:var(--text-muted)]">{line.variantTitle}</div>
                              </div>
                              <div className="shrink-0">{line.price}</div>
                            </div>
                            <div className="t-ui mt-4 flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <button
                                  onClick={() => {
                                    if (line.quantity <= 1) {
                                      cart.linesRemove([line.id]);
                                      return;
                                    }

                                    cart.linesUpdate([{ id: line.id, quantity: line.quantity - 1 }]);
                                  }}
                                  type="button"
                                >
                                  [−]
                                </button>
                                <button
                                  onClick={() => cart.linesUpdate([{ id: line.id, quantity: line.quantity + 1 }])}
                                  type="button"
                                >
                                  [+]
                                </button>
                              </div>
                              <button onClick={() => cart.linesRemove([line.id])} type="button">
                                [REMOVE]
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="terminal-rule mt-4">────────────────────────────────</div>
                <div className="t-ui mt-4 flex items-center justify-between">
                  <span>TOTAL:</span>
                  <span>{cartTotal}</span>
                </div>
                <div className="terminal-rule mt-4">────────────────────────────────</div>
                <button
                  className="mt-5 rounded-full bg-[color:var(--accent)] px-5 py-4 text-center font-display text-base font-bold text-[#140c09] transition duration-200 hover:bg-[color:var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={!cart.checkoutUrl || cartLines.length === 0}
                  onClick={() => {
                    if (cart.checkoutUrl) {
                      window.location.href = cart.checkoutUrl;
                    }
                  }}
                  type="button"
                >
                  EXECUTE ORDER
                </button>
              </GlassPanel>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </LazyMotion>
  );
}
