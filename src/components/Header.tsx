"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Menu, MessageCircle, Search, User, X } from "lucide-react";
import { Logo } from "./Logo";
import { CartButton } from "./CartButton";
import { AccountButton } from "./AccountButton";
import { LocationIndicator } from "./LocationIndicator";
import { ThemeToggle } from "./ThemeToggle";
import { WhatsAppLink } from "./WhatsAppLink";
import { site, waLink } from "@/lib/site";
import { trackWhatsAppClick } from "@/lib/tracking";
import { useSearch } from "@/lib/search-context";

const navLinks = [
  { href: "#ofertas", label: "Ofertas" },
  { href: "#contato", label: "Contato" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { query, setQuery } = useSearch();

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();
    document.getElementById("ofertas")?.scrollIntoView({ behavior: "smooth" });
  }

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
      <div aria-hidden className="h-1 w-full bg-gold-strong" />

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

      <div className="mx-auto hidden h-20 max-w-6xl items-center justify-between gap-4 px-5 sm:flex sm:px-8">
        <a href="#topo" className="shrink-0">
          <Logo />
        </a>

        <form
          onSubmit={handleSearchSubmit}
          className="hidden max-w-2xl flex-1 items-center gap-2 rounded-full border border-line bg-paper-soft pl-4 pr-1.5 lg:flex"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Digite sua busca aqui"
            aria-label="Buscar produtos"
            className="h-10 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint"
          />
          <button
            type="submit"
            aria-label="Buscar"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold-strong text-white transition-transform active:scale-90"
          >
            <Search className="h-3.5 w-3.5" strokeWidth={2.5} />
          </button>
        </form>

        <div className="flex shrink-0 items-center gap-1 sm:gap-3">
          <AccountButton className="hidden lg:flex" showLabel />
          <AccountButton className="lg:hidden" />
          <LocationIndicator className="hidden lg:flex" />
          <ThemeToggle />
          <CartButton variant="solid" className="h-14 w-14 lg:h-[3.75rem] lg:w-[3.75rem]" />
        </div>
      </div>

      <div className="hidden bg-ink sm:block">
        <div className="mx-auto flex h-11 max-w-6xl items-center gap-4 px-5 text-sm text-paper-soft/80 sm:px-8">
          <button
            type="button"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-7 w-7 place-items-center text-paper transition-colors hover:text-gold"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
          <a
            href="#ofertas"
            className="whitespace-nowrap font-semibold text-paper transition-colors hover:text-gold"
          >
            Departamentos
          </a>
          <span className="text-paper-soft/30">|</span>
          <a href="#ofertas" className="whitespace-nowrap transition-colors hover:text-gold">
            Ofertas
          </a>
          <span className="text-paper-soft/30">|</span>
          <a href="#contato" className="whitespace-nowrap transition-colors hover:text-gold">
            Contato
          </a>
          <span className="text-paper-soft/30">|</span>
          <Link href="/privacidade" className="whitespace-nowrap transition-colors hover:text-gold">
            Política de Privacidade
          </Link>

          <WhatsAppLink
            message="Olá! Quero pedir um orçamento com a Gideão."
            className="ml-auto flex items-center gap-1.5 whitespace-nowrap"
          >
            <MessageCircle className="h-4 w-4 text-gold" strokeWidth={2.5} />
            <span className="font-semibold text-paper">Orçamento</span>
            <span className="underline underline-offset-2">Clique aqui</span>
          </WhatsAppLink>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-b border-line bg-paper"
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
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-paper-soft px-3 py-3 text-sm text-ink-soft">
                <User className="h-4 w-4 shrink-0 text-gold-strong" strokeWidth={2.25} />
                Login de clientes chegando em breve
              </div>
              <div className="mt-3 px-3 text-sm text-ink-faint">{site.phoneDisplay}</div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
