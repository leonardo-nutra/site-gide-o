"use client";

import { AnimatePresence, motion } from "motion/react";
import { ShoppingCart } from "lucide-react";
import { formatPrice, useCart } from "@/lib/cart-context";

export function CartBar() {
  const cart = useCart();
  const visible = cart.count > 0 && !cart.isOpen;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
          className="fixed inset-x-0 bottom-0 z-40 px-3 sm:px-5"
        >
          <button
            type="button"
            onClick={cart.openCart}
            className="mx-auto flex w-full max-w-xl items-center justify-between gap-3 rounded-2xl bg-ink px-5 py-4 text-paper shadow-lift transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99]"
          >
            <span className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold text-ink">
                <ShoppingCart className="h-4 w-4" strokeWidth={2.25} />
              </span>
              <span className="text-left text-sm">
                <span className="block font-semibold">
                  {cart.count} {cart.count === 1 ? "item" : "itens"} no orçamento
                </span>
                {cart.subtotal > 0 && (
                  <span className="block text-xs text-paper-soft/70">
                    Subtotal: R$ {formatPrice(cart.subtotal)}
                  </span>
                )}
              </span>
            </span>
            <span className="shrink-0 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-ink">
              Ver orçamento
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
