"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, MessageCircle, X } from "lucide-react";
import { Logo } from "./Logo";
import { CartButton } from "./CartButton";
import { ThemeToggle } from "./ThemeToggle";
import { WhatsAppLink } from "./WhatsAppLink";
import { site, waLink } from "@/lib/site";
import { trackWhatsAppClick } from "@/lib/tracking";

const navLinks = [
  { href: "#produtos", label: "Produtos" },
  { href: "#ofertas", label: "Ofertas" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#contato", label: "Contato" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-[background-color,box-shadow,border-color] duration-300 ${
        scrolled
          ? "border-b border-line bg-paper shadow-soft"
          : "border-b border-transparent bg-paper"
      }`}
    >
      <div className="grid h-14 grid-cols-3 items-center px-3 sm:hidden">
        <button
          type="button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center justify-self-start rounded-full text-ink transition-colors hover:bg-paper-strong"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <a href="#topo" className="justify-self-center">
          <Logo compact />
        </a>
        <div className="flex items-center justify-self-end gap-0.5">
          <ThemeToggle />
          <CartButton />
        </div>
      </div>

      <div className="mx-auto hidden h-16 max-w-6xl items-center justify-between px-5 sm:flex sm:px-8">
        <a href="#topo" className="shrink-0">
          <Logo />
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-sm font-medium text-ink-soft transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <CartButton />

          <WhatsAppLink
            message="Olá! Vim pelo site e quero falar com a Gideão."
            className="hidden items-center gap-2 whitespace-nowrap rounded-full bg-whatsapp px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-transform duration-200 hover:scale-[1.03] hover:bg-whatsapp-strong active:scale-95 lg:flex"
          >
            <MessageCircle className="h-4 w-4" strokeWidth={2.25} />
            Pedir orçamento
          </WhatsAppLink>

          <button
            type="button"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-full text-ink transition-colors hover:bg-paper-strong lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-b border-line bg-paper lg:hidden"
          >
            <nav className="flex flex-col gap-1 px-5 pb-5 pt-2">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.3, ease: "easeOut" }}
                  className="rounded-xl px-3 py-3 text-base font-medium text-ink-soft transition-colors hover:bg-paper-strong hover:text-ink"
                >
                  {link.label}
                </motion.a>
              ))}
              <a
                href={waLink("Olá! Vim pelo site e quero falar com a Gideão.")}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  const tracked = trackWhatsAppClick(
                    "Olá! Vim pelo site e quero falar com a Gideão."
                  );
                  if (tracked) e.currentTarget.href = tracked;
                  setOpen(false);
                }}
                className="mt-2 flex items-center justify-center gap-2 rounded-full bg-whatsapp px-4 py-3.5 text-base font-semibold text-white shadow-soft active:scale-95"
              >
                <MessageCircle className="h-5 w-5" strokeWidth={2.25} />
                Pedir orçamento no WhatsApp
              </a>
              <div className="mt-3 px-3 text-sm text-ink-faint">{site.phoneDisplay}</div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
