"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/conta/nova-senha`,
    });

    setLoading(false);

    if (error) {
      setError(
        error.message.includes("rate limit")
          ? "Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente de novo."
          : "Não deu para enviar o e-mail agora. Confira o endereço e tente de novo.",
      );
      return;
    }

    setSent(true);
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-paper-soft px-5">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-paper p-6 shadow-lift sm:p-8">
        <h1 className="text-xl font-display font-black text-ink">
          Esqueci minha senha
        </h1>

        {sent ? (
          <>
            <p className="mt-3 text-sm text-ink-soft">
              Se existir uma conta com <strong>{email}</strong>, enviamos um
              link para criar uma nova senha. Confira a caixa de entrada e o
              spam.
            </p>
            <Link
              href="/conta/entrar"
              className="mt-6 block rounded-full bg-gold-strong px-5 py-3 text-center text-sm font-semibold text-white"
            >
              Voltar para o login
            </Link>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="mt-1">
            <p className="text-sm text-ink-soft">
              Digite seu e-mail e enviaremos um link para criar uma nova senha.
            </p>

            <div className="mt-6 flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-ink" htmlFor="email">
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink outline-none focus:border-gold-strong"
                />
              </div>

              {error && <p className="text-sm text-red">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 rounded-full bg-gold-strong px-5 py-3 text-sm font-semibold text-white transition-transform active:scale-95 disabled:opacity-60"
              >
                {loading ? "Enviando..." : "Enviar link"}
              </button>

              <p className="text-center text-sm text-ink-soft">
                <Link
                  href="/conta/entrar"
                  className="font-semibold text-gold-strong underline"
                >
                  Voltar para o login
                </Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
