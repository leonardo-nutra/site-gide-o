"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, Package } from "lucide-react";

const exampleItems = [
  "Cimento 50kg",
  "Areia média 20kg",
  "Brita 1 20kg",
  "Chapa drywall standard",
  "Argamassa colante 20kg",
];

/**
 * Layout demo only — NOT real inventory. Placeholder text everywhere a real
 * price/photo would go, so nothing here could be mistaken for a live offer.
 * Swap the `exampleItems` list (and wire real prices) once Leonardo sends
 * real "Básicos e essenciais" products.
 */
export function ExampleCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollByCards(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    const cardWidth = el.querySelector("[data-card]")?.clientWidth ?? 220;
    el.scrollBy({ left: direction * (cardWidth + 12), behavior: "smooth" });
  }

  return (
    <section className="bg-paper py-10 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-gold-soft px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-gold-strong">
              Exemplo de layout — não é oferta real
            </div>
            <h2 className="mt-2 text-xl font-display font-black tracking-tight text-ink sm:text-3xl">
              Básicos e essenciais para a obra
            </h2>
          </div>
          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <button
              type="button"
              aria-label="Ver anteriores"
              onClick={() => scrollByCards(-1)}
              className="grid h-9 w-9 place-items-center rounded-full bg-gold-strong text-white shadow-soft transition-transform hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
            </button>
            <button
              type="button"
              aria-label="Ver mais"
              onClick={() => scrollByCards(1)}
              className="grid h-9 w-9 place-items-center rounded-full bg-gold-strong text-white shadow-soft transition-transform hover:scale-105 active:scale-95"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <p className="mt-3 max-w-2xl text-sm text-ink-faint">
          Leonardo, isso aqui é só o desenho da seção — nomes, fotos e preços
          são placeholders. Me manda os produtos reais (nome, foto, preço
          varejo, preço atacado e a partir de quantas unidades) que eu troco
          tudo por dados de verdade.
        </p>

        <div
          ref={scrollerRef}
          className="mt-6 flex gap-3 overflow-x-auto pb-2 sm:mt-8 sm:gap-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {exampleItems.map((name, i) => (
            <div
              key={i}
              data-card
              className="flex w-[46%] shrink-0 flex-col overflow-hidden rounded-xl border border-dashed border-line bg-paper-soft sm:w-56"
            >
              <div className="flex aspect-square w-full items-center justify-center bg-paper-strong">
                <Package className="h-10 w-10 text-ink-faint" strokeWidth={1.5} />
              </div>

              <div className="flex flex-1 flex-col px-3 py-3 sm:px-4">
                <h3 className="line-clamp-2 text-xs font-semibold leading-snug text-ink sm:text-sm">
                  {name} <span className="font-normal text-ink-faint">(exemplo)</span>
                </h3>

                <div className="mt-2 text-xs text-ink-faint">
                  <p className="font-semibold text-ink-soft">Preço Varejo</p>
                  <p>Exemplo /un</p>
                </div>
                <div className="mt-1.5 text-xs text-ink-faint">
                  <p className="font-semibold text-gold-strong">Preço Atacado</p>
                  <p>Exemplo /un — a partir de X un.</p>
                </div>

                <button
                  type="button"
                  disabled
                  title="Produto de exemplo — aguardando dados reais"
                  className="mt-3 cursor-not-allowed rounded-full bg-ink/40 px-3 py-2 text-[0.65rem] font-semibold text-paper/70 sm:text-xs"
                >
                  Exemplo — em breve
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
