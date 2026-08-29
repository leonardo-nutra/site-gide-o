"use client";

import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import { Reveal } from "./motion/Reveal";
import { WhatsAppLink } from "./WhatsAppLink";
import { site } from "@/lib/site";

export function Contact() {
  const mapsSrc = `https://maps.google.com/maps?q=${encodeURIComponent(
    site.address.mapsQuery
  )}&output=embed`;
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    site.address.mapsQuery
  )}`;

  return (
    <section id="contato" className="bg-paper py-10 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-gold-strong">
            Venha nos visitar
          </p>
          <h2 className="mt-3 text-2xl font-display font-black tracking-tight text-ink sm:text-4xl">
            Fale com a gente ou passe na loja
          </h2>
        </Reveal>

        <div className="mt-8 sm:mt-12 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal className="flex flex-col gap-4">
            <div className="flex items-start gap-4 rounded-2xl border border-line bg-paper-soft p-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-paper text-gold-strong shadow-soft">
                <MapPin className="h-5 w-5" strokeWidth={2.25} />
              </span>
              <div>
                <h3 className="font-semibold text-ink">Endereço</h3>
                <p className="mt-0.5 text-sm text-ink-soft">
                  {site.address.line}
                  <br />
                  {site.address.city}
                </p>
                <a
                  href={mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm font-semibold text-gold-strong hover:underline"
                >
                  Ver rota no mapa →
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-line bg-paper-soft p-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-paper text-gold-strong shadow-soft">
                <Phone className="h-5 w-5" strokeWidth={2.25} />
              </span>
              <div>
                <h3 className="font-semibold text-ink">Telefone / WhatsApp</h3>
                <p className="mt-0.5 text-sm text-ink-soft">{site.phoneDisplay}</p>
                <WhatsAppLink
                  message="Olá! Vim pelo site e quero falar com a Gideão."
                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-whatsapp-strong hover:underline"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Chamar no WhatsApp
                </WhatsAppLink>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-line bg-paper-soft p-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-paper text-gold-strong shadow-soft">
                <Clock className="h-5 w-5" strokeWidth={2.25} />
              </span>
              <div>
                <h3 className="font-semibold text-ink">Horário de atendimento</h3>
                <dl className="mt-0.5 space-y-0.5 text-sm text-ink-soft">
                  {site.hours.map((h) => (
                    <div key={h.label} className="flex gap-2">
                      <dt>{h.label}:</dt>
                      <dd className="font-medium text-ink">{h.value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-2 text-xs text-ink-faint">
                  Confirme horários especiais pelo WhatsApp.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="overflow-hidden rounded-2xl border border-line shadow-soft">
            <iframe
              title="Localização da Gideão Atacadão da Construção no mapa"
              src={mapsSrc}
              className="h-[360px] w-full lg:h-full lg:min-h-[420px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
