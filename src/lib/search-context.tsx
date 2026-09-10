"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type SearchContextValue = {
  query: string;
  setQuery: (query: string) => void;
  /** Selected department/tab id from `categories` in `@/lib/site`, or null for "all". */
  category: string | null;
  setCategory: (category: string | null) => void;
};

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  return (
    <SearchContext.Provider value={{ query, setQuery, category, setCategory }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used within a SearchProvider");
  return ctx;
}
