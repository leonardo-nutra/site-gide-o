"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Info,
  MessageCircle,
  Minus,
  Play,
  Plus,
  ShoppingCart,
  X,
} from "lucide-react";
import type { Product } from "@/lib/products";
import { parsePrice, useCart } from "@/lib/cart-context";
import { useSearch } from "@/lib/search-context";
import { categories, waLink } from "@/lib/site";
import { trackWhatsAppClick } from "@/lib/tracking";

export function ProductModal({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const cart = useCart();
  const { setCategory } = useSearch();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [detailsOpen, setDetailsOpen] = useState(true);

  const unitPrice = product ? parsePrice(product.price) : 0;
  const total = unitPrice * qty;
  const categoryInfo = product ? categories.find((c) => c.id === product.category) : undefined;

  const media = product
    ? [
        { type: "image" as const, src: product.image, alt: product.name, tag: "Produto" },
        {
          type: "image" as const,
          src: product.applicationImage,
          alt: `Exemplo de ambiente com o produto no tom de ${product.name}`,
          tag: "Exemplo montado",
        },
        ...(product.video
          ? [{ type: "video" as const, src: product.video, alt: product.name, tag: "Vídeo" }]
          : []),
      ]
    : [];
  const current = media[activeImage] ?? media[0];

  function goToCategory() {
    if (!product) return;
    setCategory(product.category);
    onClose();
    document.getElementById("ofertas")?.scrollIntoView({ behavior: "smooth" });
  }

  const handleAdd = () => {
    if (!product) return;
    cart.addItem(
      {
        id: product.id,
        name: product.name,
        detail: product.detail,
        unit: product.unit,
        unitPrice,
      },
      qty
    );
    setAdded(true);
    setQty(1);
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <AnimatePresence
      onExitComplete={() => {
        setActiveImage(0);
        setDetailsOpen(true);
      }}
    >
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
              className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl border border-line bg-paper shadow-lift sm:rounded-3xl"
            >
              <div className="flex items-center justify-between border-b border-line px-5 py-3">
                <nav
                  aria-label="Você está em"
                  className="flex min-w-0 items-center gap-1 text-xs text-ink-faint"
                >
                  <button
                    type="button"
                    onClick={onClose}
                    className="shrink-0 font-medium transition-colors hover:text-ink"
                  >
                    Início
                  </button>
                  {categoryInfo && (
                    <>
                      <ChevronRight className="h-3 w-3 shrink-0" />
                      <button
                        type="button"
                        onClick={goToCategory}
                        className="shrink-0 font-medium transition-colors hover:text-ink"
                      >
                        {categoryInfo.title}
                      </button>
                    </>
                  )}
                  <ChevronRight className="h-3 w-3 shrink-0" />
                  <span className="truncate font-semibold text-ink">{product.name}</span>
                </nav>
                <button
                  type="button"
                  aria-label="Fechar"
                  onClick={onClose}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink-soft transition-colors hover:bg-paper-strong hover:text-ink"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="overflow-y-auto">
                <div className="grid gap-0 sm:grid-cols-2">
                  <div>
                    <div className="relative aspect-square w-full bg-paper-strong">
                      {current.type === "video" ? (
                        <video
                          key={current.src}
                          src={current.src}
                          controls
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Image
                          src={current.src}
                          alt={current.alt}
                          fill
                          sizes="(min-width: 640px) 50vw, 100vw"
                          className="object-cover"
                        />
                      )}
                      <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-ink-soft shadow-soft backdrop-blur">
                        {current.tag}
                      </span>
                    </div>
                    <div className="flex gap-2 p-3">
                      {media.map((item, i) => (
                        <button
                          key={item.tag}
                          type="button"
                          onClick={() => setActiveImage(i)}
                          aria-label={`Ver ${item.type === "video" ? "vídeo" : "foto"}: ${item.tag}`}
                          className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                            activeImage === i ? "border-gold-strong" : "border-line"
                          }`}
                        >
                          {item.type === "video" ? (
                            <>
                              <video src={item.src} className="h-full w-full object-cover" />
                              <span className="absolute inset-0 grid place-items-center bg-black/35">
                                <Play className="h-5 w-5 text-white" fill="currentColor" />
                              </span>
                            </>
                          ) : (
                            <Image
                              src={item.src}
                              alt={item.alt}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="mx-3 mb-3 flex items-start gap-2 rounded-xl bg-gold-soft px-3.5 py-2.5 text-xs leading-relaxed text-ink sm:hidden">
                      <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-strong" strokeWidth={2.25} />
                      <span>
                        A foto &quot;Exemplo montado&quot; é uma imagem ilustrativa de
                        ambiente, no mesmo tom do produto — não é o item exato instalado.
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col p-4 sm:p-6">
                    <div className="hidden items-start gap-2 rounded-xl bg-gold-soft px-3.5 py-2.5 text-xs leading-relaxed text-ink sm:flex">
                      <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-strong" strokeWidth={2.25} />
                      <span>
                        A foto &quot;Exemplo montado&quot; é ilustrativa, no mesmo tom
                        do produto — não é o item exato instalado.
                      </span>
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-ink sm:text-xl">{product.name}</h3>
                    <p className="mt-1 text-sm text-ink-soft">{product.detail}</p>

                    <div className="mt-4 flex items-baseline gap-1.5">
                      <span className="text-sm font-medium text-ink-faint">R$</span>
                      <span className="text-2xl font-display font-black text-ink sm:text-3xl">
                        {product.price}
                      </span>
                      <span className="text-sm font-medium text-ink-faint">/{product.unit}</span>
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
                        {qty} <span className="text-sm font-normal text-ink-faint">{product.unit}</span>
                      </span>
                      <button
                        type="button"
                        aria-label="Aumentar quantidade"
                        onClick={() => setQty((q) => q + 1)}
                        className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink transition-colors hover:bg-paper-strong active:scale-90 sm:h-10 sm:w-10"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <span className="ml-auto text-right text-sm text-ink-soft">
                        Total{" "}
                        <strong className="block text-base text-ink">
                          {total.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </strong>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleAdd}
                      className={`mt-5 flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold shadow-lift transition-all duration-200 active:scale-95 sm:px-6 sm:py-4 sm:text-base ${
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

                    {product.specs.length > 0 && (
                      <div className="mt-5 border-t border-line pt-4">
                        <button
                          type="button"
                          onClick={() => setDetailsOpen((v) => !v)}
                          className="flex w-full items-center justify-between text-left text-sm font-semibold text-ink"
                        >
                          Veja todos os detalhes do produto
                          <ChevronDown
                            className={`h-4 w-4 text-ink-faint transition-transform ${
                              detailsOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        <AnimatePresence initial={false}>
                          {detailsOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.22, ease: "easeOut" }}
                              className="overflow-hidden"
                            >
                              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5 rounded-xl border border-line bg-paper-soft p-4">
                                {product.specs.map((spec) => (
                                  <div key={spec.label}>
                                    <dt className="text-[0.7rem] font-semibold uppercase tracking-wide text-ink-faint">
                                      {spec.label}
                                    </dt>
                                    <dd className="text-sm font-medium text-ink">{spec.value}</dd>
                                  </div>
                                ))}
                              </dl>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    <a
                      href={waLink(`Olá! Tenho uma dúvida sobre o produto "${product.name}".`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        const tracked = trackWhatsAppClick(
                          `Olá! Tenho uma dúvida sobre o produto "${product.name}".`
                        );
                        if (tracked) e.currentTarget.href = tracked;
                      }}
                      className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-line px-4 py-3 text-sm font-semibold text-ink-soft transition-colors hover:border-whatsapp hover:text-whatsapp-strong"
                    >
                      <MessageCircle className="h-4 w-4" strokeWidth={2.25} />
                      Pergunte sobre o produto no WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
