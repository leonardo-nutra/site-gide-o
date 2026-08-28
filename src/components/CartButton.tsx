"use client";

import { AnimatePresence, motion } from "motion/react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export function CartButton({ className = "" }: { className?: string }) {
  const cart = useCart();

  return (
    <button
      type="button"
      onClick={cart.openCart}
      aria-label={`Ver orçamento${cart.count > 0 ? ` (${cart.count} itens)` : ""}`}
      className={`relative grid h-11 w-11 place-items-center rounded-full text-ink transition-colors hover:bg-paper-strong ${className}`}
    >
      <ShoppingCart className="h-5 w-5" strokeWidth={2.25} />
      <AnimatePresence>
        {cart.count > 0 && (
          <motion.span
            key={cart.count}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-red px-1 text-[0.65rem] font-bold text-white"
          >
            {cart.count}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
