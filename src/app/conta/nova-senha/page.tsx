"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PasswordInput } from "@/components/PasswordInput";

export default function NovaSenhaPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(
        error.message.toLowerCase().includes("session")
          ? 'O link expirou. Peça um novo em "Esqueci minha senha".'
          : "Não deu para salvar a nova senha. Tente de novo.",
      );
      setLoading(false);
      return;
    }

    router.push("/conta");
    router.refresh();
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-paper-soft px-5">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-line bg-paper p-6 shadow-lift sm:p-8"
      >
        <h1 className="text-xl font-display font-black text-ink">
          Criar nova senha
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          Escolha uma senha com pelo menos 6 caracteres.
        </p>

        <div className="mt-6 flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-ink" htmlFor="password">
              Nova senha
            </label>
            <PasswordInput
              id="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          {error && <p className="text-sm text-red">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-full bg-gold-strong px-5 py-3 text-sm font-semibold text-white transition-transform active:scale-95 disabled:opacity-60"
          >
            {loading ? "Salvando..." : "Salvar nova senha"}
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
    </div>
  );
}
