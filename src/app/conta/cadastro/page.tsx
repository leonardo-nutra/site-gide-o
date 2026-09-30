"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function CadastroPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
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
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });

    if (error) {
      if (error.message.includes("already registered")) {
        setError("Esse e-mail já tem cadastro. Tente entrar.");
      } else if (error.message.includes("rate limit")) {
        setError("Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente de novo.");
      } else if (error.message.includes("invalid")) {
        setError("Esse e-mail não parece válido. Confira e tente de novo.");
      } else {
        setError("Não deu para cadastrar agora. Confira os dados e tente de novo.");
      }
      setLoading(false);
      return;
    }

    if (data.session) {
      router.push("/");
      router.refresh();
      return;
    }

    setDone(true);
    setLoading(false);
  }

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper-soft px-5">
        <div className="w-full max-w-sm rounded-2xl border border-line bg-paper p-6 text-center shadow-lift sm:p-8">
          <h1 className="text-xl font-display font-black text-ink">Quase lá!</h1>
          <p className="mt-2 text-sm text-ink-soft">
            Enviamos um link de confirmação para <strong>{email}</strong>. Confirme
            o e-mail para poder entrar.
          </p>
          <Link
            href="/conta/entrar"
            className="mt-6 inline-block rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper transition-transform active:scale-95"
          >
            Ir para o login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper-soft px-5">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-line bg-paper p-6 shadow-lift sm:p-8"
      >
        <h1 className="text-xl font-display font-black text-ink">Criar conta</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Cadastre-se para acompanhar seus orçamentos na Gideão.
        </p>

        <div className="mt-6 flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-ink" htmlFor="name">
              Nome
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink outline-none focus:border-gold-strong"
            />
          </div>
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
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink outline-none focus:border-gold-strong"
            />
          </div>

          {error && <p className="text-sm text-red">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-full bg-gold-strong px-5 py-3 text-sm font-semibold text-white transition-transform active:scale-95 disabled:opacity-60"
          >
            {loading ? "Criando conta..." : "Criar conta"}
          </button>

          <p className="text-center text-sm text-ink-soft">
            Já tem conta?{" "}
            <Link href="/conta/entrar" className="font-semibold text-gold-strong underline">
              Entrar
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
