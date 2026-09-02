"use client";

import { motion } from "motion/react";
import { CheckCircle2, MessageCircle, ShoppingCart, Tag, type LucideIcon } from "lucide-react";
import { Reveal, StaggerGroup, itemVariants } from "./motion/Reveal";
import { WhatsAppLink } from "./WhatsAppLink";
import { steps } from "@/lib/site";

const icons: Record<string, LucideIcon> = { Tag, MessageCircle, CheckCircle2 };

export function HowItWorks() {
  return (
    <section id="como-funciona" className="bg-paper py-10 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-gold-strong">
            Simples assim
          </p>
          <h2 className="mt-3 text-2xl font-display font-black tracking-tight text-ink sm:text-4xl">
            Como pedir seu orçamento
          </h2>
          <p className="mt-4 text-base text-ink-soft sm:text-lg">
            Sem cadastro, sem complicação. Você fala com uma pessoa de verdade
            em minutos.
          </p>
        </Reveal>

        <StaggerGroup className="relative mt-8 grid grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-3 sm:gap-6">
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
                className="relative flex items-center gap-4 text-left sm:flex-col sm:items-start sm:text-left"
              >
                <div className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-line bg-paper shadow-soft sm:h-16 sm:w-16">
                  <Icon className="h-6 w-6 text-gold-strong sm:h-7 sm:w-7" strokeWidth={2} />
                  <span className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-ink text-[0.65rem] font-bold text-paper sm:-right-2 sm:-top-2 sm:h-6 sm:w-6 sm:text-xs">
                    {index + 1}
                  </span>
                </div>
                <div className="sm:mt-5">
                  <h3 className="text-base font-semibold text-ink sm:text-lg">{step.title}</h3>
                  <p className="mt-0.5 text-xs leading-relaxed text-ink-soft sm:mt-2 sm:max-w-xs sm:text-sm">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </StaggerGroup>

        <Reveal delay={0.1} className="mt-10 flex flex-col items-center gap-3 sm:mt-14">
          <a
            href="#ofertas"
            className="flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-paper sm:px-7 sm:py-4 sm:text-base shadow-lift transition-transform duration-200 hover:scale-[1.02] hover:bg-gold-strong hover:text-white active:scale-95"
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
