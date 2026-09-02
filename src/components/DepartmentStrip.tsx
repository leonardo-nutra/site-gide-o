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
    <div className="border-b border-line bg-paper px-4 py-4 sm:hidden">
      <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-ink">
        Compre por departamento
        <ShoppingBag className="h-4 w-4 text-gold-strong" strokeWidth={2.25} />
      </p>
      <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((cat) => {
          const Icon = icons[cat.icon];
          return (
            <a
              key={cat.id}
              href="#produtos"
              className="flex w-16 shrink-0 flex-col items-center gap-1.5 text-center active:scale-95"
            >
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-ink text-gold">
                <Icon className="h-6 w-6" strokeWidth={2} />
              </span>
              <span className="line-clamp-2 text-[0.65rem] font-medium leading-tight text-ink-soft">
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
