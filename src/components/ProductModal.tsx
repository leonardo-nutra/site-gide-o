"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Check, Info, Minus, Plus, ShoppingCart, X } from "lucide-react";
import type { Product } from "@/lib/products";
import { parsePrice, useCart } from "@/lib/cart-context";

export function ProductModal({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const cart = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (!product) return;
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
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-black/55"
          />
          <div
            onClick={onClose}
            className="fixed inset-0 z-[71] flex items-end justify-center sm:items-center sm:p-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={product.name}
              className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-line bg-paper shadow-lift sm:rounded-3xl"
            >
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <h2 className="text-base font-semibold text-ink">Detalhes do produto</h2>
                <button
                  type="button"
                  aria-label="Fechar"
                  onClick={onClose}
                  className="grid h-9 w-9 place-items-center rounded-full text-ink-soft transition-colors hover:bg-paper-strong hover:text-ink"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="overflow-y-auto">
                <div className="grid gap-0 sm:grid-cols-2">
                  <div className="relative aspect-[4/3] w-full bg-paper-strong sm:aspect-square">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-ink-soft shadow-soft backdrop-blur">
                      Produto
                    </span>
                  </div>
                  <div className="relative aspect-[4/3] w-full bg-paper-strong sm:aspect-square">
                    <Image
                      src={product.applicationImage}
                      alt={`Exemplo de ambiente com piso no tom de ${product.name}`}
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-ink-soft shadow-soft backdrop-blur">
                      Exemplo montado
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  <div className="flex items-start gap-2 rounded-xl bg-gold-soft px-3.5 py-2.5 text-xs leading-relaxed text-ink">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-strong" strokeWidth={2.25} />
                    <span>
                      A segunda foto é uma imagem ilustrativa de ambiente, no
                      mesmo tom do produto — não é o piso exato instalado.
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-ink sm:text-xl">{product.name}</h3>
                  <p className="mt-1 text-sm text-ink-soft">{product.detail}</p>

                  <div className="mt-4 flex items-baseline gap-1.5">
                    <span className="text-sm font-medium text-ink-faint">R$</span>
                    <span className="text-2xl font-display font-black text-ink sm:text-3xl">{product.price}</span>
                    <span className="text-sm font-medium text-ink-faint">
                      /{product.unit}
                    </span>
                  </div>

                  <div className="mt-5 flex items-center gap-3">
                    <button
                      type="button"
                      aria-label="Diminuir quantidade"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink transition-colors hover:bg-paper-strong active:scale-90 sm:h-10 sm:w-10"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-14 text-center text-base font-semibold text-ink">
                      {qty}{" "}
                      <span className="text-sm font-normal text-ink-faint">
                        {product.unit}
                      </span>
                    </span>
                    <button
                      type="button"
                      aria-label="Aumentar quantidade"
                      onClick={() => setQty((q) => q + 1)}
                      className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink transition-colors hover:bg-paper-strong active:scale-90 sm:h-10 sm:w-10"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAdd}
                    className={`mt-5 flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold sm:px-6 sm:py-4 sm:text-base shadow-lift transition-all duration-200 active:scale-95 ${
                      added
                        ? "bg-whatsapp-strong text-white"
                        : "bg-ink text-paper hover:scale-[1.01] hover:bg-gold-strong hover:text-white"
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
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
