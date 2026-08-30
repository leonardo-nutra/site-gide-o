import Link from "next/link";
import { LogOut, PackageSearch, ShoppingCart } from "lucide-react";
import { signOut } from "@/app/admin/actions";
import type { ReactNode } from "react";

export function AdminShell({ email, children }: { email: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-paper-soft">
      <header className="border-b border-line bg-paper px-5 py-4 sm:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="font-display font-black text-ink">Gideão · Admin</span>
            <nav className="flex items-center gap-4 text-sm font-medium text-ink-soft">
              <Link href="/admin" className="flex items-center gap-1.5 hover:text-ink">
                <ShoppingCart className="h-4 w-4" /> Pedidos
              </Link>
              <Link href="/admin/produtos" className="flex items-center gap-1.5 hover:text-ink">
                <PackageSearch className="h-4 w-4" /> Produtos
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-ink-faint sm:inline">{email}</span>
            <form action={signOut}>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink-soft hover:bg-paper-strong"
              >
                <LogOut className="h-3.5 w-3.5" /> Sair
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8">{children}</main>
    </div>
  );
}
