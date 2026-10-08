"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { StaggerGroup } from "./motion/Reveal";
import { OfferCard } from "./Offers";
import { ProductModal } from "./ProductModal";
import { WhatsAppLink } from "./WhatsAppLink";
import type { Product } from "@/lib/products";
import { parsePrice } from "@/lib/cart-context";

type Sort = "relevance" | "price-asc" | "price-desc" | "name";

const fieldClass =
  "w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-gold-strong";

export function DepartmentProducts({
  products,
  departmentTitle,
  whatsappMessage,
}: {
  products: Product[];
  departmentTitle: string;
  whatsappMessage: string;
}) {
  const [selected, setSelected] = useState<Product | null>(null);
  const [sort, setSort] = useState<Sort>("relevance");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");

  const visible = useMemo(() => {
    const minValue = min === "" ? 0 : Number(min);
    const maxValue = max === "" ? Infinity : Number(max);

    const filtered = products.filter((p) => {
      const price = parsePrice(p.price);
      return price >= minValue && price <= maxValue;
    });

    if (sort === "price-asc") {
      filtered.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    } else if (sort === "price-desc") {
      filtered.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    } else if (sort === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
    }
    return filtered;
  }, [products, sort, min, max]);

  const hasFilters = sort !== "relevance" || min !== "" || max !== "";

  function clearFilters() {
    setSort("relevance");
    setMin("");
    setMax("");
  }

  if (products.length === 0) {
    return (
      <div className="mt-8 rounded-2xl border border-line bg-paper-soft px-6 py-12 text-center">
        <p className="text-ink-soft">
          Ainda não temos produtos cadastrados em {departmentTitle}. Fale com a gente pelo
          WhatsApp para consultar disponibilidade e preços.
        </p>
        <WhatsAppLink
          message={whatsappMessage}
          className="mt-5 inline-flex items-center justify-center rounded-full bg-whatsapp px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-whatsapp-strong"
        >
          Falar no WhatsApp
        </WhatsAppLink>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[17rem_1fr]">
      <aside>
        <div className="flex items-center gap-2 text-lg font-display font-black text-ink">
          <SlidersHorizontal className="h-5 w-5 text-gold-strong" strokeWidth={2.25} />
          Filtrar por
        </div>
        <div className="mt-4 flex flex-col gap-4 border-t border-line pt-4">
          <label className="text-sm font-semibold text-ink">
            Ordenar
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className={`${fieldClass} mt-1.5 font-normal`}
            >
              <option value="relevance">Relevância</option>
              <option value="price-asc">Menor preço</option>
              <option value="price-desc">Maior preço</option>
              <option value="name">Nome (A–Z)</option>
            </select>
          </label>

          <fieldset className="rounded-lg border border-line p-3">
            <legend className="px-1 text-sm font-semibold text-ink">Faixa de preço (R$)</legend>
            <div className="flex items-center gap-2">
              <input
                type="number"
                inputMode="decimal"
                min={0}
                placeholder="Mín."
                aria-label="Preço mínimo"
                value={min}
                onChange={(e) => setMin(e.target.value)}
                className={fieldClass}
              />
              <span className="text-ink-faint">–</span>
              <input
                type="number"
                inputMode="decimal"
                min={0}
                placeholder="Máx."
                aria-label="Preço máximo"
                value={max}
                onChange={(e) => setMax(e.target.value)}
                className={fieldClass}
              />
            </div>
          </fieldset>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="self-start text-sm font-semibold text-gold-strong underline underline-offset-2"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </aside>

      <div>
        <div className="rounded-lg bg-paper-strong px-4 py-3 text-sm text-ink-soft">
          <strong className="text-ink">{visible.length}</strong>{" "}
          {visible.length === 1 ? "produto" : "produtos"}
        </div>

        {visible.length === 0 ? (
          <p className="mt-10 text-center text-ink-faint">
            Nenhum produto nessa faixa de preço.{" "}
            <button
              type="button"
              onClick={clearFilters}
              className="font-semibold text-gold-strong underline underline-offset-2"
            >
              Limpar filtros
            </button>
          </p>
        ) : (
          <StaggerGroup className="mt-5 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
            {visible.map((product) => (
              <OfferCard key={product.id} offer={product} onOpen={() => setSelected(product)} />
            ))}
          </StaggerGroup>
        )}
      </div>

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
