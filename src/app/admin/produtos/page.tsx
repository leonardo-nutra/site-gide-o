import Link from "next/link";
import { requireAdmin } from "@/server/auth/admin";
import {
  PAGE_SIZE,
  PRODUCT_FILTERS,
  getDepartmentStats,
  listAdminProducts,
  type ProductFilter,
} from "@/server/catalog/admin-products.repository";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProductCreateForm } from "@/components/admin/ProductCreateForm";
import { ProductEditForm } from "@/components/admin/ProductEditForm";
import { categories } from "@/config/site";

export const dynamic = "force-dynamic";

type SearchParams = {
  depto?: string;
  filtro?: string;
  q?: string;
  pagina?: string;
};

const FILTER_LABELS: Record<ProductFilter, string> = {
  todos: "Todos",
  ativos: "Ativos",
  inativos: "Inativos",
  ofertas: "Ofertas",
  "sem-foto": "Sem foto",
  ilustrativa: "Foto ilustrativa",
};

const FILTER_COUNT_KEY = {
  todos: "total",
  ativos: "active",
  inativos: "inactive",
  ofertas: "featured",
  "sem-foto": "noPhoto",
  ilustrativa: "illustrative",
} as const;

function link(params: {
  depto?: string;
  filtro?: string;
  q?: string;
  pagina?: number;
}) {
  const query = new URLSearchParams();
  if (params.depto) query.set("depto", params.depto);
  if (params.filtro && params.filtro !== "todos")
    query.set("filtro", params.filtro);
  if (params.q) query.set("q", params.q);
  if (params.pagina && params.pagina > 1)
    query.set("pagina", String(params.pagina));
  const text = query.toString();
  return text ? `/admin/produtos?${text}` : "/admin/produtos";
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { supabase, user } = await requireAdmin();
  const params = await searchParams;

  const validDepartments = new Set(["todos", ...categories.map((c) => c.id)]);
  const depto =
    params.depto && validDepartments.has(params.depto)
      ? params.depto
      : undefined;
  const filtro = (PRODUCT_FILTERS as readonly string[]).includes(
    params.filtro ?? "",
  )
    ? (params.filtro as ProductFilter)
    : "todos";
  const search = (params.q ?? "").slice(0, 60);
  const page = Math.max(1, Number.parseInt(params.pagina ?? "1", 10) || 1);

  const stats = await getDepartmentStats(supabase);
  const departmentTitle =
    depto === "todos"
      ? "Todos os departamentos"
      : categories.find((c) => c.id === depto)?.title;

  const result = depto
    ? await listAdminProducts(supabase, {
        category: depto,
        filter: filtro,
        search,
        page,
      })
    : null;
  const totalPages = result
    ? Math.max(1, Math.ceil(result.total / PAGE_SIZE))
    : 1;

  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
      active
        ? "border-ink bg-ink text-paper"
        : "border-line bg-paper text-ink-soft hover:bg-paper-strong"
    }`;

  return (
    <AdminShell email={user.email ?? ""}>
      <h1 className="text-xl font-display font-black text-ink">Produtos</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Os produtos ficam organizados por departamento, o mesmo do menu do site.
        Escolha um para ver e editar os itens. Produtos inativos somem do site.
      </p>

      <nav aria-label="Departamentos" className="mt-5 flex flex-wrap gap-2">
        <Link href={link({})} className={chip(!depto)}>
          Visão geral
        </Link>
        <Link
          href={link({ depto: "todos" })}
          className={chip(depto === "todos")}
        >
          Todos ({stats.todos.total})
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={link({ depto: category.id })}
            className={chip(depto === category.id)}
          >
            {category.title} ({stats[category.id]?.total ?? 0})
          </Link>
        ))}
      </nav>

      {!depto && (
        <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const s = stats[category.id];
            return (
              <Link
                key={category.id}
                href={link({ depto: category.id })}
                className="rounded-2xl border border-line bg-paper p-5 shadow-soft transition-shadow hover:shadow-lift"
              >
                <p className="font-display font-black text-ink">
                  {category.title}
                </p>
                <p className="mt-1 text-3xl font-display font-black text-gold-strong">
                  {s?.total ?? 0}
                </p>
                <p className="text-xs text-ink-faint">produtos</p>
                <p className="mt-3 text-xs text-ink-soft">
                  {s?.active ?? 0} ativos
                  {s?.inactive ? ` · ${s.inactive} inativos` : ""}
                  {s?.featured ? ` · ${s.featured} em oferta` : ""}
                </p>
                {s?.noPhoto || s?.illustrative ? (
                  <p className="mt-1 text-xs font-medium text-red">
                    {s.noPhoto ? `${s.noPhoto} sem foto` : ""}
                    {s.noPhoto && s.illustrative ? " · " : ""}
                    {s.illustrative
                      ? `${s.illustrative} com foto ilustrativa`
                      : ""}
                  </p>
                ) : null}
              </Link>
            );
          })}
        </section>
      )}

      {depto && result && (
        <>
          <h2 className="mt-8 text-lg font-display font-black text-ink">
            {departmentTitle}
          </h2>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {PRODUCT_FILTERS.map((option) => {
              const count = stats[depto]?.[FILTER_COUNT_KEY[option]] ?? 0;
              return (
                <Link
                  key={option}
                  href={link({ depto, filtro: option, q: search })}
                  className={chip(filtro === option)}
                >
                  {FILTER_LABELS[option]} ({count})
                </Link>
              );
            })}
          </div>

          <form
            method="get"
            action="/admin/produtos"
            className="mt-3 flex gap-2"
          >
            <input type="hidden" name="depto" value={depto} />
            {filtro !== "todos" && (
              <input type="hidden" name="filtro" value={filtro} />
            )}
            <input
              name="q"
              defaultValue={search}
              placeholder="Buscar pelo nome ou código"
              className="w-full max-w-sm rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-gold-strong"
            />
            <button
              type="submit"
              className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-paper"
            >
              Buscar
            </button>
            {search && (
              <Link
                href={link({ depto, filtro })}
                className="self-center text-xs font-semibold text-ink-soft underline"
              >
                Limpar
              </Link>
            )}
          </form>

          <div className="mt-4">
            <ProductCreateForm
              defaultCategory={depto === "todos" ? "pisos" : depto}
            />
          </div>

          {result.failed && (
            <p className="mt-4 text-sm text-red">
              Não foi possível carregar os produtos agora.
            </p>
          )}

          <p className="mt-5 text-xs text-ink-faint">
            {result.total === 0
              ? "Nenhum produto com esses filtros."
              : `Mostrando ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, result.total)} de ${result.total}`}
          </p>

          <div className="mt-2 flex flex-col gap-3">
            {result.products.map((product) => (
              <ProductEditForm
                key={product.id}
                product={product}
                showDepartment={depto === "todos"}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <nav
              aria-label="Páginas"
              className="mt-6 flex items-center justify-between text-sm"
            >
              {page > 1 ? (
                <Link
                  href={link({ depto, filtro, q: search, pagina: page - 1 })}
                  className={chip(false)}
                >
                  ← Anterior
                </Link>
              ) : (
                <span />
              )}
              <span className="text-xs text-ink-faint">
                Página {page} de {totalPages}
              </span>
              {page < totalPages ? (
                <Link
                  href={link({ depto, filtro, q: search, pagina: page + 1 })}
                  className={chip(false)}
                >
                  Próxima →
                </Link>
              ) : (
                <span />
              )}
            </nav>
          )}
        </>
      )}
    </AdminShell>
  );
}
