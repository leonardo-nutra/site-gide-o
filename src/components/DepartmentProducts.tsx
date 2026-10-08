"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";
import { StaggerGroup } from "./motion/Reveal";
import { OfferCard } from "./Offers";
import { ProductModal } from "./ProductModal";
import { WhatsAppLink } from "./WhatsAppLink";
import type { Product } from "@/lib/products";
import { parsePrice } from "@/lib/cart-context";

type Sort = "relevance" | "price-asc" | "price-desc" | "name";
type Selected = Record<string, string[]>;
type Facet = { label: string; values: { value: string; count: number }[] };

const fieldClass =
  "w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-gold-strong";

/**
 * Builds one filter group per spec label found in this department's products
 * (e.g. Acabamento, Cor, Dimensões), so every department automatically gets
 * the filters that fit its own kind of product. Groups with a single value
 * are dropped because they could not narrow anything down.
 */
function buildFacets(products: Product[]): Facet[] {
  const byLabel = new Map<string, Map<string, number>>();

  for (const product of products) {
    const counted = new Set<string>();
    for (const spec of product.specs) {
      const label = spec.label.trim();
      const value = spec.value.trim();
      if (!label || !value) continue;

      const key = `${label}\u0000${value}`;
      if (counted.has(key)) continue;
      counted.add(key);

      const values = byLabel.get(label) ?? new Map<string, number>();
      values.set(value, (values.get(value) ?? 0) + 1);
      byLabel.set(label, values);
    }
  }

  return [...byLabel.entries()]
    .map(([label, values]) => ({
      label,
      values: [...values.entries()]
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value, "pt-BR")),
    }))
    .filter((facet) => facet.values.length >= 2);
}

function matchesSelection(product: Product, selected: Selected) {
  return Object.entries(selected).every(
    ([label, values]) =>
      values.length === 0 ||
      product.specs.some((s) => s.label.trim() === label && values.includes(s.value.trim()))
  );
}

export function DepartmentProducts({
  products,
  departmentTitle,
  whatsappMessage,
}: {
  products: Product[];
  departmentTitle: string;
  whatsappMessage: string;
}) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sort, setSort] = useState<Sort>("relevance");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [selected, setSelected] = useState<Selected>({});
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [filtersOpen, setFiltersOpen] = useState(false);

  const facets = useMemo(() => buildFacets(products), [products]);

  const visible = useMemo(() => {
    const minValue = min === "" ? 0 : Number(min);
    const maxValue = max === "" ? Infinity : Number(max);

    const filtered = products.filter((p) => {
      const price = parsePrice(p.price);
      return price >= minValue && price <= maxValue && matchesSelection(p, selected);
    });

    if (sort === "price-asc") {
      filtered.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    } else if (sort === "price-desc") {
      filtered.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    } else if (sort === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
    }
    return filtered;
  }, [products, sort, min, max, selected]);

  const selectedCount = Object.values(selected).reduce((sum, values) => sum + values.length, 0);
  const hasFilters = sort !== "relevance" || min !== "" || max !== "" || selectedCount > 0;

  function toggleValue(label: string, value: string) {
    setSelected((current) => {
      const values = current[label] ?? [];
      const next = values.includes(value) ? values.filter((v) => v !== value) : [...values, value];
      return { ...current, [label]: next };
    });
  }

  function toggleGroup(label: string, index: number) {
    setOpenGroups((current) => ({ ...current, [label]: !(current[label] ?? index < 3) }));
  }

  function clearFilters() {
    setSort("relevance");
    setMin("");
    setMax("");
    setSelected({});
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
    <div className="mt-8 grid gap-6 lg:grid-cols-[17rem_1fr] lg:gap-8">
      <aside>
        <button
          type="button"
          onClick={() => setFiltersOpen((v) => !v)}
          aria-expanded={filtersOpen}
          className="flex w-full items-center justify-between rounded-lg border border-line px-4 py-3 text-base font-display font-black text-ink lg:hidden"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-gold-strong" strokeWidth={2.25} />
            Filtrar por{selectedCount > 0 ? ` (${selectedCount})` : ""}
          </span>
          <ChevronDown
            className={`h-5 w-5 text-gold-strong transition-transform ${filtersOpen ? "rotate-180" : ""}`}
          />
        </button>

        <div className={`${filtersOpen ? "block" : "hidden"} lg:block`}>
          <div className="hidden items-center gap-2 text-lg font-display font-black text-ink lg:flex">
            <SlidersHorizontal className="h-5 w-5 text-gold-strong" strokeWidth={2.25} />
            Filtrar por
          </div>

          <div className="mt-4 flex flex-col gap-4 lg:border-t lg:border-line lg:pt-4">
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

            {facets.map((facet, index) => {
              const isOpen = openGroups[facet.label] ?? index < 3;
              const chosen = selected[facet.label] ?? [];

              return (
                <div key={facet.label} className="rounded-lg border border-line">
                  <button
                    type="button"
                    onClick={() => toggleGroup(facet.label, index)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-bold text-ink"
                  >
                    <span>
                      {facet.label}
                      {chosen.length > 0 && (
                        <span className="ml-1.5 text-gold-strong">({chosen.length})</span>
                      )}
                    </span>
                    <ChevronUp
                      className={`h-4 w-4 shrink-0 text-gold-strong transition-transform ${
                        isOpen ? "" : "rotate-180"
                      }`}
                      strokeWidth={2.5}
                    />
                  </button>

                  {isOpen && (
                    <div className="max-h-56 space-y-2.5 overflow-y-auto px-4 pb-4">
                      {facet.values.map(({ value, count }) => (
                        <label
                          key={value}
                          className="flex cursor-pointer items-start gap-2.5 text-sm text-ink-soft"
                        >
                          <input
                            type="checkbox"
                            checked={chosen.includes(value)}
                            onChange={() => toggleValue(facet.label, value)}
                            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-gold-strong"
                          />
                          <span>
                            {value} <span className="text-ink-faint">({count})</span>
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

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
        </div>
      </aside>

      <div>
        <div className="rounded-lg bg-paper-strong px-4 py-3 text-sm text-ink-soft">
          <strong className="text-ink">{visible.length}</strong>{" "}
          {visible.length === 1 ? "produto" : "produtos"}
        </div>

        {visible.length === 0 ? (
          <p className="mt-10 text-center text-ink-faint">
            Nenhum produto com esses filtros.{" "}
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
              <OfferCard
                key={product.id}
                offer={product}
                onOpen={() => setSelectedProduct(product)}
              />
            ))}
          </StaggerGroup>
        )}
      </div>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
}
