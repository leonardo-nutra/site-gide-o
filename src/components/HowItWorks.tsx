"use client";

import { motion } from "motion/react";
import { CheckCircle2, MessageCircle, ShoppingCart, Tag, type LucideIcon } from "lucide-react";
import { Reveal, StaggerGroup, itemVariants } from "./motion/Reveal";
import { WhatsAppLink } from "./WhatsAppLink";
import { steps } from "@/lib/site";

const icons: Record<string, LucideIcon> = { Tag, MessageCircle, CheckCircle2 };

export function HowItWorks() {
  return (
    <section id="como-funciona" className="bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-gold-strong">
            Simples assim
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Como pedir seu orçamento
          </h2>
          <p className="mt-4 text-lg text-ink-soft">
            Sem cadastro, sem complicação. Você fala com uma pessoa de verdade
            em minutos.
          </p>
        </Reveal>

        <StaggerGroup className="relative mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-6">
          <div
            aria-hidden
            className="absolute left-0 right-0 top-8 hidden h-px bg-line sm:block"
          />
          {steps.map((step, index) => {
            const Icon = icons[step.icon];
            return (
              <motion.div
                key={step.title}
                variants={itemVariants}
                className="relative flex flex-col items-center text-center sm:items-start sm:text-left"
              >
                <div className="relative z-10 grid h-16 w-16 place-items-center rounded-2xl border border-line bg-paper shadow-soft">
                  <Icon className="h-7 w-7 text-gold-strong" strokeWidth={2} />
                  <span className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-ink text-xs font-bold text-paper">
                    {index + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-soft">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </StaggerGroup>

        <Reveal delay={0.1} className="mt-14 flex flex-col items-center gap-3">
          <a
            href="#ofertas"
            className="flex items-center gap-2 rounded-full bg-ink px-7 py-4 text-base font-semibold text-paper shadow-lift transition-transform duration-200 hover:scale-[1.02] hover:bg-gold-strong hover:text-white active:scale-95"
          >
            <ShoppingCart className="h-5 w-5" strokeWidth={2.25} />
            Ver ofertas e montar orçamento
          </a>
          <WhatsAppLink
            message="Olá! Quero pedir um orçamento com a Gideão."
            className="flex items-center gap-1.5 text-sm font-medium text-ink-faint transition-colors hover:text-whatsapp-strong"
          >
            <MessageCircle className="h-4 w-4" />
            ou fale direto no WhatsApp
          </WhatsAppLink>
        </Reveal>
      </div>
    </section>
  );
}
