"use client";

import type { FormEvent } from "react";
import { ChevronRight, MapPin, Search } from "lucide-react";
import { useSearch } from "@/lib/search-context";
import { site } from "@/lib/site";

export function MobileSearchBar() {
  const { query, setQuery } = useSearch();
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    site.address.mapsQuery
  )}`;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    document.getElementById("ofertas")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="border-b border-line bg-paper sm:hidden">
      <form onSubmit={handleSubmit} className="px-4 pb-2.5 pt-2.5">
        <div className="flex items-center gap-2 rounded-full border border-line bg-paper-soft pl-4 pr-1.5">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Digite sua busca aqui"
            aria-label="Buscar produtos"
            className="h-10 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint"
          />
          <button
            type="submit"
            aria-label="Buscar"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold-strong text-white transition-transform active:scale-90"
          >
            <Search className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>
      </form>

      <a
        href={mapsHref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 border-t border-line px-4 py-2 text-xs text-ink-soft"
      >
        <MapPin className="h-3.5 w-3.5 shrink-0 text-gold-strong" strokeWidth={2.25} />
        <span className="truncate">
          <span className="font-semibold text-ink">Gideão</span> {site.address.line},{" "}
          {site.address.city}
        </span>
        <ChevronRight className="ml-auto h-3.5 w-3.5 shrink-0 text-ink-faint" />
      </a>
    </div>
  );
}
