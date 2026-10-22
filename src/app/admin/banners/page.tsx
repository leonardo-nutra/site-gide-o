import { requireAdmin } from "@/server/auth/admin";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminForm } from "@/components/admin/AdminForm";
import { createBanner, deleteBanner, updateBanner } from "../actions";

export const dynamic = "force-dynamic";

const inputClass =
  "w-full rounded-lg border border-line bg-paper px-2.5 py-1.5 text-sm text-ink outline-none focus:border-gold-strong";

const PLACEMENTS = [
  {
    id: "hero",
    title: "Topo",
    help: "Banner grande: a primeira coisa do site. Gira sozinho se tiver mais de um.",
  },
  {
    id: "secondary",
    title: "Faixa 1",
    help: "Banner fino, logo abaixo dos departamentos.",
  },
  {
    id: "offers",
    title: "Faixa 2",
    help: "Banner fino, logo abaixo das ofertas.",
  },
  {
    id: "duo",
    title: "Dupla",
    help: "Dois banners lado a lado, mais abaixo. Não gira: mostra os 2 primeiros ativos.",
  },
] as const;

export default async function AdminBannersPage() {
  const { supabase, user } = await requireAdmin();

  const { data: banners } = await supabase
    .from("banners")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <AdminShell email={user.email ?? ""}>
      <h1 className="text-xl font-display font-black text-ink">Banners</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Cadastre quantos banners quiser — eles giram automaticamente, um atrás
        do outro. Uma posição sem banner ativo simplesmente não aparece no site.
      </p>
      <p className="mt-1 text-xs text-ink-faint">
        <strong className="text-ink-soft">Topo:</strong> banner grande, primeira
        coisa do site. <strong className="text-ink-soft">Faixa 1:</strong>{" "}
        banner fino, logo abaixo dos departamentos.{" "}
        <strong className="text-ink-soft">Faixa 2:</strong> banner fino, logo
        abaixo das ofertas. <strong className="text-ink-soft">Dupla:</strong>{" "}
        dois banners lado a lado (um pouco mais abaixo) — não gira, mostra
        sempre os 2 primeiros ativos dessa posição.
      </p>

      {PLACEMENTS.map((placement) => {
        const group = (banners ?? []).filter(
          (b) => b.placement === placement.id,
        );
        return (
          <section key={placement.id} className="mt-8">
            <h2 className="font-display font-black text-ink">
              {placement.title}{" "}
              <span className="text-sm font-medium text-ink-faint">
                ({group.length})
              </span>
            </h2>
            <p className="mt-0.5 text-xs text-ink-faint">{placement.help}</p>
            <div className="mt-3 flex flex-col gap-4">
              {group.length === 0 && (
                <p className="text-sm text-ink-faint">
                  Nenhum banner nesta posição.
                </p>
              )}
              {group.map((b) => (
                <AdminForm
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
                    <input
                      name="title"
                      defaultValue={b.title}
                      className={inputClass}
                    />
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

                  <label className="col-span-2 flex flex-col gap-1">
                    <span className="text-xs font-medium text-ink-faint">
                      URL da imagem do banner
                    </span>
                    <input
                      name="image"
                      defaultValue={b.image}
                      required
                      className={inputClass}
                    />
                  </label>

                  <label className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-ink-faint">
                      Posição
                    </span>
                    <select
                      name="placement"
                      defaultValue={b.placement}
                      className={inputClass}
                    >
                      <option value="hero">Topo (grande)</option>
                      <option value="secondary">
                        Faixa 1 (depois dos departamentos)
                      </option>
                      <option value="offers">
                        Faixa 2 (depois das ofertas)
                      </option>
                      <option value="duo">
                        Dupla (dois banners lado a lado)
                      </option>
                    </select>
                  </label>

                  <label className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-ink-faint">
                      Ordem
                    </span>
                    <input
                      name="sort_order"
                      type="number"
                      defaultValue={b.sort_order}
                      className={inputClass}
                    />
                  </label>

                  <label className="col-span-2 flex items-center gap-2 sm:col-span-4">
                    <input
                      type="checkbox"
                      name="active"
                      defaultChecked={b.active}
                    />
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
                </AdminForm>
              ))}
            </div>
          </section>
        );
      })}

      <div className="mt-10 rounded-2xl border border-dashed border-line p-5">
        <h2 className="font-semibold text-ink">Adicionar banner</h2>
        <p className="mt-1 text-xs text-ink-faint">
          Dica: suba a imagem em algum serviço gratuito (ex.: imgur.com) e cole
          o link direto da imagem aqui.
        </p>
        <AdminForm
          action={createBanner}
          className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          <input
            name="title"
            placeholder="Título (identificação)"
            className={inputClass}
          />
          <input
            name="link"
            placeholder="Link ao clicar (opcional)"
            className={inputClass}
          />
          <input
            name="image"
            placeholder="URL da imagem"
            required
            className={`col-span-2 ${inputClass}`}
          />
          <select name="placement" defaultValue="hero" className={inputClass}>
            <option value="hero">Topo (grande)</option>
            <option value="secondary">
              Faixa 1 (depois dos departamentos)
            </option>
            <option value="offers">Faixa 2 (depois das ofertas)</option>
            <option value="duo">Dupla (dois banners lado a lado)</option>
          </select>
          <input
            name="sort_order"
            type="number"
            placeholder="Ordem"
            className={inputClass}
          />
          <button
            type="submit"
            className="col-span-2 rounded-full bg-gold-strong px-4 py-2 text-xs font-semibold text-white active:scale-95 sm:col-span-4"
          >
            Adicionar
          </button>
        </AdminForm>
      </div>
    </AdminShell>
  );
}
