"use client";

import { useEffect } from "react";

/** Friendly error screen for the admin: shows what went wrong instead of a blank page. */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[admin]", error);
  }, [error]);

  // Messages from our own validation are written to be shown; anything else is generic.
  const known =
    error.name === "ActionError" || error.message.includes("ActionError");
  const message = known ? error.message : "Algo deu errado. Tente de novo.";

  return (
    <div className="mx-auto max-w-lg px-5 py-16 text-center">
      <h1 className="text-xl font-display font-black text-ink">
        Não foi possível concluir
      </h1>
      <p className="mt-3 text-sm text-ink-soft">{message}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-full bg-gold-strong px-5 py-2.5 text-sm font-semibold text-white"
      >
        Voltar e tentar de novo
      </button>
    </div>
  );
}
