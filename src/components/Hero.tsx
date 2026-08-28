"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { MessageCircle, ShoppingBag, Star } from "lucide-react";
import { WhatsAppLink } from "./WhatsAppLink";
import { site } from "@/lib/site";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function Hero() {
  return (
    <section id="topo" className="relative overflow-hidden bg-paper">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-[-10%] h-[420px] w-[420px] rounded-full bg-gold-soft blur-3xl sm:h-[560px] sm:w-[560px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-[-15%] h-[360px] w-[360px] rounded-full bg-paper-strong blur-3xl"
      />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 pb-16 pt-14 sm:px-8 sm:pb-24 sm:pt-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pb-28 lg:pt-24">
        <motion.div initial="hidden" animate="visible" variants={container}>
          <motion.div
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-paper-soft px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-ink-soft"
          >
            <Star className="h-3.5 w-3.5 fill-gold text-gold" />
            Atacado e varejo em Mesquita, Baixada Fluminense
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-5 text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]"
          >
            Todo dia é dia de{" "}
            <span className="relative inline-block whitespace-nowrap">
              <span className="relative z-10">ofertas</span>
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-1 z-0 h-[0.4em] rounded-sm bg-gold-soft sm:bottom-2"
              />
            </span>
            .
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft sm:text-xl"
          >
            Pisos, tintas, torneiras, portas, janelas e tudo para sua obra com
            preço de atacado. Simples de encontrar, fácil de pedir.
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <WhatsAppLink
              message="Olá! Quero pedir um orçamento com a Gideão."
              className="flex items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-4 text-base font-semibold text-white shadow-lift transition-transform duration-200 hover:scale-[1.02] hover:bg-whatsapp-strong active:scale-95"
            >
              <MessageCircle className="h-5 w-5" strokeWidth={2.25} />
              Pedir orçamento no WhatsApp
            </WhatsAppLink>
            <a
              href="#ofertas"
              className="flex items-center justify-center gap-2 rounded-full border border-line bg-paper px-6 py-4 text-base font-semibold text-ink transition-all duration-200 hover:border-ink/20 hover:bg-paper-strong active:scale-95"
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={2.25} />
              Ver ofertas da semana
            </a>
          </motion.div>

          <motion.p variants={item} className="mt-6 text-sm text-ink-faint">
            📍 {site.address.line}, {site.address.city} · {site.phoneDisplay}
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative overflow-hidden rounded-[28px] border border-line shadow-lift"
          >
            <Image
              src="/images/ofertas/crop/piso-4.jpg"
              alt="Piso Karina Polido em oferta na Gideão"
              width={900}
              height={900}
              priority
              className="h-full w-full object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -left-4 bottom-6 rounded-2xl border border-line bg-paper/95 px-4 py-3 shadow-lift backdrop-blur sm:-left-8"
          >
            <p className="text-[0.65rem] font-bold uppercase tracking-wide text-red">
              Oferta especial
            </p>
            <p className="text-sm font-semibold text-ink">Piso Karina Polido</p>
            <p className="text-lg font-bold text-ink">
              R$ 52,90<span className="text-xs font-medium text-ink-faint">/m²</span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
