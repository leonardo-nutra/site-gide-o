"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useCustomer } from "@/lib/supabase/use-customer";

export function AccountButton({
  className = "",
  showLabel = false,
}: {
  className?: string;
  showLabel?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user } = useCustomer();

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  const name = (user?.user_metadata?.full_name as string | undefined) || "";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Minha conta"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 rounded-full text-ink transition-colors hover:bg-paper-strong ${
          showLabel ? "px-2.5 py-1.5" : "grid h-11 w-11 place-items-center"
        } ${className}`}
      >
        <User className="h-5 w-5 shrink-0 text-gold-strong" strokeWidth={2.25} />
        {showLabel && (
          <span className="text-left leading-tight">
            <span className="block text-xs text-ink-faint">
              {user ? "Bem-vindo de volta!" : "Bem-vindo!"}
            </span>
            <span className="block text-sm font-semibold text-ink">
              {user ? name || user.email : "Entrar"}
            </span>
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-line bg-paper p-4 text-left shadow-lift"
          >
            {user ? (
              <>
                <p className="text-sm font-semibold text-ink">{name || "Sua conta"}</p>
                <p className="mt-0.5 text-xs text-ink-faint">{user.email}</p>
                <Link
                  href="/conta"
                  onClick={() => setOpen(false)}
                  className="mt-3 block rounded-full border border-line px-4 py-2 text-center text-xs font-semibold text-ink transition-colors hover:bg-paper-strong"
                >
                  Minha conta
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="mt-2 w-full rounded-full px-4 py-2 text-xs font-semibold text-ink-soft transition-colors hover:bg-paper-strong"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-ink">Bem-vindo!</p>
                <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                  Entre ou cadastre-se para acompanhar seus orçamentos.
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Link
                    href="/conta/entrar"
                    onClick={() => setOpen(false)}
                    className="rounded-full bg-gold-strong px-3 py-2 text-center text-xs font-bold text-white"
                  >
                    Entrar
                  </Link>
                  <Link
                    href="/conta/cadastro"
                    onClick={() => setOpen(false)}
                    className="rounded-full border border-gold-strong px-3 py-2 text-center text-xs font-bold text-gold-strong"
                  >
                    Cadastre-se
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
