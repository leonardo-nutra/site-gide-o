"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { WhatsAppLink } from "./WhatsAppLink";
import { WhatsAppIcon } from "./icons/WhatsAppIcon";
import { site } from "@/lib/site";
import { useCart } from "@/lib/cart-context";

export function WhatsAppButton() {
  const [showTip, setShowTip] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const cart = useCart();
  const barVisible = cart.count > 0 && !cart.isOpen;

  useEffect(() => {
    const showTimer = setTimeout(() => setShowTip(true), 2200);
    const hideTimer = setTimeout(() => setShowTip(false), 8000);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <motion.div
      animate={{ y: barVisible ? -76 : 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{ bottom: "calc(1.25rem + env(safe-area-inset-bottom))" }}
      className="fixed right-5 z-50 flex flex-col items-end gap-3 sm:right-7"
    >
      <AnimatePresence>
        {showTip && !dismissed && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="flex max-w-[220px] items-start gap-2 rounded-2xl border border-line bg-paper px-4 py-3 text-sm text-ink shadow-lift"
          >
            <span className="leading-snug">
              Fale com a gente agora e peça seu orçamento!
            </span>
            <button
              type="button"
              aria-label="Fechar aviso"
              onClick={() => setDismissed(true)}
              className="mt-0.5 shrink-0 text-ink-faint transition-colors hover:text-ink"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <WhatsAppLink
        message="Olá! Vim pelo site e quero falar com a Gideão."
        aria-label={`Falar com a ${site.name} no WhatsApp`}
        className="group relative grid h-12 w-12 place-items-center rounded-full bg-whatsapp text-white shadow-lift transition-transform duration-200 hover:scale-105 active:scale-95 sm:h-16 sm:w-16"
      >
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full bg-whatsapp"
          animate={{ scale: [1, 1.6], opacity: [0.55, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 2.4, ease: "easeOut" }}
        />
        <WhatsAppIcon className="relative h-6 w-6 sm:h-7 sm:w-7" />
      </WhatsAppLink>
    </motion.div>
  );
}
