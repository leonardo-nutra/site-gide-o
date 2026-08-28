import { MessageCircle, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { WhatsAppLink } from "./WhatsAppLink";
import { site } from "@/lib/site";

const links = [
  { href: "#produtos", label: "Produtos" },
  { href: "#ofertas", label: "Ofertas" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#contato", label: "Contato" },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink text-paper-soft">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <Logo inverted />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper-soft/70">
              Pisos, tintas, torneiras, portas, janelas e materiais de
              construção com preço de atacado em Mesquita e na Baixada
              Fluminense.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-paper-soft/50">
              Navegação
            </h3>
            <ul className="mt-4 space-y-2.5">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-paper-soft/80 transition-colors hover:text-gold"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-paper-soft/50">
              Contato
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-paper-soft/80">
              <li>{site.address.line}</li>
              <li>{site.address.city}</li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gold" /> {site.phoneDisplay}
              </li>
              <li>
                <WhatsAppLink
                  message="Olá! Vim pelo site e quero falar com a Gideão."
                  className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-4 py-2 font-semibold text-white transition-colors hover:bg-whatsapp-strong"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </WhatsAppLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-paper-soft/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Gideão Atacadão da Construção. Todos os direitos reservados.</p>
          <p>Todo dia é dia de ofertas.</p>
        </div>
      </div>
    </footer>
  );
}
