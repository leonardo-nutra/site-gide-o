"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Check, Clock, Flame, Minus, Plus, ShoppingCart } from "lucide-react";
import { Reveal } from "./motion/Reveal";
import type { Product } from "@/lib/products";
import { parsePrice, useCart } from "@/lib/cart-context";

export function FeaturedDeal({ product }: { product: Product }) {
  const cart = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    cart.addItem(
      {
        id: product.id,
        name: product.name,
        detail: product.detail,
        unit: product.unit,
        unitPrice: parsePrice(product.price),
      },
      qty
    );
    setAdded(true);
    setQty(1);
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <section className="bg-paper py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="overflow-hidden rounded-3xl border border-gold-strong/30 bg-gradient-to-br from-paper-strong via-paper-soft to-paper shadow-lift">
          <div className="grid gap-0 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, scale: 1.04 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-square lg:aspect-auto"
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                priority
              />
              <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-red px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-soft">
                <Flame className="h-3.5 w-3.5" strokeWidth={2.5} />
                Oferta do dia
              </div>
            </motion.div>

            <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
              <p className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-gold-strong">
                <Clock className="h-4 w-4" strokeWidth={2.5} />
                Só hoje, um produto em destaque
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                {product.name}
              </h2>
              <p className="mt-2 text-base text-ink-soft">{product.detail}</p>

              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="text-sm font-medium text-ink-faint">R$</span>
                <span className="text-4xl font-bold text-ink sm:text-5xl">
                  {product.price}
                </span>
                <span className="text-sm font-medium text-ink-faint">
                  /{product.unit}
                </span>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Diminuir quantidade"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink transition-colors hover:bg-paper-strong active:scale-90"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-14 text-center text-base font-semibold text-ink">
                  {qty} <span className="text-sm font-normal text-ink-faint">{product.unit}</span>
                </span>
                <button
                  type="button"
                  aria-label="Aumentar quantidade"
                  onClick={() => setQty((q) => q + 1)}
                  className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink transition-colors hover:bg-paper-strong active:scale-90"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                className={`mt-6 flex items-center justify-center gap-2 rounded-full px-6 py-4 text-base font-semibold shadow-lift transition-all duration-200 active:scale-95 ${
                  added
                    ? "bg-whatsapp-strong text-white"
                    : "bg-ink text-paper hover:scale-[1.02] hover:bg-gold-strong hover:text-white"
                }`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {added ? (
                    <motion.span
                      key="added"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.18 }}
                      className="flex items-center gap-2"
                    >
                      <Check className="h-5 w-5" strokeWidth={2.5} />
                      Adicionado ao orçamento
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.18 }}
                      className="flex items-center gap-2"
                    >
                      <ShoppingCart className="h-5 w-5" strokeWidth={2.25} />
                      Adicionar ao orçamento
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <p className="mt-4 text-xs text-ink-faint">
                A oferta do dia muda todo dia à meia-noite.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
