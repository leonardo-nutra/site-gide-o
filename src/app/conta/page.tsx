import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOutCustomer } from "./actions";

export const dynamic = "force-dynamic";

export default async function ContaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/conta/entrar");

  const name = (user.user_metadata?.full_name as string | undefined) || "";

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-5 py-16">
      <div className="rounded-2xl border border-line bg-paper p-6 shadow-lift sm:p-8">
        <h1 className="text-xl font-display font-black text-ink">
          Olá{name ? `, ${name}` : ""}!
        </h1>
        <p className="mt-1 text-sm text-ink-soft">{user.email}</p>

        <p className="mt-6 text-sm leading-relaxed text-ink-faint">
          Sua conta está pronta. Monte seu orçamento no site e envie pelo
          WhatsApp normalmente — em breve você vai poder acompanhar seus
          pedidos por aqui também.
        </p>

        <form action={signOutCustomer} className="mt-6">
          <button
            type="submit"
            className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-paper-strong active:scale-95"
          >
            Sair
          </button>
        </form>
      </div>
    </div>
  );
}
