import Image from "next/image";
import { categories } from "@/config/site";
import { formatPrice } from "@/domain/money";
import type { Tables } from "@/lib/supabase/database.types";
import { deleteProduct, updateProduct } from "@/app/admin/actions";
import { AdminForm } from "./AdminForm";
import { fileInputClass, inputClass, labelClass } from "./styles";

type Spec = { label: string; value: string };

function specsToText(specs: unknown) {
  if (!Array.isArray(specs)) return "";
  return (specs as Spec[]).map((s) => `${s.label}: ${s.value}`).join("\n");
}

function Badge({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "green" | "gray" | "orange" | "red";
}) {
  const tones = {
    green: "bg-whatsapp/15 text-whatsapp-strong",
    gray: "bg-paper-strong text-ink-soft",
    orange: "bg-gold-soft text-ink",
    red: "bg-red/10 text-red",
  };
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[0.65rem] font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

/** One product in the admin: a compact summary row that opens into the full edit form. */
export function ProductEditForm({
  product: p,
  showDepartment = false,
}: {
  product: Tables<"products">;
  showDepartment?: boolean;
}) {
  const department =
    categories.find((c) => c.id === p.category)?.title ?? p.category;
  const photo = p.image || "/images/sem-foto.svg";

  return (
    <details className="group rounded-2xl border border-line bg-paper shadow-soft open:shadow-lift">
      <summary className="flex cursor-pointer list-none items-center gap-3 p-3 sm:gap-4 sm:p-4 [&::-webkit-details-marker]:hidden">
        <Image
          src={photo}
          alt=""
          width={56}
          height={56}
          sizes="56px"
          className="h-14 w-14 shrink-0 rounded-lg border border-line bg-paper-strong object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink">{p.name}</p>
          <p className="mt-0.5 truncate text-xs text-ink-faint">
            {showDepartment && (
              <span className="font-medium text-ink-soft">{department} · </span>
            )}
            R$ {formatPrice(Number(p.price))} /{p.unit}
            {p.detail ? ` · ${p.detail}` : ""}
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1">
            <Badge tone={p.active ? "green" : "gray"}>
              {p.active ? "Ativo" : "Inativo"}
            </Badge>
            {p.featured && <Badge tone="orange">Oferta</Badge>}
            {!p.image && <Badge tone="red">Sem foto</Badge>}
            {p.image.includes("/ilustrativa/") && (
              <Badge tone="orange">Foto ilustrativa</Badge>
            )}
          </div>
        </div>
        <span className="shrink-0 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink-soft group-open:bg-ink group-open:text-paper">
          <span className="group-open:hidden">Editar</span>
          <span className="hidden group-open:inline">Fechar</span>
        </span>
      </summary>

      <AdminForm
        action={updateProduct}
        className="grid grid-cols-2 gap-3 border-t border-line p-4 sm:grid-cols-4 sm:p-5"
      >
        <input type="hidden" name="id" value={p.id} />
        <input type="hidden" name="current_image" value={p.image} />
        <input
          type="hidden"
          name="current_application_image"
          value={p.application_image}
        />
        <input type="hidden" name="current_video" value={p.video} />

        <label className="col-span-2 flex flex-col gap-1 sm:col-span-2">
          <span className={labelClass}>Nome</span>
          <input name="name" defaultValue={p.name} className={inputClass} />
        </label>

        <label className="col-span-2 flex flex-col gap-1 sm:col-span-2">
          <span className={labelClass}>Detalhe</span>
          <input name="detail" defaultValue={p.detail} className={inputClass} />
        </label>

        <label className="flex flex-col gap-1">
          <span className={labelClass}>Aba / Departamento</span>
          <select
            name="category"
            defaultValue={p.category}
            className={inputClass}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.title}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className={labelClass}>Preço (R$)</span>
          <input
            name="price"
            type="number"
            step="0.01"
            defaultValue={p.price}
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className={labelClass}>Unidade</span>
          <input name="unit" defaultValue={p.unit} className={inputClass} />
        </label>

        <label className="flex flex-col gap-1">
          <span className={labelClass}>Ordem</span>
          <input
            name="sort_order"
            type="number"
            defaultValue={p.sort_order}
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className={labelClass}>Material</span>
          <input
            name="material"
            defaultValue={p.material}
            placeholder="Cerâmico, Porcelanato..."
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className={labelClass}>Medida</span>
          <input
            name="measure"
            defaultValue={p.measure}
            placeholder="60x60 cm"
            className={inputClass}
          />
        </label>

        <label className="flex items-center gap-2 self-end pb-1.5">
          <input type="checkbox" name="active" defaultChecked={p.active} />
          <span className="text-sm text-ink">Ativo no site</span>
        </label>

        <label className="flex items-center gap-2 self-end pb-1.5">
          <input type="checkbox" name="featured" defaultChecked={p.featured} />
          <span className="text-sm text-ink">Oferta na tela inicial</span>
        </label>

        <label className="col-span-2 flex flex-col gap-1 sm:col-span-2">
          <span className={labelClass}>Foto do produto</span>
          <input
            name="image"
            type="file"
            accept="image/*"
            className={fileInputClass}
          />
          {p.image && (
            <a
              href={p.image}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate text-[0.7rem] text-ink-faint underline"
            >
              Foto atual
            </a>
          )}
        </label>

        <label className="col-span-2 flex flex-col gap-1 sm:col-span-2">
          <span className={labelClass}>Foto ilustrativa (ambiente)</span>
          <input
            name="application_image"
            type="file"
            accept="image/*"
            className={fileInputClass}
          />
          {p.application_image && (
            <a
              href={p.application_image}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate text-[0.7rem] text-ink-faint underline"
            >
              Foto atual
            </a>
          )}
        </label>

        <label className="col-span-2 flex flex-col gap-1 sm:col-span-2">
          <span className={labelClass}>Vídeo do produto (opcional)</span>
          <input
            name="video"
            type="file"
            accept="video/*"
            className={fileInputClass}
          />
          {p.video && (
            <a
              href={p.video}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate text-[0.7rem] text-ink-faint underline"
            >
              Vídeo atual
            </a>
          )}
        </label>

        <label className="col-span-2 flex flex-col gap-1 sm:col-span-4">
          <span className={labelClass}>
            Especificações (uma por linha, formato &quot;Rótulo: Valor&quot;)
          </span>
          <textarea
            name="specs"
            rows={4}
            defaultValue={specsToText(p.specs)}
            placeholder={
              "Dimensões: 75x75 cm\nAcabamento: Polido\nCor: Bege claro"
            }
            className={`${inputClass} resize-y font-mono text-xs`}
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
      </AdminForm>
    </details>
  );
}
