"use client";

import {
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

const icons: Record<string, LucideIcon> = {
  Grid3x3,
  Layers,
  PaintBucket,
  Droplets,
  DoorOpen,
  Hammer,
};

export function DepartmentStrip() {
  return (
    <div className="border-b border-line bg-paper px-4 py-4 sm:px-8 sm:py-5">
      <p className="mx-auto mb-3 flex max-w-6xl items-center gap-1.5 text-sm font-semibold text-ink sm:mb-4">
        Compre por departamento
        <ShoppingBag className="h-4 w-4 text-gold-strong" strokeWidth={2.25} />
      </p>
      <div className="mx-auto -mx-4 flex max-w-6xl gap-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:gap-8 sm:overflow-visible [&::-webkit-scrollbar]:hidden">
        {categories.map((cat) => {
          const Icon = icons[cat.icon];
          return (
            <a
              key={cat.id}
              href={cat.id === "pisos" ? "#ofertas" : "#produtos"}
              className="group flex w-16 shrink-0 flex-col items-center gap-1.5 text-center transition-transform active:scale-95 sm:w-24 sm:gap-2"
            >
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-ink text-gold transition-transform sm:h-16 sm:w-16 group-hover:scale-105">
                <Icon className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2} />
              </span>
              <span className="line-clamp-2 text-[0.65rem] font-medium leading-tight text-ink-soft sm:text-xs">
                {cat.title}
              </span>
              {cat.comingSoon && (
                <span className="rounded-full bg-gold-soft px-1.5 py-0.5 text-[0.55rem] font-bold uppercase tracking-wide text-gold-strong">
                  Em breve
                </span>
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
}
