"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { User } from "lucide-react";
import { WhatsAppLink } from "./WhatsAppLink";

export function AccountButton({
  className = "",
  showLabel = false,
}: {
  className?: string;
  showLabel?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Minha conta"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 rounded-full text-ink transition-colors hover:bg-paper-strong ${
          showLabel ? "px-2.5 py-1.5" : "grid h-11 w-11 place-items-center"
        } ${className}`}
      >
        <User className="h-5 w-5 shrink-0 text-gold-strong" strokeWidth={2.25} />
        {showLabel && (
          <span className="text-left leading-tight">
            <span className="block text-xs text-ink-faint">Bem-vindo!</span>
            <span className="block text-sm font-semibold text-ink">Entrar</span>
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-line bg-paper p-4 text-left shadow-lift"
          >
            <p className="text-sm font-semibold text-ink">Login de clientes</p>
            <p className="mt-1 text-xs leading-relaxed text-ink-soft">
              Essa área ainda está a caminho. Por enquanto, fale direto com a
              gente pelo WhatsApp pra pedir seu orçamento.
            </p>
            <WhatsAppLink
              message="Olá! Vim pelo site e quero falar com a Gideão."
              className="mt-3 flex items-center justify-center rounded-full bg-whatsapp px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-whatsapp-strong"
              onClick={() => setOpen(false)}
            >
              Falar no WhatsApp
            </WhatsAppLink>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
