import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { createBanner, deleteBanner, updateBanner } from "../actions";

export const dynamic = "force-dynamic";

const inputClass =
  "w-full rounded-lg border border-line bg-paper px-2.5 py-1.5 text-sm text-ink outline-none focus:border-gold-strong";

export default async function AdminBannersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: banners } = await supabase
    .from("banners")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <AdminShell email={user.email ?? ""}>
      <h1 className="text-xl font-display font-black text-ink">Banners</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Cadastre quantos banners quiser — eles giram automaticamente no topo
        do site, um atrás do outro. Se não tiver nenhum ativo, o espaço fica
        reservado (vazio) até você adicionar.
      </p>

      <div className="mt-6 flex flex-col gap-4">
        {(banners ?? []).map((b) => (
          <form
            key={b.id}
            action={updateBanner}
            className="grid grid-cols-2 gap-3 rounded-2xl border border-line bg-paper p-5 shadow-soft sm:grid-cols-4"
          >
            <input type="hidden" name="id" value={b.id} />

            {b.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={b.image}
                alt={b.title || "Banner"}
                className="col-span-2 h-24 w-full rounded-lg border border-line object-cover sm:col-span-4"
              />
            )}

            <label className="col-span-2 flex flex-col gap-1 sm:col-span-2">
              <span className="text-xs font-medium text-ink-faint">
                Título (só pra identificar aqui / texto alternativo)
              </span>
              <input name="title" defaultValue={b.title} className={inputClass} />
            </label>

            <label className="col-span-2 flex flex-col gap-1 sm:col-span-2">
              <span className="text-xs font-medium text-ink-faint">
                Link ao clicar (opcional)
              </span>
              <input
                name="link"
                defaultValue={b.link}
                placeholder="https://wa.me/... ou vazio"
                className={inputClass}
              />
            </label>

            <label className="col-span-2 flex flex-col gap-1 sm:col-span-3">
              <span className="text-xs font-medium text-ink-faint">URL da imagem do banner</span>
              <input name="image" defaultValue={b.image} required className={inputClass} />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-ink-faint">Ordem</span>
              <input
                name="sort_order"
                type="number"
                defaultValue={b.sort_order}
                className={inputClass}
              />
            </label>

            <label className="col-span-2 flex items-center gap-2 sm:col-span-4">
              <input type="checkbox" name="active" defaultChecked={b.active} />
              <span className="text-sm text-ink">Ativo no site</span>
            </label>

            <div className="col-span-2 flex items-center gap-2 pt-1 sm:col-span-4">
              <button
                type="submit"
                className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-paper active:scale-95"
              >
                Salvar
              </button>
              <button
                type="submit"
                formAction={deleteBanner.bind(null, b.id)}
                className="rounded-full border border-red/30 px-4 py-2 text-xs font-semibold text-red active:scale-95"
              >
                Excluir
              </button>
            </div>
          </form>
        ))}

        {(banners ?? []).length === 0 && (
          <p className="text-sm text-ink-faint">Nenhum banner cadastrado ainda.</p>
        )}
      </div>

      <div className="mt-10 rounded-2xl border border-dashed border-line p-5">
        <h2 className="font-semibold text-ink">Adicionar banner</h2>
        <p className="mt-1 text-xs text-ink-faint">
          Dica: suba a imagem em algum serviço gratuito (ex.: imgur.com) e
          cole o link direto da imagem aqui.
        </p>
        <form action={createBanner} className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <input name="title" placeholder="Título (identificação)" className={inputClass} />
          <input name="link" placeholder="Link ao clicar (opcional)" className={inputClass} />
          <input
            name="image"
            placeholder="URL da imagem"
            required
            className={`col-span-2 ${inputClass}`}
          />
          <input name="sort_order" type="number" placeholder="Ordem" className={inputClass} />
          <button
            type="submit"
            className="col-span-2 rounded-full bg-gold-strong px-4 py-2 text-xs font-semibold text-white active:scale-95 sm:col-span-4"
          >
            Adicionar
          </button>
        </form>
      </div>
    </AdminShell>
  );
}
