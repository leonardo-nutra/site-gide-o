"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Check, Minus, Plus, ShoppingCart } from "lucide-react";
import { Reveal, StaggerGroup, itemVariants } from "./motion/Reveal";
import { ProductModal } from "./ProductModal";
import type { Product } from "@/lib/products";
import { parsePrice, useCart } from "@/lib/cart-context";

function OfferCard({ offer, onOpen }: { offer: Product; onOpen: () => void }) {
  const cart = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    cart.addItem(
      {
        id: offer.id,
        name: offer.name,
        detail: offer.detail,
        unit: offer.unit,
        unitPrice: parsePrice(offer.price),
      },
      qty
    );
    setAdded(true);
    setQty(1);
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-paper shadow-soft transition-shadow duration-300 hover:shadow-lift"
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Ver detalhes de ${offer.name}`}
        className="block text-left"
      >
        <div className="relative aspect-square w-full overflow-hidden bg-paper-strong">
          <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-110">
            <Image
              src={offer.image}
              alt={offer.name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover opacity-100 transition-opacity duration-500 ease-out group-hover:opacity-0"
            />
            <Image
              src={offer.applicationImage}
              alt={`Exemplo de ambiente com piso no tom de ${offer.name}`}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
            />
          </div>
          <span className="absolute left-3 top-3 rounded-full bg-red px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-white shadow-soft transition-opacity duration-300 group-hover:opacity-0">
            Oferta
          </span>
          <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-ink-soft opacity-0 shadow-soft backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
            Exemplo montado
          </span>
        </div>

        <div className="px-5 pt-5">
          <h3 className="text-sm font-semibold leading-snug text-ink">{offer.name}</h3>
          <p className="mt-1 text-xs text-ink-faint">{offer.detail}</p>

          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-xs font-medium text-ink-faint">R$</span>
            <span className="text-2xl font-bold text-ink">{offer.price}</span>
            <span className="text-xs font-medium text-ink-faint">/{offer.unit}</span>
          </div>
        </div>
      </button>

      <div className="flex flex-1 flex-col px-5 pb-5">
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            aria-label="Diminuir quantidade"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="grid h-8 w-8 place-items-center rounded-full border border-line text-ink transition-colors hover:bg-paper-strong active:scale-90"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-10 text-center text-sm font-semibold text-ink">
            {qty} <span className="text-xs font-normal text-ink-faint">{offer.unit}</span>
          </span>
          <button
            type="button"
            aria-label="Aumentar quantidade"
            onClick={() => setQty((q) => q + 1)}
            className="grid h-8 w-8 place-items-center rounded-full border border-line text-ink transition-colors hover:bg-paper-strong active:scale-90"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className={`mt-4 flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-semibold transition-colors duration-200 active:scale-95 ${
            added
              ? "bg-whatsapp-strong text-white"
              : "bg-ink text-paper hover:bg-gold-strong hover:text-white"
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
                className="flex items-center gap-1.5"
              >
                <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                Adicionado
              </motion.span>
            ) : (
              <motion.span
                key="add"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.18 }}
                className="flex items-center gap-1.5"
              >
                <ShoppingCart className="h-3.5 w-3.5" strokeWidth={2.25} />
                Adicionar ao orçamento
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.div>
  );
}

export function Offers({ offers }: { offers: Product[] }) {
  const [selected, setSelected] = useState<Product | null>(null);

  return (
    <section id="ofertas" className="bg-paper-soft py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-red">
              Ofertas da semana
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Preços especiais em pisos e porcelanatos
            </h2>
          </div>
          <p className="text-sm text-ink-faint">
            Preços por m² · válidos enquanto durar o estoque
          </p>
        </Reveal>

        {offers.length === 0 ? (
          <p className="mt-12 text-center text-ink-faint">
            Nenhuma oferta disponível no momento. Fale com a gente pelo
            WhatsApp para consultar preços.
          </p>
        ) : (
          <StaggerGroup className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {offers.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                onOpen={() => setSelected(offer)}
              />
            ))}
          </StaggerGroup>
        )}
      </div>

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
