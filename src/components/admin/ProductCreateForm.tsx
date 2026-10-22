import { categories } from "@/config/site";
import { createProduct } from "@/app/admin/actions";
import { AdminForm } from "./AdminForm";
import { fileInputClass, inputClass, labelClass } from "./styles";

/** "Adicionar produto": collapsed by default; opens already set to the department being viewed. */
export function ProductCreateForm({
  defaultCategory,
}: {
  defaultCategory: string;
}) {
  return (
    <details className="group rounded-2xl border border-dashed border-line bg-paper p-4 sm:p-5">
      <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-ink [&::-webkit-details-marker]:hidden">
        <span>+ Adicionar produto</span>
        <span className="text-xs font-medium text-ink-faint group-open:hidden">
          abrir
        </span>
        <span className="hidden text-xs font-medium text-ink-faint group-open:inline">
          fechar
        </span>
      </summary>

      <AdminForm
        action={createProduct}
        className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        <input
          name="slug"
          placeholder="código (ex: piso-10)"
          required
          className={inputClass}
        />
        <input name="name" placeholder="Nome" required className={inputClass} />
        <input name="detail" placeholder="Detalhe" className={inputClass} />
        <select
          name="category"
          defaultValue={defaultCategory}
          className={inputClass}
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.title}
            </option>
          ))}
        </select>
        <input
          name="price"
          type="number"
          step="0.01"
          placeholder="Preço"
          required
          className={inputClass}
        />
        <input
          name="unit"
          placeholder="Unidade (m², un...)"
          className={inputClass}
        />
        <input
          name="material"
          placeholder="Material (ex: Cerâmico)"
          className={inputClass}
        />
        <input
          name="measure"
          placeholder="Medida (ex: 60x60 cm)"
          className={inputClass}
        />
        <input
          name="sort_order"
          type="number"
          placeholder="Ordem"
          className={inputClass}
        />
        <label className="flex items-center gap-2">
          <input type="checkbox" name="featured" />
          <span className="text-sm text-ink">Oferta na tela inicial</span>
        </label>

        <label className="col-span-2 flex flex-col gap-1 sm:col-span-2">
          <span className={labelClass}>Foto do produto</span>
          <input
            name="image"
            type="file"
            accept="image/*"
            required
            className={fileInputClass}
          />
        </label>
        <label className="col-span-2 flex flex-col gap-1 sm:col-span-2">
          <span className={labelClass}>Foto ilustrativa (ambiente)</span>
          <input
            name="application_image"
            type="file"
            accept="image/*"
            className={fileInputClass}
          />
        </label>
        <label className="col-span-2 flex flex-col gap-1 sm:col-span-4">
          <span className={labelClass}>Vídeo do produto (opcional)</span>
          <input
            name="video"
            type="file"
            accept="video/*"
            className={fileInputClass}
          />
        </label>

        <textarea
          name="specs"
          rows={3}
          placeholder={
            "Dimensões: 75x75 cm\nAcabamento: Polido\nCor: Bege claro"
          }
          className={`col-span-2 sm:col-span-4 ${inputClass} resize-y font-mono text-xs`}
        />
        <button
          type="submit"
          className="col-span-2 rounded-full bg-gold-strong px-4 py-2 text-xs font-semibold text-white active:scale-95 sm:col-span-4"
        >
          Adicionar
        </button>
      </AdminForm>
    </details>
  );
}
