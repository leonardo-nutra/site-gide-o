"use client";

import { useEffect } from "react";
import Link from "next/link";
import { site, waLink } from "@/lib/site";

/** Shown when a page crashes: a calm message and a way out instead of a blank screen. */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center px-5 py-16 text-center">
      <h1 className="text-2xl font-display font-black text-ink sm:text-3xl">
        Ops, algo deu errado
      </h1>
      <p className="mt-3 text-ink-soft">
        Não conseguimos carregar esta página agora. Tente de novo; se continuar,
        fale com a gente pelo WhatsApp que atendemos você.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-gold-strong px-6 py-3 text-sm font-semibold text-white"
        >
          Tentar de novo
        </button>
        <Link
          href="/"
          className="rounded-full border border-line px-6 py-3 text-sm font-semibold text-ink-soft"
        >
          Ir para o início
        </Link>
        <a
          href={waLink(
            "Olá! O site da Gideão deu um erro e preciso de atendimento.",
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-whatsapp px-6 py-3 text-sm font-semibold text-white"
        >
          WhatsApp {site.phoneDisplay}
        </a>
      </div>
    </main>
  );
}
