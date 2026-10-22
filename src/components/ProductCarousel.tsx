"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { StaggerGroup } from "./motion/Reveal";
import { OfferCard } from "./Offers";
import { ProductModal } from "./ProductModal";
import type { Product } from "@/domain/product";

/** A titled, horizontally scrolling row of real catalog products. */
export function ProductCarousel({
  title,
  products,
  bg = "paper",
}: {
  title: string;
  products: Product[];
  bg?: "paper" | "soft";
}) {
  const [selected, setSelected] = useState<Product | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  if (products.length === 0) return null;

  function scrollByCards(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    const cardWidth = el.querySelector("[data-card]")?.clientWidth ?? 260;
    el.scrollBy({ left: direction * (cardWidth + 16), behavior: "smooth" });
  }

  return (
    <section
      className={`py-8 sm:py-12 ${bg === "soft" ? "bg-paper-soft" : "bg-paper"}`}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex items-end justify-between gap-4">
          <h2 className="border-b-2 border-gold-strong pb-1 text-base font-bold leading-snug text-neutral-700 sm:text-xl">
            {title}
          </h2>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              aria-label="Ver anteriores"
              onClick={() => scrollByCards(-1)}
              className="grid h-8 w-8 place-items-center rounded-full bg-gold-strong text-white shadow-soft transition-transform hover:scale-105 active:scale-95 sm:h-9 sm:w-9"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
            </button>
            <button
              type="button"
              aria-label="Ver mais"
              onClick={() => scrollByCards(1)}
              className="grid h-8 w-8 place-items-center rounded-full bg-gold-strong text-white shadow-soft transition-transform hover:scale-105 active:scale-95 sm:h-9 sm:w-9"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <StaggerGroup
          ref={scrollerRef}
          className="mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 sm:gap-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product) => (
            <div
              key={product.id}
              data-card
              className="w-[46%] shrink-0 snap-start sm:w-56 lg:w-64"
            >
              <OfferCard offer={product} onOpen={() => setSelected(product)} />
            </div>
          ))}
        </StaggerGroup>
      </div>

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
