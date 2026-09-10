"use client";

import { useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  DoorOpen,
  Droplets,
  Grid3x3,
  Hammer,
  Layers,
  PaintBucket,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";
import { categories } from "@/lib/site";
import { useSearch } from "@/lib/search-context";

const icons: Record<string, LucideIcon> = {
  Grid3x3,
  Layers,
  PaintBucket,
  Droplets,
  DoorOpen,
  Hammer,
};

export function DepartmentStrip() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const { category, setCategory } = useSearch();

  function scrollByIcons(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * 240, behavior: "smooth" });
  }

  return (
    <div className="border-b border-line bg-paper px-4 py-4 sm:px-8 sm:py-5">
      <p className="mx-auto mb-3 flex max-w-6xl items-center gap-1.5 text-sm font-semibold text-ink sm:mb-4">
        Compre por departamento
        <ShoppingBag className="h-4 w-4 text-gold-strong" strokeWidth={2.25} />
      </p>

      {/* Arrows + icons form a single row that hugs its own content width at
          lg+ (so it can center as one unit), instead of icons floating
          inside a much wider fixed box with arrows pinned to its edges. */}
      <div className="mx-auto flex max-w-6xl items-center gap-2 lg:w-fit lg:max-w-full lg:gap-3">
        <button
          type="button"
          aria-label="Ver departamentos anteriores"
          onClick={() => scrollByIcons(-1)}
          className="hidden h-9 w-9 shrink-0 place-items-center rounded-full bg-gold-strong text-white shadow-lift transition-transform hover:scale-105 active:scale-95 lg:grid"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
        </button>

        <div
          ref={scrollerRef}
          className="-mx-4 flex flex-1 gap-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:gap-8 lg:mx-0 lg:flex-none lg:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {categories.map((cat) => {
            const Icon = icons[cat.icon];
            return (
              <a
                key={cat.id}
                href="#ofertas"
                onClick={() => setCategory(cat.id)}
                className="group flex w-16 shrink-0 flex-col items-center gap-1.5 text-center transition-transform active:scale-95 sm:w-24 sm:gap-2"
              >
                <span
                  className={`grid h-14 w-14 shrink-0 place-items-center rounded-full transition-transform sm:h-16 sm:w-16 group-hover:scale-105 ${
                    category === cat.id ? "bg-gold-strong text-ink" : "bg-ink text-gold"
                  }`}
                >
                  <Icon className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2} />
                </span>
                <span className="line-clamp-2 text-[0.65rem] font-medium leading-tight text-ink-soft sm:text-xs">
                  {cat.title}
                </span>
              </a>
            );
          })}
        </div>

        <button
          type="button"
          aria-label="Ver mais departamentos"
          onClick={() => scrollByIcons(1)}
          className="hidden h-9 w-9 shrink-0 place-items-center rounded-full bg-gold-strong text-white shadow-lift transition-transform hover:scale-105 active:scale-95 lg:grid"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
