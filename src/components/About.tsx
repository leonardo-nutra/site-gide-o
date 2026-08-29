"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "motion/react";
import { Percent, ShieldCheck, Truck, type LucideIcon } from "lucide-react";
import { Reveal, StaggerGroup, itemVariants } from "./motion/Reveal";
import { differentiators } from "@/lib/site";
import type { Product } from "@/lib/products";

const icons: Record<string, LucideIcon> = { Percent, Truck, ShieldCheck };

function Carousel({ products }: { products: Product[] }) {
  const [paused, setPaused] = useState(false);
  const track = [...products, ...products];

  return (
    <div
      className="relative overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 60px, black calc(100% - 60px), transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 60px, black calc(100% - 60px), transparent)",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="flex w-max gap-5 py-2 sm:gap-6"
        style={{
          animation: "marquee 38s linear infinite",
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        {track.map((item, i) => (
          <motion.div
            key={`${item.id}-${i}`}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="group relative h-48 w-36 shrink-0 overflow-hidden rounded-2xl border border-line bg-ink shadow-soft transition-shadow duration-300 hover:shadow-lift sm:h-80 sm:w-60"
          >
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="240px"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent"
            />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <p className="text-sm font-semibold leading-snug text-white/95 line-clamp-2">
                {item.name}
              </p>
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function About({ products }: { products: Product[] }) {
  return (
    <section className="overflow-hidden bg-paper-soft pb-14 pt-10 sm:pb-28 sm:pt-20">
      {products.length > 0 && (
        <Reveal y={16} className="pb-14">
          <p className="mb-6 text-center text-sm font-semibold uppercase tracking-wide text-gold-strong">
            Nosso catálogo
          </p>
          <Carousel products={products} />
        </Reveal>
      )}

      <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-wide text-gold-strong">
            Por que comprar na Gideão
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-4xl">
            Confiança e preço baixo, todos os dias
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-lg">
            Somos um atacadão da construção em Mesquita, na Baixada
            Fluminense. Trabalhamos para que você encontre tudo o que precisa
            para sua obra ou reforma, com atendimento próximo e preço justo.
          </p>
        </Reveal>
      </div>

      <StaggerGroup className="mx-auto mt-8 sm:mt-12 grid max-w-5xl grid-cols-1 gap-8 px-5 sm:grid-cols-3 sm:px-8">
        {differentiators.map((d) => {
          const Icon = icons[d.icon];
          return (
            <motion.div
              key={d.title}
              variants={itemVariants}
              className="flex flex-col items-center gap-3 text-center sm:items-start sm:text-left"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gold-soft text-gold-strong">
                <Icon className="h-5 w-5" strokeWidth={2.25} />
              </span>
              <div>
                <h3 className="font-semibold text-ink">{d.title}</h3>
                <p className="mt-0.5 text-sm text-ink-soft">{d.description}</p>
              </div>
            </motion.div>
          );
        })}
      </StaggerGroup>
    </section>
  );
}
