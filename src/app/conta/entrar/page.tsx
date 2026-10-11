"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PasswordInput } from "@/components/PasswordInput";

export default function EntrarPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(
        error.message.toLowerCase().includes("not confirmed")
          ? "Seu e-mail ainda não foi confirmado. Abra o link que enviamos para a sua caixa de entrada."
          : 'E-mail ou senha incorretos. Se você esqueceu a senha, use "Esqueci minha senha".',
      );
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-paper-soft px-5">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-line bg-paper p-6 shadow-lift sm:p-8"
      >
        <h1 className="text-xl font-display font-black text-ink">Entrar</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Acesse sua conta na Gideão.
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink outline-none focus:border-gold-strong"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink" htmlFor="password">
              Senha
            </label>
            <PasswordInput
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && <p className="text-sm text-red">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-full bg-gold-strong px-5 py-3 text-sm font-semibold text-white transition-transform active:scale-95 disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <p className="text-center text-sm">
            <Link
              href="/conta/esqueci-senha"
              className="font-semibold text-gold-strong underline"
            >
              Esqueci minha senha
            </Link>
          </p>

          <p className="text-center text-sm text-ink-soft">
            Ainda não tem conta?{" "}
            <Link
              href="/conta/cadastro"
              className="font-semibold text-gold-strong underline"
            >
              Cadastre-se
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
