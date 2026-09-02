"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Check, Minus, Plus, ShoppingCart } from "lucide-react";
import { Reveal, StaggerGroup, itemVariants } from "./motion/Reveal";
import { ProductModal } from "./ProductModal";
import type { Product } from "@/lib/products";
import { parsePrice, useCart } from "@/lib/cart-context";
import { useSearch } from "@/lib/search-context";

const DIACRITICS_PATTERN = new RegExp("[\\u0300-\\u036f]", "g");

function normalize(value: string) {
  return value.normalize("NFD").replace(DIACRITICS_PATTERN, "").toLowerCase();
}

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
      className="group flex flex-col overflow-hidden rounded-xl border border-line bg-paper shadow-soft transition-shadow duration-300 hover:shadow-lift sm:rounded-2xl"
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
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover opacity-100 transition-opacity duration-500 ease-out group-hover:opacity-0"
            />
            <Image
              src={offer.applicationImage}
              alt={`Exemplo de ambiente com piso no tom de ${offer.name}`}
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
            />
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-whatsapp py-1.5 text-center text-[0.65rem] font-bold uppercase tracking-wide text-white shadow-soft transition-colors duration-300 group-hover:bg-ink group-hover:text-paper sm:py-2 sm:text-xs">
            <span className="block group-hover:hidden">Oferta</span>
            <span className="hidden group-hover:block">Exemplo montado</span>
          </div>
        </div>

        <div className="px-3 pt-3 sm:px-5 sm:pt-5">
          <h3 className="line-clamp-2 text-xs font-semibold leading-snug text-ink sm:text-sm">
            {offer.name}
          </h3>
          <p className="mt-1 hidden text-xs text-ink-faint sm:block">{offer.detail}</p>

          <div className="mt-2 flex items-baseline gap-1 sm:mt-4">
            <span className="text-[0.65rem] font-medium text-ink-faint sm:text-xs">R$</span>
            <span className="text-lg font-display font-black text-ink sm:text-2xl">{offer.price}</span>
            <span className="text-[0.65rem] font-medium text-ink-faint sm:text-xs">
              /{offer.unit}
            </span>
          </div>
        </div>
      </button>

      <div className="flex flex-1 flex-col px-3 pb-3 sm:px-5 sm:pb-5">
        <div className="mt-2 flex items-center justify-center gap-2 sm:mt-4 sm:gap-3">
          <button
            type="button"
            aria-label="Diminuir quantidade"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="grid h-7 w-7 place-items-center rounded-full border border-line text-ink transition-colors hover:bg-paper-strong active:scale-90 sm:h-8 sm:w-8"
          >
            <Minus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </button>
          <span className="w-9 text-center text-xs font-semibold text-ink sm:w-10 sm:text-sm">
            {qty} <span className="text-[0.65rem] font-normal text-ink-faint sm:text-xs">{offer.unit}</span>
          </span>
          <button
            type="button"
            aria-label="Aumentar quantidade"
            onClick={() => setQty((q) => q + 1)}
            className="grid h-7 w-7 place-items-center rounded-full border border-line text-ink transition-colors hover:bg-paper-strong active:scale-90 sm:h-8 sm:w-8"
          >
            <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </button>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className={`mt-2 flex items-center justify-center gap-1 rounded-full px-2 py-2 text-[0.65rem] font-semibold transition-colors duration-200 active:scale-95 sm:mt-4 sm:gap-1.5 sm:px-4 sm:py-2.5 sm:text-xs ${
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
                className="flex items-center gap-1 sm:gap-1.5"
              >
                <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5" strokeWidth={2.5} />
                Adicionado
              </motion.span>
            ) : (
              <motion.span
                key="add"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.18 }}
                className="flex items-center gap-1 sm:gap-1.5"
              >
                <ShoppingCart className="h-3 w-3 sm:h-3.5 sm:w-3.5" strokeWidth={2.25} />
                <span className="sm:hidden">Adicionar</span>
                <span className="hidden sm:inline">Adicionar ao orçamento</span>
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
  const { query } = useSearch();

  const trimmedQuery = query.trim();
  const filtered = trimmedQuery
    ? offers.filter((o) => {
        const needle = normalize(trimmedQuery);
        return normalize(o.name).includes(needle) || normalize(o.detail).includes(needle);
      })
    : offers;

  return (
    <section id="ofertas" className="bg-paper-soft py-10 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-red">
              {trimmedQuery ? "Resultado da busca" : "Ofertas da semana"}
            </p>
            <h2 className="mt-3 text-2xl font-display font-black tracking-tight text-ink sm:text-4xl">
              {trimmedQuery ? `Produtos para "${trimmedQuery}"` : "Preços especiais em pisos e porcelanatos"}
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
        ) : filtered.length === 0 ? (
          <p className="mt-12 text-center text-ink-faint">
            Nenhum produto encontrado para &quot;{trimmedQuery}&quot;. Fale com
            a gente pelo WhatsApp — talvez a gente tenha o que você procura.
          </p>
        ) : (
          <StaggerGroup className="mt-6 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-5 lg:grid-cols-4">
            {filtered.map((offer) => (
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
