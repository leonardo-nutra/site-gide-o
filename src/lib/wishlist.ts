"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "gideao-wishlist";

function readWishlist(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function writeWishlist(ids: Set<string>) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    // ignore storage failures (private browsing, quota, etc.)
  }
}

/** Per-viewer favorites list, kept in localStorage only (no account system yet). */
export function useWishlist(productId: string) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Deferred to an effect (not a lazy useState initializer) so the
    // server-rendered markup (isSaved = false) matches the client's first
    // render, avoiding a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsSaved(readWishlist().has(productId));
  }, [productId]);

  const toggle = useCallback(() => {
    const ids = readWishlist();
    if (ids.has(productId)) {
      ids.delete(productId);
    } else {
      ids.add(productId);
    }
    writeWishlist(ids);
    setIsSaved(ids.has(productId));
  }, [productId]);

  return { isSaved, toggle };
}
