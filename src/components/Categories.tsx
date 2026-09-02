"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Check,
  DoorOpen,
  Droplets,
  Grid3x3,
  Hammer,
  Layers,
  PaintBucket,
  ShoppingCart,
  type LucideIcon,
} from "lucide-react";
import { Reveal, StaggerGroup, itemVariants } from "./motion/Reveal";
import { WhatsAppLink } from "./WhatsAppLink";
import { categories } from "@/lib/site";
import { useCart } from "@/lib/cart-context";

const icons: Record<string, LucideIcon> = {
  Grid3x3,
  Layers,
  PaintBucket,
  Droplets,
  DoorOpen,
  Hammer,
};

function CategoryCard({ cat }: { cat: (typeof categories)[number] }) {
  const cart = useCart();
  const Icon = icons[cat.icon];
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    cart.addItem({ id: cat.id, name: cat.title });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group relative flex flex-col gap-4 rounded-2xl border border-line bg-paper p-6 shadow-soft transition-shadow duration-300 hover:border-gold-strong/30 hover:shadow-lift"
    >
      {cat.comingSoon && (
        <span className="absolute right-4 top-4 rounded-full bg-gold-strong px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-white shadow-soft">
          Em breve
        </span>
      )}
      <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold-soft text-gold-strong transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
        <Icon className="h-6 w-6" strokeWidth={2} />
      </span>
      <div>
        <h3 className="text-lg font-semibold text-ink">{cat.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{cat.description}</p>
      </div>

      <div className="mt-auto flex flex-col gap-2 pt-1">
        <button
          type="button"
          onClick={handleAdd}
          className={`flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors duration-200 active:scale-95 ${
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
                Adicionado ao orçamento
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

        <WhatsAppLink
          message={cat.message}
          className="text-center text-xs font-medium text-ink-faint transition-colors hover:text-gold-strong"
        >
          ou fale direto no WhatsApp →
        </WhatsAppLink>
      </div>
    </motion.div>
  );
}

export function Categories() {
  return (
    <section id="produtos" className="bg-paper py-10 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-gold-strong">
            O que você encontra na Gideão
          </p>
          <h2 className="mt-3 text-2xl font-display font-black tracking-tight text-ink sm:text-4xl">
            Tudo para sua obra, em um só lugar
          </h2>
          <p className="mt-4 text-base text-ink-soft sm:text-lg">
            Adicione as categorias que precisa ao seu orçamento, ou fale
            direto com a gente pelo WhatsApp.
          </p>
        </Reveal>

        <StaggerGroup className="mt-8 sm:mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} cat={cat} />
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
