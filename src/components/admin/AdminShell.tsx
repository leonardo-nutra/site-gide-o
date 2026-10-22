import Link from "next/link";
import {
  BarChart3,
  GalleryHorizontal,
  LogOut,
  PackageSearch,
  ShoppingCart,
  type LucideIcon,
} from "lucide-react";
import { signOut } from "@/app/admin/actions";
import type { ReactNode } from "react";

/** The admin menu, grouped by what each area is for. */
type NavItem = { href: string; label: string; Icon: LucideIcon };
const NAV_GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: "Vendas",
    items: [{ href: "/admin", label: "Pedidos", Icon: ShoppingCart }],
  },
  {
    label: "Catálogo",
    items: [
      { href: "/admin/produtos", label: "Produtos", Icon: PackageSearch },
    ],
  },
  {
    label: "Site",
    items: [
      { href: "/admin/banners", label: "Banners", Icon: GalleryHorizontal },
      { href: "/admin/analise", label: "Análise", Icon: BarChart3 },
    ],
  },
];

export function AdminShell({
  email,
  children,
}: {
  email: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-paper-soft">
      <header className="border-b border-line bg-paper px-5 py-4 sm:px-8">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-6">
            <span className="whitespace-nowrap font-display font-black text-ink">
              Gideão · Admin
            </span>
            <nav className="hidden items-center gap-5 text-sm font-medium text-ink-soft sm:flex">
              {NAV_GROUPS.map((group) => (
                <div
                  key={group.label}
                  className="flex items-center gap-3 border-l border-line pl-4 first:border-0 first:pl-0"
                >
                  <span className="text-[0.65rem] font-semibold uppercase tracking-wide text-ink-faint">
                    {group.label}
                  </span>
                  {group.items.map(({ href, label, Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-1.5 hover:text-ink"
                    >
                      <Icon className="h-4 w-4" /> {label}
                    </Link>
                  ))}
                </div>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-ink-faint sm:inline">
              {email}
            </span>
            <form action={signOut}>
              <button
                type="submit"
                className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink-soft hover:bg-paper-strong"
              >
                <LogOut className="h-3.5 w-3.5" /> Sair
              </button>
            </form>
          </div>
          <nav className="flex w-full items-center gap-4 overflow-x-auto text-sm font-medium text-ink-soft sm:hidden">
            {NAV_GROUPS.flatMap((group) => group.items).map(
              ({ href, label, Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex shrink-0 items-center gap-1.5 hover:text-ink"
                >
                  <Icon className="h-4 w-4" /> {label}
                </Link>
              ),
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8">{children}</main>
    </div>
  );
}
