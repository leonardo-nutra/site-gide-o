"use client";

import { motion } from "motion/react";
import { Percent, ShieldCheck, Truck, type LucideIcon } from "lucide-react";
import { Reveal, StaggerGroup, itemVariants } from "./motion/Reveal";
import { differentiators } from "@/lib/site";

const icons: Record<string, LucideIcon> = { Percent, Truck, ShieldCheck };

export function About() {
  return (
    <section className="overflow-hidden bg-paper-soft pb-10 pt-8 sm:pb-20 sm:pt-14">
      <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-wide text-gold-strong">
            Por que comprar na Gideão
          </p>
          <h2 className="mt-3 text-2xl font-display font-black tracking-tight text-ink sm:text-4xl">
            Confiança e preço baixo, todos os dias
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-lg">
            Somos um atacadão da construção em Mesquita, na Baixada
            Fluminense. Trabalhamos para que você encontre tudo o que precisa
            para sua obra ou reforma, com atendimento próximo e preço justo.
          </p>
        </Reveal>
      </div>

      <StaggerGroup className="mx-auto mt-6 grid max-w-5xl grid-cols-1 gap-4 px-5 sm:mt-12 sm:gap-8 sm:px-8 sm:grid-cols-3">
        {differentiators.map((d) => {
          const Icon = icons[d.icon];
          return (
            <motion.div
              key={d.title}
              variants={itemVariants}
              className="flex items-center gap-3 text-left sm:flex-col sm:items-start sm:gap-3 sm:text-left"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold-soft text-gold-strong sm:h-12 sm:w-12">
                <Icon className="h-5 w-5" strokeWidth={2.25} />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-ink sm:text-base">{d.title}</h3>
                <p className="mt-0.5 text-xs text-ink-soft sm:text-sm">{d.description}</p>
              </div>
            </motion.div>
          );
        })}
      </StaggerGroup>
    </section>
  );
}
