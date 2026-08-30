import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { createProduct, deleteProduct, updateProduct } from "../actions";

export const dynamic = "force-dynamic";

const inputClass =
  "w-full rounded-lg border border-line bg-paper px-2.5 py-1.5 text-sm text-ink outline-none focus:border-gold-strong";

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <AdminShell email={user.email ?? ""}>
      <h1 className="text-xl font-display font-black text-ink">Produtos</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Edite preço, fotos e disponibilidade. Produtos inativos somem do site.
      </p>

      <div className="mt-6 flex flex-col gap-4">
        {(products ?? []).map((p) => (
          <form
            key={p.id}
            action={updateProduct}
            className="grid grid-cols-2 gap-3 rounded-2xl border border-line bg-paper p-5 shadow-soft sm:grid-cols-4"
          >
            <input type="hidden" name="id" value={p.id} />

            <label className="col-span-2 flex flex-col gap-1 sm:col-span-2">
              <span className="text-xs font-medium text-ink-faint">Nome</span>
              <input name="name" defaultValue={p.name} className={inputClass} />
            </label>

            <label className="col-span-2 flex flex-col gap-1 sm:col-span-2">
              <span className="text-xs font-medium text-ink-faint">Detalhe</span>
              <input name="detail" defaultValue={p.detail} className={inputClass} />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-ink-faint">Preço (R$)</span>
              <input
                name="price"
                type="number"
                step="0.01"
                defaultValue={p.price}
                className={inputClass}
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-ink-faint">Unidade</span>
              <input name="unit" defaultValue={p.unit} className={inputClass} />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-ink-faint">Ordem</span>
              <input
                name="sort_order"
                type="number"
                defaultValue={p.sort_order}
                className={inputClass}
              />
            </label>

            <label className="flex items-center gap-2 self-end pb-1.5">
              <input type="checkbox" name="active" defaultChecked={p.active} />
              <span className="text-sm text-ink">Ativo no site</span>
            </label>

            <label className="col-span-2 flex flex-col gap-1 sm:col-span-2">
              <span className="text-xs font-medium text-ink-faint">Foto do produto</span>
              <input name="image" defaultValue={p.image} className={inputClass} />
            </label>

            <label className="col-span-2 flex flex-col gap-1 sm:col-span-2">
              <span className="text-xs font-medium text-ink-faint">Foto ilustrativa (ambiente)</span>
              <input
                name="application_image"
                defaultValue={p.application_image}
                className={inputClass}
              />
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
                formAction={deleteProduct.bind(null, p.id)}
                className="rounded-full border border-red/30 px-4 py-2 text-xs font-semibold text-red active:scale-95"
              >
                Excluir
              </button>
            </div>
          </form>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-dashed border-line p-5">
        <h2 className="font-semibold text-ink">Adicionar produto</h2>
        <form action={createProduct} className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <input name="slug" placeholder="slug (ex: piso-10)" required className={inputClass} />
          <input name="name" placeholder="Nome" required className={inputClass} />
          <input name="detail" placeholder="Detalhe" className={inputClass} />
          <input name="price" type="number" step="0.01" placeholder="Preço" required className={inputClass} />
          <input name="unit" placeholder="Unidade (m², un...)" className={inputClass} />
          <input name="sort_order" type="number" placeholder="Ordem" className={inputClass} />
          <input
            name="image"
            placeholder="/images/produtos/xxx.jpg"
            className={inputClass}
          />
          <input
            name="application_image"
            placeholder="/images/ambiente/xxx.jpg"
            className={inputClass}
          />
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
