"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { StaggerGroup } from "./motion/Reveal";
import { OfferCard } from "./Offers";
import { ProductModal } from "./ProductModal";
import type { Product } from "@/lib/products";

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
      className={`py-10 sm:py-20 ${bg === "soft" ? "bg-paper-soft" : "bg-paper"}`}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <h2 className="text-xl font-display font-black tracking-tight text-ink sm:text-3xl">
          {title}
        </h2>

        <div className="relative mt-6 sm:mt-8">
          <StaggerGroup
            ref={scrollerRef}
            className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 sm:gap-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {products.map((product) => (
              <div
                key={product.id}
                data-card
                className="w-[46%] shrink-0 snap-start sm:w-56 lg:w-64"
              >
                <OfferCard
                  offer={product}
                  onOpen={() => setSelected(product)}
                />
              </div>
            ))}
          </StaggerGroup>

          <button
            type="button"
            aria-label="Ver anteriores"
            onClick={() => scrollByCards(-1)}
            className="absolute -left-2 top-[30%] grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-gold-strong text-white shadow-soft transition-transform hover:scale-105 active:scale-95 sm:-left-3 sm:h-10 sm:w-10"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            aria-label="Ver mais"
            onClick={() => scrollByCards(1)}
            className="absolute -right-2 top-[30%] grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-gold-strong text-white shadow-soft transition-transform hover:scale-105 active:scale-95 sm:-right-3 sm:h-10 sm:w-10"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
